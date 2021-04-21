/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as fs from 'fs';
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../../../utils/helper';
import { PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { TemplateBase } from '../TemplateBase';

export class CliMainDocSourceJsonMap extends TemplateBase {
    constructor(model: CodeModelAz) {
        const { configHandler } = model.GetHandler();
        super(model);
        this.relativePath = path.join(
            configHandler.AzureCliFolder,
            PathConstants.docSourceJsonFile,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateDocSourceJsonMap(this.model, this.relativePath);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return null;
    }

    private GenerateDocSourceJsonMap(model: CodeModelAz, docSourceJsonMapPath): string[] {
        const { extensionHandler } = this.model.GetHandler();
        const outputFile = fs.readFileSync(docSourceJsonMapPath).toString().split(EOL);
        const docSourceJson = JSON.parse(fs.readFileSync(docSourceJsonMapPath).toString());
        if (isNullOrUndefined(docSourceJson[extensionHandler.Extension_NameUnderscored])) {
            const line =
                '"' +
                extensionHandler.Extension_Name +
                '": "src/azure-cli/azure/cli/command_modules/' +
                extensionHandler.Extension_Name +
                '/_help.py"';
            let cnt = outputFile.length;
            let foundLastLine = false;
            while (cnt > 0) {
                cnt--;
                if (outputFile[cnt][0] === '}') {
                    foundLastLine = true;
                    continue;
                }
                if (foundLastLine) {
                    const len = outputFile[cnt].length;
                    if (outputFile[cnt][len - 1] === '\r') {
                        outputFile[cnt] = outputFile[cnt].replace('\r', ',');
                    } else {
                        outputFile[cnt] += ',';
                    }
                    const indexSize = outputFile[cnt].indexOf('"');
                    outputFile.splice(cnt + 1, 0, ' '.repeat(indexSize) + line);
                    break;
                }
            }
        }
        return outputFile;
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
