/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";
import { Parameter, SchemaType, Operation } from "@azure-tools/codemodel";
import { isNullOrUndefined } from "util";

class ParamBuilder {
    public constructor(
        public readonly model: CodeModelAz,
        public readonly allRequiredParam: Map<string, boolean> = new Map<string, boolean>(),
        public readonly allNonRequiredParam: Map<string, boolean> = new Map<string, boolean>(),
        public readonly requiredmo: Array<string> = new Array<string>(),
        public readonly nonrequiredmo: Array<string> = new Array<string>(),
        public param: Parameter = null,
        public needGeneric: boolean = false,
        public genericParam: Parameter = null,
        public originalOperation: Operation = null
    ) { }

    public getReadOnlyParamMap() {
        const {model, allRequiredParam, allNonRequiredParam, requiredmo, nonrequiredmo} = this;
        return {model, allRequiredParam, allNonRequiredParam, requiredmo, nonrequiredmo};
    }

    public getNonReadOnlyParamMap() {
        let {param, needGeneric, genericParam, originalOperation} = this;
        return {param, needGeneric, genericParam, originalOperation};
    }
}

export function GenerateAzureCliReport(model: CodeModelAz): string[] {
    var output: string[] = [];

    output.push("# Azure CLI Module Creation Report");
    output.push("");

    let cmds = {};

    if (model.SelectFirstCommandGroup()) {
        do {
            var mo: string[] = [];
            /*mo.push("## " + model.Command_Name);
                  mo.push("");*/

            if (model.SelectFirstCommand()) {
                do {
                    mo = getCommandBody(model);
                    cmds[model.Command_Name] = mo;
                    if (model.Command_CanSplit) {
                        mo = getCommandBody(model, true);
                        cmds[model.Command_Name.replace(/ create/g, " update")] = mo;
                    }
                } while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }
    // build sorted output
    var keys = Object.keys(cmds);
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
        output = output.concat(cmds[keys[i]]);
    }

    return output;
}

function getCommandBody(model: CodeModelAz, needUpdate: boolean = false) {
    let mo: string[] = [];
    if (needUpdate) {
        mo.push("### " + model.Command_Name.replace(/ create/g, " update"));
    } else {
        mo.push("### " + model.Command_Name);
    }
    mo.push("");
    if (needUpdate) {
        mo.push(model.Command_MethodName.replace(/_create/g, "_update") + " a " + model.CommandGroup_Name + ".");
    } else {
        mo.push(model.Command_MethodName + " a " + model.CommandGroup_Name + ".");
    }

    mo.push("");

    mo.push("|Option|Type|Description|Path (SDK)|Path (swagger)|");
    mo.push("|------|----|-----------|----------|--------------|");

    let context = new ParamBuilder(model);
    let { requiredmo, nonrequiredmo } = context.getReadOnlyParamMap();

    if (model.SelectFirstMethod()) {
        do {
            if (!model.SelectFirstMethodParameter()) {
                continue;
            }
            context.genericParam = model.Command_GenericSetterParameter(model.Command);
            context.originalOperation = model.Method_GetOriginalOperation;
            let { originalOperation } = context.getNonReadOnlyParamMap();
            if (!isNullOrUndefined(originalOperation)) {
                context.genericParam = model.Command_GenericSetterParameter(originalOperation);
            }
            context.needGeneric = false;
            if (needUpdate && !isNullOrUndefined(context.genericParam)) {
                context.needGeneric = true;
            }
            // first parameters that are required
            let { needGeneric, genericParam } = context.getNonReadOnlyParamMap();
            do {
                if (needGeneric && !isNullOrUndefined(genericParam) && model.MethodParameter_MapsTo == model.Parameter_MapsTo(genericParam)) {
                    if (model.EnterSubMethodParameters(genericParam, false)) {
                        if (model.SelectFirstMethodParameter()) {
                            do {
                                context.param = model.SubMethodParameter;
                                getSingleLineOfParameter(context);
                            } while (model.SelectNextMethodParameter());
                        }
                        model.ExitSubMethodParameters();
                    }
                    continue;
                }
                context.param = model.MethodParameter;
                getSingleLineOfParameter(context);
            } while (model.SelectNextMethodParameter());
        } while (model.SelectNextMethod());
    }

    if (requiredmo.length <= 0 && nonrequiredmo.length < 0) {
        return mo;
    }
    mo = mo.concat(requiredmo);
    mo = mo.concat(nonrequiredmo);

    if (model.SelectFirstMethod()) {
        do {
            if (model.SelectFirstExample()) {
                do {
                    mo.push("");
                    mo.push("**Example: " + model.Example_Title + "**");
                    mo.push("");
                    mo.push("```");

                    let next: string = model.Command_Name + " " + model.Command_MethodName + " ";
                    if (needUpdate) {
                        next = model.Command_Name.replace(/ create/g, " update") + " " + model.Command_MethodName.replace(/_create/g, "_update") + " ";
                    }
                    for (let k in model.Example_Params) {
                        let v: string = model.Example_Params[k];
                        if (/\s/.test(v)) {
                            v = '"' + v.replace('"', '\\"') + '"';
                        }

                        next += k + " " + v;
                        mo.push(next);
                        next = "        ";
                    }
                    mo.push("```");
                } while (model.SelectNextExample());
            }
        } while (model.SelectNextMethod());
    }

    return mo;
}

function getSingleLineOfParameter(context: ParamBuilder) {
    let {model, allRequiredParam, allNonRequiredParam, requiredmo, nonrequiredmo } = context.getReadOnlyParamMap();
    let {needGeneric, param, originalOperation} = context.getNonReadOnlyParamMap();
    if (model.Parameter_IsFlattened(param) || model.Parameter_Type(param) == SchemaType.Constant) {
        return;
    }
    if (model.Parameter_IsPolyOfSimple(param)) {
        return;
    }
    if (!isNullOrUndefined(originalOperation) && param["targetProperty"]?.["isDiscriminator"]) {
        return;
    }
    if (needGeneric && param['isDiscriminator']) {
        return;
    }
    let optionName = model.Parameter_MapsTo(param);
    if (optionName.endsWith("_")) {
        optionName = optionName.substr(0, optionName.length - 1);
    }
    optionName = optionName.replace(/_/g, "-");
    if (model.MethodParameter_IsRequired) {
        if (allRequiredParam.has(optionName)) {
            return;
        }
        allRequiredParam.set(optionName, true);
        requiredmo.push("|**--" + optionName + "**|" + model.MethodParameter_Type + "|" + model.MethodParameter_Description + "|" + model.MethodParameter_Name + "|");
    } else {
        if (allNonRequiredParam.has(optionName)) {
            return;
        }
        allNonRequiredParam.set(optionName, true);
        nonrequiredmo.push("|**--" + optionName + "**|" + model.MethodParameter_Type + "|" + model.MethodParameter_Description + "|" + model.MethodParameter_Name + "|");
    }
}
