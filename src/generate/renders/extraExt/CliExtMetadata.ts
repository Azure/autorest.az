/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../../../utils/helper';
import { AzextMetadata, CodeGenConstants, PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { TemplateBase } from '../TemplateBase';

export class CliTopMetadata extends TemplateBase {
    constructor(model: CodeModelAz) {
        const { configHandler } = model.GetHandler();
        super(model);
        this.relativePath = path.join(configHandler.AzextFolder, PathConstants.metadataFile);
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            'azext',
            PathConstants.metadataFile + PathConstants.njkFileExtension,
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
        const { extensionHandler } = model.GetHandler();
        const data = {
            model: {
                Extension_Mode: extensionHandler.Extension_Mode,
                minCliCoreVersion: CodeGenConstants.minCliCoreVersion,
            },
        };
        return data;
    }
}
