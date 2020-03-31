/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";
import { SchemaType, ParameterLocation, Operation, Parameter } from "@azure-tools/codemodel";
import { HeaderGenerator } from "./Header";
import { isNullOrUndefined } from "util";

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

    let output = [];
    output = output.concat(body);
    output.push("");

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}


function GenerateBody(model: CodeModelAz, required: any): string[] {
    var output: string[] = [];

    if (model.SelectFirstCommandGroup()) {
        do {
            if (model.SelectFirstCommand()) {
                do {
                    let originalOperation = model.Command_GetOriginalOperation;
                    let genericParameter = null;
                    if(!isNullOrUndefined(originalOperation)) {
                        genericParameter = model.Command_GenericSetterParameter(originalOperation);
                    } else {
                        genericParameter = model.Command_GenericSetterParameter(model.Command);
                    }

                    let needGeneric = false;
                    if(!isNullOrUndefined(genericParameter)) {
                        needGeneric = true;
                    }
                    let needUpdate = model.Command_CanSplit;
                    output = output.concat(GetCommandBody(model, required, false, originalOperation, false));
                    if (needUpdate) {
                        output = output.concat(GetCommandBody(model, required, needUpdate, originalOperation, needGeneric));
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
    if (model.SelectFirstMethodParameter()) {
        do {
            if(model.MethodParameter_IsFlattened) {
                let bodyName = model.MethodParameter_Name;
                let bodyParam = model.MethodParameter;
                if (isNullOrUndefined(bodyParam['extensions']?.['cli-poly-as-resource-base-schema'])) {
                    continue;
                }
                let prefix = "";
                if (needGeneric) {
                    prefix = "    instance";
                } else {
                    prefix = "    " + bodyName;
                }
                if(!needGeneric) {
                    output_body.push(prefix + " = {}");
                }
                let body = model.MethodParameter;
                while(model.SelectNextMethodParameter() && model.MethodParameter['originalParameter'] == body) {
                    let access = prefix;
                    let param = model.MethodParameter;
                    let paramName = model.Parameter_NamePython(model.MethodParameter['targetProperty']);
                    if(param.flattened != true) {
                        if(needGeneric) {
                            access += "." + paramName + " = " + model.MethodParameter_MapsTo;
                        } else {
                            access += "['" + paramName + "'] = " + model.MethodParameter_MapsTo;;
                        }
                        output_body.push(access);
                    } else {
                        if(needGeneric) {
                            prefix += "." + paramName;
                        } else {
                            prefix += "['" + paramName + "']";
                        }
                        access = prefix + " = {}"
                        body = model.MethodParameter;
                        output_body.push(access);
                    }
                }
            }

        } while (model.SelectNextMethodParameter());
    }
    return output_body;
}

function GetSingleCommandDef(model: CodeModelAz, needUpdate: boolean = false, needGeneric: boolean = false) {

    let output: string[] = [];
    let updatedMethodName: string = model.Command_FunctionName;
    if(needUpdate) {
        updatedMethodName = updatedMethodName.replace(/_create/g, '_update');
    }
    let call = "def " + updatedMethodName + "(";
    let indent = " ".repeat(call.length);
    if(needGeneric) {
        call += "instance, cmd";
    } else {
        call += "cmd, client";
    }
    output.push(call);
    
    let allParam: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstMethod()) {
        do {

            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }

                    if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
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

            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }

                    if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                        for(let child of model.MethodParameter.schema['children'].all) {
                            let name = model.Schema_MapsTo(child);
                            allParam.set(name, true);
                            output[output.length - 1] += ",";
                            output.push(indent + name + "=None");                            
                        }
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
        }
        while (model.SelectNextMethod());
    }

    output[output.length - 1] += "):";
    return output;
}

function GetSingleCommandBody(model: CodeModelAz, required, originalOperation: Operation = null, needGeneric: boolean = false) {
    let originalParameters = null;
    if(!isNullOrUndefined(originalOperation)) {
        originalParameters = originalOperation.parameters;
        if(!isNullOrUndefined(originalOperation.requests[0].parameters)) {
            originalParameters = originalParameters.concat(originalOperation.requests[0].parameters);
        }
    }

    let output: string[] = [];
    let output_body: string[] = []
    let output_method_call: string[] = [];

    if (model.SelectFirstMethod()) {
        // create body transformation for methods that support it
        let methodName: string = model.Command_MethodName;

        // body transformation

        // with x-ms-client-flatten it doesn't need this part now 
        if (model.SelectFirstMethodParameter()) {
            do {
                if (model.MethodParameter_IsList && !model.MethodParameter_IsListOfSimple) {
                    if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                        let baseName = model.MethodParameter_MapsTo;
                        let baseRequired = model.MethodParameter_RequiredByMethod;
                        output_body.push("    " + "all_" + baseName + " = []");
                        let childNames = [];
                        for(let child of model.MethodParameter.schema['children'].all) {
                            let childName = model.Schema_MapsTo(child)
                            childNames.push(childName);
                            output_body.push("    if " + childName + " is not None:");
                            output_body.push("        " + "all_" + baseName + ".append(" + childName + ")");
                        }
                        output_body.push("    if len(" + "all_" + baseName + ") > 1:");
                        output_body.push("        raise CLIError('at most one of  " + childNames.join(",") + " is needed for " + baseName + "!')");   
                        if(baseRequired) {
                            output_body.push("    if len(" + "all_" + baseName + ") != 1:");
                            output_body.push("        raise CLIError('" + baseName + " is required. but none of " + childNames.join(",") + " is provided!')");
                        }
                        output_body.push("    " + baseName + " = len(all_" + baseName + ") == 1? all_" + baseName + "[0]: None")
                        
                        continue;
                    }
                    required['json'] = true;
                    output_body.push("    if isinstance(" + model.MethodParameter_MapsTo + ", str):");
                    output_body.push("        " + model.MethodParameter_MapsTo + " = json.loads(" + model.MethodParameter_MapsTo + ")");
                }
            }
            while (model.SelectNextMethodParameter());

        }

        if(!isNullOrUndefined(originalOperation)) {
            output_body = output_body.concat(ConstructMethodBodyParameter(model, needGeneric));
        }
        
        let needIfStatement = !model.Method_IsLast;

        do {
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
                            ifStatement += ((ifStatement.endsWith("if")) ? "" : " and");
                            ifStatement += " " + model.MethodParameter_MapsTo + " is not None"
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
            if(!isNullOrUndefined(originalOperation)) {
                if(needGeneric) {
                    output_method_call = output_method_call.concat("    return instance");
                } else {
                    output_method_call = output_method_call.concat(GetPolyMethodCall(model, prefix, originalOperation, originalParameters));
                }  
            } else {
                if(needGeneric) {
                    output_method_call = output_method_call.concat("    return instance");
                } else {
                    output_method_call = output_method_call.concat(GetMethodCall(model, prefix));
                }
            }
        }
        while (model.SelectNextMethod());
    }

    output = output.concat(output_body);
    output = output.concat(output_method_call);   
    return output;
}

function GetCommandBody(model: CodeModelAz, required: boolean, needUpdate: boolean = false, originalOperation: Operation = null, needGeneric: boolean = false) {
    // create, delete, list, show, update
    let output: string[] = [];
    output.push("");
    output.push("");

    output = output.concat(GetSingleCommandDef(model, needUpdate, needGeneric));
    output = output.concat(GetSingleCommandBody(model, required, originalOperation, needGeneric))
    return output;
}

function GetPolyMethodCall(model: CodeModelAz, prefix: any, originalOperation: Operation, originalParameters: Parameter[]): string[] {
    let methodCall: string = prefix + "return ";
    //methodCall += "client." + mode.GetModuleOperationName() +"." + ctx.Methods[methodIdx].Name +  "(";
    let methodName = originalOperation.language['python'].name;
    if (model.Method_IsLongRun) {
        methodName = "begin_" + methodName;
    }
    methodCall += "client." + methodName + "(";
    
    let indent = " ".repeat(methodCall.length); 
    for(let param of originalParameters) {
        if (param.flattened) {
            continue;
        }
        if (param.schema.type == SchemaType.Constant) {
            continue;
        }
        if(model.Parameter_InGlobal(param)) {
            continue;
        }
        if(model.Parameter_IsHidden(param)) {
            continue;
        }
        let optionName = model.Parameter_MapsTo(param);
        let parameterName = model.Parameter_NamePython(param);

        if (methodCall.endsWith("(")) {
            // XXX - split and pop is a hack
            methodCall += parameterName + "=" + optionName;
        } else {
            methodCall += "," + "\n" + indent + parameterName + "=" + optionName;
        }
    }



    methodCall += ")";

    return methodCall.split("\n");
}

function GetMethodCall(model: CodeModelAz, prefix: any): string[] {
    let methodCall: string = prefix + "return ";
    //methodCall += "client." + mode.GetModuleOperationName() +"." + ctx.Methods[methodIdx].Name +  "(";
    let methodName = model.Method_Name;
    if (model.Method_IsLongRun) {
        methodName = "begin_" + methodName;
    }
    methodCall += "client." + methodName + "(";
    
    let indent = " ".repeat(methodCall.length); 
    if (model.SelectFirstMethodParameter()) {
        do {
            let param = model.MethodParameter;
            if (model.MethodParameter_IsFlattened) {
                continue;
            }
            if (model.MethodParameter_Type == SchemaType.Constant) {
                continue;
            }
            let optionName = model.MethodParameter_MapsTo;
            let parameterName = model.MethodParameter_NamePython;

            if (methodCall.endsWith("(")) {
                // XXX - split and pop is a hack
                methodCall += parameterName + "=" + optionName;
            }
            else {
                methodCall += "," + "\n"+ indent + parameterName + "=" + optionName;
            }
        }
        while (model.SelectNextMethodParameter());
    }



    methodCall += ")";

    return methodCall.split("\n");
}
