﻿/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";

export function GenerateAzureCliClientFactory(model: CodeModelAz) : string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    var output: string[] = header.getLines();
    model.SelectFirstCommandGroup();
    output.push("");
    output.push("");
    output.push("def cf_" + model.Extension_NameUnderscored + "(cli_ctx, *_):");
    output.push("    from azure.cli.core.commands.client_factory import get_mgmt_service_client");
    output.push("    from ..vendored_sdks." + model.PythonOperationsName + " import " + model.PythonMgmtClient);
    output.push("    return get_mgmt_service_client(cli_ctx, " + model.PythonMgmtClient + ")");

    if (model.SelectFirstCommandGroup())
    {
        do
        {
            if (model.GetModuleOperationName() != "")
            {
                output.push("");
                output.push("");
                output.push("def cf_" + model.GetModuleOperationName() + "(cli_ctx, *_):");
                output.push("    return cf_" + model.Extension_NameUnderscored + "(cli_ctx)." + model.GetModuleOperationNamePython());
            }
        } while (model.SelectNextCommandGroup());
    }
    
    output.push("");

    return output;
}
