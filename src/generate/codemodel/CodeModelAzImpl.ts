/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { Channel, Session } from '@autorest/extension-base';
import {
    CodeModel,
    Operation,
    OperationGroup,
    Parameter,
    Property,
    Request,
    Schema,
    SchemaType,
} from '@azure-tools/codemodel';
import { values } from '@azure-tools/linq';
import {
    Capitalize,
    deepCopy,
    getGitStatus,
    MergeSort,
    parseResourceId,
    ToCamelCase,
    ToJsonString,
    ToSnakeCase,
    changeCamelToDash,
    isEqualStringArray,
    ToSentence,
    isNullOrUndefined,
    isGeneratedExampleId,
} from '../../utils/helper';
import {
    CodeGenConstants,
    EXCLUDED_PARAMS,
    GenerationMode,
    AzConfiguration,
    CodeModelTypes,
    RenderInput,
    DataGraph,
} from '../../utils/models';
import {
    CodeModelAz,
    CommandExample,
    ExampleParam,
    MethodParam,
    KeyValueType,
    Handler,
} from './CodeModelAz';
import {
    azOptions,
    GenerateDefaultTestScenario,
    GenerateDefaultTestScenarioByDependency,
    PrintTestScenario,
    ResourcePool,
    ObjectStatus,
    GroupTestScenario,
    LoadPreparesConfig,
} from '../renders/tests/ScenarioTool';
import { readFile } from '@azure-tools/async-io';
import { TestStepExampleFileRestCall } from 'oav/dist/lib/testScenario/testResourceTypes';
import * as process from 'process';
import { ConfigModel, ConfigModelImpl } from './Config';
import { ExtensionModel, ExtensionModelImpl } from './Extension';
import { CommandGroupModel, CommandGroupModelImpl } from './CommandGroup';
import { CommandModel, CommandModelImpl } from './Command';
import { MethodModel, MethodModelImpl } from './Method';
import { MethodParameterModel, MethodParameterModelImpl } from './MethodParameter';
import { ParameterModel, ParameterModelImpl } from './Parameter';
import { SchemaModel, SchemaModelImpl } from './Schema';
import { AzExampleModel, AzExampleModelImpl } from './AzExample';
class ActionParam {
    public constructor(
        public groupOpActionName: string,
        public groupActionName: string,
        public actionName: string,
        public action: Parameter,
    ) {}
}

export class CodeModelCliImpl implements CodeModelAz {
    codeModel: CodeModel;
    options: any;
    extensionName: string;
    parentExtension: string;
    currentOperationGroupIndex: number;
    currentSubOperationGroupIndex: number;
    currentOperationIndex: number;
    currentParameterIndex: number;
    currentExampleIndex: number;
    currentAzExampleIndex: number;
    preMethodIndex: number;
    currentMethodIndex: number;
    protected resourcePool: ResourcePool;

    suboptions: Property[];
    protected subOperationGroups: Operation[];
    submethodparameters: Parameter[];
    protected substack: Array<[Parameter[], number]>;
    currentSubOptionIndex: number;
    paramActionNameReference: Map<Schema, string>;
    protected allActions: Map<Parameter, string>;
    _testScenario: any;
    _defaultTestScenario: any[];
    _configuredScenario: boolean;
    _clientSubscriptionBound: boolean;
    _clientBaseUrlBound: boolean;
    _clientAuthenticationPolicy: string;
    protected _generationMode: GenerationMode = GenerationMode.Full;
    protected _outputPath: string;
    protected _parentOptions: any;
    protected _useOptions: string[];
    configHandler: ConfigModel;
    extensionHandler: ExtensionModel;
    commandGroupHandler: CommandGroupModel;
    commandHandler: CommandModel;
    methodHandler: MethodModel;
    methodParameterHandler: MethodParameterModel;
    parameterHandler: ParameterModel;
    schemaHandler: SchemaModel;
    azExampleHandler: AzExampleModel;

    init(): void {
        this.options = AzConfiguration.getValue(CodeGenConstants.az);
        this._parentOptions = AzConfiguration.getValue(CodeGenConstants.parents);
        this._useOptions = AzConfiguration.getValue(CodeGenConstants.use);
        Object.assign(azOptions, this.options);
        this.extensionName = this.options.extensions;
        this.parentExtension = this.options[CodeGenConstants.parentExtension];
        this.currentOperationGroupIndex = -1;
        this.currentSubOperationGroupIndex = -1;
        this.currentOperationIndex = -1;
        this.currentParameterIndex = -1;
        this.currentExampleIndex = -1;
        this.currentAzExampleIndex = -1;
        this.preMethodIndex = -1;
        this.currentMethodIndex = -1;
        this.suboptions = null;
        this.currentSubOptionIndex = -1;
        this.submethodparameters = null;
        this.substack = new Array<[Parameter[], number]>();
        this._clientBaseUrlBound = this.options[CodeGenConstants.clientBaseUrlBound];
        this._clientSubscriptionBound = this.options[CodeGenConstants.clientSubscriptionBound];
        this._clientAuthenticationPolicy = this.options[
            CodeGenConstants.clientAuthenticationPolicy
        ];
        LoadPreparesConfig(this.options[CodeGenConstants.preparers]);
        // this.sortOperationByAzCommand();
    }

    public constructor(public session: Session<CodeModel>) {
        this.init();
        this.codeModel = session.model;
        this.resourcePool = new ResourcePool();
        this.initHandler();
        this.dealingSimplePolymorphism();
        this.setParamAzUniqueNames();
        this.sortOperationByAzCommand();
        this.calcOptionRequiredByMethod();
        this.dealingParameterAlias();
    }

    private initHandler() {
        this.configHandler = new ConfigModelImpl(this);
        this.extensionHandler = new ExtensionModelImpl(this);
        this.schemaHandler = new SchemaModelImpl(this);
        this.commandGroupHandler = new CommandGroupModelImpl(this);
        this.methodHandler = new MethodModelImpl(this);
        this.azExampleHandler = new AzExampleModelImpl(this);
        this.parameterHandler = new ParameterModelImpl(this);
        this.commandHandler = new CommandModelImpl(this);
        this.methodParameterHandler = new MethodParameterModelImpl(this);
    }

    private sortOperationByAzCommand() {
        for (const [idx, operationGroup] of this.codeModel.operationGroups.entries()) {
            operationGroup.operations.sort(function (a, b) {
                function getOrder(op: string) {
                    if (op.indexOf(' ') > -1) {
                        op = op.split(' ').last;
                    }
                    const opOrder = ['list', 'show', 'create', 'update', 'delete'];
                    let order = opOrder.indexOf(op.toLowerCase()) + 1;
                    if (order === 0) {
                        order = opOrder.length + 1;
                    }
                    return order;
                }
                function requiredParamLength(parameters) {
                    let ret = 0;
                    for (let i = 0; i < parameters.length; ++i) {
                        if (parameters[i].required) ret++;
                    }
                    return ret;
                }
                const oa = getOrder(a.language['az'].name);
                const ob = getOrder(b.language['az'].name);
                if (oa < ob) {
                    return -1;
                } else if (oa > ob) {
                    return 1;
                } else {
                    const la = a.language['az'].name;
                    const lb = b.language['az'].name;
                    if (la !== lb) {
                        return la.localeCompare(lb);
                    }
                    const requiredLenA = requiredParamLength(a.parameters);
                    const requiredLenB = requiredParamLength(b.parameters);
                    if (requiredLenA !== requiredLenB) return requiredLenA > requiredLenB ? -1 : 1;
                    return a.parameters.length > b.parameters.length ? -1 : 1;
                }
            });
            this.codeModel.operationGroups[idx] = operationGroup;
        }
    }

    public GetResourcePool(): ResourcePool {
        return this.resourcePool;
    }

    public async GetMetaData(): Promise<{ [key: string]: any }> {
        function getSwaggerFolder(parentsOptions: { [key: string]: any }) {
            for (const k in parentsOptions) {
                const v: string = parentsOptions[k];
                if (
                    k.endsWith('.json') &&
                    typeof v === 'string' &&
                    v.startsWith('file:///') &&
                    v.indexOf('specification') > 0
                ) {
                    const p = v.indexOf('specification');
                    if (process.platform.toLowerCase().startsWith('win')) {
                        return v.slice('file:///'.length, p - 1);
                    }
                    return v.slice('file:///'.length - 1, p - 1);
                }
            }
            return undefined;
        }
        const ret = {};
        ret['--use'] = this._useOptions;

        const swaggerFolder = getSwaggerFolder(this._parentOptions);
        if (swaggerFolder) {
            ret['swagger git status'] = getGitStatus(swaggerFolder).split('\n');
        }

        const azpkg = path.join(__dirname, '..', '..', '..', 'package.json');
        const pjson = JSON.parse(await readFile(azpkg));
        ret['package info'] = `${pjson.name} ${pjson.version}`;
        return ret;
    }

