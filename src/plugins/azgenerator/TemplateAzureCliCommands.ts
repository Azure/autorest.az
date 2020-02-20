/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliCommands(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("");
    output.push("# pylint: disable=line-too-long");
    output.push("# pylint: disable=too-many-lines");
    output.push("# pylint: disable=too-many-statements");
    output.push("# pylint: disable=too-many-locals");
    output.push("from azure.cli.core.commands import CliCommandType");
    output.push("");
    output.push("");
    output.push("def load_command_table(self, _):");
    
    if (model.SelectFirstCommandGroup())
    {
        do
        {
            // if disabled
            if (model.Command_Name == "-")
                continue;

            if (model.SelectFirstCommand())
            {
                output.push("");

                let cf_name: string = "cf_" + ((model.GetModuleOperationName() != "") ? model.GetModuleOperationName() :  model.Extension_NameUnderscored);
                output.push("    from ._client_factory import " + cf_name);
                output.push("    " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + " = CliCommandType(");
                
                if (true)
                {
                    output.push("        operations_tmpl='azext_" + model.Extension_NameUnderscored + ".vendored_sdks." + model.PythonOperationsName + ".operations._" + model.GetModuleOperationName() + "_operations#" + model.GetModuleOperationNameUpper() + "Operations" + ".{}',");
                }
                else
                {
                    // enable this if using package
                    output.push("        operations_tmpl='" + model.GetPythonNamespace() + ".operations." + model.GetModuleOperationName() + "_operations#" + model.GetModuleOperationNameUpper() + "Operations" + ".{}',");
                }
                
                output.push("        client_factory=" + cf_name + ")");

                output.push("    with self.command_group('" + model.CommandGroup_Name + "', " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + ", client_factory=" + cf_name + ") as g:");
                do
                {
                    output = output.concat(getCommandBody(model));
                    if(model.Command_CanSplit) {
                        output = output.concat(getCommandBody(model, true));
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }
    output.push("");

    return output;
}

function getCommandBody(model: CodeModelAz, needUpdate: boolean = false) {
    let output: string [] = [];
    let functionName = model.Command_FunctionName;
    let methodName = model.Command_MethodName;
    if (methodName != "show")
    {
        if(needUpdate) {
            output.push("        g.custom_command('" + methodName.replace(/create/g, "update") + "', '" + functionName.replace(/_create/g, "_update") + "')");
        } else {
            output.push("        g.custom_command('" + methodName + "', '" + functionName + "')");
        } 
    }
    else
    {
        output.push("        g.custom_show_command('" + methodName + "', '" + functionName + "')");
    }
    return output;
}