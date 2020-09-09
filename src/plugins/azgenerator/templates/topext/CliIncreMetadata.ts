/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from "util";
import { AzextMetadata, PathConstants, CodeGenConstants } from "../../../models";
import { CodeModelAz } from "../../CodeModelAz";
import { GenerateAzureCliAzextMetadata } from "./CliFullMetadata";
import { TemplateBase } from "../TemplateBase";

export class CliTopMetadata extends TemplateBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.metadataFile);
    }

    public async fullGeneration(): Promise<string[]> {
        return GenerateAzureCliAzextMetadata(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length == 0) {
            return this.fullGeneration();
        }
        else {
            let t: AzextMetadata = JSON.parse(base);
            t["azext.minCliCoreVersion"] = CodeGenConstants.minCliCoreVersion;
            let output: string[] = JSON.stringify(t, null, "    ").split(EOL);
            return output;
        }
    }
}