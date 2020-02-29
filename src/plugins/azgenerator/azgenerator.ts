import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';
import { serialize, deserialize } from '@azure-tools/codegen';
import { GenerateAll } from "./Generator";
import { CodeModelCliImpl } from "./CodeModelAzImpl";


export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    //host.Message({Channel:Channel.Warning, Text:"in azgenerator processRequest"});
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema); 
        let az_common = {};
        try {
            az_common = await session.getValue("az_common");
        }
        catch(E) {
            if (debug) {
                console.info(`${__filename} - No az_common configured. ${E.stack}`);
            }
        }
        let model = new CodeModelCliImpl(session, az_common);
        let files: any = await GenerateAll(model, true);

        for (let f in files) {
            host.WriteFile(f, files[f].join('\r\n'));
        }
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}