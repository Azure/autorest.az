/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { PreparerEntity, getResourceKey } from './ScenarioTool';
import { ToMultiLine, deepCopy, isNullOrUndefined } from '../../../utils/helper';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import { CodeGenConstants, PathConstants, AzConfiguration } from '../../../utils/models';
import { CommandExample } from '../../codemodel/Example';

let usePreparers: Set<string>, shortToLongName, funcNames, allSteps, stepBuff: Record<string, any>;

function initVars() {
    usePreparers = new Set<string>();
    shortToLongName = {};
    funcNames = {};
    allSteps = [];
    stepBuff = {};
}

export function NeedPreparers(): Set<string> {
    return usePreparers;
}

export class CliTestStep extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        const { configHandler } = model.GetHandler();
        this.relativePath = path.join(
            configHandler.AzextFolder,
            PathConstants.testFolder,
            PathConstants.latestFolder,
            PathConstants.testStepFile,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliTestStep(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    private GenerateAzureCliTestStep(model: CodeModelAz): string[] {
        const { extensionHandler, configHandler, exampleHandler } = model.GetHandler();
        initVars();
        const steps: string[] = [];
        steps.push('');
        steps.push('');
        steps.push('from .. import try_manual');
        steps.push('');

        const commandParams = exampleHandler.GatherInternalResource();
        let config: any = [];
        if (exampleHandler.GetResourcePool().hasTestResourceScenario) {
            for (const g in exampleHandler.Example_TestScenario) {
                for (const s in exampleHandler.Example_TestScenario[g])
                    config.push(...exampleHandler.Example_TestScenario[g][s]);
            }
        } else {
            config = deepCopy(exampleHandler.Example_DefaultTestScenario);
        }

        const header: HeaderGenerator = new HeaderGenerator();

        const parameterNames = CliTestStep.InitiateDependencies(
            model,
            new HeaderGenerator(),
            [],
            [],
        );
        exampleHandler.GetResourcePool().clearExampleParams();

        // go through the examples to generate steps
        for (let ci = 0; ci < config.length; ci++) {
            const exampleId: string = config[ci].name;
            let functionName: string = CliTestStep.ToFunctionName(config[ci]);
            if (allSteps.includes(functionName)) continue;
            allSteps.push(functionName);
            if (exampleId) {
                const disabled: string = config[ci].disabled ? '# ' : '';
                steps.push('');
                steps.push('# EXAMPLE: ' + exampleId);
                const createStep = (minimum = false) => {
                    steps.push('@try_manual');

                    // find example by name
                    let found = false;
                    const examples: CommandExample[] = [];
                    let exampleIdx = -1;
                    let waitCmds: string[][];
                    for (const exampleCmd of exampleHandler.FindExampleById(
                        exampleId,
                        commandParams,
                        examples,
                        minimum,
                        config[ci].step,
                    )) {
                        exampleIdx += 1;
                        if (exampleCmd && exampleCmd.length > 0) {
                            functionName = CliTestStep.ToFunctionName(
                                { name: examples[exampleIdx].Id },
                                exampleCmd[0],
                            );
                            if (minimum) functionName += '_min';
                            if (exampleIdx === 0) {
                                steps.push(
                                    ...ToMultiLine(
                                        `def ${functionName}(test${CliTestStep.parameterLine(
                                            parameterNames,
                                            true,
                                        )}):`,
                                    ),
                                );
                            }
                            found = true;
                            if (isNullOrUndefined(waitCmds)) {
                                waitCmds = exampleHandler.FindExampleWaitById(exampleId);
                            }

                            const cmdString = exampleCmd.join('\n');
                            if (Object.prototype.hasOwnProperty.call(stepBuff, cmdString)) {
                                steps.push(
                                    ...ToMultiLine(
                                        `    return ${
                                            stepBuff[cmdString]
                                        }(test${CliTestStep.parameterLine(
                                            parameterNames,
                                        )}, checks)`,
                                    ),
                                );
                            } else {
                                stepBuff[cmdString] = functionName;
                                if (examples[exampleIdx].Method === 'delete') {
                                    exampleCmd[0] += ' -y';
                                }

                                steps.push('    if checks is None:');
                                steps.push('        checks = []');

                                for (let idx = 0; idx < exampleCmd.length; idx++) {
                                    const prefix: string =
                                        '    ' +
                                        disabled +
                                        (idx === 0 ? "test.cmd('" : "         '");
                                    const postfix: string =
                                        idx < exampleCmd.length - 1 ? " '" : "',";
                                    ToMultiLine(prefix + exampleCmd[idx] + postfix, steps);
                                }
                                if (isNullOrUndefined(waitCmds) || waitCmds.length === 0) {
                                    steps.push('    ' + disabled + '         checks=checks)');
                                } else {
                                    steps.push('    ' + disabled + '         checks=[])');
                                }
                            }
                        }
                    }
                    if (!found) {
                        if (minimum) functionName += '_min';
                        steps.push(
                            ...ToMultiLine(
                                `def ${functionName}(test${CliTestStep.parameterLine(
                                    parameterNames,
                                    true,
                                )}):`,
                            ),
                        );
                        steps.push('    # EXAMPLE NOT FOUND!');
                        steps.push('    pass');
                    } else {
                        for (const exampleCmd of waitCmds) {
                            if (exampleCmd && exampleCmd.length > 0) {
                                for (let idx = 0; idx < exampleCmd.length; idx++) {
                                    const prefix: string =
                                        '    ' +
                                        disabled +
                                        (idx === 0 ? "test.cmd('" : "         '");
                                    const postfix: string =
                                        idx < exampleCmd.length - 1 ? " '" : "',";
                                    ToMultiLine(prefix + exampleCmd[idx] + postfix, steps);
                                }
                                steps.push('    ' + disabled + '         checks=checks)');
                            }
                        }
                    }
                    if (disabled) {
                        steps.push('    pass');
                    }
                    steps.push('');
                };
                createStep();
                if (configHandler.GenMinTest) createStep(true);
            } else if (functionName) {
                steps.push('');
                steps.push(`# Env ${functionName}`);
                steps.push('@try_manual');
                steps.push(
                    ...ToMultiLine(
                        `def ${functionName}(test${CliTestStep.parameterLine(parameterNames)}):`,
                    ),
                );
                steps.push('    pass');
                steps.push('');
            }
        }

        steps.forEach((element) => {
            if (element.length > CodeGenConstants.PYLINT_MAX_CODE_LENGTH + 1) {
                header.disableLineTooLong = true;
            }
        });
        return header.getLines().concat(steps);
    }

    public static parameterLine(parameterNames, withChecksDef = false) {
        if (
            AzConfiguration.getValue(CodeGenConstants.az)[CodeGenConstants.useTestStepParam] !==
            true
        ) {
            parameterNames = [];
        }
        let ret = '';
        const paramList: string[] = deepCopy(parameterNames) as string[];
        if (withChecksDef) {
            paramList.push('checks=None');
        }
        for (const name of paramList) {
            ret += `, ${name}`;
        }
        return ret;
    }

    public static InitiateDependencies(
        model: CodeModelAz,
        header: HeaderGenerator,
        decorators: string[],
        initiates: string[],
    ): string[] {
        const { extensionHandler, configHandler, exampleHandler } = model.GetHandler();
        const decorated = [];
        const internalObjects = [];
        const parameterNames = [];
        for (const entity of exampleHandler.GetPreparerEntities() as PreparerEntity[]) {
            if (!entity.info.name) {
                const created = configHandler.GetTestUniqueResource
                    ? entity.info.createdObjectNames.length > 0
                    : entity.info.createdObjectNames.indexOf(entity.objectName) >= 0;
                internalObjects.push([
                    entity.info.className,
                    getResourceKey(entity.info.className, entity.objectName),
                    created,
                    entity.objectName,
                ]);
                continue;
            }

            // create preparers for outside dependency
            let line = `    @${entity.info.name}(name_prefix='clitest${
                extensionHandler.Extension_NameUnderscored
            }_${entity.objectName}'[:7], key='${getResourceKey(
                entity.info.className,
                entity.objectName,
            )}'`;
            for (let i = 0; i < entity.dependParameterValues.length; i++) {
                line += `, ${entity.info.dependParameters[i]}='${entity.dependParameterValues[i]}'`;
            }
            if (entity.info.name === 'ResourceGroupPreparer') {
                const parameterName = getResourceKey(entity.info.className, entity.objectName);
                line += `, parameter_name='${parameterName}'`;
                parameterNames.push(parameterName);
            }
            line += ')';
            ToMultiLine(line, decorators);
            if (decorated.indexOf(entity.info.name) < 0) {
                if (!entity.info.needGen) {
                    header.addFromImport('azure.cli.testsdk', [entity.info.name]);
                } else if (entity.info.needGen) {
                    header.addFromImport('.preparers', [entity.info.name]);
                    usePreparers.add(entity.info.className);
                }
                decorated.push(entity.info.name);
            }
        }

        // randomize name for internal resources
        if (internalObjects.length > 0) {
            initiates.push('        self.kwargs.update({');
            for (const [className, kargsKey, hasCreateExample, objectName] of internalObjects) {
                if (hasCreateExample && configHandler.RandomizeNames) {
                    const RANDOMIZE_MIN_LEN = 4;
                    let prefixLen = Math.floor(objectName.length / 2);
                    if (objectName.length - prefixLen < RANDOMIZE_MIN_LEN)
                        prefixLen = Math.max(objectName.length - RANDOMIZE_MIN_LEN, 0);
                    ToMultiLine(
                        `            '${kargsKey}': self.create_random_name(prefix='${objectName}'[:${prefixLen}], length=${Math.max(
                            objectName.length,
                            RANDOMIZE_MIN_LEN,
                        )}),`,
                        initiates,
                    );
                } else {
                    initiates.push(`            '${kargsKey}': '${objectName}',`);
                } // keep the original name in example if there is no create example in the test-scenario
            }
            initiates.push('        })');
        }
        return parameterNames;
    }

    public static ToFunctionName(step: any, azCmd: string = undefined): string {
        for (let round = 1; ; round += 1) {
            let ret: undefined | string;
            let stepId: string;
            if (step.name) {
                stepId = 'step_' + step.name;
            } else if (step.function) {
                stepId = step.function;
            }
            ret = isNullOrUndefined(azCmd) ? stepId : 'step_' + azCmd.split(' ').slice(2).join('_');
            if (!ret) return undefined;

            const shortName = ret.split('/').slice(-1)[0];
            if (Object.prototype.hasOwnProperty.call(shortToLongName, shortName)) {
                ret = shortToLongName[shortName];
            }
            if (shortName.length + 1 < ret.length) {
                shortToLongName[shortName] = ret;
            }

            let funcname = '';
            const letterNumber = /^[0-9a-zA-Z]+$/;
            ret = (ret as string).toLowerCase();
            for (let i = 0; i < ret.length; i++) {
                funcname += ret[i].match(letterNumber) ? ret[i] : '_';
            }
            if (funcname.length > 50) {
                const arr = funcname.split('_');
                let shortName = arr.join('_');
                if (arr.length > 4) {
                    shortName = arr.slice(0, 4).join('_');
                }
                if (shortName.length > 50) shortName = shortName.substr(0, 50);
                funcname = shortName;
            }

            if (round > 1) funcname += round.toString();

            if (
                !Object.prototype.hasOwnProperty.call(funcNames, funcname) ||
                funcNames[funcname] === stepId
            ) {
                funcNames[funcname] = stepId;
                return funcname;
            }
        }
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
