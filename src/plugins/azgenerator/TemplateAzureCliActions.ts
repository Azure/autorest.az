/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { ToCamelCase, Capitalize } from "../../utils/helper";

export function GenerateAzureCliActions(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("import argparse");
    output.push("from knack.util import CLIError");
    output.push("");
    output.push("");
    output.push("# pylint: disable=protected-access");

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
                            if (model.Option_IsList)
                            {
                                if (model.Option_Type == "dict")
                                {
                                    let actionName: string = "Add" + Capitalize(ToCamelCase(model.Option_Name));

                                    output.push("");
                                    output.push("");
                                    output.push("class Add" + actionName + "(argparse._AppendAction):");
                                    output.push("    def __call__(self, parser, namespace, values, option_string=None):");
                                    output.push("        action = self.get_action(values, option_string)");
                                    output.push("        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)");
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

                                    output.push("        return d");                                
                                }
                            }

                        } while (model.SelectNextOption());
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    return output;
}
