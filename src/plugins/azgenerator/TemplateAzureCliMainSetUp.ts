/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";
import { isNullOrUndefined } from "util";
import { EOL } from 'os';
import * as fs from 'fs';
import { getLatestPyPiVersion } from '../../utils/helper'

export async function GenerateAzureCliMainSetUp(model: CodeModelAz, requirementPath) {
    let header: HeaderGenerator = new HeaderGenerator();
    let outputFile = fs.readFileSync(requirementPath).toString().split(EOL);
    let packageName = model.GetPythonPackageName();
    let latestVersion = await getLatestPyPiVersion(packageName);
    let found = false;
    let cnt = 0;
    let line = "'" + packageName + "~=" + latestVersion + "'";
    let beginLine = -1, endLine = -1;
    for(let line of outputFile) {
        
        if (line.startsWith("DEPENDENCIES")) {
            beginLine = cnt;
        }
        if (beginLine > -1 && endLine == -1) {
            if (line[0] == ']') {
                endLine = cnt;
            }
            let idx = line.indexOf(packageName);
            if (idx > 0) {
                let charAfter =  line[idx + packageName.length];
                if(charAfter.toUpperCase() !=  charAfter) {
                    found = false;
                } else {
                    found = true;
                    break;
                }
            }

        } else if (beginLine > 0 && endLine > 0) {
            break;
        }
        cnt++;
        
    }
    if (!found && beginLine > 0 && endLine > 1) {
        let len = outputFile[endLine - 1].length;
        if(outputFile[endLine - 1][len - 1] == '\r') {
            outputFile[endLine - 1] = outputFile[endLine - 1].replace('\r', ',');
        } else {
            outputFile[endLine - 1] += ",";
        }
        outputFile.splice(endLine, 0, "    " + line)
    }
    return outputFile;
}
