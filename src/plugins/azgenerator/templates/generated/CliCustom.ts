/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Operation, Parameter, SchemaType } from "@azure-tools/codemodel";
import { isNullOrUndefined } from "util";
import { Capitalize, ToCamelCase, ToMultiLine, ToPythonString } from '../../../../utils/helper';
import { CodeModelAz } from "../../CodeModelAz";
import { HeaderGenerator } from "../../Header";

export function GenerateAzureCliCustom(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;

    // this is no longer a problem
    // header.disableTooManyLocals = true;
    // header.disableUnusedArgument = true;

    let required: any = {};
    let body: string[] = GenerateBody(model, required);

    if (required['json']) {
        header.addImport("json");
    }

    if (required['clierror']) {
        header.addFromImport("knack.util", ["CLIError"]);
    }

    if(required['nowait']) {
        header.addFromImport(model.CliCoreLib + ".util", ["sdk_no_wait"]);
    }

    if(required['disableUnusedArgument']) {
        header.disableUnusedArgument = true;
    }

    let output = [];
    output = output.concat(body);
    output.push("");

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

class CustomParam {
    public constructor(public originalOperation: Operation, public needGeneric: boolean, public genericParameter: Parameter) {}
}

function getCustomParam(model: CodeModelAz, required: any) {
    
    let originalOperation = model.Method_GetOriginalOperation;
    let genericParameter = null;
    if (!isNullOrUndefined(originalOperation)) {
        genericParameter = model.Method_GenericSetterParameter(originalOperation);
    }
    let needGeneric = model.Method_NeedGeneric;
    if (needGeneric) {
        required['disableUnusedArgument'] = true;
    }
    let customPara = new CustomParam(originalOperation, needGeneric, genericParameter);
    return customPara;
}

function GenerateBody(model: CodeModelAz, required: any): string[] {
    var output: string[] = [];

    if (model.SelectFirstCommandGroup()) {
        do {
            if (model.SelectFirstCommand()) {
                do {
                    if(model.SelectFirstMethod()) {
                        output = output.concat(GetCommandBody(model, required));
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    return output;
}

function ConstructMethodBodyParameter(model: CodeModelAz, needGeneric: boolean = false) {
    let output_body: string[] = [];
    let opNames = model.Method_NameAz.split(' ');
    if (model.Command_Name == "ml compute databricks create") {
        model.Command;
    }
    let valueToMatch = null;
    if (opNames.length > 1) {
        valueToMatch = Capitalize(ToCamelCase(opNames[0]));
    }
    let addGenericSchema = false;
    if (model.SelectFirstMethodParameter(true)) {
        let originalParameterStack: Parameter[] = [];
        let originalParameterNameStack: string[] = [];
        let prefixIndent = "    ";

        let skip = false;
        do {
            if (skip) {
                skip = false;
            }
            if ((model.MethodParameter_IsCliFlattened && (!isNullOrUndefined(model.MethodParameter.language['cli']['cliFlattenTrace']) || model.SDK_NoFlatten || !isNullOrUndefined(model.MethodParameter['extensions']?.['cli-poly-as-resource-base-schema']))) || model.Method.extensions?.['cli-split-operation-original-operation']?.['genericSetterParam'] == model.MethodParameter || (model.MethodParameter_IsFlattened && model.MethodParameter['extensions']?.['cli-flattened'])) {
                while (!isNullOrUndefined(model.MethodParameter.language?.['cli']?.['cliFlattenTrace']) && model.MethodParameter.language?.['cli']?.['cliFlattenTrace']?.length < originalParameterStack.length) {
                    originalParameterStack.pop();
                    originalParameterNameStack.pop();
                }
                if (!isNullOrUndefined(model.MethodParameter.language?.['cli']?.['cliFlattenTrace']) && model.MethodParameter.language?.['cli']?.['cliFlattenTrace']?.length == originalParameterStack.length && (isNullOrUndefined(model.Method.extensions?.['cli-poly-as-resource-original-operation']) || isNullOrUndefined((model.Method.extensions?.['cli-split-operation-original-operation'])))) {
                    originalParameterStack.pop();
                    originalParameterNameStack.pop();
                } 
                if (!addGenericSchema && needGeneric && !isNullOrUndefined(model.CommandGroup.language['az']['genericTargetSchema']) && model.Method.extensions?.['cli-split-operation-original-operation']?.['genericSetterParam'] != model.MethodParameter) {
                    originalParameterStack.push(
                        new Parameter(model.CommandGroup.language['az']['genericTargetSchema'].language['python']['name'], 
                        model.CommandGroup.language['az']['genericTargetSchema'].language['python']['description'],
                        model.CommandGroup.language['az']['genericTargetSchema']
                    ));
                    originalParameterNameStack.push(model.CommandGroup.language['az']['genericTargetSchema'].language['python']['name']);
                    addGenericSchema = true;
                }
                originalParameterStack.push(model.MethodParameter);
                originalParameterNameStack.push(model.MethodParameter_Name);
                if (!needGeneric) {
                    output_body = output_body.concat(ConstructValuation(needGeneric, prefixIndent, originalParameterNameStack, null, "{}"));
                }
            }
            else if (originalParameterStack.length > 0) {
                let flattenedFrom = model.Schema_FlattenedFrom(model.MethodParameter['targetProperty']);
                if (model.MethodParameter['originalParameter'] == originalParameterStack.last || (!isNullOrUndefined(originalParameterStack.last['nameBaseParam']) && model.MethodParameter['originalParameter'] == originalParameterStack.last['nameBaseParam']) || !isNullOrUndefined(flattenedFrom)) {
                    let access = [];
                    let paramName = model.Parameter_NamePython(model.MethodParameter['targetProperty']);
                    if (!isNullOrUndefined(flattenedFrom) && flattenedFrom != originalParameterStack.last.schema) {
                        // If last originalParameter in the stack doesn't have language.az. it means this original Parameter was added because of the flattenedParam in python  
                        while (!isNullOrUndefined(model.MethodParameter.language?.['cli']?.['cliFlattenTrace']) && model.MethodParameter.language?.['cli']?.['cliFlattenTrace']?.length < originalParameterStack.length) {
                            originalParameterStack.pop();
                            originalParameterNameStack.pop();
                        }
                        if (!isNullOrUndefined(model.MethodParameter.language?.['cli']?.['cliFlattenTrace']) && model.MethodParameter.language?.['cli']?.['cliFlattenTrace']?.length == originalParameterStack.length && (isNullOrUndefined(model.Method.extensions?.['cli-poly-as-resource-original-operation']) || isNullOrUndefined((model.Method.extensions?.['cli-split-operation-original-operation'])))) {
                            originalParameterStack.pop();
                            originalParameterNameStack.pop();
                        } 
                        if (originalParameterStack.last?.language?.['cli']?.['moved-from-python'] != true) {
                            originalParameterStack.push(
                                new Parameter(flattenedFrom.language['python']['name'], 
                                    flattenedFrom.language['python']['description'],
                                    flattenedFrom
                                )
                            );
                            originalParameterNameStack.push(flattenedFrom.language['python']['name']);
                            if(!needGeneric) {
                                output_body = output_body.concat(ConstructValuation(needGeneric, prefixIndent, originalParameterNameStack, null, "{}"));
                            }
                        }
                    }

                    if (model.MethodParameter['targetProperty']?.['isDiscriminator'] == true) {
                        if (!isNullOrUndefined(valueToMatch)) {
                            access = ConstructValuation(needGeneric, prefixIndent, originalParameterNameStack, paramName, "'" + valueToMatch + "'");
                        } else {
                            continue;
                        }
                        
                    }
                    else {
                        if (!model.MethodParameter_IsHidden) {
                            access = ConstructValuation(needGeneric, prefixIndent, originalParameterNameStack, paramName, model.MethodParameter_MapsTo, ToPythonString(model.MethodParameter_DefaultValue, model.MethodParameter_Type));
                        } 
                        else if (!isNullOrUndefined(model.MethodParameter_DefaultValue)) {
                            access = ConstructValuation(needGeneric, prefixIndent, originalParameterNameStack, paramName, ToPythonString(model.MethodParameter_DefaultValue, model.MethodParameter_Type));
                        }
                    }
                    output_body = output_body.concat(access);
                    if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                        let baseParam = model.MethodParameter;
                        let hasNext = false;
                        if(model.SelectNextMethodParameter(true)) {
                            hasNext = true;
                            while (hasNext && model.MethodParameter['polyBaseParam'] == baseParam) {
                                hasNext = model.SelectNextMethodParameter(true);
                            }
                        }       
                        if (hasNext && model.MethodParameter['polyBaseParam'] != baseParam) {
                            skip = true;
                        }
                    }
                }
                else {
                    originalParameterStack.pop();
                    originalParameterNameStack.pop();
                }
            }
        } while (skip || model.SelectNextMethodParameter(true));
    }
    return output_body;
}

function ConstructValuation(isGeneric: boolean, prefix: string, classNames: string[], paramName: string, value: string, defaultValue: string = null): string[] {
    let str = [];
    if (isNullOrUndefined(defaultValue)) {
        let left = "";
        if (isGeneric) {
            if(value.startsWith("'") && value.endsWith("'")) {
                left = prefix + "instance.";
            } else {
                str.push(prefix + "if " + value + " is not None:");
                left = prefix + "    instance.";
            }
            for (var i = 1; i < classNames.length; ++i) {
                left = left + classNames[i] + ".";
            }
            left = left + paramName;
        }
        else {
            left = prefix + classNames[0];
            for (var i = 1; i < classNames.length; ++i) {
                left = left + "['" + classNames[i] + "']";
            }

            if (!isNullOrUndefined(paramName)) {
                left = left + "['" + paramName + "']";
            }
        }
        str.push(left + " = " + value);
    }
    else {
        str = str.concat(ConstructValuation(isGeneric, prefix, classNames, paramName, defaultValue) + " if " + value + " is None else " + value);
    }
    return str;

}

function GetSingleCommandDef(model: CodeModelAz, required: any) {

    let output: string[] = [];
    let updatedMethodName: string = model.Command_FunctionName;

    let call = "def " + updatedMethodName + "(";
    let indent = " ".repeat(call.length);

    let allParam: Map<string, boolean> = new Map<string, boolean>();
    let hasLongRun = false;
    let firstLine = false;
    if (model.SelectFirstMethod()) {
        do {
            let { originalOperation, needGeneric, genericParameter } = getCustomParam(model, required);
            if (needGeneric) {
                call += "instance";
            } else {
                call += "client";
            }
            if (!firstLine) {
                output.push(call);
                firstLine = true;
            }
            if(model.Method_IsLongRun && model.CommandGroup_HasShowCommand) {
                required['nowait'] = true,
                hasLongRun = true;
            }
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }

                    if(needGeneric && !isNullOrUndefined(genericParameter) && model.MethodParameter_MapsTo == model.Parameter_MapsTo(genericParameter)) {
                        continue;
                    }
                    if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple) {
                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            continue;
                        }
                    }

                    if (!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
                        continue;
                    }
                    let requiredParam: boolean = model.MethodParameter_RequiredByMethod;

                    let name = model.MethodParameter_MapsTo; // PythonParameterName(element.Name);
                    if (requiredParam && !allParam.has(name)) {
                        allParam.set(name, true);
                        output[output.length - 1] += ",";
                        output.push(indent + name);
                    }
                } while (model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }

    if (model.SelectFirstMethod()) {
        do {
            let { originalOperation, needGeneric, genericParameter } = getCustomParam(model, required);
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }
                      
                    if(needGeneric && !isNullOrUndefined(genericParameter) && model.MethodParameter_MapsTo == model.Parameter_MapsTo(genericParameter)) {
                        continue;
                    } 

                    if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple) {
                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            continue;
                        }
                    }

                    if (!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
                        continue;
                    }

                    let requiredParam = model.MethodParameter_RequiredByMethod;

                    let name = model.MethodParameter_MapsTo;
                    if (!requiredParam && !allParam.has(name)) {
                        allParam.set(name, true);
                        output[output.length - 1] += ",";
                        output.push(indent + name + "=None");
                    }
                } while (model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }

    if(hasLongRun) {
        output[output.length - 1] += ",";
        output.push(indent + "no_wait=False");
    }
    output[output.length - 1] += "):";
    return output;
}

function GetSingleCommandBody(model: CodeModelAz, required: any) {
    let originalParameters = null;

    
    let output: string[] = [];
    let output_body: string[] = []
    let output_method_call: string[] = [];
    if (model.SelectFirstMethod()) {
        // create body transformation for methods that support it
        let methodName: string = model.Command_MethodName;

        // body transformation
        let allPolyBaseParam: Map<string, boolean> = new Map<string, boolean>();
        do {
            let { originalOperation, needGeneric, genericParameter } = getCustomParam(model, required);
            if (!isNullOrUndefined(originalOperation)) {
                originalParameters = originalOperation.parameters;
                if (!isNullOrUndefined(originalOperation.requests[0].parameters)) {
                    originalParameters = originalParameters.concat(originalOperation.requests[0].parameters);
                }
            }
            if (model.SelectFirstMethodParameter()) {
                do {
                    if(needGeneric && !isNullOrUndefined(genericParameter) && model.MethodParameter_MapsTo == model.Parameter_MapsTo(genericParameter)) {
                        continue;
                    }
                    if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple && !model.MethodParameter_IsSimpleArray) {
                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            let baseParam = model.MethodParameter;
                            let baseName = model.MethodParameter_MapsTo;
                            if (allPolyBaseParam.has(baseName)) {
                                continue;
                            }
                            allPolyBaseParam.set(baseName, true);
                            let baseRequired = model.MethodParameter_RequiredByMethod;
                            output_body.push("    " + "all_" + baseName + " = []");
                            let childNames = [];
                            while (model.SelectNextMethodParameter() && model.MethodParameter['polyBaseParam'] == baseParam) {
                                let childName = model.MethodParameter_MapsTo;
                                childNames.push(childName);
                                output_body.push("    if " + childName + " is not None:");
                                output_body.push("        " + "all_" + baseName + ".append(" + childName + ")");
                            }
                            if (childNames.length > 0) {
                                output_body.push("    if len(" + "all_" + baseName + ") > 1:");
                                required['clierror'] = true;
                                ToMultiLine("        raise CLIError('at most one of  " + childNames.join(", ") + " is needed for " + baseName + "!')", output_body);
                                if (baseRequired) {
                                    output_body.push("    if len(" + "all_" + baseName + ") != 1:");
                                    ToMultiLine("        raise CLIError('" + baseName + " is required. but none of " + childNames.join(", ") + " is provided!')", output_body);
                                }
                                ToMultiLine("    " + baseName + " = all_" + baseName + "[0] if len(all_" + baseName + ") == 1 else None", output_body)
                            } else {
                                output_body.pop();
                            }
                            continue;
                        }
                    }
                    else if (model.MethodParameter_DefaultValue !== undefined && model.MethodParameter_Type != SchemaType.Constant) {
                        // model is simple type with default value
                        output_body.push("    if " + model.MethodParameter_MapsTo + " is None:");
                        output_body.push("        " + model.MethodParameter_MapsTo + " = " + ToPythonString(model.MethodParameter_DefaultValue, model.MethodParameter_Type));
                    }
                }
                while (model.SelectNextMethodParameter());

            }

            output_body = output_body.concat(ConstructMethodBodyParameter(model, needGeneric));
        } while (model.SelectNextMethod());


        model.SelectFirstMethod();
        let needIfStatement = !model.Method_IsLast;

        do {
            let { originalOperation, needGeneric } = getCustomParam(model, required);
            let prefix = "    ";
            if (needIfStatement) {
                let ifStatement = prefix;
                prefix += "    ";

                if (!model.Method_IsLast) {
                    ifStatement += ((model.Method_IsFirst) ? "if" : "elif");
                    if (model.SelectFirstMethodParameter()) {
                        do {
                            if (!model.MethodParameter_IsRequired) {
                                continue;
                            }
                            if (model.MethodParameter_Type == SchemaType.Constant) {
                                continue;
                            }
                            if (model.MethodParameter_IsFlattened) {
                                continue;
                            }
                            ifStatement += ((ifStatement.endsWith("if")) ? "" : " and");
                            if (model.MethodParameter_MapsTo == "resource_group_name") {
                                ifStatement += " " + model.MethodParameter_MapsTo;
                            } else {
                                ifStatement += " " + model.MethodParameter_MapsTo + " is not None"
                            }
                        }
                        while (model.SelectNextMethodParameter());
                        ifStatement += ":";
                        output_method_call.push(ifStatement);
                    }
                }
                else {
                    ifStatement == "";
                    prefix = "    ";
                }
            }
            // call client & return value
            // XXX - this is still a hack
            if (!isNullOrUndefined(originalOperation)) {
                if (needGeneric) {
                    output_method_call = output_method_call.concat(GetGenericCall(model, required));
                } else {
                    output_method_call = output_method_call.concat(GetPolyMethodCall(model, prefix, originalOperation, originalParameters, required));
                }
            } else {
                if (needGeneric) {
                    output_method_call = output_method_call.concat(GetGenericCall(model, required));
                } else {
                    output_method_call = output_method_call.concat(GetMethodCall(model, required, prefix));
                }
            }
        }
        while (model.SelectNextMethod());
    }

    output = output.concat(output_body);
    output = output.concat(output_method_call);
    return output;
}


