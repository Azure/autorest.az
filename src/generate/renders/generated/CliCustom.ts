/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { Operation, Parameter, SchemaType } from '@azure-tools/codemodel';
import {
    Capitalize,
    ToCamelCase,
    ToMultiLine,
    ToPythonString,
    isNullOrUndefined,
} from '../../../utils/helper';
import { CodeGenConstants } from '../../../utils/models';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { HeaderGenerator } from '../Header';

let allParams = [];
export function GenerateAzureCliCustom(model: CodeModelAz): string[] {
    const { configHandler } = model.GetHandler();
    const header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;

    // this is no longer a problem
    // header.disableTooManyLocals = true;
    // header.disableUnusedArgument = true;

    const required: any = {};
    const body: string[] = GenerateBody(model, required);

    if (required.json) {
        header.addImport('json');
    }

    if (required.clierror) {
        header.addFromImport('knack.util', ['CLIError']);
    }

    if (required.nowait) {
        header.addFromImport(configHandler.CliCoreLib + '.util', ['sdk_no_wait']);
    }

    if (required.disableUnusedArgument) {
        header.disableUnusedArgument = true;
    }

    let output = [];
    output = output.concat(body);
    output.push('');

    output.forEach((element) => {
        if (element.length > CodeGenConstants.PYLINT_MAX_CODE_LENGTH + 1) {
            header.disableLineTooLong = true;
        }
    });

    return header.getLines().concat(output);
}

class CustomParam {
    public constructor(
        public originalOperation: Operation,
        public needGeneric: boolean,
        public genericParameter: Parameter,
    ) {}
}

function getCustomParam(model: CodeModelAz, required: any) {
    const { methodHandler } = model.GetHandler();
    const originalOperation = methodHandler.Method_GetOriginalOperation();
    let genericParameter = null;
    if (!isNullOrUndefined(originalOperation)) {
        genericParameter = methodHandler.Method_GenericSetterParameter(originalOperation);
    }
    const needGeneric = methodHandler.Method_NeedGeneric;
    if (needGeneric) {
        required.disableUnusedArgument = true;
    }
    const customPara = new CustomParam(originalOperation, needGeneric, genericParameter);
    return customPara;
}

function GenerateBody(model: CodeModelAz, required: any): string[] {
    let output: string[] = [];

    if (model.SelectFirstCommandGroup()) {
        do {
            if (model.SelectFirstCommand()) {
                do {
                    if (model.SelectFirstMethod()) {
                        output = output.concat(GetCommandBody(model, required));
                    }
                } while (model.SelectNextCommand());
            }
        } while (model.SelectNextCommandGroup());
    }

    return output;
}

