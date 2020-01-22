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
 
        let model = new CodeModelCliImpl(session);
        //session.message({Channel:Channel.Warning, Text:"Model operationGroup is " + serialize(session.model.operationGroups)});
        let operationGroup = session.model.operationGroups[0];
        let operations = operationGroup.operations;
        let operation = operations[0];
        //session.message({Channel:Channel.Warning, Text:"Operation Command: " + operation.language['az'].command});
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