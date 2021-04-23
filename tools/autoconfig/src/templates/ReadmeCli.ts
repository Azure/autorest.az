/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as fs from 'fs';

function genBasicInfo(output: string[]) {
    output.push('');
    output.push('');
    output.push('## Azure CLI');
    output.push('');
    output.push('These settings apply only when `--cli` is specified on the command line.');
    output.push('');
    output.push('``` yaml $(cli)');
    output.push('```');
}

export function GenerateReadmeCli(fullPath: string): string[] {
    const output: string[] = [];
    if (!fs.existsSync(fullPath)) {
        genBasicInfo(output);
        fs.writeFileSync(fullPath, output.join('\n'));
    }
    return output;
}
