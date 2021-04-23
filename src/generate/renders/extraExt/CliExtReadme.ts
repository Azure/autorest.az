/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { HttpMethod } from '@azure-tools/codemodel';
import { CmdToMultiLines, isNullOrUndefined } from '../../../utils/helper';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { TemplateBase } from '../TemplateBase';
import { CommandExample } from '../../codemodel/Example';
import { CodeModelTypes, PathConstants, RenderInput } from '../../../utils/models';

export class CliExtReadme extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = PathConstants.readmeFile;
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.readmeFile + PathConstants.njxFileExtension,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        throw new Error('Method not implemented.');
    }

    private compareExamples(example1: CommandExample, example2: CommandExample): boolean {
        return this.getExampleOrder(example1) >= this.getExampleOrder(example2);
    }

    private getExampleOrder(example: CommandExample): number {
        switch (example.HttpMethod.toLowerCase()) {
            case HttpMethod.Put:
                return 1;
            case HttpMethod.Delete:
                return -1;
            default:
                return 0;
        }
    }

    public async GetRenderData(model: CodeModelAz): Promise<Record<string, any>> {
        const { exampleHandler } = this.model.GetHandler();

        const exampleConverter = (item: any) => {
            item.title = item.Method.charAt(0).toUpperCase() + item.Method.slice(1);
            item.CommandStringLines = CmdToMultiLines(item.CommandString);
            const waitCommandString = exampleHandler.GetExampleWait(item).join(' ');
            if (!isNullOrUndefined(waitCommandString) && waitCommandString !== '') {
                item.CommandStringLines.push('');
                const temp = CmdToMultiLines(waitCommandString);
                item.CommandStringLines.push(...temp);
            }
            return {
                title: item.title,
                CommandStringLines: item.CommandStringLines,
                HttpMethod: item.HttpMethod,
            };
        };

        const commandConverter = (item: any) => {
            item.examples = exampleHandler.GetExamples(false);
            for (let i = 0; i < item.examples.length; i++) {
                item.examples[i] = exampleConverter(item.examples[i]);
            }
            return item;
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput(['name'])],
            ['commandGroup', new RenderInput(['name'])],
            ['command', new RenderInput([], {}, [], commandConverter)],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        const data = model.getModelData('extension', inputProperties, dependencies);
        for (const extension of data.Extensions) {
            for (const group of extension.CommandGroups) {
                group.examples = [];
                for (const command of group.Commands) {
                    group.examples = group.examples.concat(command.examples);
                }
                group.Commands = undefined;

                for (let i = 0; i < group.examples.length - 1; ++i) {
                    for (let j = i + 1; j < group.examples.length; ++j) {
                        if (!this.compareExamples(group.examples[i], group.examples[j])) {
                            const tempExample = group.examples[i];
                            group.examples[i] = group.examples[j];
                            group.examples[j] = tempExample;
                        }
                    }
                }
            }
        }
        return data;
    }
}
