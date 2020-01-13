/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliAzextMetadata(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push('{');
    output.push('    "azext.isPreview": true,');
    output.push('    "azext.minCliCoreVersion": "2.0.67",');
    output.push('    "azext.maxCliCoreVersion": "3.0.0"');
    output.push('}');

    return output;
}
