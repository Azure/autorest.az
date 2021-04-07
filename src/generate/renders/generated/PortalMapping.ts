/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import * as path from 'path';
import { SchemaType } from '@azure-tools/codemodel';
import {
    CodeGenConstants,
    CodeModelTypes,
    PathConstants,
    RenderInput,
    SortOrder,
} from '../../../utils/models';
import { TemplateBase } from '../TemplateBase';
import { isNullOrUndefined } from '../../../utils/helper';

export class CliPortalMapping extends TemplateBase {
    resourceMappings: any;
    parameterMappings: any[];
    commandMappingItem: any;
    resourceKey: string;
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(
            model.AzextFolder,
            PathConstants.generatedFolder,
            PathConstants.portalMappingFile,
        );
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.generatedFolder,
            PathConstants.portalMappingFile + '.njx',
        );
        this.resourceMappings = {};
        this.parameterMappings = [];
    }

    public async fullGeneration(): Promise<string[]> {
        return this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    commandConverter(item: any): any {
        this.commandMappingItem['TargetCommand'] = 'az ' + item['name'];
        return item;
    }

    methodConverter(item: any): any {
        this.resourceKey = item['apiVersion'] + item['resourceProviderType'];
        if (isNullOrUndefined(this.resourceMappings[this.resourceKey])) {
            this.resourceMappings[this.resourceKey] = {
                ResourceType: item['resourceProviderType'],
                ApiVersion: item['apiVersion'],
                CommandMappings: [],
            };
        }
        this.commandMappingItem = {
            SourceCommand: {
                HttpMethod: item['httpMethodOri'].toUpperCase(),
                Name: item['httpURL'],
                RequiredParameters: [],
                RequiredParameterValues: [],
            },
            TargetCommand: item['nameAz'],
            ParameterMappings: this.parameterMappings,
        };
        this.parameterMappings = [];
        this.resourceMappings[this.resourceKey]['CommandMappings'].push(this.commandMappingItem);
        return item;
    }

    methodParameterConverter(item: any): any {
        const parameterMappingItem = {
            SourceParameters: [item['cliKey']],
            TargetParameters: [(item['nameAz'].length > 1 ? '--' : '-') + item['nameAz']],
            ConvertFunction: null,
        };
        this.parameterMappings.push(parameterMappingItem);
        return item;
    }

    public GetRenderData(model: CodeModelAz): any {
        const ret = {
            SourceTool: 'REST',
            TargetTool: 'AzureCLI',
            SourceToolVersion: 'N/A',
            TargetToolVersion: '2.10.0',
            ResourceMappings: [],
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput(['name'], { name: SortOrder.ASEC })],
            ['commandGroup', new RenderInput(['name', 'cliKey'], { name: SortOrder.ASEC })],
            ['command', new RenderInput(['name'], {}, [], this.commandConverter.bind(this))],
            [
                'method',
                new RenderInput(
                    [
                        'nameAz',
                        'cliKey',
                        'apiVersion',
                        'httpMethodOri',
                        'httpURL',
                        'resourceProviderType',
                    ],
                    { nameAz: SortOrder.ASEC },
                    [],
                    this.methodConverter.bind(this),
                ),
            ],
            [
                'methodParameter',
                new RenderInput(
                    [
                        'mapsTo',
                        'type',
                        'description',
                        'cliKey',
                        'namePython',
                        'nameAz',
                        'restApiPath',
                    ],
                    {},
                    [['type', SchemaType.Constant]],
                    this.methodParameterConverter.bind(this),
                ),
            ],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
        ];
        model.getModelData('extension', inputProperties, dependencies);
        this.resourceMappings = Object.values(this.resourceMappings);
        ret.ResourceMappings = this.resourceMappings;
        return { data: ret };
    }
}
