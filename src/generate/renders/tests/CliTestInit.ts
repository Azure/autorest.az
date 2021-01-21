/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { CodeModelAz } from '../../CodeModelAz';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../utils/models';

export class CliTestInit extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.testFolder, PathConstants.initFile);
        } else {
            this.relativePath = path.join(
                model.AzextFolder,
                PathConstants.testFolder,
                PathConstants.initFile,
            );
        }
        this.tmplPath = path.join(`${__dirname}`, '../../../../src/templates/tests/init.py.njx');
    }

    public async fullGeneration(): Promise<string[]> {
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
