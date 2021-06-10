/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { CliTestStep } from './CliTestStep';
import { ToMultiLine, Capitalize, isNullOrUndefined } from '../../../utils/helper';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import { CodeGenConstants, PathConstants, AzConfiguration } from '../../../utils/models';

export class CliTestScenario extends TemplateBase {
    public configValue: any;
    private groupName: string;
    private header: HeaderGenerator = new HeaderGenerator();
    private scenarios: string[] = [];

    constructor(model: CodeModelAz, testFilename: string, configValue: any, groupName: string) {
        super(model);
        const { configHandler } = model.GetHandler();
        this.relativePath = path.join(
            configHandler.AzextFolder,
            PathConstants.testFolder,
            PathConstants.latestFolder,
            testFilename,
        );
        this.configValue = configValue;
        this.groupName = groupName;
        this.skip = true;
    }

    public async fullGeneration(): Promise<string[]> {
        this.StartGenerateAzureCliTestScenario();
        if (this.model.GetHandler().exampleHandler.GetResourcePool().hasTestResourceScenario) {
            for (const scenarioName of Object.getOwnPropertyNames(this.configValue)) {
                this.GenerateTestResourceScenario(
                    this.model,
                    this.configValue[scenarioName],
                    scenarioName,
                );
            }
        } else {
            for (const scenarioName of Object.getOwnPropertyNames(this.configValue)) {
                this.GenerateAzureCliTestScenario(
                    this.model,
                    this.configValue[scenarioName],
                    scenarioName,
                );
            }
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
        const { configHandler, exampleHandler } = model.GetHandler();
        const commandParams = exampleHandler.GatherInternalResource();
        config.unshift({ function: `setup_${scenarioName}` });
        config.push({ function: `cleanup_${scenarioName}` });

        const classInfo: string[] = [];
        const initiates: string[] = [];

        classInfo.push(`# Test class for ${scenarioName}`);
        classInfo.push('@try_manual');
        const testClassName = Capitalize(this.groupName) + scenarioName + 'Test';
        classInfo.push('class ' + testClassName + '(ScenarioTest):');

        const subscriptionId = exampleHandler.GetSubscriptionKey();
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
            exampleHandler.GetResourcePool().clearExampleParams();

            // go through the examples to generate steps
            for (let ci = 0; ci < config.length; ci++) {
                const exampleId: string = config[ci].name;
                let functionName: string = CliTestStep.ToFunctionName(config[ci]);
                if (exampleId) {
                    const disabled: string = config[ci].disabled ? '# ' : '';
                    // find example by name

                    const [exampleCmd, commandExample] = exampleHandler.FindExampleById(
                        exampleId,
                        commandParams,
                        minimum,
                    );
                    if (exampleCmd && exampleCmd.length > 0) {
                        functionName = CliTestStep.ToFunctionName(
                            { name: commandExample.Id },
                            exampleCmd[0],
                        );
                        const checks = exampleHandler.GetExampleChecks(commandExample);
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
                                if (!jsonAdded && !disabled && check.indexOf('json.loads') >= 0) {
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
                        steps.push('    pass');
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
        if (configHandler.GenMinTest) {
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
        if (configHandler.GenMinTest) {
            this.scenarios.push(...buildTestcase(testCaseName, true));
        }
    }

    private GenerateTestResourceScenario(model: CodeModelAz, config: any, scenarioName: string) {
        const exampleHandler = model.GetHandler().exampleHandler;
        const commandParams = exampleHandler.GatherInternalResource();
        config.unshift({ function: `setup_${scenarioName}` });
        config.push({ function: `cleanup_${scenarioName}` });

        const classInfo: string[] = [];
        const initiates: string[] = [];

        classInfo.push(`# Test class for ${scenarioName}`);
        classInfo.push('@try_manual');
        const testClassName = Capitalize(this.groupName) + scenarioName + 'Test';
        classInfo.push('class ' + testClassName + '(ScenarioTest):');

        const decorators: string[] = [];
        const resourcePool = exampleHandler.GetResourcePool();
        const testLocation =
            AzConfiguration.getValue(CodeGenConstants.az)[CodeGenConstants.testLocation] ||
            'westus';
        const scenarioVariables = resourcePool.getTestResourceVariables(config);
        const kwargs = {};
        for (const v of scenarioVariables) {
            if (v === 'location') {
                kwargs[v] = `'${testLocation}'`;
            }
            if (v === 'subscriptionId') {
                kwargs[v] = 'self.get_subscription_id()';
            }
            if (v === 'resourceGroupName') {
                decorators.push(
                    `    @ResourceGroupPreparer(name_prefix='clitest', key='resourceGroupName', location='${testLocation}')`,
                );
                this.header.addFromImport('azure.cli.testsdk', ['ResourceGroupPreparer']);
            }
        }
        if (Object.keys(kwargs).length > 0) {
            initiates.push('        self.kwargs.update({');
            for (const k of Object.keys(kwargs)) {
                initiates.push(`            '${k}': ${kwargs[k]},`);
            }
            initiates.push('        })');
            initiates.push('');
        }

        let jsonAdded = false;

        const funcScenario: string[] = [];
        const steps: string[] = [];
        funcScenario.push(`# Testcase: ${scenarioName}`);
        funcScenario.push('@try_manual');
        funcScenario.push(...ToMultiLine(`def call_${scenarioName.toLowerCase()}(test):`));

        function buildSenario(template: CliTestScenario, outputFunc: string[]) {
            resourcePool.clearExampleParams();

            // go through the examples to generate steps
            for (let ci = 0; ci < config.length; ci++) {
                const exampleId: string = config[ci].name;
                let functionName: string = CliTestStep.ToFunctionName(config[ci]);
                if (exampleId) {
                    const disabled: string = config[ci].disabled ? '# ' : '';
                    // find example by name

                    const [normalCmd, commandExample] = exampleHandler.FindExampleById(
                        exampleId,
                        commandParams,
                        false,
                        config[ci].step,
                    );
                    let exampleCmd = normalCmd;
                    if (
                        exampleCmd.length == 0 &&
                        !isNullOrUndefined(config[ci].step) &&
                        !isNullOrUndefined(config[ci].method)
                    ) {
                        // The command for this example is not generated in current autorest running.
                        exampleCmd = resourcePool.genAzRestCall(
                            config[ci].step,
                            config[ci].method,
                            scenarioVariables,
                        );
                    } else {
                        // The command for this example is generated in current autorest running.
                        // regenerate functionName with the az commandName
                        if (exampleCmd.length > 0)
                            functionName = CliTestStep.ToFunctionName(
                                { name: commandExample.Id },
                                exampleCmd[0],
                            );
                    }
                    if (exampleCmd && exampleCmd.length > 0) {
                        const checks = exampleHandler.GetExampleChecks(commandExample);
                        if (checks.length > 0) {
                            outputFunc.push(
                                ...ToMultiLine(`    ${disabled}${functionName}(test, checks=[`),
                            );
                            for (const check of checks) {
                                ToMultiLine('    ' + disabled + '    ' + check, outputFunc);
                                if (!jsonAdded && !disabled && check.indexOf('json.loads') >= 0) {
                                    template.header.addImport('json');
                                    jsonAdded = true;
                                }
                            }
                            outputFunc.push(`    ${disabled}])`);
                        } else {
                            outputFunc.push(...ToMultiLine(`    ${functionName}(test, checks=[])`));
                        }
                        template.header.addFromImport('.swagger_steps', [functionName]);
                        template.skip = false;
                    } else {
                        outputFunc.push(...ToMultiLine(`    # STEP NOT FOUND: ${exampleId}`));
                    }
                } else {
                    steps.push(`# Env ${functionName}`);
                    steps.push('@try_manual');
                    steps.push(...ToMultiLine(`def ${functionName}(test):`));
                    if (functionName.startsWith('setup_')) {
                        steps.push(...resourcePool.setupWithArmTemplate());
                    } else {
                        steps.push('    pass');
                    }
                    steps.push('');
                    steps.push('');
                    outputFunc.push(...ToMultiLine(`    ${functionName}(test)`));
                }
            }
            outputFunc.push('');
            outputFunc.push('');
        }
        buildSenario(this, funcScenario);
        classInfo.push('    def __init__(self, *args, **kwargs):');
        classInfo.push(`        super(${testClassName}, self).__init__(*args, **kwargs)`);
        classInfo.push(...initiates);
        classInfo.push('');

        function buildTestcase(testcaseName: string) {
            const ret = [...decorators];
            let funcLine = '    def test_' + testcaseName + '(self';
            funcLine += '):';
            ToMultiLine(funcLine, ret);
            ret.push(`        call_${scenarioName.toLowerCase()}(self)`);
            ret.push('        calc_coverage(__file__)');
            ret.push('        raise_if()');
            ret.push('');
            return ret;
        }
        const testCaseName = this.groupName + '_' + scenarioName;
        this.scenarios.push(...steps.concat(funcScenario, classInfo, buildTestcase(testCaseName)));
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
