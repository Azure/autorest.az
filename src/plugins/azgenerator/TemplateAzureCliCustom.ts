/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliCustom(model: CodeModelAz) : string[] {
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

    if (required['json'])
    {
        output.push("import json");
    }

    output = output.concat(body);
    output.push("");

    return output;
}


function GenerateBody(model: CodeModelAz, required: any) : string[] {
    var output: string[] = [];

    if (model.SelectFirstCommandGroup())
    {
        do
        {
            //let methods: string[] = model.CommandGroup_Commands;
            if (model.SelectFirstCommand())
            {
                do
                {
                    // create, delete, list, show, update

                    output.push("");
                    output.push("");

                    //
                    // method
                    //

                    //let updatedMethodName = ((methodName != "show") ? methodName : "get").replace(/-/g, '_');
                    let updatedMethodName: string = model.Command_FunctionName; 
                    let call = "def " + updatedMethodName + "(";
                    let indent = " ".repeat(call.length);
                    let isUpdate = updatedMethodName.startsWith("update_");

                    output.push(call + "cmd, client");

                    if (model.SelectFirstOption())
                    {
                        do
                        {
                            let required: boolean = model.Option_IsRequired;

                            // XXX - handle this in model
                            //if (element.Type == "placeholder")
                            //    continue;

                            // XXX - handle this in model
                            //if (isUpdate && element.PathSwagger.startsWith("/"))
                            //    required = false;

                            if (isUpdate && model.Option_PathSwagger.startsWith("/"))
                                required = false;

                            if (required)
                            {
                                let name = model.Option_NamePython; // PythonParameterName(element.Name);
                                output[output.length - 1] += ",";  
                                output.push(indent + name);
                            }
                        } while (model.SelectNextOption());
                    }

                    if (model.SelectFirstOption())
                    {
                        do
                        {
                            let required = model.Option_IsRequired;
                            
                            
                            if (model.Option_In == "path") {
                                continue;
                            }
                                

                            if (isUpdate && model.Option_PathSwagger.startsWith("/"))
                                required = false;

                            if (!required)
                            {
                                output[output.length - 1] += ",";  
                                output.push(indent + model.Option_NamePython + "=None");
                            }
                        }
                        while (model.SelectNextOption());
                    }

                    output[output.length - 1] += "):";  

                    let output_body: string[] = []
                    let output_method_call: string[] = [];

                    if (model.SelectFirstMethod())
                    {
                        if (model.Method_BodyParameterName != null)
                        {
                            // create body transformation for methods that support it
                            let methodName: string = model.Command_MethodName;

                            if (methodName != "show" && methodName != "list" && methodName != "delete")
                            {
                                // body transformation
                                if (!isUpdate)
                                {
                                    output_body.push("    body = {}");
                                }
                                else
                                {
                                    // XXX-FIX-GET
                                    //if (methods.indexOf("show") >= 0)
                                    //{
                                    //    model.SelectCommand("show");
                                    //    output_body.push("    body = " + GetMethodCall(model) + ".as_dict()");
                                    //}
                                    //else
                                    //{
                                        output_body.push("    body = {}");
                                    //}
                                }

                                if (model.SelectFirstMethodParameter())
                                {
                                    do
                                    {
                                        let access = "    body"
                                        if (model.MethodParameter_In == "body")
                                        {
                                            let parts = model.Option_PathSdk.split("/");
                                            let last: string = parts.pop();
                                            parts.forEach(part => {
                                                if (part != "" && part != "*")
                                                {
                                                    access += ".setdefault('" + part + "', {})";
                                                }
                                            });

                                            access += "['" + last + "'] = ";

                                            if (model.MethodParameter_IsList)
                                            {
                                                if (model.MethodParameter_Type != "dictionaries")
                                                {
                                                    // a comma separated list
                                                    access += "None if " + model.MethodParameter_Name + " is None else " + model.MethodParameter_Name;
                                                }
                                                else
                                                {
                                                    // already preprocessed by actions
                                                    access += model.MethodParameter_Name;
                                                }
                                            }
                                            else if (model.MethodParameter_Type != "dictionaries")
                                            {
                                                access += model.MethodParameter_Name + "  # " + model.MethodParameter_Type; // # JSON.stringify(element);
                                            }
                                            else
                                            {
                                                access += "json.loads(" + model.MethodParameter_Name + ") if isinstance(" +model.MethodParameter_Name + ", str) else " + model.MethodParameter_Name
                                                required['json'] = true;
                                            }
                                            
                                            if (isUpdate)
                                            {
                                                output_body.push("    if " + model.MethodParameter_Name + " is not None:");
                                                output_body.push("    " + access);
                                            }
                                            else
                                            {
                                                output_body.push(access);
                                            }
                                        }
                                    }
                                    while (model.SelectNextMethodParameter());
                                }
                            }
                        }

                        let needIfStatement = !model.Method_IsLast;
                        
                        do
                        {
                            let prefix = "    ";
                            if (needIfStatement)
                            {
                                let ifStatement = prefix;
                                prefix += "    ";

                                if (!model.Method_IsLast)
                                {
                                    ifStatement += ((model.Method_IsFirst) ? "if" : "elif");
                                    
                                    if (model.SelectFirstMethodParameter())
                                    {
                                        do
                                        {
                                            ifStatement += ((ifStatement.endsWith("if")) ? "" : " and");
                                            ifStatement += " " + model.MethodParameter_MapsTo + " is not None"
                                        }
                                        while (model.SelectNextMethodParameter());
                                        ifStatement += ":";
                                        output_method_call.push(ifStatement);
                                    }
                                }
                                else
                                {
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
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }
    
    return output;
}

function GetMethodCall(model: CodeModelAz): string
{
    let methodCall: string = "";
    //methodCall += "client." + mode.GetModuleOperationName() +"." + ctx.Methods[methodIdx].Name +  "(";
    methodCall += "client." + model.Method_Name +  "(";

    let bodyParameterName = model.Method_BodyParameterName;

    if (model.SelectFirstMethodParameter())
    {
        do
        {
            let optionName = model.MethodParameter_MapsTo;
            let parameterName = model.MethodParameter_Name; // p.PathSdk.split("/").pop();
            
            if (methodCall.endsWith("("))
            {
                // XXX - split and pop is a hack
                methodCall += parameterName + "=" + optionName;
            }
            else
            {
                methodCall += ", " + parameterName + "=" + optionName;
            }
        }
        while (model.SelectNextMethodParameter());
    }

    if (bodyParameterName != null)
    {
        if (methodCall.endsWith("("))
        {
            // XXX - split and pop is a hack
            methodCall += bodyParameterName + "=body";
        }
        else
        {
            methodCall += ", " + bodyParameterName + "=body";
        }
    }

    methodCall += ")";

    return methodCall;
}
