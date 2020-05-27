/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { SchemaType, Parameter, Schema } from "@azure-tools/codemodel";
import { HeaderGenerator } from "./Header";
import { EscapeString,  ToCamelCase, Capitalize,  ToMultiLine, ToJsonString } from "../../utils/helper"
import { isNullOrUndefined, isArray } from "util";

const maxShortSummary = 119
let showExampleStr = "";
let allSupportWaited = ['create', 'update', 'delete'];
export function GenerateAzureCliHelp(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;
    header.addFromImport("knack.help_files", ["helps"])
    var output: string[] = [];
    output.push("");

    if (model.SelectFirstCommandGroup()) {
        do {

            // if there's no operation in this command group
            if (!model.SelectFirstCommand())
                continue;
                
            output = output.concat(generateCommandGroupHelp(model));    
            //let methods: string[] = model.CommandGroup_Commands;

            let allSubGroup: Map<string, boolean> = new Map<string, boolean>();
            let hasWait = false;
            let allLongRunCommand = [];
            if (model.SelectFirstCommand()) {
                do {

                    let subCommandGroupName = model.Command_SubGroupName;
                    if(subCommandGroupName != "" && !allSubGroup.has(subCommandGroupName)) {
                        allSubGroup.set(subCommandGroupName, true);
                        output = output.concat(generateCommandGroupHelp(model, subCommandGroupName));
                    }
                    if(model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        hasWait = true;
                        let waitParam = "";
                        if (allSupportWaited.indexOf(model.Command_MethodName) < 0) {
                            waitParam = "create";
                        } else {
                            waitParam = model.Command_MethodName;
                        }
                        if(allLongRunCommand.indexOf(waitParam + "d") < 0) {
                            allLongRunCommand.push(waitParam + "d");
                        }
                    }
                    let commandOutput: string [] = generateCommandHelp(model);
                    //output.push("before output.length: " + output.length);
                    output = output.concat(commandOutput);
                    //output.push("after output.length: " + output.length);
                    if (model.Command_CanSplit) {
                        let tmpoutput: string[] = generateCommandHelp(model, true);
                        output = output.concat(tmpoutput);
                    }
                }
                while (model.SelectNextCommand());
                if (hasWait) {
                    output = output.concat(generateWaitCommandHelp(model.CommandGroup_Name, allLongRunCommand));
                }
            }
        } while (model.SelectNextCommandGroup());;

        output.push("");
    }

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

function generateWaitCommandHelp(commandGroup, allLongRunCommand) {
    let output = [];
    output.push("");
    output.push("helps['" + commandGroup + " wait'] = \"\"\"");
    output.push("    type: command");
    let summary = "    short-summary: Place the CLI in a waiting state until a condition of the " + commandGroup + " is met.";
    ToMultiLine(summary, output, 119, true);
    output.push("    examples:");
    for(let waitParam of allLongRunCommand) {
        let name = "      - name: Pause executing next line of CLI script until the " + commandGroup + " is successfully " + waitParam +  ".";
        ToMultiLine(name, output, 119, true);
        output.push("        text: |-");
        let line = showExampleStr.replace(/ show /g, ' wait ') + " --" + waitParam;
        ToMultiLine(line, output, 119, true);
    }
    output.push("\"\"\"");
    return output;
}

function generateCommandGroupHelp(model: CodeModelAz, subCommandGroupName = "") {
    let output = [];
    output.push("");
    if(subCommandGroupName != "") {
        output.push("helps['" + subCommandGroupName + "'] = \"\"\"")
    } else {
        output.push("helps['" + model.CommandGroup_Name + "'] = \"\"\"");
    }
    output.push("    type: group");
    let shortSummary = "    short-summary: " + model.CommandGroup_Help;
    if(subCommandGroupName != "") {
        shortSummary = shortSummary + " sub group " + subCommandGroupName.split(" ").pop();
    }
    ToMultiLine(shortSummary, output, 119, true);
    output.push("\"\"\"");
    return output;
}

function addParameterHelp(output: string[], model: CodeModelAz) {
    let parameter_output = ["    parameters:"];

    let originalOperation = model.Method_GetOriginalOperation;
    let baseParam = null;
    if (model.SelectFirstMethodParameter()) {
        do {
            if (model.MethodParameter_IsFlattened) {
                continue;
            }
            if (model.MethodParameter_Type == SchemaType.Constant || model.MethodParameter['readOnly']) {
                continue;
            }
            let parameterName = model.MethodParameter_MapsTo;
            if (!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
                continue;
            }

            let parameterAlias: string[] = [];
            if (parameterName.endsWith('name') && parameterName.replace(/_name$|_/g, '') == model.CommandGroup_DefaultName.toLowerCase()) {
                parameterAlias.push('name');
                parameterAlias.push('n');
            }
            if (!isNullOrUndefined(model.MethodParameter?.language?.['cli']?.['alias'])) {
                if (!isNullOrUndefined(model.MethodParameter?.language?.['cli']?.['alias'])) {
                    let alias = model.MethodParameter?.language?.['cli']?.['alias'];

                    if (typeof alias === "string") {
                        parameterAlias.push(alias);
                    }
                    if (isArray(alias)) {
                        parameterAlias = parameterAlias.concat(alias);
                    }
                }
            }
            if (parameterAlias.length == 0) parameterAlias.push(parameterName);
            parameterAlias = parameterAlias.map((alias) => {
                return '--' + alias.replace(/'/g, '').replace(/_/g, '-');
            });

            if (model.MethodParameter_IsList && model.MethodParameter_IsListOfSimple && !model.MethodParameter_IsSimpleArray) {
                if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                    baseParam = model.MethodParameter;
                    continue;
                }
                let action_output: string[] = [];
                ToMultiLine(`      - name: ${parameterAlias.join(' ')}`, action_output, 119, true);
                if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
                    ToMultiLine(`        short-summary: ${model.MethodParameter_Description.trim()}`.replace(/\r?\n|\r/g, ''), action_output, 119, true);
                }
                let options: Parameter[] = [];
                if (!isNullOrUndefined(model.Schema_ActionName(model.MethodParameter.schema))) {
                    if (baseParam && model.MethodParameter['polyBaseParam'] == baseParam) {
                        let keyToMatch = baseParam.schema?.['discriminator']?.property?.language['python']?.name;
                        let valueToMatch = model.MethodParameter.schema?.['discriminatorValue'];
                        options = GetActionOptions(model, model.MethodParameter, keyToMatch, valueToMatch);
                    }
                    else {
                        options = GetActionOptions( model, model.MethodParameter);
                    }
                }
                if (options.length > 0) {
                    action_output.push(`        long-summary: |`);
                    ToMultiLine(["            Usage:", parameterAlias[0]].concat(options.map(p => `${model.Parameter_NameAz(p)}=XX`)).join(" "), action_output, 119, true);
                    action_output.push("");
                    for (let p of options) {
                        let pDesc = model.Parameter_Description(p);
                        if (!pDesc || pDesc.trim().length <= 0) continue;
                        let line = `            ${model.Parameter_NameAz(p)}: `;
                        if (p.required) line += "Required. ";
                        line += model.Parameter_Description(p).trim().replace(/\r?\n|\r/g, '');
                        ToMultiLine(line, action_output, 119, true);
                    }
                    if (model.Schema_Type(model.MethodParameter.schema) == SchemaType.Array) {
                        action_output.push("");
                        ToMultiLine(`            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`, action_output, 119, true);
                    }
                    parameter_output = parameter_output.concat(action_output);
                }
            }
        } while (model.SelectNextMethodParameter());
    }

    if (parameter_output.length>1) {
        return output.concat(parameter_output);
    }
    else {
        return output;
    }
}


