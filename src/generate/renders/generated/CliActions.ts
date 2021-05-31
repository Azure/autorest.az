/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { TemplateBase } from '../TemplateBase';
import * as path from 'path';
import { PathConstants } from '../../../utils/models';

export class CliActions extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        const { configHandler } = this.model.GetHandler();
        this.relativePath = path.join(
            configHandler.AzextFolder,
            PathConstants.generatedFolder,
            PathConstants.actionFile,
        );
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.generatedFolder,
            PathConstants.actionFile + PathConstants.njkFileExtension,
        );
    }

    public async GetRenderData(): Promise<Record<string, unknown>> {
        const data = { imports: [], pylints: [], actions: [] };
        data.actions = this.model.GetActionData();
        data['pylints'].push('# pylint: disable=protected-access', '# pylint: disable=no-self-use');
        const result = { data: { imports: [], pylints: [] } };
        result.data = data;
        return result;
    }

    public async fullGeneration(): Promise<string[]> {
        return this.render();
    }

    public async incrementalGeneration(): Promise<string[]> {
        return this.render();
    }
}
