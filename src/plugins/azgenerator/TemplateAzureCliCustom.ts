/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";
import { SchemaType, ParameterLocation } from "@azure-tools/codemodel";
import { HeaderGenerator } from "./Header";

export function GenerateAzureCliCustom(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    header.disableLineTooLong = true;
    // can't be currently reproduced
    // header.disableTooManyStatements = true;
    header.disableTooManyLines = true;

    // this is no longer a problem
    // header.disableTooManyLocals = true;
    // header.disableUnusedArgument = true;

    let required: any = {};
    let body: string[] = GenerateBody(model, required);

    if (required['json']) {
        header.addImport("json");
    }

    let output = header.getLines();
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
                    if (model.MethodParameter_Type == SchemaType.Constant) {
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
                    let access = "    " + model.MethodParameter_MapsTo;
                    access += " = json.loads(" + model.MethodParameter_MapsTo + ") if isinstance(" + model.MethodParameter_MapsTo + ", str) else " + model.MethodParameter_MapsTo
                    required['json'] = true;
                    output_body.push(access);

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
    let methodName = model.Method_Name;
    if (model.Method_IsLongRun) {
        methodName = "begin_" + methodName;
    }
    methodCall += "client." + methodName + "(";

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
                methodCall += ", " + parameterName + "=" + optionName;
            }
        }
        while (model.SelectNextMethodParameter());
    }



    methodCall += ")";

    return methodCall;
}
