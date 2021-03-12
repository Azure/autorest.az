import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host } from '@autorest/extension-base';
import { serialize } from '@azure-tools/codegen';
import { CodeGenConstants, AzConfiguration } from './utils/models';

export class MultiapiMerger {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        return this.codeModel;
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
