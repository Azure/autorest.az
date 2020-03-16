/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { EscapeString, ToCamelCase, Capitalize, ToMultiLine } from "../../utils/helper";
import { SchemaType } from "@azure-tools/codemodel";
import { HeaderGenerator } from "./Header";


let hasActions: boolean = false;
let hasBoolean: boolean = false;
let hasEnum: boolean = false;
let hasJson: boolean = true;
let hasResourceGroup: boolean = false;
let hasLocation = false;
let hasTags = false;
let actions: string[] = [];

export function GenerateAzureCliParams(model: CodeModelAz): string[] {
    var output_args: string[] = [];

    output_args.push("");
    output_args.push("");
    output_args.push("def load_arguments(self, _):");
    //output.push("    name_arg_type = CLIArgumentType(options_list=('--name', '-n'), metavar='NAME')");

    if (model.SelectFirstCommandGroup()) {
        do {
            //let methods: string[] = model.CommandGroup_Commands;

            if (model.SelectFirstCommand()) {
                do {
                    output_args = output_args.concat(getCommandBody(model));
                    if(model.Command_CanSplit) {
                        output_args = output_args.concat(getCommandBody(model, true));
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    let header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;
    header.disableTooManyStatements = true;

    if (hasJson) {
        header.addFromImport("knack.arguments", ["CLIArgumentType"]);
    }

    let parameterImports: string[] = [];
    if (hasTags) parameterImports.push("tags_type");
    if (hasBoolean) parameterImports.push("get_three_state_flag");
    if (hasEnum) parameterImports.push("get_enum_type");
    if (hasResourceGroup) parameterImports.push("resource_group_name_type");
    if (hasLocation) parameterImports.push("get_location_type");

    header.addFromImport("azure.cli.core.commands.parameters", parameterImports);

    if (hasActions) {
        header.addFromImport("azext_" + model.Extension_NameUnderscored + ".action", actions);
    }

    var output: string[] = [];


    output = output.concat(output_args);

    output.push("");

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

function getCommandBody(model: CodeModelAz, needUpdate: boolean = false) {
    //let method: string = methods[mi];

    //let ctx = model.SelectCommand(method);
    //if (ctx == null)
    //    continue;
    let output_args: string [] = [];
    output_args.push("");
    if(needUpdate) {
        output_args.push("    with self.argument_context('" + model.Command_Name.replace(/ create/g, " update") + "') as c:");
    } else {
        output_args.push("    with self.argument_context('" + model.Command_Name + "') as c:");
    }

    let hasParam = false;
    let allParam: Map<string, boolean> = new Map<string, boolean>();
    if(model.SelectFirstMethod()) {
        do {
            if(model.SelectFirstMethodParameter()) {
                do {
                    if(model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if(model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }
                    hasParam = true;
                    
                    let parameterName = model.MethodParameter_MapsTo;
        
                    if(allParam.has(parameterName)) {
                        continue;
                    }
                    allParam.set(parameterName, true);
                    let argument = "        c.argument('" + parameterName + "'";
        
                    // this is to handle names like "format", "type", etc
                    if (parameterName == "type" || parameterName == "format") {
                        argument = "        c.argument('_" + parameterName + "'";
                        argument += ", options_list=['--" + parameterName + "']";
                    }
        
                    if (model.MethodParameter_Type == SchemaType.Boolean) {
                        hasBoolean = true;
                        argument += ", arg_type=get_three_state_flag()";
                    }
                    else if (model.MethodParameter_Type == SchemaType.Choice || model.MethodParameter_Type == SchemaType.SealedChoice) {
                        hasEnum = true;
                        argument += ", arg_type=get_enum_type([";
        
                        model.MethodParameter_EnumValues.forEach(element => {
                            if (!argument.endsWith("[")) argument += ", ";
                            argument += "'" + element + "'";
                        });
                        argument += "])";
                    }

                    let hasJsonLastTime = false;
        
                    if (parameterName == "resource_group_name") {
                        argument += ", resource_group_name_type";
                        hasResourceGroup = true;
                    } else if (parameterName == "tags") {
                        argument += ", tags_type";
                        hasTags = true;
                    } else if (parameterName == "location") {
                        argument += ", arg_type=get_location_type(self.cli_ctx)";
                        hasLocation = true;
                    } else if (model.MethodParameter_IsSimpleArray) {
                        argument += ", nargs='+'";
                    } else if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple) {
                        hasJson = true;
                        hasJsonLastTime = true;
                        argument += ", arg_type=CLIArgumentType(options_list=['--" + parameterName.replace(/_/g, '-') + "']";
                    } else if (model.MethodParameter_IsList && model.MethodParameter_IsListOfSimple) {
                        let actionName: string = "Add" + Capitalize(ToCamelCase(model.MethodParameter_Name));
                        argument += ", action=" + actionName;
                        hasActions = true;

                        if (actions.indexOf(actionName) < 0) {
                            actions.push(actionName);
                        }
                        argument += ", nargs='+'";
                    }
                    
                    argument += ", help='" + EscapeString(model.MethodParameter_Description) + "'";
                    if(hasJsonLastTime) {
                        argument += ")";
                        hasJsonLastTime = false;
                    }            
                    
                    argument += ")";
                    
                    for (let line of ToMultiLine(argument))
                        output_args.push(line);
                } while(model.SelectNextMethodParameter());
            }
        } while(model.SelectNextMethod());
    }
    if (!hasParam) {
        output_args.push("        pass");
    }

    return output_args;
}
