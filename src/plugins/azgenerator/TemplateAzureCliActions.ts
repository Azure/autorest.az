/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { ToCamelCase, Capitalize, ToPythonString } from "../../utils/helper";
import { SchemaType, Parameter } from "@azure-tools/codemodel";
import { stringify } from "querystring";
import { HeaderGenerator } from "./Header";
import { isNullOrUndefined } from "util";


let allActions: Map<string, boolean> = new Map<string, boolean>();
export function GenerateAzureCliActions(model: CodeModelAz): string[] {
    let header: HeaderGenerator = new HeaderGenerator();

    header.addImport("argparse");
    header.addFromImport("knack.util", ["CLIError"]);
    header.addFromImport("collections", ["defaultdict"]);
    header.disableProtectedAccess = true;

    let output: string[] = header.getLines();

    if (model.SelectFirstCommandGroup()) {
        do {
            if (model.SelectFirstCommand()) {
                do {
                    if (model.SelectFirstMethod()) {
                        do {
                            let baseParam = null;
                            if (model.SelectFirstMethodParameter()) {
                                do {
                                    if (baseParam && model.MethodParameter['polyBaseParam'] == baseParam) {
                                        let keyToMatch = baseParam.schema?.['discriminator']?.property?.language['python']?.name;
                                        let valueToMatch = model.MethodParameter.schema?.['discriminatorValue'];
                                        let subActionName = model.Schema_ActionName(model.MethodParameter.schema);
                                        if (isNullOrUndefined(subActionName) || allActions.has(subActionName)) {
                                            continue;
                                        }
                                        output = output.concat(GetAction(model, subActionName, model.MethodParameter, keyToMatch, valueToMatch))
                                    }
                                    let actionName = model.Schema_ActionName(model.MethodParameter.schema);
                                    if (isNullOrUndefined(actionName)) {
                                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                                            baseParam = model.MethodParameter;
                                        }       
                                    }
                                    else {
                                        if (allActions.has(actionName)) {
                                            continue;
                                        }
                                        output = output.concat(GetAction(model, actionName, model.MethodParameter))
                                    }
                                } while (model.SelectNextMethodParameter());
                            }
                        } while (model.SelectNextMethod());
                    }
                } while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    output.push("");

    return output;
}


function GetAction(model: CodeModelAz, actionName: string, param: Parameter, keyToMatch: string = null, valueToMatch: string = null) {
    let output: string[] = [];
    allActions.set(actionName, true);

    output.push("");
    output.push("");
    let baseAction = "Action";
    let paramType = param?.schema?.type;
    if (paramType == SchemaType.Array) baseAction = "_Append" + baseAction;
    output.push("class " + actionName + "(argparse." + baseAction + "):");
    output.push("    def __call__(self, parser, namespace, values, option_string=None):");
    output.push("        action = self.get_action(values, option_string)");
    if (paramType == SchemaType.Array) {
        output.push("        super(" + actionName + ", self).__call__(parser, namespace, action, option_string)");
    } else {
        output.push("        namespace." + model.Parameter_MapsTo(param) + " = action");
    }

    output.push("");
    output.push("");
    output.push("    def get_action(self, values, option_string):  # pylint: disable=no-self-use");
    output.push("        try:");
    output.push("            properties = defaultdict(list)");
    output.push("            for (k, v) in (x.split('=', 1) for x in values):");
    output.push("                properties[k].append(v)");
    output.push("            properties = dict(properties)");
    output.push("        except ValueError:");
    output.push("            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))");
    output.push("        d = {}");

    if (model.EnterSubMethodParameters()) {
        if (model.SelectFirstMethodParameter(true)) {
            do {
                if (model.Parameter_DefaultValue(model.SubMethodParameter) !== undefined)
                {
                    output.push("        d['" + model.Parameter_NamePython(model.SubMethodParameter) + "'] = " + ToPythonString(model.Parameter_DefaultValue(model.SubMethodParameter), model.Parameter_Type(model.SubMethodParameter)));
                }
            } while (model.SelectNextMethodParameter(true));
        }
    }

    output.push("        for k in properties:");
    output.push("            kl = k.lower()");
    output.push("            v = properties[k]");
    let foundProperties = false;
    let preParamType = paramType;
    if (model.EnterSubMethodParameters()) {
        if (model.SelectFirstMethodParameter()) {
            foundProperties = true;
            let ifkv = "if";
            do {
                if (model.SubMethodParameter['readOnly']) {
                    continue;
                }
                if (model.SubMethodParameter['schema']?.type == SchemaType.Constant) {
                    continue;
                }
                if (!isNullOrUndefined(keyToMatch) && !isNullOrUndefined(valueToMatch) && model.Parameter_NamePython(model.SubMethodParameter) == keyToMatch) {
                    continue;
                }
                output.push("            " + ifkv + " kl == '" + model.Parameter_NameAz(model.SubMethodParameter) + "':");
                if (model.MethodParameter_IsArray) {
                    output.push("                d['" + model.Parameter_NamePython(model.SubMethodParameter) + "'] = v");
                }
                else {
                    output.push("                d['" + model.Parameter_NamePython(model.SubMethodParameter) + "'] = v[0]");
                }
                ifkv = "elif";
            } while (model.SelectNextMethodParameter());
        }
    }
    model.ExitSubMethodParameters();
    if (!foundProperties && preParamType == SchemaType.Dictionary) {
        output.push("            d[k] = v");
    }
    if (!isNullOrUndefined(keyToMatch) && !isNullOrUndefined(valueToMatch)) {
        output.push("        d['" + keyToMatch + "'] = '" + valueToMatch + "'");
    }
    output.push("        return d");
    return output;
}