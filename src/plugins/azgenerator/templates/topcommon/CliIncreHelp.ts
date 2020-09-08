/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from "util";
import { getIndentString, skipCommentLines, keepHeaderLines } from "../../../../utils/helper";
import { GenerationMode, PathConstants } from "../../../models";
import { CodeModelAz } from "../../CodeModelAz";
import { HeaderGenerator } from "../../Header";
import { TemplateBase } from "../TemplateBase";

export class CliTopHelp extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.helpFile);
        }
        else {
            this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.helpFile);
        }
    }

    public async fullGeneration(): Promise<string[]> {
        // Nothing need to do
        return null;
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length == 0) {
            // No base version
            return this.fullGeneration();
        }
        else {
            const existingMode: GenerationMode = HeaderGenerator.GetCliGenerationMode(base);
            if (existingMode == GenerationMode.Full) {
                throw new Error("GenerationMode Error: Should not set Incremental mode on existing Full generation RP.");
            }
            else if (existingMode == GenerationMode.Incremental) {
                // No need more incremental change
                return base.split(EOL);
            }
            else {
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
                if (appendLineStartIdx != -1) {
                    output = output.concat(baseSplit.slice(appendLineStartIdx));
                }
                return output;
            }
        }
    }

    private loadGeneratedHelp(indent: number): string[] {
        let output: string[] = [];
        let indentStr: string = getIndentString(indent);

        output.push(indentStr + "try:");
        output.push(indentStr + "    from .generated._help import helps  # pylint: disable=reimported");
        output.push(indentStr + "    from .manual._help import helps  # pylint: disable=reimported");
        output.push(indentStr + "except ImportError:");
        output.push(indentStr + "    pass");
        return output;
    }
}