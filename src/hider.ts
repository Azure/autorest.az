import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host } from '@autorest/extension-base';
import { serialize } from '@azure-tools/codegen';
import { isNullOrUndefined } from './utils/helper';
import { CodeGenConstants, AzConfiguration } from './utils/models';

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
            let operations = operationGroup.operations.filter(function cliSplitOperation(
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
            // cli-poly-as-resource-original-operation
            operations = operations.filter(function cliPolyOperation(operation, index, array) {
                if (
                    !isNullOrUndefined(operation.extensions) &&
                    !isNullOrUndefined(
                        operation.extensions['cli-poly-as-resource-original-operation'],
                    )
                ) {
                    const originalOperation =
                        operation.extensions['cli-poly-as-resource-original-operation'];
                    if (isNullOrUndefined(originalOperation.extensions)) {
                        return false;
                    }
                    if (isNullOrUndefined(originalOperation.extensions['cli-operations'])) {
                        originalOperation.extensions['cli-operations'] = [];
                    }
                    originalOperation.extensions['cli-operations'].push(operation);
                    return false;
                }
                return true;
            });
            operationGroup.operations = operations;
        });
    }
}

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new Hider(session);
        const result = await plugin.process();
        host.WriteFile(CodeGenConstants.m4CodeModelName, serialize(result));
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}
