/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../CodeModelAz';
import { putToZip } from '../../../utils/inplace';

export function GenerateMetaFile(model: CodeModelAz) {
    const output: string[] = JSON.stringify(model.GetMetaData(), null, 2).split('\n');

    putToZip(model.azOutputFolder, 'meta.txt', output);
}
