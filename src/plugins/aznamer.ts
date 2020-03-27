import { CodeModel, codeModelSchema, Language } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
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
            // for list scenarios like kusto, if there's list, listbyresourcegroup, listsku, listskubyresource
            // we should divide it into two groups 
            // group list contains list and listbyresourcegroup
            // group listsku contains listsku and listskubyresource
            // a temporary way is to treat the part after 'by' as parameter distinguish part and the part before by as command.
            let idx = operationNameOri.indexOf("By");
            // the split is valid only the By is not first word and the letter before By is capital and the letter after By is lowercase 
            let isValid = true;
            if(idx == 0 || (idx > 0 && operationNameOri[idx - 1] == operationNameOri[idx - 1].toUpperCase())) {
                isValid = false;
            }
            if(idx + 2  < operationNameOri.length && operationNameOri[idx + 2] == operationNameOri[idx + 2].toLowerCase()) {
                isValid = false;
            }
            if(idx > -1 && isValid) {
                return changeCamelToDash(operationNameOri.substr(0, idx));
            } else {
                return changeCamelToDash(operationNameOri);
            }
        } else if(operationName.startsWith("delete") && httpProtocol == "delete") {
            return "delete";
        }
        return changeCamelToDash(operationNameOri);
    }

    async process() {
        await this.processOperationGroup();
        this.getAzName(this.codeModel);
        this.processGlobalParam();
        this.processSchemas();
        return this.codeModel;
    }


    getAzName(obj) {
        if(obj.language['az']) {
            return;
        }
        obj.language['az'] = new Language();
        obj.language['az']['name'] = obj.language['cli']? obj.language['cli']['name']: obj.language['python']['name'];
        obj.language['az']['name'] = changeCamelToDash(obj.language['az']['name']);
        obj.language['az']['description'] = obj.language['cli']? obj.language['cli']['description']: obj.language['python']['description'];;
    } 

    processGlobalParam() {
        for(let para of values(this.codeModel.globalParameters)) {
            this.getAzName(para);
        }
    }

    processSchemas() {
        let schemas = this.codeModel.schemas;

        for (let obj of values(schemas.objects)) {
            this.getAzName(obj);
            for (let property of values(obj.properties)) {
                this.getAzName(property);
            }
        }

        for(let dict of values(schemas.dictionaries)) {
            this.getAzName(dict);
            this.getAzName(dict.elementType);
        }

        for(let enumn of values(schemas.choices)) {
            this.getAzName(enumn);
            for(let item of values(enumn.choices)) {
                this.getAzName(item);
            }
        }

        for(let enumn of values(schemas.sealedChoices)) {
            this.getAzName(enumn);
            for(let item of values(enumn.choices)) {
                this.getAzName(item);
            }
        }

        for(let arr of values(schemas.arrays)) {
            this.getAzName(arr);
            this.getAzName(arr.elementType);
        }

        for(let cons of values(schemas.constants)) {
            this.getAzName(cons);
        }

        for(let num of values(schemas.numbers)) {
            this.getAzName(num);
        }

        for(let str of values(schemas.strings)) {
            this.getAzName(str);
        }
    }

    async processOperationGroup() {

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
                operationGroup.language['az'] = new Language();
                operationGroup.language['az']['name'] = operationGroup.language['cli']['name'];
                operationGroup.language['az']['description'] = operationGroup.language['cli']['description'];
                operationGroupName = extensionName + " " + changeCamelToDash(operationGroup.language['az']['name'])
                operationGroup.language['az']['command'] = operationGroupName;
            }

            let operations = operationGroup.operations;
            var hasUpdate = false;
            var operationIndex = -1;
            operations.map(operation => {
                operation.parameters.forEach(parameter => {
                    if(parameter.language['cli'] != undefined) {
                        this.getAzName(parameter);
                    }
                });
                operation.requests.forEach(request => {
                    let operationName = "";
                    if(operation.language['cli'] != undefined) {
                        operation.language['az'] = new Language();
                        operation.language['az']['name'] = this.methodMap(operation.language['cli']['name'], request.protocol.http.method);
                        operation.language['az']['description'] = operation.language['cli']['description'];
                        operationName = operationGroupName + " " +  changeCamelToDash(operation.language['az']['name']);
                        operation.language['az']['command'] = operationName;
                    } else {
                        this.session.message({Channel:Channel.Warning, Text: "OperationGroup " + operationGroup.language.default.name + " operation " + operation.language.default.name + " doesn't have cli"});
                    }
                    if(request.parameters) {
                        request.parameters.forEach(parameter => {
                            if(parameter.language['cli'] != undefined) {
                                this.getAzName(parameter);
                            }
                        });                        
                    }
                });
                
                if(operation.language['cli']['name'].toLowerCase() == "createorupdate") {
                    operationIndex = operations.indexOf(operation);
                }
                if(operation.language['cli']['name'].toLowerCase() == "update") {
                    hasUpdate = true;
                }
            });
            if(!hasUpdate && operationIndex != -1) {
                operations[operationIndex]['canSplitOperation'] = true;
            }
        });
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