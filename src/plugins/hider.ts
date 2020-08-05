import { CodeModel, codeModelSchema, Language, Parameter } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
import { changeCamelToDash } from '../utils/helper';
import { isNullOrUndefined } from "util";

export class Hider {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        this.mergeOperation();
        return this.codeModel;
    }

    mergeOperation() {
        this.codeModel.operationGroups.forEach(operationGroup => {
            let operations = operationGroup.operations.filter(function cliSplitOperation(operation, index, array) {
                if (!isNullOrUndefined(operation.extensions) && !isNullOrUndefined(operation.extensions['cli-split-operation-original-operation'])) {
                    let originalOperation = operation.extensions['cli-split-operation-original-operation'];
                    if(isNullOrUndefined(originalOperation.extensions)) {
                        return false;
                    }
                    if(isNullOrUndefined(originalOperation.extensions['cli-splitted-operations'])) {
                        originalOperation.extensions['cli-splitted-operations'] = [];
                    }
                    originalOperation.extensions['cli-splitted-operations'].push(operation);
                    return false;
                }
                return true;
            });
            operationGroup.operations = operations;
        });
    }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    
    //host.Message({Channel:Channel.Warning, Text:"in aznamer processRequest"});

    //console.error(extensionName);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new Hider(session);
        const result = await plugin.process();
        host.WriteFile('code-model-v4-no-tags.yaml', serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}