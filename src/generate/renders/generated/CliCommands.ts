/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../Header';
import {
    ToMultiLine,
    getExtraModeInfo,
    composeParamString,
    isNullOrUndefined,
    ToPythonString,
} from '../../../utils/helper';
import { TemplateBase } from '../TemplateBase';
import {
    AzConfiguration,
    CodeGenConstants,
    CodeModelTypes,
    PathConstants,
    RenderInput,
    SortOrder,
} from '../../../utils/models';
import * as path from 'path';

let showCommandFunctionName: string;
let useResourceType: boolean;

function initVars() {
    showCommandFunctionName = undefined;
    useResourceType = false;
}

export class CliCommands extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = path.join(
            model.AzextFolder,
            PathConstants.generatedFolder,
            PathConstants.commandsFile,
        );
        this.tmplPath = path.join(PathConstants.templateRootFolder, 'generated/commands.py.njx');
    }

    public getDataFromModel(data: any) {
        data['imports'].push([
            CodeGenConstants.DEFAULT_CLI_CORE_LIB + '.commands',
            ['CliCommandType'],
        ]);
        const extraProperties = ['maxApi', 'minApi', 'resourceType', 'mode'];
        const commandGroupConverter = (item) => {
            item['propertiesString'] = {};
            extraProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    if (prop !== 'mode') {
                        item['propertiesString'][prop] = ToPythonString(
                            item[prop],
                            typeof item[prop],
                        );
                    } else {
                        item['propertiesString'][prop] = item[prop];
                    }
                    if (prop === 'resourceType' && !isNullOrUndefined(item[prop])) {
                        data['imports'].push(['azure.cli.core.profiles', ['ResourceType']]);
                    }
                    if (
                        !isNullOrUndefined(item['operationTmplName']) &&
                        item['operationTmplName'].length >
                            CodeGenConstants.PYLINT_MAX_OPERATION_TEMPLATE_LENGTH
                    ) {
                        data['pylints'].push('# pylint: disable=line-too-long');
                    }
                }
            });
            return item;
        };

        const commandConverter = (item) => {
            item['propertiesString'] = {};
            extraProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    if (prop !== 'mode') {
                        item['propertiesString'][prop] = ToPythonString(
                            item[prop],
                            typeof item[prop],
                        );
                    } else {
                        item['propertiesString'][prop] = item[prop];
                    }
                    if (prop === 'resourceType' && !isNullOrUndefined(item[prop])) {
                        data['imports'].push(['azure.cli.core.profiles', ['ResourceType']]);
                    }
                }
            });
            if (item['isLongRun']) {
                item['propertiesString']['suppose_no_wait'] = 'True';
            }
            if (item['methodName'] === 'delete') {
                item['propertiesString']['confirmation'] = 'True';
            }
            if (item['needGeneric'] && !isNullOrUndefined(item['genericSetterArgName'])) {
                item['propertiesString']['custom_func_name'] = ToPythonString(
                    item['functionName'],
                    typeof item['functionName'],
                );
                const setterName = item['genericSetterArgName'];
                if (setterName && setterName !== '' && setterName !== 'parameters') {
                    item['propertiesString']['setter_arg_name'] = ToPythonString(
                        setterName,
                        typeof setterName,
                    );
                }
                if (item['isLongRun'] && !AzConfiguration.getValue(CodeGenConstants.sdkTrack1)) {
                    item['propertiesString']['setter_name'] = 'begin_create_or_update';
                }
            }
            return item;
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            [
                'extension',
                new RenderInput(['name', 'parent', 'mode', 'nameUnderscored'], {
                    name: SortOrder.ASEC,
                }),
            ],
            [
                'commandGroup',
                new RenderInput(
                    [
                        'name',
                        'clientFactoryName',
                        'customCommandTypeName',
                        'operationTmplName',
                        'maxApi',
                        'minApi',
                        'resourceType',
                        'mode',
                    ],
                    { name: SortOrder.ASEC },
                    [],
                    commandGroupConverter,
                ),
            ],
            [
                'command',
                new RenderInput(
                    [
                        'methodName',
                        'type',
                        'mode',
                        'maxApi',
                        'minApi',
                        'resourceType',
                        'isLongRun',
                        'functionName',
                        'needGeneric',
                        'genericSetterArgName',
                    ],
                    {},
                    [],
                    commandConverter,
                ),
            ],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        data = this.model.getModelData('extension', inputProperties, dependencies);
        data['azextFolder'] = this.model.AzextFolder;
        return data;
    }

    public async GetRenderData(): Promise<Record<string, unknown>> {
        const data = { data: { imports: [], pylints: [] } };
        const modelData = this.getDataFromModel(data.data);
        data.data = modelData;
        return data;
    }

    public async fullGeneration(): Promise<string[]> {
        return this.render();
    }

    public async incrementalGeneration(): Promise<string[]> {
        return this.render();
    }
}

