/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { Channel, Session } from '@azure-tools/autorest-extension-base';
import { EnglishPluralizationService } from '@azure-tools/codegen';
import {
    CodeModel,
    Operation,
    OperationGroup,
    Parameter,
    ParameterLocation,
    Property,
    Request,
    Schema,
    SchemaType,
} from '@azure-tools/codemodel';
import { values } from '@azure-tools/linq';
import {
    Capitalize,
    getGitStatus,
    parseResourceId,
    ToCamelCase,
    ToSnakeCase,
    changeCamelToDash,
    ToSentence,
    isNullOrUndefined,
} from '../utils/helper';
import {
    CodeGenConstants,
    EXCLUDED_PARAMS,
    GenerationMode,
    AzConfiguration,
    CodeModelTypes,
    RenderInput,
    DataGraph,
    getAZConfiguration,
} from '../utils/models';
import { CodeModelAz } from './CodeModelAz';

import { readFile } from '@azure-tools/async-io';

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
    preMethodIndex: number;
    currentMethodIndex: number;
    suboptions: Property[];
    subOperationGroups: Operation[];
    submethodparameters: Parameter[];
    substack: Array<[Parameter[], number]>;
    currentSubOptionIndex: number;
    paramActionNameReference: Map<Schema, string>;
    private _clientSubscriptionBound: boolean;
    private _clientBaseUrlBound: boolean;
    private _clientAuthenticationPolicy: string;
    private _generationMode: GenerationMode = GenerationMode.Full;
    private _outputPath: string;
    private _parentOptions: any;
    private _useOptions: string[];

    private _cliCoreLib: string;

    init(): void {
        this.options = AzConfiguration.getValue(CodeGenConstants.az);
        this._parentOptions = AzConfiguration.getValue(CodeGenConstants.parents);
        this._useOptions = AzConfiguration.getValue(CodeGenConstants.use);
        this.extensionName = this.options.extensions;
        this.parentExtension = this.options[CodeGenConstants.parentExtension];
        this.currentOperationGroupIndex = -1;
        this.currentSubOperationGroupIndex = -1;
        this.currentOperationIndex = -1;
        this.currentParameterIndex = -1;
        this.currentExampleIndex = -1;
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
        // this.sortOperationByAzCommand();
    }

    public constructor(protected session: Session<CodeModel>) {
        this.init();
        this.codeModel = session.model;
        this.dealingSimplePolymorphism();
        this.setParamAzUniqueNames();
        this.sortOperationByAzCommand();
        this.calcOptionRequiredByMethod();
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
                    return v.slice('file:///'.length, p - 1);
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

        const azpkg = path.join(__dirname, '..', '..', '..', '..', 'package.json');
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
                                    if (!paramRequired.has(this.MethodParameter_Name)) {
                                        paramRequired.set(
                                            this.MethodParameter_Name,
                                            this.MethodParameter_IsRequired ? 1 : 0,
                                        );
                                    } else if (this.MethodParameter_IsRequired) {
                                        paramRequired.set(
                                            this.MethodParameter_Name,
                                            paramRequired.get(this.MethodParameter_Name) + 1,
                                        );
                                    }
                                } while (this.SelectNextMethodParameter());
                            }
                            while (this.SelectNextMethod()) {
                                paramTime++;
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        if (!paramRequired.has(this.MethodParameter_Name)) {
                                            paramRequired.set(
                                                this.MethodParameter_Name,
                                                this.MethodParameter_IsRequired ? 1 : 0,
                                            );
                                        } else if (this.MethodParameter_IsRequired) {
                                            paramRequired.set(
                                                this.MethodParameter_Name,
                                                paramRequired.get(this.MethodParameter_Name) + 1,
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
                                    const parameters = this.MethodParameter;
                                    const defaultName = parameters.language['cli'].cliKey;
                                    const defaultToMatch = '{' + defaultName + '}';
                                    if (!isNullOrUndefined(idGroups)) {
                                        for (const k of idGroups.entries()) {
                                            if (
                                                k[1] === defaultToMatch &&
                                                defaultName !== 'resourceGroupName'
                                            ) {
                                                this.MethodParameter.language['az'].id_part = k[0];
                                            }
                                        }
                                    }
                                    if (parameters.language['cli'].required) {
                                        this.MethodParameter['RequiredByMethod'] = true;
                                    } else {
                                        this.MethodParameter['RequiredByMethod'] =
                                            paramRequired.get(this.MethodParameter_Name) ===
                                            paramTime;
                                    }
                                    if (this.MethodParameter_MapsTo === 'name') {
                                        hasName = true;
                                    }
                                } while (this.SelectNextMethodParameter());
                                if (hasName) {
                                    this.Method['hasName'] = true;
                                }
                            }
                            while (this.SelectNextMethod()) {
                                let idGroups = new Map<string, string>();
                                idGroups = parseResourceId(this.Request.protocol.http.path);
                                let hasName = false;
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        const parameters = this.MethodParameter;
                                        const defaultName = parameters.language['cli'].cliKey;
                                        const defaultToMatch = '{' + defaultName + '}';
                                        if (!isNullOrUndefined(idGroups)) {
                                            for (const k of idGroups.entries()) {
                                                if (
                                                    k[1] === defaultToMatch &&
                                                    defaultName !== 'resourceGroupName'
                                                ) {
                                                    this.MethodParameter.language['az'].id_part =
                                                        k[0];
                                                }
                                            }
                                        }
                                        if (parameters.language['cli'].required) {
                                            this.MethodParameter['RequiredByMethod'] = true;
                                        } else {
                                            this.MethodParameter['RequiredByMethod'] =
                                                paramRequired.get(this.MethodParameter_Name) ===
                                                paramTime;
                                        }
                                        if (this.MethodParameter_MapsTo === 'name') {
                                            hasName = true;
                                        }
                                    } while (this.SelectNextMethodParameter());
                                    if (hasName) {
                                        this.Method['hasName'] = true;
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
                                        if (this.MethodParameter_IsFlattened) {
                                            continue;
                                        }
                                        if (this.Parameter_IsPolyOfSimple(this.MethodParameter)) {
                                            const polyBaseParam = this.MethodParameter;
                                            const allChildParam: Array<Parameter> = [];
                                            for (const child of this.MethodParameter.schema[
                                                'children'
                                            ].all) {
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
                                                this.MethodParameter,
                                                allChildParam,
                                            );
                                            if (!addResult) {
                                                this.session.message({
                                                    Channel: Channel.Warning,
                                                    Text:
                                                        'dealingSimplePolymorphisme error! baseClass: ' +
                                                        this.MethodParameter_MapsTo,
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
                                        const paramName = this.MethodParameter_MapsTo;
                                        const param = this.MethodParameter;
                                        const originParam = this.MethodParameter;
                                        let flattenedNames =
                                            param?.['targetProperty']?.flattenedNames;
                                        if (
                                            isNullOrUndefined(flattenedNames) &&
                                            !isNullOrUndefined(param.language['cli'].flattenedNames)
                                        ) {
                                            flattenedNames = param.language['cli'].flattenedNames;
                                        }
                                        const mapName: Array<string> = [];
                                        let paramFlattenedName = this.Parameter_MapsTo(param);
                                        const names = this.Method_NameAz.split(' ');
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
                                                this.MethodParameter.language[
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
                                            nameParamReference.get(paramFlattenedName).schema !==
                                                param.schema
                                        ) {
                                            let tmpName = paramFlattenedName;
                                            const preParam = nameParamReference.get(
                                                paramFlattenedName,
                                            );
                                            const preFlattenedNames =
                                                preParam?.['targetProperty']?.flattenedNames;
                                            let preParamFlattenedName = this.Parameter_MapsTo(
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
                                                this.Parameter_SetAzNameMapsTo(
                                                    preParamFlattenedName,
                                                    preParam,
                                                );
                                                nameParamReference.set(
                                                    preParamFlattenedName,
                                                    preParam,
                                                );
                                                this.Parameter_SetAzNameMapsTo(
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
                                            this.Parameter_SetAzNameMapsTo(
                                                paramFlattenedName,
                                                param,
                                            );
                                            nameParamReference.set(paramFlattenedName, param);
                                        }
                                        if (this.MethodParameter_Name === 'tags') {
                                            continue;
                                        }
                                        if (this.Parameter_IsPolyOfSimple()) {
                                            continue;
                                        }
                                        if (
                                            this.MethodParameter_IsList &&
                                            this.MethodParameter_IsListOfSimple &&
                                            !this.MethodParameter_IsSimpleArray
                                        ) {
                                            const groupOpParamName: string =
                                                'Add' +
                                                Capitalize(
                                                    ToCamelCase(
                                                        this.Command_FunctionName +
                                                            '_' +
                                                            this.MethodParameter_MapsTo,
                                                    ),
                                                );
                                            const groupParamName: string =
                                                'Add' +
                                                Capitalize(
                                                    ToCamelCase(
                                                        this.CommandGroup_Key +
                                                            '_' +
                                                            this.MethodParameter_MapsTo,
                                                    ),
                                                );
                                            const actionName: string =
                                                'Add' +
                                                Capitalize(
                                                    ToCamelCase(this.MethodParameter_MapsTo),
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
                                                this.paramActionNameReference.set(
                                                    param.schema,
                                                    actionUniqueName,
                                                );
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

    public SelectFirstExtension(): boolean {
        // support only one initially
        return true;
    }

    public SelectNextExtension(): boolean {
        return false;
    }

    public get Extension_Name(): string {
        return this.extensionName;
    }

    public get Extension_Parent(): string {
        return this.parentExtension;
    }

    public get Extension_Mode(): string {
        return AzConfiguration.getValue(CodeGenConstants.extensionMode);
    }

    public get Extension_NameUnderscored(): string {
        return this.extensionName.replace(/-/g, '_');
    }

    public get Extension_NameClass(): string {
        return this.codeModel.info['pascal_case_title'];
    }

    public get Extension_ClientSubscriptionBound(): boolean {
        return this._clientSubscriptionBound;
    }

    public get Extension_ClientBaseUrlBound(): boolean {
        return this._clientBaseUrlBound;
    }

    public get Extension_ClientAuthenticationPolicy(): string {
        return this._clientAuthenticationPolicy;
    }

    public get CliGenerationMode(): GenerationMode {
        return AzConfiguration.getValue(CodeGenConstants.generationMode);
    }

    //= ================================================================================================================
    // Command Groups
    //
    // This interface provides enumeration of command groups assigned to currently selected extension.
    // Currently all the command groups should be assigned to default extension (first one on the list).
    // Users will be able to assign command groups to specific extension via readme.az.md file.
    // Specification will be updated accordingly.
    //= ================================================================================================================

    public SelectFirstCommandGroup(): boolean {
        // just enumerate through command groups in code-model-v4
        if (this.codeModel.operationGroups.length > 0) {
            this.currentOperationGroupIndex = 0;
            if (
                this.CommandGroup.language['cli'].hidden ||
                this.CommandGroup.language['cli'].removed
            ) {
                if (this.SelectNextCommandGroup()) {
                    if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
                    return true;
                } else {
                    return false;
                }
            }
            if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    public SelectNextCommandGroup(): boolean {
        if (this.currentOperationGroupIndex < this.codeModel.operationGroups.length - 1) {
            this.currentOperationGroupIndex++;
            if (
                this.CommandGroup.language['cli'].hidden ||
                this.CommandGroup.language['cli'].removed
            ) {
                if (this.SelectNextCommandGroup()) {
                    if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
                    return true;
                } else {
                    return false;
                }
            }
            if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    public get CommandGroup(): OperationGroup {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex];
    }

    public get CommandGroup_Name(): string {
        return this.CommandGroup.language['az'].command;
    }

    public get CommandGroup_Help(): string {
        const extensionPart = this.Extension_Name.replace(/-/g, ' ');
        const groupPart = changeCamelToDash(this.CommandGroup.language['az']?.name)?.replace(
            /-/g,
            ' ',
        );
        if (extensionPart !== groupPart) {
            return 'Manage ' + groupPart + ' with ' + extensionPart;
        } else {
            return 'Manage ' + groupPart;
        }
    }

    public get CommandGroup_Key(): string {
        return this.CommandGroup.$key || this.CommandGroup_Name;
    }

    public get CommandGroup_HasShowCommand(): boolean {
        return this.CommandGroup.language['az'].hasShowCommand;
    }

    public get CommandGroup_DefaultName(): string {
        const eps = new EnglishPluralizationService();
        return eps.singularize(this.CommandGroup.language['cli'].cliKey);
    }

    public get CommandGroup_MaxApi(): string {
        return this.CommandGroup.language['cli']?.['max-api'];
    }

    public get CommandGroup_MinApi(): string {
        return this.CommandGroup.language['cli']?.['min-api'];
    }

    public get CommandGroup_ResourceType(): string | undefined {
        return this.formResourceType(this.CommandGroup.language['cli']?.['resource-type']);
    }

    public get CommandGroup_CliKey(): string {
        return this.CommandGroup.language['cli']?.cliKey;
    }

    public get CommandGroup_Mode(): string {
        if (isNullOrUndefined(this.CommandGroup?.language?.['cli']?.extensionMode)) {
            return this.Extension_Mode;
        }
        return this.CommandGroup?.language?.['cli']?.extensionMode;
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
        if (this.CommandGroup.operations.length > 0) {
            this.currentOperationIndex = 0;
            const operation = this.Command;
            this.preMethodIndex = this.currentOperationIndex;
            let needNext = false;
            if (this.Operation_IsHidden(operation)) {
                needNext = true;
            }
            while (this.currentOperationIndex + 1 < this.CommandGroup.operations.length) {
                const tmpOperation = this.CommandGroup.operations[this.currentOperationIndex + 1];
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
        if (this.currentOperationIndex < this.CommandGroup.operations.length - 1) {
            this.currentOperationIndex++;
            this.preMethodIndex = this.currentOperationIndex;
            const operation = this.Command;
            let needNext = false;
            if (this.Operation_IsHidden(operation)) {
                needNext = true;
            }
            while (this.currentOperationIndex < this.CommandGroup.operations.length - 1) {
                const tmpOperation = this.CommandGroup.operations[this.currentOperationIndex + 1];
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

    public Operation_IsHidden(op: Operation = this.Method): boolean {
        if (
            op.language['cli'].hidden ||
            op.language['cli'].removed ||
            op.language['cli']['cli-operation-splitted']
        ) {
            return true;
        }
        return false;
    }

    public get Command(): Operation {
        return this.CommandGroup.operations[this.currentOperationIndex];
    }

    public get Command_FunctionName(): string {
        return this.Command_Name.replace(/( |-)/g, '_');
    }

    public get Command_Name(): string {
        return this.Command.language['az'].command;
    }

    public get Command_MethodName(): string {
        return this.Command.language['az'].name;
    }

    public Command_GenericSetterParameter(op: Operation = this.Command): Parameter {
        if (isNullOrUndefined(op)) {
            return null;
        }
        return op['genericSetterParam'];
    }

    public get Command_Help(): string {
        return this.Command.language['az'].description.replace(/\n/g, ' ').replace(/"/g, '\\\\"');
    }

    public get Command_GetOriginalOperation(): any {
        const polyOriginal = this.Command.extensions?.['cli-poly-as-resource-original-operation'];
        if (
            !isNullOrUndefined(polyOriginal) &&
            !isNullOrUndefined(polyOriginal.extensions['cli-split-operation-original-operation'])
        ) {
            const splitOriginal = polyOriginal.extensions['cli-split-operation-original-operation'];
            return splitOriginal;
        }
        const splittedOriginal = this.Command.extensions['cli-split-operation-original-operation'];
        if (!isNullOrUndefined(splittedOriginal)) {
            return splittedOriginal;
        }
        return polyOriginal;
    }

    public get Command_NeedGeneric(): boolean {
        if (
            this.Command.language['az'].isSplitUpdate &&
            this.CommandGroup_HasShowCommand &&
            !isNullOrUndefined(
                this.Command_GenericSetterParameter(this.Command_GetOriginalOperation),
            )
        ) {
            return true;
        }
        return false;
    }

    public get Command_IsLongRun(): boolean {
        return !!this.Command.extensions?.['x-ms-long-running-operation'];
    }

    public get Command_SubGroupName(): string {
        const subCommandGroupName = this.Command.language['az'].subCommandGroup;
        return isNullOrUndefined(subCommandGroupName) ? '' : subCommandGroupName;
    }

    public get Command_Mode(): string {
        if (isNullOrUndefined(this.Command?.language?.['cli']?.extensionMode)) {
            return this.CommandGroup_Mode;
        }
        return this.Command?.language?.['cli']?.extensionMode;
    }

    public get Command_MaxApi(): string {
        return this.Command.language['cli']?.['max-api'];
    }

    public get Command_MinApi(): string {
        return this.Command.language['cli']?.['min-api'];
    }

    public get Command_ResourceType(): string | undefined {
        return this.formResourceType(this.Command.language['cli']?.['resource-type']);
    }

    public get ResourceType(): string | undefined {
        return this.formResourceType(getAZConfiguration(CodeGenConstants.RESOURCE_TYPE_CONFIG_KEY));
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
            const method = this.Method;
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
            const method = this.Method;
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
        return this.Method.requests[0];
    }

    public get Method(): Operation {
        return this.CommandGroup.operations[this.currentMethodIndex];
    }

    public get Method_IsFirst(): boolean {
        if (this.currentMethodIndex === this.preMethodIndex) {
            return true;
        } else {
            return false;
        }
    }

    public get Method_IsLast(): boolean {
        if (this.currentMethodIndex === this.currentOperationIndex) {
            return true;
        } else {
            let curIndex = this.currentMethodIndex + 1;
            let hasNext = false;
            while (curIndex <= this.currentOperationIndex) {
                if (!this.Operation_IsHidden(this.CommandGroup.operations[curIndex])) {
                    hasNext = true;
                    break;
                }
                curIndex++;
            }
            return !hasNext;
        }
    }

    public get Method_IsLongRun(): boolean {
        return !!this.Method.extensions?.['x-ms-long-running-operation'];
    }

    public get Method_Name(): string {
        return this.Method.language.python.name;
    }

    public get Method_NameAz(): string {
        return this.Method.language['az'].name;
    }

    public get Method_NameCli(): string {
        return this.Method.language['cli'].name;
    }

    public get Method_CliKey(): string {
        return this.Method.language['cli']?.cliKey;
    }

    public get Method_MaxApi(): string {
        return this.Method.language['cli']?.['max-api'];
    }

    public get Method_MinApi(): string {
        return this.Method.language['cli']?.['min-api'];
    }

    public get Method_ResourceType(): string | undefined {
        return this.formResourceType(this.Method.language['cli']?.['resource-type']);
    }

    public get Method_BodyParameterName(): string {
        return null;
    }

    public get Method_Path(): string {
        return this.Method.requests[0].protocol?.http?.path;
    }

    public get Method_Help(): string {
        return this.Method.language['az'].description.replace(/\n/g, ' ').replace(/"/g, '\\\\"');
    }

    public get Method_HttpMethod(): string {
        const ret = this.Method.requests[0].protocol?.http?.method || 'unknown';
        return ret.toLowerCase();
    }

    public Method_GenericSetterParameter(op: Operation = this.Method): Parameter {
        if (isNullOrUndefined(op)) {
            return null;
        }
        return op['genericSetterParam'];
    }

    public get Method_NeedGeneric(): boolean {
        if (
            this.Method.language['az'].isSplitUpdate &&
            this.CommandGroup_HasShowCommand &&
            !isNullOrUndefined(this.Method_GenericSetterParameter(this.Method_GetOriginalOperation))
        ) {
            return true;
        }
        return false;
    }

    public Get_Method_Name(language = 'az'): string {
        return this.Method.language[language].name;
    }

    public get Method_GetOriginalOperation(): any {
        const polyOriginal = this.Method.extensions?.['cli-poly-as-resource-original-operation'];
        if (
            !isNullOrUndefined(polyOriginal) &&
            !isNullOrUndefined(polyOriginal.extensions?.['cli-split-operation-original-operation'])
        ) {
            const splitOriginal =
                polyOriginal.extensions?.['cli-split-operation-original-operation'];
            return splitOriginal;
        }
        const splittedOriginal = this.Method.extensions?.['cli-split-operation-original-operation'];
        if (!isNullOrUndefined(splittedOriginal)) {
            return splittedOriginal;
        }
        return polyOriginal;
    }

    public get Method_GetSplitOriginalOperation(): any {
        return this.Method.extensions?.['cli-split-operation-original-operation'];
    }

    public get Method_Mode() {
        if (isNullOrUndefined(this.Method?.language?.['cli']?.extensionMode)) {
            return this.Command_Mode;
        }
        return this.Method?.language?.['cli']?.extensionMode;
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
            if (this.Parameter_IsHidden(parameter) && !containHidden) {
                if (!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if (this.MethodParameters.length > 0) {
            this.currentParameterIndex = 0;
            if (
                (this.MethodParameter_IsHidden && !containHidden) ||
                this.codeModel.globalParameters.indexOf(this.MethodParameter) > -1
            ) {
                if (this.SelectNextMethodParameter()) {
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
            if (this.Parameter_IsHidden(parameter) && !containHidden) {
                if (!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if (this.currentParameterIndex < this.MethodParameters.length - 1) {
            this.currentParameterIndex++;
            if (
                (this.MethodParameter_IsHidden && !containHidden) ||
                this.codeModel.globalParameters.indexOf(this.MethodParameter) > -1
            ) {
                if (this.SelectNextMethodParameter()) {
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

    public EnterSubMethodParameters(param: Parameter = this.MethodParameter): boolean {
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

    public GetSubParameters(param: Parameter = this.MethodParameter): Parameter[] {
        // this should only works for
        // 1. objects with simple properties
        // 2. or objects with arrays as properties but has simple element type
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        if (!this.Parameter_IsList(param)) {
            return null;
        }
        if (!this.Parameter_IsListOfSimple(param)) {
            return null;
        }

        let submethodparameters = [];
        if (
            this.Parameter_Type(param) === SchemaType.Array ||
            this.Parameter_Type(param) === SchemaType.Dictionary
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
        } else if (this.Parameter_Type(param) === SchemaType.Object) {
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

    public Parameter_SetAzNameMapsTo(
        newName: string,
        param: Parameter = this.MethodParameter,
    ): void {
        if (!isNullOrUndefined(param['nameBaseParam'])) {
            param['nameBaseParam'].subParams[this.Method.language['cli'].name] = newName;
        }
        param.language['az'].mapsto = newName;
    }

    public Schema_ActionName(schema: Schema = this.MethodParameter.schema) {
        if (this.paramActionNameReference.has(schema)) {
            return this.paramActionNameReference.get(schema);
        }
        return null;
    }

    public get MethodParameter_Name(): string {
        return this.Parameter_Name(this.MethodParameter);
    }

    public get MethodParameter_NameAz(): string {
        return this.Parameter_NameAz(this.MethodParameter);
    }

    public get MethodParameter_CliKey(): string {
        return this.Parameter_CliKey(this.MethodParameter);
    }

    public get MethodParameter_MaxApi(): string {
        return this.MethodParameter.language['cli']?.['max-api'];
    }

    public get MethodParameter_MinApi(): string {
        return this.MethodParameter.language['cli']?.['min-api'];
    }

    public get MethodParameter_ResourceType(): string | undefined {
        return this.formResourceType(this.MethodParameter.language['cli']?.['resource-type']);
    }

    public get MethodParameter_IdPart(): string {
        return this.MethodParameter.language['az'].id_part;
    }

    public get MethodParameter_IsArray(): boolean {
        if (!isNullOrUndefined(this.submethodparameters)) {
            return (
                this.submethodparameters[this.currentSubOptionIndex].schema?.type ===
                SchemaType.Array
            );
        } else {
            return this.MethodParameter.schema?.type === SchemaType.Array;
        }
    }

    public get MethodParameter_NamePython(): string {
        return this.Parameter_NamePython(this.MethodParameter);
    }

    public get MethodParameter_MapsTo(): string {
        return this.Parameter_MapsTo(this.MethodParameter);
    }

    public Parameter_MapsTo(param: Parameter = this.MethodParameter): string {
        if (EXCLUDED_PARAMS.indexOf(param.language['az'].mapsto) > -1) {
            param.language['az'].mapsto = 'gen_' + param.language['az'].mapsto;
        }
        return param.language['az'].mapsto;
    }

    public Parameter_SubMapsTo(subMethodName: string, param: Parameter = this.MethodParameter) {
        if (!isNullOrUndefined(param?.['subParams']?.[subMethodName])) {
            return param['subParams'][subMethodName];
        }
        return this.Parameter_MapsTo(param);
    }

    public Schema_MapsTo(schema: Schema): string {
        return schema.language['az'].mapsto;
    }

    public get MethodParameter_Description(): string {
        return this.Parameter_Description(this.MethodParameter);
    }

    public get MethodParameter_Type(): string {
        return this.Parameter_Type(this.MethodParameter);
    }

    public get MethodParameter_IsList(): boolean {
        return this.Parameter_IsList(this.MethodParameter);
    }

    public get MethodParameter_ArgGroup(): string {
        return this.MethodParameter.language['az']?.arg_group;
    }

    public get MethodParameter_Mode() {
        if (isNullOrUndefined(this.MethodParameter?.language?.['cli']?.extensionMode)) {
            return this.Method_Mode;
        }
        return this.MethodParameter?.language?.['cli']?.extensionMode;
    }

    public get MethodParameter_IsPositional(): boolean {
        return this.Parameter_IsPositional(this.MethodParameter);
    }

    public get MethodParameter_IsShorthandSyntax(): boolean {
        return this.Parameter_IsShorthandSyntax(this.MethodParameter);
    }

    public isComplexSchema(type: string): boolean {
        if (
            type === SchemaType.Array ||
            type === SchemaType.Object ||
            type === SchemaType.Dictionary ||
            type === SchemaType.Any ||
            this.MethodParameter.language['cli'].json === true
        ) {
            return true;
        } else {
            return false;
        }
    }

    public get MethodParameter_IsListOfSimple(): boolean {
        return this.Parameter_IsListOfSimple(this.MethodParameter);
    }

    public Parameter_Type(param: Parameter = this.MethodParameter): string {
        return this.Schema_Type(param?.schema);
    }

    public Schema_Type(schema: Schema = this.MethodParameter.schema): string {
        if (isNullOrUndefined(schema)) {
            return undefined;
        }
        return schema.type;
    }

    public Parameter_IsFlattened(param: Parameter = this.MethodParameter): boolean {
        return !!param.flattened;
    }

    public Parameter_IsShorthandSyntax(param: Parameter = this.MethodParameter): boolean {
        return !!param.language['cli']?.shorthandSyntax;
    }

    public Parameter_IsCliFlattened(param: Parameter = this.MethodParameter): boolean {
        if (
            param?.language?.['cli']?.['cli-flattened'] &&
            !param.language['cli']['cli-m4-flattened']
        ) {
            if (param['nameBaseParam']?.language?.['cli']?.['cli-m4-flattened']) {
                return false;
            }
            return true;
        }
        return false;
    }

    public Parameter_IsListOfSimple(param: Parameter = this.MethodParameter): boolean {
        // objects that is not base class of polymorphic and satisfy one of the four conditions
        // 1. objects with simple properties
        // 2. or objects with arrays as properties but has simple element type
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        // 5. or dicts with simple element properties
        // 6. or dicts with arrays as element properties but has simple element type
        if (this.Parameter_Type(param) === SchemaType.Any) {
            return false;
        }
        if (this.Parameter_IsFlattened(param)) {
            return false;
        }
        if (param.language['cli'].json === true) {
            return false;
        }
        return this.Schema_IsListOfSimple(param.schema);
    }

    public Schema_IsListOfSimple(schema: Schema = this.MethodParameter.schema): boolean {
        // objects that is not base class of polymorphic and satisfy one of the four conditions
        // 1. objects with simple properties
        // 2. or objects with arrays as properties but has simple element type
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        // 5. or dicts with simple element properties
        // 6. or dicts with arrays as element properties but has simple element type
        if (this.Schema_Type(schema) === SchemaType.Any) {
            return false;
        }
        if (schema?.language?.['cli']?.json === true) {
            return false;
        }
        if (this.Schema_Type(schema) === SchemaType.Array) {
            if (
                schema['elementType'].type === SchemaType.Object ||
                schema['elementType'].type === SchemaType.Dictionary
            ) {
                for (const p of values(schema['elementType']?.properties)) {
                    if (p['readOnly']) {
                        continue;
                    }
                    if (
                        p['schema'].type === SchemaType.Object ||
                        p['schema'].type === SchemaType.Dictionary
                    ) {
                        return false;
                    } else if (p['schema'].type === SchemaType.Array) {
                        for (const mp of values(p['schema']?.elementType?.properties)) {
                            if (this.isComplexSchema(mp['schema'].type)) {
                                return false;
                            }
                        }
                        for (const parent of values(p['schema']?.elementType?.parents?.all)) {
                            for (const pp of values(parent['properties'])) {
                                if (this.isComplexSchema(pp['schema'].type)) {
                                    return false;
                                }
                            }
                        }
                    } else if (this.isComplexSchema(p['schema'].type)) {
                        return false;
                    }
                }
                return true;
            }
        } else if (this.Schema_Type(schema) === SchemaType.Object) {
            if (
                !isNullOrUndefined(schema['children']) &&
                !isNullOrUndefined(schema['discriminator'])
            ) {
                return false;
            }
            for (const p of values(schema['properties'])) {
                if (p['readOnly']) {
                    continue;
                }
                if (
                    p['schema'].type === SchemaType.Object ||
                    p['schema'].type === SchemaType.Dictionary
                ) {
                    // objects.objects
                    return false;
                } else if (p['schema'].type === SchemaType.Array) {
                    for (const mp of values(p['schema']?.elementType?.properties)) {
                        if (this.isComplexSchema(mp['schema'].type)) {
                            return false;
                        }
                    }
                    for (const parent of values(p['schema']?.elementType?.parents?.all)) {
                        for (const pp of values(parent['properties'])) {
                            if (this.isComplexSchema(pp['schema'].type)) {
                                return false;
                            }
                        }
                    }
                } else if (this.isComplexSchema(p['schema'].type)) {
                    // objects.objects
                    return false;
                }
            }
            return true;
        } else if (this.Schema_Type(schema) === SchemaType.Dictionary) {
            if (
                !isNullOrUndefined(schema['children']) &&
                !isNullOrUndefined(schema['discriminator'])
            ) {
                return false;
            }
            const p = schema['elementType'];
            if (p.type === SchemaType.Object || p.type === SchemaType.Dictionary) {
                // dicts.objects or dicts.dictionaries
                return false;
            } else if (p.type === SchemaType.Array) {
                for (const mp of values(p.properties)) {
                    if (mp['readOnly']) {
                        continue;
                    }
                    if (this.isComplexSchema(mp['schema'].type)) {
                        return false;
                    }
                }
                for (const parent of values(p.schema?.elementType?.parents?.all)) {
                    for (const pp of values(parent['properties'])) {
                        if (pp['readOnly']) {
                            continue;
                        }
                        if (this.isComplexSchema(pp['schema'].type)) {
                            return false;
                        }
                    }
                }
            } else if (this.isComplexSchema(p.type)) {
                // dicts.objects or dicts.dictionaries
                return false;
            }
            return true;
        } else if (this.MethodParameter_Type === SchemaType.Any) {
            return false;
        }
        return false;
    }

    public get MethodParameter_IsPolyOfSimple(): boolean {
        return this.Parameter_IsPolyOfSimple(this.MethodParameter);
    }

    public get MethodParameter_IsDiscriminator(): boolean {
        return (
            this.Method_GetOriginalOperation &&
            this.MethodParameter['targetProperty'] &&
            this.MethodParameter['targetProperty']['isDiscriminator']
        );
    }

    public Parameter_IsPolyOfSimple(param: Parameter = this.MethodParameter): boolean {
        if (!isNullOrUndefined(param['isPolyOfSimple'])) {
            return param['isPolyOfSimple'];
        }
        if (
            param?.schema?.type === SchemaType.Object &&
            !isNullOrUndefined(param.schema['children']) &&
            !isNullOrUndefined(param.schema['discriminator'])
        ) {
            let isSimplePoly = true;
            for (const child of param.schema['children'].all) {
                if (this.Schema_IsList(child) && this.Schema_IsListOfSimple(child)) {
                    continue;
                }
                isSimplePoly = false;
                break;
            }
            if (isSimplePoly) {
                param['isPolyOfSimple'] = true;
            } else {
                param['isPolyOfSimple'] = false;
            }
            return isSimplePoly;
        }
        return false;
    }

    public get MethodParameter_IsSimpleArray(): boolean {
        return this.Parameter_IsSimpleArray(this.MethodParameter);
    }

    private Parameter_IsSimpleArray(param: Parameter): boolean {
        if (this.Parameter_Type(param) === SchemaType.Array) {
            const elementType = param.schema['elementType'].type;
            if (!this.isComplexSchema(elementType)) {
                return true;
            }
        }
        return false;
    }

    public Parameter_IsList(param: Parameter = this.MethodParameter): boolean {
        if (this.Parameter_IsFlattened(param)) {
            return false;
        }

        if (this.isComplexSchema(this.Parameter_Type(param))) {
            return true;
        }
        return false;
    }

    public Parameter_PositionalKeys(param: Parameter, subMethodParams: Parameter[]): string[] {
        let keys = [];
        if (!(this.Parameter_IsList(param) && this.Parameter_IsListOfSimple(param))) {
            return null;
        }
        if (
            !isNullOrUndefined(param.language?.['az']?.positionalKeys) &&
            Array.isArray(param.language?.['az']?.positionalKeys)
        ) {
            keys = param.language?.['az']?.positionalKeys;
        }

        if (
            keys.length === 0 &&
            !isNullOrUndefined(param.schema.language?.['cli']?.positionalKeys) &&
            Array.isArray(param.schema.language?.['cli']?.positionalKeys)
        ) {
            keys = param.schema.language?.['cli']?.positionalKeys;
        }

        const allPossibleKeys = [];
        const requiredKeys = [];
        for (const subMethodParam of subMethodParams) {
            if (subMethodParam['readOnly']) {
                continue;
            }
            if (subMethodParam.schema?.type === SchemaType.Constant) {
                continue;
            }
            allPossibleKeys.push(this.Parameter_NamePython(subMethodParam));
            if (subMethodParam.required || subMethodParam.language?.['cli'].required) {
                if (!this.Parameter_IsHidden(subMethodParam)) {
                    requiredKeys.push(this.Parameter_NamePython(subMethodParam));
                }
            }
        }

        const coveredResult = keys.every((val) => allPossibleKeys.includes(val));
        const requiredCovered = requiredKeys.every((val) => keys.includes(val));

        if (keys.length > 0) {
            if (coveredResult && requiredCovered) {
                return keys;
            } else {
                let text = '';
                if (!coveredResult) {
                    text +=
                        'The defined positional keys for ' +
                        this.Parameter_CliKey(param) +
                        ' contains invalid keys. All possible keys are: ' +
                        allPossibleKeys.join(', ') +
                        ' \n';
                }
                if (!requiredCovered) {
                    text +=
                        'The defined positional keys for ' +
                        this.Parameter_CliKey(param) +
                        " doesn't contain all required keys. All required keys are: " +
                        requiredKeys.join(', ') +
                        ' \n';
                }
                this.session.message({ Channel: Channel.Fatal, Text: text });
                return null;
            }
        }

        return allPossibleKeys;
    }

    public get MethodParameter_PositionalKeys(): string[] {
        const subMethodParams: Parameter[] = [];
        if (this.EnterSubMethodParameters()) {
            if (this.SelectFirstMethodParameter(true)) {
                do {
                    subMethodParams.push(this.SubMethodParameter);
                } while (this.SelectNextMethodParameter(true));
            }
            this.ExitSubMethodParameters();
        }
        return this.Parameter_PositionalKeys(this.MethodParameter, subMethodParams);
    }

    public Schema_IsList(schema: Schema = this.MethodParameter.schema): boolean {
        if (schema.language['cli'].json === true) {
            return true;
        }
        if (this.isComplexSchema(this.Schema_Type(schema))) {
            return true;
        }
        return false;
    }

    public get MethodParameter(): Parameter {
        return this.MethodParameters[this.currentParameterIndex];
    }

    public get MethodParameters(): Array<Parameter> {
        if (isNullOrUndefined(this.Request) || isNullOrUndefined(this.Request.parameters)) {
            return this.Method.parameters;
        }
        return this.Method.parameters.concat(this.Request.parameters);
    }

    public MethodParameters_AddPolySubClass(oriParam: Parameter, params: Parameter[]): boolean {
        if (isNullOrUndefined(params) || isNullOrUndefined(oriParam) || params.length <= 0) {
            return false;
        }
        if (this.Method.parameters.indexOf(oriParam) > -1) {
            this.Method.parameters.splice(
                this.Method.parameters.indexOf(oriParam) + 1,
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

    public get MethodParameter_EnumValues(): string[] {
        const mtype = this.MethodParameter.schema.type;
        if (mtype === SchemaType.Choice || mtype === SchemaType.SealedChoice) {
            const enumArray = [];
            const schema = this.MethodParameter.schema;
            for (const item of schema['choices']) {
                enumArray.push(item.value);
            }
            return enumArray;
        } else {
            return [];
        }
    }

    public get MethodParameter_In(): string {
        const protocol = this.MethodParameter.protocol;
        return protocol !== undefined &&
            protocol.http !== undefined &&
            protocol.http.in !== undefined
            ? protocol.http.in
            : ParameterLocation.Body;
    }

    public get MethodParameter_IsHidden(): boolean {
        return this.Parameter_IsHidden(this.MethodParameter);
    }

    public Parameter_IsHidden(parameter: Parameter): boolean {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'hidden')) {
            // Handle complex
            let shouldHidden;
            let defaultValue;
            let hasDefault = false;
            if (this.EnterSubMethodParameters(parameter)) {
                shouldHidden = true;
                defaultValue = '{';
                if (this.SelectFirstMethodParameter()) {
                    do {
                        if (
                            this.Parameter_Type(this.SubMethodParameter) !== SchemaType.Constant &&
                            this.SubMethodParameter['readOnly'] !== true
                        ) {
                            shouldHidden = false;
                            break;
                        } else if (
                            this.Parameter_Type(this.SubMethodParameter) === SchemaType.Constant
                        ) {
                            defaultValue =
                                defaultValue +
                                '"' +
                                this.Parameter_NameAz(this.SubMethodParameter) +
                                '": "' +
                                this.Parameter_DefaultValue(this.SubMethodParameter) +
                                '"';
                            hasDefault = true;
                        }
                    } while (this.SelectNextMethodParameter());
                }
                if (shouldHidden === true && (hasDefault || this.Schema_IsRequired(parameter))) {
                    defaultValue = defaultValue + '}';
                } else {
                    defaultValue = undefined;
                }
                this.ExitSubMethodParameters();
            }

            // Handle simple parameter
            if (parameter?.language?.['cli']?.removed || parameter?.language?.['cli']?.hidden) {
                if (
                    this.Parameter_DefaultValue(parameter) === undefined &&
                    parameter.required === true
                ) {
                    parameter.language['az'].hidden = false;
                    this.session.message({
                        Channel: Channel.Warning,
                        Text:
                            'OperationGroup ' +
                            this.CommandGroup.language['az'].name +
                            ' operation ' +
                            this.Method_Name +
                            ' parameter ' +
                            parameter.language['az'].name +
                            ' should not be hidden while it is required without default value',
                    });
                } else {
                    parameter.language['az'].hidden = true;
                }
            } else {
                parameter.language['az'].hidden = parameter['hidden'] ?? shouldHidden ?? false;
                if (
                    !Object.prototype.hasOwnProperty.call(
                        parameter.language['az'],
                        'default-value',
                    ) &&
                    defaultValue !== undefined
                ) {
                    parameter.language['az']['default-value'] = defaultValue;
                }
            }
        }

        return parameter.language['az'].hidden;
    }

    public get MethodParameter_DefaultValue(): string | undefined {
        return this.Parameter_DefaultValue(this.MethodParameter);
    }

    public get MethodParameter_DefaultConfigKey(): string | undefined {
        return this.Parameter_DefaultConfigKey(this.MethodParameter);
    }

    public Parameter_DefaultValue(parameter: Parameter): string | undefined {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'default-value')) {
            if (
                Object.prototype.hasOwnProperty.call(parameter?.language?.['cli'], 'default-value')
            ) {
                parameter.language['az']['default-value'] =
                    parameter.language['cli']['default-value'];
            } else if (parameter.schema.type === SchemaType.Constant) {
                parameter.language['az']['default-value'] = parameter.schema?.['value']?.value;
            } else {
                parameter.language['az']['default-value'] = parameter.schema.defaultValue;
            }
        }

        return parameter.language['az']['default-value'];
    }

    public Parameter_DefaultConfigKey(parameter: Parameter): string | undefined {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'default-config-key')) {
            if (
                Object.prototype.hasOwnProperty.call(
                    parameter?.language?.['cli'],
                    'default-config-key',
                )
            ) {
                parameter.language['az']['default-config-key'] =
                    parameter.language['cli']['default-config-key'];
            }
        }
        return parameter.language['az']['default-config-key'];
    }

    public Parameter_Description(param: Parameter = this.MethodParameter): string {
        return param.language['az'].description.replace(/\r?\n|\r/g, ' ');
    }

    public Schema_Description(schema: Schema): string {
        return schema.language['az'].description.replace(/\r?\n|\r/g, ' ');
    }

    public Schema_FlattenedFrom(schema: Schema): Schema {
        return schema?.language['cli']?.pythonFlattenedFrom;
    }

    public Schema_IsPositional(schema: Schema): boolean {
        return schema?.language?.['cli']?.positional;
    }

    public Parameter_InGlobal(parameter: Parameter): boolean {
        if (this.codeModel.globalParameters.indexOf(parameter) > -1) {
            return true;
        }
        return false;
    }

    public Parameter_Name(param: Parameter = this.MethodParameter): string {
        return param.language['az'].name.replace(/-/g, '_');
    }

    public Parameter_NameAz(param: Parameter = this.MethodParameter): string {
        return param.language['az'].name;
    }

    public Parameter_CliKey(param: Parameter = this.MethodParameter): string {
        return param.language['cli']?.cliKey;
    }

    public Parameter_NamePython(param: Parameter = this.MethodParameter): string {
        if (this.SDK_IsTrack1 && !isNullOrUndefined(param.language['cli']?.track1_name)) {
            return param.language['cli']?.track1_name;
        }
        return param.language?.python?.name;
    }

    public Parameter_IsPositional(param: Parameter = this.MethodParameter): boolean {
        if (param?.schema && this.Schema_IsPositional(param.schema)) {
            return true;
        }
        return !!param?.language?.['cli']?.positional;
    }

    public get MethodParameter_IsRequired(): boolean {
        return this.Parameter_IsRequired(this.MethodParameter);
    }

    private Parameter_IsRequired(param: Parameter): boolean {
        return param?.required;
    }

    private Parameter_IsRequiredOrCLIRequired(param: Parameter): boolean {
        return this.Parameter_IsRequired(param) || param?.language?.['cli']?.required;
    }

    private Schema_IsRequired(param: Parameter): boolean {
        return param?.['targetProperty']?.required;
    }

    public get MethodParameter_IsFlattened(): boolean {
        return this.Parameter_IsFlattened(this.MethodParameter);
    }

    public get MethodParameter_IsCliFlattened(): boolean {
        return this.Parameter_IsCliFlattened(this.MethodParameter);
    }

    public get MethodParameter_RequiredByMethod(): boolean {
        return this.MethodParameter['RequiredByMethod'];
    }

    //= ================================================================================================================
    // Top Level Python Related Information
    //
    // Most of the information included here should be either produced by Python namer, or come from readme.az.md file.
    // Detailed descriptions below.
    //= ================================================================================================================

    public GetModuleOperationName(): string {
        return ToSnakeCase(this.CommandGroup.language.default.name);
    }

    public GetModuleOperationNamePython(): string {
        if (
            this.SDK_IsTrack1 &&
            !isNullOrUndefined(this.CommandGroup.language['cli']?.track1_name)
        ) {
            return this.CommandGroup.language['cli']?.track1_name;
        }
        return this.CommandGroup.language.python.name;
    }

    public GetModuleOperationNamePythonUpper(): string {
        if (
            this.SDK_IsTrack1 &&
            !isNullOrUndefined(this.CommandGroup.language['cli']?.track1_class_name)
        ) {
            return this.CommandGroup.language['cli']?.track1_class_name;
        }
        return this.CommandGroup.language.python.className;
    }

    public GetPythonNamespace(): string {
        return AzConfiguration.getValue(CodeGenConstants.pythonNamespace);
    }

    public GetPythonPackageName(): string {
        return getAZConfiguration(CodeGenConstants.PACKAGE_NAME_CONFIG_KEY);
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
        if (this.Method.extensions === undefined) {
            return false;
        }

        const example = this.Method.extensions['x-ms-examples'];
        if (example && example.length > 0) {
            this.currentExampleIndex = 0;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }
    }

    public SelectNextExample(): boolean {
        const example = this.Method.extensions['x-ms-examples'];
        if (example && this.currentExampleIndex < example.length - 1) {
            this.currentExampleIndex++;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }
    }

    public get Example_Title(): string {
        return this.Method.extensions['x-ms-examples'][this.currentExampleIndex].value().title;
    }

    public get Example_Body(): string[] {
        // TBD
        return this.Method.extensions['x-ms-examples'][this.currentExampleIndex].key();
    }

    public get Example_Params(): any {
        // TBD
        return this.Method.extensions['x-ms-examples'][this.currentExampleIndex].value().parameters;
    }

    public get Examples(): unknown {
        const extensions = this.Method.extensions;
        return extensions && 'x-ms-examples' in extensions ? extensions['x-ms-examples'] : {};
    }

    public get ExampleAmount(): number {
        return Object.keys(this.Examples).length;
    }

    public set CliCoreLib(lib: string) {
        this._cliCoreLib = lib;
    }

    public get CliCoreLib(): string {
        if (isNullOrUndefined(this._cliCoreLib)) {
            return CodeGenConstants.DEFAULT_CLI_CORE_LIB;
        }
        return this._cliCoreLib;
    }

    public get AzureCliFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azureCliFolder);
    }

    public get AzureCliExtFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azureCliExtFolder);
    }

    public get AzextFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azextFolder);
    }

    public get azOutputFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azOutputFolder);
    }

    public get IsCliCore() {
        return AzConfiguration.getValue(CodeGenConstants.isCliCore);
    }

    public get minCliCoreVersion(): string {
        return CodeGenConstants.minCliCoreVersion;
    }

    public get SDK_NeedSDK() {
        return AzConfiguration.getValue(CodeGenConstants.sdkNeeded);
    }

    public get SDK_IsTrack1() {
        return AzConfiguration.getValue(CodeGenConstants.sdkTrack1);
    }

    public get SDK_NoFlatten() {
        return AzConfiguration.getValue(CodeGenConstants.sdkNoFlatten);
    }

    public GetAllMethods(commandGroup?: string, callback?: () => void): any[] {
        let ret: [];
        this.SelectFirstExtension();
        if (this.SelectFirstCommandGroup()) {
            do {
                // iterate all CommandGroups
                if (
                    commandGroup &&
                    commandGroup.toLowerCase() !== this.CommandGroup_Key.toLowerCase()
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

    /*
    [
        [extension, commandGroup],
        [commandGroup, command],
        [command, method],
        [method, methodParameter],
        [method, example]
    ]
     */

    public getRenderData(
        layer: CodeModelTypes,
        inputProperties: Map<CodeModelTypes, RenderInput>,
        dependencies: DataGraph,
    ): unknown {
        if (
            isNullOrUndefined(layer) ||
            isNullOrUndefined(dependencies) ||
            dependencies.length < 0
        ) {
            return {};
        }
        const type: CodeModelTypes = layer;
        const renderInput: RenderInput = inputProperties.get(type);
        const sortBy = renderInput.sortBy;
        const props = renderInput.properties;
        const conditions = renderInput.conditions;
        const converter = renderInput.converter;
        const Type = Capitalize(type);
        const data = {};
        data['has' + Type] = false;
        data[Type + 's'] = [];
        const items = [];
        if (this['SelectFirst' + Type]()) {
            data['has' + Type] = true;
            do {
                let item = {};
                let hasFiltered = false;
                if (!isNullOrUndefined(props) && Array.isArray(props) && props.length > 0) {
                    for (const prop of props) {
                        item[prop] = this[Type + '_' + Capitalize(prop)];
                        if (!isNullOrUndefined(converter.get(prop))) {
                            item[prop] = converter.get(prop)(item[prop]);
                        }
                    }
                    for (const condition of conditions) {
                        // console.log(Type + '_' + Capitalize(condition[0]));
                        // console.log(this[Type + '_' + Capitalize(condition[0])]);
                        // console.log(condition[1]);
                        if (this[Type + '_' + Capitalize(condition[0])] === condition[1]) {
                            hasFiltered = true;
                            break;
                        }
                    }
                }
                if (hasFiltered) {
                    continue;
                }
                if (dependencies.length > 0 && layer == dependencies[0][0]) {
                    const nextLayer = dependencies[0][1];
                    let item2 = {};
                    const d = dependencies.shift();
                    item2 = this.getRenderData(nextLayer, inputProperties, dependencies);
                    dependencies.unshift(d);
                    item = { ...item, ...item2 };
                }
                items.push(item);
            } while (this['SelectNext' + Type]());
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
}
