/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../CodeModelAz';
import * as path from 'path';
import { SchemaType } from '@azure-tools/codemodel';
import { ToMultiLine, isNullOrUndefined } from '../../../utils/helper';
import { CodeModelTypes, PathConstants, RenderInput, SortOrder } from '../../../utils/models';
import { TemplateBase } from './TemplateBase';
import * as nunjucks from 'nunjucks';

export class CliReport extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.relativePath = path.join(PathConstants.reportFile);
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliReport(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    GenerateAzureCliReport(model: CodeModelAz): string[] {
        const data = {
            model: {},
        };

        /*
            if (
                model.MethodParameter_IsFlattened ||
                model.MethodParameter_Type === SchemaType.Constant
            ) {
                continue;
            }
            if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                continue;
            }
            if (
                !isNullOrUndefined(originalOperation) &&
                model.MethodParameter['targetProperty']?.isDiscriminator
            ) {
                continue;
            }
            
            
            let optionName = model.MethodParameter_MapsTo;
            if (optionName.endsWith('_')) {
                optionName = optionName.substr(0, optionName.length - 1);
            }
            optionName = optionName.replace(/_/g, '-');
        */

        const converter = new Map<string, (item) => unknown>([
            [
                'mapsTo',
                function (item: string) {
                    if (item.endsWith('_')) {
                        item = item.substr(0, item.length - 1);
                    }
                    item = item.replace(/_/g, '-');
                    return item;
                },
            ],
        ]);

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput(['name'], { name: SortOrder.ASEC })],
            ['commandGroup', new RenderInput(['name', 'cliKey'], { name: SortOrder.ASEC })],
            ['command', new RenderInput([])],
            ['method', new RenderInput(['nameAz', 'cliKey'], { nameAz: SortOrder.ASEC })],
            [
                'methodParameter',
                new RenderInput(
                    ['mapsTo', 'type', 'description', 'cliKey'],
                    {},
                    [
                        'this.MethodParameter_IsFlattened',
                        'this.MethodParameter_Type === SchemaType.Constant',
                        'this.Parameter_IsPolyOfSimple(this.MethodParameter)',
                        "!isNullOrUndefined(this.Method_GetOriginalOperation) && this.MethodParameter['targetProperty']?.isDiscriminator",
                    ],
                    converter,
                ),
            ],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
        ];
        data.model = model.getRenderData('extension', inputProperties, dependencies);
        const tmplPath = path.join(`${__dirname}`, '../../../templates/report.md.njx');
        const output = nunjucks.render(tmplPath, data);
        return output;
    }
}
