/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";
import { ToMultiLine, ToJsonString } from "../../utils/helper"

const maxShortSummary = 119
let showExampleStr = "";
let allSupportWaited = ['create', 'update', 'delete'];
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
                
            output = output.concat(generateCommandGroupHelp(model));    
            //let methods: string[] = model.CommandGroup_Commands;

            let allSubGroup: Map<string, boolean> = new Map<string, boolean>();
            let hasWait = false;
            let allLongRunCommand = [];
            if (model.SelectFirstCommand()) {
                do {

                    let subCommandGroupName = model.Command_SubGroupName;
                    if(subCommandGroupName != "" && !allSubGroup.has(subCommandGroupName)) {
                        allSubGroup.set(subCommandGroupName, true);
                        output = output.concat(generateCommandGroupHelp(model, subCommandGroupName));
                    }
                    if(model.Command_IsLongRun) {
                        hasWait = true;
                        let waitParam = "";
                        if (allSupportWaited.indexOf(model.Command_MethodName) < 0) {
                            waitParam = "create";
                        } else {
                            waitParam = model.Command_MethodName;
                        }
                        if(allLongRunCommand.indexOf(waitParam + "d") < 0) {
                            allLongRunCommand.push(waitParam + "d");
                        }
                    }
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
                if (hasWait) {
                    output = output.concat(generateWaitCommandHelp(model.CommandGroup_Name, allLongRunCommand));
                }
            }
        } while (model.SelectNextCommandGroup());;

        output.push("");
    }

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

function generateWaitCommandHelp(commandGroup, allLongRunCommand) {
    let output = [];
    output.push("");
    output.push("helps['" + commandGroup + " wait'] = \"\"\"");
    output.push("    type: command");
    output.push("    short-summary: Place the CLI in a waiting state until a condition of the " + commandGroup + " is met.");
    output.push("    examples:");
    for(let waitParam of allLongRunCommand) {
        output.push("      - name: Pause executing next line of CLI script until the " + commandGroup + " is successfully provisioned.");
        output.push("        text: |-");
        let line = showExampleStr.replace(/ show /g, ' wait ') + " " + waitParam;
        ToMultiLine(line, output, 119, true);
    }
    output.push("\"\"\"");
    return output;
}

function generateCommandGroupHelp(model: CodeModelAz, subCommandGroupName = "") {
    let output = [];
    output.push("");
    if(subCommandGroupName != "") {
        output.push("helps['" + subCommandGroupName + "'] = \"\"\"")
    } else {
        output.push("helps['" + model.CommandGroup_Name + "'] = \"\"\"");
    }
    output.push("    type: group");
    //output.push("    short-summary: " + model.CommandGroup_Help);
    let shortSummary = "    short-summary: " + model.CommandGroup_Help;
    if(subCommandGroupName != "") {
        shortSummary = shortSummary + " sub group " + subCommandGroupName.split(" ").pop();
    }
    ToMultiLine(shortSummary, output, 119, true);
    output.push("\"\"\"");
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
    let commandHead = needUpdate? model.Command_Name.replace(/ create/gi, " update"): model.Command_Name;
    output.push("helps['" + commandHead + "'] = \"\"\"");
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
        parameters = parameters.concat(commandHead.split(" "));
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
        if (model.Command_MethodName == 'show') {
            showExampleStr = line;
        }
        ToMultiLine(line, output, 119, true);
    }

    output.push("\"\"\"");
    return output;
}