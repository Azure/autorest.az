/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../../CodeModelAz"
import { ParameterLocation, SchemaType } from "@azure-tools/codemodel";
import { isNullOrUndefined } from "util";

export function GenerateAzureCliReport(model: CodeModelAz): string[] {
    var output: string[] = [];

    output.push("# Azure CLI Module Creation Report");
    output.push("");
    output.push("## EXTENSION");
    output.push("|CLI Extension|Command Groups|");
    output.push("|---------|------------|");
    output.push("|az" + model.Extension_Name + "|[groups](#CommandGroups)");
    output.push("");
    output.push("## GROUPS");
    output.push("### <a name=\"CommandGroups\">Command groups in \'az " + model.Extension_Name + "\' extension </a>");
    output.push("|CLI Command Group|Group Swagger name|Commands|");
    output.push("|---------|------------|--------|");

    let cmds = {};
    if (model.SelectFirstCommandGroup()) {
        do {
            output.push("|az " + model.CommandGroup_Name + "|" + model.CommandGroup_CliKey + "|" + "[command](#CommandIn" + model.CommandGroup_CliKey + ")|");
        } while (model.SelectNextCommandGroup());
    }

    output.push("");
    output.push("## COMMANDS")


    if (model.SelectFirstCommandGroup()) {
        var mo: string[] = [];
        do {

            /*mo.push("## " + model.Command_Name);
            mo.push("");*/
            if (model.SelectFirstCommand()) {

                mo = getCommandBody(model);
                cmds[model.CommandGroup_Name] = mo;
            }

        } while (model.SelectNextCommandGroup());;
    }

    // build sorted output
    var keys = Object.keys(cmds);
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
        output = output.concat(cmds[keys[i]]);
    }

    output.push("");
    cmds = {};
    output.push("## COMMAND DETAILS");
    output.push("");

    if (model.SelectFirstCommandGroup()) {
        var mo: string[] = [];
        do {
            if (model.SelectFirstCommand()) {
                mo = getCommandDetails(model);
                cmds[model.CommandGroup_Name] = mo;
            }
        } while (model.SelectNextCommandGroup());
    }
    var keys = Object.keys(cmds);
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
        output = output.concat(cmds[keys[i]]);
    }
    return output;
}

function getCommandBody(model: CodeModelAz) {
    let mo: string[] = [];
    mo.push("### <a name=\"CommandsIn" + model.CommandGroup_CliKey + "\">Commands in \'az " + model.CommandGroup_Name + "\' group</a>");
    mo.push("|CLI Command|Operation Swagger name|Parameters|Examples|");
    mo.push("|---------|------------|--------|-----------|");
    if (model.SelectFirstCommand()) {
        do {
            if (model.SelectFirstMethod()) {
                do {
                    if (model.SelectFirstExample())
                        mo.push("|[az " + model.CommandGroup_Name + " " + model.Method_NameAz + "]|(#" + model.CommandGroup_CliKey + model.Method_CliKey + ")|" + model.Method_CliKey + "|" + "[Parameters](#Parameters" + model.CommandGroup_CliKey + model.Method_CliKey + ")" + "|" + "[Example](#Examples" + model.CommandGroup_CliKey + model.Method_CliKey + ")|");
                    else
                        mo.push("|[az " + model.CommandGroup_Name + " " + model.Method_NameAz + "]|(#" + model.CommandGroup_CliKey + model.Method_CliKey + ")|" + model.Method_CliKey + "|" + "[Parameters](#Parameters" + model.CommandGroup_CliKey + model.Method_CliKey + ")" + "|Not Found|");
                } while (model.SelectNextMethod());
            }
        } while (model.SelectNextCommand());
    }
    mo.push("");
    return mo;
}

