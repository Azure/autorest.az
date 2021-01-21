/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../CodeModelAz';
import * as path from 'path';
import { SchemaType } from '@azure-tools/codemodel';
import { CodeModelTypes, PathConstants, RenderInput, SortOrder } from '../../utils/models';
import { TemplateBase } from './TemplateBase';

export class CliReport extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(PathConstants.reportFile);
        this.tmplPath = path.join(`${__dirname}`, '../../../src/templates/report.md.njx');
    }

    public fullGeneration(): string[] {
        return this.render();
    }

    public incrementalGeneration(base: string): string[] {
        return this.fullGeneration();
    }

    public GetRenderData(model: CodeModelAz): any {
        let data = {};

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
            ['azExample', new RenderInput(['commandStringItems'], {})],
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
}
