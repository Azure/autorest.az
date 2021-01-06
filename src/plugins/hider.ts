import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host } from '@azure-tools/autorest-extension-base';
import { serialize } from '@azure-tools/codegen';
import { isNullOrUndefined } from '../utils/helper';

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
        this.codeModel.operationGroups.forEach((operationGroup) => {
            const operations = operationGroup.operations.filter(function cliSplitOperation(
                operation,
                index,
                array,
            ) {
                if (
                    !isNullOrUndefined(operation.extensions) &&
                    !isNullOrUndefined(
                        operation.extensions['cli-split-operation-original-operation'],
                    )
                ) {
                    const originalOperation =
                        operation.extensions['cli-split-operation-original-operation'];
                    if (isNullOrUndefined(originalOperation.extensions)) {
                        return false;
                    }
                    if (
                        isNullOrUndefined(originalOperation.extensions['cli-splitted-operations'])
                    ) {
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
    const debug = (await host.GetValue('debug')) || false;

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
