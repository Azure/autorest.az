import {
    CodeModel,
    codeModelSchema,
    Operation,
    OperationGroup,
    Parameter,
} from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@autorest/extension-base';
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

const getPatternToMatch = (selector: string | undefined): RegExp | undefined => {
    return selector
        ? !hasSpecialChars(selector)
            ? new RegExp(`^${selector}$`, 'gi')
            : new RegExp(selector, 'gi')
        : undefined;
};

export class Modifiers {
    codeModel: CodeModel;
    allCommandGroups: Record<string, number[]>;
    groupChanged: boolean;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
        this.initAllCommandGroup();
        this.groupChanged = false;
    }

    initAllCommandGroup(): void {
        this.allCommandGroups = {};
        let groupIdx = 0;
        this.codeModel.operationGroups.forEach((operationGroup) => {
            if (isNullOrUndefined(this.allCommandGroups[operationGroup.language['az'].command])) {
                this.allCommandGroups[operationGroup.language['az'].command] = [];
            }
            this.allCommandGroups[operationGroup.language['az'].command].push(groupIdx);
            groupIdx++;
        });
    }

    modifyParam(parameter: Parameter, directive: any): void {
        const parameterRegex = getPatternToMatch(directive.where['parameter-name']);
        const parameterReplacer =
            directive.set !== undefined ? directive.set['parameter-name'] : undefined;
        const paramDescriptionReplacer =
            directive.set !== undefined ? directive.set['parameter-description'] : undefined;
        if (
            !isNullOrUndefined(parameter.language['az'].name) &&
            !isNullOrUndefined(parameterRegex) &&
            parameter.language['az'].name.match(parameterRegex)
        ) {
            parameter.language['az'].name = parameterReplacer
                ? parameterRegex
                    ? parameter.language['az'].name.replace(parameterRegex, parameterReplacer)
                    : parameterReplacer
                : parameter.language['az'].name;
            parameter.language['az'].mapsto = parameter.language['az'].name.replace(/-/g, '_');
            parameter.language['az'].description =
                paramDescriptionReplacer || parameter.language['az'].description;
        }
    }

    modifyOperationGroup(operationGroup: OperationGroup, directive: any, groupIdx: number): void {
        const groupRegex = getPatternToMatch(directive.where.group);
        const groupReplacer = directive.set !== undefined ? directive.set.group : undefined;
        const groupDescriptionReplacer =
            directive.set !== undefined ? directive.set['group-description'] : undefined;
        if (
            !isNullOrUndefined(operationGroup.language['az']['command']) &&
            !isNullOrUndefined(groupRegex) &&
            operationGroup.language['az'].command.match(groupRegex)
        ) {
            const preIndexs = this.allCommandGroups[operationGroup.language['az'].command];
            if (
                Object.prototype.hasOwnProperty.call(
                    this.allCommandGroups,
                    operationGroup.language['az'].command,
                )
            ) {
                delete this.allCommandGroups[operationGroup.language['az'].command];
            }
            operationGroup.language['az'].command = groupReplacer
                ? groupRegex
                    ? operationGroup.language['az'].command.replace(groupRegex, groupReplacer)
                    : groupReplacer
                : operationGroup.language['az'].command;
            this.allCommandGroups[operationGroup.language['az'].command] = preIndexs;
            operationGroup.language['az'].description =
                groupDescriptionReplacer || operationGroup.language['az'].description;
            this.groupChanged = true;
        }
    }

    modifyOperation(
        operationGroup: OperationGroup,
        operation: Operation,
        directive: any,
        opIndex: number,
        groupIdx: number,
    ): void {
        const commandRegex = getPatternToMatch(directive.where.command);
        const commandReplacer = directive.set !== undefined ? directive.set.command : undefined;
        const commandDescriptionReplacer =
            directive.set !== undefined ? directive.set['command-description'] : undefined;
        if (this.groupChanged) {
            operation.language['az'].command =
                operationGroup.language['az'].command + ' ' + operation.language['az'].name;
        }
        if (
            !isNullOrUndefined(operation.language['az'].command) &&
            !isNullOrUndefined(commandRegex) &&
            operation.language['az'].command.match(commandRegex)
        ) {
            operation.language['az'].description =
                commandDescriptionReplacer || operation.language['az'].description;
            if (isNullOrUndefined(commandReplacer)) {
                return;
            }
            const oldCommand = operation.language['az'].command;
            const oldCommandArr = oldCommand.split(' ');
            const newCommand = operation.language['az'].command.replace(
                commandRegex,
                commandReplacer,
            );
            const newCommandArr = newCommand.split(' ');
            oldCommandArr.pop();
            const oldGroup = oldCommandArr.join(' ');
            let commonIdx = newCommandArr.length - 2;
            let newGroup = newCommandArr.slice(0, newCommandArr.length - 1).join(' ');
            const subCommandGroup = newGroup;
            let newAzName = newCommandArr.last;
            while (commonIdx >= 0) {
                const groupName = newCommandArr.slice(0, commonIdx + 1).join(' ');
                const newIndexes = this.allCommandGroups[groupName];
                if (!isNullOrUndefined(newIndexes) && newIndexes.length > 0) {
                    newAzName = newCommandArr.slice(commonIdx + 1, newCommandArr.length).join(' ');
                    newGroup = newCommandArr.slice(0, commonIdx + 1).join(' ');
                    if (newIndexes.indexOf(groupIdx) === -1) {
                        this.codeModel.operationGroups[groupIdx].operations.splice(opIndex, 1);
                        operation.language['az'][
                            'originalOperationGroup'
                        ] = this.codeModel.operationGroups[groupIdx];
                        // all the operation groups in the newIndexes have the same commandGroupName. therefore it doesn't matter when index we put it into.
                        this.codeModel.operationGroups[newIndexes[0]].operations.push(operation);
                    }
                    break;
                } else if (operationGroup.operations.length === 1) {
                    operationGroup.language['az'].command = newGroup;
                    const oldIndexes = this.allCommandGroups[oldGroup];
                    if (!isNullOrUndefined(oldIndexes) && oldIndexes.length === 1) {
                        delete this.allCommandGroups[oldGroup];
                    }
                    this.allCommandGroups[newGroup] = [groupIdx];
                    break;
                }
                commonIdx--;
            }
            if (commonIdx < 0) {
                this.session.message({
                    Channel: Channel.Warning,
                    Text:
                        'Trying to change the extension-name of a single command is not allowed!\n if you want to change the whole extension-name you can change the configuration in readme.az.md \n',
                });
                return;
            }
            operation.language['az'].name = newAzName;
            operation.language['az'].command = newCommand;
            if (
                (newGroup.indexOf(oldGroup, 0) > -1 && newGroup != oldGroup) ||
                newAzName.indexOf(' ') > -1
            ) {
                operation.language['az'].subCommandGroup = subCommandGroup;
            }
            this.session.message({
                Channel: Channel.Warning,
                Text: ' newAzName:' + newAzName,
            });
        }
    }

    async process(): Promise<CodeModel> {
        directives = AzConfiguration.getValue(CodeGenConstants.directive);
        const options = AzConfiguration.getValue(CodeGenConstants.az);
        if (isNullOrUndefined(directives)) {
            return this.codeModel;
        }
        directives
            .filter((each) => !each.transform && isWhereCommandDirective(each))
            .forEach((directive) => {
                let groupIdx = -1;
                this.codeModel.operationGroups.map((operationGroup) => {
                    groupIdx++;
                    // operationGroup
                    this.groupChanged = false;
                    this.modifyOperationGroup(operationGroup, directive, groupIdx);

                    let opIndex = -1;
                    operationGroup.operations.map((operation) => {
                        opIndex++;
                        // operation
                        this.modifyOperation(
                            operationGroup,
                            operation,
                            directive,
                            opIndex,
                            groupIdx,
                        );

                        operation.parameters.map((parameter) => {
                            this.modifyParam(parameter, directive);
                        });

                        operation.requests.map((request) => {
                            request.parameters?.map((parameter) => {
                                this.modifyParam(parameter, directive);
                            });
                        });
                    });

                    if (
                        operationGroup.language['az'].command === options['extensions'] &&
                        !isNullOrUndefined(operationGroup.language['cli'].extensionMode) &&
                        operationGroup.language['cli'].extensionMode !==
                            this.codeModel.info['extensionMode']
                    ) {
                        this.codeModel.info['extensionMode'] =
                            operationGroup.language['cli'].extensionMode;
                    }
                });
            });
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
