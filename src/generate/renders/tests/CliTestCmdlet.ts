/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { CodeModelAz, CommandExample } from '../../CodeModelAz';
import { CliTestStep } from './CliTestStep';
import { deepCopy } from '../../../utils/helper';
import { TemplateBase } from '../TemplateBase';
import { CodeModelTypes, PathConstants, RenderInput } from '../../../utils/models';

export class CliCmdletTest extends TemplateBase {
    constructor(model: CodeModelAz, isNegativeTest: boolean) {
        super(model);
        const testFileName = isNegativeTest
            ? PathConstants.negativeTestFile
            : PathConstants.positiveTestFile;
        this.relativePath = path.join(
            model.AzextFolder,
            PathConstants.testFolder,
            PathConstants.cmdletFolder,
            testFileName,
        );
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.testFolder,
            PathConstants.cmdletFolder,
            testFileName + PathConstants.njxFileExtension,
        );
        this.className = isNegativeTest ? 'NegativeTest' : 'PositiveTest';
    }
    private className = '';

    public async fullGeneration(): Promise<string[]> {
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public async GetRenderData(model: CodeModelAz): Promise<any> {
        const ret = {
            testData: {
                className: this.className,
                cmds: [],
            },
        };
        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput()],
            ['commandGroup', new RenderInput()],
            ['command', new RenderInput()],
            ['method', new RenderInput(['azExamples'])],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
        ];

        for (const extension of this.model.getModelData('extension', inputProperties, dependencies)
            .Extensions)
            for (const commandGroup of extension.CommandGroups)
                for (const command of commandGroup.Commands)
                    for (const method of command.Methods)
                        for (const example of method.azExamples as CommandExample[]) {
                            let functionName = CliTestStep.ToFunctionName(
                                { name: example.Id },
                                example.commandStringItems[0],
                            );
                            const redundentPrefix = 'step_';
                            if (functionName.startsWith(redundentPrefix))
                                functionName = functionName.slice(redundentPrefix.length);

                            const commandLines = deepCopy(example.commandStringItems) as string[];
                            if (
                                commandLines[0].indexOf(' delete') > -1 &&
                                example.HttpMethod.toLowerCase() === 'delete'
                            ) {
                                commandLines[0] += ' -y';
                            }
                            ret.testData.cmds.push({
                                id: example.Id,
                                name: functionName,
                                lines: commandLines
                                    .slice(0, -1)
                                    .map(
                                        (x) => x.split('{').join('{{').split('}').join('}}') + ' ',
                                    ),
                                lastLine: commandLines.last,
                            });
                        }
        return ret;
    }
}
