/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../codemodel/CodeModelAz';
import * as path from 'path';
import { SchemaType } from '@azure-tools/codemodel';
import {
    CodeGenConstants,
    CodeModelTypes,
    PathConstants,
    RenderInput,
    SortOrder,
} from '../../utils/models';
import { TemplateBase } from './TemplateBase';
import { isNullOrUndefined, ToMultiLine } from '../../utils/helper';
import { CommandGroupModelImpl } from '../codemodel/CommandGroup';

export class CliReport extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(PathConstants.reportFile);
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.reportFile + PathConstants.njxFileExtension,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        // return this.render();
        return this.GenerateAzureCliReport(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public GetRenderData(model: CodeModelAz): any {
        let data = {};

        const converter = (item) => {
            let mapsTo = item['mapsTo'];
            if (isNullOrUndefined(mapsTo)) {
                return undefined;
            }
            if (mapsTo.endsWith('_')) {
                mapsTo = mapsTo.substr(0, mapsTo.length - 1);
            }
            item['mapsTo'] = mapsTo.replace(/_/g, '-');
            return item;
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput(['name'], { name: SortOrder.ASEC })],
            ['commandGroup', new RenderInput(['name', 'cliKey'], { name: SortOrder.ASEC })],
            ['command', new RenderInput(['name'])],
            ['method', new RenderInput(['nameAz', 'cliKey'], { nameAz: SortOrder.ASEC })],
            [
                'methodParameter',
                new RenderInput(
                    ['mapsTo', 'type', 'description', 'cliKey', 'namePython'],
                    {},
                    [
                        ['isFlattened', true],
                        ['type', SchemaType.Constant],
                        ['isPolyOfSimple', true],
                        ['isDiscriminator', true],
                    ],
                    converter,
                ),
            ],
            ['azExample', new RenderInput(['commandStringItems'], {}, [['isGenerated', true]])],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
            ['method', 'azExample'],
        ];
        data = model.getModelData('extension', inputProperties, dependencies);
        return data;
    }

    GenerateAzureCliReport(model: CodeModelAz): string[] {
        const { extensionHandler, commandGroupHandler } = model.GetHandler();
        let output: string[] = [];

        output.push('# Azure CLI Module Creation Report');
        output.push('');
        output.push('## EXTENSION');
        output.push('|CLI Extension|Command Groups|');
        output.push('|---------|------------|');
        output.push('|az ' + extensionHandler.Extension_Name + '|[groups](#CommandGroups)');
        output.push('');
        output.push('## GROUPS');
        output.push(
            '### <a name="CommandGroups">Command groups in `az ' +
                extensionHandler.Extension_Name +
                '` extension </a>',
        );
        output.push('|CLI Command Group|Group Swagger name|Commands|');
        output.push('|---------|------------|--------|');

        let cmds = {};
        if (model.SelectFirstCommandGroup()) {
            do {
                output.push(
                    '|az ' +
                        commandGroupHandler.CommandGroup_Name +
                        '|' +
                        commandGroupHandler.CommandGroup_CliKey +
                        '|' +
                        '[commands](#CommandsIn' +
                        commandGroupHandler.CommandGroup_CliKey +
                        ')|',
                );
            } while (model.SelectNextCommandGroup());
        }

        output.push('');
        output.push('## COMMANDS');

        if (model.SelectFirstCommandGroup()) {
            let mo: string[] = [];
            do {
                if (model.SelectFirstCommand()) {
                    mo = this.getCommandBody(model);
                    if (!isNullOrUndefined(cmds[commandGroupHandler.CommandGroup_Name])) {
                        cmds[commandGroupHandler.CommandGroup_Name] = cmds[
                            commandGroupHandler.CommandGroup_Name
                        ].concat(mo);
                    } else {
                        cmds[commandGroupHandler.CommandGroup_Name] = mo;
                    }
                }
            } while (model.SelectNextCommandGroup());
        }

        // build sorted output
        let keys = Object.keys(cmds);
        keys.sort();

        for (let i = 0; i < keys.length; i++) {
            output = output.concat(cmds[keys[i]]);
        }

        output.push('');
        cmds = {};
        output.push('## COMMAND DETAILS');
        output.push('');

        if (model.SelectFirstCommandGroup()) {
            let mo: string[] = [];
            do {
                if (model.SelectFirstCommand()) {
                    mo = this.getCommandDetails(model);
                    if (!isNullOrUndefined(cmds[commandGroupHandler.CommandGroup_Name])) {
                        cmds[commandGroupHandler.CommandGroup_Name] = cmds[
                            commandGroupHandler.CommandGroup_Name
                        ].concat(mo);
                    } else {
                        cmds[commandGroupHandler.CommandGroup_Name] = mo;
                    }
                }
            } while (model.SelectNextCommandGroup());
        }
        keys = Object.keys(cmds);
        keys.sort();

        for (let i = 0; i < keys.length; i++) {
            output = output.concat(cmds[keys[i]]);
        }
        return output;
    }

    getCommandBody(model: CodeModelAz) {
        const { commandGroupHandler, methodHandler, exampleHandler } = model.GetHandler();
        const mo: string[] = [];
        mo.push(
            '### <a name="CommandsIn' +
                commandGroupHandler.CommandGroup_CliKey +
                '">Commands in `az ' +
                commandGroupHandler.CommandGroup_Name +
                '` group</a>',
        );
        mo.push('|CLI Command|Operation Swagger name|Parameters|Examples|');
        mo.push('|---------|------------|--------|-----------|');
        if (model.SelectFirstCommand()) {
            do {
                if (model.SelectFirstMethod()) {
                    do {
                        if (exampleHandler.GetExamples(false).length > 0) {
                            mo.push(
                                '|[az ' +
                                    commandGroupHandler.CommandGroup_Name +
                                    ' ' +
                                    methodHandler.Method_NameAz +
                                    '](#' +
                                    commandGroupHandler.CommandGroup_CliKey +
                                    methodHandler.Method_CliKey +
                                    ')|' +
                                    methodHandler.Method_CliKey +
                                    '|' +
                                    '[Parameters](#Parameters' +
                                    commandGroupHandler.CommandGroup_CliKey +
                                    methodHandler.Method_CliKey +
                                    ')' +
                                    '|' +
                                    '[Example](#Examples' +
                                    commandGroupHandler.CommandGroup_CliKey +
                                    methodHandler.Method_CliKey +
                                    ')|',
                            );
                        } else {
                            mo.push(
                                '|[az ' +
                                    commandGroupHandler.CommandGroup_Name +
                                    ' ' +
                                    methodHandler.Method_NameAz +
                                    '](#' +
                                    commandGroupHandler.CommandGroup_CliKey +
                                    methodHandler.Method_CliKey +
                                    ')|' +
                                    methodHandler.Method_CliKey +
                                    '|' +
                                    '[Parameters](#Parameters' +
                                    commandGroupHandler.CommandGroup_CliKey +
                                    methodHandler.Method_CliKey +
                                    ')' +
                                    '|Not Found|',
                            );
                        }
                    } while (model.SelectNextMethod());
                }
            } while (model.SelectNextCommand());
        }
        mo.push('');
        return mo;
    }

    getCommandDetails(model: CodeModelAz) {
        const {
            commandGroupHandler,
            methodHandler,
            methodParameterHandler,
            parameterHandler,
            exampleHandler,
        } = model.GetHandler();
        let mo: string[] = [];
        mo.push('### group `az ' + commandGroupHandler.CommandGroup_Name + '`');
        if (model.SelectFirstCommand()) {
            do {
                const allRequiredParam: Map<string, boolean> = new Map<string, boolean>();
                const allNonRequiredParam: Map<string, boolean> = new Map<string, boolean>();
                let requiredmo: Array<string> = [];
                let nonrequiredmo: Array<string> = [];
                if (model.SelectFirstMethod()) {
                    do {
                        mo.push(
                            '#### <a name="' +
                                commandGroupHandler.CommandGroup_CliKey +
                                methodHandler.Method_CliKey +
                                '">Command `az ' +
                                commandGroupHandler.CommandGroup_Name +
                                ' ' +
                                methodHandler.Method_NameAz +
                                '`</a>',
                        );
                        mo.push('');
                        for (const example of exampleHandler.GetExamples(false)) {
                            mo.push(
                                '##### <a name="' +
                                    'Examples' +
                                    commandGroupHandler.CommandGroup_CliKey +
                                    methodHandler.Method_CliKey +
                                    '">Example</a>',
                            );
                            mo.push('```');
                            let parameters: string[] = [];
                            parameters = exampleHandler.GetExampleItems(example, false, undefined);
                            const line = parameters.join(' ');
                            ToMultiLine(line, mo, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
                            mo.push('```');
                        }
                        mo.push(
                            '##### <a name="' +
                                'Parameters' +
                                commandGroupHandler.CommandGroup_CliKey +
                                methodHandler.Method_CliKey +
                                '">Parameters</a> ',
                        );
                        mo.push('|Option|Type|Description|Path (SDK)|Swagger name|');
                        mo.push('|------|----|-----------|----------|------------|');
                        if (!model.SelectFirstMethodParameter()) {
                            continue;
                        }
                        const originalOperation = methodHandler.Method_GetOriginalOperation;
                        do {
                            if (
                                methodParameterHandler.MethodParameter_IsFlattened ||
                                methodParameterHandler.MethodParameter_Type === SchemaType.Constant
                            ) {
                                continue;
                            }
                            if (
                                parameterHandler.Parameter_IsPolyOfSimple(
                                    methodParameterHandler.MethodParameter,
                                )
                            ) {
                                continue;
                            }
                            if (
                                !isNullOrUndefined(originalOperation) &&
                                methodParameterHandler.MethodParameter['targetProperty']
                                    ?.isDiscriminator
                            ) {
                                continue;
                            }
                            let optionName = methodParameterHandler.MethodParameter_MapsTo;
                            if (optionName.endsWith('_')) {
                                optionName = optionName.substr(0, optionName.length - 1);
                            }
                            optionName = optionName.replace(/_/g, '-');
                            if (methodParameterHandler.MethodParameter_IsRequired) {
                                if (allRequiredParam.has(optionName)) {
                                    continue;
                                }
                                allRequiredParam.set(optionName, true);
                                requiredmo.push(
                                    '|**--' +
                                        optionName +
                                        '**|' +
                                        methodParameterHandler.MethodParameter_Type +
                                        '|' +
                                        methodParameterHandler.MethodParameter_Description +
                                        '|' +
                                        methodParameterHandler.MethodParameter_Name +
                                        '|' +
                                        methodParameterHandler.MethodParameter_CliKey +
                                        '|',
                                );
                            } else {
                                if (allNonRequiredParam.has(optionName)) {
                                    continue;
                                }
                                allNonRequiredParam.set(optionName, true);
                                nonrequiredmo.push(
                                    '|**--' +
                                        optionName +
                                        '**|' +
                                        methodParameterHandler.MethodParameter_Type +
                                        '|' +
                                        methodParameterHandler.MethodParameter_Description +
                                        '|' +
                                        methodParameterHandler.MethodParameter_Name +
                                        '|' +
                                        methodParameterHandler.MethodParameter_CliKey +
                                        '|',
                                );
                            }
                        } while (model.SelectNextMethodParameter());
                        let flag = false;
                        if (requiredmo.length > 0 || nonrequiredmo.length > 0) {
                            flag = true;
                        }
                        if (requiredmo.length > 0) {
                            mo = mo.concat(requiredmo);
                            requiredmo = [];
                        }
                        if (nonrequiredmo.length > 0) {
                            mo = mo.concat(nonrequiredmo);
                            nonrequiredmo = [];
                        }
                        if (flag) mo.push('');
                    } while (model.SelectNextMethod());
                }
                if (requiredmo.length <= 0 && nonrequiredmo.length < 0) {
                    return mo;
                }
            } while (model.SelectNextCommand());
        }
        return mo;
    }
}
