/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import { CodeModelAz, CommandExample } from "../../CodeModelAz"
import { PreparerEntity, getResourceKey } from "./ScenarioTool"
import { CliTestStep } from "./CliTestStep"
import { ToMultiLine, deepCopy } from '../../../../utils/helper';
import { HeaderGenerator } from "../../Header";
import { TemplateBase } from "../TemplateBase";
import { PathConstants } from "../../../models";


export class CliTestScenario extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean, testFilename: string, configValue:any) {
        super(model, isDebugMode);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.testFolder, PathConstants.latestFolder, testFilename);
        }
        else {
            this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.testFolder, PathConstants.latestFolder, testFilename);
        }
        this.configValue = configValue;
    }

    public configValue : any;

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliTestScenario(this.model,this.configValue);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    private GenerateAzureCliTestScenario(model: CodeModelAz, config:any): string[] {
        var head: string[] = [];
        let steps: string[] = [];
        let class_info: string[] = [];
        let initiates: string[] = [];
        let body: string[] = [];
        let funcScenario: string[] = [];

        let commandParams = model.GatherInternalResource();
        // let config: any = deepCopy(model.Extension_TestScenario);
        config.unshift({ function: "setup" });
        config.push({ function: "cleanup" });

        let header: HeaderGenerator = new HeaderGenerator();

        header.addImport("os");
        head.push("from azure.cli.testsdk import ScenarioTest");
        steps.push("");
        steps.push("");
        steps.push("TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))");
        steps.push("");
        steps.push("");

        class_info.push("@try_manual");
        class_info.push("class " + model.Extension_NameClass + "ScenarioTest(ScenarioTest):");
        class_info.push("");
        initiates.push("");

        let subscription_id = model.GetSubscriptionKey();
        if (subscription_id) {
            initiates.push("        self.kwargs.update({");
            initiates.push(`            '${subscription_id}': self.get_subscription_id()`);
            initiates.push("        })");
            initiates.push("");
        }

        let imports: string[] = [];
        let decorators: string[] = [];
        let parameterNames = CliTestStep.InitiateDependencies(model, imports, decorators, initiates);
        let jsonAdded = false;

        funcScenario.push("# Testcase");
        funcScenario.push("@try_manual");
        funcScenario.push(...ToMultiLine(`def call_scenario(test${CliTestStep.parameterLine(parameterNames)}):`));
        model.GetResourcePool().clearExampleParams();

        // go through the examples to generate steps
        for (var ci = 0; ci < config.length; ci++) {
            let exampleId: string = config[ci].name;
            let functionName: string = CliTestStep.ToFunctionName(config[ci]);
            if (exampleId) {
                let disabled: string = config[ci].disabled ? "# " : "";
                // find example by name
                let found = false;
                let examples: CommandExample[] = [];
                let exampleIdx = 0;
                for (let exampleCmd of model.FindExampleById(exampleId, commandParams, examples)) {
                    if (exampleCmd && exampleCmd.length > 0) {
                        found = true;
                        let checks = model.GetExampleChecks(examples[exampleIdx++]);
                        if (checks.length > 0) {
                            funcScenario.push(...ToMultiLine(`    ${disabled}${functionName}(test${CliTestStep.parameterLine(parameterNames)}, checks=[`));
                            for (let check of checks) {
                                ToMultiLine("    " + disabled + "    " + check, funcScenario);
                                if (!jsonAdded && !disabled && check.indexOf("json.loads") >= 0) {
                                    header.addImport("json");
                                    jsonAdded = true;
                                }
                            }
                            funcScenario.push(`    ${disabled}])`);
                        }
                        else {
                            funcScenario.push(...ToMultiLine(`    ${functionName}(test${CliTestStep.parameterLine(parameterNames)}, checks=[])`));
                        }
                    }
                }
                if (found) {
                    head.push(`from example_steps import ${functionName}`);
                }
                else {
                    funcScenario.push(...ToMultiLine(`    # STEP NOT FOUND: ${exampleId}`));
                }
            }
            else {
                steps.push(`# Env ${functionName}`);
                steps.push("@try_manual");
                steps.push(...ToMultiLine(`def ${functionName}(test${CliTestStep.parameterLine(parameterNames)}):`));
                steps.push("    pass");
                steps.push("");
                steps.push("");
                funcScenario.push(...ToMultiLine(`    ${functionName}(test${CliTestStep.parameterLine(parameterNames)})`));
            }   
        }
        funcScenario.push("");
        funcScenario.push("");
        body.push(`        call_scenario(self${CliTestStep.parameterLine(parameterNames)})`);
        body.push(`        calc_coverage(__file__)`);
        body.push(`        raise_if()`);
        body.push("");

        head.push("from .. import try_manual, raise_if, calc_coverage");
        let output = head.concat(imports, steps, funcScenario, class_info, decorators, initiates, body);
        output.forEach(element => {
            if (element.length > 120) header.disableLineTooLong = true;
        });
        return header.getLines().concat(output);
    }
}