export function GenerateAzureCliCommands(model: CodeModelAz): string[] {
    initVars();
    const header: HeaderGenerator = new HeaderGenerator();

    // this can't be currently reproduced
    header.disableTooManyStatements = true;
    header.disableTooManyLocals = true;
    header.addFromImport(model.CliCoreLib + '.commands', ['CliCommandType']);

    let output: string[] = [];
    output.push('');
    output.push('');
    output.push('def load_command_table(self, _):');
    let extensionHasMode = false;
    let extensionName = model.Extension_Name;
    if (!isNullOrUndefined(model.Extension_Parent)) {
        extensionName = model.Extension_Parent.trim() + ' ' + extensionName.trim();
    }
    if (model.SelectFirstCommandGroup()) {
        do {
            // if there's no operation in this command group, just continue

            if (model.SelectFirstCommand()) {
                output.push('');

                const cfName: string =
                    'cf_' +
                    (model.GetModuleOperationName() !== ''
                        ? model.GetModuleOperationName()
                        : model.Extension_NameUnderscored);
                if (model.SDK_NeedSDK) {
                    output.push(
                        '    from ' +
                            model.AzextFolder +
                            '.generated._client_factory import ' +
                            cfName,
                    );
                } else {
                    output.push('    from ..generated._client_factory import ' + cfName);
                }

                output.push(
                    '    ' +
                        model.Extension_NameUnderscored +
                        '_' +
                        model.GetModuleOperationName() +
                        ' = CliCommandType(',
                );
                ToMultiLine(
                    "        operations_tmpl='" +
                        model.GetPythonNamespace() +
                        '.operations._' +
                        model.GetModuleOperationNamePython() +
                        '_operations#' +
                        model.GetModuleOperationNamePythonUpper() +
                        ".{}',",
                    output,
                );

                output.push('        client_factory=' + cfName + ')');
                const groupName = model.CommandGroup_Name;
                let extraInfo = '';
                if (groupName.startsWith(extensionName + ' ')) {
                    extraInfo = getExtraModeInfo(model.CommandGroup_Mode, model.Extension_Mode);
                } else if (model.CommandGroup_Name === extensionName) {
                    extensionHasMode = true;
                    extraInfo = getExtraModeInfo(model.CommandGroup_Mode, '');
                }
                if (extraInfo !== '') {
                    extraInfo = ', ' + extraInfo;
                }
                let commandGroupOutput =
                    "    with self.command_group('" +
                    model.CommandGroup_Name +
                    "', " +
                    model.Extension_NameUnderscored +
                    '_' +
                    model.GetModuleOperationName() +
                    ', client_factory=' +
                    cfName +
                    extraInfo;
                const paramRet = composeParamString(
                    model.CommandGroup_MaxApi,
                    model.CommandGroup_MinApi,
                    model.CommandGroup_ResourceType,
                );
                commandGroupOutput += paramRet[0];
                if (paramRet[1]) useResourceType = true;
                commandGroupOutput += ') as g:';
                ToMultiLine(commandGroupOutput, output);
                let needWait = false;
                do {
                    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
                        needWait = true;
                    }
                    output = output.concat(getCommandBody(model));
                } while (model.SelectNextCommand());
                if (needWait) {
                    if (showCommandFunctionName) {
                        output.push(
                            "        g.custom_wait_command('wait', '" +
                                showCommandFunctionName +
                                "')",
                        );
                    } else {
                        output.push("        g.custom_wait_command('wait')");
                    }
                }
            }
        } while (model.SelectNextCommandGroup());
    }
    output.push('');
    const modeInfo = getExtraModeInfo(model.Extension_Mode, '');
    if (!extensionHasMode && modeInfo !== '') {
        output.push("    with self.command_group('" + extensionName + "', " + modeInfo + '):');
        output.push('        pass');
        output.push('');
    }

    output.forEach((element) => {
        if (element.length > CodeGenConstants.PYLINT_MAX_CODE_LENGTH + 1) {
            header.disableLineTooLong = true;
        }
    });

    if (output.length + header.getLines().length > 1000) {
        header.disableTooManyLines = true;
    }
    if (useResourceType) {
        header.addFromImport('azure.cli.core.profiles', ['ResourceType']);
    }

    return header.getLines().concat(output);
}

