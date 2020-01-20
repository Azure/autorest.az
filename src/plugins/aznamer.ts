import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';
import { serialize, deserialize } from '@azure-tools/codegen';
import { values, items, length, Dictionary } from '@azure-tools/linq';
import { changeCamelToDash } from '../utils/helper';

export class AzNamer {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }


    async process() {

        let azSettings = await this.session.getValue('az');
        let extensionName = azSettings['extensions'];
        //console.error(extensionName);
        for (const operationGroup of values(this.codeModel.operationGroups)) {
            //this.session.message({Channel:Channel.Warning, Text:serialize(operationGroup.language)});
            let operationGroupName = "";
            if(operationGroup.language['cli'] != undefined) {
                operationGroup.language['az'] = {};
                operationGroup.language['az']['name'] = operationGroup.language['cli']['name'];
                operationGroup.language['az']['description'] = operationGroup.language['cli']['description'];
                operationGroupName = extensionName + " " + changeCamelToDash(operationGroup.language['az']['name'])
                operationGroup.language['az']['command'] = operationGroupName;
            }

            for (const operation of values(operationGroup.operations)) {
                let operationName = "";
                if(operation.language['cli'] != undefined) {
                    operation.language['az'] = {};
                    operation.language['az']['name'] = operation.language['cli']['name'];
                    operation.language['az']['description'] = operation.language['cli']['description'];
                    operationName = operationGroupName + " " +  changeCamelToDash(operation.language['az']['name']);
                    operation.language['az']['command'] = operationName;
                }
                for (const parameter of values(operation.request.parameters)) {
                    if(parameter.language['cli'] != undefined) {
                        parameter.language['az'] = {};
                        parameter.language['az']['name'] = parameter.language['cli']['name'];
                        parameter.language['az']['description'] = parameter.language['cli']['description'];
                        parameter.language['az']['name'] = changeCamelToDash(parameter.language['az']['name']);
                    }
                }
            }
        }
        return this.codeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    host.Message({Channel:Channel.Warning, Text:"in aznamer processRequest"});

    //console.error(extensionName);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = await new AzNamer(session);
        const result = await plugin.process();
        host.WriteFile('aznamer-temp-output.yaml', serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}