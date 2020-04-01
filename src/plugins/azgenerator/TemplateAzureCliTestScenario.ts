﻿/*---------------------------------------------------------------------------------------------
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

    class_info.push("class " + model.Extension_NameClass + "ScenarioTest(ScenarioTest):");
    class_info.push("");
    //initiates.push("    @ResourceGroupPreparer(name_prefix='cli_test_" + model.Extension_NameUnderscored + "')");
    // initiates.push("    def test_" + model.Extension_NameUnderscored + "(self, resource_group):");
    initiates.push("");

    // walk through test config
    if (config) {
        for (var ci = 0; ci < config.length; ci++) {
            let exampleId: string = config[ci].name;
            let functionName: string = ToFunctionName(config[ci]);
            if (exampleId) {
                let disabled: string = config[ci].disabled ? "# " : "";
                steps.push("# EXAMPLE: " + exampleId);
                steps.push("@try_manual");
                steps.push(`def ${functionName}(test):`);
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
                body.push(`        ${functionName}(self)`)
            }
            else if (functionName) {
                steps.push("@try_manual");
                steps.push(`def ${functionName}(test):`);
                steps.push("    pass");
                steps.push("");
                steps.push("");
                body.push(`        ${functionName}(self)`)
            }
        }
    }
    body.push("")

    let subscription_id = model.GetSubscriptionKey();
    if (subscription_id) {
        initiates.push("        self.kwargs.update({");
        initiates.push(`            '${subscription_id}': self.get_subscription_id()`);
        initiates.push("        })");
        initiates.push("");
    }

    let imports: string[] = [];
    let decorators: string[] = [];
    InitiateDependencies(model, imports, decorators, initiates);

    let output = head.concat(imports, steps, class_info, decorators, initiates, body);
    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });
    return header.getLines().concat(output);
}

function InitiateDependencies(model: CodeModelAz, imports: string[], decorators: string[], initiates: string[]) {
    let decorated = [];
    let internalObjects = [];
    let hasResourceGroup = false;
    for (let entity of (model.GetPreparerEntities() as PreparerEntity[])) {
        if (!entity.info.name) {
            internalObjects.push([entity.info.class_name, getResourceKey(entity.info.class_name, entity.object_name), entity.info.createdObjectNames.indexOf(entity.object_name) >= 0]);
            continue;
        }

        // create preparers for outside dependency
        let line: string = `    @${entity.info.name}(name_prefix='cli_test_${model.Extension_NameUnderscored}_${entity.object_name}'[:9], key='${getResourceKey(entity.info.class_name, entity.object_name)}'`;
        for (let i = 0; i < entity.depend_parameter_values.length; i++) {
            line += `, ${entity.info.depend_parameters[i]}='${entity.depend_parameter_values[i]}'`
        }
        line += ")";
        ToMultiLine(line, decorators);
        if (decorated.indexOf(entity.info.name) < 0) {
            if (entity.info.name == 'ResourceGroupPreparer') {
                imports.push(`from azure.cli.testsdk import ${entity.info.name}`);
                hasResourceGroup = true;
            }
            else {
                imports.push(`from .preparers import ${entity.info.name}`);
            }
            decorated.push(entity.info.name);
        }
    }
    if (hasResourceGroup) {
        initiates.unshift("    def test_" + model.Extension_NameUnderscored + "(self, resource_group):");
    }
    else {
        initiates.unshift("    def test_" + model.Extension_NameUnderscored + "(self):");
    }

    // randomize name for internal resources
    if (internalObjects.length > 0) {
        initiates.push("        self.kwargs.update({");
        for (let [class_name, kargs_key, hasCreateExample] of internalObjects) {
            if (hasCreateExample)
                ToMultiLine(`            '${kargs_key}': self.create_random_name(prefix='cli_test_${ToSnakeCase(class_name)}'[:9], length=24),`, initiates);
            else
                initiates.push(`            '${kargs_key}': '${kargs_key}',`);   // keep the original name in example if there is no create example in the test-scenario
        }
        initiates.push("        })");
        initiates.push("");
    }
}

function ToFunctionName(step: any): string {
    let ret = undefined;
    if (step.name)
        ret = "step_" + step.name;
    else if (step.function)
        ret = step.function;
    if (!ret)   return undefined;

    let funcname = "";
    var letterNumber = /^[0-9a-zA-Z]+$/;
    ret = (ret as string).toLowerCase();
    for (let i=0;i<ret.length;i++) {
        funcname += ret[i].match(letterNumber)? ret[i]: '_';
    }
    return funcname;
}