/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../../../../utils/helper';
import { AzextMetadata, CodeGenConstants, PathConstants } from '../../../models';
import { CodeModelAz } from '../../CodeModelAz';
import { TemplateBase } from '../TemplateBase';

export class CliTopMetadata extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.relativePath = path.join(model.AzextFolder, PathConstants.metadataFile);
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

    private GenerateAzureCliAzextMetadata(model: CodeModelAz): string[] {
        const output: string[] = [];

        output.push('{');
        if (model.Extension_Mode === 'experimental') {
            output.push('    "azext.isExperimental": true,');
        } else if (model.Extension_Mode === 'preview') {
            output.push('    "azext.isPreview": true,');
        }

        output.push('    "azext.minCliCoreVersion": "' + CodeGenConstants.minCliCoreVersion + '"');
        output.push('}');

        return output;
    }
}
