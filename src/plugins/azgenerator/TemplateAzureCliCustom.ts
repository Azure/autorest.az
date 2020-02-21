/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";
import { SchemaType, ParameterLocation } from "@azure-tools/codemodel";

export function GenerateAzureCliCustom(model: CodeModelAz): string[] {
    var output: string[] = [];

    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# pylint: disable=line-too-long");
    output.push("# pylint: disable=too-many-statements");
    output.push("# pylint: disable=too-many-lines");
    output.push("# pylint: disable=too-many-locals");
    output.push("# pylint: disable=unused-argument");
    //output.push("from knack.util import CLIError");

    let required: any = {};
    let body: string[] = GenerateBody(model, required);

    if (required['json']) {
        output.push("import json");
    }

    output = output.concat(body);
    output.push("");

    return output;
}


function GenerateBody(model: CodeModelAz, required: any): string[] {
    var output: string[] = [];

    if (model.SelectFirstCommandGroup()) {
        do {
            if (model.SelectFirstCommand()) {
                do {
                    output = output.concat(GetCommandBody(model, required));
                    if (model.Command_CanSplit) {
                        output = output.concat(GetCommandBody(model, required, true));
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    return output;
}

function GetCommandBody(model: CodeModelAz, required: boolean, needUpdate: boolean = false) {
    // create, delete, list, show, update
    let output: string[] = [];
    output.push("");
    output.push("");

    //
    // method
    //

    let updatedMethodName: string = model.Command_FunctionName;
    if (needUpdate) {
        updatedMethodName = updatedMethodName.replace(/_create/g, "_update");
    }
    let call = "def " + updatedMethodName + "(";
    let indent = " ".repeat(call.length);
    let isUpdate = updatedMethodName.startsWith("update_");

    output.push(call + "cmd, client");

    let allParam: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstMethod()) {
        do {
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if(model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }

                    let required: boolean = model.MethodParameter_RequiredByMethod;

                    let name = model.MethodParameter_NamePython; // PythonParameterName(element.Name);
                    if (required && !allParam.has(name)) {
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
                    if(model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }
                    let required = model.MethodParameter_RequiredByMethod;

                    let name = model.MethodParameter_NamePython;
                    if (!required && !allParam.has(name)) {
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

    let output_body: string[] = []
    let output_method_call: string[] = [];

    if (model.SelectFirstMethod()) {
        // create body transformation for methods that support it
        let methodName: string = model.Command_MethodName;

        // body transformation

        if (model.SelectFirstMethodParameter()) {
            do {
                if (model.MethodParameter_IsFlattened) {
                    let bodyName = model.MethodParameter_Name;
                    output_body.push("    " + bodyName + " = {}");
                    let body = model.MethodParameter;

                    let body_cnt = 0;
                    while (model.SelectNextMethodParameter()) {
                        let access = "    " + bodyName;
                        let param = model.MethodParameter;
                        if(model.MethodParameter_Type == SchemaType.Constant) {
                            continue;
                        }
                        let oriParam = (param['originalParameter']);
                        if (oriParam == body) {
                            body_cnt++;
                            if (param['pathToProperty']?.length == 1) {
                                let pathParam = param['pathToProperty'][0];
                                access += `.setdefault('${pathParam.language['python'].name}', {})`;
                                access += `['${model.MethodParameter_Name}'] = `;
                            } else {
                                access += `['${model.MethodParameter_Name}'] = `;
                            }
                            if (model.MethodParameter_IsList) {
                                if (model.MethodParameter_Type != SchemaType.Dictionary) {
                                    // a comma separated list
                                    access += "None if " + model.MethodParameter_MapsTo + " is None else " + model.MethodParameter_MapsTo;
                                }
                                else {
                                    // already preprocessed by actions
                                    access += model.MethodParameter_MapsTo;
                                }
                            }
                            else if (model.MethodParameter_Type != SchemaType.Dictionary) {
                                access += model.MethodParameter_MapsTo + "  # " + model.MethodParameter_Type; // # JSON.stringify(element);
                            }
                            else {
                                access += "json.loads(" + model.MethodParameter_MapsTo + ") if isinstance(" + model.MethodParameter_MapsTo + ", str) else " + model.MethodParameter_MapsTo
                                required['json'] = true;
                            }
                            
                            if (isUpdate) {
                                output_body.push("    if " + model.MethodParameter_MapsTo + " is not None:");
                                output_body.push("    " + access);
                            }
                            else {
                                output_body.push(access);
                            }

                        } else {
                            break;
                        }
                    }
                    if(body_cnt == 1) {
                        output_body.pop();
                        output_body.pop();
                        if(isUpdate) {
                            output_body.pop();
                        }
                    }
                }

            }
            while (model.SelectNextMethodParameter());

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
                            if(model.MethodParameter_Type == SchemaType.Constant) {
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

            let methodCall = prefix + "return " + GetMethodCall(model);
            output_method_call.push(methodCall);
        }
        while (model.SelectNextMethod());
    }

    output = output.concat(output_body);
    output = output.concat(output_method_call);
    return output;
}

function GetMethodCall(model: CodeModelAz): string {
    let methodCall: string = "";
    //methodCall += "client." + mode.GetModuleOperationName() +"." + ctx.Methods[methodIdx].Name +  "(";
    methodCall += "client." + model.Method_Name + "(";

    if (model.SelectFirstMethodParameter()) {
        do {
            let param = model.MethodParameter;
            if(model.MethodParameter_Type == SchemaType.Constant) {
                continue;
            }
            let optionName = model.MethodParameter_MapsTo;
            let parameterName = model.MethodParameter_Name; 
            if (model.MethodParameter_IsFlattened) {
                let body_cnt = 0;
                let body = model.MethodParameter;
                let preOptionName = "";
                let preParameterName = "";
                while(model.SelectNextMethodParameter()) {
                    let param = model.MethodParameter;
                    if(model.MethodParameter_Type == SchemaType.Constant) {
                        continue;
                    }
                    let oriParam = (param['originalParameter']);
                    if (oriParam == body) {
                        body_cnt++;
                        preOptionName = model.MethodParameter_MapsTo;
                        preParameterName = model.MethodParameter_Name;
                    } else {
                        break;
                    }    
                }
                if(body_cnt == 1) {
                    optionName = preOptionName;
                    parameterName = preParameterName;
                }
            }

            if (methodCall.endsWith("(")) {
                // XXX - split and pop is a hack
                methodCall += parameterName + "=" + optionName;
            }
            else {
                methodCall += ", " + parameterName + "=" + optionName;
            }
        }
        while (model.SelectNextMethodParameter());
    }

    methodCall += ")";

    return methodCall;
}
