/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../../../utils/helper';
import {
    AzextMetadata,
    CodeGenConstants,
    PathConstants,
    ExtensionMode,
} from '../../../utils/models';
import { CodeModelAz } from '../../CodeModelAz';
import { TemplateBase } from '../TemplateBase';
import * as nunjucks from 'nunjucks';

export class CliTopMetadata extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(model.AzextFolder, PathConstants.metadataFile);
        this.tmplPath = path.join(
            `${__dirname}`,
            '../../../../templates/azext/azext_metadata.json.njx',
        );
    }

    public fullGeneration(): string[] {
        return this.GenerateAzureCliAzextMetadata(this.model);
    }

    public incrementalGeneration(base: string): string[] {
        if (isNullOrUndefined(base) || base.length === 0) {
            return this.fullGeneration();
        } else {
            const t: AzextMetadata = JSON.parse(base);
            t['azext.minCliCoreVersion'] = CodeGenConstants.minCliCoreVersion;
            const output: string[] = JSON.stringify(t, null, '    ').split(EOL);
            return output;
        }
    }

    private GenerateAzureCliAzextMetadata(model: CodeModelAz): string[] {
        const output = [];
        return output;
    }

    public GetRenderData(model: CodeModelAz): any {
        const output: string[] = [];
        return output;
    }
}
