/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as fs from 'fs';
import { EOL } from 'os';
import { getLatestPyPiVersion } from '../../../utils/helper';
import { CodeModelAz } from '../../CodeModelAz';
import { TemplateBase } from '../TemplateBase';

export class CliMainRequirement extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
    }

    public fullGeneration(): string[] {
        return this.GenerateRequirementTxt(this.model, this.relativePath);
    }

    public incrementalGeneration(base: string): string[] {
        return this.GenerateRequirementTxt(this.model, this.relativePath);
    }

    private GenerateRequirementTxt(model: CodeModelAz, requirementPath) {
        const outputFile = fs.readFileSync(requirementPath).toString().split(EOL);
        const latestVersion = getLatestPyPiVersion(model.GetPythonPackageName());
        let found = false;

        const line = model.GetPythonPackageName() + '==' + latestVersion;
        for (const dependency of outputFile) {
            if (dependency.indexOf(model.GetPythonPackageName() + '==') > -1) {
                found = true;
                break;
            }
        }
        if (!found) {
            if (outputFile.last.length === 0) {
                outputFile[outputFile.length - 1] = line;
            } else {
                outputFile.push(line);
            }
        }
        return outputFile;
    }

    public GetRenderData(model: CodeModelAz): string[] {
        const output: string[] = [];
        return output;
    }
}