function ConstructMethodBodyParameter(model: CodeModelAz, needGeneric = false, required: any) {
    const {
        methodHandler,
        methodParameterHandler,
        configHandler,
        schemaHandler,
        parameterHandler,
    } = model.GetHandler();
    let outputBody: string[] = [];
    const opNames = methodHandler.Method_NameAz.split(' ');
    let valueToMatch = null;
    if (opNames.length > 1) {
        valueToMatch = Capitalize(ToCamelCase(opNames[0]));
    }
    // let addGenericSchema = false;
    if (model.SelectFirstMethodParameter(true)) {
        const originalParameterStack: Parameter[] = [];
        const originalParameterNameStack: string[] = [];
        const prefixIndent = '    ';

        let skip = false;
        do {
            if (skip) {
                skip = false;
            }
            if (
                (methodParameterHandler.MethodParameter_IsCliFlattened &&
                    (!isNullOrUndefined(
                        methodParameterHandler.MethodParameter.language['cli'].cliFlattenTrace,
                    ) ||
                        configHandler.SDK_NoFlatten ||
                        !isNullOrUndefined(
                            methodParameterHandler.MethodParameter.extensions?.[
                                'cli-poly-as-resource-base-schema'
                            ],
                        ))) ||
                methodHandler.Method.extensions?.['cli-split-operation-original-operation']
                    ?.genericSetterParam === methodParameterHandler.MethodParameter ||
                (methodParameterHandler.MethodParameter_IsFlattened &&
                    methodParameterHandler.MethodParameter.extensions?.['cli-flattened'])
            ) {
                while (
                    !isNullOrUndefined(
                        methodParameterHandler.MethodParameter.language?.['cli']?.cliFlattenTrace,
                    ) &&
                    methodParameterHandler.MethodParameter.language?.['cli']?.cliFlattenTrace
                        ?.length < originalParameterStack.length
                ) {
                    originalParameterStack.pop();
                    originalParameterNameStack.pop();
                }
                // This is because splited operation will miss one cliM4Path in its' CLIFlattenTrace
                if (
                    !isNullOrUndefined(
                        methodParameterHandler.MethodParameter.language?.['cli']?.cliFlattenTrace,
                    ) &&
                    methodParameterHandler.MethodParameter.language?.['cli']?.cliFlattenTrace
                        ?.length === originalParameterStack.length &&
                    isNullOrUndefined(
                        methodHandler.Method.extensions?.[
                            'cli-poly-as-resource-original-operation'
                        ],
                    ) &&
                    isNullOrUndefined(
                        methodHandler.Method.extensions?.['cli-split-operation-original-operation'],
                    )
                ) {
                    originalParameterStack.pop();
                    originalParameterNameStack.pop();
                }
                if (
                    originalParameterStack.length === 0 &&
                    allParams.indexOf(methodParameterHandler.MethodParameter.schema) === -1
                ) {
                    allParams.push(methodParameterHandler.MethodParameter.schema);
                    originalParameterStack.push(methodParameterHandler.MethodParameter);
                    originalParameterNameStack.push(methodParameterHandler.MethodParameter_Name);
                } else if (originalParameterStack.length > 0) {
                    originalParameterStack.push(methodParameterHandler.MethodParameter);
                    originalParameterNameStack.push(methodParameterHandler.MethodParameter_Name);
                } else {
                    continue;
                }
                if (!needGeneric) {
                    outputBody = outputBody.concat(
                        ConstructValuation(
                            model,
                            required,
                            needGeneric,
                            prefixIndent,
                            originalParameterNameStack,
                            null,
                            '{}',
                        ),
                    );
                }
            } else if (originalParameterStack.length > 0) {
                const flattenedFrom = schemaHandler.Schema_FlattenedFrom(
                    methodParameterHandler.MethodParameter['targetProperty'],
                );
                if (
                    methodParameterHandler.MethodParameter['originalParameter'] ===
                        originalParameterStack.last ||
                    (!isNullOrUndefined(originalParameterStack.last['nameBaseParam']) &&
                        methodParameterHandler.MethodParameter['originalParameter'] ===
                            originalParameterStack.last['nameBaseParam']) ||
                    !isNullOrUndefined(flattenedFrom)
                ) {
                    let access = [];
                    const paramName = parameterHandler.Parameter_NamePython(
                        methodParameterHandler.MethodParameter['targetProperty'],
                    );
                    if (
                        !isNullOrUndefined(flattenedFrom) &&
                        flattenedFrom !== originalParameterStack.last.schema
                    ) {
                        // If last originalParameter in the stack doesn't have originalParameterStack.last cliM4Path. it means this argument is not flattened from originalParameterStack.last. We should pop the last item out.
                        while (
                            !isNullOrUndefined(
                                methodParameterHandler.MethodParameter.language?.['cli']
                                    ?.cliFlattenTrace,
                            ) &&
                            !isNullOrUndefined(
                                originalParameterStack.last.language?.['cli']?.cliM4Path,
                            ) &&
                            methodParameterHandler.MethodParameter.language?.[
                                'cli'
                            ]?.cliFlattenTrace.indexOf(
                                originalParameterStack.last.language?.['cli']?.cliM4Path,
                            ) === -1
                        ) {
                            originalParameterStack.pop();
                            originalParameterNameStack.pop();
                        }
                        if (
                            originalParameterStack.last?.language?.['cli']?.[
                                'moved-from-python'
                            ] !== true &&
                            originalParameterStack.last.schema !== flattenedFrom
                        ) {
                            const newParam = new Parameter(
                                flattenedFrom.language.python.name,
                                flattenedFrom.language.python.description,
                                flattenedFrom,
                            );
                            newParam.language['cli'] = flattenedFrom.language['cli'];
                            originalParameterStack.push(newParam);
                            originalParameterNameStack.push(flattenedFrom.language.python.name);
                            if (!needGeneric) {
                                outputBody = outputBody.concat(
                                    ConstructValuation(
                                        model,
                                        required,
                                        needGeneric,
                                        prefixIndent,
                                        originalParameterNameStack,
                                        null,
                                        '{}',
                                    ),
                                );
                            }
                        }
                    }

                    if (
                        methodParameterHandler.MethodParameter['targetProperty']
                            ?.isDiscriminator === true
                    ) {
                        valueToMatch =
                            methodParameterHandler.MethodParameter.extensions?.[
                                'cli-discriminator-value'
                            ];
                        if (!isNullOrUndefined(valueToMatch) && !needGeneric) {
                            access = ConstructValuation(
                                model,
                                required,
                                needGeneric,
                                prefixIndent,
                                originalParameterNameStack,
                                paramName,
                                "'" + valueToMatch + "'",
                            );
                        } else {
                            continue;
                        }
                    } else {
                        let defaultValue = ToPythonString(
                            methodParameterHandler.MethodParameter_DefaultValue,
                            methodParameterHandler.MethodParameter_Type,
                        );
                        if (methodParameterHandler.MethodParameter_DefaultValue === '{}') {
                            defaultValue = '{}';
                        }
                        if (!methodParameterHandler.MethodParameter_IsHidden) {
                            let needIfClause = true;
                            if (
                                methodParameterHandler.MethodParameter_Type === SchemaType.Constant
                            ) {
                                needIfClause = false;
                            }
                            access = ConstructValuation(
                                model,
                                required,
                                needGeneric,
                                prefixIndent,
                                originalParameterNameStack,
                                paramName,
                                methodParameterHandler.MethodParameter_MapsTo,
                                defaultValue,
                                needIfClause,
                            );
                        } else if (
                            !isNullOrUndefined(methodParameterHandler.MethodParameter_DefaultValue)
                        ) {
                            if (
                                model.isComplexSchema(
                                    methodParameterHandler.MethodParameter_Type,
                                    methodParameterHandler.MethodParameter,
                                ) &&
                                defaultValue !== '{}'
                            ) {
                                defaultValue = 'json.loads(' + defaultValue + ')';
                                required.json = true;
                            }
                            access = ConstructValuation(
                                model,
                                required,
                                needGeneric,
                                prefixIndent,
                                originalParameterNameStack,
                                paramName,
                                defaultValue,
                            );
                        }
                    }
                    outputBody = outputBody.concat(access);
                    if (
                        parameterHandler.Parameter_IsPolyOfSimple(
                            methodParameterHandler.MethodParameter,
                        )
                    ) {
                        const baseParam = methodParameterHandler.MethodParameter;
                        let hasNext = false;
                        if (model.SelectNextMethodParameter(true)) {
                            hasNext = true;
                            while (
                                hasNext &&
                                methodParameterHandler.MethodParameter['polyBaseParam'] ===
                                    baseParam
                            ) {
                                hasNext = model.SelectNextMethodParameter(true);
                            }
                        }
                        if (
                            hasNext &&
                            methodParameterHandler.MethodParameter['polyBaseParam'] !== baseParam
                        ) {
                            skip = true;
                        }
                    }
                } else {
                    originalParameterStack.pop();
                    originalParameterNameStack.pop();
                    // if this parameter was popped out because of last flattened parameter has just finished construction,
                    // then we need to run construction logic for this parameter one more time.
                    if (
                        originalParameterStack.length > 0 &&
                        methodParameterHandler.MethodParameter['originalParameter'] ===
                            originalParameterStack.last
                    ) {
                        skip = true;
                    }
                }
            }
        } while (skip || model.SelectNextMethodParameter(true));
    }
    return outputBody;
}

