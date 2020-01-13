/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliReadme(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("Microsoft Azure CLI '" + model.Extension_Name + "' Extension");
    output.push("==========================================");
    output.push("");
    output.push("This package is for the '" + model.Extension_Name + "' extension.");
    output.push("i.e. 'az " + model.Extension_Name + "'");
    output.push("");

    return output;
}
