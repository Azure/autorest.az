/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { SchemaType, Parameter } from '@azure-tools/codemodel';
import { HeaderGenerator } from '../Header';
import { ToMultiLine, isNullOrUndefined, ToSentence } from '../../../utils/helper';
import { CodeGenConstants } from '../../../utils/models';

let showExampleStr: string;
const allSupportWaited = ['create', 'update', 'delete'];

function initVars() {
    showExampleStr = '';
}

export function GenerateAzureCliHelp(model: CodeModelAz, debug: boolean): string[] {
    const {
        extensionHandler,
        commandGroupHandler,
        commandHandler,
        exampleHandler,
    } = model.GetHandler();
    initVars();
    const header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;
    header.addFromImport('knack.help_files', ['helps']);
    let output: string[] = [];
    output.push('');

    output.push('');
    exampleHandler.GatherInternalResource();
    output.push("helps['" + extensionHandler.Extension_Name + "'] = '''");
    output.push('    type: group');
    output.push('    short-summary: ' + extensionHandler.Extension_Description);
    output.push("'''");
    if (model.SelectFirstCommandGroup()) {
        do {
            // if there's no operation in this command group
            if (!model.SelectFirstCommand()) {
                continue;
            }

            output = output.concat(generateCommandGroupHelp(model, '', debug));
            // let methods: string[] = model.CommandGroup_Commands;

            const allSubGroup: Map<string, boolean> = new Map<string, boolean>();
            let hasWait = false;
            const allLongRunCommand = [];
            if (model.SelectFirstCommand()) {
                do {
                    const subCommandGroupName = commandHandler.Command_SubGroupName;
                    if (subCommandGroupName !== '' && !allSubGroup.has(subCommandGroupName)) {
                        allSubGroup.set(subCommandGroupName, true);
                        output = output.concat(
                            generateCommandGroupHelp(model, subCommandGroupName, debug),
                        );
                    }
                    if (
                        commandHandler.Command_IsLongRun &&
                        commandGroupHandler.CommandGroup_HasShowCommand
                    ) {
                        hasWait = true;
                        let waitParam = '';
                        if (allSupportWaited.indexOf(commandHandler.Command_MethodName) < 0) {
                            waitParam = 'create';
                        } else {
                            waitParam = commandHandler.Command_MethodName;
                        }
                        if (allLongRunCommand.indexOf(waitParam + 'd') < 0) {
                            allLongRunCommand.push(waitParam + 'd');
                        }
                    }
                    const commandOutput: string[] = generateCommandHelp(model, debug);
                    output = output.concat(commandOutput);
                } while (model.SelectNextCommand());
                if (hasWait) {
                    output = output.concat(
                        generateWaitCommandHelp(
                            commandGroupHandler.CommandGroup_Name,
                            allLongRunCommand,
                        ),
                    );
                }
            }
        } while (model.SelectNextCommandGroup());

        output.push('');
    }

    output.forEach((element) => {
        if (element.length > CodeGenConstants.PYLINT_MAX_CODE_LENGTH + 1) {
            header.disableLineTooLong = true;
        }
    });

    return header.getLines().concat(output);
}

