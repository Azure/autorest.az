import { CodeModel, codeModelSchema, Language, Parameter, SchemaType } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
import { isNullOrUndefined, isArray } from "util";
import { findNodeInCodeModel } from "../utils/helper";
import { ArgumentConstants, ExtensionMode, TargetMode, CompatibleLevel, GenerateSdk } from "./models"
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";

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
        this.cliCodeModel.info['python_title'] = this.pythonCodeModel.info['python_title'];
        this.cliCodeModel.info['pascal_case_title'] = this.pythonCodeModel.info['pascal_case_title'];
        this.processOperationGroup();
        this.processGlobalParam();
        this.processSchemas();
        let azCodeModel = this.cliCodeModel; 
        return azCodeModel;
    }

    setPythonName(param, m4FlattenedFrom: any[] = []) {
        let cliM4Path = param?.['language']?.['cli']?.['cliM4Path'];
        if (isNullOrUndefined(cliM4Path)) {
            return;
        }
        let cliNode = findNodeInCodeModel(cliM4Path, this.cliCodeModel, false, param);
        let foundNode = false;
        if (!isNullOrUndefined(cliNode) && !isNullOrUndefined(cliNode.language) && isNullOrUndefined(cliNode.language['python'])) {
            if (!isNullOrUndefined(cliNode.language['cli']['cliM4Path']) && cliNode.language['cli']['cliM4Path'] == cliM4Path || cliNode.language['cli']['cliFlattenTrace'] == param.language['cli']['cliFlattenTrace']) {
                foundNode = true;
                cliNode.language['python'] = param.language['python'];
                if (param['flattened'] && param.language['cli']?.['cli-m4-flattened']) {
                    cliNode.language['cli']['cli-m4-flattened'] = true;
                    if (!isNullOrUndefined(m4FlattenedFrom)) {
                        cliNode.language['cli']['m4FlattenedFrom'] = m4FlattenedFrom;
                    }
                }
            }
        } 
        if(!foundNode) {
            let flattenedNodes = findNodeInCodeModel(cliM4Path, this.cliCodeModel, true, param);
            if(!isNullOrUndefined(flattenedNodes) && flattenedNodes.length > 0) {
                for(let fnode of flattenedNodes) {
                    if(!isNullOrUndefined(fnode) && !isNullOrUndefined(fnode.language)) {
                        for(let prop of values(param.schema.properties)) {
                            if(!isNullOrUndefined(fnode.language?.['cli']?.['cliKey']) && fnode.language?.['cli']?.['cliKey'] == prop['language']?.['cli']?.['cliKey']) {
                                fnode.language['python'] = prop['language']['python'];
                                fnode.language['cli']['pythonFlattenedFrom'] = param;
                                break;
                            } else if (!isNullOrUndefined(fnode.language?.['cli']?.['cliFlattenTrace'])) {
                                for(let trace of values(fnode.language['cli']['cliFlattenTrace'])) {
                                    if (!isNullOrUndefined(prop['language']?.['cli']?.['cliPath']) && trace == prop['language']['cli']['cliPath']) {
                                        for(let p of prop['schema']?.['properties']) {
                                            if (!isNullOrUndefined(p.language?.['cli']?.['cliKey']) && fnode.language?.['cli']?.['cliKey'] == p.language?.['cli']?.['cliKey']) {
                                                fnode.language['python'] = p['language']['python'];
                                                fnode.language['cli']['pythonFlattenedFrom'] = prop;
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
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

    getLastValidPath(cliPath: string) {
        let cliPaths = cliPath.split("$$");
        let last = cliPaths.last;
        if (last.indexOf('[') > -1) {
            last = last.substring(0, last.indexOf('['));
        } else {
            last = "";
        }
        cliPaths.pop();
        let path = cliPaths.join("$$");
        if (last == "") {
            return path;
        }
        return path + "$$" + last;
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
                let cnt = 0;
                operation.parameters.forEach(parameter => {
                    if(!isNullOrUndefined(parameter.language['cli'])) {
                        let m4FlattenedFrom = [];
                        if (parameter['flattened'] && parameter.language['cli']?.['cli-m4-flattened']) {
                            for(let tmpCnt = cnt + 1; tmpCnt < operation.parameters.length; tmpCnt++) {
                                let tmpParam = operation.parameters[tmpCnt];
                                if (tmpParam['originalParameter'] == parameter) {
                                    if(!isNullOrUndefined(tmpParam?.['language']?.['cli']?.['cliPath'])) {
                                        let cliPath = tmpParam.language['cli']?.['cliPath'];
                                        let cliNode = findNodeInCodeModel(cliPath, this.cliCodeModel);
                                        if (isNullOrUndefined(cliNode)) {
                                            m4FlattenedFrom.push(tmpParam);
                                        } else {
                                            if (isNullOrUndefined(cliNode.language['python'])) { 
                                                cliNode.language['python'] = tmpParam.language['python'];
                                            }
                                        }
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        this.setPythonName(parameter, m4FlattenedFrom);
                    }
                    cnt++;
                });
                operation.requests.forEach(request => {
                    if(!isNullOrUndefined(request?.parameters)) {
                        cnt = 0;
                        request.parameters.forEach(parameter => {
                            if (!isNullOrUndefined(parameter.language['cli'])) {
                                let m4FlattenedFrom = [];
                                if (parameter['flattened'] && parameter.language['cli']?.['cli-m4-flattened']) {
                                    for(let tmpCnt = cnt + 1; tmpCnt < request.parameters.length; tmpCnt++) {
                                        let tmpParam = request.parameters[tmpCnt];
                                        let deepFlatten = false;
                                        if (tmpParam['originalParameter'] == parameter) {
                                            if(!isNullOrUndefined(tmpParam?.['language']?.['cli']?.['cliPath'])) {
                                                let cliPath = tmpParam.language['cli']?.['cliPath'];
                                                let cliNode = findNodeInCodeModel(cliPath, this.cliCodeModel, false, tmpParam);
                                                if (isNullOrUndefined(cliNode)) {
                                                    let lastValidPath = this.getLastValidPath(cliPath);
                                                    if (!isNullOrUndefined(lastValidPath)) {
                                                        let lastValidNode = findNodeInCodeModel(lastValidPath, this.cliCodeModel);
                                                        if (!isNullOrUndefined(lastValidNode) && isArray(lastValidNode)) {
                                                            let cliFlattenTrace = tmpParam.language['cli']['cliFlattenTrace'];
                                                            let cliFlattenTraceStr = cliFlattenTrace.join(";");
                                                            let cnt = -1;
                                                            for(let lnode of lastValidNode) {
                                                                if (!deepFlatten) {
                                                                    cnt++;
                                                                }
                                                                if(!isNullOrUndefined(lnode.language['cli']?.['cliFlattenTrace'])) {
                                                                    let cftstr = lnode.language['cli']?.['cliFlattenTrace'].join(";");
                                                                    if (cftstr.startsWith(cliFlattenTraceStr)) {
                                                                        deepFlatten = true;
                                                                        lnode['originalParameter'] = tmpParam;
                                                                    }
                                                                }
                                                            }
                                                            if(deepFlatten) {
                                                                tmpParam['flattened'] = true;
                                                                tmpParam.language['cli']['cli-flatten'] = true;
                                                                tmpParam.language['cli']['cli-flattened'] = true;
                                                                tmpParam['originalParameter'] = findNodeInCodeModel(parameter.language['cli']['cliM4Path'], this.cliCodeModel, false, parameter);
                                                                lastValidNode.splice(cnt, 0, tmpParam);
                                                                let cliOperation = findNodeInCodeModel(operation.language['cli']['cliM4Path'], this.cliCodeModel, false, operation);
                                                                if(cliOperation.language['cli']['cli-operation-splitted'] && isArray(cliOperation.language['cli']['split-operation-names'])) {
                                                                    for(let tmpName of cliOperation.language['cli']['split-operation-names']) {
                                                                        let subParamPath = parameter.language['cli']['cliM4Path'].replace(cliOperation.language['cli']['cliKey'], cliOperation.language['cli']['cliKey'] + "#" + tmpName);
                                                                        let subParam = findNodeInCodeModel(subParamPath, this.cliCodeModel);
                                                                        let subLastValidPath =  this.getLastValidPath(subParamPath);
                                                                        let subLastValidNode = findNodeInCodeModel(subLastValidPath, this.cliCodeModel);
                                                                        let idx = subLastValidNode.indexOf(subParam);
                                                                        if (idx > -1) {
                                                                            subLastValidNode.splice(idx + 1, 0, tmpParam);
                                                                            subLastValidNode[idx+1]['originalParameter'] = subParam;
                                                                            subLastValidNode[idx+1].language['cli']['moved-from-python'] = true;
                                                                            let subcnt = idx + 2;
                                                                            while(subcnt < subLastValidNode.length) {
                                                                                if(subLastValidNode[subcnt]['originalParameter'] == subParam) {
                                                                                    subLastValidNode[subcnt]['originalParameter'] = tmpParam;
                                                                                } else {
                                                                                    break;
                                                                                }
                                                                                subcnt++;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                if(!isNullOrUndefined(cliOperation.language['cli']['cli-operations'])) {
                                                                    for(let mop of cliOperation.language['cli']['cli-operations']) {
                                                                        let subParamPath = parameter.language['cli']['cliM4Path'].replace(cliOperation.language['cli']['cliKey'], mop.language['cli']['cliKey']);
                                                                        let subParam = findNodeInCodeModel(subParamPath, this.cliCodeModel);
                                                                        let subLastValidPath =  this.getLastValidPath(subParamPath);
                                                                        let subLastValidNode = findNodeInCodeModel(subLastValidPath, this.cliCodeModel);
                                                                        let idx = subLastValidNode.indexOf(subParam);
                                                                        if (idx > -1) {
                                                                            subLastValidNode.splice(idx + 1, 0, tmpParam);
                                                                            subLastValidNode[idx+1]['originalParameter'] = subParam;
                                                                            subLastValidNode[idx+1].language['cli']['moved-from-python'] = true;
                                                                            let subcnt = idx + 2;
                                                                            while(subcnt < subLastValidNode.length) {
                                                                                if(subLastValidNode[subcnt]['originalParameter'] == subParam) {
                                                                                    subLastValidNode[subcnt]['originalParameter'] = tmpParam;
                                                                                } else {
                                                                                    break;
                                                                                }
                                                                                subcnt++;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (!deepFlatten) {
                                                        m4FlattenedFrom.push(tmpParam);
                                                    }
                                                } else {
                                                    if (isNullOrUndefined(cliNode.language['python'])) { 
                                                        cliNode.language['python'] = tmpParam.language['python'];
                                                    }
                                                }
                                            }
                                        } else {
                                            break;
                                        }
                                    }
                                    if (m4FlattenedFrom.length == 0) {
                                        parameter.language['cli']['cli-m4-flattened-skip'] = true;
                                    }
                                }
                                this.setPythonName(parameter, m4FlattenedFrom);
                            }
                            cnt++;
                        });                   
                    }
                });
            });
        });
    }
}


export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    let targetMode = await host.GetValue(ArgumentConstants.targetMode) || TargetMode.Extension;
    const cliCore = targetMode == TargetMode.Core ? true: false;
    let sdkNoFlatten = cliCore? true: false;
    sdkNoFlatten = await host.GetValue(ArgumentConstants.sdkNoFlatten) || sdkNoFlatten;
    if (cliCore && !sdkNoFlatten) {
        host.Message({Channel: Channel.Fatal, Text:"You have specified the --target-mode=core and --sdk-no-flatten=false at the same time. which is not a valid configuration"}); 
        throw new Error("Wrong configuration detected, please check!");
    }
    let azExtensionFolder = "";
    let azCoreFolder = "";
    if (isNullOrUndefined(cliCore) || cliCore == false) {
        azExtensionFolder = await host.GetValue(ArgumentConstants.azureCliExtFolder);
    } else {
        azCoreFolder = await host.GetValue(ArgumentConstants.azureCliFolder);
    }
    if ((isNullOrUndefined(cliCore) || cliCore == false) && isNullOrUndefined(azExtensionFolder)) {
        host.Message({Channel: Channel.Fatal, Text:"--azure-cli-extension-folder is not provided in the command line ! \nplease use --azure-cli-extension-folder=your-local-azure-cli-extensions-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example"}); 
        throw new Error("Wrong configuration, please check!");
    } else if(cliCore && isNullOrUndefined(azCoreFolder)){
        host.Message({Channel: Channel.Fatal, Text:"--azure-cli-folder is not provided in the command line and you are using --target-mode=core to generate azure-cli repo command modules ! \nplease use --azure-cli-folder=your-local-azure-cli-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example"});  
        throw new Error("Wrong configuration, please check!");
    }
    let isSdkNeeded = cliCore? false: true;
    let generateSdk = await host.GetValue(ArgumentConstants.generateSDK);
    isSdkNeeded = isNullOrUndefined(generateSdk)? isSdkNeeded: generateSdk == GenerateSdk.Yes? true: false;
    let compatibleLevel = await host.GetValue(ArgumentConstants.compatibleLevel) || cliCore? CompatibleLevel.Track1: CompatibleLevel.Track2;
    let isTrack1 = compatibleLevel == CompatibleLevel.Track1 ? true: false;

    let extensionMode = ExtensionMode.Experimental;
    extensionMode = await host.GetValue(ArgumentConstants.extensionMode) || extensionMode;
    
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        if (cliCore || sdkNoFlatten) {
            let cliCodeModel = deserialize<CodeModel>(await host.ReadFile("code-model-cli-v4.yaml"), 'code-model-cli-v4.yaml', codeModelSchema);
            let pythonCodeModel = deserialize<CodeModel>(await host.ReadFile("code-model-v4-no-tags.yaml"), 'code-model-v4-no-tags.yaml', codeModelSchema);
            const codeModelMerger = new CodeModelMerger(cliCodeModel, pythonCodeModel);
            const azCodeModel = await codeModelMerger.process();
            session.model = azCodeModel;
        } else {
            host.Message({Channel: Channel.Information, Text:"Generating CLI extension!"});
        }
        if(isNullOrUndefined(session.model.language['az'])) {
            session.model.language['az'] = {}
        }
        session.model.language['az']['isCliCore'] = cliCore;
        session.model.language['az']['sdkNeeded'] = isSdkNeeded;
        session.model.language['az']['sdkTrack1'] = isTrack1;
        session.model.language['az']['sdkNoFlatten'] = sdkNoFlatten;
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