/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../codemodel/CodeModelAz';
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
import { CodeGenConstants } from '../../../utils/models';
import { CliTopAction } from '../CliTopAction';

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
    const { commandGroupHandler, commandHandler, configHandler } = model.GetHandler();
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
                    if (
                        commandHandler.Command_IsLongRun &&
                        commandGroupHandler.CommandGroup_HasShowCommand
                    ) {
                        needWait = true;
                    }
                    const needGeneric = commandHandler.Command_NeedGeneric;
                    const commandOutput = getCommandBody(model, needGeneric, debug);
                    if (commandHandler.Command_MethodName === 'show') {
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
        header.addFromImport(configHandler.CliCoreLib + '.commands.parameters', parameterImports);
    }

    const validatorImports: string[] = [];
    if (hasLocationValidator) {
        validatorImports.push('get_default_location_from_resource_group');
    }
    if (hasJson) {
        validatorImports.push('validate_file_or_dict');
    }
    if (validatorImports.length > 0) {
        header.addFromImport(configHandler.CliCoreLib + '.commands.validators', validatorImports);
    }

    if (hasActions) {
        if (configHandler.IsCliCore) {
            const topAction = new CliTopAction(model);
            header.addFromImport('..' + topAction.relativePath.replace(/\.py$/, ''), actions);
        } else {
            header.addFromImport(configHandler.AzextFolder + '.action', actions);
        }
    }

    let output: string[] = [];

    output = output.concat(outputArgs);

    output.push('');

    output.forEach((element) => {
        if (element.length > CodeGenConstants.PYLINT_MAX_CODE_LENGTH + 1) {
            header.disableLineTooLong = true;
        }
    });

    if (useResourceType) {
        header.addFromImport('azure.cli.core.profiles', ['ResourceType']);
    }

    return header.getLines().concat(output);
}

