/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import { CodeModelAz, CommandExample } from "../../CodeModelAz"
import { PreparerEntity, getResourceKey } from "./ScenarioTool"
import { ToMultiLine, deepCopy } from '../../../../utils/helper';
import { HeaderGenerator } from "../../Header";
import { TemplateBase } from "../TemplateBase";
import { PathConstants } from "../../../models";
import { isNullOrUndefined } from 'util';

let usePreparers: boolean, shortToLongName, funcNames, allSteps;

function initVars() {
    usePreparers = false;
    shortToLongName = {};
    funcNames = {};
    allSteps = [];
}

export function NeedPreparer(): boolean {
    return usePreparers;
}

export class CliTestStep extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.testFolder, PathConstants.latestFolder, PathConstants.testStepFile);
        }
        else {
            this.relativePath = path.join(model.AzextFolder, PathConstants.testFolder, PathConstants.latestFolder, PathConstants.testStepFile);
        }
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliTestStep(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    private GenerateAzureCliTestStep(model: CodeModelAz): string[] {
        initVars();
        let steps: string[] = [];
        steps.push("");
        steps.push("");
        steps.push("from .. import try_manual");
        steps.push("");
        steps.push("");

        let commandParams = model.GatherInternalResource();
        let config: any = deepCopy(model.Extension_DefaultTestScenario);

        let header: HeaderGenerator = new HeaderGenerator();

        let parameterNames = CliTestStep.InitiateDependencies(model, new HeaderGenerator(), [], []);
        model.GetResourcePool().clearExampleParams();

        // go through the examples to generate steps
        for (var ci = 0; ci < config.length; ci++) {
            let exampleId: string = config[ci].name;
            let functionName: string = CliTestStep.ToFunctionName(config[ci]);
            if (allSteps.includes(functionName))    continue;
            allSteps.push(functionName);
            if (exampleId) {
                let disabled: string = config[ci].disabled ? "# " : "";
                steps.push("# EXAMPLE: " + exampleId);
                function create_step(minimum=false) {
                    steps.push("@try_manual");

                    // find example by name
                    let found = false;
                    let examples: CommandExample[] = [];
                    let exampleIdx = -1;
                    for (let exampleCmd of model.FindExampleById(exampleId, commandParams, examples, minimum)) {
                        exampleIdx += 1;
                        if (exampleCmd && exampleCmd.length > 0) {
                            functionName = CliTestStep.ToFunctionName({name: examples[exampleIdx].Id}, exampleCmd[0]);
                            if (minimum) functionName += "_min";
                            if (exampleIdx==0) {
                                steps.push(...ToMultiLine(`def ${functionName}(test${CliTestStep.parameterLine(parameterNames, true)}):`));
                            }
                            found = true;
                            if (exampleCmd[0].indexOf(' delete') > -1) {
                                exampleCmd[0] += " -y";
                            }

                            steps.push(`    if checks is None:`);
                            steps.push(`        checks = []`);

                            for (let idx = 0; idx < exampleCmd.length; idx++) {
                                let prefix: string = "    " + disabled + ((idx == 0) ? "test.cmd('" : "         '");
                                let postfix: string = (idx < exampleCmd.length - 1) ? " '" : "',";
                                ToMultiLine(prefix + exampleCmd[idx] + postfix, steps);
                            }
                            steps.push("    " + disabled + "         checks=checks)");
                        }
                    }
                    if (!found) {
                        if (minimum) functionName += "_min";
                        steps.push(...ToMultiLine(`def ${functionName}(test${CliTestStep.parameterLine(parameterNames, true)}):`));
                        steps.push("    # EXAMPLE NOT FOUND!");
                        steps.push("    pass");
                    }
                    else {
                        for (let exampleCmd of model.FindExampleWaitById(exampleId)) {
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
                    }
                    if (disabled) {
                        steps.push("    pass");
                    }
                    steps.push("");
                    steps.push("");
                }
                create_step();
                create_step(true);
            }
            else if (functionName) {
                steps.push(`# Env ${functionName}`);
                steps.push("@try_manual");
                steps.push(...ToMultiLine(`def ${functionName}(test${CliTestStep.parameterLine(parameterNames)}):`));
                steps.push("    pass");
                steps.push("");
                steps.push("");
            }
        }

        steps.forEach(element => {
            if (element.length > 120) header.disableLineTooLong = true;
        });
        return header.getLines().concat(steps);
    }

    public static parameterLine(parameterNames, withChecksDef=false) {
        let ret = "";
        var paramList: string[] = deepCopy(parameterNames) as string[];
        if (withChecksDef) {
            paramList.push("checks=None");
        }
        for (let name of paramList) {
            ret += `, ${name}`;
        }
        return ret;
    }

    public static InitiateDependencies(model: CodeModelAz, header: HeaderGenerator, decorators: string[], initiates: string[]): string[] {
        let decorated = [];
        let internalObjects = [];
        let parameterNames = [];
        for (let entity of (model.GetPreparerEntities() as PreparerEntity[])) {
            if (!entity.info.name) {
                internalObjects.push([entity.info.class_name, getResourceKey(entity.info.class_name, entity.object_name), entity.info.createdObjectNames.indexOf(entity.object_name) >= 0, entity.object_name]);
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
                    header.addFromImport("azure.cli.testsdk", [entity.info.name]);
                }
                else if (entity.info.name == 'StorageAccountPreparer') {
                    header.addFromImport("azure.cli.testsdk", [entity.info.name]);
                } else {
                    header.addFromImport(".preparers", [entity.info.name]);
                    usePreparers = true;
                }
                decorated.push(entity.info.name);
            }
        }

        // randomize name for internal resources
        if (internalObjects.length > 0) {
            initiates.push("        self.kwargs.update({");
            for (let [class_name, kargs_key, hasCreateExample, object_name] of internalObjects) {
                if (hasCreateExample && model.RandomizeNames) {
                    const RANDOMIZE_MIN_LEN = 4;
                    let prefixLen = Math.floor(object_name.length / 2);
                    if (object_name.length - prefixLen < RANDOMIZE_MIN_LEN) prefixLen = Math.max(object_name.length - RANDOMIZE_MIN_LEN, 0);
                    ToMultiLine(`            '${kargs_key}': self.create_random_name(prefix='${object_name}'[:${prefixLen}], length=${Math.max(object_name.length, RANDOMIZE_MIN_LEN)}),`, initiates);
                }
                else
                    initiates.push(`            '${kargs_key}': '${object_name}',`);   // keep the original name in example if there is no create example in the test-scenario
            }
            initiates.push("        })");
            initiates.push("");
        }
        return parameterNames;
    }

    public static ToFunctionName(step: any, azCmd: string=undefined): string {
        for (let round=1; true; round+=1) {
            let ret: undefined| string = undefined;
            let stepId: string;
            if (step.name)
                stepId = "step_" + step.name;
            else if (step.function)
                stepId = step.function;
            ret = isNullOrUndefined(azCmd)? stepId: "step_" + azCmd.split(" ").slice(2).join("_");
            if (!ret) return undefined;

            let shortName = ret.split("/").slice(-1)[0];
            if (shortToLongName.hasOwnProperty(shortName)){
                ret = shortToLongName[shortName];
            }
            if (shortName.length+1<ret.length) {
                shortToLongName[shortName] = ret;
            }

            let funcname = "";
            var letterNumber = /^[0-9a-zA-Z]+$/;
            ret = (ret as string).toLowerCase();
            for (let i = 0; i < ret.length; i++) {
                funcname += ret[i].match(letterNumber) ? ret[i] : '_';
            }
            if (funcname.length > 50) {
                let arr = funcname.split("_");
                let shortName = arr.join("_");
                if (arr.length > 4) {
                    shortName = arr.slice(0, 4).join("_");
                }
                if (shortName.length > 50) shortName = shortName.substr(0, 50);
                funcname = shortName;
            }

            if (round>1) funcname += round.toString();

            if (!funcNames.hasOwnProperty(funcname) || funcNames[funcname] == stepId) {
                funcNames[funcname] = stepId;
                return funcname;
            }
        }
    }
}
