/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { ToCamelCase, Capitalize } from "../../utils/helper";
import { SchemaType } from "@azure-tools/codemodel";
import { stringify } from "querystring";

export function GenerateAzureCliActions(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("");
    output.push("import argparse");
    output.push("from knack.util import CLIError");
    output.push("");
    output.push("");
    output.push("# pylint: disable=protected-access");

    let allActions: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstCommandGroup())
    {
        do
        {
            if (model.SelectFirstCommand())
            {
                do
                {
                    if (model.SelectFirstOption())
                    {
                        do
                        {
                            if (model.Option_IsListOfComplex)
                            {
                                if (model.Option_Type == SchemaType.Object || model.Option_Type == SchemaType.Array)
                                {
                                    let actionName: string = "Add" + Capitalize(ToCamelCase(model.Option_Name));

                                    if(allActions.has(actionName)) {
                                        continue;
                                    }
                                    
                                    output.push("");
                                    output.push("");
                                    output.push("class " + actionName + "(argparse._AppendAction):");
                                    output.push("    def __call__(self, parser, namespace, values, option_string=None):");
                                    output.push("        action = self.get_action(values, option_string)");
                                    output.push("        super(" + "Add" + Capitalize(ToCamelCase(model.Option_Name)) + ", self).__call__(parser, namespace, action, option_string)");
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
                                    if (model.EnterSubOptions()) {
                                        if (model.SelectFirstOption())
                                        {
                                            let ifkv = "if";
                                            do
                                            {
                                                output.push("            " + ifkv + " kl == '" + model.Option_Name + "':");
                                                output.push("                d['" + model.Option_NamePython + "'] = v");
                                                ifkv = "elif";
                                            } while (model.SelectNextOption());
                                        }
                                    }

                                    model.ExitSubOptions();

                                    output.push("        return d");  
                                    allActions.set(actionName, true);                              
                                }

                            }

                        } while (model.SelectNextOption());
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    output.push("");

    return output;
}
