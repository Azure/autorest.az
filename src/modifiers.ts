import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';
import { serialize } from '@azure-tools/codegen';
import { values } from '@azure-tools/linq';
import { isNullOrUndefined } from './utils/helper';
import { CodeGenConstants, AzConfiguration } from './utils/models';

let directives: Array<any> = [];

interface WhereCommandDirective {
    select?: string;
    where: {
        group: string;
        'group-description': string;
        command?: string;
        'command-description'?: string;
        'parameter-name'?: string;
        'parameter-description'?: string;
    };
    set?: {
        group: string;
        'group-description': string;
        command?: string;
        'command-description'?: string;
        'parameter-name'?: string;
        'parameter-description'?: string;
        default?: {
            name: string;
            description: string;
        };
    };
}

function getFilterError(whereObject: any, prohibitedFilters: Array<string>): string {
    let error = '';
    for (const each of values(prohibitedFilters)) {
        if (whereObject[each] !== undefined) {
            error += `Can't filter by ${each} when selecting command. `;
        }
    }

    return error;
}

function getSetError(
    setObject: any,
    prohibitedSetters: Array<string>,
    selectionType: string,
): string {
    let error = '';
    for (const each of values(prohibitedSetters)) {
        if (setObject[each] !== undefined) {
            error += `Can't set ${each} when a ${selectionType} is selected. `;
        }
    }

    return error;
}

function isWhereCommandDirective(it: any): it is WhereCommandDirective {
    const directive = it;
    const where = directive.where;
    const set = directive.set;
    if (where && (where.command || where['parameter-name'] || where.group)) {
        const prohibitedFilters = ['model-name', 'property-name', 'enum-name', 'enum-value-name'];
        let error = getFilterError(where, prohibitedFilters);

        if (set !== undefined) {
            const prohibitedSetters = [
                'property-name',
                'property-description',
                'model-name',
                'enum-name',
                'enum-value-name',
            ];
            error += getSetError(set, prohibitedSetters, 'command');
        }

        if (error) {
            throw Error(`Incorrect Directive: ${JSON.stringify(it, null, 2)}. Reason: ${error}.`);
        }

        return true;
    }

    return false;
}

function hasSpecialChars(str: string): boolean {
    return !/^[a-zA-Z0-9]+$/.test(str);
}