function GetActionOptions( model: CodeModelAz, param: Parameter, keyToMatch: string = null, valueToMatch: string = null): Parameter[] {
    let options: Parameter[] = [];

    if (!SchemaType.Object || !SchemaType.Array) {
        return options;
    }
    if (model.EnterSubMethodParameters()) {
        if (model.SelectFirstMethodParameter()) {
            do {
                if (model.SubMethodParameter['readOnly']) {
                    continue;
                }
                if (model.SubMethodParameter['schema']?.type == SchemaType.Constant) {
                    continue;
                }
                if (!isNullOrUndefined(keyToMatch) && !isNullOrUndefined(valueToMatch) && model.Parameter_NamePython(model.SubMethodParameter) == keyToMatch) {
                    continue;
                }
                if (model.SubMethodParameter) {
                    options.push(model.SubMethodParameter);
                }
            } while (model.SelectNextMethodParameter());
        }
        model.ExitSubMethodParameters();
    }
    
    return options;
}

function generateCommandHelp(model: CodeModelAz, needUpdate: boolean = false) {
    // create, delete, list, show, update
    //let method: string = methods[mi];
    //let ctx = model.SelectCommand(method);

    //if (ctx == null)
    //    continue;
    let output: string[] = [];
    output.push("");
    let commandHead = needUpdate? model.Command_Name.replace(/ create/gi, " update"): model.Command_Name;
    output.push("helps['" + commandHead + "'] = \"\"\"");
    output.push("    type: command");

    // there will be just one method for create, update, delete, show, etc.
    // there may be a few list methods, so let's just take description from the first one.
    // as we can't use all of them
    let shortSummary = "    short-summary: " + model.Command_Help;
    ToMultiLine(shortSummary, output, 119, true);
    output = addParameterHelp(output, model);

    let examplesStarted: boolean = false;

    for (let example of model.GetExamples()) {
        if (!examplesStarted) {
            output.push("    examples:");
            examplesStarted = true;
        }

        //output.push ("# " + example_id);
        let parameters: string[] = [];

        parameters.push("az");
        parameters = parameters.concat(commandHead.split(" "));
        //parameters.push(method);

        for (let param of example.Parameters) {
            let slp = param.value; 
            if (!param.isKeyValues) {
                slp = ToJsonString(slp); 
            }
            //parameters += " " + k + " " + slp;
            parameters.push(param.name);
            parameters.push(slp);
        }
        output.push("      - name: " + example.Title);
        output.push("        text: |-");
        let line = "               " + parameters.join(' ');
        if (model.Command_MethodName == 'show') {
            showExampleStr = line;
        }
        ToMultiLine(line, output, 119, true);
    }

    output.push("\"\"\"");
    return output;
}