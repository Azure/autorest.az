/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Example } from "../Common/Example"

export function GenerateExampleAzureCLI(model: Example) : string[] {
    var output: string[] = [];

    output.push("# " + model.Id);

    var vars =  model.Variables;
    for (var v of vars)
    {
        output.push(v.name.toUpperCase() + "=\"" + ToCamelCase(v.value.split("_NAME")[0].toLowerCase()) + "\"");   
    }
    output.push("");

    var json: string[] = GetExampleBodyJson(model.GetExampleBody());
    var method: string = model.Method.toLowerCase();
    var hasBody:boolean = (method == "put" || method == "post");
    output.push("az rest --method " + model.Method.toLowerCase() + " --uri " + ConvertUrl(model.Url) + "?api-version=" + model.GetExampleApiVersion() + (hasBody ? " --body '": ""));

    if (hasBody)
    {
        for (var line of json)
        {
            output.push(line);
        }
        output.push("'")
    }

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
        //this.ExampleNormalize(body);
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

function ConvertUrl(sourceUrl: string): string
{
    var parts: string[] = sourceUrl.split("/");
    var url = "";

    for (var i: number = 0; i < parts.length; i++)
    {
        var part: string = parts[i];
        var last: boolean = (i == parts.length - 1);

        if (part.startsWith("{{"))
        {
            var varName: string = part.substring(2, part.length - 2).trim().toUpperCase();

            //if (varName == "SUBSCRIPTION_ID")
            //{
            //    varName = varName.ToLower();
            //}

            // close and reopen quotes, add add variable name in between
            url += "$" + varName + (last ? "" : "/");
        }
        else
        {
            url += part + (last ? "" : "/");
        }
    }
    return url;
}