function GetCommandBody(model: CodeModelAz, required: any) {
    // create, delete, list, show, update
    let output: string[] = [];
    output.push("");
    output.push("");

    output = output.concat(GetSingleCommandDef(model, required));
    output = output.concat(GetSingleCommandBody(model, required))
    return output;
}

function GetGenericCall(model: CodeModelAz, required) {
    let output: string[] = [];
    let genericTargetSchema = model.CommandGroup.language['az']['genericTargetSchema'];
    let { genericParameter } = getCustomParam(model, required);
    if(genericTargetSchema != genericParameter.schema) {
        output.push("    return instance." + model.Parameter_NamePython(genericParameter))
    } else {
        output.push("    return instance");
    }
    return output;
    
}

function GetPolyMethodCall(model: CodeModelAz, prefix: any, originalOperation: Operation, originalParameters: Parameter[], required: any): string[] {
    let methodCall: string = prefix + "return ";
    //methodCall += "client." + mode.GetModuleOperationName() +"." + ctx.Methods[methodIdx].Name +  "(";
    let indent = "";
    let methodName = originalOperation.language['python'].name;
    if (model.Method_IsLongRun && model.CommandGroup_HasShowCommand) {
        if (!model.SDK_IsTrack1) {
            methodName = "begin_" + methodName;
        }
        methodCall += "sdk_no_wait(";
        indent = " ".repeat(methodCall.length);
        methodCall += "no_wait," + "\n" + indent + "client." + methodName;
        
    } else {
        if(!model.SDK_IsTrack1 && model.Method_IsLongRun) {
            methodName = "begin_" + methodName;
        }
        methodCall += "client." + methodName + "(";
        indent = " ".repeat(methodCall.length);
    }
    
    let cnt = 0;
    while (cnt < originalParameters.length) {
        let param = originalParameters[cnt];
        cnt++;
        if ((param.flattened && !model.Parameter_IsCliFlattened(param)) || (model.Parameter_IsCliFlattened(param) && !model.SDK_NoFlatten)) {
            continue;
        }
        if (param.schema.type == SchemaType.Constant) {
            continue;
        }
        if (model.Parameter_InGlobal(param)) {
            continue;
        }
        let optionName = model.Parameter_SubMapsTo(model.Method_NameCli, param);
        let parameterName = model.Parameter_NamePython(param);
        if (isNullOrUndefined(parameterName)) {
            continue;
        }
        let parameterPair = '';
        let m4FlattenedFrom = param.language['cli']?.['m4FlattenedFrom']
        if (isNullOrUndefined(m4FlattenedFrom) || m4FlattenedFrom.length <= 0) {
            parameterPair = GetSimpleCallItem(model, param, required, false, null, optionName);
        } else {
            let items = [];
            for(let mparam of m4FlattenedFrom) {
                items.push(GetSimpleCallItem(model, mparam, required, true, param));
            }
            parameterPair = items.join(",\n" + indent); 
        }

        if (methodCall.endsWith("(")) {
            // XXX - split and pop is a hack
            methodCall += parameterPair
        } else {
            methodCall += "," + "\n" + indent + parameterPair;
        }
    }

    methodCall += ")";

    return methodCall.split("\n");
}

