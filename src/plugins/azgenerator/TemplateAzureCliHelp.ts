/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";
import { ToMultiLine, ToJsonString } from "../../utils/helper"

const maxShortSummary = 119

export function GenerateAzureCliHelp(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;
    header.addFromImport("knack.help_files", ["helps"])
    var output: string[] = [];
    output.push("");

    if (model.SelectFirstCommandGroup()) {
        do {

            // if there's no operation in this command group
            if (!model.SelectFirstCommand())
                continue;

            output.push("");
            output.push("helps['" + model.CommandGroup_Name + "'] = \"\"\"");
            output.push("    type: group");
            //output.push("    short-summary: " + model.CommandGroup_Help);
            let shortSummary = "    short-summary: " + model.CommandGroup_Help;
            ToMultiLine(shortSummary, output, 119, true);
            output.push("\"\"\"");


            //let methods: string[] = model.CommandGroup_Commands;

            if (model.SelectFirstCommand()) {
                do {


                    let commandOutput: string[] = generateCommandHelp(model);
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

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

function generateCommandHelp(model: CodeModelAz, needUpdate: boolean = false) {
    // create, delete, list, show, update
    //let method: string = methods[mi];
    //let ctx = model.SelectCommand(method);

    //if (ctx == null)
    //    continue;
    let output: string[] = [];
    output.push("");
    if (needUpdate) {
        output.push("helps['" + model.Command_Name.replace(/ create/gi, " update") + "'] = \"\"\"");
    } else {
        output.push("helps['" + model.Command_Name + "'] = \"\"\"");
    }
    output.push("    type: command");

    // there will be just one method for create, update, delete, show, etc.
    // there may be a few list methods, so let's just take description from the first one.
    // as we can't use all of them
    // output.push("    short-summary: " + model.Command_Help);
    let shortSummary = "    short-summary: " + model.Command_Help;
    ToMultiLine(shortSummary, output, 119, true);

    let examplesStarted: boolean = false;

    for (let example of model.GetExamples()) {
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
            let slp = param.value; 
            if (!param.isKeyValues) {
                slp = ToJsonString(slp); 
            }
            //parameters += " " + k + " " + slp;
            parameters.push(param.name);
            parameters.push(slp);
        }
        output.push("      - name: " + example.Title);
        output.push("        text: |-");
        let line = "               " + parameters.join(' ');
        ToMultiLine(line, output, 119, true);
    }

    output.push("\"\"\"");
    return output;
}