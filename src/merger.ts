import {
    CodeModel,
    codeModelSchema,
    getAllProperties,
    ObjectSchema,
    SchemaType,
} from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@autorest/extension-base';
import { serialize, deserialize } from '@azure-tools/codegen';
import { values } from '@azure-tools/linq';
import { isNullOrUndefined, findNodeInCodeModel } from './utils/helper';
import { CodeGenConstants, AzConfiguration } from './utils/models';
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
        this.codeModel.operationGroups.forEach((operationGroup) => {
            let operations = operationGroup.operations;
            operationGroup.operations.forEach((operation) => {
                if (
                    !isNullOrUndefined(operation.extensions) &&
                    !isNullOrUndefined(
                        operation.extensions['cli-split-operation-original-operation'],
                    )
                ) {
                    const nameIndexMap: Map<string, number> = new Map<string, number>();
                    let index = 0;
                    operation.extensions[
                        'cli-split-operation-original-operation'
                    ].parameters.forEach((param) => {
                        nameIndexMap.set(param.language['cli'].name, index);
                        index++;
                    });
                    const nameIndexMapRequest: Map<string, number> = new Map<string, number>();
                    let indexRequest = 0;
                    if (
                        !isNullOrUndefined(
                            operation.extensions['cli-split-operation-original-operation']
                                .requests?.[0]?.parameters,
                        )
                    ) {
                        operation.extensions[
                            'cli-split-operation-original-operation'
                        ].requests[0].parameters.forEach((rparam) => {
                            nameIndexMapRequest.set(rparam.language.cli.name, indexRequest);
                            indexRequest++;
                        });
                    }
                    operation.parameters.forEach((subParam) => {
                        const idx = nameIndexMap.get(subParam.language['cli'].name);
                        if (idx > -1) {
                            if (
                                isNullOrUndefined(
                                    operation.extensions['cli-split-operation-original-operation']
                                        .parameters[idx].subParams,
                                )
                            ) {
                                operation.extensions[
                                    'cli-split-operation-original-operation'
                                ].parameters[idx].subParams = {};
                            }
                            operation.extensions[
                                'cli-split-operation-original-operation'
                            ].parameters[idx].subParams[operation.language['cli'].name] =
                                subParam.language['cli'].name;
                            subParam['nameBaseParam'] =
                                operation.extensions[
                                    'cli-split-operation-original-operation'
                                ].parameters[idx];
                        }
                    });
                    if (!isNullOrUndefined(operation?.requests?.[0]?.parameters)) {
                        operation.requests[0].parameters.forEach((subParam) => {
                            const idx = nameIndexMapRequest.get(subParam.language['cli'].name);
                            if (idx > -1) {
                                if (
                                    isNullOrUndefined(
                                        operation.extensions[
                                            'cli-split-operation-original-operation'
                                        ]?.requests?.[0]?.parameters[idx].subParams,
                                    )
                                ) {
                                    operation.extensions[
                                        'cli-split-operation-original-operation'
                                    ].requests[0].parameters[idx].subParams = {};
                                }
                                operation.extensions[
                                    'cli-split-operation-original-operation'
                                ].requests[0].parameters[idx].subParams[
                                    operation.language['cli'].name
                                ] = subParam.language['cli'].name;
                                subParam['nameBaseParam'] =
                                    operation.extensions[
                                        'cli-split-operation-original-operation'
                                    ].requests[0].parameters[idx];
                            }
                        });
                    }
                }
                if (
                    !isNullOrUndefined(operation.extensions) &&
                    !isNullOrUndefined(operation.extensions['cli-operations']) &&
                    !operation.language['cli']['cli-operation-splitted']
                ) {
                    const nameIndexMap: Map<string, number> = new Map<string, number>();
                    let index = 0;
                    operation.parameters.forEach((param) => {
                        nameIndexMap.set(param.language['cli'].name, index);
                        index++;
                    });
                    const nameIndexMapRequest: Map<string, number> = new Map<string, number>();
                    let indexRequest = 0;
                    if (!isNullOrUndefined(operation.requests?.[0]?.parameters)) {
                        operation.requests[0].parameters.forEach((rparam) => {
                            nameIndexMapRequest.set(rparam.language['cli'].name, indexRequest);
                            indexRequest++;
                        });
                    }
                    operation.extensions['cli-operations'].forEach((subOperation) => {
                        subOperation.parameters.forEach((subParam) => {
                            const idx = nameIndexMap.get(subParam.language['cli'].name);
                            if (idx > -1) {
                                if (isNullOrUndefined(operation.parameters[idx]['subParams'])) {
                                    operation.parameters[idx]['subParams'] = {};
                                }
                                operation.parameters[idx]['subParams'][
                                    subOperation.language['cli'].name
                                ] = subParam.language['cli'].name;
                                subParam.nameBaseParam = operation.parameters[idx];
                            }
                        });
                        if (!isNullOrUndefined(subOperation?.requests?.[0]?.parameters)) {
                            subOperation.requests[0].parameters.forEach((subParam) => {
                                const idx = nameIndexMapRequest.get(subParam.language['cli'].name);
                                if (idx > -1) {
                                    if (
                                        isNullOrUndefined(
                                            operation?.requests?.[0]?.parameters[idx]['subParams'],
                                        )
                                    ) {
                                        operation.requests[0].parameters[idx]['subParams'] = {};
                                    }
                                    operation.requests[0].parameters[idx]['subParams'][
                                        subOperation.language['cli'].name
                                    ] = subParam.language['cli'].name;
                                    subParam.nameBaseParam = operation.requests[0].parameters[idx];
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
    constructor(public cliCodeModel: CodeModel, public pythonCodeModel: CodeModel) {}

    async process() {
        return this.mergeCodeModel();
    }

    mergeCodeModel(): CodeModel {
        this.cliCodeModel.info['python_title'] = this.pythonCodeModel.info['python_title'];
        this.cliCodeModel.info['pascal_case_title'] = this.pythonCodeModel.info[
            'pascal_case_title'
        ];
        this.processOperationGroup();
        this.processGlobalParam();
        this.processSchemas();
        const azCodeModel = this.cliCodeModel;
        return azCodeModel;
    }

    setPythonName(param, m4FlattenedFrom: any[] = []) {
        const cliM4Path = param?.language?.cli?.cliM4Path;
        if (isNullOrUndefined(cliM4Path)) {
            return;
        }
        if (cliM4Path === "schemas$$objects['microsoft.graph.user']$$properties['settings']") {
            cliM4Path;
        }
        const cliNode = findNodeInCodeModel(cliM4Path, this.cliCodeModel, false, param);
        let foundNode = false;
        if (
            !isNullOrUndefined(cliNode) &&
            !isNullOrUndefined(cliNode.language) &&
            isNullOrUndefined(cliNode.language.python)
        ) {
            if (
                (!isNullOrUndefined(cliNode.language.cli.cliM4Path) &&
                    cliNode.language.cli.cliM4Path === cliM4Path) ||
                cliNode.language.cli.cliFlattenTrace === param.language.cli.cliFlattenTrace
            ) {
                foundNode = true;
                cliNode.language.python = param.language.python;
                if (param.flattened && param.language.cli?.['cli-m4-flattened']) {
                    cliNode.language.cli['cli-m4-flattened'] = true;
                    if (!isNullOrUndefined(m4FlattenedFrom)) {
                        cliNode.language.cli.m4FlattenedFrom = m4FlattenedFrom;
                    }
                }
            }
        }
        if (!foundNode) {
            const flattenedNodes = findNodeInCodeModel(cliM4Path, this.cliCodeModel, true, param);
            if (!isNullOrUndefined(flattenedNodes) && flattenedNodes.length > 0) {
                for (const fnode of flattenedNodes) {
                    if (!isNullOrUndefined(fnode) && !isNullOrUndefined(fnode.language)) {
                        let foundProp = false;
                        const OutLayerProp = [];
                        OutLayerProp.push(param.schema);
                        while (!foundProp && OutLayerProp.length >= 0) {
                            const outProp = OutLayerProp.shift();
                            if (isNullOrUndefined(outProp)) {
                                continue;
                            }
                            outProp.language['cli'].cliKey;
                            for (const prop of getAllProperties(outProp)) {
                                if (
                                    !isNullOrUndefined(prop.schema) &&
                                    prop.schema.type === SchemaType.Object
                                ) {
                                    prop.schema;
                                    OutLayerProp.push(
                                        ...getAllProperties(<ObjectSchema>prop.schema),
                                    );
                                }
                                if (
                                    !isNullOrUndefined(fnode.language?.cli?.cliKey) &&
                                    fnode.language?.cli?.cliKey === prop.language?.['cli']?.cliKey
                                ) {
                                    fnode.language.python = prop['language'].python;
                                    fnode.language.cli.pythonFlattenedFrom = param;
                                    foundProp = true;
                                    break;
                                } else if (
                                    !isNullOrUndefined(fnode.language?.cli?.cliFlattenTrace)
                                ) {
                                    for (const trace of values(
                                        fnode.language.cli.cliFlattenTrace,
                                    )) {
                                        if (
                                            trace ===
                                            "schemas$$objects['microsoft.graph.identitySet']$$properties['user']"
                                        ) {
                                            trace;
                                            fnode.language.cli.cliFlattenTrace;
                                        }
                                        if (
                                            !isNullOrUndefined(prop.language?.['cli']?.cliPath) &&
                                            trace === prop.language?.['cli'].cliPath
                                        ) {
                                            for (const p of getAllProperties(
                                                <ObjectSchema>prop.schema,
                                            )) {
                                                if (
                                                    !isNullOrUndefined(
                                                        p.language?.['cli']?.cliKey,
                                                    ) &&
                                                    fnode.language?.['cli']?.cliKey ===
                                                        p.language?.['cli']?.cliKey
                                                ) {
                                                    fnode.language.python = p.language.python;
                                                    fnode.language.cli.pythonFlattenedFrom = prop;
                                                    foundProp = true;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (!foundProp) {
                            fnode;
                            param;
                        }
                    }
                }
            }
        }
    }

    processGlobalParam() {
        for (const para of values(this.pythonCodeModel.globalParameters)) {
            this.setPythonName(para);
        }
    }

    processSchemas() {
        const schemas = this.pythonCodeModel.schemas;

        for (const obj of values(schemas.objects)) {
            this.setPythonName(obj);
            for (const property of getAllProperties(obj)) {
                this.setPythonName(property);
            }
        }

        for (const dict of values(schemas.dictionaries)) {
            this.setPythonName(dict);
            this.setPythonName(dict.elementType);
        }

        for (const enumn of values(schemas.choices)) {
            this.setPythonName(enumn);
            for (const item of values(enumn.choices)) {
                this.setPythonName(item);
            }
        }

        for (const enumn of values(schemas.sealedChoices)) {
            this.setPythonName(enumn);
            for (const item of values(enumn.choices)) {
                this.setPythonName(item);
            }
        }

        for (const arr of values(schemas.arrays)) {
            this.setPythonName(arr);
            this.setPythonName(arr.elementType);
        }

        for (const cons of values(schemas.constants)) {
            this.setPythonName(cons);
        }

        for (const num of values(schemas.numbers)) {
            this.setPythonName(num);
        }

        for (const str of values(schemas.strings)) {
            this.setPythonName(str);
        }
    }

    getLastValidPath(cliPath: string) {
        const cliPaths = cliPath.split('$$');
        let last = cliPaths.last;
        if (last.indexOf('[') > -1) {
            last = last.substring(0, last.indexOf('['));
        } else {
            last = '';
        }
        cliPaths.pop();
        const path = cliPaths.join('$$');
        if (last === '') {
            return path;
        }
        return path + '$$' + last;
    }

    processOperationGroup() {
        this.pythonCodeModel.operationGroups.forEach((operationGroup) => {
            if (!isNullOrUndefined(operationGroup.language['cli'])) {
                this.setPythonName(operationGroup);
            }

            const operations = operationGroup.operations;
            operations.forEach((operation) => {
                if (!isNullOrUndefined(operation.language['cli'])) {
                    this.setPythonName(operation);
                }
                let cnt = 0;
                operation.parameters.forEach((parameter) => {
                    if (!isNullOrUndefined(parameter.language['cli'])) {
                        const m4FlattenedFrom = [];
                        if (
                            parameter.flattened &&
                            parameter.language['cli']?.['cli-m4-flattened']
                        ) {
                            for (
                                let tmpCnt = cnt + 1;
                                tmpCnt < operation.parameters.length;
                                tmpCnt++
                            ) {
                                const tmpParam = operation.parameters[tmpCnt];
                                if (tmpParam['originalParameter'] === parameter) {
                                    if (!isNullOrUndefined(tmpParam?.language['cli']?.cliPath)) {
                                        const cliPath = tmpParam.language['cli']?.cliPath;
                                        const cliNode = findNodeInCodeModel(
                                            cliPath,
                                            this.cliCodeModel,
                                        );
                                        if (isNullOrUndefined(cliNode)) {
                                            m4FlattenedFrom.push(tmpParam);
                                        } else {
                                            if (isNullOrUndefined(cliNode.language.python)) {
                                                cliNode.language.python = tmpParam.language.python;
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
                operation.requests.forEach((request) => {
                    if (!isNullOrUndefined(request?.parameters)) {
                        cnt = 0;
                        request.parameters.forEach((parameter) => {
                            if (!isNullOrUndefined(parameter.language['cli'])) {
                                const m4FlattenedFrom = [];
                                if (
                                    parameter.flattened &&
                                    parameter.language['cli']?.['cli-m4-flattened']
                                ) {
                                    for (
                                        let tmpCnt = cnt + 1;
                                        tmpCnt < request.parameters.length;
                                        tmpCnt++
                                    ) {
                                        const tmpParam = request.parameters[tmpCnt];
                                        let deepFlatten = false;
                                        if (tmpParam['originalParameter'] === parameter) {
                                            if (
                                                !isNullOrUndefined(
                                                    tmpParam?.language['cli']?.cliPath,
                                                )
                                            ) {
                                                const cliPath = tmpParam.language['cli']?.cliPath;
                                                const cliNode = findNodeInCodeModel(
                                                    cliPath,
                                                    this.cliCodeModel,
                                                    false,
                                                    tmpParam,
                                                );
                                                if (isNullOrUndefined(cliNode)) {
                                                    const lastValidPath = this.getLastValidPath(
                                                        cliPath,
                                                    );
                                                    if (!isNullOrUndefined(lastValidPath)) {
                                                        const lastValidNode = findNodeInCodeModel(
                                                            lastValidPath,
                                                            this.cliCodeModel,
                                                        );
                                                        if (
                                                            !isNullOrUndefined(lastValidNode) &&
                                                            Array.isArray(lastValidNode)
                                                        ) {
                                                            const cliFlattenTrace =
                                                                tmpParam.language['cli']
                                                                    .cliFlattenTrace;
                                                            const cliFlattenTraceStr = cliFlattenTrace.join(
                                                                ';',
                                                            );
                                                            let cnt1 = -1;
                                                            for (const lnode of lastValidNode) {
                                                                if (!deepFlatten) {
                                                                    cnt1++;
                                                                }
                                                                if (
                                                                    !isNullOrUndefined(
                                                                        lnode.language.cli
                                                                            ?.cliFlattenTrace,
                                                                    )
                                                                ) {
                                                                    const cftstr = lnode.language.cli?.cliFlattenTrace.join(
                                                                        ';',
                                                                    );
                                                                    if (
                                                                        cftstr.startsWith(
                                                                            cliFlattenTraceStr,
                                                                        )
                                                                    ) {
                                                                        deepFlatten = true;
                                                                        lnode.originalParameter = tmpParam;
                                                                    }
                                                                }
                                                            }
                                                            if (deepFlatten) {
                                                                tmpParam.flattened = true;
                                                                tmpParam.language['cli'][
                                                                    'cli-flatten'
                                                                ] = true;
                                                                tmpParam.language['cli'][
                                                                    'cli-flattened'
                                                                ] = true;
                                                                tmpParam[
                                                                    'originalParameter'
                                                                ] = findNodeInCodeModel(
                                                                    parameter.language['cli']
                                                                        .cliM4Path,
                                                                    this.cliCodeModel,
                                                                    false,
                                                                    parameter,
                                                                );
                                                                lastValidNode.splice(
                                                                    cnt1,
                                                                    0,
                                                                    tmpParam,
                                                                );
                                                                const cliOperation = findNodeInCodeModel(
                                                                    operation.language['cli']
                                                                        .cliM4Path,
                                                                    this.cliCodeModel,
                                                                    false,
                                                                    operation,
                                                                );
                                                                if (
                                                                    cliOperation.language.cli[
                                                                        'cli-operation-splitted'
                                                                    ] &&
                                                                    Array.isArray(
                                                                        cliOperation.language.cli[
                                                                            'split-operation-names'
                                                                        ],
                                                                    )
                                                                ) {
                                                                    for (const tmpName of cliOperation
                                                                        .language['cli'][
                                                                        'split-operation-names'
                                                                    ]) {
                                                                        const subParamPath = parameter.language[
                                                                            'cli'
                                                                        ].cliM4Path.replace(
                                                                            cliOperation.language
                                                                                .cli.cliKey,
                                                                            cliOperation.language
                                                                                .cli.cliKey +
                                                                                '#' +
                                                                                tmpName,
                                                                        );
                                                                        const subParam = findNodeInCodeModel(
                                                                            subParamPath,
                                                                            this.cliCodeModel,
                                                                            false,
                                                                            null,
                                                                            true,
                                                                        );
                                                                        const subLastValidPath = this.getLastValidPath(
                                                                            subParamPath,
                                                                        );
                                                                        const subLastValidNode = findNodeInCodeModel(
                                                                            subLastValidPath,
                                                                            this.cliCodeModel,
                                                                            false,
                                                                            null,
                                                                            true,
                                                                        );
                                                                        const idx = subLastValidNode.indexOf(
                                                                            subParam,
                                                                        );
                                                                        if (idx > -1) {
                                                                            subLastValidNode.splice(
                                                                                idx + 1,
                                                                                0,
                                                                                tmpParam,
                                                                            );
                                                                            subLastValidNode[
                                                                                idx + 1
                                                                            ].originalParameter = subParam;
                                                                            subLastValidNode[
                                                                                idx + 1
                                                                            ].language.cli[
                                                                                'moved-from-python'
                                                                            ] = true;
                                                                            let subcnt = idx + 2;
                                                                            while (
                                                                                subcnt <
                                                                                subLastValidNode.length
                                                                            ) {
                                                                                if (
                                                                                    subLastValidNode[
                                                                                        subcnt
                                                                                    ]
                                                                                        .originalParameter ===
                                                                                    subParam
                                                                                ) {
                                                                                    subLastValidNode[
                                                                                        subcnt
                                                                                    ].originalParameter = tmpParam;
                                                                                } else {
                                                                                    break;
                                                                                }
                                                                                subcnt++;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                if (
                                                                    !isNullOrUndefined(
                                                                        cliOperation.language.cli[
                                                                            'cli-operations'
                                                                        ],
                                                                    )
                                                                ) {
                                                                    for (const mop of cliOperation
                                                                        .language.cli[
                                                                        'cli-operations'
                                                                    ]) {
                                                                        const subParamPath = parameter.language[
                                                                            'cli'
                                                                        ].cliM4Path.replace(
                                                                            cliOperation.language
                                                                                .cli.cliKey,
                                                                            mop.language.cli.cliKey,
                                                                        );
                                                                        const subParam = findNodeInCodeModel(
                                                                            subParamPath,
                                                                            this.cliCodeModel,
                                                                        );
                                                                        const subLastValidPath = this.getLastValidPath(
                                                                            subParamPath,
                                                                        );
                                                                        const subLastValidNode = findNodeInCodeModel(
                                                                            subLastValidPath,
                                                                            this.cliCodeModel,
                                                                        );
                                                                        if (subLastValidNode) {
                                                                            const idx = subLastValidNode.indexOf(
                                                                                subParam,
                                                                            );
                                                                            if (idx > -1) {
                                                                                subLastValidNode.splice(
                                                                                    idx + 1,
                                                                                    0,
                                                                                    tmpParam,
                                                                                );
                                                                                subLastValidNode[
                                                                                    idx + 1
                                                                                ].originalParameter = subParam;
                                                                                subLastValidNode[
                                                                                    idx + 1
                                                                                ].language.cli[
                                                                                    'moved-from-python'
                                                                                ] = true;
                                                                                let subcnt =
                                                                                    idx + 2;
                                                                                while (
                                                                                    subcnt <
                                                                                    subLastValidNode.length
                                                                                ) {
                                                                                    if (
                                                                                        subLastValidNode[
                                                                                            subcnt
                                                                                        ]
                                                                                            .originalParameter ===
                                                                                        subParam
                                                                                    ) {
                                                                                        subLastValidNode[
                                                                                            subcnt
                                                                                        ].originalParameter = tmpParam;
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
                                                    }
                                                    if (!deepFlatten) {
                                                        m4FlattenedFrom.push(tmpParam);
                                                    }
                                                } else {
                                                    if (
                                                        isNullOrUndefined(cliNode.language.python)
                                                    ) {
                                                        cliNode.language.python =
                                                            tmpParam.language.python;
                                                    }
                                                }
                                            }
                                        } else {
                                            break;
                                        }
                                    }
                                    if (m4FlattenedFrom.length === 0) {
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
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        if (
            AzConfiguration.getValue(CodeGenConstants.isCliCore) ||
            AzConfiguration.getValue(CodeGenConstants.sdkNoFlatten)
        ) {
            const cliCodeModel = deserialize<CodeModel>(
                await host.ReadFile(CodeGenConstants.cliCodeModelName),
                CodeGenConstants.cliCodeModelName,
                codeModelSchema,
            );
            const pythonCodeModel = deserialize<CodeModel>(
                await host.ReadFile(CodeGenConstants.m4CodeModelName),
                CodeGenConstants.m4CodeModelName,
                codeModelSchema,
            );
            const codeModelMerger = new CodeModelMerger(cliCodeModel, pythonCodeModel);
            const azCodeModel = await codeModelMerger.process();
            session.model = azCodeModel;
        } else {
            host.Message({ Channel: Channel.Information, Text: 'Generating CLI extension!' });
        }
        const plugin = new Merger(session);
        const result = await plugin.process();
        host.WriteFile('azmerger-cli-temp-output-after.yaml', serialize(result));
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}
