import { CodeModel, codeModelSchema, OperationGroup } from '@azure-tools/codemodel';
import { Session, startSession, Host } from '@autorest/extension-base';
import { serialize } from '@azure-tools/codegen';
import { CodeGenConstants, AzConfiguration } from './utils/models';

const batchCodeModels = [];
export class MultiapiMerger {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        let mergedCodeModel = this.codeModel;
        if (batchCodeModels.length === 0) {
            batchCodeModels.push(this.codeModel);
        } else if (batchCodeModels.length === 1) {
            mergedCodeModel = this.mergeMultiApiCodeModel(batchCodeModels[0], this.codeModel);
            batchCodeModels.pop();
            batchCodeModels.push(mergedCodeModel);
        }
        return this.codeModel;
    }

    mergeMultiApiCodeModel(codeModel1: CodeModel, codeModel2: CodeModel): CodeModel {
        const mergedCodeModel = codeModel2;
        mergedCodeModel.operationGroups = this.processOperationGroup(
            codeModel1.operationGroups,
            codeModel2.operationGroups,
        );
        return codeModel2;
    }

    processOperationGroup(og1: OperationGroup[], og2: OperationGroup[]): OperationGroup[] {
        return og1.concat(og2);
    }
}

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new MultiapiMerger(session);
        const result = await plugin.process();
        host.WriteFile(CodeGenConstants.m4CodeModelName, serialize(result));
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}
