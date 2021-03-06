/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import {
    getIndentString,
    keepHeaderLines,
    skipCommentLines,
    isNullOrUndefined,
} from '../../utils/helper';
import { GenerationMode, PathConstants } from '../../utils/models';
import { CodeModelAz } from '../codemodel/CodeModelAz';
import { HeaderGenerator } from './Header';
import { TemplateBase } from './TemplateBase';

export class CliTopHelp extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        const { configHandler } = model.GetHandler();
        this.relativePath = path.join(configHandler.AzextFolder, PathConstants.helpFile);
    }

    public async fullGeneration(): Promise<string[]> {
        const headerGenerator: HeaderGenerator = new HeaderGenerator();
        headerGenerator.disableWildcardImport = true;
        headerGenerator.disableUnusedWildcardImport = true;
        headerGenerator.disableUnusedImport = true;
        let output: string[] = headerGenerator.getLines();
        output = output.concat(this.loadGeneratedHelp(0));
        return output;
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length === 0) {
            return null;
        } else {
            const existingMode: GenerationMode = HeaderGenerator.GetCliGenerationMode(base);
            if (existingMode === GenerationMode.Full) {
                throw new Error(
                    'GenerationMode Error: Should not set Incremental mode on existing Full generation RP.',
                );
            } else {
                // Change base on the manual
                const headerGenerator: HeaderGenerator = new HeaderGenerator();
                headerGenerator.generationMode = GenerationMode.Incremental;
                let output: string[] = headerGenerator.getLines();

                // Pass start comment
                const baseSplit: string[] = base.split(EOL);
                const skipLineIdx = skipCommentLines(baseSplit);
                const keepLineIdx = keepHeaderLines(baseSplit);

                let hasLoadLogic = false;
                if (skipLineIdx !== -1) {
                    for (let i: number = skipLineIdx; i < baseSplit.length; ++i) {
                        if (baseSplit[i].indexOf('from .generated._help import helps') > -1) {
                            hasLoadLogic = true;
                            break;
                        }
                    }
                }

                if (skipLineIdx < keepLineIdx) {
                    output = output.concat(baseSplit.slice(skipLineIdx, keepLineIdx));
                }

                // Add loading code block
                if (!hasLoadLogic) {
                    output = output.concat(this.loadGeneratedHelp(0));
                }

                const appendLineStartIdx = skipLineIdx < keepLineIdx ? keepLineIdx : skipLineIdx;
                if (appendLineStartIdx !== -1) {
                    output = output.concat(baseSplit.slice(appendLineStartIdx));
                }
                return output;
            }
        }
    }

    private loadGeneratedHelp(indent: number): string[] {
        const output: string[] = [];
        const indentStr: string = getIndentString(indent);

        output.push(indentStr + 'from .generated._help import helps  # pylint: disable=reimported');
        output.push(indentStr + 'try:');
        output.push(
            indentStr + '    from .manual._help import helps  # pylint: disable=reimported',
        );
        output.push(indentStr + 'except ImportError as e:');
        output.push(indentStr + "    if e.name.endswith('manual._help'):");
        output.push(indentStr + '        pass');
        output.push(indentStr + '    else:');
        output.push(indentStr + '        raise e');
        output.push('');
        return output;
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
