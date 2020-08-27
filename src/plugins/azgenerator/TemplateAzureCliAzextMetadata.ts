/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliAzextMetadata(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push('{');
    if(model.Extension_Mode == 'experimental') {
        output.push('    "azext.isExperimental": true,');
    } else if(model.Extension_Mode == 'preview') {
        output.push('    "azext.isPreview": true,');
    }
    
    output.push('    "azext.minCliCoreVersion": "2.11.0"');
    output.push('}');

    return output;
}
