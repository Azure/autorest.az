/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../../CodeModelAz"
import { HeaderGenerator } from "../../Header";
import { ToMultiLine, getExtraModeInfo, composeParamString } from "../../../../utils/helper"
import { isNullOrUndefined } from "util";
import { ExtensionMode } from "../../../models";

let showCommandFunctionName: string;
let useResourceType: boolean;

function initVars() {
    showCommandFunctionName = undefined;
    useResourceType = false;
}

export function GenerateAzureCliCommands(model: CodeModelAz): string[] {
    initVars();
    let header: HeaderGenerator = new HeaderGenerator();

    // this can't be currently reproduced
    header.disableTooManyStatements = true;
    header.disableTooManyLocals = true;
    header.addFromImport(model.CliCoreLib + ".commands", ["CliCommandType"]);

    let output: string[] = []
    output.push("");
    output.push("");
    output.push("def load_command_table(self, _):");
    let extensionHasMode = false;
    let extensionName = model.Extension_Name;
    if (!isNullOrUndefined(model.Extension_Parent)) {
        extensionName = model.Extension_Parent.trim() + " " + extensionName.trim();
    }
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
                let groupName = model.CommandGroup_Name;
                let extraInfo = "";
                if (groupName.startsWith(extensionName + " ")) {
                    extraInfo = getExtraModeInfo(model.CommandGroup_Mode, model.Extension_Mode);
                } else if (model.CommandGroup_Name == extensionName) {
                    extensionHasMode = true;
                    extraInfo = getExtraModeInfo(model.CommandGroup_Mode, "");
                }
                if (extraInfo != "") {
                    extraInfo = ", " + extraInfo;
                }
                let commandGroupOutput = "    with self.command_group('" + model.CommandGroup_Name + "', " + model.Extension_NameUnderscored + "_" + model.GetModuleOperationName() + ", client_factory=" + cf_name + extraInfo;
                const paramRet = composeParamString(model.CommandGroup_MaxApi, model.CommandGroup_MinApi, model.CommandGroup_ResourceType);
                commandGroupOutput += paramRet[0];
                if (paramRet[1])    useResourceType = true;
                commandGroupOutput += ") as g:";
                ToMultiLine(commandGroupOutput, output);
                let needWait = false;
                do {
                    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        needWait = true;
                    }
                    output = output.concat(getCommandBody(model));
                }
                while (model.SelectNextCommand());
                if (needWait) {
                    if (showCommandFunctionName) {
                        output.push("        g.custom_wait_command('wait', '" + showCommandFunctionName + "')");
                    } else {
                        output.push("        g.custom_wait_command('wait')");
                    }
                    
                }
            }
        } while (model.SelectNextCommandGroup());
    }
    output.push("");
    let modeInfo = getExtraModeInfo(model.Extension_Mode, "");
    if (!extensionHasMode && modeInfo != "") {
        output.push("    with self.command_group('" + extensionName + "', " + modeInfo + "):");
        output.push("        pass");
        output.push("");  
    }

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    if (output.length + header.getLines().length > 1000) {
        header.disableTooManyLines = true;
    }
    if (useResourceType) {
        header.addFromImport("azure.cli.core.profiles", ["ResourceType"]);
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
                generic_update += "'";
                const paramRet = composeParamString(model.Method_MaxApi, model.Method_MinApi, model.Method_ResourceType);
                generic_update += paramRet[0];
                if (paramRet[1])    useResourceType = true;
                generic_update += ", custom_func_name='" + functionName + "'" + endStr + commandExtraInfo + ')';
                ToMultiLine(generic_update, output);
            }
        } else {
            let customCommand = "        g.custom_command('" + methodName + "', '" + functionName + "'" + endStr + commandExtraInfo;
            const paramRet = composeParamString(model.Command_MaxApi, model.Command_MinApi, model.Command_ResourceType);
            customCommand += paramRet[0];
            if (paramRet[1])    useResourceType = true;
            customCommand += ")";
            ToMultiLine(customCommand, output);
        }
    }
    else {
        showCommandFunctionName = functionName;
        let customCommand = "        g.custom_show_command('" + methodName + "', '" + functionName + "'" + endStr + commandExtraInfo;
        const paramRet = composeParamString(model.Command_MaxApi, model.Command_MinApi, model.Command_ResourceType);
        customCommand += paramRet[0];
        if (paramRet[1])    useResourceType = true;
        customCommand += ")";
        ToMultiLine(customCommand, output);
    }
    return output;
}