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
let hasJson: boolean = false;
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
            let needWait = false;
            let show_output = [];
            if (model.SelectFirstCommand()) {
                do {
                    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        needWait = true;
                    }
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
                    let command_output = getCommandBody(model, needUpdate, needGeneric, genericParam);
                    if (model.Command_MethodName == "show") {
                        show_output = command_output
                    } 
                    
                    output_args = output_args.concat(command_output);
                   
                    if (needUpdate) {
                        output_args = output_args.concat(getCommandBody(model, needUpdate, needGeneric, genericParam));
                    }
                }
                while (model.SelectNextCommand());
                if (needWait && show_output.length > 1) {
                    show_output[1] = show_output[1].replace(/ show'/g, " wait'");
                    output_args = output_args.concat(show_output);
                }
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

function getCommandBody(model: CodeModelAz, needUpdate: boolean = false, needGeneric: boolean = false, genericParam: Parameter) {
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
                    if (needGeneric && !isNullOrUndefined(genericParam) && model.MethodParameter_MapsTo == model.Parameter_MapsTo(genericParam)) {
                        if (model.EnterSubMethodParameters(genericParam, false)) {
                            if (model.SelectFirstMethodParameter(true)) {
                                do {
                                    if (model.SubMethodParameter['readOnly']) {
                                        continue;
                                    }
                                    if (model.SubMethodParameter['schema']?.type == SchemaType.Constant) {
                                        continue;
                                    }
                                    hasParam = true;
                                    output_args = output_args.concat(getSingleArgument(model, originalOperation, model.SubMethodParameter, allParam, allPythonParam, baseParam, needUpdate));
                                } while (model.SelectNextMethodParameter(true));
                            }
                            model.ExitSubMethodParameters();
                        }
                        continue;
                    }
                    hasParam = true;
                    output_args = output_args.concat(getSingleArgument(model, originalOperation, model.MethodParameter, allParam, allPythonParam, baseParam, needUpdate));
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


function getSingleArgument(model: CodeModelAz, originalOperation: any, param: Parameter, allParam: Map<string, boolean>, allPythonParam: Map<string, boolean>, baseParam: any, needUpdate: boolean) {
    let output_args = [];
    if (isNullOrUndefined(originalOperation)) {
        allPythonParam.set(model.Parameter_NamePython(param), true);
    }
    let parameterName = model.Parameter_MapsTo(param);
    if(!isNullOrUndefined(originalOperation) && param['targetProperty']?.['isDiscriminator']) {
        return output_args;
    }
    if (allPythonParam.has(parameterName)) {
        allPythonParam.delete(parameterName);
    }
    if (allParam.has(parameterName)) {
        return output_args;
    }
    allParam.set(parameterName, true);
    let argument = "        c.argument('" + parameterName + "'";

    // this is to handle names like "format", "type", etc
    if (parameterName.endsWith("_")) {

        argument = "        c.argument('" + parameterName + "'";
        argument += ", options_list=['--" + parameterName.substr(0, parameterName.length - 1) + "']";
        param.language['az']['alias'] = Array(parameterName.substr(0, parameterName.length - 1));
    } else if (parameterName.endsWith('name') && parameterName.replace(/_name$|_/g, '') == model.CommandGroup_DefaultName.toLowerCase() || !isNullOrUndefined(param?.language?.['cli']?.['alias'])) {
        argument = "        c.argument('" + parameterName + "'";
        let aliases: string[] = [];
        if(!model.Method['hasName']) {
            aliases.push('name');
            aliases.push('n');
        }
        if(!isNullOrUndefined(param?.language?.['cli']?.['alias'])) {
            let alias = param?.language?.['cli']?.['alias'];
            
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
            param.language['az']['alias'] = ori_alias;
            argument += ", options_list=[" + alias_str.join(', ') + "]";
        }
        
    }



    if (model.Parameter_Type(param) == SchemaType.Boolean) {
        hasBoolean = true;
        argument += ", arg_type=get_three_state_flag()";
    }
    else if (model.Parameter_Type(param) == SchemaType.Choice || model.Parameter_Type(param) == SchemaType.SealedChoice) {
        hasEnum = true;
        argument += ", arg_type=get_enum_type([";

        model.Parameter_EnumValues(param).forEach(element => {
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
    } else if (model.Parameter_IsSimpleArray(param)) {
        argument += ", nargs='+'";
    } else if (model.Parameter_IsList(param) && !model.Parameter_IsListOfSimple(param)) {
        if(model.Parameter_IsPolyOfSimple(param)) {
            baseParam = param;
            return output_args;
        }
        hasJson = true;
        hasJsonLastTime = true;
        argument += ", arg_type=CLIArgumentType(options_list=['--" + parameterName.replace(/_/g, '-') + "']";
    } else if (model.Parameter_IsList(param) && model.Parameter_IsListOfSimple(param)) {
        let actionName: string = model.Schema_ActionName(param.schema);
        argument += ", action=" + actionName;
        hasActions = true;

        if (actions.indexOf(actionName) < 0) {
            actions.push(actionName);
        }
        argument += ", nargs='+'";
    }

    if (!needSkip) {
        argument += ", help='" + EscapeString(model.Parameter_Description(param)).trimRight();
        if (model.Parameter_IsList(param) && !model.Parameter_IsListOfSimple(param)) {
            let netDescription = model.Parameter_Description(param).trim();
            if (netDescription.length>0 && netDescription[netDescription.length-1].match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i)) {
                argument += ".";
            }
            if (model.Parameter_IsListOfSimple(param)) {
                let options = [];
                if (!isNullOrUndefined(model.Schema_ActionName(param.schema))) {
                    if (baseParam && param['polyBaseParam'] == baseParam) {
                        let keyToMatch = baseParam.schema?.['discriminator']?.property?.language['python']?.name;
                        let valueToMatch = param.schema?.['discriminatorValue'];
                        options = GetActionOptions(model, param, keyToMatch, valueToMatch);
                    }
                    else {
                        options = GetActionOptions(model, param);
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
        if (!isNullOrUndefined(baseParam) && param['polyBaseParam'] == baseParam) {
            argument += ", arg_group='" + Capitalize(ToCamelCase(model.Parameter_MapsTo(baseParam))) + "'";
        }
    }
    if(!model.Method_NameAz.startsWith('list') && !model.Method_NameAz.split(' ').last.startsWith('create') || needUpdate) {
        if(!isNullOrUndefined(model.Parameter_IdPart(param))) {
            argument += ", id_part='" + model.Parameter_IdPart(param) + "'";
        }
    }
        
    argument += ")";
    
    ToMultiLine(argument, output_args);
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