function ConstructValuation(
    model: CodeModelAz,
    required: any,
    isGeneric: boolean,
    prefix: string,
    classNames: string[],
    paramName: string,
    value: string,
    defaultValue: string = null,
    needIfClause = true,
): string[] {
    let str = [];
    if (isNullOrUndefined(defaultValue)) {
        let left = '';
        if (isGeneric) {
            if (value.startsWith("'") && value.endsWith("'")) {
                left = prefix + GetInstancePath(model, required) + '.';
            } else {
                str.push(prefix + 'if ' + value + ' is not None:');
                left = prefix + '    ' + GetInstancePath(model, required) + '.';
            }
            for (let i = 1; i < classNames.length; ++i) {
                left = left + classNames[i] + '.';
            }
            left = left + paramName;
        } else {
            left = prefix + classNames[0];
            for (let i = 1; i < classNames.length; ++i) {
                left = left + "['" + classNames[i] + "']";
            }

            if (!isNullOrUndefined(paramName)) {
                left = left + "['" + paramName + "']";
            }
        }
        str.push(left + ' = ' + value);
    } else {
        let ifClause = '';
        if (needIfClause) {
            ifClause = ' if ' + value + ' is None else ' + value;
        }
        str = str.concat(
            ConstructValuation(
                model,
                required,
                isGeneric,
                prefix,
                classNames,
                paramName,
                defaultValue,
            ) + ifClause,
        );
    }
    return str;
}

