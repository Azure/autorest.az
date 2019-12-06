/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MapModuleGroup, ModuleOption, ModuleMethod, Module, EnumValue } from "./ModuleMap"
import { Example, ExampleVariable } from "./Example"
import { ToSnakeCase, ToCamelCase, NormalizeResourceId } from "./Helpers"


export class ExampleProcessor
{
    public constructor (swagger: any, testScenario: any)
    {
        this._examples = [];
        this._swagger = swagger;
        this._testScenario = testScenario;

        for (var operationIdx = 0; operationIdx < this._swagger.operations.length; operationIdx++)
        {
            var operation = this._swagger.operations[operationIdx];
            for (var methodIdx = 0; methodIdx < operation.methods.length; methodIdx++)
            {
                var method = operation.methods[methodIdx];

                if (method['extensions'] == undefined || method['extensions']['x-ms-examples'] == undefined)
                    // XXX - warning, no examples
                    continue;

                var examplesDictionary = method['extensions']['x-ms-examples'];
                for (var k in examplesDictionary)
                {
                    var body = examplesDictionary[k];
                    var url = NormalizeResourceId(method['url']);
                    var refs: string[] = [];
                    var vars: ExampleVariable[] = [];
                    var filename: string = this.GetExampleFilename(NormalizeResourceId(method['url']), method['httpMethod']);
                    var longRunning: boolean = false;

                    if (method['extensions']['x-ms-long-running-operation'])
                    {
                        longRunning = true;
                    }

                    this.ProcessExample(body);
                    this.ScanExampleForRefsAndVars(method['httpMethod'], url, method['url'], filename, body, refs, vars);

                    var example = new Example(body,
                                              url,
                                              method['httpMethod'],
                                              k,
                                              filename,
                                              vars,
                                              refs,
                                              operation['$id'],
                                              method['$id'],
                                              operation['name']['raw'],
                                              method['name']['raw'],
                                              longRunning);
                    this._examples.push(example);
                }
            }
        }

        this.CountCoverage();
    }

    private _examples: Example[] = null;
    private _map: MapModuleGroup = null;

    private _swagger: any = null;
    private _testScenario: any = null;

    private _currentOperation: number;
    private _filenames = {};

    public GetExamples(): Example[]
    {
        return this._examples;
    }

