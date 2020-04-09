/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { PreparerEntity, getResourceKey } from "./ScenarioTool"
import { ToSnakeCase, ToMultiLine, deepCopy } from '../../utils/helper';
import { HeaderGenerator } from "./Header";
import { HttpWithBodyRequest } from "@azure-tools/codemodel";

export function GenerateAzureCliTestScenario(model: CodeModelAz): string[] {
    var head: string[] = [];
    let steps: string[] = [];
    let class_info: string[] = [];
    let initiates: string[] = [];
    let body: string[] = [];
    let funcScenario: string[] = [];

    model.GatherInternalResource();
    let config: any = deepCopy(model.Extension_TestScenario);
    config.unshift({ function: "setup" });
    config.push({ function: "cleanup" });

    let header: HeaderGenerator = new HeaderGenerator();

    head.push("");
    head.push("import os");
    head.push("import unittest");
    head.push("");
    head.push("from azure_devtools.scenario_tests import AllowLargeResponse");
    head.push("from azure.cli.testsdk import ScenarioTest");
    head.push("from .. import try_manual");
    //head.push("from .preparers import (VirtualNetworkPreparer, VnetSubnetPreparer)");
    steps.push("");
    steps.push("");
    steps.push("TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))");
    steps.push("");
    steps.push("");

    class_info.push("@try_manual");
    class_info.push("class " + model.Extension_NameClass + "ScenarioTest(ScenarioTest):");
    class_info.push("");
    //initiates.push("    @ResourceGroupPreparer(name_prefix='cli_test_" + model.Extension_NameUnderscored + "')");
    // initiates.push("    def test_" + model.Extension_NameUnderscored + "(self, resource_group):");
    initiates.push("");

    // go through the examples to recognize resources
    for (var ci = 0; ci < config.length; ci++) {
        let exampleId: string = config[ci].name;
        if (exampleId) {
            model.FindExampleById(exampleId);
        }
    }

    let subscription_id = model.GetSubscriptionKey();
    if (subscription_id) {
        initiates.push("        self.kwargs.update({");
        initiates.push(`            '${subscription_id}': self.get_subscription_id()`);
        initiates.push("        })");
        initiates.push("");
    }

    let imports: string[] = [];
    let decorators: string[] = [];
    let parameterNames = InitiateDependencies(model, imports, decorators, initiates);

    function parameterLine() {
        let ret = "";
        for (let name of parameterNames) {
            ret += `, ${name}`;
        }
        return ret;
    }

    funcScenario.push("@try_manual");
    funcScenario.push(...ToMultiLine(`def call_scenario(test${parameterLine()}):`));

    // go through the examples to generate steps
    for (var ci = 0; ci < config.length; ci++) {
        let exampleId: string = config[ci].name;
        let functionName: string = ToFunctionName(config[ci]);
        if (exampleId) {
            let disabled: string = config[ci].disabled ? "# " : "";
            steps.push("# EXAMPLE: " + exampleId);
            steps.push("@try_manual");
            steps.push(...ToMultiLine(`def ${functionName}(test${parameterLine()}):`));
            // find example by name
            let found = false;
            for (let exampleCmd of model.FindExampleById(exampleId)) {
                if (exampleCmd && exampleCmd.length > 0) {
                    found = true;
                    for (let idx = 0; idx < exampleCmd.length; idx++) {
                        let prefix: string = "    " + disabled + ((idx == 0) ? "test.cmd('" : "         '");
                        let postfix: string = (idx < exampleCmd.length - 1) ? " '" : "',";
                        ToMultiLine(prefix + exampleCmd[idx] + postfix, steps);
                    }
                    steps.push("    " + disabled + "         checks=[])");
                }
            }
            if (!found) {
                steps.push("    # EXAMPLE NOT FOUND!");
                steps.push("    pass");
            }
            steps.push("");
            steps.push("");
            funcScenario.push(...ToMultiLine(`    ${functionName}(test${parameterLine()})`));
        }
        else if (functionName) {
            steps.push("@try_manual");
            steps.push(...ToMultiLine(`def ${functionName}(test${parameterLine()}):`));
            steps.push("    pass");
            steps.push("");
            steps.push("");
            funcScenario.push(...ToMultiLine(`    ${functionName}(test${parameterLine()})`));
        }
    }
    funcScenario.push("");
    funcScenario.push("");
    body.push(`        call_scenario(self${parameterLine()})`);
    body.push("");

    let output = head.concat(imports, steps, funcScenario, class_info, decorators, initiates, body);
    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });
    return header.getLines().concat(output);
}

function InitiateDependencies(model: CodeModelAz, imports: string[], decorators: string[], initiates: string[]): string[] {
    let decorated = [];
    let internalObjects = [];
    let parameterNames = [];
    for (let entity of (model.GetPreparerEntities() as PreparerEntity[])) {
        if (!entity.info.name) {
            internalObjects.push([entity.info.class_name, getResourceKey(entity.info.class_name, entity.object_name), entity.info.createdObjectNames.indexOf(entity.object_name) >= 0]);
            continue;
        }

        // create preparers for outside dependency
        let line: string = `    @${entity.info.name}(name_prefix='clitest${model.Extension_NameUnderscored}_${entity.object_name}'[:7], key='${getResourceKey(entity.info.class_name, entity.object_name)}'`;
        for (let i = 0; i < entity.depend_parameter_values.length; i++) {
            line += `, ${entity.info.depend_parameters[i]}='${entity.depend_parameter_values[i]}'`
        }
        if (entity.info.name == 'ResourceGroupPreparer') {
            let parameterName = getResourceKey(entity.info.class_name, entity.object_name);
            line += `, parameter_name='${parameterName}'`;
            parameterNames.push(parameterName);
        }
        line += ")";
        ToMultiLine(line, decorators);
        if (decorated.indexOf(entity.info.name) < 0) {
            if (entity.info.name == 'ResourceGroupPreparer') {
                imports.push(`from azure.cli.testsdk import ${entity.info.name}`);
            }
            else if (entity.info.name == 'StorageAccountPreparer') {
                imports.push(`from azure.cli.testsdk import ${entity.info.name}`);
            } else {
                imports.push(`from .preparers import ${entity.info.name}`);
            }
            decorated.push(entity.info.name);
        }
    }
    let funcLine = "    def test_" + model.Extension_NameUnderscored + "(self";
    for (let parameterName of parameterNames) {
        funcLine += `, ${parameterName}`;
    }
    funcLine += "):";
    initiates.unshift(...ToMultiLine(funcLine));

    // randomize name for internal resources
    if (internalObjects.length > 0) {
        initiates.push("        self.kwargs.update({");
        for (let [class_name, kargs_key, hasCreateExample] of internalObjects) {
            if (hasCreateExample)
                ToMultiLine(`            '${kargs_key}': self.create_random_name(prefix='clitest${ToSnakeCase(class_name)}'[:7], length=24),`, initiates);
            else
                initiates.push(`            '${kargs_key}': '${kargs_key}',`);   // keep the original name in example if there is no create example in the test-scenario
        }
        initiates.push("        })");
        initiates.push("");
    }
    return parameterNames;
}

function ToFunctionName(step: any): string {
    let ret = undefined;
    if (step.name)
        ret = "step_" + step.name;
    else if (step.function)
        ret = step.function;
    if (!ret) return undefined;

    let funcname = "";
    var letterNumber = /^[0-9a-zA-Z]+$/;
    ret = (ret as string).toLowerCase();
    for (let i = 0; i < ret.length; i++) {
        funcname += ret[i].match(letterNumber) ? ret[i] : '_';
    }
    return funcname;
}