import { CodeModel, codeModelSchema, Language, Parameter, SchemaType } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
import { isNullOrUndefined } from "util";
import { az } from "..";
import { exception } from "console";
import { findNodeInCodeModel } from "../utils/helper";

export class Merger {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        this.mergeOperation();
        return this.codeModel;
    }

    mergeOperation() {
        this.codeModel.operationGroups.forEach(operationGroup => {
            let operations = operationGroup.operations;
            operationGroup.operations.forEach(operation => {
                if (!isNullOrUndefined(operation.extensions) && !isNullOrUndefined(operation.extensions['cli-split-operation-original-operation'])) {
                    let nameIndexMap: Map<string, number> = new Map<string, number>();
                    let index = 0;
                    operation.extensions['cli-split-operation-original-operation'].parameters.forEach(param => {
                        nameIndexMap.set(param.language['cli']['name'], index);
                        index++;
                    });
                    let nameIndexMapRequest: Map<string, number> = new Map<string, number>();
                    let indexRequest = 0;
                    if(!isNullOrUndefined(operation.extensions['cli-split-operation-original-operation'].requests?.[0]?.parameters)) {
                        operation.extensions['cli-split-operation-original-operation'].requests[0].parameters.forEach(rparam => {
                            nameIndexMapRequest.set(rparam.language['cli']['name'], indexRequest);
                            indexRequest++;
                        })
                        
                    }
                    operation.parameters.forEach(subParam => {
                        let idx = nameIndexMap.get(subParam.language['cli']['name']);
                        if (idx > -1) {
                            if(isNullOrUndefined(operation.extensions['cli-split-operation-original-operation'].parameters[idx]['subParams'])) {
                                operation.extensions['cli-split-operation-original-operation'].parameters[idx]['subParams'] = {};
                            }
                            operation.extensions['cli-split-operation-original-operation'].parameters[idx]['subParams'][operation.language['cli']['name']] = subParam.language['cli']['name'];
                            subParam['nameBaseParam'] = operation.extensions['cli-split-operation-original-operation'].parameters[idx];
                        }
                    });
                    if (!isNullOrUndefined(operation?.requests?.[0]?.parameters)) {
                        operation.requests[0].parameters.forEach(subParam => {
                            let idx = nameIndexMapRequest.get(subParam.language['cli']['name']);
                            if(idx > -1) {
                                if(isNullOrUndefined(operation.extensions['cli-split-operation-original-operation']?.requests?.[0]?.parameters[idx]['subParams'])) {
                                    operation.extensions['cli-split-operation-original-operation'].requests[0].parameters[idx]['subParams'] = {};
                                }
                                operation.extensions['cli-split-operation-original-operation'].requests[0].parameters[idx]['subParams'][operation.language['cli']['name']] = subParam.language['cli']['name'];
                                subParam['nameBaseParam'] = operation.extensions['cli-split-operation-original-operation'].requests[0].parameters[idx];
                            }
                        });
                    }
                }
                if (!isNullOrUndefined(operation.extensions) && !isNullOrUndefined(operation.extensions['cli-operations']) && !operation.language['cli']['cli-operation-splitted']) {
                    let nameIndexMap: Map<string, number> = new Map<string, number>();
                    let index = 0;
                    operation.parameters.forEach(param => {
                        nameIndexMap.set(param.language['cli']['name'], index);
                        index++;
                    });
                    let nameIndexMapRequest: Map<string, number> = new Map<string, number>();
                    let indexRequest = 0;
                    if(!isNullOrUndefined(operation.requests?.[0]?.parameters)) {
                        operation.requests[0].parameters.forEach(rparam => {
                            nameIndexMapRequest.set(rparam.language['cli']['name'], indexRequest);
                            indexRequest++;
                        })
                        
                    }
                    operation.extensions['cli-operations'].forEach(subOperation => {
                        subOperation.parameters.forEach(subParam => {
                            let idx = nameIndexMap.get(subParam.language['cli']['name']);
                            if (idx > -1) {
                                if(isNullOrUndefined(operation.parameters[idx]['subParams'])) {
                                    operation.parameters[idx]['subParams'] = {};
                                }
                                operation.parameters[idx]['subParams'][subOperation.language['cli']['name']] = subParam.language['cli']['name'];
                                subParam['nameBaseParam'] = operation.parameters[idx];
                            }
                        });
                        if (!isNullOrUndefined(subOperation?.requests?.[0]?.parameters)) {
                            subOperation.requests[0].parameters.forEach(subParam => {
                                let idx = nameIndexMapRequest.get(subParam.language['cli']['name']);
                                if(idx > -1) {
                                    if(isNullOrUndefined(operation?.requests?.[0]?.parameters[idx]['subParams'])) {
                                        operation.requests[0].parameters[idx]['subParams'] = {};
                                    }
                                    operation.requests[0].parameters[idx]['subParams'][subOperation.language['cli']['name']] = subParam.language['cli']['name'];
                                    subParam['nameBaseParam'] = operation.requests[0].parameters[idx];
                                }
                            });
                        }
                        
                    });
                    operations = operations.concat(operation.extensions['cli-operations']);
                }
            });
            operationGroup.operations = operations;
        });
    }
}