function generateWaitCommandHelp(commandGroup, allLongRunCommand) {
    const output = [];
    output.push('');
    output.push("helps['" + commandGroup + ' wait\'] = """');
    output.push('    type: command');
    const summary =
        '    short-summary: Place the CLI in a waiting state until a condition of the ' +
        commandGroup +
        ' is met.';
    ToMultiLine(summary, output, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
    output.push('    examples:');
    for (const waitParam of allLongRunCommand) {
        const name =
            '      - name: Pause executing next line of CLI script until the ' +
            commandGroup +
            ' is successfully ' +
            waitParam +
            '.';
        ToMultiLine(name, output, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
        if (!isNullOrUndefined(showExampleStr) && showExampleStr !== '') {
            output.push('        text: |-');
            const line = showExampleStr.replace(/ show /g, ' wait ') + ' --' + waitParam;
            ToMultiLine(line, output, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
        }
    }
    output.push('"""');
    return output;
}

function generateCommandGroupHelp(model: CodeModelAz, subCommandGroupName = '', debug: boolean) {
    const { commandGroupHandler } = model.GetHandler();
    const output = [];
    output.push('');
    if (subCommandGroupName !== '') {
        output.push("helps['" + subCommandGroupName + '\'] = """');
    } else {
        if (commandGroupHandler.CommandGroup_Help.trim() === '') {
            return [];
        }
        output.push("helps['" + commandGroupHandler.CommandGroup_Name + '\'] = """');
    }
    output.push('    type: group');
    let shortSummary = '    short-summary: ' + commandGroupHandler.CommandGroup_Help.trim();
    if (subCommandGroupName !== '') {
        shortSummary = shortSummary + ' sub group ' + subCommandGroupName.split(' ').pop();
    }
    if (debug) {
        if (!shortSummary.trimRight().endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Command group swagger name=' + commandGroupHandler.CommandGroup_CliKey;
    }
    ToMultiLine(shortSummary, output, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);

    output.push('"""');
    return output;
}

function addParameterHelp(output: string[], model: CodeModelAz, debug: boolean) {
    const { methodHandler, methodParameterHandler, parameterHandler } = model.GetHandler();
    let parameterOutput = ['    parameters:'];

    if (model.SelectFirstMethod()) {
        do {
            const originalOperation = methodHandler.Method_GetOriginalOperation();
            let baseParam = null;
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
                    const parameterName = methodParameterHandler.MethodParameter_MapsTo;
                    if (
                        !isNullOrUndefined(originalOperation) &&
                        methodParameterHandler.MethodParameter['targetProperty']?.isDiscriminator
                    ) {
                        continue;
                    }

                    let parameterAlias: string[] = [];
                    if (
                        !isNullOrUndefined(
                            methodParameterHandler.MethodParameter?.language?.['az']?.alias,
                        )
                    ) {
                        if (
                            !isNullOrUndefined(
                                methodParameterHandler.MethodParameter?.language?.['az']?.alias,
                            )
                        ) {
                            const alias =
                                methodParameterHandler.MethodParameter?.language?.['az']?.alias;

                            if (typeof alias === 'string') {
                                parameterAlias.push(alias);
                            }
                            if (Array.isArray(alias)) {
                                parameterAlias = parameterAlias.concat(alias);
                            }
                        }
                    }
                    if (parameterAlias.length === 0) parameterAlias.push(parameterName);
                    parameterAlias = parameterAlias.map((alias) => {
                        return '--' + alias.replace(/'/g, '').replace(/_/g, '-');
                    });

                    if (
                        methodParameterHandler.MethodParameter_IsList &&
                        methodParameterHandler.MethodParameter_IsListOfSimple &&
                        !methodParameterHandler.MethodParameter_IsSimpleArray
                    ) {
                        if (
                            parameterHandler.Parameter_IsPolyOfSimple(
                                methodParameterHandler.MethodParameter,
                            )
                        ) {
                            baseParam = methodParameterHandler.MethodParameter;
                            continue;
                        }
                        if (methodParameterHandler.MethodParameter_IsPositional) {
                            parameterOutput = parameterOutput.concat(
                                getPositionalActionHelp(model, parameterAlias, baseParam, debug),
                            );
                        } else if (methodParameterHandler.MethodParameter_IsShorthandSyntax) {
                            parameterOutput = parameterOutput.concat(
                                getShorthandSyntaxAction(model, parameterAlias, baseParam, debug),
                            );
                        } else {
                            parameterOutput = parameterOutput.concat(
                                getKeyValueActionHelp(model, parameterAlias, baseParam, debug),
                            );
                        }
                    }
                } while (model.SelectNextMethodParameter());
            }
        } while (model.SelectNextMethod());
    }

    if (parameterOutput.length > 1) {
        return output.concat(parameterOutput);
    } else {
        return output;
    }
}

function getShorthandSyntaxAction(
    model: CodeModelAz,
    parameterAlias: string[],
    baseParam: Parameter,
    debug: boolean,
) {
    const { methodParameterHandler, parameterHandler, schemaHandler } = model.GetHandler();
    let parameterOutput: string[] = [];
    const actionOutput: string[] = [];
    ToMultiLine(
        `      - name: ${parameterAlias.join(' ')}`,
        actionOutput,
        CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
        true,
    );

    if (debug) {
        let shortSummary = '"';
        if (
            methodParameterHandler.MethodParameter_Description &&
            methodParameterHandler.MethodParameter_Description.trim().length > 0
        ) {
            shortSummary += methodParameterHandler.MethodParameter_Description.trim().replace(
                /"/g,
                '\\\\"',
            );
        }
        if (!shortSummary.endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Swagger name=' + methodParameterHandler.MethodParameter_CliKey + '"';
        ToMultiLine(
            `        short-summary: ${shortSummary}`.replace(/\r?\n|\r/g, ''),
            actionOutput,
            CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
            true,
        );
    } else {
        if (
            methodParameterHandler.MethodParameter_Description &&
            methodParameterHandler.MethodParameter_Description.trim().length > 0
        ) {
            const shortSummary = methodParameterHandler.MethodParameter_Description.trim().replace(
                /"/g,
                '\\\\"',
            );
            ToMultiLine(
                `        short-summary: "${shortSummary}"`.replace(/\r?\n|\r/g, ''),
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
    }

    let options: Parameter[] = [];
    if (!isNullOrUndefined(methodParameterHandler.MethodParameter_ActionName)) {
        if (baseParam && methodParameterHandler.MethodParameter['polyBaseParam'] === baseParam) {
            const keyToMatch = baseParam.schema?.['discriminator']?.property?.language.python?.name;
            const valueToMatch =
                methodParameterHandler.MethodParameter.schema?.['discriminatorValue'];
            options = GetKeyValueActionOptions(model, null, keyToMatch, valueToMatch);
        } else {
            options = GetKeyValueActionOptions(model, null);
        }
    }
    if (options.length > 0) {
        actionOutput.push('        long-summary: |');
        const optionUsage =
            ' ' + options.map((p) => `${parameterHandler.Parameter_NameAz(p)}=XX`).join(',');
        if (methodParameterHandler.MethodParameter_Type === SchemaType.Array) {
            ToMultiLine(
                '            Usage: ' + parameterAlias[0] + optionUsage.repeat(2),
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        } else {
            ToMultiLine(
                '            Usage: ' + parameterAlias[0] + optionUsage,
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
        actionOutput.push('');
        for (const p of options) {
            const pDesc = parameterHandler.Parameter_Description(p);
            if (!pDesc || pDesc.trim().length <= 0) continue;
            let line = `            ${parameterHandler.Parameter_NameAz(p)}: `;
            if (p.required) line += 'Required. ';
            line += parameterHandler
                .Parameter_Description(p)
                .trim()
                .replace(/\r?\n|\r/g, '');
            ToMultiLine(line, actionOutput, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
        }
        if (
            schemaHandler.Schema_Type(methodParameterHandler.MethodParameter.schema) ===
            SchemaType.Array
        ) {
            actionOutput.push('');
            ToMultiLine(
                `            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`,
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
        parameterOutput = parameterOutput.concat(actionOutput);
    }
    return parameterOutput;
}

function getPositionalActionHelp(
    model: CodeModelAz,
    parameterAlias: string[],
    baseParam: Parameter,
    debug: boolean,
) {
    const { methodParameterHandler, parameterHandler, schemaHandler } = model.GetHandler();
    let parameterOutput: string[] = [];
    const actionOutput: string[] = [];
    ToMultiLine(
        `      - name: ${parameterAlias.join(' ')}`,
        actionOutput,
        CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
        true,
    );

    if (debug) {
        let shortSummary = '"';
        if (
            methodParameterHandler.MethodParameter_Description &&
            methodParameterHandler.MethodParameter_Description.trim().length > 0
        ) {
            shortSummary += methodParameterHandler.MethodParameter_Description.trim().replace(
                /"/g,
                '\\\\"',
            );
        }
        if (!shortSummary.endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Swagger name=' + methodParameterHandler.MethodParameter_CliKey + '"';
        ToMultiLine(
            `        short-summary: ${shortSummary}`.replace(/\r?\n|\r/g, ''),
            actionOutput,
            CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
            true,
        );
    } else {
        if (
            methodParameterHandler.MethodParameter_Description &&
            methodParameterHandler.MethodParameter_Description.trim().length > 0
        ) {
            const shortSummary = methodParameterHandler.MethodParameter_Description.trim().replace(
                /"/g,
                '\\\\"',
            );
            ToMultiLine(
                `        short-summary: "${shortSummary}"`.replace(/\r?\n|\r/g, ''),
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
    }

    const positionalKeys = methodParameterHandler.MethodParameter_PositionalKeys;
    let options: Parameter[] = [];
    if (!isNullOrUndefined(methodParameterHandler.MethodParameter_ActionName)) {
        if (baseParam && methodParameterHandler.MethodParameter['polyBaseParam'] === baseParam) {
            const keyToMatch = baseParam.schema?.['discriminator']?.property?.language.python?.name;
            const valueToMatch =
                methodParameterHandler.MethodParameter.schema?.['discriminatorValue'];
            options = GetKeyValueActionOptions(model, positionalKeys, keyToMatch, valueToMatch);
        } else {
            options = GetKeyValueActionOptions(model, positionalKeys);
        }
    }
    if (options.length > 0) {
        actionOutput.push('        long-summary: |');
        ToMultiLine(
            [
                '            The order of this parameter is specific customized. Usage: ',
                parameterAlias[0],
            ]
                .concat(options.map((p) => `${parameterHandler.Parameter_NameAz(p)}-value`))
                .join(' '),
            actionOutput,
            CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
            true,
        );
        actionOutput.push('');
        for (const p of options) {
            const pDesc = parameterHandler.Parameter_Description(p);
            if (!pDesc || pDesc.trim().length <= 0) continue;
            let line = `            ${parameterHandler.Parameter_NameAz(p)}: `;
            line += 'Required. ';
            line += parameterHandler
                .Parameter_Description(p)
                .trim()
                .replace(/\r?\n|\r/g, '');
            ToMultiLine(line, actionOutput, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
        }
        if (
            schemaHandler.Schema_Type(methodParameterHandler.MethodParameter.schema) ===
            SchemaType.Array
        ) {
            actionOutput.push('');
            ToMultiLine(
                `            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`,
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
        parameterOutput = parameterOutput.concat(actionOutput);
    }
    return parameterOutput;
}

function getKeyValueActionHelp(
    model: CodeModelAz,
    parameterAlias: string[],
    baseParam: Parameter,
    debug: boolean,
) {
    const { methodParameterHandler, parameterHandler, schemaHandler } = model.GetHandler();
    let parameterOutput: string[] = [];
    const actionOutput: string[] = [];
    ToMultiLine(
        `      - name: ${parameterAlias.join(' ')}`,
        actionOutput,
        CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
        true,
    );

    if (debug) {
        let shortSummary = '"';
        if (
            methodParameterHandler.MethodParameter_Description &&
            methodParameterHandler.MethodParameter_Description.trim().length > 0
        ) {
            shortSummary += methodParameterHandler.MethodParameter_Description.trim().replace(
                /"/g,
                '\\\\"',
            );
        }
        if (!shortSummary.endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Swagger name=' + methodParameterHandler.MethodParameter_CliKey + '"';
        ToMultiLine(
            `        short-summary: ${shortSummary}`.replace(/\r?\n|\r/g, ''),
            actionOutput,
            CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
            true,
        );
    } else {
        if (
            methodParameterHandler.MethodParameter_Description &&
            methodParameterHandler.MethodParameter_Description.trim().length > 0
        ) {
            const shortSummary = methodParameterHandler.MethodParameter_Description.trim().replace(
                /"/g,
                '\\\\"',
            );
            ToMultiLine(
                `        short-summary: "${shortSummary}"`.replace(/\r?\n|\r/g, ''),
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
    }

    let options: Parameter[] = [];
    if (!isNullOrUndefined(methodParameterHandler.MethodParameter_ActionName)) {
        if (baseParam && methodParameterHandler.MethodParameter['polyBaseParam'] === baseParam) {
            const keyToMatch = baseParam.schema?.['discriminator']?.property?.language.python?.name;
            const valueToMatch =
                methodParameterHandler.MethodParameter.schema?.['discriminatorValue'];
            options = GetKeyValueActionOptions(model, null, keyToMatch, valueToMatch);
        } else {
            options = GetKeyValueActionOptions(model, null);
        }
    }
    if (options.length > 0) {
        actionOutput.push('        long-summary: |');
        ToMultiLine(
            ['            Usage:', parameterAlias[0]]
                .concat(options.map((p) => `${parameterHandler.Parameter_NameAz(p)}=XX`))
                .join(' '),
            actionOutput,
            CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
            true,
        );
        actionOutput.push('');
        for (const p of options) {
            const pDesc = parameterHandler.Parameter_Description(p);
            if (!pDesc || pDesc.trim().length <= 0) continue;
            let line = `            ${parameterHandler.Parameter_NameAz(p)}: `;
            if (p.required) line += 'Required. ';
            line += parameterHandler
                .Parameter_Description(p)
                .trim()
                .replace(/\r?\n|\r/g, '');
            ToMultiLine(line, actionOutput, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
        }
        if (
            schemaHandler.Schema_Type(methodParameterHandler.MethodParameter.schema) ===
            SchemaType.Array
        ) {
            actionOutput.push('');
            ToMultiLine(
                `            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`,
                actionOutput,
                CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
                true,
            );
        }
        parameterOutput = parameterOutput.concat(actionOutput);
    }
    return parameterOutput;
}

function GetKeyValueActionOptions(
    model: CodeModelAz,
    positionalKeys: string[],
    keyToMatch: string = null,
    valueToMatch: string = null,
): Parameter[] {
    const { methodParameterHandler, parameterHandler } = model.GetHandler();
    const options: Parameter[] = [];

    if (!SchemaType.Object || !SchemaType.Array) {
        return options;
    }

    if (methodParameterHandler.MethodParameter_IsPositional) {
        for (const item of positionalKeys) {
            options.push(null);
        }
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
                if (model.SubMethodParameter) {
                    if (methodParameterHandler.MethodParameter_IsPositional) {
                        if (
                            !isNullOrUndefined(positionalKeys) &&
                            Array.isArray(positionalKeys) &&
                            positionalKeys.length > 0 &&
                            positionalKeys.indexOf(
                                parameterHandler.Parameter_NamePython(model.SubMethodParameter),
                            ) > -1
                        ) {
                            options[
                                positionalKeys.indexOf(
                                    parameterHandler.Parameter_NamePython(model.SubMethodParameter),
                                )
                            ] = model.SubMethodParameter;
                        }
                    } else {
                        options.push(model.SubMethodParameter);
                    }
                }
            } while (model.SelectNextMethodParameter());
        }
        model.ExitSubMethodParameters();
    }

    return options;
}

function generateCommandHelp(model: CodeModelAz, debug = false) {
    const {
        commandGroupHandler,
        commandHandler,
        methodHandler,
        exampleHandler,
    } = model.GetHandler();
    // create, delete, list, show, update
    // let method: string = methods[mi];
    // let ctx = model.SelectCommand(method);

    // if (ctx === null)
    //    continue;
    let output: string[] = [];
    output.push('');
    const commandHead = commandHandler.Command_Name;
    output.push("helps['" + commandHead + '\'] = """');
    output.push('    type: command');

    // there will be just one method for create, update, delete, show, etc.
    // there may be a few list methods, so let's just take description from the first one.
    // as we can't use all of them
    let shortSummary = '    short-summary: "';
    let isFirst = true;
    if (model.SelectFirstMethod()) {
        do {
            shortSummary += (isFirst ? '' : ' And ') + methodHandler.Method_Help.trim();
            isFirst = false;
            if (debug) {
                shortSummary +=
                    ' Command group swagger name=' +
                    commandGroupHandler.CommandGroup_CliKey +
                    ', Command swagger name=' +
                    methodHandler.Method_CliKey;
            }
        } while (model.SelectNextMethod());
    }
    if (!shortSummary.trimRight().endsWith('.')) {
        shortSummary += '.';
    }
    shortSummary += '"';
    ToMultiLine(shortSummary, output, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);

    output = addParameterHelp(output, model, debug);

    let examplesStarted = false;

    if (model.SelectFirstMethod()) {
        do {
            for (const example of exampleHandler.GetExamples(false)) {
                if (!examplesStarted) {
                    output.push('    examples:');
                    examplesStarted = true;
                }

                // output.push ("# " + example_id);
                let parameters: string[] = [];
                parameters = exampleHandler.GetExampleItems(example, false, undefined);
                output.push('      - name: ' + example.Title);
                output.push('        text: |-');
                const line = '               ' + parameters.join(' ');
                if (commandHandler.Command_MethodName === 'show') {
                    showExampleStr = line;
                }
                ToMultiLine(line, output, CodeGenConstants.PYLINT_MAX_CODE_LENGTH, true);
            }
        } while (model.SelectNextMethod());
    }

    output.push('"""');
    return output;
}
