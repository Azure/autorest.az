/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { PreparerEntity, getResourceKey } from "./ScenarioTool"
import { ToSnakeCase, ToMultiLine } from '../../utils/helper';
import { HeaderGenerator } from "./Header";

export function GenerateAzureCliTestScenario(model: CodeModelAz): string[] {
    let class_info: string[] = [];
    let initiates: string[] = [];
    let body: string[] = [];
    
    model.GatherInternalResource();
    let config: any = model.Extension_TestScenario;

    let header: HeaderGenerator = new HeaderGenerator();
    var head: string[] = [];
    head.push("");
    head.push("import os");
    head.push("import unittest");
    head.push("");
    head.push("from azure_devtools.scenario_tests import AllowLargeResponse");
    head.push("from azure.cli.testsdk import ScenarioTest");
    //head.push("from .preparers import (VirtualNetworkPreparer, VnetSubnetPreparer)");
    class_info.push("");
    class_info.push("");
    class_info.push("TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))");
    class_info.push("");
    class_info.push("");
    class_info.push("class " + model.Extension_NameClass + "ScenarioTest(ScenarioTest):");
    class_info.push("");
    //initiates.push("    @ResourceGroupPreparer(name_prefix='cli_test_" + model.Extension_NameUnderscored + "')");
    // initiates.push("    def test_" + model.Extension_NameUnderscored + "(self, resource_group):");

    //initiates.push("");
    //initiates.push("        self.kwargs.update({");
    //initiates.push("            'name': 'test1'");
    //initiates.push("        })");
    initiates.push("");

    let has_example = false;
    // walk through test config
    if (config) {
        for (var ci = 0; ci < config.length; ci++) {
            let exampleId: string = config[ci].name;
            let disabled: string = config[ci].disabled ? "# " : "";
            // find example by name

            let found = false;
            for (let exampleCmd of model.FindExampleById(config[ci].name)) {
                if (exampleCmd && exampleCmd.length > 0) {
                    found = true;
                    body.push("        # EXAMPLE: " + config[ci].name);
                    for (let idx = 0; idx < exampleCmd.length; idx++) {
                        let prefix: string = "        " + disabled + ((idx == 0) ? "self.cmd('" : "         '");
                        let postfix: string = (idx < exampleCmd.length - 1) ? " '" : "',";

                        // body.push(prefix + exampleCmd[idx] + postfix);
                        ToMultiLine(prefix + exampleCmd[idx] + postfix, body);
                    }
                    body.push("        " + disabled + "         checks=[])");
                    body.push("");
                    has_example = true;
                }
            }
            if (!found) {
                body.push("        # EXAMPLE NOT FOUND: " + config[ci].name);
                body.push("");
            }
        }
    }
    if (!has_example) {
        body.push("        pass")
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
    InitiateDependencies(model, imports, decorators, initiates);

    let output = head.concat(imports, class_info, decorators, initiates, body);
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
            internalObjects.push([entity.info.class_name, getResourceKey(entity.info.class_name, entity.object_name), entity.info.createdObjectNames.indexOf(entity.object_name)>=0]);
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