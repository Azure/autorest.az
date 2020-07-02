import { CodeModel, codeModelSchema, Language, Parameter } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { isNullOrUndefined } from "util";

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
                        
                    })
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
        let azCodeModel = this.cliCodeModel;
        return azCodeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    //console.error(extensionName);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        let cliCodeModel = deserialize<CodeModel>(await host.ReadFile("code-model-cli-v4.yaml"), 'code-model-cli-v4.yaml', codeModelSchema);
        let pythonCodeModel = deserialize<CodeModel>(await host.ReadFile("code-model-v4-no-tags.yaml"), 'code-model-v4-no-tags.yaml', codeModelSchema);
        const plugin = new CodeModelMerger(cliCodeModel, pythonCodeModel);
        const azCodeModel = await plugin.process();
        session.model = azCodeModel;
        host.WriteFile('azmerger-temp-output.yaml', serialize(azCodeModel));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}