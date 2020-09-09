/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from "util";
import { getIndentString } from "../../../../utils/helper";
import { GenerationMode, PathConstants } from "../../../models";
import { CodeModelAz } from "../../CodeModelAz";
import { HeaderGenerator } from "../../Header";
import { TemplateBase } from "../TemplateBase";

export class CliTopHelp extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.helpFile);
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

                // Add loading code block
                output.push("");
                output = output.concat(this.loadGeneratedHelp(0));

                // Pass start comment
                const baseSplit: string[] = base.split(EOL);
                let firstNoneCommentLineIdx: number = -1;
                for (let i: number = 0; i < baseSplit.length; ++i) {
                    if (!baseSplit[i].startsWith("#")) {
                        firstNoneCommentLineIdx = i;
                        break;
                    }
                }
                if (firstNoneCommentLineIdx != -1) {
                    output = output.concat(baseSplit.slice(firstNoneCommentLineIdx));
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