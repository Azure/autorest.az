/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { CommandExample } from "./CodeModelAzImpl"
import { ToSnakeCase } from "../Common/Helpers"

export function GenerateAzureCliHelp(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("# coding=utf-8");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("");
    output.push("# pylint: disable=too-many-lines");
    output.push("# pylint: disable=line-too-long");
    output.push("from knack.help_files import helps  # pylint: disable=unused-import");
    output.push("");
    
    do
    {
        // if disabled
        if (model.Command_Name == "-")
            continue;

        output.push("");
        output.push("helps['" + model.CommandGroup_Name + "'] = \"\"\"");
        output.push("    type: group");
        output.push("    short-summary: " +  model.CommandGroup_Help);
        output.push("\"\"\"");

        //let methods: string[] = model.CommandGroup_Commands;

        if (model.SelectFirstCommand())
        {
            do
            {
                // create, delete, list, show, update
                //let method: string = methods[mi];
                //let ctx = model.SelectCommand(method);

                //if (ctx == null)
                //    continue;

                output.push("");
                output.push("helps['" + model.Command_Name + "'] = \"\"\"");
                output.push("    type: command");

                // there will be just one method for create, update, delete, show, etc.
                // there may be a few list methods, so let's just take description from the first one.
                // as we can't use all of them
                output.push("    short-summary: " + model.Command_Help);

                let examplesStarted: boolean = false;

                if (model.SelectFirstExample())
                {

                    do
                    {
                        if (!examplesStarted)
                        {
                            output.push("    examples:");
                            examplesStarted = true;
                        }

                        //output.push ("# " + example.Method);
                        let parameters: string[] = [];

                        parameters.push("az");
                        parameters = parameters.concat(model.Command_Name.split(" "));
                        //parameters.push(method);

                        for (let k in model.Example_Params)
                        {
                            let slp = JSON.stringify(model.Example_Params[k]).split(/[\r\n]+/).join("");
                            //parameters += " " + k + " " + slp;
                            parameters.push(k);
                            parameters.push(slp);
                        }
                        output.push("      - name: " + model.Example_Title);
                        output.push("        text: |-");
                        let line = "";
                        parameters.forEach(element => {
                            if (line.length + element.length + 1 < 90)
                            {
                                line += ((line != "") ? " " : "") + element;
                            }
                            else if (element.length < 90)
                            {
                                line += " \\";
                                line = line.split("\\").join("\\\\");
                                output.push("               " + line);
                                line = element;
                            }
                            else
                            {
                                // longer than 90
                                let quoted: boolean = (element.startsWith('\"') || element.startsWith("'"));
                                line += ((line != "") ? " " : "");
                                
                                while (element.length > 0)
                                {
                                    let amount = (90 - line.length);
                                    amount = (amount > element.length) ? element.length : amount;
                                    line += element.substr(0, amount);
                                    element = (amount < element.length) ? element.substr(amount) : "";

                                    if (element != "")
                                    {
                                        line += (quoted ? "" : "\\");
                                        line = line.split("\\").join("\\\\");

                                        output.push("               " + line);
                                        line = "";
                                    }
                                }
                            }
                        });

                        if (line != "")
                        {
                            line = line.split("\\").join("\\\\");
                            output.push("               " + line);
                        }
                    }
                    while (model.SelectNextExample()); 
                }      

                output.push("\"\"\"");
            }
            while (model.SelectNextCommand());
        }
    } while (model.SelectNextCommandGroup());;

    output.push("");

    return output;
}
