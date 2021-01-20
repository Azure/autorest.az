/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import {
    EscapeString,
    ToCamelCase,
    Capitalize,
    ToMultiLine,
    getExtraModeInfo,
    composeParamString,
    isNullOrUndefined,
} from '../../../utils/helper';
import { SchemaType } from '@azure-tools/codemodel';
import { HeaderGenerator } from '../Header';

let hasActions: boolean,
    hasBoolean: boolean,
    hasEnum: boolean,
    hasJson: boolean,
    hasResourceGroup: boolean,
    hasLocation: boolean,
    hasLocationValidator: boolean,
    hasTags: boolean,
    actions: string[],
    useResourceType: boolean;

function initVars() {
    hasActions = false;
    hasBoolean = false;
    hasEnum = false;
    hasJson = false;
    hasResourceGroup = false;
    hasLocation = false;
    hasLocationValidator = false;
    hasTags = false;
    actions = [];
    useResourceType = false;
}

export function GenerateAzureCliParams(model: CodeModelAz, debug: boolean): string[] {
    initVars();
    let outputArgs: string[] = [];

    outputArgs.push('');
    outputArgs.push('');
    outputArgs.push('def load_arguments(self, _):');
    let hasCommandParamContent = false;
    const header: HeaderGenerator = new HeaderGenerator();
    if (model.SelectFirstCommandGroup()) {
        do {
            // let methods: string[] = model.CommandGroup_Commands;
            let needWait = false;
            let showOutput = [];
            if (model.SelectFirstCommand()) {
                do {
                    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        needWait = true;
                    }
                    const needGeneric = model.Command_NeedGeneric;
                    const commandOutput = getCommandBody(model, needGeneric, debug);
                    if (model.Command_MethodName === 'show') {
                        showOutput = commandOutput;
                    }
                    if (commandOutput.length > 0) {
                        hasCommandParamContent = true;
                    }
                    outputArgs = outputArgs.concat(commandOutput);
                } while (model.SelectNextCommand());
                if (needWait && showOutput.length > 1) {
                    showOutput[1] = showOutput[1].replace(/ show'/g, " wait'");
                    outputArgs = outputArgs.concat(showOutput);
                }
            }
        } while (model.SelectNextCommandGroup());
    }
    if (!hasCommandParamContent) {
        outputArgs.push('    pass');
        header.disableUnusedArgument = true;
    } else {
        header.disableTooManyLines = true;
        header.disableTooManyStatements = true;
    }

    const parameterImports: string[] = [];
    if (hasTags) parameterImports.push('tags_type');
    if (hasBoolean) parameterImports.push('get_three_state_flag');
    if (hasEnum) parameterImports.push('get_enum_type');
    if (hasResourceGroup) parameterImports.push('resource_group_name_type');
    if (hasLocation) parameterImports.push('get_location_type');
    if (parameterImports.length > 0) {
        header.addFromImport(model.CliCoreLib + '.commands.parameters', parameterImports);
    }

    const validatorImports: string[] = [];
    if (hasLocationValidator) {
        validatorImports.push('get_default_location_from_resource_group');
    }
    if (hasJson) {
        validatorImports.push('validate_file_or_dict');
    }
    if (validatorImports.length > 0) {
        header.addFromImport(model.CliCoreLib + '.commands.validators', validatorImports);
    }

    if (hasActions) {
        if (model.IsCliCore) {
            header.addFromImport('..action', actions);
        } else {
            header.addFromImport(model.AzextFolder + '.action', actions);
        }
    }

    let output: string[] = [];

    output = output.concat(outputArgs);

    output.push('');

    output.forEach((element) => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    if (useResourceType) {
        header.addFromImport('azure.cli.core.profiles', ['ResourceType']);
    }

    return header.getLines().concat(output);
}

function getCommandBody(model: CodeModelAz, needGeneric = false, debug = false) {
    // let method: string = methods[mi];

    // let ctx = model.SelectCommand(method);
    // if (ctx === null)
    //    continue;
    const outputArgs: string[] = [];
    outputArgs.push('');
    outputArgs.push("    with self.argument_context('" + model.Command_Name + "') as c:");

    let hasParam = false;
    const allParam: Map<string, boolean> = new Map<string, boolean>();
    const allPythonParam: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstMethod()) {
        do {
            const originalOperation = model.Method_GetOriginalOperation;
            if (!isNullOrUndefined(originalOperation)) {
                for (const param of originalOperation.parameters) {
                    if (model.Parameter_InGlobal(param)) {
                        continue;
                    }
                    if (model.Parameter_IsFlattened(param) === true) {
                        continue;
                    }
                    if (param?.schema?.type === SchemaType.Constant || param.readOnly) {
                        continue;
                    }
                    if (!isNullOrUndefined(param?.language?.python?.name)) {
                        allPythonParam.set(param.language.python.name, true);
                    }
                }
                if (!isNullOrUndefined(originalOperation.requests[0].parameters)) {
                    for (const param of originalOperation.requests[0].parameters) {
                        if (model.Parameter_InGlobal(param)) {
                            continue;
                        }
                        if (
                            model.Parameter_IsFlattened(param) === true &&
                            !model.Parameter_IsCliFlattened(param)
                        ) {
                            continue;
                        }
                        if (param?.schema?.type === SchemaType.Constant || param.readOnly) {
                            continue;
                        }
                        if (!isNullOrUndefined(param?.language?.python?.name)) {
                            allPythonParam.set(param.language.python.name, true);
                        }
                    }
                }
            }
            let baseParam = null;
            let hasResourceGroupInOperation = false;
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (
                        model.MethodParameter_Type === SchemaType.Constant ||
                        model.MethodParameter['readOnly']
                    ) {
                        continue;
                    }
                    hasParam = true;
                    if (
                        isNullOrUndefined(originalOperation) &&
                        !isNullOrUndefined(model.MethodParameter_NamePython)
                    ) {
                        allPythonParam.set(model.MethodParameter_NamePython, true);
                    }
                    const parameterName = model.MethodParameter_MapsTo;
                    if (
                        !isNullOrUndefined(originalOperation) &&
                        model.MethodParameter['targetProperty']?.isDiscriminator
                    ) {
                        continue;
                    }
                    if (allPythonParam.has(parameterName)) {
                        allPythonParam.delete(parameterName);
                    }
                    let argument = "        c.argument('" + parameterName + "'";

                    // this is to handle names like "format", "type", etc
                    if (parameterName.endsWith('_')) {
                        if (isNullOrUndefined(model.MethodParameter.language['az'].alias)) {
                            model.MethodParameter.language['az'].alias = [];
                        }
                        model.MethodParameter.language['az'].alias.push(
                            parameterName.substr(0, parameterName.length - 1),
                        );
                    } else if (
                        parameterName.endsWith('name') &&
                        !model.Method['hasName'] &&
                        parameterName.replace(/_name$|_/g, '') ===
                            model.CommandGroup_DefaultName.toLowerCase()
                    ) {
                        if (isNullOrUndefined(model.MethodParameter.language['az'].alias)) {
                            model.MethodParameter.language['az'].alias = [];
                            model.MethodParameter.language['az'].alias.push('name');
                            model.MethodParameter.language['az'].alias.push('n');
                            model.MethodParameter.language['az'].alias.push(parameterName);
                        }
                    }
                    if (!isNullOrUndefined(model.MethodParameter.language['az'].alias)) {
                        argument = "        c.argument('" + parameterName + "'";
                        const aliases = model.MethodParameter.language['az'].alias;
                        if (aliases.length > 0) {
                            const aliasStr = [];
                            const oriAlias = [];
                            for (let alias of aliases) {
                                alias = alias.replace(/'/g, '');
                                const tmpAlias = alias;
                                if (alias.length === 1) {
                                    alias = "'-" + alias + "'";
                                } else if (alias.length > 1) {
                                    alias = "'--" + alias.replace(/_/g, '-') + "'";
                                }
                                if (aliasStr.indexOf(alias) < 0) {
                                    aliasStr.push(alias);
                                    oriAlias.push(tmpAlias);
                                }
                            }
                            model.MethodParameter.language['az'].alias = oriAlias;
                            argument += ', options_list=[' + aliasStr.join(', ') + ']';
                        }
                    }

                    if (allParam.has(parameterName)) {
                        continue;
                    }
                    allParam.set(parameterName, true);

                    if (model.MethodParameter_Type === SchemaType.Boolean) {
                        hasBoolean = true;
                        argument += ', arg_type=get_three_state_flag()';
                    } else if (
                        model.MethodParameter_Type === SchemaType.Choice ||
                        model.MethodParameter_Type === SchemaType.SealedChoice
                    ) {
                        hasEnum = true;
                        argument += ', arg_type=get_enum_type([';

                        model.MethodParameter_EnumValues.forEach((element) => {
                            if (!argument.endsWith('[')) argument += ', ';
                            argument += "'" + element + "'";
                        });
                        argument += '])';
                    }

                    let needSkip = false;
                    if (parameterName === 'resource_group_name') {
                        argument += ', resource_group_name_type';
                        hasResourceGroup = true;
                        hasResourceGroupInOperation = true;
                        needSkip = true;
                    } else if (parameterName === 'tags') {
                        argument += ', tags_type';
                        hasTags = true;
                        needSkip = true;
                    } else if (parameterName === 'location') {
                        argument += ', arg_type=get_location_type(self.cli_ctx)';
                        if (hasResourceGroupInOperation) {
                            argument +=
                                ', required=False, validator=get_default_location_from_resource_group';
                            hasLocationValidator = true;
                        }
                        hasLocation = true;
                        needSkip = true;
                    } else if (model.MethodParameter_IsSimpleArray) {
                        if (model.MethodParameter.language['cli'].required === false) {
                            argument += ", nargs='*'";
                        } else {
                            argument += ", nargs='+'";
                        }
                    } else if (
                        model.MethodParameter_IsList &&
                        !model.MethodParameter_IsListOfSimple
                    ) {
                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            baseParam = model.MethodParameter;
                            continue;
                        }
                        hasJson = true;
                        argument += ', type=validate_file_or_dict';
                    } else if (
                        model.MethodParameter_IsList &&
                        model.MethodParameter_IsListOfSimple
                    ) {
                        const actionName: string = model.Schema_ActionName(
                            model.MethodParameter.schema,
                        );
                        argument += ', action=' + actionName;
                        hasActions = true;

                        if (actions.indexOf(actionName) < 0) {
                            actions.push(actionName);
                        }
                        if (model.MethodParameter.language['cli'].required === false) {
                            argument += ", nargs='*'";
                        } else {
                            argument += ", nargs='+'";
                        }
                    }

                    if (!needSkip) {
                        if (model.MethodParameter_Type === SchemaType.Integer) {
                            argument += ', type=int';
                        } else if (model.MethodParameter_Type === SchemaType.Number) {
                            argument += ', type=float';
                        } else if (model.MethodParameter_Type === SchemaType.String) {
                            argument += ', type=str';
                        }

                        argument +=
                            ", help='" +
                            EscapeString(model.MethodParameter_Description).trimRight();
                        if (model.MethodParameter_IsList && !model.MethodParameter_IsSimpleArray) {
                            const netDescription = model.MethodParameter_Description.trim();
                            if (
                                netDescription.length > 0 &&
                                netDescription[netDescription.length - 1].match(
                                    /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i,
                                )
                            ) {
                                argument += '.';
                            }
                            if (model.MethodParameter_IsListOfSimple) {
                                let options = [];
                                if (
                                    !isNullOrUndefined(
                                        model.Schema_ActionName(model.MethodParameter.schema),
                                    )
                                ) {
                                    if (
                                        baseParam &&
                                        model.MethodParameter['polyBaseParam'] === baseParam
                                    ) {
                                        const keyToMatch =
                                            baseParam.schema?.discriminator?.property?.language
                                                .python?.name;
                                        const valueToMatch =
                                            model.MethodParameter.schema?.['discriminatorValue'];
                                        options = GetActionOptions(model, keyToMatch, valueToMatch);
                                    } else {
                                        options = GetActionOptions(model);
                                    }
                                }
                                if (options.length > 0) {
                                    // for those object has known KEYs, the help is in the _help.py file
                                } else {
                                    argument += ' Expect value: KEY1=VALUE1 KEY2=VALUE2 ...';
                                }
                            } else {
                                argument += ' Expected value: json-string/@json-file.';
                            }
                        }
                        if (debug) {
                            if (!argument.endsWith('.')) {
                                argument += '.';
                            }
                            argument += ' Swagger name=' + model.MethodParameter_CliKey;
                        }
                        argument += "'";

                        if (
                            !isNullOrUndefined(baseParam) &&
                            model.MethodParameter['polyBaseParam'] === baseParam
                        ) {
                            argument +=
                                ", arg_group='" +
                                Capitalize(ToCamelCase(model.Parameter_MapsTo(baseParam))) +
                                "'";
                        } else if (!isNullOrUndefined(model.MethodParameter_ArgGroup)) {
                            argument += ", arg_group='" + model.MethodParameter_ArgGroup + "'";
                        }
                    }
                    if (
                        !model.Method_NameAz.startsWith('list') &&
                        !model.Method_NameAz.split(' ').last.startsWith('create')
                    ) {
                        if (!isNullOrUndefined(model.MethodParameter_IdPart)) {
                            argument += ", id_part='" + model.MethodParameter_IdPart + "'";
                        }
                    }

                    if (!isNullOrUndefined(model.MethodParameter_DefaultConfigKey)) {
                        argument +=
                            ", configured_default='" + model.MethodParameter_DefaultConfigKey + "'";
                    }
                    const paramRet = composeParamString(
                        model.MethodParameter_MaxApi,
                        model.MethodParameter_MinApi,
                        model.MethodParameter_ResourceType,
                    );
                    argument += paramRet[0];
                    if (paramRet[1]) useResourceType = true;
                    let parameterExtraInfo = '';
                    parameterExtraInfo = getExtraModeInfo(
                        model.MethodParameter_Mode,
                        model.Command_Mode,
                    );
                    if (parameterExtraInfo !== '') {
                        parameterExtraInfo = ', ' + parameterExtraInfo;
                    }
                    argument += parameterExtraInfo;
                    argument += ')';

                    ToMultiLine(argument, outputArgs);
                } while (model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }
    if (needGeneric && allPythonParam.size > 0) {
        let argument = '        c.ignore(';
        for (const k of allPythonParam.keys()) {
            argument += "'" + k + "'" + ', ';
        }
        argument = argument.slice(0, -2) + ')';
        hasParam = true;
        ToMultiLine(argument, outputArgs);
    }

    if (!hasParam) {
        return [];
    }

    return outputArgs;
}

function GetActionOptions(
    model: CodeModelAz,
    keyToMatch: string = null,
    valueToMatch: string = null,
): string[] {
    const options = [];

    if (!SchemaType.Object || !SchemaType.Array) {
        return options;
    }
    if (model.EnterSubMethodParameters()) {
        if (model.SelectFirstMethodParameter()) {
            do {
                if (model.SubMethodParameter['readOnly']) {
                    continue;
                }
                if (model.SubMethodParameter.schema?.type === SchemaType.Constant) {
                    continue;
                }
                if (
                    !isNullOrUndefined(keyToMatch) &&
                    !isNullOrUndefined(valueToMatch) &&
                    model.Parameter_NamePython(model.SubMethodParameter) === keyToMatch
                ) {
                    continue;
                }
                const azName = model.Parameter_NameAz(model.SubMethodParameter);
                if (azName) {
                    options.push(azName);
                }
            } while (model.SelectNextMethodParameter());
        }
        model.ExitSubMethodParameters();
    }

    return options;
}
