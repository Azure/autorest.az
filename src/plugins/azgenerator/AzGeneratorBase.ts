/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import * as path from 'path';
import { CodeModelAz } from "./CodeModelAz";
import { TemplateBase } from "./templates/TemplateBase";

export abstract class AzGeneratorBase {
    model: CodeModelAz;
    files: {} = {};
    azDirectory: string;
    isDebugMode: boolean;

    constructor(model: CodeModelAz, isDebugMode: boolean) {
        this.model = model;
        this.azDirectory = "";
        this.isDebugMode = isDebugMode;
    }

    public abstract async generateAll(): Promise<void>;

    protected async generateFullSingleAndAddtoOutput(template: TemplateBase, override: boolean = true): Promise<void> {
        if (override == false && fs.existsSync(path.join(this.model.CliOutputFolder, template.relativePath))) {
            return;
        }
        else {
            this.files[template.relativePath] = await template.fullGeneration();
        }
    }

    protected async generateIncrementalSingleAndAddtoOutput(template: TemplateBase): Promise<void> {
        let base: string = "";
        if (fs.existsSync(path.join(this.model.CliOutputFolder, template.relativePath))) {
            base = fs.readFileSync(path.join(this.model.CliOutputFolder, template.relativePath)).toString();
        }
        this.files[template.relativePath] = await template.incrementalGeneration(base);
    }
}