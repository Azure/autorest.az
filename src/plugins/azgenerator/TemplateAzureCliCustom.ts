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
            //let methods: string[] = model.CommandGroup_Commands;
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

    //let updatedMethodName = ((methodName != "show") ? methodName : "get").replace(/-/g, '_');
    let updatedMethodName: string = model.Command_FunctionName;
    if (needUpdate) {
        updatedMethodName = model.Command_FunctionName.replace(/_create/g, "_update");
    }
    let call = "def " + updatedMethodName + "(";
    let indent = " ".repeat(call.length);
    let isUpdate = updatedMethodName.startsWith("update_");

    output.push(call + "cmd, client");

    if (model.SelectFirstOption()) {
        do {
            if (model.Option_IsFlattened) {
                continue;
            }

            let required: boolean = model.Option_IsRequired;

            // XXX - handle this in model
            //if (element.Type == "placeholder")
            //    continue;

            // XXX - handle this in model
            //if (isUpdate && element.PathSwagger.startsWith("/"))
            //    required = false;

            if (isUpdate && model.Option_PathSwagger.startsWith("/"))
                required = false;

            if (required) {
                let name = model.Option_NamePython; // PythonParameterName(element.Name);
                output[output.length - 1] += ",";
                output.push(indent + name);
            }
        } while (model.SelectNextOption());
    }

    if (model.SelectFirstOption()) {
        do {
            if (model.Option_IsFlattened) {
                continue;
            }
            let required = model.Option_IsRequired;


            if (model.Option_In == ParameterLocation.Path) {
                continue;
            }


            if (isUpdate && model.Option_PathSwagger.startsWith("/"))
                required = false;

            if (!required) {
                output[output.length - 1] += ",";
                output.push(indent + model.Option_NamePython + "=None");
            }
        }
        while (model.SelectNextOption());
    }

    output[output.length - 1] += "):";

    let output_body: string[] = []
    let output_method_call: string[] = [];

    if (model.SelectFirstMethod()) {
        // create body transformation for methods that support it
        let methodName: string = model.Command_MethodName;

        if (methodName != "show" && methodName != "list" && methodName != "delete") {
            // body transformation

            if (model.SelectFirstMethodParameter()) {
                do {
                    if(model.MethodParameter_IsFlattened) {
                        let bodyName = model.MethodParameter_Name;
                        output_body.push("    " + bodyName + " = {}");
                        let body = model.MethodParameter;

                        while(model.SelectNextMethodParameter()) {
                            let access = "    " + bodyName;
                            let param = model.MethodParameter;
                            let oriParam = (param['originalParameter']);
                            if(oriParam == body) {
                                if(param['pathToProperty']?.length == 1) {
                                    let pathParam = param['pathToProperty'][0];
                                    access += `.setdefault(' + ${pathParam.language['python'].name} + ', {})`;
                                    access += `[' + ${model.MethodParameter_Name} + '] = `;
                                } else {
                                    access += `[' + ${model.MethodParameter_Name} + '] = `;
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
                    }

                }
                while (model.SelectNextMethodParameter());
                
            } 

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
            if(param.originalParameter != null) {
                continue;
            }
            let optionName = model.MethodParameter_MapsTo;
            let parameterName = model.MethodParameter_Name; // p.PathSdk.split("/").pop();

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
