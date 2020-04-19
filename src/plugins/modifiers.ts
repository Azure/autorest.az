import {
    CodeModel,
    codeModelSchema,
    ObjectSchema,
    SchemaType,
    Property,
    OperationGroup,
    Operation
} from "@azure-tools/codemodel";
import {
    Session,
    startSession,
    Host,
    Channel
} from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
import { isNullOrUndefined } from "util";
import { ToCamelCase } from "../utils/helper";

let directives: Array<any> = [];

interface WhereCommandDirective {
    select?: string;
    where: {
        "group": string;
        "group-description": string;
        "command"?: string;
        "command-description"?: string;
        "parameter-name"?: string;
        "parameter-description"?: string;
    };
    set?: {
        "group": string;
        "group-description": string;
        "command"?: string;
        "command-description"?: string;
        "parameter-name"?: string;
        "parameter-description"?: string;
        "split"?: string;
        default?: {
            name: string;
            description: string;
        };
    };
}

function getFilterError(
    whereObject: any,
    prohibitedFilters: Array<string>,
    selectionType: string
): string {
    let error = "";
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
    selectionType: string
): string {
    let error = "";
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
    if (where && (where["command"] || where['parameter-name'] || where['group'])) {
        const prohibitedFilters = [
            "model-name",
            "property-name",
            "enum-name",
            "enum-value-name"
        ];
        let error = getFilterError(where, prohibitedFilters, "command");

        if (set !== undefined) {
            const prohibitedSetters = [
                "property-name",
                "property-description",
                "model-name",
                "enum-name",
                "enum-value-name"
            ];
            error += getSetError(set, prohibitedSetters, "command");
        }

        if (error) {
            throw Error(
                `Incorrect Directive: ${JSON.stringify(it, null, 2)}. Reason: ${error}.`
            );
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

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        directives = await this.session.getValue('directive');
        if (directives != null) {
            for (const directive of directives.filter(each => !each.transform)) {
                const getPatternToMatch = (selector: string | undefined): RegExp | undefined => {
                    return selector? !hasSpecialChars(selector)? new RegExp(`^${selector}$`, "gi"): new RegExp(selector, "gi"): undefined;
                };
                if (isWhereCommandDirective(directive)) {
                    const selectType = directive.select;
                    const groupRegex = getPatternToMatch(directive.where["group"]);
                    const parameterRegex = getPatternToMatch(directive.where["parameter-name"]);
                    const commandRegex = getPatternToMatch(directive.where["command"]);
                    const parameterReplacer = directive.set !== undefined? directive.set["parameter-name"]: undefined;
                    const paramDescriptionReplacer = directive.set !== undefined? directive.set["parameter-description"]: undefined;
                    const commandReplacer = directive.set !== undefined ? directive.set["command"] : undefined;
                    const commandDescriptionReplacer = directive.set !== undefined? directive.set["command-description"]: undefined;
                    const groupReplacer = directive.set !== undefined ? directive.set["group"] : undefined;
                    const groupSplitter: any = directive.set !== undefined ? directive.set["split"] : undefined;
                    const groupDescriptionReplacer = directive.set !== undefined? directive.set["group-description"]: undefined;

                    for (const operationGroup of values(this.codeModel.operationGroups)) {
                        if (!isNullOrUndefined(operationGroup.language['az']['command']) && operationGroup.language['az']['command'].match(groupRegex)) {

                            if (groupSplitter) {
                                let name = ToCamelCase(groupSplitter['group'].split(' ').pop());
                                // splitting operation
                                let splittedOperationGroup = new OperationGroup(name, operationGroup);
                                splittedOperationGroup['$key'] = name;
                                //splittedOperationGroup.language['az'] = {};
                                splittedOperationGroup.language['az'] = {}
                                splittedOperationGroup.language['az']['name'] = operationGroup.language['az']['name'];
                                splittedOperationGroup.language['az']['description'] = operationGroup.language['az']['description'];
                                splittedOperationGroup.language['az']['command'] = groupSplitter['group'];
                                // split operations
                                splittedOperationGroup.operations = [];

                                let oldGroupOperations: Operation[] = [];
                                // do actual splitting
                                for (const operation of values(operationGroup.operations)) {
                                    groupSplitter['commands'].forEach(op => {
                                        const opRegex = getPatternToMatch(op);
                                        if (operation.language['az']['command'].match(opRegex)) {
                                            splittedOperationGroup.operations.push(operation);
                                        } else {
                                            oldGroupOperations.push(operation);
                                        }
                                    });
                                }

                                operationGroup.operations = oldGroupOperations;
                                this.codeModel.operationGroups.push(splittedOperationGroup);

                                for (const operation of values(splittedOperationGroup.operations)) {
                                    operation.language['az']['command'] = splittedOperationGroup.language['az']['command'] + " " + operation.language['az']['name'];
                                }
                            }
                        }
                    }

                    for (const operationGroup of values(this.codeModel.operationGroups)) {
                        //operationGroup
                        let groupChanged = false;
                        if (!isNullOrUndefined(operationGroup.language['az']['command']) && operationGroup.language['az']['command'].match(groupRegex)) {
                            operationGroup.language['az']['command'] = groupReplacer? groupRegex? operationGroup.language['az']['command'].replace(groupRegex, groupReplacer): groupReplacer: operationGroup.language['az']['command'];
                            operationGroup.language['az']['description'] = groupDescriptionReplacer? groupDescriptionReplacer: operationGroup.language['az']['description'];
                        }

                        for (const operation of values(operationGroup.operations)) {
                            //operation
                            if (groupChanged) {
                                operation.language['az']['command'] = operationGroup.language['az']['command'] + " " + operation.language['az']['name'];
                            }
                            if (operation.language['az']['command'] != undefined && operation.language["az"]["command"].match(commandRegex)) {
                                operation.language["az"]["command"] = commandReplacer? commandRegex? operation.language["az"]["command"].replace(commandRegex, commandReplacer): commandReplacer: operation.language["az"]["command"];
                                operation.language["az"]["description"] = commandDescriptionReplacer? commandDescriptionReplacer: operation.language["az"]["description"];
                                groupChanged = true;
                            }
                            for (const parameter of values(operation.parameters)) {
                                if (parameter.language['az']['name'] != undefined && parameter.language["az"]["name"].match(parameterRegex)) {
                                    parameter.language["az"]["name"] = parameterReplacer? parameterRegex? parameter.language["az"]["name"].replace(parameterRegex, parameterReplacer): parameterReplacer: parameter.language["az"]["name"];
                                    parameter.language['az']['mapsto'] = parameter.language['az']['name'].replace(/-/g, '_');
                                    parameter.language["az"]["description"] = paramDescriptionReplacer? paramDescriptionReplacer: parameter.language["az"]["description"];
                                }
                            }
                            for(const request of values(operation.requests)) {
                                for (const parameter of values(request.parameters)) {
                                    if (parameter.language['az']['name'] != undefined && parameter.language["az"]["name"].match(parameterRegex)) {
                                        parameter.language["az"]["name"] = parameterReplacer? parameterRegex? parameter.language["az"]["name"].replace(parameterRegex, parameterReplacer): parameterReplacer: parameter.language["az"]["name"];
                                        parameter.language['az']['mapsto'] = parameter.language['az']['name'].replace(/-/g, '_');
                                        parameter.language["az"]["description"] = paramDescriptionReplacer? paramDescriptionReplacer: parameter.language["az"]["description"];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // add NameMapsTo after modifier and if generic update exists, set the setter_arg_name
        this.codeModel.operationGroups.forEach(operationGroup => {
            let operations = operationGroup.operations;
            operations.forEach(operation => {
                let listCnt = 0;
                let param = null;
                operation.parameters.forEach(parameter => {
                    if(!isNullOrUndefined(parameter.language['az'])) {
                        if(operation.language['az'].name.endsWith("create") && parameter['flattened'] != true) {
                            let paramType = parameter.schema.type;
                            if(paramType == SchemaType.Any || paramType == SchemaType.Array || paramType == SchemaType.Object || paramType == SchemaType.Dictionary) {
                                param = parameter;
                                listCnt++;
                            }
                        }
                    }
                });
                operation.requests.forEach(request => {
                    if(request.parameters) {
                        request.parameters.forEach(parameter => {
                            if(!isNullOrUndefined(parameter.language['az'])) {
                                if(operation.language['az'].name.endsWith("create") && parameter['flattened'] != true) {
                                    let paramType = parameter.schema.type;
                                    if(paramType == SchemaType.Any || paramType == SchemaType.Array || paramType == SchemaType.Object || paramType == SchemaType.Dictionary) {
                                        param = parameter;
                                        listCnt++;
                                    }
                                }
                            }
                        });                        
                    }
                });
                if(operation.language['az'].name.endsWith("create") && listCnt == 1) {
                    operation['genericSetterParam'] = param;
                }
            });
        });
        return this.codeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = (await host.GetValue("debug")) || false;

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new Modifiers(session);
        const result = await plugin.process();
        host.WriteFile("modifiers-temp-output.yaml", serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }
}
