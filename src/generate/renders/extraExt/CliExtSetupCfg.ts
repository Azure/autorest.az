/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../codemodel/CodeModelAz';
import * as path from 'path';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../utils/models';

export class CliExtSetupCfg extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = PathConstants.setupCfgFile;
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.setupCfgFile + PathConstants.njkFileExtension,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public async GetRenderData(model: CodeModelAz): Promise<unknown> {
        return {};
    }
}