function getCommandBody(model: CodeModelAz, needGeneric = false, debug = false) {
    const {
        commandHandler,
        methodHandler,
        methodParameterHandler,
        parameterHandler,
    } = model.GetHandler();
    // let method: string = methods[mi];

    // let ctx = model.SelectCommand(method);
    // if (ctx === null)
    //    continue;
    const outputArgs: string[] = [];
    outputArgs.push('');
    outputArgs.push("    with self.argument_context('" + commandHandler.Command_Name + "') as c:");

    let hasParam = false;
    const allParam: Map<string, boolean> = new Map<string, boolean>();
    const allPythonParam: Map<string, boolean> = new Map<string, boolean>();
    if (model.SelectFirstMethod()) {
        do {
            const originalOperation = methodHandler.Method_GetOriginalOperation;
            if (!isNullOrUndefined(originalOperation)) {
                for (const param of originalOperation.parameters) {
                    if (parameterHandler.Parameter_InGlobal(param)) {
                        continue;
                    }
                    if (parameterHandler.Parameter_IsFlattened(param) === true) {
                        continue;
                    }
                    if (param?.schema?.type === SchemaType.Constant || param.readOnly) {
                        continue;
                    }
                    const pythonParamName = parameterHandler.Parameter_NamePython(param);
                    if (!isNullOrUndefined(pythonParamName)) {
                        allPythonParam.set(pythonParamName, true);
                    }
                }
                if (!isNullOrUndefined(originalOperation.requests[0].parameters)) {
                    for (const param of originalOperation.requests[0].parameters) {
                        if (parameterHandler.Parameter_InGlobal(param)) {
                            continue;
                        }
                        if (
                            parameterHandler.Parameter_IsFlattened(param) === true &&
                            !parameterHandler.Parameter_IsCliFlattened(param)
                        ) {
                            continue;
                        }
                        if (param?.schema?.type === SchemaType.Constant || param.readOnly) {
                            continue;
                        }
                        const pythonParamName = parameterHandler.Parameter_NamePython(param);
                        if (!isNullOrUndefined(pythonParamName)) {
                            allPythonParam.set(pythonParamName, true);
                        }
                    }
                }
            }
            let baseParam = null;
            let hasResourceGroupInOperation = false;
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (methodParameterHandler.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (
                        methodParameterHandler.MethodParameter_Type === SchemaType.Constant ||
                        methodParameterHandler.MethodParameter['readOnly']
                    ) {
                        continue;
                    }
                    hasParam = true;
                    if (
                        isNullOrUndefined(originalOperation) &&
                        !isNullOrUndefined(methodParameterHandler.MethodParameter_NamePython)
                    ) {
                        allPythonParam.set(methodParameterHandler.MethodParameter_NamePython, true);
                    }
                    const parameterName = methodParameterHandler.MethodParameter_MapsTo;
                    if (
                        !isNullOrUndefined(originalOperation) &&
                        methodParameterHandler.MethodParameter['targetProperty']?.isDiscriminator
                    ) {
                        continue;
                    }
                    if (allPythonParam.has(parameterName)) {
                        allPythonParam.delete(parameterName);
                    }
                    let argument = "        c.argument('" + parameterName + "'";

                    if (
                        !isNullOrUndefined(
                            methodParameterHandler.MethodParameter.language['az'].alias,
                        )
                    ) {
                        argument = "        c.argument('" + parameterName + "'";
                        const aliases = methodParameterHandler.MethodParameter.language['az'].alias;
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
                            methodParameterHandler.MethodParameter.language['az'].alias = oriAlias;
                            argument += ', options_list=[' + aliasStr.join(', ') + ']';
                        }
                    }

                    if (allParam.has(parameterName)) {
                        continue;
                    }
                    allParam.set(parameterName, true);

                    if (methodParameterHandler.MethodParameter_Type === SchemaType.Boolean) {
                        hasBoolean = true;
                        argument += ', arg_type=get_three_state_flag()';
                    } else if (
                        methodParameterHandler.MethodParameter_Type === SchemaType.Choice ||
                        methodParameterHandler.MethodParameter_Type === SchemaType.SealedChoice
                    ) {
                        hasEnum = true;
                        argument += ', arg_type=get_enum_type([';

                        methodParameterHandler.MethodParameter_EnumValues.forEach((element) => {
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
                    } else if (methodParameterHandler.MethodParameter_IsSimpleArray) {
                        if (
                            methodParameterHandler.MethodParameter.language['cli'].required ===
                            false
                        ) {
                            argument += ", nargs='*'";
                        } else {
                            argument += ", nargs='+'";
                        }
                    } else if (
                        methodParameterHandler.MethodParameter_IsList &&
                        !methodParameterHandler.MethodParameter_IsListOfSimple
                    ) {
                        if (
                            parameterHandler.Parameter_IsPolyOfSimple(
                                methodParameterHandler.MethodParameter,
                            )
                        ) {
                            baseParam = methodParameterHandler.MethodParameter;
                            continue;
                        }
                        hasJson = true;
                        argument += ', type=validate_file_or_dict';
                    } else if (
                        methodParameterHandler.MethodParameter_IsList &&
                        methodParameterHandler.MethodParameter_IsListOfSimple
                    ) {
                        const actionName: string =
                            methodParameterHandler.MethodParameter_ActionName;
                        argument += ', action=' + actionName;
                        hasActions = true;

                        if (actions.indexOf(actionName) < 0) {
                            actions.push(actionName);
                        }
                        if (
                            methodParameterHandler.MethodParameter.language['cli'].required ===
                            false
                        ) {
                            argument += ", nargs='*'";
                        } else {
                            argument += ", nargs='+'";
                        }
                    }

                    if (!needSkip) {
                        if (methodParameterHandler.MethodParameter_Type === SchemaType.Integer) {
                            argument += ', type=int';
                        } else if (
                            methodParameterHandler.MethodParameter_Type === SchemaType.Number
                        ) {
                            argument += ', type=float';
                        } else if (
                            methodParameterHandler.MethodParameter_Type === SchemaType.String
                        ) {
                            argument += ', type=str';
                        }

                        argument +=
                            ", help='" +
                            EscapeString(
                                methodParameterHandler.MethodParameter_Description,
                            ).trimRight();
                        if (
                            methodParameterHandler.MethodParameter_IsList &&
                            !methodParameterHandler.MethodParameter_IsSimpleArray
                        ) {
                            const netDescription = methodParameterHandler.MethodParameter_Description.trim();
                            if (
                                netDescription.length > 0 &&
                                netDescription[netDescription.length - 1].match(
                                    /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i,
                                )
                            ) {
                                argument += '.';
                            }
                            if (methodParameterHandler.MethodParameter_IsListOfSimple) {
                                let options = [];
                                if (
                                    !isNullOrUndefined(
                                        methodParameterHandler.MethodParameter_ActionName,
                                    )
                                ) {
                                    if (
                                        baseParam &&
                                        methodParameterHandler.MethodParameter['polyBaseParam'] ===
                                            baseParam
                                    ) {
                                        const keyToMatch =
                                            baseParam.schema?.discriminator?.property?.language
                                                .python?.name;
                                        const valueToMatch =
                                            methodParameterHandler.MethodParameter.schema?.[
                                                'discriminatorValue'
                                            ];
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
                                argument += ' Expected value: json-string/json-file/@json-file.';
                            }
                        }
                        if (debug) {
                            if (!argument.endsWith('.')) {
                                argument += '.';
                            }
                            argument +=
                                ' Swagger name=' + methodParameterHandler.MethodParameter_CliKey;
                        }
                        argument += "'";

                        if (
                            !isNullOrUndefined(baseParam) &&
                            methodParameterHandler.MethodParameter['polyBaseParam'] === baseParam
                        ) {
                            argument +=
                                ", arg_group='" +
                                Capitalize(
                                    ToCamelCase(parameterHandler.Parameter_MapsTo(baseParam)),
                                ) +
                                "'";
                        } else if (
                            !isNullOrUndefined(methodParameterHandler.MethodParameter_ArgGroup)
                        ) {
                            argument +=
                                ", arg_group='" +
                                methodParameterHandler.MethodParameter_ArgGroup +
                                "'";
                        }
                    }
                    const lastItem = methodHandler.Method_NameAz.split(' ').last;
                    if (
                        !lastItem.startsWith('list') &&
                        !methodHandler.Method_NameAz.split(' ').last.startsWith('create')
                    ) {
                        if (!isNullOrUndefined(methodParameterHandler.MethodParameter_IdPart)) {
                            argument +=
                                ", id_part='" + methodParameterHandler.MethodParameter_IdPart + "'";
                        }
                    }

                    if (
                        !isNullOrUndefined(methodParameterHandler.MethodParameter_DefaultConfigKey)
                    ) {
                        argument +=
                            ", configured_default='" +
                            methodParameterHandler.MethodParameter_DefaultConfigKey +
                            "'";
                    }
                    const paramRet = composeParamString(
                        methodParameterHandler.MethodParameter_MaxApi,
                        methodParameterHandler.MethodParameter_MinApi,
                        methodParameterHandler.MethodParameter_ResourceType,
                    );
                    argument += paramRet[0];
                    if (paramRet[1]) useResourceType = true;
                    let parameterExtraInfo = '';
                    parameterExtraInfo = getExtraModeInfo(
                        methodParameterHandler.MethodParameter_Mode,
                        commandHandler.Command_Mode,
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
    const { parameterHandler } = model.GetHandler();
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
                    parameterHandler.Parameter_NamePython(model.SubMethodParameter) === keyToMatch
                ) {
                    continue;
                }
                const azName = parameterHandler.Parameter_NameAz(model.SubMethodParameter);
                if (azName) {
                    options.push(azName);
                }
            } while (model.SelectNextMethodParameter());
        }
        model.ExitSubMethodParameters();
    }

    return options;
}
