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
    private importProfile = false;
    private importClientFactories = [];
    private lineTooLong = false;
    private needWaitCommand = false;
    private showCustomFunctionName = '';
    private groupClientFactoryName = '';
    private extraNonStringProperties = ['resourceType', 'mode'];
    private extraProperties = ['maxApi', 'minApi'];

    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(
            model.AzextFolder,
            PathConstants.generatedFolder,
            PathConstants.commandsFile,
        );
        this.tmplPath = path.join(PathConstants.templateRootFolder, 'generated/commands.py.njx');
    }

    pythonString(str: string): string {
        return `'${str}'`;
    }

    extensionConverter(item: any): any {
        if (!isNullOrUndefined(item['parent']) && !isNullOrUndefined(item['name'])) {
            item['name'] = item['parent'] + ' ' + item['name'];
        }
        return item;
    }

    commandGroupConverter(item: any): any {
        item['propertiesString'] = {};
        this.extraProperties.forEach((prop) => {
            if (!isNullOrUndefined(item[prop])) {
                item['propertiesString'][prop] = this.pythonString(item[prop]);
            }
        });
        this.extraNonStringProperties.forEach((prop) => {
            if (!isNullOrUndefined(item[prop])) {
                item['propertiesString'][prop] = item[prop];
            }
            if (prop === 'resourceType' && !isNullOrUndefined(item[prop])) {
                this.importProfile = true;
            }
        });
        if (
            !isNullOrUndefined(item['operationTmplName']) &&
            item['operationTmplName'].length > CodeGenConstants.PYLINT_MAX_OPERATION_TEMPLATE_LENGTH
        ) {
            this.lineTooLong = true;
        }
        if (this.needWaitCommand && this.showCustomFunctionName !== '') {
            item['needWaitCommand'] = true;
            item['showCustomFunctionName'] = this.showCustomFunctionName;
            this.needWaitCommand = false;
            this.showCustomFunctionName = '';
        } else if (this.needWaitCommand) {
            this.needWaitCommand = false;
        } else if (this.showCustomFunctionName !== '') {
            this.showCustomFunctionName = '';
        }
        this.groupClientFactoryName = item['clientFactoryName'];
        this.importClientFactories.push(this.groupClientFactoryName);
        return item;
    }

    commandConverter(item: any): any {
        item['propertiesString'] = {};
        this.extraProperties.forEach((prop) => {
            if (!isNullOrUndefined(item[prop])) {
                item['propertiesString'][prop] = this.pythonString(item[prop]);
            }
        });
        this.extraNonStringProperties.forEach((prop) => {
            if (!isNullOrUndefined(item[prop])) {
                item['propertiesString'][prop] = item[prop];
            }
            if (prop === 'resourceType' && !isNullOrUndefined(item[prop])) {
                this.importProfile = true;
            }
        });
        if (item['isLongRun'] && this.showCustomFunctionName !== '') {
            item['propertiesString']['supports_no_wait'] = 'True';
            this.needWaitCommand = true;
        }
        if (item['methodName'] === 'delete') {
            item['propertiesString']['confirmation'] = 'True';
        }
        if (item['methodName'] === 'show') {
            this.showCustomFunctionName = item['functionName'];
        }
        if (item['needGeneric'] && !isNullOrUndefined(item['genericSetterArgName'])) {
            item['propertiesString']['custom_func_name'] = this.pythonString(item['functionName']);
            const setterName = item['genericSetterArgName'];
            if (setterName && setterName !== '' && setterName !== 'parameters') {
                item['propertiesString']['setter_arg_name'] = this.pythonString(setterName);
            }
            if (item['isLongRun'] && !AzConfiguration.getValue(CodeGenConstants.sdkTrack1)) {
                item['propertiesString']['setter_name'] = "'begin_create_or_update'";
            }
        }
        if (
            !isNullOrUndefined(item['clientFactoryName']) &&
            item['clientFactoryName'] !== this.groupClientFactoryName
        ) {
            item['propertiesString']['client_factory'] = item['clientFactoryName'];
        }
        return item;
    }

    public async GetRenderData(): Promise<Record<string, unknown>> {
        let data = { imports: [], pylints: [] };
        data['imports'].push([this.model.CliCoreLib + '.commands', ['CliCommandType']]);

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            [
                'extension',
                new RenderInput(
                    ['name', 'parent', 'mode', 'nameUnderscored'],
                    {
                        name: SortOrder.ASEC,
                    },
                    [],
                    this.extensionConverter.bind(this),
                ),
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
                        'hasCommand',
                    ],
                    { name: SortOrder.ASEC },
                    [],
                    this.commandGroupConverter.bind(this),
                    [true],
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
                        'clientFactoryName',
                    ],
                    {},
                    [],
                    this.commandConverter.bind(this),
                ),
            ],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        data = { ...data, ...this.model.getModelData('extension', inputProperties, dependencies) };
        if (this.importProfile) {
            data['imports'].push([this.model.CliCoreLib + '.profiles', ['ResourceType']]);
        }
        if (
            !isNullOrUndefined(this.importClientFactories) &&
            Array.isArray(this.importClientFactories) &&
            this.importClientFactories.length > 0
        ) {
            data['imports'].push([
                this.model.AzextFolder + '.generated._client_factory',
                this.importClientFactories,
            ]);
        }
        data['pylints'].push(
            '# pylint: disable=too-many-statements',
            '# pylint: disable=too-many-locals',
        );
        if (this.lineTooLong) {
            data['pylints'].push('# pylint: disable=line-too-long');
        }
        data['azextFolder'] = this.model.AzextFolder;
        const result = { data: { imports: [], pylints: [] } };
        result.data = data;
        return result;
    }

    public async fullGeneration(): Promise<string[]> {
        return this.render();
    }

    public async incrementalGeneration(): Promise<string[]> {
        return this.render();
    }
}
