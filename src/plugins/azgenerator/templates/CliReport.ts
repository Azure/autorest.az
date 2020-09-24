/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../CodeModelAz";
import * as path from 'path';
import { ParameterLocation, SchemaType } from "@azure-tools/codemodel";
import { EscapeString,  ToCamelCase, Capitalize,  ToMultiLine, ToJsonString } from "../../../utils/helper"
import { GenerationMode, PathConstants } from "../../models";
import { isNullOrUndefined } from "util";
import { TemplateBase } from "./TemplateBase";

export class CliReport extends TemplateBase{
    constructor(model: CodeModelAz, isDebugMode: boolean){
        super(model, isDebugMode);
        if (this.model.IsCliCore) {
            this.relativePath = path.join(PathConstants.reportFile);
        }
        else {
            this.relativePath = path.join("azext_" + this.model.Extension_NameUnderscored, PathConstants.reportFile);
        }
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliReport(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    GenerateAzureCliReport(model: CodeModelAz): string[] {
        var output: string[] = [];
    
        output.push("# Azure CLI Module Creation Report");
        output.push("");
        output.push("## EXTENSION");
        output.push("|CLI Extension|Command Groups|");
        output.push("|---------|------------|");
        output.push("|az " + model.Extension_Name + "|[groups](#CommandGroups)");
        output.push("");
        output.push("## GROUPS");
        output.push("### <a name=\"CommandGroups\">Command groups in `az " + model.Extension_Name + "` extension </a>");
        output.push("|CLI Command Group|Group Swagger name|Commands|");
        output.push("|---------|------------|--------|");
    
        let cmds = {};
        if (model.SelectFirstCommandGroup()) {
            do {
                output.push("|az " + model.CommandGroup_Name + "|" + model.CommandGroup_CliKey + "|" + "[commands](#CommandsIn" + model.CommandGroup_CliKey + ")|");
            } while (model.SelectNextCommandGroup());
        }
    
        output.push("");
        output.push("## COMMANDS")
    
    
        if (model.SelectFirstCommandGroup()) {
            var mo: string[] = [];
            do {
                if (model.SelectFirstCommand()) {
    
                    mo = this.getCommandBody(model);
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
                    mo = this.getCommandDetails(model);
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

    getCommandBody(model: CodeModelAz) {
        let mo: string[] = [];
        mo.push("### <a name=\"CommandsIn" + model.CommandGroup_CliKey + "\">Commands in `az " + model.CommandGroup_Name + "` group</a>");
        mo.push("|CLI Command|Operation Swagger name|Parameters|Examples|");
        mo.push("|---------|------------|--------|-----------|");
        if (model.SelectFirstCommand()) {
            do {
                if (model.SelectFirstMethod()) {
                    do {
                        if (model.GetExamples().length > 0)
                            mo.push("|[az " + model.CommandGroup_Name + " " + model.Method_NameAz + "](#" + model.CommandGroup_CliKey + model.Method_CliKey + ")|" + model.Method_CliKey + "|" + "[Parameters](#Parameters" + model.CommandGroup_CliKey + model.Method_CliKey + ")" + "|" + "[Example](#Examples" + model.CommandGroup_CliKey + model.Method_CliKey + ")|");
                        else
                            mo.push("|[az " + model.CommandGroup_Name + " " + model.Method_NameAz + "](#" + model.CommandGroup_CliKey + model.Method_CliKey + ")|" + model.Method_CliKey + "|" + "[Parameters](#Parameters" + model.CommandGroup_CliKey + model.Method_CliKey + ")" + "|Not Found|");
                    } while (model.SelectNextMethod());
                }
            } while (model.SelectNextCommand());
        }
        mo.push("");
        return mo;
    }

    getCommandDetails(model: CodeModelAz) {
        let mo: string[] = [];
        mo.push("### group `az " + model.CommandGroup_Name + "`");
        if (model.SelectFirstCommand()) {
            do {
                let allRequiredParam: Map<string, boolean> = new Map<string, boolean>();
                let allNonRequiredParam: Map<string, boolean> = new Map<string, boolean>();
                let requiredmo: Array<string> = [];
                let nonrequiredmo: Array<string> = [];
                if (model.SelectFirstMethod()) {
                    do {
                        let examplesStarted: boolean = false;
                        mo.push("#### <a name=\"" + model.CommandGroup_CliKey + model.Method_CliKey + "\">Command `az " + model.CommandGroup_Name + " " + model.Method_NameAz + "`</a>");
                        mo.push("");
                        for(let example of model.GetExamples()){
                            mo.push("##### <a name=\"" + "Examples" + model.CommandGroup_CliKey + model.Method_CliKey + "\">Example</a>");
                            mo.push("```");
                            let parameters: string[] = [];
                            parameters = model.GetExampleItems(example, false, undefined);
                            let line = parameters.join(' ');
                            ToMultiLine(line, mo, 119, true);
                            mo.push("```");
                        }
                        mo.push("##### <a name=\"" + "Parameters" + model.CommandGroup_CliKey + model.Method_CliKey + "\">Parameters</a> ");
                        mo.push("|Option|Type|Description|Path (SDK)|Swagger name|");
                        mo.push("|------|----|-----------|----------|------------|");
                        if (!model.SelectFirstMethodParameter()) {
                            continue;
                        }
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
                        let flag : boolean = false;
                        if(requiredmo.length > 0 || nonrequiredmo.length > 0){
                            flag = true;
                        }
                        if(requiredmo.length > 0){
                            mo = mo.concat(requiredmo);
                            requiredmo = [];
                        }
                        if(nonrequiredmo.length > 0){
                            mo = mo.concat(nonrequiredmo);
                            nonrequiredmo = []
                        }
                        if(flag) mo.push("");
                    } while (model.SelectNextMethod());
                }
                if (requiredmo.length <= 0 && nonrequiredmo.length < 0) {
                    return mo;
                }
            } while (model.SelectNextCommand());
        }
        return mo;
    }
}