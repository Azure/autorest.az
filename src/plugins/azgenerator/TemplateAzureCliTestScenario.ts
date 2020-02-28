/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliTestScenario(model: CodeModelAz): string[] {
    let output: string[] = [];
    let head: string[] = [];
    let body: string[] = [];
    let config: any = model.Extension_TestScenario;

    head.push("# --------------------------------------------------------------------------------------------");
    head.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    head.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    head.push("# --------------------------------------------------------------------------------------------");
    head.push("");
    head.push("import os");
    head.push("import unittest");
    head.push("");
    head.push("from azure_devtools.scenario_tests import AllowLargeResponse");
    head.push("from azure.cli.testsdk import ScenarioTest");
    head.push("from .preparers import (VirtualNetworkPreparer, VnetSubnetPreparer)");
    output.push("");
    output.push("");
    output.push("TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))");
    output.push("");
    output.push("");
    output.push("class " + model.Extension_NameClass + "ScenarioTest(ScenarioTest):");
    output.push("");
    //output.push("    @ResourceGroupPreparer(name_prefix='cli_test_" + model.Extension_NameUnderscored + "')");
    body.push("    def test_" + model.Extension_NameUnderscored + "(self, resource_group):");

    //output.push("");
    //output.push("        self.kwargs.update({");
    //output.push("            'name': 'test1'");
    //output.push("        })");
    body.push("");

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
                    for (let idx = 0; idx < exampleCmd.length; idx++) {
                        let prefix: string = "        " + disabled + ((idx == 0) ? "self.cmd('" : "         '");
                        let postfix: string = (idx < exampleCmd.length - 1) ? " '" : "',";

                        body.push(prefix + exampleCmd[idx] + postfix);
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

    let imports: string[] = [];
    let decorators: string[] = [];
    model.FormatPreparers(imports, decorators);

    return head.concat(imports, output, decorators, body);
}

