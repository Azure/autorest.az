/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as fs from 'fs';
import { EOL } from 'os';
import * as path from 'path';
import { getLatestPyPiVersion } from '../../../utils/helper';
import { PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../CodeModelAz';
import { TemplateBase } from '../TemplateBase';

export class CliMainSetupPy extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(model.AzureCliFolder, PathConstants.mainSetupPyFile);
    }

    public fullGeneration(): string[] {
        return this.GenerateAzureCliMainSetUp(this.model, this.relativePath);
    }

    public incrementalGeneration(base: string): string[] {
        return this.GenerateAzureCliMainSetUp(this.model, this.relativePath);
    }

    private GenerateAzureCliMainSetUp(model: CodeModelAz, requirementPath) {
        const outputFile = fs.readFileSync(requirementPath).toString().split(EOL);
        const packageName = model.GetPythonPackageName();
        const latestVersion = getLatestPyPiVersion(packageName);
        let found = false;
        let cnt = 0;
        const line = "'" + packageName + '~=' + latestVersion + "'";
        let beginLine = -1;
        let endLine = -1;
        for (const line of outputFile) {
            if (line.startsWith('DEPENDENCIES')) {
                beginLine = cnt;
            }

            if (beginLine > -1 && endLine === -1) {
                if (line[0] === ']') {
                    endLine = cnt;
                }
                const idx = line.indexOf(packageName);
                if (idx > 0) {
                    const charAfter = line[idx + packageName.length];
                    if (charAfter.toUpperCase() !== charAfter) {
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
            const len = outputFile[endLine - 1].length;
            if (outputFile[endLine - 1][len - 1] === '\r') {
                outputFile[endLine - 1] = outputFile[endLine - 1].replace('\r', ',');
            } else {
                outputFile[endLine - 1] += ',';
            }
            outputFile.splice(endLine, 0, '    ' + line);
        }
        return outputFile;
    }

    public GetRenderData(model: CodeModelAz): string[] {
        const output: string[] = [];
        return output;
    }
}
