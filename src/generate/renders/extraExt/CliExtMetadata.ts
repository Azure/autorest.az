/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../../../utils/helper';
import { AzextMetadata, CodeGenConstants, PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../CodeModelAz';
import { TemplateBase } from '../TemplateBase';

export class CliTopMetadata extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(model.AzextFolder, PathConstants.metadataFile);
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            'azext/azext_metadata.json.njx',
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliAzextMetadata(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length === 0) {
            return this.fullGeneration();
        } else {
            const t: AzextMetadata = JSON.parse(base);
            t['azext.minCliCoreVersion'] = CodeGenConstants.minCliCoreVersion;
            const output: string[] = JSON.stringify(t, null, '    ').split(EOL);
            return output;
        }
    }

    private async GenerateAzureCliAzextMetadata(model: CodeModelAz): Promise<string[]> {
        const output = await this.render();
        return output;
    }

    public async GetRenderData(model: CodeModelAz): Promise<any> {
        const data = {
            model: {
                Extension_Mode: model.Extension_Mode,
                minCliCoreVersion: CodeGenConstants.minCliCoreVersion,
            },
        };
        return data;
    }
}
