/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Example } from "../Common/Example"
import { Indent, ToSnakeCase } from "../Common/Helpers";

export function GenerateExamplePythonSdk(namespace: string, mgmtClient: string, example: Example) : string[] {
    var output: string[] = [];

    output.push("# " + example.Id);
    output.push("#");
    output.push("# This script expects that the following environment vars are set:");
    output.push("#");
    output.push("# AZURE_TENANT: your Azure Active Directory tenant id or domain");
    output.push("# AZURE_CLIENT_ID: your Azure Active Directory Application Client ID");
    output.push("# AZURE_SECRET: your Azure Active Directory Application Secret");
    output.push("# AZURE_SUBSCRIPTION_ID: your Azure Subscription Id");
    output.push("");
    output.push("import os");
    output.push("import traceback");
    output.push("from azure.common.credentials import ServicePrincipalCredentials");
    output.push("from msrestazure.azure_exceptions import CloudError");
    output.push("from msrestazure.azure_configuration import AzureConfiguration");
    output.push("from msrest.service_client import ServiceClient");
    output.push("from msrest.polling import LROPoller");
    output.push("from msrestazure.polling.arm_polling import ARMPolling");
    output.push("from msrest.pipeline import ClientRawResponse");

    output.push("from " + namespace + " import " + mgmtClient);


    output.push("import uuid");
    output.push("");
    output.push("SUBSCRIPTION_ID = os.environ['AZURE_SUBSCRIPTION_ID']");

    var vars =  example.Variables;
    for (var v of vars)
    {
        output.push(v.name.toUpperCase() + " = \"" + ToCamelCase(v.value.split("_NAME")[0].toLowerCase()) + "\"");   
    }
    output.push("");

    var json: string[] = GetExampleBodyJson(_PythonizeBody(example.GetExampleBody()));
    for (var line of json)
    {
        if (line.startsWith("{"))
        {
            output.push("BODY = " + line);
        }
        else
        {
            output.push(line);
        }
    }

    output.push("");
    output.push("def get_credentials():");
    output.push("    credentials = ServicePrincipalCredentials(");
    output.push("        client_id=os.environ['AZURE_CLIENT_ID'],");
    output.push("        secret=os.environ['AZURE_SECRET'],");
    output.push("        tenant=os.environ['AZURE_TENANT']");
    output.push("    )");
    output.push("    return credentials");
    if (example.IsExampleLongRunning())
    {
        output.push("");
        output.push("");
        output.push("def wait_poller(service_client, operation_config, response):");
        output.push("    def get_long_running_output(response):");
        output.push("        return response");
        output.push("    poller = LROPoller(service_client,");
        output.push("                        ClientRawResponse(None, response),");
        output.push("                        get_long_running_output,");
        output.push("                        ARMPolling(30, **operation_config))");
        output.push("    try:");
        output.push("        poller.wait(timeout=600)");
        output.push("        response = poller.result()");
        output.push("    except Exception as exc:");
        output.push("        raise");
        output.push("    return response");
    }
    output.push("");
    output.push("");
    output.push("def run_example():");
    output.push("    credentials = get_credentials()");
    output.push("    mgmt_client = " + mgmtClient + "(credentials, os.environ['AZURE_SUBSCRIPTION_ID'])");

    output.push("    response = mgmt_client." + ToSnakeCase(example.OperationName) + "." + ToSnakeCase(example.MethodName) + "(" + _UrlToParameters(example.Url) + ", BODY)");

    output.push("    if isinstance(response, LROPoller):");
    output.push("        while not response.done():");
    output.push("            response.wait(timeout=30)");
    output.push("        response = response.result()");

    output.push("    print(str(response))");
    output.push("");
    output.push("");
    output.push("if __name__ == \"__main__\":");
    output.push("    run_example()");

    return output;
}

function ToCamelCase(v: string)
{
    v = v.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
    .reduce((result, word) => result + capitalize(word.toLowerCase()))
    return v.charAt(0).toLowerCase() + v.slice(1)
}

function capitalize(v: string) {
    return v.charAt(0).toUpperCase() + v.toLowerCase().slice(1);
}

function GetExampleBodyJson(body: any): string[]
{
    var json: string = "{}";

    if (body != null)
    {
        //this.bodyNormalize(body);
        json = JSON.stringify(body, null, "  ");
    }

    // XXX check if \n is sufficient
    var lines: string[] = json.split("\n");

    for (var i = 0; i < lines.length; i++)
    {
        var l: string = lines[i];
        if (lines[i].endsWith(": true"))
        {
            l = l.replace(": true", ": True");
        }
        else if (lines[i].endsWith(": true,"))
        {
            l = l.replace(": true,", ": True,");
        }
        else if (lines[i].endsWith(": false"))
        {
            l = l.replace(": false", ": False");
        }
        else if (lines[i].endsWith(": false,"))
        {
            l = l.replace(": false,", ": False,");
        }

        // XXX - will this work?
        if (l.indexOf("/subscription") >= 0)
        {
            var idx: number = 0;
            while ((idx = l.indexOf("{{", idx)) > 0)
            {
                var start: number = idx;
                var end: number = l.indexOf("}}", idx) + 2;
                var part: string = l.substring(start, end);
                var name: string = part.substring(2, part.length - 2).trim();
                var isLast: boolean = l[end + 2] == '"';

                if (!isLast)
                {
                    l = l.replace(part, "\" + " + name.toUpperCase() + " + \"");
                }
                else
                {
                    l = l.replace(part + "\"", "\" + " + name.toUpperCase());
                }
                idx = end + 2;
            }
        }

        lines[i] = l;
    }
    return lines;
}

function _UrlToParameters(sourceUrl: string): string
{
    var parts: string[] = sourceUrl.split("/");
    var params = "";

    for (var i: number = 0; i < parts.length; i++)
    {
        var part: string = parts[i];
        var last: boolean = (i == parts.length - 1);

        if (part.startsWith("{{"))
        {
            var varName: string = part.substring(2, part.length - 3).trim().toUpperCase();

            if (varName == "SUBSCRIPTION_ID") continue;

            // close and reopen quotes, add add variable name in between
            params += varName + (last ? "" : ", ");
        }
    }
    return params;
}

function _PythonizeBody(body: any): any
{
    if (typeof body == "string" || typeof body == "number" || typeof body == "boolean")
    {
        return body;
    }

    if (body instanceof Array)
    {
        for (var i: number = 0; i < body.length; i++)
        {
            body[i] = _PythonizeBody(body[i]);
        }
        return body;
    }
    
    for (let k in body)
    {
        let newBody: any = {};

        for (let k in body)
        {
            newBody[ToSnakeCase(k)] = _PythonizeBody(body[k]);
        }
        return newBody;
    }
}