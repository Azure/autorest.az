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

export function GenerateAzureCliParams(model: CodeModelAz, debug: boolean): string[] {
    var output_args: string[] = [];

    output_args.push("");
    output_args.push("");
    output_args.push("def load_arguments(self, _):");
    let hasCommandParamContent = false;
    let header: HeaderGenerator = new HeaderGenerator();
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
                    let needGeneric = model.Command_NeedGeneric;
                    let command_output = getCommandBody(model, needGeneric, debug);
                    if (model.Command_MethodName == "show") {
                        show_output = command_output
                    }
                    if (command_output.length > 0) {
                        hasCommandParamContent = true;
                    }         
                    output_args = output_args.concat(command_output);
     
                }
                while (model.SelectNextCommand());
                if (needWait && show_output.length > 1) {
                    show_output[1] = show_output[1].replace(/ show'/g, " wait'");
                    output_args = output_args.concat(show_output);
                }
            }
        } while (model.SelectNextCommandGroup());
    }
    if (!hasCommandParamContent) {
        output_args.push("    pass");
        header.disableUnusedArgument = true;
    } else {
        header.disableTooManyLines = true;
        header.disableTooManyStatements = true;
    }


    let parameterImports: string[] = [];
    if (hasTags) parameterImports.push("tags_type");
    if (hasBoolean) parameterImports.push("get_three_state_flag");
    if (hasEnum) parameterImports.push("get_enum_type");
    if (hasResourceGroup) parameterImports.push("resource_group_name_type");
    if (hasLocation) parameterImports.push("get_location_type");
    if (parameterImports.length > 0) {
        header.addFromImport(model.CliCoreLib + ".commands.parameters", parameterImports);
    }
    
    let validatorImports: string[] = [];
    if (hasLocationValidator) {
        validatorImports.push("get_default_location_from_resource_group");
    }
    if (hasJson) {
        validatorImports.push("validate_file_or_dict");
    }
    if (validatorImports.length > 0) {
        header.addFromImport(model.CliCoreLib + '.commands.validators', validatorImports);
    }

    if (hasActions) {
        if (model.IsCliCore) {
            header.addFromImport("..action", actions);
        } else {
            header.addFromImport("azext_" + model.Extension_NameUnderscored + ".action", actions);
        }
        
    }

    var output: string[] = [];


    output = output.concat(output_args);

    output.push("");
    

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

