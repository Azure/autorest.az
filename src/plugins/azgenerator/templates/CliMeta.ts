/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../CodeModelAz"
import { putToZip } from "../../../utils/inplace"

export function GenerateMetaFile(model: CodeModelAz) {
    var output: string[] = [];

    const path=require('path');
    const azpkg = path.join(__dirname, "..","..","..","..", "package.json")
    var pjson = require(azpkg);
    output.push(`${pjson.name} version: ${pjson.version}`);
    putToZip(model.CliOutputFolder, "meta.txt", output);
}