    private calcOptionRequiredByMethod() {
        if (this.SelectFirstCommandGroup()) {
            do {
                if (this.SelectFirstCommand()) {
                    do {
                        let paramTime = 0;
                        const paramRequired: Map<string, number> = new Map<string, number>();
                        if (this.SelectFirstMethod()) {
                            paramTime++;
                            if (this.SelectFirstMethodParameter()) {
                                do {
                                    if (
                                        !paramRequired.has(
                                            this.methodParameterHandler.MethodParameter_Name,
                                        )
                                    ) {
                                        paramRequired.set(
                                            this.methodParameterHandler.MethodParameter_Name,
                                            this.methodParameterHandler.MethodParameter_IsRequired
                                                ? 1
                                                : 0,
                                        );
                                    } else if (
                                        this.methodParameterHandler.MethodParameter_IsRequired
                                    ) {
                                        paramRequired.set(
                                            this.methodParameterHandler.MethodParameter_Name,
                                            paramRequired.get(
                                                this.methodParameterHandler.MethodParameter_Name,
                                            ) + 1,
                                        );
                                    }
                                } while (this.SelectNextMethodParameter());
                            }
                            while (this.SelectNextMethod()) {
                                paramTime++;
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        if (
                                            !paramRequired.has(
                                                this.methodParameterHandler.MethodParameter_Name,
                                            )
                                        ) {
                                            paramRequired.set(
                                                this.methodParameterHandler.MethodParameter_Name,
                                                this.methodParameterHandler
                                                    .MethodParameter_IsRequired
                                                    ? 1
                                                    : 0,
                                            );
                                        } else if (
                                            this.methodParameterHandler.MethodParameter_IsRequired
                                        ) {
                                            paramRequired.set(
                                                this.methodParameterHandler.MethodParameter_Name,
                                                paramRequired.get(
                                                    this.methodParameterHandler
                                                        .MethodParameter_Name,
                                                ) + 1,
                                            );
                                        }
                                    } while (this.SelectNextMethodParameter());
                                }
                            }
                        }
                        if (this.SelectFirstMethod()) {
                            let idGroups = new Map<string, string>();
                            idGroups = parseResourceId(this.Request.protocol.http.path);
                            let hasName = false;
                            if (this.SelectFirstMethodParameter()) {
                                do {
                                    const parameters = this.methodParameterHandler.MethodParameter;
                                    const defaultName = parameters.language['cli'].cliKey;
                                    const defaultToMatch = '{' + defaultName + '}';
                                    if (!isNullOrUndefined(idGroups)) {
                                        for (const k of idGroups.entries()) {
                                            if (
                                                k[1] === defaultToMatch &&
                                                defaultName !== 'resourceGroupName'
                                            ) {
                                                this.methodParameterHandler.MethodParameter.language[
                                                    'az'
                                                ].id_part = k[0];
                                            }
                                        }
                                    }
                                    if (parameters.language['cli'].required) {
                                        this.methodParameterHandler.MethodParameter[
                                            'RequiredByMethod'
                                        ] = true;
                                    } else {
                                        this.methodParameterHandler.MethodParameter[
                                            'RequiredByMethod'
                                        ] =
                                            paramRequired.get(
                                                this.methodParameterHandler.MethodParameter_Name,
                                            ) === paramTime;
                                    }
                                    if (
                                        this.methodParameterHandler.MethodParameter_MapsTo ===
                                        'name'
                                    ) {
                                        hasName = true;
                                    }
                                } while (this.SelectNextMethodParameter());
                                if (hasName) {
                                    this.methodHandler.Method['hasName'] = true;
                                }
                            }
                            while (this.SelectNextMethod()) {
                                let idGroups = new Map<string, string>();
                                idGroups = parseResourceId(this.Request.protocol.http.path);
                                let hasName = false;
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        const parameters = this.methodParameterHandler
                                            .MethodParameter;
                                        const defaultName = parameters.language['cli'].cliKey;
                                        const defaultToMatch = '{' + defaultName + '}';
                                        if (!isNullOrUndefined(idGroups)) {
                                            for (const k of idGroups.entries()) {
                                                if (
                                                    k[1] === defaultToMatch &&
                                                    defaultName !== 'resourceGroupName'
                                                ) {
                                                    this.methodParameterHandler.MethodParameter.language[
                                                        'az'
                                                    ].id_part = k[0];
                                                }
                                            }
                                        }
                                        if (parameters.language['cli'].required) {
                                            this.methodParameterHandler.MethodParameter[
                                                'RequiredByMethod'
                                            ] = true;
                                        } else {
                                            this.methodParameterHandler.MethodParameter[
                                                'RequiredByMethod'
                                            ] =
                                                paramRequired.get(
                                                    this.methodParameterHandler
                                                        .MethodParameter_Name,
                                                ) === paramTime;
                                        }
                                        if (
                                            this.methodParameterHandler.MethodParameter_MapsTo ===
                                            'name'
                                        ) {
                                            hasName = true;
                                        }
                                    } while (this.SelectNextMethodParameter());
                                    if (hasName) {
                                        this.methodHandler.Method['hasName'] = true;
                                    }
                                }
                            }
                        }
                    } while (this.SelectNextCommand());
                }
            } while (this.SelectNextCommandGroup());
        }
    }

    private dealingSimplePolymorphism() {
        if (this.SelectFirstCommandGroup()) {
            do {
                if (this.SelectFirstCommand()) {
                    do {
                        if (this.SelectFirstMethod()) {
                            do {
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        if (
                                            this.methodParameterHandler.MethodParameter_IsFlattened
                                        ) {
                                            continue;
                                        }
                                        if (
                                            this.methodParameterHandler
                                                .MethodParameter_IsPolyOfSimple
                                        ) {
                                            const polyBaseParam = this.methodParameterHandler
                                                .MethodParameter;
                                            const allChildParam: Array<Parameter> = [];
                                            for (const child of this.methodParameterHandler
                                                .MethodParameter.schema['children'].all) {
                                                const childParam = new Parameter(
                                                    child.language.default.name,
                                                    child.language.default.description,
                                                    child,
                                                    child.language,
                                                );
                                                childParam.language = child.language;
                                                if (
                                                    !isNullOrUndefined(child.language['cli']?.alias)
                                                ) {
                                                    if (
                                                        isNullOrUndefined(
                                                            childParam.language['az'].alias,
                                                        )
                                                    ) {
                                                        childParam.language['az'].alias = [];
                                                    }
                                                    if (
                                                        typeof child.language['cli'].alias ===
                                                        'string'
                                                    ) {
                                                        if (
                                                            EXCLUDED_PARAMS.indexOf(
                                                                child.language['cli'].alias,
                                                            ) > -1
                                                        ) {
                                                            child.language['cli'].alias =
                                                                'gen_' +
                                                                child.language['cli'].alias;
                                                        }
                                                        childParam.language['az'].alias.push(
                                                            changeCamelToDash(
                                                                child.language['cli'].alias,
                                                            ),
                                                        );
                                                    } else if (
                                                        Array.isArray(child.language['cli'].alias)
                                                    ) {
                                                        for (let alias of child.language['cli']
                                                            .alias) {
                                                            if (
                                                                EXCLUDED_PARAMS.indexOf(alias) > -1
                                                            ) {
                                                                alias = 'gen_' + alias;
                                                            }
                                                            childParam.language['az'].alias.push(
                                                                changeCamelToDash(alias),
                                                            );
                                                        }
                                                    }
                                                }
                                                childParam['polyBaseParam'] = polyBaseParam;
                                                allChildParam.push(childParam);
                                            }
                                            const addResult = this.MethodParameters_AddPolySubClass(
                                                this.methodParameterHandler.MethodParameter,
                                                allChildParam,
                                            );
                                            if (!addResult) {
                                                this.session.message({
                                                    Channel: Channel.Warning,
                                                    Text:
                                                        'dealingSimplePolymorphisme error! baseClass: ' +
                                                        this.methodParameterHandler
                                                            .MethodParameter_MapsTo,
                                                });
                                            }
                                        }
                                    } while (this.SelectNextMethodParameter());
                                }
                            } while (this.SelectNextMethod());
                        }
                    } while (this.SelectNextCommand());
                }
            } while (this.SelectNextCommandGroup());
        }
    }

    private setParamAzUniqueNames() {
        this.paramActionNameReference = new Map<Schema, string>();
        this.allActions = new Map<Parameter, string>();
        const nameActionReference: Map<string, ActionParam> = new Map<string, ActionParam>();
        const pythonReserveWord = ['all', 'id', 'format', 'type', 'filter'];
        if (this.SelectFirstCommandGroup()) {
            do {
                if (this.SelectFirstCommand()) {
                    do {
                        const nameParamReference: Map<string, Parameter> = new Map<
                            string,
                            Parameter
                        >();
                        if (this.SelectFirstMethod()) {
                            do {
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        const paramName = this.methodParameterHandler
                                            .MethodParameter_MapsTo;
                                        const param = this.methodParameterHandler.MethodParameter;
                                        const originParam = this.methodParameterHandler
                                            .MethodParameter;
                                        let flattenedNames =
                                            param?.['targetProperty']?.flattenedNames;
                                        if (
                                            isNullOrUndefined(flattenedNames) &&
                                            !isNullOrUndefined(param.language['cli'].flattenedNames)
                                        ) {
                                            flattenedNames = param.language['cli'].flattenedNames;
                                        }
                                        const mapName: Array<string> = [];
                                        let paramFlattenedName = this.parameterHandler.Parameter_MapsTo(
                                            param,
                                        );
                                        const names = this.methodHandler.Method_NameAz.split(' ');
                                        if (flattenedNames && flattenedNames.length > 0) {
                                            for (const item of flattenedNames) {
                                                mapName.push(item);
                                            }
                                            mapName.pop();
                                            mapName.reverse();
                                            if (
                                                mapName[mapName.length - 1] === 'properties' ||
                                                mapName[mapName.length - 1] === 'parameters'
                                            ) {
                                                mapName.pop();
                                            } else if (
                                                names.length > 1 &&
                                                mapName[mapName.length - 1] ===
                                                    names[0].replace(/-/g, '_')
                                            ) {
                                                mapName.pop();
                                            }
                                            if (mapName.length > 0) {
                                                const argGroupName = mapName
                                                    .reverse()
                                                    .map((item) => {
                                                        return ToSentence(item);
                                                    })
                                                    .join(' ');
                                                this.methodParameterHandler.MethodParameter.language[
                                                    'az'
                                                ].arg_group = argGroupName;
                                            }
                                            paramFlattenedName = paramName;
                                        }
                                        if (names.length > 1) {
                                            let subgroup: string = names[0];
                                            subgroup = subgroup.replace(/-/g, '_');
                                            if (paramFlattenedName.startsWith(subgroup)) {
                                                paramFlattenedName = paramFlattenedName.substr(
                                                    subgroup.length + 1,
                                                );
                                            }
                                        }
                                        if (
                                            nameParamReference.has(paramFlattenedName) &&
                                            nameParamReference.get(paramFlattenedName)[
                                                'targetProperty'
                                            ] !== param['targetPropert']
                                        ) {
                                            let tmpName = paramFlattenedName;
                                            const preParam = nameParamReference.get(
                                                paramFlattenedName,
                                            );
                                            const preFlattenedNames =
                                                preParam?.['targetProperty']?.flattenedNames;
                                            let preParamFlattenedName = this.parameterHandler.Parameter_MapsTo(
                                                preParam,
                                            );
                                            let preTmpName = preParamFlattenedName;
                                            if (preFlattenedNames && preFlattenedNames.length > 0) {
                                                preTmpName = preFlattenedNames
                                                    .map((pfn) => ToSnakeCase(pfn))
                                                    .join('_');
                                            }
                                            if (flattenedNames && flattenedNames.length > 0) {
                                                tmpName = flattenedNames
                                                    .map((fn) => ToSnakeCase(fn))
                                                    .join('_');
                                            }
                                            if (preTmpName !== preParamFlattenedName) {
                                                preParamFlattenedName = preTmpName;
                                            } else if (tmpName !== paramFlattenedName) {
                                                paramFlattenedName = tmpName;
                                            }
                                            if (
                                                pythonReserveWord.indexOf(paramFlattenedName) > -1
                                            ) {
                                                paramFlattenedName += '_';
                                            }
                                            if (
                                                pythonReserveWord.indexOf(preParamFlattenedName) >
                                                -1
                                            ) {
                                                preParamFlattenedName += '_';
                                            }
                                            if (paramFlattenedName !== preParamFlattenedName) {
                                                this.parameterHandler.Parameter_SetAzNameMapsTo(
                                                    preParamFlattenedName,
                                                    preParam,
                                                );
                                                nameParamReference.set(
                                                    preParamFlattenedName,
                                                    preParam,
                                                );
                                                this.parameterHandler.Parameter_SetAzNameMapsTo(
                                                    paramFlattenedName,
                                                    param,
                                                );
                                                nameParamReference.set(paramName, param);
                                            } else {
                                                // if the full flattenedName within one command is the same but has two different reference. there's no way to split them.
                                                this.session.message({
                                                    Channel: Channel.Warning,
                                                    Text:
                                                        'parameter ' +
                                                        paramFlattenedName +
                                                        ' has two different references but they have the same flattened name',
                                                });
                                            }
                                        } else {
                                            // nameParamReference doesn't have the parameter
                                            // or nameParamReference has the parameter and they are the same.
                                            if (
                                                pythonReserveWord.indexOf(paramFlattenedName) > -1
                                            ) {
                                                paramFlattenedName += '_';
                                            }
                                            this.parameterHandler.Parameter_SetAzNameMapsTo(
                                                paramFlattenedName,
                                                param,
                                            );
                                            nameParamReference.set(paramFlattenedName, param);
                                        }
                                        if (
                                            this.methodParameterHandler.MethodParameter_Name ===
                                            'tags'
                                        ) {
                                            continue;
                                        }
                                        if (this.parameterHandler.Parameter_IsPolyOfSimple(param)) {
                                            continue;
                                        }
                                        if (
                                            this.methodParameterHandler.MethodParameter_IsList &&
                                            this.methodParameterHandler
                                                .MethodParameter_IsListOfSimple &&
                                            !this.methodParameterHandler
                                                .MethodParameter_IsSimpleArray
                                        ) {
                                            const groupOpParamName: string =
                                                'Add' +
                                                Capitalize(
                                                    ToCamelCase(
                                                        this.commandHandler.Command_FunctionName +
                                                            '_' +
                                                            this.methodParameterHandler
                                                                .MethodParameter_MapsTo,
                                                    ),
                                                );
                                            const groupParamName: string =
                                                'Add' +
                                                Capitalize(
                                                    ToCamelCase(
                                                        this.commandGroupHandler.CommandGroup_Key +
                                                            '_' +
                                                            this.methodParameterHandler
                                                                .MethodParameter_MapsTo,
                                                    ),
                                                );
                                            const actionName: string =
                                                'Add' +
                                                Capitalize(
                                                    ToCamelCase(
                                                        this.methodParameterHandler
                                                            .MethodParameter_MapsTo,
                                                    ),
                                                );
                                            const action = new ActionParam(
                                                groupOpParamName,
                                                groupParamName,
                                                actionName,
                                                param,
                                            );
                                            if (
                                                nameActionReference.has(actionName) &&
                                                nameActionReference.get(actionName).action
                                                    .schema !== originParam.schema
                                            ) {
                                                const preAction = nameActionReference.get(
                                                    actionName,
                                                );
                                                nameActionReference.delete(actionName);
                                                let preActionUniqueName = preAction.actionName;
                                                let actionUniqueName = actionName;
                                                if (
                                                    preAction.groupActionName !==
                                                    action.groupActionName
                                                ) {
                                                    actionUniqueName = action.groupActionName;
                                                    preActionUniqueName = preAction.groupActionName;
                                                } else if (
                                                    preAction.groupOpActionName !==
                                                    action.groupOpActionName
                                                ) {
                                                    actionUniqueName = action.groupOpActionName;
                                                    preActionUniqueName =
                                                        preAction.groupOpActionName;
                                                }
                                                this.paramActionNameReference.set(
                                                    preAction.action.schema,
                                                    preActionUniqueName,
                                                );
                                                this.allActions.set(
                                                    preAction.action,
                                                    preActionUniqueName,
                                                );
                                                this.paramActionNameReference.set(
                                                    param.schema,
                                                    actionUniqueName,
                                                );
                                                this.allActions.set(param, actionUniqueName);
                                                nameActionReference.set(
                                                    preActionUniqueName,
                                                    preAction,
                                                );
                                                nameActionReference.set(actionUniqueName, action);
                                            } else if (
                                                !this.paramActionNameReference.has(
                                                    originParam.schema,
                                                )
                                            ) {
                                                nameActionReference.set(actionName, action);
                                                this.paramActionNameReference.set(
                                                    param.schema,
                                                    actionName,
                                                );
                                                this.allActions.set(param, actionName);
                                            }
                                        }
                                    } while (this.SelectNextMethodParameter());
                                }
                            } while (this.SelectNextMethod());
                        }
                    } while (this.SelectNextCommand());
                }
            } while (this.SelectNextCommandGroup());
        }
    }

    private dealingParameterAlias() {
        this.getMethodParametersWithCallback(() => {
            const parameterName = this.methodParameterHandler.MethodParameter_MapsTo;
            // this is to handle names like "format", "type", etc
            if (parameterName.endsWith('_')) {
                if (
                    isNullOrUndefined(
                        this.methodParameterHandler.MethodParameter.language['az'].alias,
                    )
                ) {
                    this.methodParameterHandler.MethodParameter.language['az'].alias = [];
                }
                this.methodParameterHandler.MethodParameter.language['az'].alias.push(
                    parameterName.substr(0, parameterName.length - 1),
                );
            } else if (
                parameterName.endsWith('name') &&
                !this.methodHandler.Method['hasName'] &&
                parameterName.replace(/_name$|_/g, '') ===
                    this.commandGroupHandler.CommandGroup_DefaultName.toLowerCase()
            ) {
                if (
                    isNullOrUndefined(
                        this.methodParameterHandler.MethodParameter.language['az'].alias,
                    ) ||
                    this.methodParameterHandler.MethodParameter.language['az'].alias.length <= 0
                ) {
                    this.methodParameterHandler.MethodParameter.language['az'].alias = [];
                    this.methodParameterHandler.MethodParameter.language['az'].alias.push('name');
                    this.methodParameterHandler.MethodParameter.language['az'].alias.push('n');
                    this.methodParameterHandler.MethodParameter.language['az'].alias.push(
                        parameterName,
                    );
                }
            }
        });
    }

    public GetActionData() {
        const actions = [];
        SchemaType.Array;
        this.allActions.forEach((actionName: string, param: Parameter) => {
            if (actionName === 'AddEventGridDataConnection') {
                param;
            }
            const action = {
                actionName: actionName,
                actionType: 'KeyValue',
            };
            action.actionType = this.parameterHandler.Parameter_IsPositional(param)
                ? 'Positional'
                : action.actionType;
            action.actionType = this.parameterHandler.Parameter_IsShorthandSyntax(param)
                ? 'ShortHandSyntax'
                : action.actionType;
            action['mapsTo'] = this.parameterHandler.Parameter_MapsTo(param);
            action['type'] = this.schemaHandler.Schema_Type(param.schema);
            action['nameAz'] = this.parameterHandler.Parameter_NameAz(param);
            if (action['type'] === SchemaType.Array) {
                action['baseClass'] = '_AppendAction';
            } else {
                action['baseClass'] = 'Action';
            }
            action['subProperties'] = [];
            action['subPropertiesMapsTo'] = [];
            action['subPropertiesNamePython'] = [];
            action['subPropertiesNameAz'] = [];
            action['constants'] = {};
            const baseParam = param['polyBaseParam'];
            const keyToMatch = baseParam?.schema?.discriminator?.property?.language.python?.name;
            const valueToMatch = param.schema?.['discriminatorValue'];
            const allSubParameters = [];
            if (this.EnterSubMethodParameters(param) && this.SelectFirstMethodParameter(true)) {
                do {
                    const tmpParam = this.SubMethodParameter;
                    allSubParameters.push(tmpParam);
                    const pythonName = this.parameterHandler.Parameter_NamePython(tmpParam);
                    const mapsTo = this.parameterHandler.Parameter_MapsTo(tmpParam);
                    const nameAz = this.parameterHandler.Parameter_NameAz(tmpParam);
                    const subType = this.parameterHandler.Parameter_Type(tmpParam);
                    if (
                        this.parameterHandler.Parameter_Type(tmpParam) === SchemaType.Constant &&
                        !isNullOrUndefined(tmpParam.schema['value']?.['value'])
                    ) {
                        action['constants'][
                            `'${pythonName}'`
                        ] = `'${tmpParam.schema['value']['value']}'`;
                    } else if (tmpParam['readOnly']) {
                        continue;
                    } else if (
                        keyToMatch === pythonName &&
                        !isNullOrUndefined(keyToMatch) &&
                        !isNullOrUndefined(valueToMatch) &&
                        tmpParam['isDiscriminator']
                    ) {
                        action['constants'][`'${keyToMatch}'`] = `'${valueToMatch}'`;
                    } else {
                        action['subProperties'].push({
                            namePython: pythonName,
                            nameAz: nameAz,
                            type: subType,
                        });
                        action['subPropertiesMapsTo'].push(mapsTo);
                        action['subPropertiesNamePython'].push(pythonName);
                        action['subPropertiesNameAz'].push(nameAz);
                    }
                } while (this.SelectNextMethodParameter(true));
                if (action['actionType'] === 'Positional') {
                    const keys = this.parameterHandler.Parameter_PositionalKeys(
                        param,
                        allSubParameters,
                    );
                    action['subPropertiesNamePython'] = keys;
                }
            }
            SchemaType.Dictionary;
            actions.push(action);
            this.ExitSubMethodParameters();
        });
        return actions;
    }
    //= ================================================================================================================
    // Extension level information
    // autorest.az will have support for multiple extensions from single swagger file.
    // Following formats in readme.az.md shall be supported:
    //
    // For single extension:
    //
    //  az:
    //    extensions: <extension-name>
    //
    // Multiple extensions:
    //
    //  az:
    //    extensions:
    //      - <extension-name-1>
    //      - <extension-name-2>
    //
    // Multiple extensions with additional parameters:
    //
    //  az:
    //    extensions:
    //      - name: <extension-name-1>
    //        something-else: value
    //      - name: <extension-name-2>
    //        something-else: value
    //
    // Initially single extension without additional parameters should be supported, however all formats should
    // be handled correctly.
    //
    //= ================================================================================================================

    public GenerateTestInit(): void {
        if (this.GetResourcePool().hasTestResourceScenario) {
            this._testScenario = GroupTestScenario(
                this.GetResourcePool().generateTestScenario(),
                this.extensionHandler.Extension_NameUnderscored,
            );
            this._configuredScenario = true;
        } else if (this.codeModel['test-scenario']) {
            this._testScenario = GroupTestScenario(
                this.codeModel['test-scenario'],
                this.extensionHandler.Extension_NameUnderscored,
            );
            this._configuredScenario = true;
        } else {
            this._testScenario = undefined;
            this._configuredScenario = false;
        }
        this.GatherInternalResource();
        this.GetAllExamples();
    }

    public SelectFirstExtension(): boolean {
        // support only one initially
        return true;
    }

    public SelectNextExtension(): boolean {
        return false;
    }

    //= ================================================================================================================
    // Command Groups
    //
    // This interface provides enumeration of command groups assigned to currently selected extension.
    // Currently all the command groups should be assigned to default extension (first one on the list).
    // Users will be able to assign command groups to specific extension via readme.az.md file.
    // Specification will be updated accordingly.
    //= ================================================================================================================

    public SelectFirstCommandGroup(needRefer = false): boolean {
        // just enumerate through command groups in code-model-v4
        if (this.codeModel.operationGroups.length > 0) {
            this.currentOperationGroupIndex = 0;
            if (
                this.commandGroupHandler.CommandGroup.language['cli'].hidden ||
                this.commandGroupHandler.CommandGroup.language['cli'].removed
            ) {
                if (needRefer && this.commandGroupHandler.CommandGroup_Referenced) {
                    return true;
                } else if (this.SelectNextCommandGroup()) {
                    if (!this.SelectFirstCommand()) {
                        return this.SelectNextCommandGroup();
                    }
                    return true;
                } else {
                    return false;
                }
            }
            if (needRefer && this.commandGroupHandler.CommandGroup_Referenced) {
                return true;
            } else if (!this.SelectFirstCommand()) {
                return this.SelectNextCommandGroup(needRefer);
            }
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    public SelectNextCommandGroup(needRefer = false): boolean {
        if (this.currentOperationGroupIndex < this.codeModel.operationGroups.length - 1) {
            this.currentOperationGroupIndex++;
            if (
                this.commandGroupHandler.CommandGroup.language['cli'].hidden ||
                this.commandGroupHandler.CommandGroup.language['cli'].removed
            ) {
                if (needRefer && this.commandGroupHandler.CommandGroup_Referenced) {
                    return true;
                } else if (this.SelectNextCommandGroup()) {
                    if (!this.SelectFirstCommand()) {
                        return this.SelectNextCommandGroup();
                    }
                    return true;
                } else {
                    return false;
                }
            }
            if (needRefer && this.commandGroupHandler.CommandGroup_Referenced) {
                return true;
            } else if (!this.SelectFirstCommand()) {
                return this.SelectNextCommandGroup(needRefer);
            }
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Commands
    //
    // This interface provides enumeration of commands in selected command group.
    // Note that it doesn't map directly into operations from code-model-v4
    // Azure CLI usually provides following commands to operate on single resource:
    //  (1) "az <resource> create"                          -> PUT
    //  (2) "az <resource> update"                          -> PUT or PATCH
    //  (3) "az <resource> show"                            -> GET
    //  (4) "az <resource> list"                            -> GET
    //  (5) "az <resource> delete"                          -> DELETE
    //  (6) "az <resource> any-other-specific operation"    -> POST or GET
    //
    // NOTE: It would be nice if the implementation enumerates commands in the sequence as above.
    //
    // Commands (1) - (5) represent basic CRUD operations and "create" / "update" / "show" / "list" / "delete" follow
    // standard naming conventions in Azure CLI
    //
    // Commands (6) are custom and operation name should be used to generate command name.
    // Note that some GET operations may be also custom operations (not "list").
    // This can be recognised by URL - it will be longer than "base" PUT URL.
    //
    // In all the cases except of (4) mapping of command to operation in code-model-v4 is one to one.
    // In case (4) several operations shall be grouped into a single command called "list", for instance:
    // "list", "list-by-resource-group", "list-by-something"
    //
    // In case (1) and (2) there may be seveal patterns.
    //  (A) single "create_or_update" (PUT) method
    //  (B) create_or_update (PUT) and "update" (PATCH) method
    //  (C) "create" (PUT) method and "update" (PATCH) method
    //
    // In case (A) single method will be mapped into 2 Azure CLI commands:
    //  "az <resource> create" -> create_or_update (PUT)
    //  "az <resource> update" -> create_or_update (PUT)
    // as there's no separate "update" method available.
    //
    // In case (B) we have one to one mapping:
    //  "az <resource> create" -> create_or_update (PUT)
    //  "az <resource> update" -> update (PATCH)
    //
    // In case (C) we have one to one mapping as well:
    //  "az <resource> create" -> create (PUT)
    //  "az <resource> update" -> update (PATCH)
    // -----------------------------------------------------------------------------------------------------------------

    public SelectFirstCommand(): boolean {
        // just enumerate through commands in command group
        if (this.commandGroupHandler.CommandGroup.operations.length > 0) {
            this.currentOperationIndex = 0;
            const operation = this.commandHandler.Command;
            this.preMethodIndex = this.currentOperationIndex;
            let needNext = false;
            if (this.Operation_IsHidden(operation)) {
                needNext = true;
            }
            while (
                this.currentOperationIndex + 1 <
                this.commandGroupHandler.CommandGroup.operations.length
            ) {
                const tmpOperation = this.commandGroupHandler.CommandGroup.operations[
                    this.currentOperationIndex + 1
                ];
                if (tmpOperation.language['az'].command === operation.language['az'].command) {
                    this.currentOperationIndex++;
                    if (!this.Operation_IsHidden(tmpOperation)) {
                        needNext = false;
                    }
                } else {
                    break;
                }
            }
            if (needNext && !this.SelectNextCommand()) {
                return false;
            }
            this.SelectFirstMethod();
            this.SelectFirstMethodParameter();
            return true;
        } else {
            this.currentOperationIndex = -1;
            return false;
        }
    }

    public SelectNextCommand(): boolean {
        if (
            this.currentOperationIndex <
            this.commandGroupHandler.CommandGroup.operations.length - 1
        ) {
            this.currentOperationIndex++;
            this.preMethodIndex = this.currentOperationIndex;
            const operation = this.commandHandler.Command;
            let needNext = false;
            if (this.Operation_IsHidden(operation)) {
                needNext = true;
            }
            while (
                this.currentOperationIndex <
                this.commandGroupHandler.CommandGroup.operations.length - 1
            ) {
                const tmpOperation = this.commandGroupHandler.CommandGroup.operations[
                    this.currentOperationIndex + 1
                ];
                if (operation.language['az'].command === tmpOperation.language['az'].command) {
                    this.currentOperationIndex++;
                    if (!this.Operation_IsHidden(tmpOperation)) {
                        needNext = false;
                    }
                } else {
                    break;
                }
            }
            if (needNext && !this.SelectNextCommand()) {
                return false;
            }
            this.SelectFirstMethod();
            this.SelectFirstMethodParameter();
            return true;
        } else {
            this.currentOperationIndex = -1;
            return false;
        }
    }

    public Operation_IsHidden(op: Operation = this.methodHandler.Method): boolean {
        if (
            op.language['cli'].hidden ||
            op.language['cli'].removed ||
            op.language['cli']['cli-operation-splitted']
        ) {
            return true;
        }
        return false;
    }

    public formResourceType(config: string | undefined): string {
        if (isNullOrUndefined(config) || config.startsWith('ResourceType.')) return config;
        else return 'ResourceType.' + config;
    }

    //= ================================================================================================================
    // Methods / Operations associated with the command.
    //
    // Usually there will be one to one relationship between command and method.
    // However in one case described above ("az <operation> list"), several methods may be assigned with single
    // command, for instance "list", "list-by-resource-group", "list-by-someting-else".
    // list
    // In case of "list" command all the GET operations associated with the resource should be enumerated here,
    // except of GET operation that returns particular instance of a resource and is associated to "show" command.
    //
    // There is also additional requirement for sort order of returned methods. They should be sorted by number
    // of arguments. Those with more arguments should be listed first.
    //= ================================================================================================================

    public SelectFirstMethod(): boolean {
        if (this.currentOperationIndex >= this.preMethodIndex) {
            this.currentMethodIndex = this.preMethodIndex;
            const method = this.methodHandler.Method;
            if (this.Operation_IsHidden(method)) {
                if (!this.SelectNextMethod()) {
                    return false;
                }
            }
            this.SelectFirstMethodParameter();
            return true;
        } else {
            this.currentMethodIndex = -1;
            return false;
        }
    }

    public SelectNextMethod(): boolean {
        if (this.currentMethodIndex < this.currentOperationIndex) {
            this.currentMethodIndex++;
            const method = this.methodHandler.Method;
            if (this.Operation_IsHidden(method)) {
                if (!this.SelectNextMethod()) {
                    return false;
                }
            }
            this.SelectFirstMethodParameter();
            return true;
        } else {
            this.currentMethodIndex = -1;
            return false;
        }
    }

    public get Request(): Request {
        return this.methodHandler.Method.requests[0];
    }

    //= ================================================================================================================
    // Methods Parameters.
    //
    // This interface is designed to enumerate all parameters of the selected method and their mapping to Python SDK.
    //= ================================================================================================================
    public SelectFirstMethodParameter(containHidden = false): boolean {
        if (!isNullOrUndefined(this.submethodparameters)) {
            this.currentSubOptionIndex = 0;
            const parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (this.parameterHandler.Parameter_IsHidden(parameter) && !containHidden) {
                if (!this.SelectNextMethodParameter(containHidden)) {
                    return false;
                }
            }
            return true;
        }
        if (this.MethodParameters.length > 0) {
            this.currentParameterIndex = 0;
            if (
                (this.methodParameterHandler.MethodParameter_IsHidden && !containHidden) ||
                this.codeModel.globalParameters.indexOf(
                    this.methodParameterHandler.MethodParameter,
                ) > -1
            ) {
                if (this.SelectNextMethodParameter(containHidden)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    public SelectNextMethodParameter(containHidden = false): boolean {
        if (!isNullOrUndefined(this.submethodparameters)) {
            this.currentSubOptionIndex++;

            if (this.currentSubOptionIndex >= this.submethodparameters.length) {
                return false;
            }
            const parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (this.parameterHandler.Parameter_IsHidden(parameter) && !containHidden) {
                if (!this.SelectNextMethodParameter(containHidden)) {
                    return false;
                }
            }
            return true;
        }
        if (this.currentParameterIndex < this.MethodParameters.length - 1) {
            this.currentParameterIndex++;
            if (
                (this.methodParameterHandler.MethodParameter_IsHidden && !containHidden) ||
                this.codeModel.globalParameters.indexOf(
                    this.methodParameterHandler.MethodParameter,
                ) > -1
            ) {
                if (this.SelectNextMethodParameter(containHidden)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    public EnterSubMethodParameters(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        const subParams = this.GetSubParameters(param);
        if (isNullOrUndefined(subParams)) {
            return false;
        } else {
            if (isNullOrUndefined(this.substack)) {
                this.substack = new Array<[Parameter[], number]>();
            }
            // reserve previous status
            if (!isNullOrUndefined(this.submethodparameters)) {
                this.substack.push([this.submethodparameters, this.currentSubOptionIndex]);
            }
            this.submethodparameters = subParams;
            this.currentSubOptionIndex = 0;
            return true;
        }
    }

    public GetSubParameters(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): Parameter[] {
        // this should only works for
        // 1. objects with simple properties
        // 2. or objects with arrays as properties but has simple element type
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        if (!this.parameterHandler.Parameter_IsList(param)) {
            return null;
        }
        if (!this.parameterHandler.Parameter_IsListOfSimple(param)) {
            return null;
        }

        let submethodparameters = [];
        if (
            this.parameterHandler.Parameter_Type(param) === SchemaType.Array ||
            this.parameterHandler.Parameter_Type(param) === SchemaType.Dictionary
        ) {
            if (param.schema['elementType'].type === SchemaType.Object) {
                if (!isNullOrUndefined(param.schema?.['elementType']?.properties)) {
                    submethodparameters = param.schema?.['elementType']?.properties;
                }
                for (const parent of values(param.schema?.['elementType']?.parents?.all)) {
                    if (isNullOrUndefined(parent['properties'])) {
                        continue;
                    }
                    submethodparameters = submethodparameters.concat(parent['properties']);
                }
            }
        } else if (this.parameterHandler.Parameter_Type(param) === SchemaType.Object) {
            if (!isNullOrUndefined(param.schema['properties'])) {
                submethodparameters = param.schema['properties'];
            }
            for (const parent of values(param.schema?.['parents']?.all)) {
                if (isNullOrUndefined(parent['properties'])) {
                    continue;
                }
                submethodparameters = submethodparameters.concat(parent['properties']);
            }
        }
        if (submethodparameters.length === 0) {
            return null;
        }
        return submethodparameters;
    }

    public ExitSubMethodParameters(): boolean {
        if (!isNullOrUndefined(this.submethodparameters)) {
            if (this.substack.length > 0) {
                const lastsub = this.substack.last;
                this.submethodparameters = lastsub[0];
                this.currentSubOptionIndex = lastsub[1];
                this.substack.pop();
            } else {
                this.submethodparameters = null;
                this.currentSubOptionIndex = -1;
            }
            return true;
        }
        return false;
    }

    public isComplexSchema(type: string, param: any): boolean {
        if (
            type === SchemaType.Array ||
            type === SchemaType.Object ||
            type === SchemaType.Dictionary ||
            type === SchemaType.Any ||
            param?.language?.['cli']?.json === true
        ) {
            return true;
        } else {
            return false;
        }
    }

    public get MethodParameters(): Array<Parameter> {
        if (isNullOrUndefined(this.Request) || isNullOrUndefined(this.Request.parameters)) {
            return this.methodHandler.Method.parameters;
        }
        return this.methodHandler.Method.parameters.concat(this.Request.parameters);
    }

    public MethodParameters_AddPolySubClass(oriParam: Parameter, params: Parameter[]): boolean {
        if (isNullOrUndefined(params) || isNullOrUndefined(oriParam) || params.length <= 0) {
            return false;
        }
        if (this.methodHandler.Method.parameters.indexOf(oriParam) > -1) {
            this.methodHandler.Method.parameters.splice(
                this.methodHandler.Method.parameters.indexOf(oriParam) + 1,
                0,
                ...params,
            );
            return true;
        }
        if (!isNullOrUndefined(this.Request) && !isNullOrUndefined(this.Request.parameters)) {
            if (this.Request.parameters.indexOf(oriParam) > -1) {
                this.Request.parameters.splice(
                    this.Request.parameters.indexOf(oriParam) + 1,
                    0,
                    ...params,
                );
                return true;
            }
        }
        return false;
    }

    public get SubMethodParameter(): Parameter {
        if (!isNullOrUndefined(this.submethodparameters)) {
            return this.submethodparameters[this.currentSubOptionIndex];
        }
        return null;
    }

    //= ================================================================================================================
    // Top Level Python Related Information
    //
    // Most of the information included here should be either produced by Python namer, or come from readme.az.md file.
    // Detailed descriptions below.
    //= ================================================================================================================

    public GetModuleOperationName(
        group: OperationGroup = this.commandGroupHandler.CommandGroup,
    ): string {
        return ToSnakeCase(group.language.default.name);
    }

    public GetModuleOperationNamePython(): string {
        if (this.commandGroupHandler.CommandGroup_CliKey === '') {
            return this.codeModel.info['python_title'];
        }
        if (
            this.configHandler.SDK_IsTrack1 &&
            !isNullOrUndefined(this.commandGroupHandler.CommandGroup.language['cli']?.track1_name)
        ) {
            return this.commandGroupHandler.CommandGroup.language['cli']?.track1_name;
        }
        return this.commandGroupHandler.CommandGroup.language.python.name;
    }

    public GetModuleOperationNamePythonUpper(): string {
        if (
            this.configHandler.SDK_IsTrack1 &&
            !isNullOrUndefined(
                this.commandGroupHandler.CommandGroup.language['cli']?.track1_class_name,
            )
        ) {
            return this.commandGroupHandler.CommandGroup.language['cli']?.track1_class_name;
        }
        return this.commandGroupHandler.CommandGroup.language.python.className;
    }

    public get PythonMgmtClient(): string {
        return this.codeModel.info['pascal_case_title'];
    }

    //= ================================================================================================================
    // Example / Test Scenario related interface.
    //
    // This interface enumerates examples related to currently selected command.
    // It should be implemented when example processor implementation is in place.
    //= ================================================================================================================

    public SelectFirstExample(): boolean {
        if (this.methodHandler.Method.extensions === undefined) {
            return false;
        }

        const example = this.methodHandler.Method.extensions['x-ms-examples'];
        if (example && example.length > 0) {
            this.currentExampleIndex = 0;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }
    }

    public SelectNextExample(): boolean {
        const example = this.methodHandler.Method.extensions['x-ms-examples'];
        if (example && this.currentExampleIndex < example.length - 1) {
            this.currentExampleIndex++;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }
    }

    public SelectFirstAzExample(): boolean {
        if (this.methodHandler.Method.extensions === undefined) {
            return false;
        }

        const example = this.methodHandler.Method['az-examples'];
        if (example && example.length > 0) {
            this.currentAzExampleIndex = 0;
            return true;
        } else {
            this.currentAzExampleIndex = -1;
            return false;
        }
    }

    public SelectNextAzExample(): boolean {
        const example = this.methodHandler.Method['az-examples'];
        if (example && this.currentAzExampleIndex < example.length - 1) {
            this.currentAzExampleIndex++;
            return true;
        } else {
            this.currentAzExampleIndex = -1;
            return false;
        }
    }

    public get Examples(): unknown {
        const extensions = this.methodHandler.Method.extensions;
        return extensions && 'x-ms-examples' in extensions ? extensions['x-ms-examples'] : {};
    }

    public get ExampleAmount(): number {
        return Object.keys(this.Examples).length;
    }

    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersList(): MethodParam[] {
        const methodParamList: MethodParam[] = [];

        if (this.SelectFirstMethodParameter()) {
            do {
                if (
                    (this.methodParameterHandler.MethodParameter.implementation === 'Method' ||
                        this.methodParameterHandler.MethodParameter['polyBaseParam']) &&
                    !this.methodParameterHandler.MethodParameter_IsFlattened &&
                    this.methodParameterHandler.MethodParameter?.schema?.type !== 'constant'
                ) {
                    let submethodparameters = null;
                    if (this.EnterSubMethodParameters()) {
                        submethodparameters = this.submethodparameters;
                        this.ExitSubMethodParameters();
                    }
                    methodParamList.push(
                        new MethodParam(
                            this.methodParameterHandler.MethodParameter,
                            this.parameterHandler.Parameter_IsList(
                                this.methodParameterHandler.MethodParameter,
                            ),
                            this.methodParameterHandler.MethodParameter_IsListOfSimple ||
                                this.methodParameterHandler.MethodParameter_IsSimpleArray,
                            submethodparameters,
                            this.currentParameterIndex >=
                                this.methodHandler.Method.parameters.length,
                        ),
                    );
                }
            } while (this.SelectNextMethodParameter());
        }
        return methodParamList;
    }

    public GetExampleParameters(exampleObj): ExampleParam[] {
        const parameters: ExampleParam[] = [];
        const methodParamList: MethodParam[] = this.GetMethodParametersList();
        Object.entries(exampleObj.parameters).forEach(([paramName, paramValue]) => {
            this.FlattenExampleParameter(methodParamList, parameters, paramName, paramValue, []);
        });
        return parameters;
    }

    private isDiscriminator(param: any): boolean {
        return this.commandHandler.Command_GetOriginalOperation &&
            param?.targetProperty?.isDiscriminator
            ? true
            : false;
    }

    private AddExampleParameter(
        methodParam: MethodParam,
        exampleParam: ExampleParam[],
        value: any,
        polySubParam: MethodParam,
        ancestors: string[],
        rawValue: any,
    ): boolean {
        if (isNullOrUndefined(methodParam)) return false;
        let isList: boolean = methodParam.isList;
        let isSimpleListOrArray: boolean = methodParam.isSimpleListOrArray;
        let defaultName: string = methodParam.value.language['cli'].cliKey;
        let name: string = this.parameterHandler.Parameter_MapsTo(methodParam.value);
        if (
            !isNullOrUndefined(methodParam.value.language?.['az']?.alias) &&
            Array.isArray(methodParam.value.language['az'].alias) &&
            methodParam.value.language['az'].alias.length > 0
        ) {
            name = methodParam.value.language['az'].alias[0];
        }
        let realParam = methodParam;
        if (polySubParam) {
            isList = polySubParam.isList;
            isSimpleListOrArray = polySubParam.isSimpleListOrArray;
            defaultName = polySubParam.value.language['cli'].cliKey;
            name = this.parameterHandler.Parameter_MapsTo(polySubParam.value);
            if (
                !isNullOrUndefined(polySubParam.value.language?.['az']?.alias) &&
                Array.isArray(polySubParam.value.language['az'].alias) &&
                polySubParam.value.language['az'].alias.length > 0
            ) {
                name = polySubParam.value.language['az'].alias[0];
            }
            realParam = polySubParam;
        }

        function toActionString(
            model: CodeModelCliImpl,
            dict,
            seperator = ' ',
            initKeys = undefined,
        ): [string, string[]] {
            let ret = '';
            let keys: string[] = [];
            if (!isNullOrUndefined(initKeys)) {
                keys = initKeys;
            }
            for (const k in dict) {
                let cliName = null;
                for (const param of [methodParam, polySubParam]) {
                    if (param?.submethodparameters) {
                        for (const submethodProperty of param.submethodparameters) {
                            if (
                                submethodProperty.language['cli'].cliKey.toLowerCase() ===
                                k.toLowerCase()
                            ) {
                                cliName = model.parameterHandler.Parameter_NameAz(
                                    submethodProperty,
                                );
                            }
                        }
                    }
                }
                if (!cliName) {
                    // If no submethodparameters, keep all KEYs as the origin name
                    // This is for type of schema.Dictionary
                    cliName = k;
                }
                if (dict[k] instanceof Array) {
                    for (const v of dict[k]) {
                        if (ret.length > 0) {
                            ret += seperator;
                        }
                        ret += `${cliName}=${ToJsonString(v)}`;
                    }
                } else {
                    if (ret.length > 0) {
                        ret += seperator;
                    }
                    const v = ToJsonString(dict[k]);
                    // if (v.startsWith("\"")) {
                    //     v = v.substr(1, v.length-2);
                    // }
                    ret += `${cliName}=${v}`;
                }
                if (!keys.includes(cliName)) keys.push(cliName);
            }
            return [ret, keys];
        }

        let handled = false;
        if (isList) {
            if (isSimpleListOrArray) {
                let keys = [];
                let ret = '';
                if (value instanceof Array) {
                    // spread list
                    handled = true;
                    if (this.parameterHandler.Parameter_IsShorthandSyntax(realParam.value)) {
                        for (let i = 0; i < value.length; i++) {
                            let instanceString: string;
                            [instanceString, keys] = toActionString(this, value[i], ',', keys);
                            instanceString = instanceString.trim();
                            if (ret.length > 0 && instanceString.length > 0) ret += ' ';
                            ret += instanceString;
                        }
                        exampleParam.push(
                            new ExampleParam(
                                name,
                                ret,
                                false,
                                KeyValueType.ShorthandSyntax,
                                keys,
                                defaultName,
                                realParam,
                                ancestors,
                                value,
                            ),
                        );
                    } else if (this.parameterHandler.Parameter_IsSimpleArray(realParam.value)) {
                        if (value.length > 0) {
                            // use value only when it's lenght > 0
                            for (let i = 0; i < value.length; i++) {
                                ret += ToJsonString(value[i]) + ' ';
                            }
                            ret = ret.trim();
                            exampleParam.push(
                                new ExampleParam(
                                    name,
                                    ret,
                                    false,
                                    KeyValueType.SimpleArray,
                                    [],
                                    defaultName,
                                    realParam,
                                    ancestors,
                                    value,
                                ),
                            );
                        }
                    } else {
                        for (let i = 0; i < value.length; i++) {
                            this.AddExampleParameter(
                                methodParam,
                                exampleParam,
                                value[i],
                                polySubParam,
                                ancestors,
                                rawValue[i],
                            );
                        }
                    }
                } else if (typeof rawValue === 'object') {
                    // KEY=VALUE form
                    handled = true;
                    if (this.parameterHandler.Parameter_IsPositional(realParam.value)) {
                        keys = this.parameterHandler.Parameter_PositionalKeys(
                            realParam.value,
                            realParam.submethodparameters,
                        );
                        for (const k of keys) {
                            ret += ' ';
                            FIND_PARAM: for (const param of [polySubParam, methodParam]) {
                                if (param?.submethodparameters) {
                                    for (const subMethodParam of param.submethodparameters) {
                                        if (
                                            this.parameterHandler.Parameter_NamePython(
                                                subMethodParam,
                                            ) === k
                                        ) {
                                            ret += ToJsonString(
                                                rawValue[subMethodParam.language['cli'].cliKey],
                                            );
                                            break FIND_PARAM;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ret = ret.trim();
                    if (ret.trim().length > 0) {
                        exampleParam.push(
                            new ExampleParam(
                                name,
                                ret,
                                false,
                                KeyValueType.PositionalKey,
                                keys,
                                defaultName,
                                realParam,
                                ancestors,
                                value,
                            ),
                        );
                    } else {
                        /// /////////
                        [ret, keys] = toActionString(this, value);
                        if (ret.length > 0) {
                            exampleParam.push(
                                new ExampleParam(
                                    name,
                                    ret,
                                    false,
                                    KeyValueType.Classic,
                                    keys,
                                    defaultName,
                                    realParam,
                                    ancestors,
                                    value,
                                ),
                            );
                        }
                    }
                }
            }
            if (!handled) {
                if (typeof value === 'string') {
                    exampleParam.push(
                        new ExampleParam(
                            name,
                            value,
                            false,
                            KeyValueType.No,
                            [],
                            defaultName,
                            realParam,
                            ancestors,
                            value,
                        ),
                    );
                } else {
                    // JSON form
                    exampleParam.push(
                        new ExampleParam(
                            name,
                            JSON.stringify(value)
                                .split(/[\r\n]+/)
                                .join(''),
                            true,
                            KeyValueType.No,
                            [],
                            defaultName,
                            realParam,
                            ancestors,
                            value,
                        ),
                    );
                }
            }
        } else if (typeof value !== 'object') {
            exampleParam.push(
                new ExampleParam(
                    name,
                    value,
                    false,
                    KeyValueType.No,
                    [],
                    defaultName,
                    realParam,
                    ancestors,
                    value,
                ),
            );
        } else {
            // ignore object values if not isList.
            return false;
        }
        return true;
    }

    private FlattenProperty(paramSchema: any, exampleValue: any) {
        if (paramSchema?.type === 'array' && exampleValue instanceof Array) {
            return exampleValue.map((x) => this.FlattenProperty(paramSchema?.elementType, x));
        }
        if (
            ['object', 'dictionary'].indexOf(paramSchema?.type) >= 0 &&
            paramSchema?.properties &&
            typeof exampleValue === 'object' &&
            !(exampleValue instanceof Array)
        ) {
            const ret = deepCopy(exampleValue);
            for (const subProperty of paramSchema?.properties) {
                if (subProperty.flattenedNames && subProperty.flattenedNames.length > 0) {
                    let subValue = exampleValue;
                    let i = 0;
                    for (; i < subProperty.flattenedNames.length; i++) {
                        if (isNullOrUndefined(subValue)) break;
                        const k = subProperty.flattenedNames[i];
                        const v = subValue[k];
                        if (v === undefined) break;
                        subValue = v;
                    }
                    if (i === subProperty.flattenedNames.length) {
                        ret[subProperty?.language['cli'].cliKey] = subValue;
                    }
                }
            }
            for (const subProperty of paramSchema?.properties) {
                if (subProperty.flattenedNames && subProperty.flattenedNames.length > 0) {
                    delete ret[subProperty.flattenedNames[0]];
                }
            }
            for (const subProperty of paramSchema?.properties) {
                const k = subProperty?.language['cli'].cliKey;
                if (exampleValue && exampleValue[k]) {
                    exampleValue[k] = this.FlattenProperty(subProperty, exampleValue[k]);
                }
            }
            return ret;
        }
        return deepCopy(exampleValue);
    }

    private checkPathToProperty(methodParam: MethodParam, ancestors: string[]): boolean {
        return (
            ancestors.length > 0 &&
            isEqualStringArray(
                methodParam.value.pathToProperty.map((x) => x?.language?.['az']?.name),
                ancestors.slice(1),
            )
        );
    }

    private checkFlattenedNames(methodParam: MethodParam, ancestors: string[]): boolean {
        const flattenedNames = methodParam.value.targetProperty.flattenedNames;
        return (
            !isNullOrUndefined(flattenedNames) &&
            flattenedNames.length === ancestors.length &&
            isEqualStringArray(
                methodParam.value.targetProperty.flattenedNames.slice(0, -1),
                ancestors.slice(1),
            )
        );
    }

    private matchMethodParam(
        methodParamList: MethodParam[],
        paramName: string,
        ancestors: string[],
    ): MethodParam[] {
        const ret: MethodParam[] = [];
        if (!paramName) return ret;
        for (const methodParam of methodParamList) {
            let serializedName = methodParam.value.targetProperty?.serializedName;
            if (!serializedName) serializedName = methodParam.value.language['cli'].cliKey;
            // let methodParam_key = methodParam.value.language['cli'].cliKey;
            if (serializedName.toLowerCase() === paramName.toLowerCase()) {
                if (
                    !('pathToProperty' in methodParam.value) ||
                    this.checkPathToProperty(methodParam, ancestors) ||
                    this.checkFlattenedNames(methodParam, ancestors)
                ) {
                    ret.push(methodParam);
                }
            }
        }
        return ret;
    }

    public FlattenExampleParameter(
        methodParamList: MethodParam[],
        exampleParam: ExampleParam[],
        name: string,
        value: any,
        ancestors: string[],
    ) {
        for (const methodParam of this.matchMethodParam(methodParamList, name, ancestors)) {
            let polySubParam: MethodParam = null;
            let netValue =
                typeof value === 'object' && !isNullOrUndefined(value) ? deepCopy(value) : value;
            let rawValue = deepCopy(netValue);
            if (methodParam.value['isPolyOfSimple']) {
                const keyToMatch =
                    methodParam.value.schema.discriminator?.property?.language?.default?.name;
                if (keyToMatch) {
                    for (const methodParam of methodParamList) {
                        const polySubParamObj = methodParam.value;
                        if (polySubParamObj.schema.extensions) {
                            const valueToMatch =
                                polySubParamObj.schema.extensions['x-ms-discriminator-value'];
                            if (netValue[keyToMatch] === valueToMatch) {
                                polySubParam = methodParam;
                                delete netValue[keyToMatch];
                                break;
                            }
                        }
                    }
                }
            }
            if (polySubParam) {
                netValue = this.FlattenProperty(polySubParam.value?.schema, netValue);
                rawValue = this.FlattenProperty(polySubParam.value?.schema, rawValue);
            } else {
                netValue = this.FlattenProperty(methodParam.value?.schema, netValue);
                rawValue = this.FlattenProperty(methodParam.value?.schema, rawValue);
            }
            if (
                'pathToProperty' in methodParam.value &&
                ancestors.length - methodParam.value.pathToProperty.length === 1
            ) {
                // if the method parameter has 'pathToProperty', check the path with example parameter full path.
                if (this.checkPathToProperty(methodParam, ancestors)) {
                    // exampleParam.set(name, value);
                    this.AddExampleParameter(
                        methodParam,
                        exampleParam,
                        netValue,
                        polySubParam,
                        ancestors,
                        rawValue,
                    );
                    return;
                }
            } else if (
                'targetProperty' in methodParam.value &&
                'flattenedNames' in methodParam.value.targetProperty &&
                ancestors.length - methodParam.value.targetProperty.flattenedNames.length === 0 &&
                ancestors.length > 0
            ) {
                // if the method parameter has 'flattenedNames', check the names (except the last name) with example parameter full path.
                if (this.checkFlattenedNames(methodParam, ancestors)) {
                    // exampleParam.set(name, value);
                    this.AddExampleParameter(
                        methodParam,
                        exampleParam,
                        netValue,
                        polySubParam,
                        ancestors,
                        rawValue,
                    );
                    return;
                }
            } else if (ancestors.length === 0) {
                // exampleParam.set(name, value);
                if (
                    this.AddExampleParameter(
                        methodParam,
                        exampleParam,
                        netValue,
                        polySubParam,
                        ancestors,
                        rawValue,
                    )
                )
                    return;
            }
        }

        if (!isNullOrUndefined(value) && typeof value === 'object') {
            for (const subName in value) {
                this.FlattenExampleParameter(
                    methodParamList,
                    exampleParam,
                    subName,
                    value[subName],
                    ancestors.concat(name),
                );
            }
        }
    }

    public ConvertToCliParameters(
        exampleParams: ExampleParam[],
        commandGroup: string,
    ): ExampleParam[] {
        const ret: ExampleParam[] = [];
        for (const param of exampleParams) {
            // Object.entries(exampleParams).forEach(() => {
            let paramName = ToSnakeCase(param.name);
            if (paramName.endsWith('_name')) {
                if (paramName === 'resource_group_name') {
                    paramName = 'resource_group';
                }
            }
            paramName = paramName.split('_').join('-');
            ret.push(
                new ExampleParam(
                    '--' + paramName,
                    param.value,
                    param.isJson,
                    param.keyValue,
                    param.keys,
                    param.defaultName,
                    param.methodParam,
                    param.ancestors,
                    param.rawValue,
                ),
            );
        }
        return ret;
    }

    private filterExampleByPoly(exampleObj: any, example: CommandExample): boolean {
        function getPolyClass(model): string {
            const cliKey = model.methodHandler.Method.language['cli'].cliKey;
            if (cliKey) {
                const names = cliKey.split('#');
                if (names && names.length > 1) {
                    return names[names.length - 1];
                }
            }
            return '';
        }
        const valueToMatch = getPolyClass(this);
        if (!valueToMatch) return true;

        function matchPolyClass(example: CommandExample, keyToMatch: string, valueToMatch: string) {
            for (const param of example.Parameters) {
                if (
                    (('--' + keyToMatch).toLowerCase() === param.name.toLowerCase() ||
                        ('--' + keyToMatch + '-').toLowerCase() === param.name.toLowerCase()) &&
                    typeof param.value === 'string'
                ) {
                    return valueToMatch.toLowerCase() === param.value.toLowerCase();
                }
            }
            return true;
        }

        // check polymophism here
        const originalOperation = this.methodHandler.Method_GetOriginalOperation;
        if (!isNullOrUndefined(originalOperation)) {
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (
                        !isNullOrUndefined(
                            this.methodParameterHandler.MethodParameter.extensions?.[
                                'cli-poly-as-resource-base-schema'
                            ],
                        )
                    ) {
                        const originalSchema = this.methodParameterHandler.MethodParameter
                            .extensions?.['cli-poly-as-resource-base-schema'];
                        const keyToMatch = (originalSchema as any).discriminator.property.language
                            .default.name; // type
                        if (!matchPolyClass(example, keyToMatch, valueToMatch)) {
                            return false;
                        }
                    }
                } while (this.SelectNextMethodParameter());
            }
        }
        return true;
    }

    public GetExamples(includeGenerated: boolean): CommandExample[] {
        if (
            !isNullOrUndefined(this.methodHandler.Method_AzExamples) &&
            this.methodHandler.Method_AzExamples.length > 0 &&
            includeGenerated
        ) {
            return this.methodHandler.Method_AzExamples;
        }
        const examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, exampleObj]) => {
                if (includeGenerated || !isGeneratedExampleId(id)) {
                    const example = this.CreateCommandExample(id, exampleObj);
                    if (!isNullOrUndefined(example)) examples.push(example);
                }
            });
        }
        if (includeGenerated) this.methodHandler.Method_AzExamples = examples;
        return examples;
    }

    public GetExampleById(id: string, exampleObj: any): CommandExample {
        let ret: CommandExample = undefined;
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([_id, _exampleObj]) => {
                if (!isNullOrUndefined(ret)) return;
                if (!isNullOrUndefined(id) && id.toLowerCase() !== _id.toLowerCase()) return;
                if (!isNullOrUndefined(exampleObj)) _exampleObj = exampleObj;
                const example = this.CreateCommandExample(_id, _exampleObj);
                if (!isNullOrUndefined(example)) ret = example;
            });
        }
        return ret;
    }

    public CreateCommandExample(id: string, exampleObj: any): CommandExample {
        function forUpdate(model: CodeModelCliImpl, exampleName: string): boolean {
            const lowercase: string = exampleName.toLowerCase();
            return (
                lowercase.endsWith('_update') ||
                (model.ExampleAmount > 1 &&
                    lowercase.indexOf('update') >= 0 &&
                    lowercase.indexOf('create') < 0)
            );
        }

        const example = new CommandExample();
        example.Method = this.commandHandler.Command_MethodName;
        example.Id = `/${this.commandGroupHandler.CommandGroup_Key}/${this.methodHandler.Method_HttpMethod}/${id}`;
        example.Title = exampleObj.title || id;
        example.Path = this.methodHandler.Method_Path;
        example.HttpMethod = this.methodHandler.Method_HttpMethod;
        example.ResourceClassName = this.commandGroupHandler.CommandGroup_Key;
        const params = this.GetExampleParameters(exampleObj);
        example.Parameters = this.ConvertToCliParameters(
            params,
            this.commandGroupHandler.CommandGroup_Key,
        );
        example.MethodResponses = this.methodHandler.Method.responses || [];
        example.Method_IsLongRun = !!this.methodHandler.Method.extensions?.[
            'x-ms-long-running-operation'
        ];
        example.ExampleObj = exampleObj;
        if (this.methodHandler.Method_GetSplitOriginalOperation) {
            // filter example by name for generic createorupdate
            if (
                this.commandHandler.Command_MethodName.toLowerCase() === 'update' &&
                !forUpdate(this, id)
            ) {
                return;
            }
            if (
                this.commandHandler.Command_MethodName.toLowerCase() !== 'update' &&
                forUpdate(this, id)
            ) {
                return;
            }
        }
        if (this.filterExampleByPoly(exampleObj, example)) {
            for (let i = 0; i < example.Parameters.length; i++) {
                if (this.isDiscriminator(example.Parameters[i].methodParam.value)) {
                    example.Parameters.splice(i, 1);
                    i--;
                }
            }
            example.commandStringItems = this.GetExampleItems(example, false, undefined);
            example.CommandString = example.commandStringItems.join(' ');
            example.WaitCommandString = this.GetExampleWait(example).join(' ');
            return example;
        }
        return undefined;
    }

    public GetExampleChecks(example: CommandExample): string[] {
        const ret: string[] = [];
        if (!this.configHandler.GenChecks) return ret;
        let resourceObjectName = undefined;
        for (const param of example.Parameters) {
            if (
                example.ResourceClassName &&
                this.resourcePool.isResource(param.defaultName, param.rawValue) ===
                    example.ResourceClassName
            ) {
                resourceObjectName = param.value;
            }
        }

        const resourceObject = this.resourcePool.findResource(
            example.ResourceClassName,
            resourceObjectName,
            ObjectStatus.Created,
        );
        if (resourceObject) {
            ret.push(...resourceObject.getCheckers(this.resourcePool, example));
        }
        ret.push(...this.resourcePool.getListCheckers(example));
        return ret;
    }

    public GetExampleItems(
        example: CommandExample,
        isTest: boolean,
        commandParams: any,
        minimum = false,
    ): string[] {
        const parameters: string[] = [];
        parameters.push('az ' + this.commandHandler.Command_Name);

        let hasRG = false;
        let resourceObjectName;
        for (const param of example.Parameters) {
            if (
                minimum &&
                !this.parameterHandler.Parameter_IsRequiredOrCLIRequired(param.methodParam.value)
            )
                continue;
            let paramValue = param.value;
            if (isTest || this.configHandler.FormalizeNames) {
                let replacedValue = this.resourcePool.addParamResource(
                    param.defaultName,
                    paramValue,
                    param.isJson,
                    param.keyValue,
                    isTest,
                );
                if (replacedValue === paramValue) {
                    replacedValue = this.resourcePool.addEndpointResource(
                        paramValue,
                        param.isJson,
                        param.keyValue,
                        [],
                        [],
                        param,
                        isTest,
                    );
                }
                paramValue = replacedValue;
                param.replacedValue = replacedValue;
            }
            let slp = paramValue;
            if (param.keyValue === KeyValueType.No) {
                slp = ToJsonString(slp);
            }
            parameters.push(param.name + ' ' + slp);

            if (['--resource-group', '-g'].indexOf(param.name) >= 0) {
                hasRG = true;
            }

            if (
                example.ResourceClassName &&
                this.resourcePool.isResource(param.defaultName, param.rawValue) ===
                    example.ResourceClassName
            ) {
                resourceObjectName = param.value;
            }
        }

        if (
            isTest &&
            !hasRG &&
            commandParams &&
            commandParams[this.commandHandler.Command_Name] &&
            commandParams[this.commandHandler.Command_Name].has('resourceGroupName')
        ) {
            parameters.push('-g ""');
        }

        if (isTest) {
            const resourceObject = this.resourcePool.findResource(
                example.ResourceClassName,
                resourceObjectName,
                undefined,
            );
            if (resourceObject) {
                const httpMethod = example.HttpMethod.toLowerCase();
                if (['put', 'post', 'patch'].indexOf(httpMethod) >= 0) {
                    if (httpMethod === 'post') {
                        resourceObject.exampleParams = [];
                    }
                    for (const param of example.Parameters) {
                        if (
                            minimum &&
                            !this.parameterHandler.Parameter_IsRequiredOrCLIRequired(
                                param.methodParam.value,
                            )
                        )
                            continue;
                        resourceObject.addOrUpdateParam(param);
                    }
                    resourceObject.testStatus = ObjectStatus.Created;
                }
                if (httpMethod === 'delete') {
                    resourceObject.testStatus = ObjectStatus.Deleted;
                }
            }
        }

        return parameters;
    }

    public GetExampleWait(example: CommandExample): string[] {
        const parameters: string[] = [];
        let foundResource = false;
        if (
            example.HttpMethod.toLowerCase() === 'put' &&
            example.Method_IsLongRun &&
            example.MethodResponses.length > 0 &&
            (example.MethodResponses[0].schema?.properties || []).find((property) => {
                return property?.language?.['cli']?.cliKey === 'provisioningState';
            })
        ) {
            let words = this.commandHandler.Command_Name.split(' ');
            words = words.slice(0, words.length - 1);
            words.push('wait');
            parameters.push(`az ${words.join(' ')} --created`);
            for (const param of example.Parameters) {
                const paramKey = param.methodParam.value.language?.['cli']?.cliKey;
                if (
                    paramKey === 'resourceGroupName' ||
                    this.resourcePool.isResource(paramKey, param.rawValue) ===
                        example.ResourceClassName
                ) {
                    let paramValue = param.value;
                    let replacedValue = this.resourcePool.addParamResource(
                        param.defaultName,
                        paramValue,
                        param.isJson,
                        param.keyValue,
                    );
                    if (replacedValue === paramValue) {
                        replacedValue = this.resourcePool.addEndpointResource(
                            paramValue,
                            param.isJson,
                            param.keyValue,
                            [],
                            [],
                            param,
                        );
                    }
                    paramValue = replacedValue;
                    let slp = paramValue;
                    if (param.keyValue === KeyValueType.No) {
                        slp = ToJsonString(slp);
                    }
                    parameters.push(param.name + ' ' + slp);
                }
                if (
                    this.resourcePool.isResource(paramKey, param.rawValue) ===
                    example.ResourceClassName
                )
                    foundResource = true;
            }
        }
        return foundResource ? parameters : [];
    }

    public GetPreparerEntities(): any[] {
        return this.resourcePool.createPreparerEntities();
    }

    public GetSubscriptionKey(): string {
        if (this.resourcePool.useSubscription) {
            return ResourcePool.KEY_SUBSCRIPTIONID;
        } else {
            return null;
        }
    }

    public FindExampleById(
        id: string,
        commandParams: any,
        examples: CommandExample[],
        minimum = false,
        step: TestStepExampleFileRestCall = undefined,
    ): string[][] {
        const ret: string[][] = [];
        this.GetAllExamples(
            id,
            (example) => {
                examples.push(example);
                ret.push(this.GetExampleItems(example, true, commandParams, minimum));
            },
            step?.exampleTemplate,
        );
        return ret;
    }

    public FindExampleWaitById(
        id: string,
        step: TestStepExampleFileRestCall = undefined,
    ): string[][] {
        const ret: string[][] = [];
        this.GetAllExamples(
            id,
            (example) => {
                const waitCmd = this.GetExampleWait(example);
                if (waitCmd.length > 0) ret.push(waitCmd);
            },
            step?.exampleTemplate,
        );
        return ret;
    }

    public GatherInternalResource() {
        const internalResources = {}; // resource_key --> list of resource languages
        this.GetAllMethods(null, () => {
            if (!(this.commandGroupHandler.CommandGroup_Key in internalResources)) {
                internalResources[this.commandGroupHandler.CommandGroup_Key] = [
                    this.commandGroupHandler.CommandGroup_Key,
                ];
            }
            // let commands = this.CommandGroup_Name.split(" ");
            // let resourceName = commands[commands.length - 1] + "-name";
            const resourceName = this.commandGroupHandler.CommandGroup_DefaultName + 'Name';
            if (
                internalResources[this.commandGroupHandler.CommandGroup_Key].indexOf(resourceName) <
                0
            ) {
                internalResources[this.commandGroupHandler.CommandGroup_Key].push(resourceName);
            }
        });
        this.resourcePool.addResourcesInfo(internalResources);

        // find dependency relationships of internalResources
        this.GetAllMethods(null, () => {
            const dependResources = [];
            const dependParameters = [];

            const examples = this.GetExamples(false);
            // recognize depends by endpoint in examples
            for (const example of examples) {
                for (const param of example.Parameters) {
                    const resources = [];
                    this.resourcePool.addEndpointResource(
                        param.value,
                        param.isJson,
                        param.keyValue,
                        [],
                        resources,
                        param,
                    );
                    for (const onResource of resources) {
                        if (
                            onResource !== this.commandGroupHandler.CommandGroup_Key &&
                            dependResources.indexOf(onResource) < 0
                        ) {
                            dependResources.push(onResource);
                            dependParameters.push(param.name);
                        }
                    }
                    this.resourcePool.addParamResource(
                        param.defaultName,
                        param.value,
                        param.isJson,
                        param.keyValue,
                    );
                }
            }

            // recognize depends by parameter name'
            const createdObjectNames = [];
            const isCreateMehod = this.methodHandler.Method_HttpMethod === 'put';
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (
                        this.methodParameterHandler.MethodParameter.implementation === 'Method' &&
                        !this.methodParameterHandler.MethodParameter_IsFlattened &&
                        this.methodParameterHandler.MethodParameter?.schema?.type !== 'constant'
                    ) {
                        const paramName = this.methodParameterHandler.MethodParameter.language[
                            'cli'
                        ].cliKey;
                        const onResource = this.resourcePool.isResource(paramName, undefined);
                        for (const example of examples) {
                            for (const param of example.Parameters) {
                                if (
                                    onResource &&
                                    onResource !== this.commandGroupHandler.CommandGroup_Key &&
                                    dependResources.indexOf(onResource) < 0
                                ) {
                                    // the resource is a dependency only when it's a parameter in an example.
                                    if (
                                        paramName === param.defaultName &&
                                        dependResources.indexOf(onResource) < 0
                                    ) {
                                        dependResources.push(onResource);
                                        dependParameters.push(paramName);
                                    }
                                }
                                if (
                                    isCreateMehod &&
                                    onResource &&
                                    onResource === this.commandGroupHandler.CommandGroup_Key &&
                                    createdObjectNames.indexOf(param.value) < 0
                                ) {
                                    createdObjectNames.push(param.value);
                                }
                            }
                        }
                    }
                } while (this.SelectNextMethodParameter());
            }

            this.resourcePool.setResourceDepends(
                this.commandGroupHandler.CommandGroup_Key,
                dependResources,
                dependParameters,
                createdObjectNames,
            );
        });

        if (isNullOrUndefined(this._defaultTestScenario)) {
            const allExamples = this.GetAllExamples();
            this._defaultTestScenario = GenerateDefaultTestScenario(allExamples);
            this._defaultTestScenario = GenerateDefaultTestScenarioByDependency(
                allExamples,
                this.resourcePool,
                this._defaultTestScenario,
            );
            this.SortExamplesByDependency();
            PrintTestScenario(this._defaultTestScenario);
        }

        if (!this._configuredScenario && isNullOrUndefined(this._testScenario)) {
            this._testScenario = GroupTestScenario(
                this._defaultTestScenario,
                this.extensionHandler.Extension_NameUnderscored,
            );
        }

        const commandParams = {};
        this.GetAllMethods(null, () => {
            if (!commandParams[this.commandHandler.Command_Name])
                commandParams[this.commandHandler.Command_Name] = new Set();
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (
                        (this.methodParameterHandler.MethodParameter.implementation === 'Method' ||
                            (this.methodParameterHandler.MethodParameter as any).polyBaseParam) &&
                        !this.methodParameterHandler.MethodParameter_IsFlattened &&
                        this.methodParameterHandler.MethodParameter?.schema?.type !== 'constant'
                    ) {
                        commandParams[this.commandHandler.Command_Name].add(
                            this.methodParameterHandler.MethodParameter.language['cli'].cliKey,
                        );
                    }
                } while (this.SelectNextMethodParameter());
            }
        });
        return commandParams;
    }

    public SortExamplesByDependency() {
        const dependOn = (exampleA: CommandExample, exampleB: CommandExample): boolean => {
            // TODO: check dependency by object
            return this.resourcePool.isDependResource(
                exampleA.ResourceClassName,
                exampleB.ResourceClassName,
            );
        };

        const isCreate = (example: CommandExample): boolean => {
            return example.HttpMethod === 'put';
        };

        const isDelete = (example: CommandExample): boolean => {
            return example.HttpMethod === 'delete';
        };

        // stable sort
        const compare = (examplesA: CommandExample, examplesB: CommandExample): number => {
            if (!examplesA || !examplesB) return 0;

            if (examplesA.ResourceClassName === examplesB.ResourceClassName) {
                if (isCreate(examplesB) && !isCreate(examplesA)) {
                    return 1;
                } else if (isDelete(examplesB) && !isDelete(examplesA)) {
                    return -1;
                } else if (isCreate(examplesA) && !isCreate(examplesB)) {
                    return -1;
                } else if (isDelete(examplesA) && !isDelete(examplesB)) {
                    return 1;
                } else {
                    return examplesA.Id.localeCompare(examplesB.Id);
                }
            } else if (dependOn(examplesA, examplesB)) {
                if (isCreate(examplesB)) {
                    return 1;
                } else if (isDelete(examplesB)) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (dependOn(examplesB, examplesA)) {
                if (isCreate(examplesA)) {
                    return -1;
                } else if (isDelete(examplesA)) {
                    return 1;
                } else {
                    return -1;
                }
            }
            return examplesA.Id.localeCompare(examplesB.Id);
        };

        const scenarioExamples: Map<string, CommandExample> = new Map<string, CommandExample>();
        const commandExamples = this.GetAllExamples();
        for (let i = 0; i < this._defaultTestScenario.length; i++) {
            for (const commandExample of commandExamples) {
                if (this.matchExample(commandExample, this._defaultTestScenario[i].name)) {
                    scenarioExamples.set(this._defaultTestScenario[i].name, commandExample);
                    break;
                }
            }
        }

        this._defaultTestScenario = MergeSort(this._defaultTestScenario, (exampleA, exampleB) => {
            return compare(
                scenarioExamples.get(exampleA.name),
                scenarioExamples.get(exampleB.name),
            );
        });
    }

    public GetAllMethods(commandGroup?: string, callback?: () => void): any[] {
        let ret: [];
        this.SelectFirstExtension();
        if (this.SelectFirstCommandGroup()) {
            do {
                // iterate all CommandGroups
                if (
                    commandGroup &&
                    commandGroup.toLowerCase() !==
                        this.commandGroupHandler.CommandGroup_Key.toLowerCase()
                )
                    continue;
                while (this.currentOperationIndex >= 0) {
                    // iterate all Commands
                    this.SelectFirstMethod();
                    do {
                        if (callback) {
                            callback();
                        }
                    } while (this.SelectNextMethod());
                    this.SelectNextCommand();
                }
            } while (this.SelectNextCommandGroup());
        }
        return ret;
    }

    private matchExample(example: CommandExample, id: string) {
        if (!id) return false;
        return (
            example.Id.toLowerCase() === id.toLowerCase() ||
            example.Id.toLowerCase().endsWith(`/${id.toLowerCase()}`)
        );
    }

    public GetAllExamples(
        id?: string,
        callback?: (example) => void,
        exampleTemplate?: any,
    ): CommandExample[] {
        const ret: CommandExample[] = [];
        let found = false;
        this.GetAllMethods(null, () => {
            if (found) return;
            let examples: CommandExample[];
            if (!isNullOrUndefined(exampleTemplate)) {
                const example = this.GetExampleById(id, exampleTemplate);
                if (isNullOrUndefined(example)) return;
                examples = [example];
            } else {
                examples = this.GetExamples(true);
            }
            for (const example of examples) {
                if (id && !this.matchExample(example, id)) continue;
                if (callback) {
                    callback(example);
                }
                if (ret.indexOf(example) > -1) {
                    continue;
                }
                ret.push(example);
                if (id) {
                    found = true;
                }
            }
        });
        return ret;
    }

    /*
        This is trying to get all the model data by passing all the CodeModelTypes and InputProperties and dependencies,
        The dependencies is used for describe how the result will look like. For example: In case of report.md, 
        we basically need all the commandGroups, all the commands, all the methods, all the methodParameters and all the azExamples.
        and since the azExamples actually belongs to each methods i.e. the swagger operations, we need the result to be in the format of 
        extensions: [
            commandGroups : [
                commands: [
                    methods: [
                        methodParameters: [],
                        azExample: [],
                    ]
                ]
            ]   
        ]
        Then the dependencies would look like 
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
            ['method', 'azExample'],
        ];

        Since we need different properties for each of the CodeModelType, we can define our requirements in InputProperties 
        to specify what kind of CodeModelType properties do we need for rendering, 
               and what's the order condition 
               and what's the filter condition
               and what's the converter we need after we get the data.
        Still take report as an example,

        const converter = new Map<string, (item) => unknown>([
            [
                'mapsTo',
                function (item: string) {
                    if (item.endsWith('_')) {
                        item = item.substr(0, item.length - 1);
                    }
                    item = item.replace(/_/g, '-');
                    return item;
                },
            ],
        ]);

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput(['name'], { name: SortOrder.ASEC })],
            ['commandGroup', new RenderInput(['name', 'cliKey'], { name: SortOrder.ASEC })],
            ['command', new RenderInput(['name'])],
            ['method', new RenderInput(['nameAz', 'cliKey'], { nameAz: SortOrder.ASEC })],
            [
                'methodParameter',
                new RenderInput(
                    ['mapsTo', 'type', 'description', 'cliKey', 'namePython'],
                    {},
                    [
                        ['isFlattened', true],
                        ['type', SchemaType.Constant],
                        ['isPolyOfSimple', true],
                        ['isDiscriminator', true],
                    ],
                    converter,
                ),
            ],
            ['azExample', new RenderInput(['commandStringItems'], {})],
        ]);

        
        This means we need extension => properties: name, sort by name
                           commandGroup => properties: name, cliKey, sort by name
                           command => properties: name,
                           method => properties: nameAz, cliKey, sort by nameAz
                           methodParameter => properties: mapsTo, type, description, cliKey, namePython, and filter those parameters that 
                                isFlattened == true and methodParameter_type != constants, isPolyOfSimple != true, isDiscrminator != true

                                and converter

        data = model.getModelData('extension', inputProperties, dependencies);

     */

    public getModelData(
        layer: CodeModelTypes,
        inputProperties: Map<CodeModelTypes, RenderInput>,
        dependencies: DataGraph,
    ): unknown | any[] {
        if (
            isNullOrUndefined(layer) ||
            isNullOrUndefined(dependencies) ||
            dependencies.length < 0
        ) {
            return {};
        }
        const type: CodeModelTypes = layer;
        const handler = type + 'Handler';
        const Type = Capitalize(type);
        const renderInput: RenderInput = inputProperties.get(type);
        const sortBy = renderInput.sortBy;
        const props = renderInput.properties;
        const conditions = renderInput.conditions;
        const converter = renderInput.converter;
        const selector = renderInput.selector;
        const data = {};
        data['has' + Type] = false;
        data[Type + 's'] = [];
        const items = [];
        if (this['SelectFirst' + Type](...selector)) {
            data['has' + Type] = true;
            do {
                let item = {};
                let hasFiltered = false;
                if (!isNullOrUndefined(props) && Array.isArray(props) && props.length > 0) {
                    for (const prop of props) {
                        if (typeof this[handler][Type + '_' + Capitalize(prop)] === 'function') {
                            item[prop] = this[handler][Type + '_' + Capitalize(prop)]();
                        } else {
                            item[prop] = this[handler][Type + '_' + Capitalize(prop)];
                        }
                    }
                    for (const condition of conditions) {
                        if (this[handler][Type + '_' + Capitalize(condition[0])] === condition[1]) {
                            hasFiltered = true;
                            break;
                        }
                    }
                }
                if (hasFiltered) {
                    continue;
                }

                if (dependencies.length > 0) {
                    dependencies
                        .filter((d) => d[0] === layer)
                        .forEach((d) => {
                            const item2: any = this.getModelData(
                                d[1],
                                inputProperties,
                                dependencies,
                            );
                            item = { ...item, ...item2 };
                        });
                    // const d = dependencies.shift();
                }
                if (!isNullOrUndefined(converter)) {
                    item = converter(item);
                }
                items.push(item);
            } while (this['SelectNext' + Type](...selector));
            if (items.length > 0 && sortBy.length > 0) {
                items.sort(function (a, b) {
                    for (const sortKey in sortBy) {
                        if (
                            a[Type + '_' + Capitalize(sortKey)] >
                            b[Type + '_' + Capitalize(sortKey)]
                        ) {
                            return sortBy[sortKey];
                        } else if (
                            a[Type + '_' + Capitalize(sortKey)] <
                            b[Type + '_' + Capitalize(sortKey)]
                        ) {
                            return 0 - sortBy[sortKey];
                        }
                    }
                    return 0;
                });
            }
            data[Type + 's'] = items;
        }
        return data;
    }

    public getArrayModelData(
        layer: CodeModelTypes,
        inputProperties: Map<CodeModelTypes, RenderInput>,
        dependencies: DataGraph,
    ): any[] {
        const data = this.getModelData(layer, inputProperties, dependencies);
        const allTypes = {};
        while (dependencies.length > 0) {
            allTypes[dependencies[0][0]] = dependencies[0][1];
            dependencies.shift();
        }
        let next = data[Capitalize(layer) + 's'];
        delete data['has' + Capitalize(layer)];
        delete data[Capitalize(layer) + 's'];
        const preItem = {};
        const traceItem = [];
        traceItem.push([preItem, next, layer]);
        const ret = [];
        while (traceItem.length > 0) {
            const front = traceItem.shift();
            next = front[1];
            const currentLayer = front[2];
            const nextLayer = allTypes[currentLayer];
            let mItem = front[0];
            for (const item of next) {
                if (!isNullOrUndefined(nextLayer)) {
                    const mNext = item[Capitalize(nextLayer) + 's'];
                    delete item['has' + Capitalize(nextLayer)];
                    delete item[Capitalize(nextLayer) + 's'];
                    mItem[currentLayer] = item;
                    traceItem.push([mItem, mNext, nextLayer]);
                } else {
                    mItem = { ...mItem, ...item };
                    ret.push(mItem);
                }
            }
        }
        return ret;
    }

    public getAllCommandGroupWithCallback(callback: () => void): void {
        const commandGroupCall = () => {
            if (this.SelectFirstCommandGroup()) {
                do {
                    callback.bind(this)();
                } while (this.SelectNextCommandGroup());
            }
        };
        commandGroupCall();
    }

    public getCommandsWithCallback(callback: () => void, needAll = true): void {
        const commandCall = () => {
            if (this.SelectFirstCommand()) {
                do {
                    callback.bind(this)();
                } while (this.SelectNextCommand());
            }
        };
        if (needAll) {
            this.getAllCommandGroupWithCallback(commandCall);
        } else {
            commandCall();
        }
    }

    public getMethodsWithCallback(callback: () => void, needAll = true): void {
        const methodCall = () => {
            if (this.SelectFirstMethod()) {
                do {
                    callback.bind(this)();
                } while (this.SelectNextMethod());
            }
        };
        if (needAll) {
            this.getCommandsWithCallback(methodCall);
        } else {
            methodCall();
        }
    }

    public getMethodParametersWithCallback(callback: () => void, needAll = true): void {
        const methodParameterCall = () => {
            if (this.SelectFirstMethodParameter()) {
                do {
                    callback.bind(this)();
                } while (this.SelectNextMethodParameter());
            }
        };
        if (needAll) {
            this.getMethodsWithCallback(methodParameterCall);
        } else {
            methodParameterCall();
        }
    }

    public GetHandler(): Handler {
        return new Handler(
            this.extensionHandler,
            this.commandGroupHandler,
            this.commandHandler,
            this.methodHandler,
            this.methodParameterHandler,
            this.parameterHandler,
            this.schemaHandler,
            this.configHandler,
        );
    }
}
