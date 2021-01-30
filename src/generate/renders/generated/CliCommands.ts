/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import { isNullOrUndefined } from '../../../utils/helper';
import { TemplateBase } from '../TemplateBase';
import {
    AzConfiguration,
    CodeGenConstants,
    CodeModelTypes,
    PathConstants,
    RenderInput,
    SortOrder,
} from '../../../utils/models';
import * as path from 'path';
export class CliCommands extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        if (model.IsCliCore) {
            this.relativePath = path.join(
                PathConstants.generatedFolder,
                PathConstants.commandsFile,
            );
        } else {
            this.relativePath = path.join(
                model.AzextFolder,
                PathConstants.generatedFolder,
                PathConstants.commandsFile,
            );
        }
        this.tmplPath = path.join(PathConstants.templateRootFolder, 'generated/commands.py.njx');
    }

    public getDataFromModel(data: any) {
        data['imports'].push([
            CodeGenConstants.DEFAULT_CLI_CORE_LIB + '.commands',
            ['CliCommandType'],
        ]);
        let importProfile = false;
        let lineTooLong = false;
        let needWaitCommand = false;
        let showCustomFunctionName = '';
        const extraNonStringProperties = ['resourceType', 'mode'];
        const extraProperties = ['maxApi', 'minApi'];
        const pythonString = (str) => {
            return "'" + str + "'";
        };
        const commandGroupConverter = (item) => {
            needWaitCommand = false;
            item['propertiesString'] = {};
            extraProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    item['propertiesString'][prop] = pythonString(item[prop]);
                }
            });
            extraNonStringProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    item['propertiesString'][prop] = item[prop];
                }
                if (prop === 'resourceType' && !isNullOrUndefined(item[prop])) {
                    importProfile = true;
                }
            });
            if (
                !isNullOrUndefined(item['operationTmplName']) &&
                item['operationTmplName'].length >
                    CodeGenConstants.PYLINT_MAX_OPERATION_TEMPLATE_LENGTH
            ) {
                lineTooLong = true;
            }
            if (needWaitCommand && showCustomFunctionName != '') {
                item['needWaitCommand'] = true;
                item['showCustomFunctionName'] = showCustomFunctionName;
            }
            return item;
        };

        const commandConverter = (item) => {
            item['propertiesString'] = {};
            extraProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    item['propertiesString'][prop] = pythonString(item[prop]);
                }
            });
            extraNonStringProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    item['propertiesString'][prop] = item[prop];
                }
                if (prop === 'resourceType' && !isNullOrUndefined(item[prop])) {
                    importProfile = true;
                }
            });
            if (item['isLongRun']) {
                item['propertiesString']['supports_no_wait'] = 'True';
                needWaitCommand = true;
            }
            if (item['methodName'] === 'delete') {
                item['propertiesString']['confirmation'] = 'True';
            }
            if (item['methodName'] === 'show') {
                showCustomFunctionName = item['functionName'];
            }
            if (item['needGeneric'] && !isNullOrUndefined(item['genericSetterArgName'])) {
                item['propertiesString']['custom_func_name'] = pythonString(item['functionName']);
                const setterName = item['genericSetterArgName'];
                if (setterName && setterName !== '' && setterName !== 'parameters') {
                    item['propertiesString']['setter_arg_name'] = pythonString(setterName);
                }
                if (item['isLongRun'] && !AzConfiguration.getValue(CodeGenConstants.sdkTrack1)) {
                    item['propertiesString']['setter_name'] = "'begin_create_or_update'";
                }
            }
            return item;
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            [
                'extension',
                new RenderInput(['name', 'parent', 'mode', 'nameUnderscored'], {
                    name: SortOrder.ASEC,
                }),
            ],
            [
                'commandGroup',
                new RenderInput(
                    [
                        'name',
                        'clientFactoryName',
                        'customCommandTypeName',
                        'operationTmplName',
                        'maxApi',
                        'minApi',
                        'resourceType',
                        'mode',
                    ],
                    { name: SortOrder.ASEC },
                    [],
                    commandGroupConverter,
                ),
            ],
            [
                'command',
                new RenderInput(
                    [
                        'methodName',
                        'type',
                        'mode',
                        'maxApi',
                        'minApi',
                        'resourceType',
                        'isLongRun',
                        'functionName',
                        'needGeneric',
                        'genericSetterArgName',
                    ],
                    {},
                    [],
                    commandConverter,
                ),
            ],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        data = { ...data, ...this.model.getModelData('extension', inputProperties, dependencies) };
        if (importProfile) {
            data['imports'].push(['azure.cli.core.profiles', ['ResourceType']]);
        }
        if (lineTooLong) {
            data['pylints'].push('# pylint: disable=line-too-long');
        }
        data['azextFolder'] = this.model.AzextFolder;
        return data;
    }

    public async GetRenderData(): Promise<Record<string, unknown>> {
        const data = { data: { imports: [], pylints: [] } };
        const modelData = this.getDataFromModel(data.data);
        data.data = modelData;
        return data;
    }

    public async fullGeneration(): Promise<string[]> {
        return this.render();
    }

    public async incrementalGeneration(): Promise<string[]> {
        return this.render();
    }
}