function getCommandBody(model: CodeModelAz) {
    let commandExtraInfo = '';
    const output: string[] = [];
    const functionName = model.Command_FunctionName;
    const methodName = model.Command_MethodName;
    let endStr = '';
    if (model.Command_IsLongRun && model.CommandGroup_HasShowCommand) {
        endStr += ', supports_no_wait=True';
    }
    if (methodName === 'delete') {
        endStr += ', confirmation=True';
    }
    commandExtraInfo = getExtraModeInfo(model.Command_Mode, model.CommandGroup_Mode);
    if (commandExtraInfo !== '') {
        commandExtraInfo = ', ' + commandExtraInfo;
    }
    if (methodName !== 'show') {
        if (model.Command_NeedGeneric) {
            let argument = '';
            let geneParam = null;
            if (model.SelectFirstMethod()) {
                geneParam = model.Method_GenericSetterParameter(model.Method_GetOriginalOperation);
                if (!isNullOrUndefined(geneParam)) {
                    argument = model.Parameter_NamePython(geneParam);
                }
                let genericUpdate = "        g.generic_update_command('" + model.Command_MethodName;
                if (argument && argument !== '' && argument !== 'parameters') {
                    genericUpdate += "', setter_arg_name='" + argument;
                }
                if (model.Command_IsLongRun && !model.SDK_IsTrack1) {
                    genericUpdate += "', setter_name='begin_create_or_update";
                }
                genericUpdate += "'";
                const paramRet = composeParamString(
                    model.Method_MaxApi,
                    model.Method_MinApi,
                    model.Method_ResourceType,
                );
                genericUpdate += paramRet[0];
                if (paramRet[1]) useResourceType = true;
                genericUpdate +=
                    ", custom_func_name='" + functionName + "'" + endStr + commandExtraInfo + ')';
                ToMultiLine(genericUpdate, output);
            }
        } else {
            let customCommand =
                "        g.custom_command('" +
                methodName +
                "', '" +
                functionName +
                "'" +
                endStr +
                commandExtraInfo;
            const paramRet = composeParamString(
                model.Command_MaxApi,
                model.Command_MinApi,
                model.Command_ResourceType,
            );
            customCommand += paramRet[0];
            if (paramRet[1]) useResourceType = true;
            customCommand += ')';
            ToMultiLine(customCommand, output);
        }
    } else {
        showCommandFunctionName = functionName;
        let customCommand =
            "        g.custom_show_command('" +
            methodName +
            "', '" +
            functionName +
            "'" +
            endStr +
            commandExtraInfo;
        const paramRet = composeParamString(
            model.Command_MaxApi,
            model.Command_MinApi,
            model.Command_ResourceType,
        );
        customCommand += paramRet[0];
        if (paramRet[1]) useResourceType = true;
        customCommand += ')';
        ToMultiLine(customCommand, output);
    }
    return output;
}
