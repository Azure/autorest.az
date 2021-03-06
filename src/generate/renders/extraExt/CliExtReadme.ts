/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { HttpMethod } from '@azure-tools/codemodel';
import { CmdToMultiLines, isNullOrUndefined } from '../../../utils/helper';
import { PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { TemplateBase } from '../TemplateBase';
import { CommandExample } from '../../codemodel/Example';

export class CliExtReadme extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = PathConstants.readmeFile;
    }

    public async fullGeneration(): Promise<string[]> {
        const { extensionHandler, commandGroupHandler, exampleHandler } = this.model.GetHandler();
        let output: string[] = [];

        output.push('# Azure CLI ' + extensionHandler.Extension_Name + ' Extension #');
        output.push('This is the extension for ' + extensionHandler.Extension_Name);
        output.push('');
        output.push('### How to use ###');
        output.push('Install this extension using the below CLI command');
        output.push('```');
        output.push('az extension add --name ' + extensionHandler.Extension_Name);
        output.push('```');
        output.push('');
        output.push('### Included Features ###');

        if (this.model.SelectFirstCommandGroup()) {
            do {
                output.push('#### ' + commandGroupHandler.CommandGroup_Name + ' ####');

                let exampleList: CommandExample[] = [];
                const exampleCommandList: string[] = [];
                if (this.model.SelectFirstCommand()) {
                    do {
                        exampleList = exampleList.concat(exampleHandler.GetExamples(false));
                    } while (this.model.SelectNextCommand());
                }

                // Sort
                for (let i = 0; i < exampleList.length - 1; ++i) {
                    for (let j = i + 1; j < exampleList.length; ++j) {
                        if (this.compareExamples(exampleList[i], exampleList[j]) === false) {
                            const tempExample = exampleList[i];
                            exampleList[i] = exampleList[j];
                            exampleList[j] = tempExample;
                        }
                    }
                }

                // Generate example
                for (const example of exampleList) {
                    if (!isNullOrUndefined(example.CommandString) && example.CommandString !== '') {
                        const title =
                            example.Method.charAt(0).toUpperCase() + example.Method.slice(1);
                        // const title = example.Id.slice(example.Id.lastIndexOf("/") + 1).match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
                        exampleCommandList.push('##### ' + title + ' #####');
                        exampleCommandList.push('```');
                        const temp = CmdToMultiLines(example.CommandString);
                        exampleCommandList.push(...temp);
                    }
                    const waitCommandString = exampleHandler.GetExampleWait(example).join(' ');
                    if (!isNullOrUndefined(waitCommandString) && waitCommandString !== '') {
                        exampleCommandList.push('');
                        const temp = CmdToMultiLines(waitCommandString);
                        exampleCommandList.push(...temp);
                    }
                    exampleCommandList.push('```');
                }

                if (exampleCommandList.length !== 0) {
                    output = output.concat(exampleCommandList);
                }
            } while (this.model.SelectNextCommandGroup());
        }
        return output;
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

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