export class CodeModelMerger {


    constructor(public cliCodeModel: CodeModel, public pythonCodeModel: CodeModel) {
    }

    async process() {
        return this.mergeCodeModel();
    }

    mergeCodeModel(): CodeModel {
        this.processOperationGroup();
        this.processGlobalParam();
        this.processSchemas();
        let azCodeModel = this.cliCodeModel; 
        return azCodeModel;
    }

    setPythonName(param) {
        let cliM4Path = param?.['language']?.['cli']?.['cliM4Path'];
        if (isNullOrUndefined(cliM4Path)) {
            return;
        }
        let cliNode = findNodeInCodeModel(cliM4Path, this.cliCodeModel);
        if (!isNullOrUndefined(cliNode) && !isNullOrUndefined(cliNode.language) && isNullOrUndefined(cliNode.language['python'])) {
            cliNode.language['python'] = param.language['python'];
        } else if(isNullOrUndefined(cliNode)) {
            let flattenedNodes = findNodeInCodeModel(cliM4Path, this.cliCodeModel, true);
            if(!isNullOrUndefined(flattenedNodes) && flattenedNodes.length > 0) {
                for(let fnode of flattenedNodes) {
                    if(!isNullOrUndefined(fnode) && !isNullOrUndefined(fnode.language)) {
                        for(let prop of values(param.schema.properties)) {
                            if(!isNullOrUndefined(fnode.language?.['cli']?.['cliKey']) && fnode.language?.['cli']?.['cliKey'] == prop['language']?.['cli']?.['cliKey']) {
                                fnode.language['python'] = prop['language']['python'];
                                break;
                            }
                        }
                        if(isNullOrUndefined(fnode.language['python'])) {
                            fnode.language['python'] = {}
                        }
                        fnode.language['python']['flattenedFrom'] = param;
                    }
                }
            }
        } 
    }

    processGlobalParam() {
        for(let para of values(this.pythonCodeModel.globalParameters)) {
            this.setPythonName(para);
        }
    }

    processSchemas() {
        let schemas = this.pythonCodeModel.schemas;

        for (let obj of values(schemas.objects)) {
            this.setPythonName(obj);
            for (let property of values(obj.properties)) {
                this.setPythonName(property);
            }
        }

        for(let dict of values(schemas.dictionaries)) {
            this.setPythonName(dict);
            this.setPythonName(dict.elementType);
        }

        for(let enumn of values(schemas.choices)) {
            this.setPythonName(enumn);
            for(let item of values(enumn.choices)) {
                this.setPythonName(item);
            }
        }

        for(let enumn of values(schemas.sealedChoices)) {
            this.setPythonName(enumn);
            for(let item of values(enumn.choices)) {
                this.setPythonName(item);
            }
        }

        for(let arr of values(schemas.arrays)) {
            this.setPythonName(arr);
            this.setPythonName(arr.elementType);
        }

        for(let cons of values(schemas.constants)) {
            this.setPythonName(cons);
        }

        for(let num of values(schemas.numbers)) {
            this.setPythonName(num);
        }

        for(let str of values(schemas.strings)) {
            this.setPythonName(str);
        }
    }

