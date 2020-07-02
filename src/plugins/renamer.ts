import { CodeModel, codeModelSchema, Language, Parameter } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";

export class Renamer {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        return this.codeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new Renamer(session);
        const result = await plugin.process();
        host.WriteFile('code-model-cli-v4.yaml', serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}