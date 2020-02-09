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

    public methodMap(operationNameOri: string, httpProtocol: string) {
        let operationName = operationNameOri.toLowerCase();
        httpProtocol = httpProtocol.toLowerCase();

        if(operationName.startsWith("create") && httpProtocol == "put") {
            return "create";
        } else if(operationName.startsWith("update") && (httpProtocol == "put" || httpProtocol == "patch")) {
            return "update";
        } else if(operationName.startsWith("get") && httpProtocol == "get") {
            return "show";
        } else if(operationName.startsWith("list") && httpProtocol == "get") {
            return "list";
        } else if(operationName.startsWith("delete") && httpProtocol == "delete") {
            return "delete";
        }
        return operationNameOri;
    }

    async process() {

        let azSettings = await this.session.getValue('az');
        let extensionName = azSettings['extensions'];
        //console.error(extensionName);
        if(extensionName == '' || extensionName == undefined) {
            this.session.message({Channel:Channel.Error, Text:"probably missing readme.az.md possible settings are:\naz:\n  extensions: managed-network\n  namespace: azure.mgmt.managednetwork\n  package-name: azure-mgmt-managednetwork\npython-sdk-output-folder: \"$(output-folder)/src/managed-network/azext_managed_network/vendored_sdks/managed-network\"\n"})
        }
        this.codeModel.operationGroups.map(operationGroup => {
            let index = this.codeModel.operationGroups.indexOf(operationGroup);
            let operationGroupName = "";
            if(operationGroup.language['cli'] != undefined) {
                operationGroup.language['az'] = {};
                operationGroup.language['az']['name'] = operationGroup.language['cli']['name'];
                operationGroup.language['az']['description'] = operationGroup.language['cli']['description'];
                operationGroupName = extensionName + " " + changeCamelToDash(operationGroup.language['az']['name'])
                operationGroup.language['az']['command'] = operationGroupName;
            }

            let operations = operationGroup.operations;
            var updateOperation = null;
            operations.map(operation => {
                let operationName = "";
                if(operation.language['cli'] != undefined) {
                    operation.language['az'] = {};
                    operation.language['az']['name'] = this.methodMap(operation.language['cli']['name'], operation.request.protocol.http.method);
                    operation.language['az']['description'] = operation.language['cli']['description'];
                    operationName = operationGroupName + " " +  changeCamelToDash(operation.language['az']['name']);
                    operation.language['az']['command'] = operationName;
                }
                operation.request.parameters.forEach(parameter => {
                    if(parameter.language['cli'] != undefined) {
                        parameter.language['az'] = {};
                        parameter.language['az']['name'] = parameter.language['cli']['name'];
                        parameter.language['az']['description'] = parameter.language['cli']['description'];
                        parameter.language['az']['name'] = changeCamelToDash(parameter.language['az']['name']);
                    }
                });
                /*if(operation.language['cli']['name'].toLowerCase() == "createorupdate") {
                    updateOperation = operation;
                    updateOperation.language['az'] = {}
                    updateOperation.language['az']['name'] = this.methodMap("Update", updateOperation.request.protocol.http.method);
                    updateOperation.language['az']['description'] = updateOperation.language['cli']['description'];
                    operationName = operationGroupName + " " +  changeCamelToDash(updateOperation.language['az']['name']);
                    updateOperation.language['az']['command'] = operationName;
                    updateOperation.request.parameters.forEach(parameter => {
                        if(parameter.language['cli'] != undefined) {
                            parameter.language['az'] = {};
                            parameter.language['az']['name'] = parameter.language['cli']['name'];
                            parameter.language['az']['description'] = parameter.language['cli']['description'];
                            parameter.language['az']['name'] = changeCamelToDash(parameter.language['az']['name']);
                        }
                    });
                    //this.session.message({Channel: Channel.Warning, Text: "operations number before " + operations.length});                   
                    //operations.push(updateOperation);
                    //this.session.message({Channel: Channel.Warning, Text: "operations number after " + operations.length});
                }*/
            });
            //if(updateOperation != null) {
            //    operations.push(updateOperation);
            //}
            //this.session.message({Channel: Channel.Warning, Text: "operations number outside " + operations.length});
            //operationGroup.operations = operations;
            //this.session.message({Channel: Channel.Warning, Text: "operationGroup.operations number outside " + operationGroup.operations.length});
            //this.codeModel.operationGroups[index] = operationGroup;
        });
        return this.codeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    //host.Message({Channel:Channel.Warning, Text:"in aznamer processRequest"});

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