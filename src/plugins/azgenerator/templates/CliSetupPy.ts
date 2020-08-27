/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EOL } from 'os';
import { isNullOrUndefined } from "util";
import { CodeGenConstants, GenerationMode, PathConstants } from "../../models";
import { CodeModelAz } from "../CodeModelAz";
import { HeaderGenerator } from "../Header";
import { GenerateAzureCliSetupPy } from "../TemplateAzureCliSetupPy";
import { TemplateBase } from "./TemplateBase";
import compareVersions = require('compare-versions');

export class CliSetupPy extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.relativePath = PathConstants.setupPyFile;
    }

    public fullGeneration(): string[] {
        return GenerateAzureCliSetupPy(this.model);
    }

    public incrementalGeneration(base: string): string[] {
        if (isNullOrUndefined(base) || base.length == 0) {
            return this.fullGeneration();
        }
        else {
            let existingMode: GenerationMode = HeaderGenerator.GetCliGenerationMode(base);
            if (existingMode == GenerationMode.Full) {
                throw new Error("GenerationMode Error: Should not set Incremental mode on existing Full generation RP.");
            }
            else {
                const rst = compareVersions(CodeGenConstants.minCliCoreVersion, "2.3.1");
                if (rst == 0 || rst == 1) {
                    const baseSplit: string[] = base.split(EOL);
                    const headerGenerator: HeaderGenerator = new HeaderGenerator();
                    headerGenerator.generationMode = GenerationMode.Incremental;
                    let output: string[] = headerGenerator.getLines();

                    let firstNoneCommentLineIdx: number = -1;
                    let skipcomment: number = 2;
                    for (let i: number = 0; i < baseSplit.length; ++i) {
                        if (baseSplit[i].startsWith("# ----")) {
                            skipcomment--;
                            if (skipcomment == 0) {
                                firstNoneCommentLineIdx = i;
                                break;
                            }
                        }
                    }
                    if (firstNoneCommentLineIdx != -1) {
                        for (let i: number = firstNoneCommentLineIdx + 1; i < baseSplit.length; ++i) {
                            if (!(baseSplit[i].indexOf("'Programming Language :: Python :: 2',") > -1 
                                || baseSplit[i].indexOf("'Programming Language :: Python :: 2.7',") > -1)) {
                                output.push(baseSplit[i]);
                            }
                        }
                    }
                    return output;
                }
            }
        }
    }
}