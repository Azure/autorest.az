/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliSetupCfg(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("[bdist_wheel]");
    output.push("universal=1");
    output.push("");
     
    return output;
}
