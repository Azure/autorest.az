import {
    CodeModel,
    codeModelSchema,
    ObjectSchema,
    SchemaType,
    Property
} from "@azure-tools/codemodel";
import {
    Session,
    startSession,
    Host,
    Channel
} from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";

let directives: Array<any> = [];

interface WhereCommandDirective {
    select?: string;
    where: {
        "command"?: string;
        "command-description"?: string;
        "parameter-name"?: string;
        "parameter-description"?: string;
    };
    set?: {
        "command"?: string;
        "command-description"?: string;
        "parameter-name"?: string;
        "parameter-description"?: string;
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
    if (where && (where["command"] || where['parameter-name'])) {
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
        let azSettings = await this.session.getValue('az');
        directives = azSettings['directive'];

        if (directives != null) {
            for (const directive of directives.filter(each => !each.transform)) {
                const getPatternToMatch = (selector: string | undefined): RegExp | undefined => {
                    return selector? !hasSpecialChars(selector)? new RegExp(`^${selector}$`, "gi"): new RegExp(selector, "gi"): undefined;
                };
                if (isWhereCommandDirective(directive)) {
                    const selectType = directive.select;
                    const parameterRegex = getPatternToMatch(directive.where["parameter-name"]);
                    const commandRegex = getPatternToMatch(directive.where["command"]);
                    const parameterReplacer = directive.set !== undefined? directive.set["parameter-name"]: undefined;
                    const paramDescriptionReplacer = directive.set !== undefined? directive.set["parameter-description"]: undefined;
                    const commandReplacer = directive.set !== undefined ? directive.set["command"] : undefined;
                    const commandDescriptionReplacer = directive.set !== undefined? directive.set["command-description"]: undefined;
                    this.session.message({Channel:Channel.Warning, Text:serialize(commandRegex) + " " + serialize(commandReplacer)});
                    for (const operationGroup of values(this.codeModel.operationGroups)) {
                        //operationGroup

                        for (const operation of values(operationGroup.operations)) {
                            //operation
                            if (operation.language['az']['command'] != undefined && operation.language["az"]["command"].match(commandRegex)) {
                                operation.language["az"]["command"] = commandReplacer? commandRegex? operation.language["az"]["command"].replace(commandRegex, commandReplacer): commandReplacer: operation.language["az"]["command"];
                                operation.language["az"]["description"] = commandDescriptionReplacer? commandDescriptionReplacer: operation.language["az"]["description"];
                            }

                            for (const parameter of values(operation.request.parameters)) {
                                if (parameter.language['az']['name'] != undefined && parameter.language["az"]["name"].match(parameterRegex)) {
                                    parameter.language["az"]["name"] = parameterReplacer? parameterRegex? parameter.language["az"]["name"].replace(parameterRegex, parameterReplacer): parameterReplacer: parameter.language["az"]["name"];
                                    parameter.language["az"]["description"] = paramDescriptionReplacer? paramDescriptionReplacer: parameter.language["az"]["description"];
                                }
                            }
                        }
                    }
                }
            }
        }
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