    processOperationGroup() {
        this.pythonCodeModel.operationGroups.forEach(operationGroup => {
            if(!isNullOrUndefined(operationGroup.language['cli'])) {
                this.setPythonName(operationGroup);
            }

            let operations = operationGroup.operations;
            operations.forEach(operation => {
                if(!isNullOrUndefined(operation.language['cli'])) {
                    this.setPythonName(operation);
                }
                operation.parameters.forEach(parameter => {
                    if(!isNullOrUndefined(parameter.language['cli'])) {
                        this.setPythonName(parameter);
                    }
                });
                operation.requests.forEach(request => {
                    if(!isNullOrUndefined(request?.parameters)) {
                        request.parameters.forEach(parameter => {
                            if (!isNullOrUndefined(parameter.language['cli'])) {
                                this.setPythonName(parameter);
                            }
                        });                   
                    }
                });
            });
        });
    }
}


export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    const cliCore = await host.GetValue('cli-core') || false;          
    let azExtensionFolder = "";
    let azCoreFolder = "";
    let isSdkNeeded = true;
    let isTrack1 = false;

    let extensionMode = "experimental";
    
    try {
        extensionMode = await host.GetValue('extension-mode');
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        if (cliCore) {
            isSdkNeeded = await host.GetValue('need-sdk');
            if(isNullOrUndefined(isSdkNeeded)) {
                isSdkNeeded = false;
            }
            isTrack1 = await host.GetValue('track1');
            if(!isNullOrUndefined(isTrack1)) {
                isTrack1 = true;
            }
            let cliCodeModel = deserialize<CodeModel>(await host.ReadFile("code-model-cli-v4.yaml"), 'code-model-cli-v4.yaml', codeModelSchema);
            let pythonCodeModel = deserialize<CodeModel>(await host.ReadFile("code-model-v4-no-tags.yaml"), 'code-model-v4-no-tags.yaml', codeModelSchema);
            const codeModelMerger = new CodeModelMerger(cliCodeModel, pythonCodeModel);
            const azCodeModel = await codeModelMerger.process();
            azCodeModel.language['az'] = {}
            azCodeModel.language['az']['isCliCore'] = true;
            azCodeModel.language['az']['sdkNeeded'] = isSdkNeeded;
            azCodeModel.language['az']['sdkTrack1'] = isTrack1;
            session.model = azCodeModel;
        } else {
            host.Message({Channel: Channel.Information, Text:"Generating CLI extension!"});
        }
        if (isNullOrUndefined(cliCore) || cliCore == false) {
            azExtensionFolder = await host.GetValue('azure-cli-extension-folder');
        } else {
            azCoreFolder = await host.GetValue('azure-cli-folder');
        }
        if ((isNullOrUndefined(cliCore) || cliCore == false) && isNullOrUndefined(azExtensionFolder)) {
            host.Message({Channel: Channel.Fatal, Text:"--azure-cli-extension-folder is not provided in the command line ! \nplease use --azure-cli-extension-folder=your-local-azure-cli-extensions-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example"}); 
            throw new Error("Wrong configuration, please check!");
        } else if(cliCore && isNullOrUndefined(azCoreFolder)){
            host.Message({Channel: Channel.Fatal, Text:"--azure-cli-folder is not provided in the command line and you are using --cli-core to generate cli-core modules ! \nplease use --azure-cli-folder=your-local-azure-cli-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example"});  
            throw new Error("Wrong configuration, please check!");
        }
        session.model.info['extensionMode'] = extensionMode;
        const plugin = new Merger(session);
        const result = await plugin.process();
        host.WriteFile('azmerger-cli-temp-output-after.yaml', serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}