/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { EscapeString, ToCamelCase, Capitalize, ToMultiLine } from "../../utils/helper";
import { SchemaType, Parameter } from "@azure-tools/codemodel";
import { HeaderGenerator } from "./Header";
import { isNullOrUndefined, isArray } from "util";


let hasActions: boolean = false;
let hasBoolean: boolean = false;
let hasEnum: boolean = false;
let hasJson: boolean = true;
let hasResourceGroup: boolean = false;
let hasLocation = false;
let hasLocationValidator = false;
let hasTags = false;
let actions: string[] = [];

export function GenerateAzureCliParams(model: CodeModelAz): string[] {
    var output_args: string[] = [];

    output_args.push("");
    output_args.push("");
    output_args.push("def load_arguments(self, _):");

    if (model.SelectFirstCommandGroup()) {
        do {
            //let methods: string[] = model.CommandGroup_Commands;

            if (model.SelectFirstCommand()) {
                do {
                    output_args = output_args.concat(getCommandBody(model));
                    let originalOperation = model.Command_GetOriginalOperation;
                    let genericParam = model.Command_GenericSetterParameter(model.Command);
                    if(!isNullOrUndefined(originalOperation)) {
                        genericParam = model.Command_GenericSetterParameter(originalOperation);
                    }
                    let needGeneric = false;
                    if (!isNullOrUndefined(genericParam)) {
                        needGeneric = true;
                    }
                    let needUpdate = model.Command_CanSplit;
                    if (needUpdate) {
                        output_args = output_args.concat(getCommandBody(model, needUpdate, needGeneric));
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
    if (hasLocationValidator) {
        header.addFromImport('azure.cli.core.commands.validators', ['get_default_location_from_resource_group']);
    }

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

function getCommandBody(model: CodeModelAz, needUpdate: boolean = false, needGeneric: boolean = false) {
    //let method: string = methods[mi];

    //let ctx = model.SelectCommand(method);
    //if (ctx == null)
    //    continue;
    let output_args: string[] = [];
    output_args.push("");
    if (needUpdate) {
        output_args.push("    with self.argument_context('" + model.Command_Name.replace(/ create/g, " update") + "') as c:");
    } else {
        output_args.push("    with self.argument_context('" + model.Command_Name + "') as c:");
    }

    let hasParam = false;
    let allParam: Map<string, boolean> = new Map<string, boolean>();
    let allPythonParam: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstMethod()) {
        do {
            let originalOperation = model.Method_GetOriginalOperation;
            if (!isNullOrUndefined(originalOperation)) {
                for(let param of originalOperation.parameters) {
                    if (model.Parameter_InGlobal(param)) {
                        continue;
                    }
                    if (model.Parameter_IsFlattened(param) == true) {
                        continue;
                    }
                    if (param?.schema?.type == SchemaType.Constant || param['readOnly']) {
                        continue;
                    }
                    allPythonParam.set(param.language.python.name, true);
                }
                if(!isNullOrUndefined(originalOperation.requests[0].parameters)) {
                    for(let param of originalOperation.requests[0].parameters) {
                        if(model.Parameter_InGlobal(param)) {
                            continue;
                        }
                        if (model.Parameter_IsFlattened(param) == true) {
                            continue;
                        }
                        if (param?.schema?.type == SchemaType.Constant || param['readOnly']) {
                            continue;
                        }
                        allPythonParam.set(param.language.python.name, true);
                    }
                }
            }
            let baseParam = null;
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type == SchemaType.Constant || model.MethodParameter['readOnly']) {
                        continue;
                    }
                    hasParam = true;
                    if (isNullOrUndefined(originalOperation)) {
                        allPythonParam.set(model.MethodParameter_NamePython, true);
                    }
                    let parameterName = model.MethodParameter_MapsTo;
                    if(!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
                        continue;
                    }
                    if (allPythonParam.has(parameterName)) {
                        allPythonParam.delete(parameterName);
                    }
                    if (allParam.has(parameterName)) {
                        continue;
                    }
                    allParam.set(parameterName, true);
                    let argument = "        c.argument('" + parameterName + "'";

                    // this is to handle names like "format", "type", etc
                    if (parameterName.endsWith("_")) {

                        argument = "        c.argument('" + parameterName + "'";
                        argument += ", options_list=['--" + parameterName.substr(0, parameterName.length - 1) + "']";
                        model.MethodParameter.language['az']['alias'] = Array(parameterName.substr(0, parameterName.length - 1));
                    } else if (parameterName.endsWith('name') && parameterName.replace(/_name$|_/g, '') == model.CommandGroup_DefaultName.toLowerCase() || !isNullOrUndefined(model.MethodParameter?.language?.['cli']?.['alias'])) {
                        argument = "        c.argument('" + parameterName + "'";
                        let aliases: string[] = [];
                        aliases.push('name');
                        aliases.push('n');
                        if(!isNullOrUndefined(model.MethodParameter?.language?.['cli']?.['alias'])) {
                            let alias = model.MethodParameter?.language?.['cli']?.['alias'];
                            
                            if(typeof alias === "string") {
                                aliases.push(alias);  
                            }
                            if (isArray(alias)) {
                                aliases = aliases.concat(alias);
                            }
                        }
                        if(aliases.length > 0) {
                            let alias_str = [];
                            let ori_alias = [];
                            for(let alias of aliases) {
                                alias = alias.replace(/'/g, '');
                                let tmpAlias = alias;
                                if(alias.length == 1) {
                                    alias = "'-" + alias + "'";
                                } else if(alias.length > 1) {
                                    alias = "'--" + alias + "'";
                                }
                                if(alias_str.indexOf(alias) < 0) {
                                    alias_str.push(alias);
                                    ori_alias.push(tmpAlias)
                                }
                                
                            }
                            model.MethodParameter.language['az']['alias'] = ori_alias;
                            argument += ", options_list=[" + alias_str.join(', ') + "]";
                        }
                        
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
                    let needSkip = false;
                    if (parameterName == "resource_group_name") {
                        argument += ", resource_group_name_type";
                        hasResourceGroup = true;
                        needSkip = true;
                    } else if (parameterName == "tags") {
                        argument += ", tags_type";
                        hasTags = true;
                        needSkip = true;
                    } else if (parameterName == "location") {
                        argument += ", arg_type=get_location_type(self.cli_ctx)";
                        if (hasResourceGroup) {
                            argument += ", validator=get_default_location_from_resource_group";
                            hasLocationValidator = true;
                        }
                        hasLocation = true;
                        needSkip = true;
                    } else if (model.MethodParameter_IsSimpleArray) {
                        argument += ", nargs='+'";
                    } else if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple) {
                        if(model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            baseParam = model.MethodParameter;
                            continue;
                        }
                        hasJson = true;
                        hasJsonLastTime = true;
                        argument += ", arg_type=CLIArgumentType(options_list=['--" + parameterName.replace(/_/g, '-') + "']";
                    } else if (model.MethodParameter_IsList && model.MethodParameter_IsListOfSimple) {
                        let actionName: string = model.Schema_ActionName(model.MethodParameter.schema);
                        argument += ", action=" + actionName;
                        hasActions = true;

                        if (actions.indexOf(actionName) < 0) {
                            actions.push(actionName);
                        }
                        argument += ", nargs='+'";
                    }

                    if (!needSkip) {
                        argument += ", help='" + EscapeString(model.MethodParameter_Description).trimRight();
                        if (model.MethodParameter_IsList && !model.MethodParameter_IsSimpleArray) {
                            let netDescription = model.MethodParameter_Description.trim();
                            if (netDescription.length>0 && netDescription[netDescription.length-1].match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i)) {
                                argument += ".";
                            }
                            if (model.MethodParameter_IsListOfSimple) {
                                let options = [];
                                if (!isNullOrUndefined(model.Schema_ActionName(model.MethodParameter.schema))) {
                                    if (baseParam && model.MethodParameter['polyBaseParam'] == baseParam) {
                                        let keyToMatch = baseParam.schema?.['discriminator']?.property?.language['python']?.name;
                                        let valueToMatch = model.MethodParameter.schema?.['discriminatorValue'];
                                        options = GetActionOptions(model, model.MethodParameter, keyToMatch, valueToMatch);
                                    }
                                    else {
                                        options = GetActionOptions(model, model.MethodParameter);
                                    }
                                }
                                if (options.length>0) {
                                    // for those object has known KEYs, the help is in the _help.py file
                                }
                                else {
                                    argument += " Expect value: KEY1=VALUE1 KEY2=VALUE2 ...";
                                }

                            }
                            else {
                                argument += " Expected value: json-string/@json-file.";
                            }
                        }
                        argument += "'";
                    
                        if (hasJsonLastTime) {
                            argument += ")";
                            hasJsonLastTime = false;
                        }
                        if (!isNullOrUndefined(baseParam) && model.MethodParameter['polyBaseParam'] == baseParam) {
                            argument += ", arg_group='" + Capitalize(ToCamelCase(model.Parameter_MapsTo(baseParam))) + "'";
                        }
                    }
                    if(!model.Method_NameAz.startsWith('list') && !model.Method_NameAz.split(' ').last.startsWith('create') || needUpdate) {
                        if(!isNullOrUndefined(model.MethodParameter_IdPart)) {
                            argument += ", id_part='" + model.MethodParameter_IdPart + "'";
                        }
                    }
                        
                    argument += ")";
                    
                    ToMultiLine(argument, output_args);
                } while(model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }
    if(needGeneric && allPythonParam.size > 0) {
        let argument = "        c.ignore(";
        for(let k of allPythonParam.keys()) {
            argument += "'" + k + "'" + ", ";
        }
        argument = argument.slice(0, -2) + ")";
        hasParam = true;
        ToMultiLine(argument, output_args);
    }

    if (!hasParam) {
        output_args.push("        pass");
    }


    return output_args;
}



function GetActionOptions(model: CodeModelAz, param: Parameter, keyToMatch: string = null, valueToMatch: string = null): string[] {
    let options = [];

    let paramType = param?.schema?.type;
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
                let azName =model.Parameter_NameAz(model.SubMethodParameter)
                if (azName) {
                    options.push(azName);
                }
            } while (model.SelectNextMethodParameter());
        }
    }
    model.ExitSubMethodParameters();
    return options;
}