    private CountCoverage()
    {
        this.MethodsTotal = 0;
        this.MethodsCovered = 0;
        this.ExamplesTotal = 0;
        this.ExamplesTested = 0;
        for (var idx = 0; idx < this._swagger.operations.length; idx++)
        {
            for (var mi = 0; mi < this._swagger.operations[idx].methods.length; mi++)
            {
                let method = this._swagger.operations[idx].methods[mi];
                this.MethodsTotal++;

                if (method['extensions'] != undefined && method['extensions']['x-ms-examples'] != undefined)
                {
                    this.MethodsCovered++;

                    for (let example in method['extensions']['x-ms-examples'])
                    {
                        this.ExamplesTotal++;

                        // check if example is in test scenario
                        for (let item of this._testScenario)
                        {
                            if (item['name'] == example)
                            {
                                this.ExamplesTested++;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }


    private ProcessExample(body: any)
    {
        if (body instanceof Array)
        {
            // va.Count
            for (var i = 0; i < body.length; i++)
            {
                this.ProcessExample(body[i]);
            }
        }
        else if (typeof body == 'object')
        {
            // dictionary -- 
            for (var pp in body)
            {
                var subv: any = body[pp];

                if (typeof subv == 'string')
                {
                    if (subv.startsWith("/subscription"))
                    {
                        body[pp] = NormalizeResourceId(subv);
                    }
                }
                else
                {
                    this.ProcessExample(subv);
                }
            }

            // remove name -- as it's usually a duplicate of object name from url
            //if (top) vo.Remove("name");
        }
    }

    private GetExampleFilename(url: string, method: string): string
    {
        return this.GetFilenameFromUrl(url, method, true);
    }

    private GetFilenameFromUrl(url: string, exampleMethod: string, unique: boolean): string
    {
        var parts: string[] = url.split("/");
        var filename: string = "";

        for (var i: number = 0; i < parts.length; i++)
        {
            var part: string = parts[i].toLowerCase();
            var last: boolean = (i == parts.length - 1);

            
            if (part.startsWith("microsoft."))
            {
                // add provided as a first part of filename
                part = part.toLowerCase().substring("microsoft.".length);
            }
            else if (part == "resourcegroups")
            {
                // XXX - fix it
                if (url.indexOf("providers") >= 0)
                    part = "";
            }
            else if (part.startsWith("{") || part == "subscriptions" || part == "" || part == "providers")
            {
                part = "";
                // don't include this
                // url += String.Join("", part.substring(3, part.length - 6).ToLower().split("_")) + "_";
            }
            else
            {
                part = part.toLowerCase();
            }

            if (part != "")
            {
                if (filename != "")
                    filename += "_";

                filename += part;
            }
        }

        if (filename == "")
        {
            // XXX - is it replacing all?
            filename = url.replace("/", "_");
        }

        filename += "_" + exampleMethod;

        if (unique)
        {
            if (this._filenames[filename] != undefined)
            {
                this._filenames[filename]++;
                filename += "_" + this._filenames[filename];
            }
            else
            {
                this._filenames[filename] = 0;
            }
        }

        return filename;
    }

    private ScanExampleForRefsAndVars(method: string, url: string, unprocessedUrl: string, filename: string, example: any, refs: string[], vars: ExampleVariable[])
    {
        this.ExtractVarsFromUrl(url, unprocessedUrl, vars);

        var parts: string[] = url.split("/");

        if (method == "put" || method == "patch")
        {
            this.ScanExampleBodyForReferencesAndVariables(example["parameters"], refs, vars);
            var longFilename: string = filename;
    
            // add superresource reference
            for (var i = parts.length - 1; i > 0; i--)
            {
                var sub: string[] = parts.slice(0, i);

                var shortFilename: string = this.GetFilenameFromUrl(sub.join('/'), 'put', false);

                if (shortFilename.length < longFilename.length)
                {
                    if (shortFilename.length > 0 && !shortFilename.startsWith("_") && shortFilename.split("_").length > 2)
                    {
                        refs.push(shortFilename);
                    }
                    break;
                }
            }

            var anyReferences = false;
            for (let ref of refs)
            {
                if (!ref.startsWith("# ref##"))
                    anyReferences = true;
            }

            if (!anyReferences)
            {
                refs.push("resourcegroups_put");
            }
        }

        return refs;
    }

    private ScanExampleBodyForReferencesAndVariables(v: any, refs: string[], vars: ExampleVariable[])
    {
        if (v instanceof Array)
        {
            for (var i = 0; i < v.length; i++)
            {
                this.ScanExampleBodyForReferencesAndVariables(v[i], refs, vars);
            }
        }
        else if (typeof v == 'object')
        {
            for (var pp in v)
            {
                var subv: any = v[pp];

                if (typeof(subv) == 'string')
                {
                    if (pp == "id" || pp.endsWith("_id") || subv.indexOf("/") >= 0)
                    {
                        if (subv.indexOf("\r") == -1 && subv.indexOf("\n") == -1 && !(pp == "type"))
                        {
                            if (subv.startsWith("/subscription"))
                            {
                                refs.push(this.GetFilenameFromUrl(subv, "put", false));
                                
                                this.ExtractVarsFromUrl(subv, null, vars);
                            }
                            else
                            {
                                refs.push("# ref##" + pp + "##" + subv);
                            }
                        }
                    }
                }
                else
                {
                    this.ScanExampleBodyForReferencesAndVariables(subv, refs, vars);
                }
            }
        }
    }

    private ExtractVarsFromUrl(url: string, unprocessedUrl: string, vars: ExampleVariable[])
    {
        var parts: string[] = url.split("/");
        var unprocessedParts: string[] = (unprocessedUrl ? unprocessedUrl.split("/") : null);

        for (var i: number = 0; i < parts.length; i++)
        {
            var part: string = parts[i];
            if (part.startsWith("{{"))
            {
                var varName: string = part.substring(2, part.length - 2).trim().toLowerCase();

                if (varName != "subscription_id")
                {
                    var varValue: string = ToCamelCase(("my_" + varName).split("_name")[0].toLowerCase());
                    var swaggerName: string = (unprocessedUrl ? unprocessedParts[i] : "{}");

                    if (swaggerName)
                    {
                        swaggerName = swaggerName.substr(1, swaggerName.length - 2);
                        var found: boolean = false;
                        for (var v of vars)
                        {
                            if (v.name == varName)
                                found = true;
                        }

                        if (!found)
                            vars.push(new ExampleVariable(varName, varValue, swaggerName));
                    }
                }
            }
        }
    }

    public MethodsTotal: number;
    public MethodsCovered: number;
    public ExamplesTotal: number;
    public ExamplesTested: number;
}
