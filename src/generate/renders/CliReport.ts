/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../codemodel/CodeModelAz';
import * as path from 'path';
import { SchemaType } from '@azure-tools/codemodel';
import { CodeModelTypes, PathConstants, RenderInput, SortOrder } from '../../utils/models';
import { TemplateBase } from './TemplateBase';
import { isNullOrUndefined } from '../../utils/helper';

export class CliReport extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(PathConstants.reportFile);
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.reportFile + PathConstants.njkFileExtension,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public GetRenderData(model: CodeModelAz): any {
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
                    ['mapsTo', 'type', 'description', 'cliKey', 'name', 'isRequired'],
                    { isRequired: SortOrder.DESC },
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
        const data = model.getModelData('extension', inputProperties, dependencies);
        return data;
    }
}