function getCommandDetails(model: CodeModelAz) {
    let mo: string[] = [];
    mo.push("### group \'az " + model.CommandGroup_Name + "\'");
    if (model.SelectFirstCommand()) {
        do {
            let allRequiredParam: Map<string, boolean> = new Map<string, boolean>();
            let allNonRequiredParam: Map<string, boolean> = new Map<string, boolean>();
            let requiredmo: Array<string> = [];
            let nonrequiredmo: Array<string> = [];
            if (model.SelectFirstMethod()) {
                do {
                    mo.push("#### <a name=\"" + model.CommandGroup_CliKey + model.Method_CliKey + "\">Command \'az " + model.CommandGroup_Name + " " + model.Method_NameAz + "\'</a>");
                    mo.push("");
                    if (model.SelectFirstExample()) {
                        mo.push("##### <a name=\"" + "Examples" + model.CommandGroup_CliKey + model.Method_CliKey + "\">Example</a>");
                        do {
                            mo.push("");
                            mo.push("**Example: " + model.Example_Title + "**");
                            mo.push("");
                            mo.push("```");

                            let next: string = model.Command_Name + " " + model.Command_MethodName + " ";
                            for (let k in model.Example_Params) {
                                let v: string = model.Example_Params[k];
                                if (/\s/.test(v)) {
                                    v = "\"" + v.replace("\"", "\\\"") + "\"";
                                }

                                next += k + " " + v;
                                mo.push(next);
                                next = "        ";
                            }
                            mo.push("```");
                        } while (model.SelectNextExample());
                        mo.push("");
                    }
                    if (!model.SelectFirstMethodParameter()) {
                        continue;
                    }
                    mo.push("##### <a name=\"" + "Parameters" + model.CommandGroup_CliKey + model.Method_CliKey + "\">Parameters</a> ");
                    mo.push("|Option|Type|Description|Path (SDK)|Swagger name|");
                    mo.push("|------|----|-----------|----------|------------|");
                    let originalOperation = model.Method_GetOriginalOperation;
                    do {
                        if (model.MethodParameter_IsFlattened || model.MethodParameter_Type == SchemaType.Constant) {
                            continue;
                        }
                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            continue;
                        }
                        if (!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
                            continue;
                        }
                        let optionName = model.MethodParameter_MapsTo;
                        if (optionName.endsWith("_")) {
                            optionName = optionName.substr(0, optionName.length - 1);
                        }
                        optionName = optionName.replace(/_/g, '-');
                        if (model.MethodParameter_IsRequired) {
                            if (allRequiredParam.has(optionName)) {
                                continue;
                            }
                            allRequiredParam.set(optionName, true);
                            requiredmo.push("|**--" + optionName + "**|" + model.MethodParameter_Type + "|" + model.MethodParameter_Description + "|"
                                + model.MethodParameter_Name + "|" + model.MethodParameter_CliKey + "|");
                        } else {
                            if (allNonRequiredParam.has(optionName)) {
                                continue;
                            }
                            allNonRequiredParam.set(optionName, true);
                            nonrequiredmo.push("|**--" + optionName + "**|" + model.MethodParameter_Type + "|" + model.MethodParameter_Description + "|"
                                + model.MethodParameter_Name + "|" + model.MethodParameter_CliKey + "|");
                        }
                    } while (model.SelectNextMethodParameter());
                } while (model.SelectNextMethod());
            }
            if (requiredmo.length <= 0 && nonrequiredmo.length < 0) {
                return mo;
            }
            mo = mo.concat(requiredmo);
            mo = mo.concat(nonrequiredmo);
            mo.push("");
        } while (model.SelectNextCommand());
    }
    return mo;
}

