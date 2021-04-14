/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../codemodel/CodeModelAz';
import { putToZip } from '../../utils/inplace';

export function GenerateMetaFile(model: CodeModelAz) {
    const { configHandler } = model.GetHandler();
    const output: string[] = JSON.stringify(model.GetMetaData(), null, 2).split('\n');

    putToZip(configHandler.azOutputFolder, 'meta.txt', output);
}
