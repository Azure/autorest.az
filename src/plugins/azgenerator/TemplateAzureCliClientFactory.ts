/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";
import { isNullOrUndefined } from "util";

export function GenerateAzureCliClientFactory(model: CodeModelAz, cliCoreLib: string): string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    var output: string[] = header.getLines();
    model.SelectFirstCommandGroup();
    output.push("");
    output.push("");
    output.push("def cf_" + model.Extension_NameUnderscored + "_cl(cli_ctx, *_):");
    output.push("    from " + cliCoreLib + ".commands.client_factory import get_mgmt_service_client");
    output.push("    from ..vendored_sdks." + model.PythonOperationsName + " import " + model.PythonMgmtClient);

    if (!isNullOrUndefined(model.Extension_ClientAuthenticationPolicy)) {
        output.push("    from azure.core.pipeline.policies import " + model.Extension_ClientAuthenticationPolicy);
    }

    // Start handle arguments
    output.push("    return get_mgmt_service_client(cli_ctx,");
    output.push("                                   " + model.PythonMgmtClient);
    if (!isNullOrUndefined(model.Extension_ClientSubscriptionBound)) {
        output.push(output.pop() + ",");
        output.push("                                   subscription_bound=" + (model.Extension_ClientSubscriptionBound ? "True" : "False"));
    }
    if (!isNullOrUndefined(model.Extension_ClientBaseUrlBound)) {
        output.push(output.pop() + ",");
        output.push("                                   base_url_bound=" + (model.Extension_ClientBaseUrlBound ? "True" : "False"));
    }
    if (!isNullOrUndefined(model.Extension_ClientAuthenticationPolicy)) {
        output.push(output.pop() + ",");
        output.push("                                   authentication_policy=" + model.Extension_ClientAuthenticationPolicy + "()");
    }
    output.push(output.pop()+ ")");
    // End

    if (model.SelectFirstCommandGroup()) {
        do {
            if (model.GetModuleOperationName() != "") {
                output.push("");
                output.push("");

                output.push("def cf_" + model.GetModuleOperationName() + "(cli_ctx, *_):");
                output.push("    return cf_" + model.Extension_NameUnderscored + "_cl(cli_ctx)." + model.GetModuleOperationNamePython());
            }
        } while (model.SelectNextCommandGroup());
    }

    output.push("");

    return output;
}
