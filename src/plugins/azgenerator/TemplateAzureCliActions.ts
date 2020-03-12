/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { ToCamelCase, Capitalize } from "../../utils/helper";
import { SchemaType } from "@azure-tools/codemodel";
import { stringify } from "querystring";
import { HeaderGenerator } from "./Header";

export function GenerateAzureCliActions(model: CodeModelAz) : string[] {
    let header: HeaderGenerator = new HeaderGenerator();

    header.addImport("argparse");
    header.addFromImport("knack.util", ["CLIError"]);
    header.disableProtectedAccess = true;

    let output: string[] = header.getLines();
    let allActions: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstCommandGroup())
    {
        do
        {
            if (model.SelectFirstCommand())
            {
                do
                {
                    if (model.SelectFirstMethod()) {
                        do {
                            if (model.SelectFirstMethodParameter())
                            {
                                do
                                {
                                    if (model.MethodParameter_IsList && model.MethodParameter_IsListOfSimple)
                                    {
                                        if (model.MethodParameter_Type == SchemaType.Object || model.MethodParameter_Type == SchemaType.Array)
                                        {
                                            let actionName: string = "Add" + Capitalize(ToCamelCase(model.MethodParameter_Name));
        
                                            if(allActions.has(actionName)) {
                                                continue;
                                            }
                                            
                                            output.push("");
                                            output.push("");
                                            output.push("class " + actionName + "(argparse._AppendAction):");
                                            output.push("    def __call__(self, parser, namespace, values, option_string=None):");
                                            output.push("        action = self.get_action(values, option_string)");
                                            output.push("        super(" + "Add" + Capitalize(ToCamelCase(model.MethodParameter_Name)) + ", self).__call__(parser, namespace, action, option_string)");
                                            output.push("");
                                            output.push("    def get_action(self, values, option_string):  # pylint: disable=no-self-use");
                                            output.push("        try:");
                                            output.push("            properties = dict(x.split('=', 1) for x in values)");
                                            output.push("        except ValueError:");
                                            output.push("            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))");
                                            output.push("        d = {}");
                                            output.push("        for k in properties:");
                                            output.push("            kl = k.lower()");
                                            output.push("            v = properties[k]");
                                            if (model.EnterSubMethodParameters()) {
                                                if (model.SelectFirstMethodParameter())
                                                {
                                                    let ifkv = "if";
                                                    do
                                                    {
                                                        output.push("            " + ifkv + " kl == '" + model.MethodParameter_NamePython + "':");
                                                        output.push("                d['" + model.MethodParameter_NamePython + "'] = v");
                                                        ifkv = "elif";
                                                    } while (model.SelectNextMethodParameter());
                                                }
                                            }
        
                                            model.ExitSubMethodParameters();
        
                                            output.push("        return d");  
                                            allActions.set(actionName, true);                              
                                        }
        
                                    }
        
                                } while (model.SelectNextMethodParameter());
                            }
                        } while (model.SelectNextMethod());
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    output.push("");

    return output;
}
