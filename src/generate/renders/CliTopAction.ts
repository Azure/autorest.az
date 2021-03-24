/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import * as fs from 'fs';
import {
    getIndentString,
    keepHeaderLines,
    skipCommentLines,
    isNullOrUndefined,
} from '../../utils/helper';
import { GenerationMode, PathConstants } from '../../utils/models';
import { CodeModelAz } from '../CodeModelAz';
import { HeaderGenerator } from './Header';
import { TemplateBase } from './TemplateBase';

export class CliTopAction extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(model.AzextFolder, PathConstants.actionFile);
        const relativePathOldVersion = this.relativePath.replace(
            PathConstants.actionFile,
            PathConstants.actionFileOldVersion,
        );
        if (fs.existsSync(path.join(model.azOutputFolder, relativePathOldVersion))) {
            this.relativePath = relativePathOldVersion;
        }
    }

    public async fullGeneration(): Promise<string[]> {
        const headerGenerator: HeaderGenerator = new HeaderGenerator();
        headerGenerator.disableWildcardImport = true;
        headerGenerator.disableUnusedWildcardImport = true;
        let output: string[] = headerGenerator.getLines();
        output = output.concat(this.loadGeneratedAction(0));
        return output;
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length === 0) {
            const headerGenerator: HeaderGenerator = new HeaderGenerator();
            headerGenerator.disableWildcardImport = true;
            headerGenerator.disableUnusedWildcardImport = true;
            headerGenerator.generationMode = GenerationMode.Incremental;
            let output: string[] = headerGenerator.getLines();
            output = output.concat(this.loadGeneratedAction(0));
            return output;
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
                    for (let i: number = skipLineIdx + 1; i < baseSplit.length; ++i) {
                        if (baseSplit[i].indexOf('from .generated.action import *') > -1) {
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
                    output = output.concat(this.loadGeneratedAction(0));
                }

                const appendLineStartIdx = skipLineIdx < keepLineIdx ? keepLineIdx : skipLineIdx;
                if (appendLineStartIdx !== -1) {
                    output = output.concat(baseSplit.slice(appendLineStartIdx));
                }
                return output;
            }
        }
    }

    private loadGeneratedAction(indent: number): string[] {
        const output: string[] = [];
        const indentStr: string = getIndentString(indent);

        output.push('');
        output.push(indentStr + 'from .generated.action import *  # noqa: F403');
        output.push(indentStr + 'try:');
        output.push(indentStr + '    from .manual.action import *  # noqa: F403');
        output.push('except ImportError as e:');
        output.push("    if e.name.endswith('manual.action'):");
        output.push('        pass');
        output.push('    else:');
        output.push('        raise e');
        output.push('');
        return output;
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