function GetSingleCommandDef(model: CodeModelAz, required: any) {
    const {
        commandGroupHandler,
        commandHandler,
        methodHandler,
        methodParameterHandler,
        parameterHandler,
    } = model.GetHandler();
    const output: string[] = [];
    const updatedMethodName: string = commandHandler.Command_FunctionName;

    let call = 'def ' + updatedMethodName + '(';
    const indent = ' '.repeat(call.length);
    const allParam: Map<string, boolean> = new Map<string, boolean>();
    let hasLongRun = false;
    let firstLine = false;
    if (model.SelectFirstMethod()) {
        do {
            const { originalOperation, needGeneric, genericParameter } = getCustomParam(
                model,
                required,
            );
            if (needGeneric) {
                call += 'instance';
            } else {
                call += 'client';
            }
            if (!firstLine) {
                output.push(call);
                firstLine = true;
            }
            if (methodHandler.Method_IsLongRun && commandGroupHandler.CommandGroup_HasShowCommand) {
                required.nowait = true;
                hasLongRun = true;
            }
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (methodParameterHandler.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (methodParameterHandler.MethodParameter_Type === SchemaType.Constant) {
                        continue;
                    }

                    if (
                        needGeneric &&
                        !isNullOrUndefined(genericParameter) &&
                        methodParameterHandler.MethodParameter_MapsTo ===
                            parameterHandler.Parameter_MapsTo(genericParameter)
                    ) {
                        continue;
                    }
                    if (
                        methodParameterHandler.MethodParameter_IsList &&
                        !methodParameterHandler.MethodParameter_IsListOfSimple
                    ) {
                        if (
                            parameterHandler.Parameter_IsPolyOfSimple(
                                methodParameterHandler.MethodParameter,
                            )
                        ) {
                            continue;
                        }
                    }

                    if (
                        !isNullOrUndefined(originalOperation) &&
                        methodParameterHandler.MethodParameter['targetProperty']?.isDiscriminator
                    ) {
                        continue;
                    }
                    const requiredParam: boolean =
                        methodParameterHandler.MethodParameter_RequiredByMethod;

                    const name = methodParameterHandler.MethodParameter_MapsTo; // PythonParameterName(element.Name);
                    if (requiredParam && !allParam.has(name)) {
                        allParam.set(name, true);
                        output[output.length - 1] += ',';
                        output.push(indent + name);
                    }
                } while (model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }

    if (model.SelectFirstMethod()) {
        do {
            const { originalOperation, needGeneric, genericParameter } = getCustomParam(
                model,
                required,
            );
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (methodParameterHandler.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (methodParameterHandler.MethodParameter_Type === SchemaType.Constant) {
                        continue;
                    }

                    if (
                        needGeneric &&
                        !isNullOrUndefined(genericParameter) &&
                        methodParameterHandler.MethodParameter_MapsTo ===
                            parameterHandler.Parameter_MapsTo(genericParameter)
                    ) {
                        continue;
                    }

                    if (
                        methodParameterHandler.MethodParameter_IsList &&
                        !methodParameterHandler.MethodParameter_IsListOfSimple
                    ) {
                        if (
                            parameterHandler.Parameter_IsPolyOfSimple(
                                methodParameterHandler.MethodParameter,
                            )
                        ) {
                            continue;
                        }
                    }

                    if (
                        !isNullOrUndefined(originalOperation) &&
                        methodParameterHandler.MethodParameter['targetProperty']?.isDiscriminator
                    ) {
                        continue;
                    }

                    const requiredParam = methodParameterHandler.MethodParameter_RequiredByMethod;

                    const name = methodParameterHandler.MethodParameter_MapsTo;
                    if (!requiredParam && !allParam.has(name)) {
                        allParam.set(name, true);
                        output[output.length - 1] += ',';
                        output.push(indent + name + '=None');
                    }
                } while (model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }

    if (hasLongRun) {
        output[output.length - 1] += ',';
        output.push(indent + 'no_wait=False');
    }
    output[output.length - 1] += '):';
    return output;
}

function GetSingleCommandBody(model: CodeModelAz, required: any) {
    const { methodHandler, methodParameterHandler, parameterHandler } = model.GetHandler();
    let originalParameters = null;

    let output: string[] = [];
    let outputBody: string[] = [];
    let outputMethodCall: string[] = [];
    allParams = [];
    if (model.SelectFirstMethod()) {
        // create body transformation for methods that support it

        // body transformation
        const allPolyBaseParam: Map<string, boolean> = new Map<string, boolean>();
        do {
            const { originalOperation, needGeneric, genericParameter } = getCustomParam(
                model,
                required,
            );
            if (!isNullOrUndefined(originalOperation)) {
                originalParameters = originalOperation.parameters;
                if (!isNullOrUndefined(originalOperation.requests[0].parameters)) {
                    originalParameters = originalParameters.concat(
                        originalOperation.requests[0].parameters,
                    );
                }
            }
            let skip = false;
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (skip) {
                        skip = false;
                    }
                    if (
                        needGeneric &&
                        !isNullOrUndefined(genericParameter) &&
                        methodParameterHandler.MethodParameter_MapsTo ===
                            parameterHandler.Parameter_MapsTo(genericParameter)
                    ) {
                        continue;
                    }
                    if (
                        methodParameterHandler.MethodParameter_IsList &&
                        !methodParameterHandler.MethodParameter_IsListOfSimple &&
                        !methodParameterHandler.MethodParameter_IsSimpleArray
                    ) {
                        if (
                            parameterHandler.Parameter_IsPolyOfSimple(
                                methodParameterHandler.MethodParameter,
                            )
                        ) {
                            const baseParam = methodParameterHandler.MethodParameter;
                            const baseName = methodParameterHandler.MethodParameter_MapsTo;
                            if (allPolyBaseParam.has(baseName)) {
                                continue;
                            }
                            allPolyBaseParam.set(baseName, true);
                            const baseRequired =
                                methodParameterHandler.MethodParameter_RequiredByMethod;
                            outputBody.push('    ' + 'all_' + baseName + ' = []');
                            const childNames = [];
                            let hasNext = false;
                            if (model.SelectNextMethodParameter()) {
                                hasNext = true;
                            }
                            while (
                                hasNext &&
                                methodParameterHandler.MethodParameter['polyBaseParam'] ===
                                    baseParam
                            ) {
                                const childName = methodParameterHandler.MethodParameter_MapsTo;
                                childNames.push(childName);
                                outputBody.push('    if ' + childName + ' is not None:');
                                outputBody.push(
                                    '        ' + 'all_' + baseName + '.append(' + childName + ')',
                                );
                                hasNext = model.SelectNextMethodParameter();
                            }
                            if (hasNext) {
                                skip = true;
                            }
                            if (childNames.length > 0) {
                                outputBody.push('    if len(' + 'all_' + baseName + ') > 1:');
                                required.clierror = true;
                                ToMultiLine(
                                    "        raise CLIError('at most one of  " +
                                        childNames.join(', ') +
                                        ' is needed for ' +
                                        baseName +
                                        "!')",
                                    outputBody,
                                );
                                if (baseRequired) {
                                    outputBody.push('    if len(' + 'all_' + baseName + ') != 1:');
                                    ToMultiLine(
                                        "        raise CLIError('" +
                                            baseName +
                                            ' is required. but none of ' +
                                            childNames.join(', ') +
                                            " is provided!')",
                                        outputBody,
                                    );
                                }
                                ToMultiLine(
                                    '    ' +
                                        baseName +
                                        ' = all_' +
                                        baseName +
                                        '[0] if len(all_' +
                                        baseName +
                                        ') == 1 else None',
                                    outputBody,
                                );
                            } else {
                                outputBody.pop();
                            }
                            continue;
                        }
                    } else if (
                        methodParameterHandler.MethodParameter_DefaultValue !== undefined &&
                        methodParameterHandler.MethodParameter_Type !== SchemaType.Constant
                    ) {
                        // model is simple type with default value
                        outputBody.push(
                            '    if ' + methodParameterHandler.MethodParameter_MapsTo + ' is None:',
                        );
                        outputBody.push(
                            '        ' +
                                methodParameterHandler.MethodParameter_MapsTo +
                                ' = ' +
                                ToPythonString(
                                    methodParameterHandler.MethodParameter_DefaultValue,
                                    methodParameterHandler.MethodParameter_Type,
                                ),
                        );
                    }
                } while (skip || model.SelectNextMethodParameter());
            }

            outputBody = outputBody.concat(
                ConstructMethodBodyParameter(model, needGeneric, required),
            );
        } while (model.SelectNextMethod());

        model.SelectFirstMethod();
        const needIfStatement = !methodHandler.Method_IsLast;

        do {
            const { originalOperation, needGeneric } = getCustomParam(model, required);
            let prefix = '    ';
            if (needIfStatement) {
                let ifStatement = prefix;
                prefix += '    ';

                if (!methodHandler.Method_IsLast) {
                    ifStatement += methodHandler.Method_IsFirst ? 'if' : 'elif';
                    if (model.SelectFirstMethodParameter()) {
                        do {
                            if (!methodParameterHandler.MethodParameter_IsRequired) {
                                continue;
                            }
                            if (
                                methodParameterHandler.MethodParameter_Type === SchemaType.Constant
                            ) {
                                continue;
                            }
                            if (methodParameterHandler.MethodParameter_IsFlattened) {
                                continue;
                            }
                            ifStatement += ifStatement.endsWith('if') ? '' : ' and';
                            if (
                                methodParameterHandler.MethodParameter_MapsTo ===
                                'resource_group_name'
                            ) {
                                ifStatement += ' ' + methodParameterHandler.MethodParameter_MapsTo;
                            } else {
                                ifStatement +=
                                    ' ' +
                                    methodParameterHandler.MethodParameter_MapsTo +
                                    ' is not None';
                            }
                        } while (model.SelectNextMethodParameter());
                        ifStatement += ':';
                        outputMethodCall.push(ifStatement);
                    }
                } else {
                    ifStatement = '';
                    prefix = '    ';
                }
            }
            // call client & return value
            // XXX - this is still a hack
            if (!isNullOrUndefined(originalOperation)) {
                if (needGeneric) {
                    outputMethodCall = outputMethodCall.concat(GetGenericCall(model, required));
                } else {
                    outputMethodCall = outputMethodCall.concat(
                        GetPolyMethodCall(
                            model,
                            prefix,
                            originalOperation,
                            originalParameters,
                            required,
                        ),
                    );
                }
            } else {
                if (needGeneric) {
                    outputMethodCall = outputMethodCall.concat(GetGenericCall(model, required));
                } else {
                    outputMethodCall = outputMethodCall.concat(
                        GetMethodCall(model, required, prefix),
                    );
                }
            }
        } while (model.SelectNextMethod());
    }

    output = output.concat(outputBody);
    output = output.concat(outputMethodCall);
    return output;
}

function GetCommandBody(model: CodeModelAz, required: any) {
    // create, delete, list, show, update
    let output: string[] = [];
    output.push('');
    output.push('');

    output = output.concat(GetSingleCommandDef(model, required));
    output = output.concat(GetSingleCommandBody(model, required));
    return output;
}

function GetInstancePath(model: CodeModelAz, required) {
    const { originalOperation } = getCustomParam(model, required);
    let ret = '';
    if (
        !isNullOrUndefined(originalOperation['genericPath']) &&
        originalOperation['genericPath'].length > 0
    ) {
        ret = originalOperation['genericPath'].join('.');
    }
    if (ret === '') {
        ret = 'instance';
    } else {
        ret = 'instance.' + ret;
    }
    return ret;
}

function GetGenericCall(model: CodeModelAz, required) {
    const output: string[] = [];
    const ipath = GetInstancePath(model, required);
    output.push('    return ' + ipath);

    return output;
}

function GetPolyMethodCall(
    model: CodeModelAz,
    prefix: any,
    originalOperation: Operation,
    originalParameters: Parameter[],
    required: any,
): string[] {
    const {
        commandGroupHandler,
        methodHandler,
        parameterHandler,
        configHandler,
    } = model.GetHandler();
    let methodCall: string = prefix + 'return ';
    let indent = '';
    let methodName = originalOperation.language.python.name;
    if (methodHandler.Method_IsLongRun && commandGroupHandler.CommandGroup_HasShowCommand) {
        if (!configHandler.SDK_IsTrack1) {
            methodName = 'begin_' + methodName;
        }
        methodCall += 'sdk_no_wait(';
        indent = ' '.repeat(methodCall.length);
        methodCall += 'no_wait,' + '\n' + indent + 'client.' + methodName;
    } else {
        if (!configHandler.SDK_IsTrack1 && methodHandler.Method_IsLongRun) {
            methodName = 'begin_' + methodName;
        }
        methodCall += 'client.' + methodName + '(';
        indent = ' '.repeat(methodCall.length);
    }

    let cnt = 0;
    while (cnt < originalParameters.length) {
        const param = originalParameters[cnt];
        cnt++;
        if (
            (param.flattened && !parameterHandler.Parameter_IsCliFlattened(param)) ||
            (parameterHandler.Parameter_IsCliFlattened(param) && !configHandler.SDK_NoFlatten)
        ) {
            continue;
        }
        if (param.schema.type === SchemaType.Constant) {
            continue;
        }
        if (parameterHandler.Parameter_InGlobal(param)) {
            continue;
        }
        const optionName = parameterHandler.Parameter_SubMapsTo(
            methodHandler.Method_NameCli,
            param,
        );
        const parameterName = parameterHandler.Parameter_NamePython(param);
        if (isNullOrUndefined(parameterName)) {
            continue;
        }
        let parameterPair = '';
        const m4FlattenedFrom = param.language['cli']?.m4FlattenedFrom;
        if (isNullOrUndefined(m4FlattenedFrom) || m4FlattenedFrom.length <= 0) {
            parameterPair = GetSimpleCallItem(model, param, required, false, null, optionName);
        } else {
            const items = [];
            for (const mparam of m4FlattenedFrom) {
                items.push(GetSimpleCallItem(model, mparam, required, true, param));
            }
            parameterPair = items.join(',\n' + indent);
        }

        if (methodCall.endsWith('(')) {
            // XXX - split and pop is a hack
            methodCall += parameterPair;
        } else {
            methodCall += ',' + '\n' + indent + parameterPair;
        }
    }

    methodCall += ')';

    return methodCall.split('\n');
}

function GetSimpleCallItem(
    model: CodeModelAz,
    param: Parameter,
    required: any,
    m4Flattened = false,
    originParam: Parameter = null,
    optionName: string = null,
): string {
    const { parameterHandler, schemaHandler } = model.GetHandler();
    let parameterPair = '';
    if (m4Flattened && !isNullOrUndefined(originParam)) {
        const paramNamePython = parameterHandler.Parameter_NamePython(originParam);
        const keyName = parameterHandler.Parameter_NamePython(param);
        const paramDefaultValue = parameterHandler.Parameter_DefaultValue(originParam);
        if (parameterHandler.Parameter_IsHidden(originParam)) {
            if (paramDefaultValue) {
                if (schemaHandler.Schema_Type(param.schema) === SchemaType.Object) {
                    const defaultValue = JSON.parse(paramDefaultValue);
                    parameterPair =
                        keyName +
                        '=json.loads(' +
                        JSON.stringify(defaultValue[parameterHandler.Parameter_NamePython(param)]) +
                        ')';
                    required.json = true;
                } else {
                    const defaultValue = JSON.parse(paramDefaultValue);
                    parameterPair =
                        keyName +
                        '=' +
                        ToPythonString(
                            defaultValue[parameterHandler.Parameter_NamePython(param)],
                            parameterHandler.Parameter_Type(param),
                        );
                }
            } else {
                parameterPair = paramNamePython + '=None';
            }
        } else {
            parameterPair =
                keyName +
                '=' +
                parameterHandler.Parameter_MapsTo(originParam) +
                "['" +
                keyName +
                "']";
        }
    } else {
        const paramNamePython = parameterHandler.Parameter_NamePython(param);
        const paramDefaultValue = parameterHandler.Parameter_DefaultValue(param);
        if (parameterHandler.Parameter_IsHidden(param)) {
            if (paramDefaultValue) {
                if (schemaHandler.Schema_Type(param.schema) === SchemaType.Object) {
                    parameterPair =
                        paramNamePython +
                        '=json.loads(' +
                        ToPythonString(paramDefaultValue, parameterHandler.Parameter_Type(param)) +
                        ')';
                    required.json = true;
                } else {
                    parameterPair =
                        paramNamePython +
                        '=' +
                        ToPythonString(paramDefaultValue, parameterHandler.Parameter_Type(param));
                }
            } else {
                parameterPair = paramNamePython + '=None';
            }
        } else {
            if (!isNullOrUndefined(optionName)) {
                parameterPair = paramNamePython + '=' + optionName;
            } else {
                parameterPair = paramNamePython + '=' + parameterHandler.Parameter_MapsTo(param);
            }
        }
    }
    return parameterPair;
}

function GetMethodCall(model: CodeModelAz, required: any, prefix: any): string[] {
    const {
        commandGroupHandler,
        methodHandler,
        methodParameterHandler,
        parameterHandler,
        configHandler,
    } = model.GetHandler();
    let methodCall: string = prefix + 'return ';
    let methodName = methodHandler.Method_Name;
    let indent = '';
    if (methodHandler.Method_IsLongRun && commandGroupHandler.CommandGroup_HasShowCommand) {
        if (!configHandler.SDK_IsTrack1) {
            methodName = 'begin_' + methodName;
        }
        methodCall += 'sdk_no_wait(';
        indent = ' '.repeat(methodCall.length);
        methodCall += 'no_wait,' + '\n' + indent + 'client.' + methodName;
    } else {
        if (!configHandler.SDK_IsTrack1 && methodHandler.Method_IsLongRun) {
            methodName = 'begin_' + methodName;
        }
        methodCall += 'client.' + methodName + '(';
        indent = ' '.repeat(methodCall.length);
    }

    let skip = false;
    if (model.SelectFirstMethodParameter(true)) {
        do {
            if (skip) {
                skip = false;
            }

            const param = methodParameterHandler.MethodParameter;

            if (
                (methodParameterHandler.MethodParameter_IsFlattened &&
                    !methodParameterHandler.MethodParameter_IsCliFlattened) ||
                (methodParameterHandler.MethodParameter_IsCliFlattened &&
                    !configHandler.SDK_NoFlatten)
            ) {
                continue;
            }
            if (methodParameterHandler.MethodParameter_Type === SchemaType.Constant) {
                continue;
            }

            if (isNullOrUndefined(methodParameterHandler.MethodParameter_NamePython)) {
                if (
                    parameterHandler.Parameter_IsPolyOfSimple(
                        methodParameterHandler.MethodParameter,
                    )
                ) {
                    const baseParam = methodParameterHandler.MethodParameter;
                    let hasNext = false;
                    if (model.SelectNextMethodParameter(true)) {
                        hasNext = true;
                        while (
                            hasNext &&
                            methodParameterHandler.MethodParameter['polyBaseParam'] === baseParam
                        ) {
                            hasNext = model.SelectNextMethodParameter(true);
                        }
                    }

                    if (
                        hasNext &&
                        methodParameterHandler.MethodParameter['polyBaseParam'] !== baseParam
                    ) {
                        skip = true;
                    }
                }
                continue;
            }
            let parameterPair = '';

            const m4FlattenedFrom =
                methodParameterHandler.MethodParameter.language['cli']?.m4FlattenedFrom;
            if (isNullOrUndefined(m4FlattenedFrom) || m4FlattenedFrom.length <= 0) {
                parameterPair = GetSimpleCallItem(
                    model,
                    methodParameterHandler.MethodParameter,
                    required,
                );
            } else {
                const items = [];
                for (const mparam of m4FlattenedFrom) {
                    items.push(GetSimpleCallItem(model, mparam, required, true, param));
                }
                parameterPair = items.join(',' + '\n' + indent);
            }

            if (methodCall.endsWith('(')) {
                // XXX - split and pop is a hack
                methodCall += parameterPair;
            } else {
                methodCall += ',' + '\n' + indent + parameterPair;
            }

            if (parameterHandler.Parameter_IsPolyOfSimple(methodParameterHandler.MethodParameter)) {
                const baseParam = methodParameterHandler.MethodParameter;
                let hasNext = false;
                if (model.SelectNextMethodParameter(true)) {
                    hasNext = true;
                    while (
                        hasNext &&
                        methodParameterHandler.MethodParameter['polyBaseParam'] === baseParam
                    ) {
                        hasNext = model.SelectNextMethodParameter(true);
                    }
                }

                if (
                    hasNext &&
                    methodParameterHandler.MethodParameter['polyBaseParam'] !== baseParam
                ) {
                    skip = true;
                }
            }
        } while (skip || model.SelectNextMethodParameter(true));
    }

    methodCall += ')';

    return methodCall.split('\n');
}
