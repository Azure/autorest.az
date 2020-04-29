import { CodeModel, codeModelSchema, Language } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
import { changeCamelToDash } from '../utils/helper';
import { isNullOrUndefined } from "util";

export class AzNamer {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    public methodMap(operationNameOri: string, httpProtocol: string) {
        let operationName = operationNameOri.toLowerCase();
        httpProtocol = httpProtocol.toLowerCase();
        let subOperationGroupName = "";
        let ons: Array<string> = [];
        if(operationNameOri.indexOf('#') > -1) {
            ons = operationNameOri.split('#');
            if(ons && ons.length == 2) {
                subOperationGroupName = changeCamelToDash(ons[1]);
                operationName = ons[0].toLowerCase();
            }
        }
        if(operationName.startsWith("create") && httpProtocol == "put") {
            return subOperationGroupName == ""? "create": subOperationGroupName + " " + "create";
        } else if(operationName.startsWith("update") && (httpProtocol == "put" || httpProtocol == "patch")) {
            return subOperationGroupName == ""? "update": subOperationGroupName + " " + "update";
        } else if(operationName == "get" && httpProtocol == "get") {
            return subOperationGroupName == ""? "show": subOperationGroupName + " " + "show";
        } else if(operationName.startsWith("list") && httpProtocol == "get") {
            // for list scenarios like kusto, if there's list, listbyresourcegroup, listsku, listskubyresource
            // we should divide it into two groups 
            // group list contains list and listbyresourcegroup
            // group listsku contains listsku and listskubyresource
            // a temporary way is to treat the part after 'by' as parameter distinguish part and the part before by as command.
            // the split is valid only the By is not first word and the letter before By is capital and the letter after By is lowercase 
            const regex = /^(?<list>List[a-zA-Z0-9]*)(?<by>By[A-Z].*)$/;
            let groups = operationNameOri.match(regex);
            let list = "list";
            if(groups && groups.length > 2) {
                list = changeCamelToDash(groups[1]);
            } else {
                list = changeCamelToDash(operationNameOri);
            }
            return subOperationGroupName == ""? list: subOperationGroupName + " " + list;
        } else if(operationName.startsWith("delete") && httpProtocol == "delete") {
            return subOperationGroupName == ""? "delete": subOperationGroupName + " " + "delete";
        }
        if(subOperationGroupName != "") {
            return subOperationGroupName + " " + changeCamelToDash(ons[0]);
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
        obj.language['az']['mapsto'] = obj.language['az']['name'].replace(/-/g, '_');
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
        let azExtensionFolder = "";
        try {
            azExtensionFolder = await this.session.getValue('azure-cli-extension-folder');
        } catch(e) {
            this.session.message({Channel: Channel.Fatal, Text:"--azure-cli-extension-folder is not provided in the command line ! \nplease use --azure-cli-extension-folder=your-local-azure-cli-extensions-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example"}); 
            throw e;
        }
        
        
        let azSettings = await this.session.getValue('az');
        let extensionName = azSettings['extensions'];
        //console.error(extensionName);
        if(extensionName == '' || extensionName == undefined) {
            this.session.message({Channel:Channel.Error, Text:"probably missing readme.az.md possible settings are:\naz:\n  extensions: managed-network\n  namespace: azure.mgmt.managednetwork\n  package-name: azure-mgmt-managednetwork\npython-sdk-output-folder: \"$(output-folder)/src/managed-network/azext_managed_network/vendored_sdks/managed-network\"\n"})
        }
        this.codeModel.operationGroups.forEach(operationGroup => {
            let operationGroupName = "";
            if(!isNullOrUndefined(operationGroup.language['cli'])) {
                operationGroup.language['az'] = new Language();
                operationGroup.language['az']['name'] = operationGroup.language['cli']['name'];
                operationGroup.language['az']['description'] = operationGroup.language['cli']['description'];
                operationGroupName = extensionName + " " + changeCamelToDash(operationGroup.language['az']['name'])
                operationGroup.language['az']['command'] = operationGroupName;
            }

            let operations = operationGroup.operations;
            var hasUpdate = false;
            var operationIndex = -1;
            operations.forEach(operation => {
                operation.parameters.forEach(parameter => {
                    if(!isNullOrUndefined(parameter.language['cli'])) {
                        this.getAzName(parameter);
                    }
                });
                operation.requests.forEach(request => {
                    let operationName = "";
                    if(operation.language['cli'] != undefined) {
                        operation.language['az'] = new Language();
                        let commandName = this.methodMap(operation.language['cli']['name'], request.protocol.http.method);
                        operation.language['az']['name'] = commandName;
                        operation.language['az']['description'] = operation.language['cli']['description'];
                        operationName = operationGroupName + " " +  changeCamelToDash(operation.language['az']['name']);
                        operation.language['az']['command'] = operationName;
                        if(commandName.indexOf(" ") > -1) {
                            operation.language['az']['subCommandGroup'] = operationGroupName + " " + commandName.split(' ')[0];
                        }
                        if(operation.language['cli']['name'].toLowerCase() == "createorupdate" || operation.language['cli']['name'].toLowerCase().startsWith("createorupdate#")) {
                            operation['canSplitOperation'] = true;
                        }
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
                
                
                if(operation.language['cli']['name'].toLowerCase() == "update") {
                    hasUpdate = true;
                }
            });
            if(hasUpdate) {
                operationGroup.language['az']['hasUpdate'] = hasUpdate;
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