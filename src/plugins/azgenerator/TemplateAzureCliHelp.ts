/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateAzureCliHelp(model: CodeModelAz): string[] {
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


    if (model.SelectFirstCommandGroup()) {
        do {

            // if there's no operation in this command group
            if (!model.SelectFirstCommand())
                continue;

            output.push("");
            output.push("helps['" + model.CommandGroup_Name + "'] = \"\"\"");
            output.push("    type: group");
            output.push("    short-summary: " + model.CommandGroup_Help);
            output.push("\"\"\"");

            //let methods: string[] = model.CommandGroup_Commands;

            if (model.SelectFirstCommand()) {
                do {

                    
                    let commandOutput: string [] = generateCommandHelp(model);
                    //output.push("before output.length: " + output.length);
                    output = output.concat(commandOutput);
                    //output.push("after output.length: " + output.length);
                    if (model.Command_CanSplit) {
                        let tmpoutput: string[] = generateCommandHelp(model, true);
                        output = output.concat(tmpoutput);
                    }
                }
                while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());;

        output.push("");
    }

    return output;
}

function generateCommandHelp(model: CodeModelAz, needUpdate: boolean = false) {
    // create, delete, list, show, update
    //let method: string = methods[mi];
    //let ctx = model.SelectCommand(method);

    //if (ctx == null)
    //    continue;
    let output: string[] = [];
    output.push("");
    if(needUpdate) {
        output.push("helps['" + model.Command_Name.replace(/ create/gi, " update") + "'] = \"\"\"");
    } else {
        output.push("helps['" + model.Command_Name + "'] = \"\"\"");
    }
    output.push("    type: command");

    // there will be just one method for create, update, delete, show, etc.
    // there may be a few list methods, so let's just take description from the first one.
    // as we can't use all of them
    output.push("    short-summary: " + model.Command_Help);

    let examplesStarted: boolean = false;

    for( let example of model.GetExamples() ) {
            if (!examplesStarted) {
                output.push("    examples:");
                examplesStarted = true;
            }

            //output.push ("# " + example_id);
            let parameters: string[] = [];

            parameters.push("az");
            parameters = parameters.concat(model.Command_Name.split(" "));
            //parameters.push(method);

            for (let param of example.Parameters) {
                let slp = JSON.stringify(param.value).split(/[\r\n]+/).join("");
                //parameters += " " + k + " " + slp;
                parameters.push(param.name);
                parameters.push(slp);
            }
            output.push("      - name: " + example.Title);
            output.push("        text: |-");
            let line = "";
            parameters.forEach(element => {
                if (line.length + element.length + 1 < 90) {
                    line += ((line != "") ? " " : "") + element;
                }
                else if (element.length < 90) {
                    line += " \\";
                    line = line.split("\\").join("\\\\");
                    output.push("               " + line);
                    line = element;
                }
                else {
                    // longer than 90
                    let quoted: boolean = (element.startsWith('\"') || element.startsWith("'"));
                    line += ((line != "") ? " " : "");

                    while (element.length > 0) {
                        let amount = (90 - line.length);
                        amount = (amount > element.length) ? element.length : amount;
                        line += element.substr(0, amount);
                        element = (amount < element.length) ? element.substr(amount) : "";

                        if (element != "") {
                            line += (quoted ? "" : "\\");
                            line = line.split("\\").join("\\\\");

                            output.push("               " + line);
                            line = "";
                        }
                    }
                }
            });

            if (line != "") {
                line = line.split("\\").join("\\\\");
                output.push("               " + line);
            }
    }

    output.push("\"\"\"");
    return output;
}