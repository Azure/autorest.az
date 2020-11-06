/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../../CodeModelAz"
import { HeaderGenerator } from "../../Header";
import { ToMultiLine, getExtraModeInfo } from "../../../../utils/helper"
import { isNullOrUndefined } from "util";
import { ExtensionMode } from "../../../models";

let showCommandFunctionName = undefined;
export function GenerateAzureCliCommands(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();

    // this can't be currently reproduced
    header.disableTooManyStatements = true;
    header.disableTooManyLocals = true;
    header.addFromImport(model.CliCoreLib + ".commands", ["CliCommandType"]);

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
                if (model.SDK_NeedSDK) {
                    output.push("    from " + model.AzextFolder + ".generated._client_factory import " + cf_name);
                } else {
                    output.push("    from ..generated._client_factory import " + cf_name);
                }

                output.push("    " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + " = CliCommandType(");
                ToMultiLine("        operations_tmpl='" + model.GetPythonNamespace() + ".operations._" + model.GetModuleOperationNamePython() + "_operations#" + model.GetModuleOperationNamePythonUpper() + ".{}',", output);


                output.push("        client_factory=" + cf_name + ")");
                let groupinfos = model.CommandGroup_Name.split(' ');
                let extraInfo = "";
                if (groupinfos.length >= 2) {
                    extraInfo = getExtraModeInfo(model.CommandGroup_Mode, "");
                }
                if (extraInfo != "") {
                    extraInfo = ", " + extraInfo;
                }
                ToMultiLine("    with self.command_group('" + model.CommandGroup_Name + "', " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + ", client_factory=" + cf_name + extraInfo + ") as g:", output);
                let needWait = false;
                do {
                    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        needWait = true;
                    }
                    output = output.concat(getCommandBody(model));
                }
                while (model.SelectNextCommand());
                if (needWait) {
                    output.push("        g.custom_wait_command('wait', '" + showCommandFunctionName + "')");
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

function getCommandBody(model: CodeModelAz) {
    let commandExtraInfo = "";
    let output: string[] = [];
    let functionName = model.Command_FunctionName;
    let methodName = model.Command_MethodName;
    let endStr = "";
    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
        endStr += ", supports_no_wait=True";
    }
    if (methodName == "delete") {
        endStr += ", confirmation=True";
    }
    commandExtraInfo = getExtraModeInfo(model.Command_Mode, model.CommandGroup_Mode);
    if (commandExtraInfo != "") {
        commandExtraInfo = ", " + commandExtraInfo;
    }
    if (methodName != "show") {
        if (model.Command_NeedGeneric) {
            let argument = "";
            let geneParam = null;
            if (model.SelectFirstMethod()) {
                geneParam = model.Method_GenericSetterParameter(model.Method_GetOriginalOperation);
                if (!isNullOrUndefined(geneParam)) {
                    argument = model.Parameter_NamePython(geneParam);
                }
                let generic_update = "        g.generic_update_command('" + model.Command_MethodName;
                if (argument && argument != "" && argument != "parameters") {
                    generic_update += "', setter_arg_name='" + argument;
                }
                if (model.Command_IsLongRun && !model.SDK_IsTrack1) {
                    generic_update += "', setter_name='begin_create_or_update";
                }
                generic_update += "', custom_func_name='" + functionName + "'" + endStr + commandExtraInfo + ')';
                ToMultiLine(generic_update, output);
            }
        } else {
            ToMultiLine("        g.custom_command('" + methodName + "', '" + functionName + "'" + endStr + commandExtraInfo + ')', output);
        }
    }
    else {
        showCommandFunctionName = functionName;
        ToMultiLine("        g.custom_show_command('" + methodName + "', '" + functionName + "'" + endStr + commandExtraInfo + ')', output);
    }
    return output;
}