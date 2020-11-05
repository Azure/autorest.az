/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import { CodeModelAz, CommandExample } from "../../CodeModelAz"
import { CliTestStep } from "./CliTestStep"
import { ToMultiLine, Capitalize } from '../../../../utils/helper';
import { HeaderGenerator } from "../../Header";
import { TemplateBase } from "../TemplateBase";
import { PathConstants } from "../../../models";


export class CliTestScenario extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean, testFilename: string, configValue:any, groupName: string) {
        super(model, isDebugMode);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.testFolder, PathConstants.latestFolder, testFilename);
        }
        else {
            this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.testFolder, PathConstants.latestFolder, testFilename);
        }
        this.configValue = configValue;
        this.groupName = groupName;
    }

    public configValue : any;
    private groupName: string;

    private header: HeaderGenerator = new HeaderGenerator();
    private scenarios: string[] = [];

    public async fullGeneration(): Promise<string[]> {
        this.StartGenerateAzureCliTestScenario();
        for (let scenarioName of Object.getOwnPropertyNames(this.configValue))
            this.GenerateAzureCliTestScenario(this.model,this.configValue[scenarioName], scenarioName);
        return this.EndGenerateAzureCliTestScenario();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    private StartGenerateAzureCliTestScenario() {
        this.header.addImport("os");
        this.header.addFromImport("azure.cli.testsdk", ["ScenarioTest"]);
        this.scenarios.push("");
        this.scenarios.push("");
        this.scenarios.push("TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))");
        this.scenarios.push("");
        this.scenarios.push("");
    }

    private GenerateAzureCliTestScenario(model: CodeModelAz, config:any, scenarioName: string) {
        let commandParams = model.GatherInternalResource();
        config.unshift({ function: `setup_${scenarioName}` });
        config.push({ function: `cleanup_${scenarioName}` });

        let class_info: string[] = [];
        let initiates: string[] = [];
        let body: string[] = [];

        class_info.push("# Test class for ${scenarioName}");
        class_info.push("@try_manual");
        class_info.push("class " + Capitalize(this.groupName) + scenarioName + "Test(ScenarioTest):");
        class_info.push("");
        initiates.push("");

        let subscription_id = model.GetSubscriptionKey();
        if (subscription_id) {
            initiates.push("        self.kwargs.update({");
            initiates.push(`            '${subscription_id}': self.get_subscription_id()`);
            initiates.push("        })");
            initiates.push("");
        }

        let decorators: string[] = [];
        let parameterNames = CliTestStep.InitiateDependencies(model, this.header, decorators, initiates);
        let jsonAdded = false;
        
        let funcScenario: string[] = [];
        let steps: string[] = [];
        funcScenario.push(`# Testcase: ${scenarioName}`);
        funcScenario.push("@try_manual");
        funcScenario.push(...ToMultiLine(`def call_${scenarioName.toLowerCase()}(test${CliTestStep.parameterLine(parameterNames)}):`));
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
                                    this.header.addImport("json");
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
                    this.header.addFromImport(".example_steps", [functionName]);
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
        body.push(`        call_${scenarioName.toLowerCase()}(self${CliTestStep.parameterLine(parameterNames)})`);
        body.push(`        calc_coverage(__file__)`);
        body.push(`        raise_if()`);
        body.push("");
        body.push("");
        this.scenarios.push(...steps.concat(funcScenario, class_info, decorators, initiates, body));
    }

    private EndGenerateAzureCliTestScenario(): string[] {
        this.header.addFromImport("..", ["try_manual", "raise_if", "calc_coverage"]);
        this.scenarios.forEach(element => {
            if (element.length > 120) this.header.disableLineTooLong = true;
        });
        return this.header.getLines().concat(this.scenarios);
    }
}
