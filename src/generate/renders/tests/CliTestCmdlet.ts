/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { CliTestStep } from './CliTestStep';
import { deepCopy, isGeneratedExampleId, isNullOrUndefined } from '../../../utils/helper';
import { TemplateBase } from '../TemplateBase';
import { CodeModelTypes, PathConstants, RenderInput } from '../../../utils/models';

class ExampleInfo {
    id: string;
    lines: string[];
    lastLine: string;
}
class CmdletTestCase {
    functionName: string;
    exampleInfos: ExampleInfo[] = [];
}
export class CliCmdletTest extends TemplateBase {
    constructor(model: CodeModelAz, isNegativeTest: boolean) {
        super(model);
        const { configHandler } = model.GetHandler();
        const testFileName = isNegativeTest
            ? PathConstants.negativeTestFile
            : PathConstants.positiveTestFile;
        this.relativePath = path.join(
            configHandler.AzextFolder,
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
                testCases: [] as CmdletTestCase[],
            },
        };
        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput()],
            ['commandGroup', new RenderInput()],
            ['command', new RenderInput(['methodName'])],
            ['method', new RenderInput()],
            ['azExample', new RenderInput(['id', 'httpMethod', 'rawCommandStringItems'])],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'azExample'],
        ];

        for (const extension of this.model.getModelData('extension', inputProperties, dependencies)
            .Extensions) {
            for (const commandGroup of extension.CommandGroups) {
                for (const command of commandGroup.Commands) {
                    for (const method of command.Methods) {
                        if (method.hasAzExample) {
                            (method.AzExamples as any[]).sort((a, b) => {
                                return a.id > b.id ? 1 : -1;
                            });
                            const testCase = new CmdletTestCase();
                            for (const example of method.AzExamples as any[]) {
                                const commandLines = deepCopy(
                                    example.rawCommandStringItems,
                                ) as string[];

                                if (
                                    !isGeneratedExampleId(example.id) ||
                                    isNullOrUndefined(testCase.functionName)
                                ) {
                                    testCase.functionName = CliTestStep.ToFunctionName(
                                        { name: example.id },
                                        example.rawCommandStringItems[0],
                                    );
                                    const redundentPrefix = 'step_';
                                    if (testCase.functionName.startsWith(redundentPrefix))
                                        testCase.functionName = testCase.functionName.slice(
                                            redundentPrefix.length,
                                        );
                                }

                                if (command.methodName === 'delete') {
                                    commandLines[0] += ' -y';
                                }
                                const exampleInfo = new ExampleInfo();
                                exampleInfo.id = example.id;
                                (exampleInfo.lines = commandLines
                                    .slice(0, -1)
                                    .map(
                                        (x) => x.split('{').join('{{').split('}').join('}}') + ' ',
                                    )),
                                    (exampleInfo.lastLine = commandLines.last);
                                testCase.exampleInfos.push(exampleInfo);
                            }
                            ret.testData.testCases.push(testCase);
                        }
                    }
                }
            }
        }
        return ret;
    }
}