function getCommandBody(model: CodeModelAz, needGeneric: boolean = false, debug: boolean = false) {
    //let method: string = methods[mi];

    //let ctx = model.SelectCommand(method);
    //if (ctx == null)
    //    continue;
    let output_args: string[] = [];
    output_args.push("");
    output_args.push("    with self.argument_context('" + model.Command_Name + "') as c:");

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
                    if(!isNullOrUndefined(param?.language?.python?.name)) {
                        allPythonParam.set(param.language.python.name, true);
                    }
                    
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
                        if(!isNullOrUndefined(param?.language?.python?.name)) {
                            allPythonParam.set(param.language.python.name, true);
                        }
                    }
                }
            }
            let baseParam = null;
            let hasResourceGroupInOperation = false;
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type == SchemaType.Constant || model.MethodParameter['readOnly']) {
                        continue;
                    }
                    hasParam = true;
                    if (isNullOrUndefined(originalOperation) && !isNullOrUndefined(model.MethodParameter_NamePython)) {
                        allPythonParam.set(model.MethodParameter_NamePython, true);
                    }
                    let parameterName = model.MethodParameter_MapsTo;
                    if(!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
                        continue;
                    }
                    if (allPythonParam.has(parameterName)) {
                        allPythonParam.delete(parameterName);
                    }
                    let argument = "        c.argument('" + parameterName + "'";

                    // this is to handle names like "format", "type", etc
                    if (parameterName.endsWith("_")) {
                        if (isNullOrUndefined(model.MethodParameter.language['az']['alias'])) {
                            model.MethodParameter.language['az']['alias'] = [];
                        }
                        model.MethodParameter.language['az']['alias'].push(parameterName.substr(0, parameterName.length - 1));
                        
                    } else if (parameterName.endsWith('name') && !model.Method['hasName'] && parameterName.replace(/_name$|_/g, '') == model.CommandGroup_DefaultName.toLowerCase()) {
                        if (isNullOrUndefined(model.MethodParameter.language['az']['alias'])) {
                            model.MethodParameter.language['az']['alias'] = [];
                        }
                        model.MethodParameter.language['az']['alias'].push('name');
                        model.MethodParameter.language['az']['alias'].push('n');
                        model.MethodParameter.language['az']['alias'].push(parameterName);
                    }
                    if (!isNullOrUndefined(model.MethodParameter.language['az']['alias'])) {
                        argument = "        c.argument('" + parameterName + "'";
                        let aliases = model.MethodParameter.language['az']['alias'];
                        if(aliases.length > 0) {
                            let alias_str = [];
                            let ori_alias = [];
                            for(let alias of aliases) {
                                alias = alias.replace(/'/g, '');
                                let tmpAlias = alias;
                                if(alias.length == 1) {
                                    alias = "'-" + alias + "'";
                                } else if(alias.length > 1) {
                                    alias = "'--" + alias.replace(/_/g, '-') + "'";
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

                    if (allParam.has(parameterName)) {
                        continue;
                    }
                    allParam.set(parameterName, true);

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

                    let needSkip = false;
                    if (parameterName == "resource_group_name") {
                        argument += ", resource_group_name_type";
                        hasResourceGroup = true;
                        hasResourceGroupInOperation = true;
                        needSkip = true;
                    } else if (parameterName == "tags") {
                        argument += ", tags_type";
                        hasTags = true;
                        needSkip = true;
                    } else if (parameterName == "location") {
                        argument += ", arg_type=get_location_type(self.cli_ctx)";
                        if (hasResourceGroupInOperation) {
                            argument += ", validator=get_default_location_from_resource_group";
                            hasLocationValidator = true;
                        }
                        hasLocation = true;
                        needSkip = true;
                    } else if (model.MethodParameter_IsSimpleArray) {
                        if (model.MethodParameter['required'] === true) {
                            argument += ", nargs='+'";
                        } else {
                            argument += ", nargs='*'";
                        }
                        
                    } else if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple) {
                        if(model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            baseParam = model.MethodParameter;
                            continue;
                        }
                        hasJson = true;
                        argument += ", type=validate_file_or_dict";
                    } else if (model.MethodParameter_IsList && model.MethodParameter_IsListOfSimple) {
                        let actionName: string = model.Schema_ActionName(model.MethodParameter.schema);
                        argument += ", action=" + actionName;
                        hasActions = true;

                        if (actions.indexOf(actionName) < 0) {
                            actions.push(actionName);
                        }
                        if (model.MethodParameter['required'] === true) {
                            argument += ", nargs='+'";
                        } else {
                            argument += ", nargs='*'";
                        }
                    }

                    if (!needSkip) {
                        if (model.MethodParameter_Type == SchemaType.Integer) {
                            argument += ", type=int"
                        } else if(model.MethodParameter_Type == SchemaType.Number) {
                            argument += ", type=float"
                        } else if(model.MethodParameter_Type == SchemaType.String) {
                            argument += ", type=str"
                        }
                        
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
                        if (debug) {
                            if (!argument.endsWith(".")) {
                                argument += ".";
                            }
                            argument += " Swagger name=" + model.MethodParameter_CliKey;
                        }
                        argument += "'";
                   
                        if (!isNullOrUndefined(baseParam) && model.MethodParameter['polyBaseParam'] == baseParam) {
                            argument += ", arg_group='" + Capitalize(ToCamelCase(model.Parameter_MapsTo(baseParam))) + "'";
                        }
                    }
                    if(!model.Method_NameAz.startsWith('list') && !model.Method_NameAz.split(' ').last.startsWith('create')) {
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
        return [];
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
        model.ExitSubMethodParameters();
    }
   
    return options;
}