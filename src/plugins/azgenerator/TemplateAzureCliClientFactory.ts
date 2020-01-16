/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliClientFactory(model: CodeModelAz) : string[] {
    var output: string[] = [];
    model.SelectFirstCommandGroup();
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("");
    output.push("");
    output.push("def cf_" + model.Extension_NameUnderscored + "(cli_ctx, *_):");
    output.push("    from azure.cli.core.commands.client_factory import get_mgmt_service_client");
    output.push("    from .vendored_sdks." + model.PythonOperationsName + " import " + model.PythonMgmtClient);
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
                output.push("    return cf_" + model.Extension_NameUnderscored + "(cli_ctx)." + model.GetModuleOperationName());
            }
        } while (model.SelectNextCommandGroup());
    }
    
    output.push("");

    return output;
}