// function getCommandBody1(model: CodeModelAz) {
    //     let mo: string[] = [];
    //     mo.push("### " + model.Command_Name);
    //     mo.push("");
    //     mo.push(model.Command_MethodName + " a " + model.CommandGroup_Name + ".");

    //     mo.push("");

    //     // Command group
    //     mo.push("## Groups");
    //     mo.push("|Name (az)|Swagger name|");
    //     mo.push("|---------|------------|");
    //     mo.push("|" + model.CommandGroup_Name + "|" + model.CommandGroup_CliKey + "|");
    //     mo.push("");

    //     // Methods
    //     mo.push("#### Methods");
    //     mo.push("|Name (az)|Swagger name|");
    //     mo.push("|---------|------------|");
    //     if (model.SelectFirstMethod()) {
    //         do {
    //             mo.push("|" + model.Method_NameAz + "|" + model.Method_CliKey + "|");
    //         } while (model.SelectNextMethod())
    //     }
    //     mo.push("");

    //     // Parameters
    //     mo.push("#### Parameters");
    //     mo.push("|Option|Type|Description|Path (SDK)|Swagger name|");
    //     mo.push("|------|----|-----------|----------|------------|");

    // let allRequiredParam: Map<string, boolean> = new Map<string, boolean>();
    // let allNonRequiredParam: Map<string, boolean> = new Map<string, boolean>();
    // let requiredmo: Array<string> = [];
    // let nonrequiredmo: Array<string> = [];
    // if (model.SelectFirstMethod()) {
    //     do {
    //         if (!model.SelectFirstMethodParameter()) {
    //             continue;;
    //         }

    //         // first parameters that are required
    //         let originalOperation = model.Method_GetOriginalOperation;
    //         do {
    //             if (model.MethodParameter_IsFlattened || model.MethodParameter_Type == SchemaType.Constant) {
    //                 continue;
    //             }
    //             if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
    //                 continue;
    //             }
    //             if (!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.['isDiscriminator']) {
    //                 continue;
    //             }
    //             let optionName = model.MethodParameter_MapsTo;
    //             if (optionName.endsWith("_")) {
    //                 optionName = optionName.substr(0, optionName.length - 1);
    //             }
    //             optionName = optionName.replace(/_/g, '-');
    //             if (model.MethodParameter_IsRequired) {
    //                 if (allRequiredParam.has(optionName)) {
    //                     continue;
    //                 }
    //                 allRequiredParam.set(optionName, true);
    //                 requiredmo.push("|**--" + optionName + "**|" + model.MethodParameter_Type + "|" + model.MethodParameter_Description + "|"
    //                     + model.MethodParameter_Name + "|" + model.MethodParameter_CliKey + "|");
    //             } else {
    //                 if (allNonRequiredParam.has(optionName)) {
    //                     continue;
    //                 }
    //                 allNonRequiredParam.set(optionName, true);
    //                 nonrequiredmo.push("|**--" + optionName + "**|" + model.MethodParameter_Type + "|" + model.MethodParameter_Description + "|"
    //                     + model.MethodParameter_Name + "|" + model.MethodParameter_CliKey + "|");
    //             }
    //         }
    //         while (model.SelectNextMethodParameter());
    //     } while (model.SelectNextMethod())
    // }

//     if (requiredmo.length <= 0 && nonrequiredmo.length < 0) {
//         return mo;
//     }
//     mo = mo.concat(requiredmo);
//     mo = mo.concat(nonrequiredmo);

//     if (model.SelectFirstMethod()) {
//         do {
//             if (model.SelectFirstExample()) {
//                 do {
//                     mo.push("");
//                     mo.push("**Example: " + model.Example_Title + "**");
//                     mo.push("");
//                     mo.push("```");

//                     let next: string = model.Command_Name + " " + model.Command_MethodName + " ";
//                     for (let k in model.Example_Params) {
//                         let v: string = model.Example_Params[k];
//                         if (/\s/.test(v)) {
//                             v = "\"" + v.replace("\"", "\\\"") + "\"";
//                         }

//                         next += k + " " + v;
//                         mo.push(next);
//                         next = "        ";
//                     }
//                     mo.push("```");
//                 } while (model.SelectNextExample());
//             }
//         } while (model.SelectNextMethod());
//     }
//     mo.push("");

//     return mo;
// }
