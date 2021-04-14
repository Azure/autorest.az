/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as fs from 'fs';
import * as path from 'path';
import { CodeModelAz } from '../codemodel/CodeModelAz';
import { TemplateBase } from '../renders/TemplateBase';
import { inplaceGen } from '../../utils/inplace';
import { AzConfiguration, CodeGenConstants, TemplateRender } from '../../utils/models';
import { CodeModelCliImpl } from '../codemodel/CodeModelAzImpl';

export abstract class GeneratorBase {
    model: CodeModelAz;
    files: any = {};
    azDirectory: string;
    isDebugMode: boolean;
    templates: TemplateRender[];
    azOutputFolder: string;

    constructor(model: CodeModelAz) {
        this.model = model;
        this.azDirectory = '';
        this.isDebugMode = AzConfiguration.getValue(CodeGenConstants.debug);
        const { configHandler } = model.GetHandler();
        this.azOutputFolder = configHandler.azOutputFolder;
    }

    public abstract generateAll(): Promise<void>;

    protected async generateFullSingleAndAddtoOutput(
        template: TemplateBase,
        override = true,
        inplace = false,
    ): Promise<void> {
        if (
            override !== false ||
            !fs.existsSync(path.join(this.azOutputFolder, template.relativePath))
        ) {
            const genContent = await template.fullGeneration();
            if (template.skip) {
                return;
            }
            if (inplace) {
                this.files[template.relativePath] = inplaceGen(
                    this.azOutputFolder,
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
        if (fs.existsSync(path.join(this.azOutputFolder, template.relativePath))) {
            base = fs
                .readFileSync(path.join(this.azOutputFolder, template.relativePath))
                .toString();
        }
        const genContent = await template.incrementalGeneration(base);
        if (template.skip) {
            return;
        }
        if (inplace) {
            this.files[template.relativePath] = inplaceGen(
                this.azOutputFolder,
                template.relativePath,
                genContent,
            );
        } else {
            this.files[template.relativePath] = genContent;
        }
    }
}
