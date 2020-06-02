import { CodeModel, codeModelSchema, Language, Parameter } from "@azure-tools/codemodel";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { serialize, deserialize } from "@azure-tools/codegen";
import { values, items, length, Dictionary } from "@azure-tools/linq";
import { changeCamelToDash } from '../utils/helper';
import { isNullOrUndefined } from "util";

export class Merger {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async process() {
        await this.mergeOperation();
        return this.codeModel;
    }

    mergeOperation() {
        this.codeModel;
        this.codeModel.operationGroups.forEach(operationGroup => {
            let operations = operationGroup.operations;
            operationGroup.operations.forEach(operation => {
                if (!isNullOrUndefined(operation.extensions) && !isNullOrUndefined(operation.extensions['cli-operations'])) {
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

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    const extensionMode = await host.GetValue('extension-mode');
    //host.Message({Channel:Channel.Warning, Text:"in aznamer processRequest"});

    //console.error(extensionName);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = await new Merger(session);
        plugin.codeModel.info['extensionMode'] = extensionMode;
        const result = await plugin.process();
        host.WriteFile('azmerger-temp-output.yaml', serialize(result));
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}