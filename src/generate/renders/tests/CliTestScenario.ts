/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { CodeModelAz, CommandExample } from '../../CodeModelAz';
import { CliTestStep } from './CliTestStep';
import { ToMultiLine, Capitalize } from '../../../utils/helper';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import { CodeGenConstants, PathConstants } from '../../../utils/models';

export class CliTestScenario extends TemplateBase {
    constructor(model: CodeModelAz, testFilename: string, configValue: any, groupName: string) {
        super(model);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(
                PathConstants.testFolder,
                PathConstants.latestFolder,
                testFilename,
            );
        } else {
            this.relativePath = path.join(
                model.AzextFolder,
                PathConstants.testFolder,
                PathConstants.latestFolder,
                testFilename,
            );
        }
        this.configValue = configValue;
        this.groupName = groupName;
        this.skip = true;
    }

    public configValue: any;
    private groupName: string;

    private header: HeaderGenerator = new HeaderGenerator();
    private scenarios: string[] = [];

    public async fullGeneration(): Promise<string[]> {
        this.StartGenerateAzureCliTestScenario();
        for (const scenarioName of Object.getOwnPropertyNames(this.configValue)) {
            this.GenerateAzureCliTestScenario(
                this.model,
                this.configValue[scenarioName],
                scenarioName,
            );
        }
        return this.EndGenerateAzureCliTestScenario();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    private StartGenerateAzureCliTestScenario() {
        this.header.addImport('os');
        this.header.addFromImport('azure.cli.testsdk', ['ScenarioTest']);
        this.scenarios.push('');
        this.scenarios.push('');
        this.scenarios.push(
            "TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))",
        );
        this.scenarios.push('');
        this.scenarios.push('');
    }

    private GenerateAzureCliTestScenario(model: CodeModelAz, config: any, scenarioName: string) {
        const commandParams = model.GatherInternalResource();
        config.unshift({ function: `setup_${scenarioName}` });
        config.push({ function: `cleanup_${scenarioName}` });

        const classInfo: string[] = [];
        const initiates: string[] = [];

        classInfo.push(`# Test class for ${scenarioName}`);
        classInfo.push('@try_manual');
        const testClassName = Capitalize(this.groupName) + scenarioName + 'Test';
        classInfo.push('class ' + testClassName + '(ScenarioTest):');
        classInfo.push('');

        const subscriptionId = model.GetSubscriptionKey();
        if (subscriptionId) {
            initiates.push('        self.kwargs.update({');
            initiates.push(`            '${subscriptionId}': self.get_subscription_id()`);
            initiates.push('        })');
            initiates.push('');
        }

        const decorators: string[] = [];
        const parameterNames = CliTestStep.InitiateDependencies(
            model,
            this.header,
            decorators,
            initiates,
        );
        let jsonAdded = false;

        const funcScenario: string[] = [];
        const funcMinScenario: string[] = [];
        const steps: string[] = [];
        funcScenario.push(`# Testcase: ${scenarioName}`);
        funcScenario.push('@try_manual');
        funcScenario.push(
            ...ToMultiLine(
                `def call_${scenarioName.toLowerCase()}(test${CliTestStep.parameterLine(
                    parameterNames,
                )}):`,
            ),
        );

        function buildSenario(template: CliTestScenario, outputFunc: string[], minimum: boolean) {
            model.GetResourcePool().clearExampleParams();

            // go through the examples to generate steps
            for (let ci = 0; ci < config.length; ci++) {
                const exampleId: string = config[ci].name;
                let functionName: string = CliTestStep.ToFunctionName(config[ci]);
                if (exampleId) {
                    const disabled: string = config[ci].disabled ? '# ' : '';
                    // find example by name
                    let found = false;
                    const examples: CommandExample[] = [];
                    let exampleIdx = -1;
                    for (const exampleCmd of model.FindExampleById(
                        exampleId,
                        commandParams,
                        examples,
                        minimum,
                        config[ci].step,
                    )) {
                        exampleIdx += 1;
                        if (exampleCmd && exampleCmd.length > 0) {
                            found = true;
                            const checks = model.GetExampleChecks(examples[exampleIdx]);
                            functionName = CliTestStep.ToFunctionName(
                                { name: examples[exampleIdx].Id },
                                exampleCmd[0],
                            );
                            if (minimum) functionName += '_min';
                            if (checks.length > 0) {
                                outputFunc.push(
                                    ...ToMultiLine(
                                        `    ${disabled}${functionName}(test${CliTestStep.parameterLine(
                                            parameterNames,
                                        )}, checks=[`,
                                    ),
                                );
                                for (const check of checks) {
                                    ToMultiLine('    ' + disabled + '    ' + check, outputFunc);
                                    if (
                                        !jsonAdded &&
                                        !disabled &&
                                        check.indexOf('json.loads') >= 0
                                    ) {
                                        template.header.addImport('json');
                                        jsonAdded = true;
                                    }
                                }
                                outputFunc.push(`    ${disabled}])`);
                            } else {
                                outputFunc.push(
                                    ...ToMultiLine(
                                        `    ${functionName}(test${CliTestStep.parameterLine(
                                            parameterNames,
                                        )}, checks=[])`,
                                    ),
                                );
                            }
                        }
                    }
                    if (found) {
                        template.header.addFromImport('.example_steps', [functionName]);
                        template.skip = false;
                    } else {
                        outputFunc.push(...ToMultiLine(`    # STEP NOT FOUND: ${exampleId}`));
                    }
                } else {
                    if (!minimum) {
                        steps.push(`# Env ${functionName}`);
                        steps.push('@try_manual');
                        steps.push(
                            ...ToMultiLine(
                                `def ${functionName}(test${CliTestStep.parameterLine(
                                    parameterNames,
                                )}):`,
                            ),
                        );
                        if (
                            functionName.startsWith('setup_') &&
                            model.GetResourcePool().hasTestResourceScenario
                        ) {
                            steps.push(...model.GetResourcePool().setupWithArmTemplate());
                        } else {
                            steps.push('    pass');
                        }
                        steps.push('');
                        steps.push('');
                    }
                    outputFunc.push(
                        ...ToMultiLine(
                            `    ${functionName}(test${CliTestStep.parameterLine(parameterNames)})`,
                        ),
                    );
                }
            }
            outputFunc.push('');
            outputFunc.push('');
        }
        buildSenario(this, funcScenario, false);
        if (model.GenMinTest) {
            funcMinScenario.push('@try_manual');
            funcMinScenario.push(
                ...ToMultiLine(
                    `def call_${scenarioName.toLowerCase()}_min(test${CliTestStep.parameterLine(
                        parameterNames,
                    )}):`,
                ),
            );
            buildSenario(this, funcMinScenario, true);
        }
        classInfo.push('    def __init__(self, *args, **kwargs):');
        classInfo.push(`        super(${testClassName}, self).__init__(*args, **kwargs)`);
        classInfo.push(...initiates);
        classInfo.push('');
        classInfo.push('');

        function buildTestcase(testcaseName: string, minimum: boolean) {
            const ret = [...decorators];
            if (minimum) testcaseName += '_min';
            let funcLine = '    def test_' + testcaseName + '(self';
            for (const parameterName of parameterNames) {
                funcLine += `, ${parameterName}`;
            }
            funcLine += '):';
            ToMultiLine(funcLine, ret);
            let _scenarioName = scenarioName;
            if (minimum) _scenarioName += '_min';
            ret.push(
                `        call_${_scenarioName.toLowerCase()}(self${CliTestStep.parameterLine(
                    parameterNames,
                )})`,
            );
            ret.push('        calc_coverage(__file__)');
            ret.push('        raise_if()');
            ret.push('');
            ret.push('');
            return ret;
        }
        const testCaseName = this.groupName + '_' + scenarioName;
        this.scenarios.push(
            ...steps.concat(
                funcScenario,
                funcMinScenario,
                classInfo,
                buildTestcase(testCaseName, false),
            ),
        );
        if (model.GenMinTest) {
            this.scenarios.push(...buildTestcase(testCaseName, true));
        }
    }

    private EndGenerateAzureCliTestScenario(): string[] {
        this.header.addFromImport('..', ['try_manual', 'raise_if', 'calc_coverage']);
        this.scenarios.forEach((element) => {
            if (element.length > CodeGenConstants.PYLINT_MAX_CODE_LENGTH + 1) {
                this.header.disableLineTooLong = true;
            }
        });
        return this.header.getLines().concat(this.scenarios);
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
