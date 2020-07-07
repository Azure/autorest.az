/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";
import { isNullOrUndefined } from "util";
import * as fs from 'fs';

export function GenerateDocSourceJsonMap(model: CodeModelAz, docSourceJsonMapPath) : string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    var output: string[] = header.getLines();
    let outputFile = fs.readFileSync(docSourceJsonMapPath).toString().split("\n");
    let docSourceJson = require(docSourceJsonMapPath);
    if (isNullOrUndefined(docSourceJson[model.Extension_NameUnderscored])) {
        let line = '"' + model.Extension_NameUnderscored + '": "' + model.AzureCliFolder + "/" + model.Extension_NameUnderscored + '/_help.py"';
        let cnt = outputFile.length;
        let foundLastLine = false;
        while (cnt > 0) {
            cnt--;
            if (outputFile[cnt][0] == "}") {
                foundLastLine = true;
                continue;
            }
            if (foundLastLine) {
                if (cnt > 1) {
                    outputFile[cnt-1] += ",";
                }
                let indexSize = outputFile[cnt].indexOf('"');
                outputFile.splice(indexSize, 1, line);
                break;
            }
        }
        output = output.concat(outputFile);
    }
    return output;
}
