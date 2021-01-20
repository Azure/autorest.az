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
import { CodeModelAz } from '../CodeModelAz';
import { HeaderGenerator } from './Header';
import { TemplateBase } from './TemplateBase';

export class CliTopHelp extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.helpFile);
        } else {
            this.relativePath = path.join(model.AzextFolder, PathConstants.helpFile);
        }
    }

    public fullGeneration(): string[] {
        // Nothing need to do as Full Generation will not have top level help
        return null;
    }

    public incrementalGeneration(base: string): string[] {
        if (isNullOrUndefined(base) || base.length === 0) {
            return null;
        } else {
            const existingMode: GenerationMode = HeaderGenerator.GetCliGenerationMode(base);
            if (existingMode === GenerationMode.Full) {
                throw new Error(
                    'GenerationMode Error: Should not set Incremental mode on existing Full generation RP.',
                );
            } else if (existingMode === GenerationMode.Incremental) {
                // No need more incremental change
                return base.split(EOL);
            } else {
                // Change base on the manual
                const headerGenerator: HeaderGenerator = new HeaderGenerator();
                headerGenerator.generationMode = GenerationMode.Incremental;
                let output: string[] = headerGenerator.getLines();

                // Pass start comment
                const baseSplit: string[] = base.split(EOL);
                const skipLineIdx = skipCommentLines(baseSplit);
                const keepLineIdx = keepHeaderLines(baseSplit);

                if (skipLineIdx < keepLineIdx) {
                    output = output.concat(baseSplit.slice(skipLineIdx, keepLineIdx));
                }

                // Add loading code block
                output = output.concat(this.loadGeneratedHelp(0));

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
        output.push(indentStr + 'except ImportError:');
        output.push(indentStr + '    pass');
        return output;
    }

    public GetRenderData(model: CodeModelAz): string[] {
        const output: string[] = [];
        return output;
    }
}
