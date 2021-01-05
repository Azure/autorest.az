/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import { SchemaType, Parameter } from '@azure-tools/codemodel';
import { HeaderGenerator } from '../../Header';
import { ToMultiLine, isNullOrUndefined } from '../../../../utils/helper';

let showExampleStr: string;
const allSupportWaited = ['create', 'update', 'delete'];

function initVars () {
    showExampleStr = '';
}

export function GenerateAzureCliHelp (model: CodeModelAz, debug: boolean): string[] {
    initVars();
    const header: HeaderGenerator = new HeaderGenerator();
    header.disableTooManyLines = true;
    header.addFromImport('knack.help_files', ['helps']);
    let output: string[] = [];
    output.push('');

    model.GatherInternalResource();
    if (model.SelectFirstCommandGroup()) {
        do {
            // if there's no operation in this command group
            if (!model.SelectFirstCommand()) { continue; }

            output = output.concat(generateCommandGroupHelp(model, '', debug));
            // let methods: string[] = model.CommandGroup_Commands;

            const allSubGroup: Map<string, boolean> = new Map<string, boolean>();
            let hasWait = false;
            const allLongRunCommand = [];
            if (model.SelectFirstCommand()) {
                do {
                    const subCommandGroupName = model.Command_SubGroupName;
                    if (subCommandGroupName !== '' && !allSubGroup.has(subCommandGroupName)) {
                        allSubGroup.set(subCommandGroupName, true);
                        output = output.concat(generateCommandGroupHelp(model, subCommandGroupName, debug));
                    }
                    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        hasWait = true;
                        let waitParam = '';
                        if (allSupportWaited.indexOf(model.Command_MethodName) < 0) {
                            waitParam = 'create';
                        } else {
                            waitParam = model.Command_MethodName;
                        }
                        if (allLongRunCommand.indexOf(waitParam + 'd') < 0) {
                            allLongRunCommand.push(waitParam + 'd');
                        }
                    }
                    const commandOutput: string [] = generateCommandHelp(model, debug);
                    output = output.concat(commandOutput);
                }
                while (model.SelectNextCommand());
                if (hasWait) {
                    output = output.concat(generateWaitCommandHelp(model.CommandGroup_Name, allLongRunCommand));
                }
            }
        } while (model.SelectNextCommandGroup()); 

        output.push('');
    }

    output.forEach(element => {
        if (element.length > 120) header.disableLineTooLong = true;
    });

    return header.getLines().concat(output);
}

function generateWaitCommandHelp (commandGroup, allLongRunCommand) {
    const output = [];
    output.push('');
    output.push("helps['" + commandGroup + " wait'] = \"\"\"");
    output.push('    type: command');
    const summary = '    short-summary: Place the CLI in a waiting state until a condition of the ' + commandGroup + ' is met.';
    ToMultiLine(summary, output, 119, true);
    output.push('    examples:');
    for (const waitParam of allLongRunCommand) {
        const name = '      - name: Pause executing next line of CLI script until the ' + commandGroup + ' is successfully ' + waitParam + '.';
        ToMultiLine(name, output, 119, true);
        if (!isNullOrUndefined(showExampleStr) && showExampleStr !== '') {
            output.push('        text: |-');
            const line = showExampleStr.replace(/ show /g, ' wait ') + ' --' + waitParam;
            ToMultiLine(line, output, 119, true);
        }
    }
    output.push('"""');
    return output;
}