function GetSimpleCallItem(model: CodeModelAz, param: Parameter, required: any, m4Flattened: boolean = false, originParam: Parameter = null, optionName: string = null): string {
    let parameterPair = "";
    if (m4Flattened && !isNullOrUndefined(originParam)) {
        let paramNamePython = model.Parameter_NamePython(originParam);
        let keyName = model.Parameter_NamePython(param);
        let paramDefaultValue = model.Parameter_DefaultValue(originParam);
        if (model.Parameter_IsHidden(originParam)) {
            if (paramDefaultValue) {
                if (model.Schema_Type(param.schema) == SchemaType.Object) {
                    let defaultValue = JSON.parse(paramDefaultValue);
                    parameterPair = keyName + "=json.loads(" + JSON.stringify(defaultValue[model.Parameter_NamePython(param)]) + ")";
                    required['json'] = true;
                }
                else {
                    let defaultValue = JSON.parse(paramDefaultValue);
                    parameterPair = keyName + "=" + ToPythonString(defaultValue[model.Parameter_NamePython(param)], model.Parameter_Type(param));
                }
            }
            else {
                parameterPair = paramNamePython + "=None";
            }
        }
        else {
            parameterPair = keyName + "=" + model.Parameter_MapsTo(originParam) + "['" + keyName + "']";
        }       
    } else {
        let paramNamePython = model.Parameter_NamePython(param);
        let paramDefaultValue = model.Parameter_DefaultValue(param);
        if (model.Parameter_IsHidden(param)) {
            if (paramDefaultValue) {
                if (model.Schema_Type(param.schema) == SchemaType.Object) {
                    parameterPair = paramNamePython + "=json.loads(" + ToPythonString(paramDefaultValue, model.Parameter_Type(param)) + ")";
                    required['json'] = true;
                }
                else {
                    parameterPair = paramNamePython + "=" + ToPythonString(paramDefaultValue, model.Parameter_Type(param));
                }
            }
            else {
                parameterPair = paramNamePython + "=None";
            }
        }
        else {
            if (!isNullOrUndefined(optionName)) {
                parameterPair = paramNamePython + "=" + optionName;
            } else {
                parameterPair = paramNamePython + "=" + model.Parameter_MapsTo(param);
            }
        }
    }
    return parameterPair;
}

