/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { Parameter, SchemaType } from '@azure-tools/codemodel';
import { ToPythonString, ToMultiLine, isNullOrUndefined } from '../../../utils/helper';
import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import * as path from 'path';
import { PathConstants } from '../../../utils/models';

let allActions: Map<string, boolean>;

export class CliActions extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(
            model.AzextFolder,
            PathConstants.generatedFolder,
            PathConstants.actionFile,
        );
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.generatedFolder,
            PathConstants.actionFile + PathConstants.njxFileExtension,
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