function generateCommandGroupHelp (model: CodeModelAz, subCommandGroupName = '', debug: boolean) {
    const output = [];
    output.push('');
    if (subCommandGroupName !== '') {
        output.push("helps['" + subCommandGroupName + "'] = \"\"\"");
    } else {
        output.push("helps['" + model.CommandGroup_Name + "'] = \"\"\"");
    }
    output.push('    type: group');
    let shortSummary = '    short-summary: ' + model.CommandGroup_Help.trim();
    if (subCommandGroupName !== '') {
        shortSummary = shortSummary + ' sub group ' + subCommandGroupName.split(' ').pop();
    }
    if (debug) {
        if (!shortSummary.trimRight().endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Command group swagger name=' + model.CommandGroup_CliKey;
    }
    ToMultiLine(shortSummary, output, 119, true);

    output.push('"""');
    return output;
}

function addParameterHelp (output: string[], model: CodeModelAz, debug: boolean) {
    let parameterOutput = ['    parameters:'];

    if (model.SelectFirstMethod()) {
        do {
            const originalOperation = model.Method_GetOriginalOperation;
            let baseParam = null;
            if (model.SelectFirstMethodParameter()) {
                do {
                    if (model.MethodParameter_IsFlattened) {
                        continue;
                    }
                    if (model.MethodParameter_Type === SchemaType.Constant || model.MethodParameter['readOnly']) {
                        continue;
                    }
                    const parameterName = model.MethodParameter_MapsTo;
                    if (!isNullOrUndefined(originalOperation) && model.MethodParameter['targetProperty']?.isDiscriminator) {
                        continue;
                    }

                    let parameterAlias: string[] = [];
                    if (!isNullOrUndefined(model.MethodParameter?.language?.['az']?.alias)) {
                        if (!isNullOrUndefined(model.MethodParameter?.language?.['az']?.alias)) {
                            const alias = model.MethodParameter?.language?.['az']?.alias;

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

                    if (model.MethodParameter_IsList && model.MethodParameter_IsListOfSimple && !model.MethodParameter_IsSimpleArray) {
                        if (model.Parameter_IsPolyOfSimple(model.MethodParameter)) {
                            baseParam = model.MethodParameter;
                            continue;
                        }
                        if (model.MethodParameter_IsPositional) {
                            parameterOutput = parameterOutput.concat(getPositionalActionHelp(model, parameterAlias, baseParam, debug));
                        } else if (model.MethodParameter_IsShorthandSyntax) {
                            parameterOutput = parameterOutput.concat(getShorthandSyntaxAction(model, parameterAlias, baseParam, debug));
                        } else {
                            parameterOutput = parameterOutput.concat(getKeyValueActionHelp(model, parameterAlias, baseParam, debug));
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

function getShorthandSyntaxAction (model: CodeModelAz, parameterAlias: string[], baseParam: Parameter, debug: boolean) {
    let parameterOutput: string[] = [];
    const actionOutput: string[] = [];
    ToMultiLine(`      - name: ${parameterAlias.join(' ')}`, actionOutput, 119, true);

    if (debug) {
        let shortSummary = '"';
        if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
            shortSummary += model.MethodParameter_Description.trim().replace(/"/g, '\\\\"');
        }
        if (!shortSummary.endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Swagger name=' + model.MethodParameter_CliKey + '"';
        ToMultiLine(`        short-summary: ${shortSummary}`.replace(/\r?\n|\r/g, ''), actionOutput, 119, true);
    } else {
        if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
            const shortSummary = model.MethodParameter_Description.trim().replace(/"/g, '\\\\"');
            ToMultiLine(`        short-summary: "${shortSummary}"`.replace(/\r?\n|\r/g, ''), actionOutput, 119, true);
        }
    }

    let options: Parameter[] = [];
    if (!isNullOrUndefined(model.Schema_ActionName(model.MethodParameter.schema))) {
        if (baseParam && model.MethodParameter['polyBaseParam'] === baseParam) {
            const keyToMatch = baseParam.schema?.['discriminator']?.property?.language.python?.name;
            const valueToMatch = model.MethodParameter.schema?.['discriminatorValue'];
            options = GetKeyValueActionOptions(model, null, keyToMatch, valueToMatch);
        } else {
            options = GetKeyValueActionOptions(model, null);
        }
    }
    if (options.length > 0) {
        actionOutput.push('        long-summary: |');
        const optionUsage = ' ' + options.map(p => `${model.Parameter_NameAz(p)}=XX`).join(',');
        if (model.MethodParameter_Type === SchemaType.Array) {
            ToMultiLine('            Usage: ' + parameterAlias[0] + optionUsage.repeat(2), actionOutput, 119, true);
        } else {
            ToMultiLine('            Usage: ' + parameterAlias[0] + optionUsage, actionOutput, 119, true);
        }
        actionOutput.push('');
        for (const p of options) {
            const pDesc = model.Parameter_Description(p);
            if (!pDesc || pDesc.trim().length <= 0) continue;
            let line = `            ${model.Parameter_NameAz(p)}: `;
            if (p.required) line += 'Required. ';
            line += model.Parameter_Description(p).trim().replace(/\r?\n|\r/g, '');
            ToMultiLine(line, actionOutput, 119, true);
        }
        if (model.Schema_Type(model.MethodParameter.schema) === SchemaType.Array) {
            actionOutput.push('');
            ToMultiLine(`            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`, actionOutput, 119, true);
        }
        parameterOutput = parameterOutput.concat(actionOutput);
    }
    return parameterOutput;
}

function getPositionalActionHelp (model: CodeModelAz, parameterAlias: string[], baseParam: Parameter, debug: boolean) {
    let parameterOutput: string[] = [];
    const actionOutput: string[] = [];
    ToMultiLine(`      - name: ${parameterAlias.join(' ')}`, actionOutput, 119, true);

    if (debug) {
        let shortSummary = '"';
        if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
            shortSummary += model.MethodParameter_Description.trim().replace(/"/g, '\\\\"');
        }
        if (!shortSummary.endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Swagger name=' + model.MethodParameter_CliKey + '"';
        ToMultiLine(`        short-summary: ${shortSummary}`.replace(/\r?\n|\r/g, ''), actionOutput, 119, true);
    } else {
        if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
            const shortSummary = model.MethodParameter_Description.trim().replace(/"/g, '\\\\"');
            ToMultiLine(`        short-summary: "${shortSummary}"`.replace(/\r?\n|\r/g, ''), actionOutput, 119, true);
        }
    }

    const positionalKeys = model.MethodParameter_PositionalKeys;
    let options: Parameter[] = [];
    if (!isNullOrUndefined(model.Schema_ActionName(model.MethodParameter.schema))) {
        if (baseParam && model.MethodParameter['polyBaseParam'] === baseParam) {
            const keyToMatch = baseParam.schema?.['discriminator']?.property?.language.python?.name;
            const valueToMatch = model.MethodParameter.schema?.['discriminatorValue'];
            options = GetKeyValueActionOptions(model, positionalKeys, keyToMatch, valueToMatch);
        } else {
            options = GetKeyValueActionOptions(model, positionalKeys);
        }
    }
    if (options.length > 0) {
        actionOutput.push('        long-summary: |');
        ToMultiLine(['            The order of this parameter is specific customized. Usage: ', parameterAlias[0]].concat(options.map(p => `${model.Parameter_NameAz(p)}-value`)).join(' '), actionOutput, 119, true);
        actionOutput.push('');
        for (const p of options) {
            const pDesc = model.Parameter_Description(p);
            if (!pDesc || pDesc.trim().length <= 0) continue;
            let line = `            ${model.Parameter_NameAz(p)}: `;
            line += 'Required. ';
            line += model.Parameter_Description(p).trim().replace(/\r?\n|\r/g, '');
            ToMultiLine(line, actionOutput, 119, true);
        }
        if (model.Schema_Type(model.MethodParameter.schema) === SchemaType.Array) {
            actionOutput.push('');
            ToMultiLine(`            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`, actionOutput, 119, true);
        }
        parameterOutput = parameterOutput.concat(actionOutput);
    }
    return parameterOutput;
}

function getKeyValueActionHelp (model: CodeModelAz, parameterAlias: string[], baseParam: Parameter, debug: boolean) {
    let parameterOutput: string[] = [];
    const actionOutput: string[] = [];
    ToMultiLine(`      - name: ${parameterAlias.join(' ')}`, actionOutput, 119, true);

    if (debug) {
        let shortSummary = '"';
        if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
            shortSummary += model.MethodParameter_Description.trim().replace(/"/g, '\\\\"');
        }
        if (!shortSummary.endsWith('.')) {
            shortSummary += '.';
        }
        shortSummary += ' Swagger name=' + model.MethodParameter_CliKey + '"';
        ToMultiLine(`        short-summary: ${shortSummary}`.replace(/\r?\n|\r/g, ''), actionOutput, 119, true);
    } else {
        if (model.MethodParameter_Description && model.MethodParameter_Description.trim().length > 0) {
            const shortSummary = model.MethodParameter_Description.trim().replace(/"/g, '\\\\"');
            ToMultiLine(`        short-summary: "${shortSummary}"`.replace(/\r?\n|\r/g, ''), actionOutput, 119, true);
        }
    }

    let options: Parameter[] = [];
    if (!isNullOrUndefined(model.Schema_ActionName(model.MethodParameter.schema))) {
        if (baseParam && model.MethodParameter['polyBaseParam'] === baseParam) {
            const keyToMatch = baseParam.schema?.['discriminator']?.property?.language.python?.name;
            const valueToMatch = model.MethodParameter.schema?.['discriminatorValue'];
            options = GetKeyValueActionOptions(model, null, keyToMatch, valueToMatch);
        } else {
            options = GetKeyValueActionOptions(model, null);
        }
    }
    if (options.length > 0) {
        actionOutput.push('        long-summary: |');
        ToMultiLine(['            Usage:', parameterAlias[0]].concat(options.map(p => `${model.Parameter_NameAz(p)}=XX`)).join(' '), actionOutput, 119, true);
        actionOutput.push('');
        for (const p of options) {
            const pDesc = model.Parameter_Description(p);
            if (!pDesc || pDesc.trim().length <= 0) continue;
            let line = `            ${model.Parameter_NameAz(p)}: `;
            if (p.required) line += 'Required. ';
            line += model.Parameter_Description(p).trim().replace(/\r?\n|\r/g, '');
            ToMultiLine(line, actionOutput, 119, true);
        }
        if (model.Schema_Type(model.MethodParameter.schema) === SchemaType.Array) {
            actionOutput.push('');
            ToMultiLine(`            Multiple actions can be specified by using more than one ${parameterAlias[0]} argument.`, actionOutput, 119, true);
        }
        parameterOutput = parameterOutput.concat(actionOutput);
    }
    return parameterOutput;
}

function GetKeyValueActionOptions (model: CodeModelAz, positionalKeys: string[], keyToMatch: string = null, valueToMatch: string = null): Parameter[] {
    const options: Parameter[] = [];

    if (!SchemaType.Object || !SchemaType.Array) {
        return options;
    }

    if (model.MethodParameter_IsPositional) {
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
                if (!isNullOrUndefined(keyToMatch) && !isNullOrUndefined(valueToMatch) && model.Parameter_NamePython(model.SubMethodParameter) === keyToMatch) {
                    continue;
                }
                if (model.SubMethodParameter) {
                    if (model.MethodParameter_IsPositional) {
                        if (!isNullOrUndefined(positionalKeys) && Array.isArray(positionalKeys) && positionalKeys.length > 0 && positionalKeys.indexOf(model.Parameter_NamePython(model.SubMethodParameter)) > -1) {
                            options[positionalKeys.indexOf(model.Parameter_NamePython(model.SubMethodParameter))] = model.SubMethodParameter;
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

function generateCommandHelp (model: CodeModelAz, debug = false) {
    // create, delete, list, show, update
    // let method: string = methods[mi];
    // let ctx = model.SelectCommand(method);

    // if (ctx === null)
    //    continue;
    let output: string[] = [];
    output.push('');
    const commandHead = model.Command_Name;
    output.push("helps['" + commandHead + "'] = \"\"\"");
    output.push('    type: command');

    // there will be just one method for create, update, delete, show, etc.
    // there may be a few list methods, so let's just take description from the first one.
    // as we can't use all of them
    let shortSummary = '    short-summary: "';
    let isFirst = true;
    if (model.SelectFirstMethod()) {
        do {
            shortSummary += (isFirst ? '' : ' And ') + model.Method_Help.trim();
            isFirst = false;
            if (debug) {
                shortSummary += ' Command group swagger name=' + model.CommandGroup_CliKey + ', Command swagger name=' + model.Method_CliKey;
            }
        } while (model.SelectNextMethod());
    }
    if (!shortSummary.trimRight().endsWith('.')) {
        shortSummary += '.';
    }
    shortSummary += '"';
    ToMultiLine(shortSummary, output, 119, true);

    output = addParameterHelp(output, model, debug);

    let examplesStarted = false;

    if (model.SelectFirstMethod()) {
        do {
            for (const example of model.GetExamples()) {
                if (!examplesStarted) {
                    output.push('    examples:');
                    examplesStarted = true;
                }

                // output.push ("# " + example_id);
                let parameters: string[] = [];
                parameters = model.GetExampleItems(example, false, undefined);
                output.push('      - name: ' + example.Title);
                output.push('        text: |-');
                const line = '               ' + parameters.join(' ');
                if (model.Command_MethodName === 'show') {
                    showExampleStr = line;
                }
                ToMultiLine(line, output, 119, true);
            }
        } while (model.SelectNextMethod());
    }

    output.push('"""');
    return output;
}
