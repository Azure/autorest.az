import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';
import { serialize, deserialize } from '@azure-tools/codegen';

class AzGenerator {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }


    async process() {

        //let azSettings = await this.session.getValue('az');
        //let extensionName = azSettings['az-name'];
        //console.error(extensionName);
        this.session.message({Channel:Channel.Debug, Text:"in azgenerator process"});

        return {};
    }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    host.Message({Channel:Channel.Warning, Text:"in azgenerator processRequest"});
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = await new AzGenerator(session);
        const result = await plugin.process();
        host.WriteFile('azgenerator-temp-output', serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}