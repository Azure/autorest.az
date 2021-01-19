/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as fs from 'fs';
import * as path from 'path';
import { CodeModelAz } from './CodeModelAz';
import { TemplateBase } from './renders/TemplateBase';
import { inplaceGen } from '../utils/inplace';
import { AzConfiguration, CodeGenConstants } from '../utils/models';

export abstract class AzGeneratorBase {
    model: CodeModelAz;
    files: any = {};
    azDirectory: string;
    isDebugMode: boolean;

    constructor(model: CodeModelAz) {
        this.model = model;
        this.azDirectory = '';
        this.isDebugMode = AzConfiguration.getValue(CodeGenConstants.debug);
    }

    public abstract generateAll(): Promise<void>;

    protected async generateFullSingleAndAddtoOutput(
        template: TemplateBase,
        override = true,
        inplace = false,
    ): Promise<void> {
        if (
            override !== false ||
            !fs.existsSync(path.join(this.model.azOutputFolder, template.relativePath))
        ) {
            const genContent = template.fullGeneration();
            if (inplace) {
                this.files[template.relativePath] = inplaceGen(
                    this.model.azOutputFolder,
                    template.relativePath,
                    genContent,
                );
            } else {
                this.files[template.relativePath] = genContent;
            }
        }
    }

    protected async generateIncrementalSingleAndAddtoOutput(
        template: TemplateBase,
        inplace = false,
    ): Promise<void> {
        let base = '';
        if (fs.existsSync(path.join(this.model.azOutputFolder, template.relativePath))) {
            base = fs
                .readFileSync(path.join(this.model.azOutputFolder, template.relativePath))
                .toString();
        }
        const genContent = template.incrementalGeneration(base);
        if (inplace) {
            this.files[template.relativePath] = inplaceGen(
                this.model.azOutputFolder,
                template.relativePath,
                genContent,
            );
        } else {
            this.files[template.relativePath] = genContent;
        }
    }
}
