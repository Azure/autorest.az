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
import { GenerateAzureCliInit } from "./CliFullInit";
import { TemplateBase } from "../TemplateBase";

export class CliTopInit extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.initFile);
    }

    public fullGeneration(): string[] {
        return GenerateAzureCliInit(this.model);
    }

    public incrementalGeneration(base: string): string[] {
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

                let loadtableIndex: number = -1;
                let loadargIndex: number = -1;
                for (let i = 0; i < output.length; ++i) {
                    if (output[i].indexOf("load_command_table") != -1) {
                        loadtableIndex = i;
                    }
                    if (output[i].indexOf("load_arguments") != -1) {
                        loadargIndex = i;
                    }
                }

                if (loadargIndex != -1) {
                    let indent: number = output[loadargIndex].indexOf("l");
                    let insertLines: string[] = this.loadGeneratedArguments(indent);
                    output.splice(loadargIndex + 1, 0, ...insertLines);
                }

                if (loadtableIndex != -1) {
                    let indent: number = output[loadtableIndex].indexOf("l");
                    let insertLines: string[] = this.loadGeneratedCommands(indent);
                    output.splice(loadtableIndex + 1, 0, ...insertLines);
                }

                return output;
            }
        }
    }

    private loadGeneratedArguments(indent: number): string[] {
        let output: string[] = [];
        let indentStr: string = getIndentString(indent);

        output.push(indentStr + "try:");
        output.push(indentStr + "    from .generated._params import load_arguments as load_arguments_generated");
        output.push(indentStr + "    load_arguments_generated(self, command)");
        output.push(indentStr + "    from .manual._params import load_arguments as load_arguments_manual");
        output.push(indentStr + "    load_arguments_manual(self, command)");
        output.push(indentStr + "except ImportError:");
        output.push(indentStr + "    pass");
        return output;
    }

    private loadGeneratedCommands(indent: number): string[] {
        let output: string[] = [];
        let indentStr: string = getIndentString(indent);

        output.push(indentStr + "try:");
        output.push(indentStr + "    from .generated.commands import load_command_table as load_command_table_generated");
        output.push(indentStr + "    load_command_table_generated(self, args)");
        output.push(indentStr + "    from .manual.commands import load_command_table as load_command_table_manual");
        output.push(indentStr + "    load_command_table_manual(self, args)");
        output.push(indentStr + "except ImportError:");
        output.push(indentStr + "    pass");
        return output;
    }
}