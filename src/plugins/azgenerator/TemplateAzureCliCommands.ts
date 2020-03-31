﻿/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";
import { ToMultiLine } from "../../utils/helper"
import { isNullOrUndefined } from "util";
import { SchemaType } from "@azure-tools/codemodel";

export function GenerateAzureCliCommands(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();

    // this can't be currently reproduced
    // header.disableTooManyStatements = true;
    // header.disableTooManyLocals = true;
    header.addFromImport("azure.cli.core.commands", ["CliCommandType"]);

    let output: string[] = []
    output.push("");
    output.push("");
    output.push("def load_command_table(self, _):");

    if (model.SelectFirstCommandGroup()) {
        do {
            // if there's no operation in this command group, just continue

            if (model.SelectFirstCommand()) {
                output.push("");

                let cf_name: string = "cf_" + ((model.GetModuleOperationName() != "") ? model.GetModuleOperationName() : model.Extension_NameUnderscored);
                output.push("    from azext_" + model.Extension_NameUnderscored + ".generated._client_factory import " + cf_name);
                output.push("    " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + " = CliCommandType(");
                ToMultiLine("        operations_tmpl='azext_" + model.Extension_NameUnderscored + ".vendored_sdks." + model.PythonOperationsName + ".operations._" + model.GetModuleOperationNamePython() + "_operations#" + model.GetModuleOperationNamePythonUpper() + "Operations" + ".{}',", output);

                output.push("        client_factory=" + cf_name + ")");

                ToMultiLine("    with self.command_group('" + model.CommandGroup_Name + "', " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + ", client_factory=" + cf_name + ") as g:", output);
                let needWait = false;
                do {
                    if (model.Command_IsLongRun) {
                        needWait = true;
                    }
                    output = output.concat(getCommandBody(model));
                    if (model.Command_CanSplit) {
                        output = output.concat(getCommandBody(model, true));
                    }
                }
                while (model.SelectNextCommand());
                if (needWait) {
                    output.push("        g.wait_command('wait')");
                }
            }
        } while (model.SelectNextCommandGroup());
    }
    output.push("");

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    if (output.length + header.getLines().length > 1000) {
        header.disableTooManyLines = true;
    }

    return header.getLines().concat(output);
}

function getCommandBody(model: CodeModelAz, needUpdate: boolean = false) {
    let output: string[] = [];
    let functionName = model.Command_FunctionName;
    let methodName = model.Command_MethodName;
    let endStr = ")";
    if (model.Command_IsLongRun) {
        endStr = ", supports_no_wait=True" + endStr;
    }
    if (methodName != "show") {
        if (needUpdate) {
            let argument = "";
            let geneParam = null;
            if (model.SelectFirstMethod()) {
                let originalOperation = model.Method_GetOriginalOperation;
                if (!isNullOrUndefined(originalOperation)) {
                    geneParam = model.Method_GenericSetterParameter(originalOperation);
                } else {
                    geneParam = model.Method_GenericSetterParameter(model.Method);
                }
                if (!isNullOrUndefined(geneParam)) {
                    argument = model.Parameter_NamePython(geneParam);
                }
            }
            if(isNullOrUndefined(geneParam)) {
                // generic update doesn't apply here
                ToMultiLine("        g.custom_command('" + methodName.replace(/create/g, 'update') + "', '" + functionName.replace(/_create/g, '_update') + "'" + endStr, output);
            } else {
                let generic_update = "        g.generic_update_command('" + model.Command_MethodName.replace(/create/g, 'update');
                if (argument && argument != "" && argument != "parameters") {
                    generic_update += "', setter_arg_name = '" + argument;
                }
                if (model.Command_IsLongRun) {
                    generic_update += "', setter_name = 'begin_create_or_update";
                }
                generic_update += "', custom_func_name = '" + functionName.replace(/_create/g, '_update') + "'" + endStr;
                ToMultiLine(generic_update, output);
            }
        } else {
            ToMultiLine("        g.custom_command('" + methodName + "', '" + functionName + "'" + endStr, output);
        }
    }
    else {
        ToMultiLine("        g.custom_show_command('" + methodName + "', '" + functionName + "'" + endStr, output);
    }
    return output;
}