function GetMethodCall(model: CodeModelAz, required: any, prefix: any): string[] {
    let methodCall: string = prefix + "return ";
    //methodCall += "client." + mode.GetModuleOperationName() +"." + ctx.Methods[methodIdx].Name +  "(";
    let methodName = model.Method_Name;
    let indent = "";
    if (model.Method_IsLongRun && model.CommandGroup_HasShowCommand) {
        if (!model.SDK_IsTrack1) {
            methodName = "begin_" + methodName;
        }
        methodCall += "sdk_no_wait(";
        indent = " ".repeat(methodCall.length);
        methodCall += "no_wait," + "\n" + indent + "client." + methodName;
    } else {
        if(!model.SDK_IsTrack1 && model.Method_IsLongRun) {
            methodName = "begin_" + methodName;
        }
        methodCall += "client." + methodName + "(";
        indent = " ".repeat(methodCall.length); 
    }
    

    let skip = false;
    if (model.SelectFirstMethodParameter(true)) {
        do {
            if (skip) {
                skip = false;
            }
            let param = model.MethodParameter;
            if ((model.MethodParameter_IsFlattened && !model.MethodParameter_IsCliFlattened ) || (model.MethodParameter_IsCliFlattened && !model.SDK_NoFlatten)) {
                continue;
            }
            if (model.MethodParameter_Type == SchemaType.Constant) {
                continue;
            }

            if(isNullOrUndefined(model.MethodParameter_NamePython)) {
                continue;
            }
            let parameterPair = '';

            let m4FlattenedFrom = model.MethodParameter.language['cli']?.['m4FlattenedFrom']
            if (isNullOrUndefined(m4FlattenedFrom) || m4FlattenedFrom.length <= 0) {
                parameterPair = GetSimpleCallItem(model, model.MethodParameter, required);
            } else {
                let items = [];
                for(let mparam of m4FlattenedFrom) {
                    items.push(GetSimpleCallItem(model, mparam, required, true, param));
                }
                parameterPair = items.join("," + "\n" + indent); 
            }
            

            if (methodCall.endsWith("(")) {
                // XXX - split and pop is a hack
                methodCall += parameterPair;
            }
            else {
                methodCall += "," + "\n" + indent + parameterPair;
            }
            
            if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                let baseParam = model.MethodParameter;
                let hasNext = false;
                if(model.SelectNextMethodParameter(true)) {
                    hasNext = true;
                    while (hasNext && model.MethodParameter['polyBaseParam'] == baseParam) {
                        hasNext = model.SelectNextMethodParameter(true);
                    }
                }
                
                if (hasNext && model.MethodParameter['polyBaseParam'] != baseParam) {
                    skip = true;
                }
                
            }
        }
        while (skip || model.SelectNextMethodParameter(true));
    }

    methodCall += ")";

    return methodCall.split("\n");
}