export class Modifiers {
    codeModel: CodeModel;
    allCommandGroups: string[];

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
        this.getAllCommandGroup();
    }

    getAllCommandGroup() {
        this.allCommandGroups = [];
        for (const group of values(this.codeModel.operationGroups)) {
            this.allCommandGroups.push(group.language['az'].command);
        }
    }

    async process() {
        directives = AzConfiguration.getValue(CodeGenConstants.directive);
        const options = AzConfiguration.getValue(CodeGenConstants.az);
        if (!isNullOrUndefined(directives)) {
            for (const directive of directives.filter((each) => !each.transform)) {
                const getPatternToMatch = (selector: string | undefined): RegExp | undefined => {
                    return selector
                        ? !hasSpecialChars(selector)
                            ? new RegExp(`^${selector}$`, 'gi')
                            : new RegExp(selector, 'gi')
                        : undefined;
                };
                if (isWhereCommandDirective(directive)) {
                    const groupRegex = getPatternToMatch(directive.where.group);
                    const parameterRegex = getPatternToMatch(directive.where['parameter-name']);
                    const commandRegex = getPatternToMatch(directive.where.command);
                    const parameterReplacer =
                        directive.set !== undefined ? directive.set['parameter-name'] : undefined;
                    const paramDescriptionReplacer =
                        directive.set !== undefined
                            ? directive.set['parameter-description']
                            : undefined;
                    const commandReplacer =
                        directive.set !== undefined ? directive.set.command : undefined;
                    const commandDescriptionReplacer =
                        directive.set !== undefined
                            ? directive.set['command-description']
                            : undefined;
                    const groupReplacer =
                        directive.set !== undefined ? directive.set.group : undefined;
                    const groupDescriptionReplacer =
                        directive.set !== undefined
                            ? directive.set['group-description']
                            : undefined;
                    for (const operationGroup of values(this.codeModel.operationGroups)) {
                        // operationGroup
                        let groupChanged = false;
                        if (
                            !isNullOrUndefined(operationGroup.language['az']['command']) &&
                            operationGroup.language['az'].command.match(groupRegex)
                        ) {
                            const index = this.allCommandGroups.indexOf(
                                operationGroup.language['az'].command,
                            );
                            if (index > -1) {
                                this.allCommandGroups.splice(index, 1);
                            }
                            operationGroup.language['az'].command = groupReplacer
                                ? groupRegex
                                    ? operationGroup.language['az'].command.replace(
                                          groupRegex,
                                          groupReplacer,
                                      )
                                    : groupReplacer
                                : operationGroup.language['az'].command;
                            this.allCommandGroups.push(operationGroup.language['az'].command);
                            operationGroup.language['az'].description =
                                groupDescriptionReplacer ||
                                operationGroup.language['az'].description;
                            groupChanged = true;
                        }
                        let opIndex = -1;
                        for (const operation of values(operationGroup.operations)) {
                            opIndex++;
                            // operation
                            if (groupChanged) {
                                operation.language['az'].command =
                                    operationGroup.language['az'].command +
                                    ' ' +
                                    operation.language['az'].name;
                            }
                            if (
                                operation.language['az'].command !== undefined &&
                                operation.language['az'].command.match(commandRegex)
                            ) {
                                if (
                                    !isNullOrUndefined(commandRegex) &&
                                    !isNullOrUndefined(commandReplacer)
                                ) {
                                    const oldCommand = operation.language['az'].command;
                                    const oldCommandArr = oldCommand.split(' ');
                                    const newCommand = operation.language['az'].command.replace(
                                        commandRegex,
                                        commandReplacer,
                                    );
                                    const newCommandArr = newCommand.split(' ');
                                    const oriName = operation.language['az'].name;
                                    operation.language['az'].name =
                                        newCommandArr[newCommandArr.length - 1];
                                    if (oldCommandArr[0] !== newCommandArr[0]) {
                                        this.session.message({
                                            Channel: Channel.Warning,
                                            Text:
                                                'Trying to change the extension-name of a single command is not allowed!\n if you want to change the whole extension-name you can change the configuration in readme.az.md \n',
                                        });
                                        continue;
                                    }
                                    const newAzName =
                                        newCommandArr.length > 2
                                            ? newCommandArr.slice(2, newCommandArr.length).join(' ')
                                            : newCommandArr.last;
                                    this.session.message({
                                        Channel: Channel.Warning,
                                        Text: ' newAzName:' + newAzName,
                                    });
                                    newCommandArr.pop();
                                    const newGroup =
                                        newCommandArr.length >= 2
                                            ? newCommandArr[0] + ' ' + newCommandArr[1]
                                            : newCommandArr.join(' ');

                                    oldCommandArr.pop();
                                    const oldGroup =
                                        oldCommandArr.length >= 2
                                            ? oldCommandArr[0] + ' ' + oldCommandArr[1]
                                            : oldCommandArr.join(' ');
                                    if (oldGroup !== newGroup) {
                                        // if there's only one command in the operationGroup it's okay to change the group name
                                        if (operationGroup.operations.length === 1) {
                                            operationGroup.language['az'].command = newGroup;
                                            const oldIndex = this.allCommandGroups.indexOf(
                                                oldGroup,
                                            );
                                            if (oldIndex > -1) {
                                                this.allCommandGroups.splice(oldIndex, 1);
                                            }
                                            this.allCommandGroups.push(newGroup);
                                        } else {
                                            // else if the new group is already exists then we can move the operation into that operationGroup
                                            const newIndex = this.allCommandGroups.indexOf(
                                                newGroup,
                                            );
                                            if (newIndex > -1) {
                                                operation.language['az'].command = newCommand;
                                                operation.language['az'].description =
                                                    commandDescriptionReplacer ||
                                                    operation.language['az'].description;
                                                this.codeModel.operationGroups[
                                                    newIndex
                                                ].operations.push(operation);
                                                operationGroup.operations.splice(opIndex, 1);
                                            } else {
                                                // otherwise it's not allowed to change the group name in command directive.
                                                // but before that we should change operation az name back.
                                                this.session.message({
                                                    Channel: Channel.Warning,
                                                    Text:
                                                        'Trying to change the group-name of a command in a group with other commands exists is not allowed!\nYou can move the command to an pre-existing command group. \nYou can use the group directive to change the group-name.\n',
                                                });
                                                operation.language['az'].name = oriName;
                                            }
                                            continue;
                                        }
                                    }
                                    operation.language['az'].command = newCommand;
                                    if (newCommandArr.length > 2) {
                                        operation.language['az'].name = newAzName;
                                        operation.language[
                                            'az'
                                        ].subCommandGroup = newCommandArr.join(' ');
                                    }
                                }
                                operation.language['az'].description =
                                    commandDescriptionReplacer ||
                                    operation.language['az'].description;
                            }

                            for (const parameter of values(operation.parameters)) {
                                if (
                                    parameter.language['az'].name !== undefined &&
                                    parameter.language['az'].name.match(parameterRegex)
                                ) {
                                    parameter.language['az'].name = parameterReplacer
                                        ? parameterRegex
                                            ? parameter.language['az'].name.replace(
                                                  parameterRegex,
                                                  parameterReplacer,
                                              )
                                            : parameterReplacer
                                        : parameter.language['az'].name;
                                    parameter.language['az'].mapsto = parameter.language[
                                        'az'
                                    ].name.replace(/-/g, '_');
                                    parameter.language['az'].description =
                                        paramDescriptionReplacer ||
                                        parameter.language['az'].description;
                                }
                            }

                            for (const request of values(operation.requests)) {
                                for (const parameter of values(request.parameters)) {
                                    if (
                                        parameter.language['az'].name !== undefined &&
                                        parameter.language['az'].name.match(parameterRegex)
                                    ) {
                                        parameter.language['az'].name = parameterReplacer
                                            ? parameterRegex
                                                ? parameter.language['az'].name.replace(
                                                      parameterRegex,
                                                      parameterReplacer,
                                                  )
                                                : parameterReplacer
                                            : parameter.language['az'].name;
                                        parameter.language['az'].mapsto = parameter.language[
                                            'az'
                                        ].name.replace(/-/g, '_');
                                        parameter.language['az'].description =
                                            paramDescriptionReplacer ||
                                            parameter.language['az'].description;
                                    }
                                }
                            }
                        }

                        if (
                            operationGroup.language['az'].command === options['extensions'] &&
                            !isNullOrUndefined(operationGroup.language['cli'].extensionMode) &&
                            operationGroup.language['cli'].extensionMode !==
                                this.codeModel.info['extensionMode']
                        ) {
                            this.codeModel.info['extensionMode'] =
                                operationGroup.language['cli'].extensionMode;
                        }
                    }
                }
            }
        }
        return this.codeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new Modifiers(session);
        const result = await plugin.process();
        host.WriteFile('modifiers-temp-output.yaml', serialize(result));
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}
