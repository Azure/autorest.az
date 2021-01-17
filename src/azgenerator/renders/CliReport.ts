/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../CodeModelAz';
import * as path from 'path';
import { SchemaType } from '@azure-tools/codemodel';
import { CodeModelTypes, PathConstants, RenderInput, SortOrder } from '../../utils/models';
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
                        ['isFlattened', true],
                        ['type', SchemaType.Constant],
                        ['isPolyOfSimple', true],
                        ['isDiscriminator', true],
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
        data.model = model.getModelData('extension', inputProperties, dependencies);
        const tmplPath = path.join(`${__dirname}`, '../../../templates/report.md.njx');
        const output = nunjucks.render(tmplPath, data);
        return output;
    }
}
