/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Channel, Session } from "@azure-tools/autorest-extension-base";
import { EnglishPluralizationService, pascalCase } from "@azure-tools/codegen";
import { CodeModel, Operation, OperationGroup, Parameter, ParameterLocation, Property, Request, Schema, SchemaType } from '@azure-tools/codemodel';
import { values, keys } from "@azure-tools/linq";
import { isArray, isNullOrUndefined } from "util";
import { Capitalize, deepCopy, MergeSort, parseResourceId, ToCamelCase, ToJsonString, ToSnakeCase, changeCamelToDash } from '../../utils/helper';
import { EXCLUDED_PARAMS, GenerationMode } from "../models";
import { CodeModelAz, CommandExample, ExampleParam, MethodParam, KeyValueType} from "./CodeModelAz";
import { azOptions, GenerateDefaultTestScenario, GenerateDefaultTestScenarioByDependency, PrintTestScenario, ResourcePool, ObjectStatus, GroupTestScenario} from './templates/tests/ScenarioTool';


class ActionParam {
    public constructor(public groupOpActionName: string, public groupActionName: string, public actionName: string, public action: Parameter) { }
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
    resource_pool: ResourcePool;

    suboptions: Property[];
    subOperationGroups: Operation[];
    submethodparameters: Parameter[];
    substack: Array<[Parameter[], number]>;
    currentSubOptionIndex: number;
    paramActionNameReference: Map<Schema, string>;
    private _testScenario: any;
    private _defaultTestScenario: any[];
    private _configuredScenario: boolean;
    private _clientSubscriptionBound: boolean;
    private _clientBaseUrlBound: boolean;
    private _clientAuthenticationPolicy: string;
    private _generationMode: GenerationMode = GenerationMode.Full;
    private _outputPath: string;

    private _cliCoreLib: string;
    private static readonly DEFAULT_CLI_CORE_LIB = 'azure.cli.core';

    async init() {
        this.options = await this.session.getValue('az');
        Object.assign(azOptions, this.options);
        this.extensionName = this.options['extensions'];
        this.parentExtension = this.options['parent-extension']
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
        this._clientBaseUrlBound = this.options['client-base-url-bound'];
        this._clientSubscriptionBound = this.options['client-subscription-bound'];
        this._clientAuthenticationPolicy = this.options['client-authentication-policy'];
        //this.sortOperationByAzCommand();
    }

    public constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
        this.resource_pool = new ResourcePool();
        this.dealingSimplePolymorphism();
        this.setParamAzUniqueNames();
        this.sortOperationByAzCommand();
        this.calcOptionRequiredByMethod();
    }


    private sortOperationByAzCommand() {
        for (let [idx, operationGroup] of this.codeModel.operationGroups.entries()) {
            operationGroup.operations.sort(function (a, b) {
                function getOrder(op: string) {
                    if (op.indexOf(" ") > -1) {
                        op = op.split(" ").last;
                    }
                    let opOrder = ["list", "show", "create", "update", "delete"];
                    let order = opOrder.indexOf(op.toLowerCase()) + 1;
                    if (order == 0) {
                        order = opOrder.length + 1;
                    }
                    return order;
                }
                function requiredParamLength(parameters) {
                    let ret = 0;
                    for (var i = 0; i < parameters.length; ++i) {
                        if (parameters[i].required) ret++;
                    }
                    return ret;
                }
                let oa = getOrder(a.language['az']['name']);
                let ob = getOrder(b.language['az']['name']);
                if (oa < ob) {
                    return -1;
                } else if (oa > ob) {
                    return 1;
                } else {
                    let la = a.language['az']['name'];
                    let lb = b.language['az']['name'];
                    if (la != lb) {
                        return la.localeCompare(lb);
                    }
                    let requiredLenA = requiredParamLength(a.parameters);
                    let requiredLenB = requiredParamLength(b.parameters);
                    if (requiredLenA != requiredLenB) return requiredLenA > requiredLenB ? -1 : 1;
                    return a.parameters.length > b.parameters.length ? -1 : 1;
                }
            });
            this.codeModel.operationGroups[idx] = operationGroup;
        }

    }

    public get RandomizeNames(): boolean {
        let randomizeNames = this.options?.['randomize-names'];
        if (randomizeNames) return true;
        return false;
    }

    public get FormalizeNames(): boolean {
        let formalizeNames = this.options?.['formalize-names'];
        if (formalizeNames) return true;
        return false;
    }

    public get ResourceType(): string | undefined {
        return this.formResourceType(this.options?.['resource-type']);
    }

    public get GenChecks(): boolean {
        let disableChecks = this.options?.['disable-checks'];
        if (disableChecks) return false;
        return true;
    }

    public GetResourcePool(): ResourcePool {
        return this.resource_pool;
    }

    private calcOptionRequiredByMethod() {
        if (this.SelectFirstCommandGroup()) {
            do {
                if (this.SelectFirstCommand()) {
                    do {
                        var paramTime = 0;
                        let paramRequired: Map<string, number> = new Map<string, number>();
                        if (this.SelectFirstMethod()) {
                            paramTime++;
                            if (this.SelectFirstMethodParameter()) {
                                do {
                                    if (!paramRequired.has(this.MethodParameter_Name)) {
                                        paramRequired.set(this.MethodParameter_Name, this.MethodParameter_IsRequired ? 1 : 0);
                                    } else if (this.MethodParameter_IsRequired) {
                                        paramRequired.set(this.MethodParameter_Name, paramRequired.get(this.MethodParameter_Name) + 1);
                                    }
                                } while (this.SelectNextMethodParameter());
                            }
                            while (this.SelectNextMethod()) {
                                paramTime++;
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        if (!paramRequired.has(this.MethodParameter_Name)) {
                                            paramRequired.set(this.MethodParameter_Name, this.MethodParameter_IsRequired ? 1 : 0);
                                        } else if (this.MethodParameter_IsRequired) {
                                            paramRequired.set(this.MethodParameter_Name, paramRequired.get(this.MethodParameter_Name) + 1);
                                        }
                                    } while (this.SelectNextMethodParameter());
                                }

                            }
                        }
                        if (this.SelectFirstMethod()) {
                            let id_groups = new Map<string, string>();
                            id_groups = parseResourceId(this.Request.protocol.http.path);
                            let hasName = false;
                            if (this.SelectFirstMethodParameter()) {
                                do {
                                    let parameters = this.MethodParameter;
                                    let defaultName = parameters.language['cli']['cliKey'];
                                    let defaultToMatch = '{' + defaultName + '}';
                                    if (!isNullOrUndefined(id_groups)) {
                                        for (let k of id_groups.entries()) {
                                            if (k[1] == defaultToMatch && defaultName != 'resourceGroupName') {
                                                this.MethodParameter.language['az']['id_part'] = k[0];
                                            }
                                        }
                                    }
                                    if (parameters.language['cli'].required) {
                                        this.MethodParameter['RequiredByMethod'] = true;
                                    } else {
                                        this.MethodParameter['RequiredByMethod'] = paramRequired.get(this.MethodParameter_Name) == paramTime ? true : false;
                                    }
                                    if (this.MethodParameter_MapsTo == 'name') {
                                        hasName = true;
                                    }
                                } while (this.SelectNextMethodParameter());
                                if (hasName) {
                                    this.Method['hasName'] = true;
                                }
                            }
                            while (this.SelectNextMethod()) {
                                let id_groups = new Map<string, string>();
                                id_groups = parseResourceId(this.Request.protocol.http.path);
                                let hasName = false;
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        let parameters = this.MethodParameter;
                                        let defaultName = parameters.language['cli']['cliKey'];
                                        let defaultToMatch = '{' + defaultName + '}';
                                        if (!isNullOrUndefined(id_groups)) {
                                            for (let k of id_groups.entries()) {
                                                if (k[1] == defaultToMatch && defaultName != 'resourceGroupName') {
                                                    this.MethodParameter.language['az']['id_part'] = k[0];
                                                }
                                            }
                                        }
                                        if (parameters.language['cli'].required) {
                                            this.MethodParameter['RequiredByMethod'] = true;
                                        } else {
                                            this.MethodParameter['RequiredByMethod'] = paramRequired.get(this.MethodParameter_Name) == paramTime ? true : false;
                                        }
                                        if (this.MethodParameter_MapsTo == 'name') {
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
                                            let polyBaseParam = this.MethodParameter;
                                            let allChildParam: Array<Parameter> = [];
                                            for (let child of this.MethodParameter.schema['children'].all) {
                                                let childParam = new Parameter(child.language.default.name, child.language.default.description, child, child.language);
                                                childParam.language = child.language
                                                if (!isNullOrUndefined(child.language['cli']?.['alias'])) {
                                                    if (isNullOrUndefined(childParam.language['az']['alias'])) {
                                                        childParam.language['az']['alias'] = [];
                                                    }
                                                    if (typeof (child.language['cli']['alias']) == "string") {
                                                        if (EXCLUDED_PARAMS.indexOf(child.language['cli']['alias']) > -1) {
                                                            child.language['cli']['alias'] = 'gen_' + child.language['cli']['alias'];
                                                        }
                                                        childParam.language['az']['alias'].push(changeCamelToDash(child.language['cli']['alias']));
                                                    } else if (isArray(child.language['cli']['alias'])) {
                                                        for (let alias of child.language['cli']['alias']) {
                                                            if (EXCLUDED_PARAMS.indexOf(alias) > -1) {
                                                                alias = 'gen_' + alias;
                                                            }
                                                            childParam.language['az']['alias'].push(changeCamelToDash(alias));
                                                        }
                                                    }
                                                }
                                                childParam['polyBaseParam'] = polyBaseParam;
                                                allChildParam.push(childParam);
                                            }
                                            let addResult = this.MethodParameters_AddPolySubClass(this.MethodParameter, allChildParam);
                                            if (!addResult) {
                                                this.session.message({ Channel: Channel.Warning, Text: "dealingSimplePolymorphisme error! baseClass: " + this.MethodParameter_MapsTo });
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
        let nameActionReference: Map<string, ActionParam> = new Map<string, ActionParam>();
        let pythonReserveWord = ['all', 'id', 'format', 'type', 'filter'];
        if (this.SelectFirstCommandGroup()) {
            do {
                if (this.SelectFirstCommand()) {
                    do {
                        let nameParamReference: Map<string, Parameter> = new Map<string, Parameter>();
                        if (this.SelectFirstMethod()) {
                            do {
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        let paramName = this.MethodParameter_MapsTo;
                                        let param = this.MethodParameter;
                                        let originParam = this.MethodParameter;
                                        let flattenedNames = param?.['targetProperty']?.['flattenedNames'];
                                        if (isNullOrUndefined(flattenedNames) && !isNullOrUndefined(param.language['cli']['flattenedNames'])) {
                                            flattenedNames = param.language['cli']['flattenedNames'];
                                        }
                                        let mapName: Array<string> = [];
                                        let paramFlattenedName = this.Parameter_MapsTo(param);
                                        let names = this.Method_NameAz.split(' ');
                                        if (flattenedNames && flattenedNames.length > 0) {
                                            for (let item of flattenedNames) {
                                                mapName.push(ToSnakeCase(item));
                                            }
                                            mapName.reverse();
                                            if (mapName[mapName.length - 1] == 'properties' || mapName[mapName.length - 1] == 'parameters') {
                                                mapName.pop();
                                            } else if (names.length > 1 && mapName[mapName.length - 1] == names[0].replace(/-/g, '_')) {
                                                mapName.pop();
                                            }
                                            if (mapName.length > 0) {
                                                let tmpParamName = mapName.reverse().join("_");
                                                if (paramFlattenedName == mapName.last || names.length > 1 && paramFlattenedName.startsWith(names[0].replace(/-/g, '_'))) {
                                                    paramFlattenedName = tmpParamName;
                                                }
                                            }
                                        } else if (names.length > 1) {
                                            let subgroup: string = names[0];
                                            subgroup = subgroup.replace(/-/g, '_');
                                            if (paramFlattenedName.startsWith(subgroup)) {
                                                paramFlattenedName = paramFlattenedName.substr(subgroup.length + 1);
                                            }
                                        }
                                        if (nameParamReference.has(paramFlattenedName) && nameParamReference.get(paramFlattenedName).schema != param.schema) {
                                            let tmpName = paramFlattenedName;
                                            let preParam = nameParamReference.get(paramFlattenedName);
                                            let preFlattenedNames = preParam?.['targetProperty']?.['flattenedNames'];
                                            let preParamFlattenedName = this.Parameter_MapsTo(preParam);
                                            let preTmpName = preParamFlattenedName;
                                            if (preFlattenedNames && preFlattenedNames.length > 0) {
                                                preTmpName = preFlattenedNames.map(pfn => ToSnakeCase(pfn)).join('_');
                                            }
                                            if (flattenedNames && flattenedNames.length > 0) {
                                                tmpName = flattenedNames.map(fn => ToSnakeCase(fn)).join('_');
                                            }
                                            if (preTmpName != preParamFlattenedName) {
                                                preParamFlattenedName = preTmpName;
                                            } else if (tmpName != paramFlattenedName) {
                                                paramFlattenedName = tmpName;
                                            }
                                            if (pythonReserveWord.indexOf(paramFlattenedName) > -1) {
                                                paramFlattenedName += "_";
                                            }
                                            if (pythonReserveWord.indexOf(preParamFlattenedName) > -1) {
                                                preParamFlattenedName += "_";
                                            }
                                            if (paramFlattenedName != preParamFlattenedName) {
                                                this.Parameter_SetAzNameMapsTo(preParamFlattenedName, preParam);
                                                nameParamReference.set(preParamFlattenedName, preParam);
                                                this.Parameter_SetAzNameMapsTo(paramFlattenedName, param);
                                                nameParamReference.set(paramName, param);
                                            } else {
                                                // if the full flattenedName within one command is the same but has two different reference. there's no way to split them.
                                                this.session.message({ Channel: Channel.Warning, Text: "parameter " + paramFlattenedName + " has two different references but they have the same flattened name" });
                                            }
                                        } else {
                                            // nameParamReference doesn't have the parameter
                                            // or nameParamReference has the parameter and they are the same.
                                            if (pythonReserveWord.indexOf(paramFlattenedName) > -1) {
                                                paramFlattenedName += "_";
                                            }
                                            this.Parameter_SetAzNameMapsTo(paramFlattenedName, param);
                                            nameParamReference.set(paramFlattenedName, param);
                                        }
                                        if (this.MethodParameter_Name == 'tags') {
                                            continue;
                                        }
                                        if (this.Parameter_IsPolyOfSimple()) {
                                            continue;
                                        }
                                        if (this.MethodParameter_IsList && this.MethodParameter_IsListOfSimple && !this.MethodParameter_IsSimpleArray) {
                                            let groupOpParamName: string = "Add" + Capitalize(ToCamelCase(this.Command_FunctionName + "_" + this.MethodParameter_MapsTo));
                                            let groupParamName: string = "Add" + Capitalize(ToCamelCase(this.CommandGroup_Key + "_" + this.MethodParameter_MapsTo));
                                            let actionName: string = "Add" + Capitalize(ToCamelCase(this.MethodParameter_MapsTo));
                                            let action = new ActionParam(groupOpParamName, groupParamName, actionName, param);
                                            if (nameActionReference.has(actionName) && nameActionReference.get(actionName).action.schema != originParam.schema) {
                                                let preAction = nameActionReference.get(actionName);
                                                nameActionReference.delete(actionName);
                                                let preActionUniqueName = preAction.actionName;
                                                let actionUniqueName = actionName;
                                                if (preAction.groupActionName != action.groupActionName) {
                                                    actionUniqueName = action.groupActionName;
                                                    preActionUniqueName = preAction.groupActionName;
                                                } else if (preAction.groupOpActionName != action.groupOpActionName) {
                                                    actionUniqueName = action.groupOpActionName;
                                                    preActionUniqueName = preAction.groupOpActionName;
                                                }
                                                this.paramActionNameReference.set(preAction.action.schema, preActionUniqueName);
                                                this.paramActionNameReference.set(param.schema, actionUniqueName);
                                                nameActionReference.set(preActionUniqueName, preAction);
                                                nameActionReference.set(actionUniqueName, action);
                                            } else if (!this.paramActionNameReference.has(originParam.schema)) {
                                                nameActionReference.set(actionName, action);
                                                this.paramActionNameReference.set(param.schema, actionName);
                                            }
                                        }
                                    } while (this.SelectNextMethodParameter())
                                }
                            } while (this.SelectNextMethod())
                        }
                    } while (this.SelectNextCommand())
                }
            } while (this.SelectNextCommandGroup());
        }
    }

    //=================================================================================================================
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
    //=================================================================================================================


    public GenerateTestInit() {
        if (this.codeModel['test-scenario']) {
            // if ('examples' in this.codeModel['test-scenario']) {
            //     //new style of example configuration
            //     this._testScenario = this.codeModel['test-scenario']['examples'];
            // }
            // else {
            //     //old style of example configuration
            //     this._testScenario = this.codeModel['test-scenario']
            // }
            this._testScenario = GroupTestScenario(this.codeModel['test-scenario'], this.Extension_NameUnderscored);
            this._configuredScenario = true;
        }
        else {
            this._testScenario = undefined;
            this._configuredScenario = false;
        }
    }
    public get ConfiguredScenario(): boolean{
        // judge test-scenario whether have value
        return this._configuredScenario
    }

    public SelectFirstExtension(): boolean {
        // support only one initially
        return true;
    }

    public SelectNextExtension(): boolean {
        return false;
    }

    public get Extension_Name() {
        return this.extensionName;
    }

    public get Extension_Parent() {
        return this.parentExtension;
    }

    public get Extension_Mode() {
        return this.codeModel.info['extensionMode'];
    }

    public get Extension_NameUnderscored() {
        return this.extensionName.replace(/-/g, '_');
    }

    public get Extension_NameClass(): string {
        return this.codeModel.info['pascal_case_title']
    }

    public get Extension_TestScenario(): any {
        return this._testScenario;
    }

    public get Extension_DefaultTestScenario(): any {
        return this._defaultTestScenario;
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
        return this._generationMode;
    }

    public set CliGenerationMode(value: GenerationMode) {
        this._generationMode = value;
    }

    public get CliOutputFolder(): string {
        return this._outputPath;
    }

    public set CliOutputFolder(value: string) {
        this._outputPath = value;
    }

    //=================================================================================================================
    // Command Groups
    //
    // This interface provides enumeration of command groups assigned to currently selected extension.
    // Currently all the command groups should be assigned to default extension (first one on the list).
    // Users will be able to assign command groups to specific extension via readme.az.md file.
    // Specification will be updated accordingly.
    //=================================================================================================================

    public SelectFirstCommandGroup(): boolean {
        // just enumerate through command groups in code-model-v4
        if (this.codeModel.operationGroups.length > 0) {
            this.currentOperationGroupIndex = 0;
            if (this.CommandGroup.language['cli'].hidden || this.CommandGroup.language['cli'].removed) {
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
            if (this.CommandGroup.language['cli'].hidden || this.CommandGroup.language['cli'].removed) {
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
        let extensionPart = this.Extension_Name.replace(/-/g, " ");
        let groupPart = changeCamelToDash(this.CommandGroup.language['az']?.['name'])?.replace(/-/g, " ");
        if (extensionPart != groupPart) {
            return "Manage " + groupPart + " with " + extensionPart;
        } else {
            return "Manage " + groupPart;
        }
    }

    public get CommandGroup_Key(): string {
        return this.CommandGroup.$key || this.CommandGroup_Name;
    }

    public get CommandGroup_HasShowCommand(): boolean {
        return this.CommandGroup.language['az']['hasShowCommand'];
    }

    public get CommandGroup_DefaultName(): string {
        let eps = new EnglishPluralizationService();
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

    
    public get CommandGroup_Mode() {
        if (isNullOrUndefined(this.CommandGroup?.language?.['cli']?.['extensionMode'])) {
            return this.Extension_Mode;
        }
        return this.CommandGroup?.language?.['cli']?.['extensionMode'];
    }

    //-----------------------------------------------------------------------------------------------------------------
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
    //-----------------------------------------------------------------------------------------------------------------

    public SelectFirstCommand(): boolean {
        // just enumerate through commands in command group
        if (this.CommandGroup.operations.length > 0) {
            this.currentOperationIndex = 0;
            let operation = this.Command;
            this.preMethodIndex = this.currentOperationIndex;
            let needNext = false;
            if (this.Operation_IsHidden(operation)) {
                needNext = true;
            }
            while (this.currentOperationIndex + 1 < this.CommandGroup.operations.length) {
                let tmpOperation = this.CommandGroup.operations[this.currentOperationIndex + 1];
                if (tmpOperation.language['az'].command == operation.language['az'].command) {
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
            let operation = this.Command;
            let needNext = false;
            if (this.Operation_IsHidden(operation)) {
                needNext = true;
            }
            while (this.currentOperationIndex < this.CommandGroup.operations.length - 1) {
                let tmpOperation = this.CommandGroup.operations[this.currentOperationIndex + 1];
                if (operation.language['az'].command == tmpOperation.language['az'].command) {
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
        if (op.language['cli'].hidden || op.language['cli'].removed || op.language['cli']['cli-operation-splitted']) {
            return true;
        }
        return false;
    }

    public get Command() {
        return this.CommandGroup.operations[this.currentOperationIndex];
    }

    public get Command_FunctionName() {
        return this.Command_Name.replace(/( |-)/g, "_");
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
        return this.Command.language['az'].description.replace(/\n/g, " ").replace(/"/g, '\\\\"');
    }

    public get Command_GetOriginalOperation(): any {
        let polyOriginal = this.Command.extensions?.['cli-poly-as-resource-original-operation'];
        if (!isNullOrUndefined(polyOriginal) && !isNullOrUndefined(polyOriginal.extensions['cli-split-operation-original-operation'])) {
            let splitOriginal = polyOriginal.extensions['cli-split-operation-original-operation'];
            return splitOriginal;
        }
        let splittedOriginal = this.Command.extensions['cli-split-operation-original-operation'];
        if (!isNullOrUndefined(splittedOriginal)) {
            return splittedOriginal;
        }
        return polyOriginal;
    }

    public get Command_NeedGeneric(): boolean {
        if (this.Command.language['az']['isSplitUpdate'] && this.CommandGroup_HasShowCommand && !isNullOrUndefined(this.Command_GenericSetterParameter(this.Command_GetOriginalOperation))) {
            return true;
        }
        return false;
    }

    public get Command_IsLongRun(): boolean {
        return this.Command.extensions?.['x-ms-long-running-operation'] ? true : false;
    }

    public get Command_SubGroupName(): string {
        let subCommandGroupName = this.Command.language['az']['subCommandGroup'];
        return isNullOrUndefined(subCommandGroupName) ? "" : subCommandGroupName;
    }

    public get Command_Mode() {
        if (isNullOrUndefined(this.Command?.language?.['cli']?.['extensionMode'])) {
            return this.CommandGroup_Mode;
        }
        return this.Command?.language?.['cli']?.['extensionMode'];
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

    public formResourceType(config: string|undefined) {
        if (isNullOrUndefined(config) || config.startsWith("ResourceType.")) return config;
        else return "ResourceType." + config;
    }

    //=================================================================================================================
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
    //=================================================================================================================

    public SelectFirstMethod(): boolean {
        if (this.currentOperationIndex >= this.preMethodIndex) {
            this.currentMethodIndex = this.preMethodIndex;
            let method = this.Method;
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
            let method = this.Method;
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
        if (this.currentMethodIndex == this.preMethodIndex) {
            return true;
        } else {
            return false;
        }

    }

    public get Method_IsLast(): boolean {
        if (this.currentMethodIndex == this.currentOperationIndex) {
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
            return hasNext ? false : true;
        }
    }

    public get Method_IsLongRun(): boolean {
        return this.Method.extensions?.['x-ms-long-running-operation'] ? true : false;
    }

    public get Method_Name(): string {
        return this.Method.language['python'].name;
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
        return this.Method.language['az'].description.replace(/\n/g, " ").replace(/"/g, '\\\\"');
    }

    public get Method_HttpMethod(): string {
        let ret = this.Method.requests[0].protocol?.http?.method || "unknown";
        return ret.toLowerCase();
    }

    public Method_GenericSetterParameter(op: Operation = this.Method): Parameter {
        if (isNullOrUndefined(op)) {
            return null;
        }
        return op['genericSetterParam'];
    }

    public get Method_NeedGeneric(): boolean {
        if (this.Method.language['az']['isSplitUpdate'] && this.CommandGroup_HasShowCommand && !isNullOrUndefined(this.Method_GenericSetterParameter(this.Method_GetOriginalOperation))) {
            return true;
        }
        return false;
    }

    public Get_Method_Name(language = "az"): string {
        return this.Method.language[language].name;
    }

    public get Method_GetOriginalOperation(): any {
        let polyOriginal = this.Method.extensions?.['cli-poly-as-resource-original-operation'];
        if (!isNullOrUndefined(polyOriginal) && !isNullOrUndefined(polyOriginal.extensions?.['cli-split-operation-original-operation'])) {
            let splitOriginal = polyOriginal.extensions?.['cli-split-operation-original-operation'];
            return splitOriginal;
        }
        let splittedOriginal = this.Method.extensions?.['cli-split-operation-original-operation'];
        if (!isNullOrUndefined(splittedOriginal)) {
            return splittedOriginal;
        }
        return polyOriginal;
    }

    public get Method_GetSplitOriginalOperation(): any {
        return this.Method.extensions?.['cli-split-operation-original-operation'];
    }

    public get Method_Mode() {
        if (isNullOrUndefined(this.Method?.language?.['cli']?.['extensionMode'])) {
            return this.Command_Mode;
        }
        return this.Method?.language?.['cli']?.['extensionMode'];
    }

    //=================================================================================================================
    // Methods Parameters.
    //
    // This interface is designed to enumerate all parameters of the selected method and their mapping to Python SDK.
    //=================================================================================================================
    public SelectFirstMethodParameter(containHidden: boolean = false): boolean {
        if (this.submethodparameters != null) {
            this.currentSubOptionIndex = 0;
            let parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (this.Parameter_IsHidden(parameter) && !containHidden) {
                if (!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if (this.MethodParameters.length > 0) {
            this.currentParameterIndex = 0;
            if ((this.MethodParameter_IsHidden && !containHidden) || this.codeModel.globalParameters.indexOf(this.MethodParameter) > -1) {
                if (this.SelectNextMethodParameter()) {
                    return true;
                } else {
                    return false;
                };
            }
            return true;
        } else {
            return false;
        }
    }

    public SelectNextMethodParameter(containHidden: boolean = false): boolean {
        if (this.submethodparameters != null) {
            this.currentSubOptionIndex++;

            if (this.currentSubOptionIndex >= this.submethodparameters.length) {
                return false;
            }
            let parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (this.Parameter_IsHidden(parameter) && !containHidden) {
                if (!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if (this.currentParameterIndex < this.MethodParameters.length - 1) {
            this.currentParameterIndex++;
            if ((this.MethodParameter_IsHidden && !containHidden) || this.codeModel.globalParameters.indexOf(this.MethodParameter) > -1) {
                if (this.SelectNextMethodParameter()) {
                    return true;
                } else {
                    return false;
                };
            }
            return true;
        } else {
            return false;
        }
    }

    public EnterSubMethodParameters(param: Parameter = this.MethodParameter): boolean {
        let subParams = this.GetSubParameters(param);
        if (isNullOrUndefined(subParams)) {
            return false;
        }
        else {
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
            return null
        }
        if (!this.Parameter_IsListOfSimple(param))
            return null;

        let submethodparameters = [];
        if (this.Parameter_Type(param) == SchemaType.Array || this.Parameter_Type(param) == SchemaType.Dictionary) {
            if ((param['schema'])['elementType'].type == SchemaType.Object) {
                if (!isNullOrUndefined(param['schema']?.['elementType']?.properties)) {
                    submethodparameters = param['schema']?.['elementType']?.properties;
                }
                for (let parent of values(param['schema']?.['elementType']?.['parents']?.all)) {
                    if (isNullOrUndefined(parent['properties'])) {
                        continue;
                    }
                    submethodparameters = submethodparameters.concat(parent['properties'])
                }
            }
        } else if (this.Parameter_Type(param) == SchemaType.Object) {
            if (!isNullOrUndefined(param['schema']['properties'])) {
                submethodparameters = param['schema']['properties'];
            }
            for (let parent of values(param['schema']?.['parents']?.all)) {
                if (isNullOrUndefined(parent['properties'])) {
                    continue;
                }
                submethodparameters = submethodparameters.concat(parent['properties'])
            }
        }
        if (submethodparameters.length == 0) {
            return null;
        }
        return submethodparameters;
    }

    public ExitSubMethodParameters(): boolean {
        if (this.submethodparameters != null) {
            if (this.substack.length > 0) {
                let lastsub = this.substack.last;
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

    public Parameter_SetAzNameMapsTo(newName: string, param: Parameter = this.MethodParameter): void {
        if (!isNullOrUndefined(param['nameBaseParam'])) {
            param['nameBaseParam']['subParams'][this.Method.language['cli']['name']] = newName;
        }
        param.language['az']['mapsto'] = newName;
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
        return this.MethodParameter.language['az']['id_part'];
    }

    public get MethodParameter_IsArray(): boolean {
        if (this.submethodparameters != null) {
            return this.submethodparameters[this.currentSubOptionIndex].schema?.type == SchemaType.Array;
        } else {
            return this.MethodParameter.schema?.type == SchemaType.Array;
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

    public get MethodParameter_Mode() {
        if (isNullOrUndefined(this.MethodParameter?.language?.['cli']?.['extensionMode'])) {
            return this.Method_Mode;
        }
        return this.MethodParameter?.language?.['cli']?.['extensionMode'];
    }

    public get MethodParameter_IsPositional(): boolean {
        return this.Parameter_IsPositional(this.MethodParameter);
    }
      
    public get MethodParameter_IsShorthandSyntax(): boolean {
        return this.Parameter_IsShorthandSyntax(this.MethodParameter);
    }

    public isComplexSchema(type: string): boolean {
        if (type == SchemaType.Array || type == SchemaType.Object || type == SchemaType.Dictionary || type == SchemaType.Any ||
            this.MethodParameter.language['cli'].json == true)
            return true;
        else
            return false;
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
        return param['flattened'] ? true : false;
    }

    public Parameter_IsShorthandSyntax(param: Parameter = this.MethodParameter): boolean {
        return param.language['cli']?.['shorthandSyntax'] ? true: false;
    }
 
    public Parameter_IsCliFlattened(param: Parameter = this.MethodParameter): boolean {
        if (param?.language?.['cli']?.['cli-flattened'] && !param.language['cli']['cli-m4-flattened']) {
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
        if (this.Parameter_Type(param) == SchemaType.Any) {
            return false;
        }
        if (this.Parameter_IsFlattened(param)) {
            return false;
        }
        if (param.language['cli'].json == true) {
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
        if (this.Schema_Type(schema) == SchemaType.Any) {
            return false;
        }
        if (schema?.language?.['cli']?.json == true) {
            return false;
        }
        if (this.Schema_Type(schema) == SchemaType.Array) {
            if (schema['elementType'].type == SchemaType.Object || schema['elementType'].type == SchemaType.Dictionary) {
                for (let p of values(schema['elementType']?.properties)) {
                    if (p['readOnly']) {
                        continue;
                    }
                    if (p['schema'].type == SchemaType.Object || p['schema'].type == SchemaType.Dictionary) {
                        return false;
                    } else if (p['schema'].type == SchemaType.Array) {
                        for (let mp of values(p['schema']?.['elementType']?.properties)) {
                            if (this.isComplexSchema(mp['schema'].type)) {
                                return false;
                            }
                        }
                        for (let parent of values(p['schema']?.['elementType']?.['parents']?.all)) {
                            for (let pp of values(parent['properties'])) {
                                if (this.isComplexSchema(pp['schema'].type)) {
                                    return false;
                                }
                            }
                        }
                    }
                    else if (this.isComplexSchema(p['schema'].type)) {
                        return false;
                    }
                }
                return true;
            }
        } else if (this.Schema_Type(schema) == SchemaType.Object) {
            if (!isNullOrUndefined(schema['children']) && !isNullOrUndefined(schema['discriminator'])) {
                return false;
            }
            for (let p of values(schema['properties'])) {
                if (p['readOnly']) {
                    continue;
                }
                if (p['schema'].type == SchemaType.Object || p['schema'].type == SchemaType.Dictionary) {
                    // objects.objects
                    return false;
                } else if (p['schema'].type == SchemaType.Array) {
                    for (let mp of values(p['schema']?.['elementType']?.properties)) {
                        if (this.isComplexSchema(mp['schema'].type)) {
                            return false;
                        }
                    }
                    for (let parent of values(p['schema']?.['elementType']?.['parents']?.all)) {
                        for (let pp of values(parent['properties'])) {
                            if (this.isComplexSchema(pp['schema'].type)) {
                                return false;
                            }
                        }
                    }
                }
                else if (this.isComplexSchema(p['schema'].type)) {
                    // objects.objects
                    return false;
                }
            }
            return true;
        } else if (this.Schema_Type(schema) == SchemaType.Dictionary) {
            if (schema['children'] != null && schema['discriminator'] != null) {
                return false;
            }
            let p = schema['elementType'];
            if (p.type == SchemaType.Object || p.type == SchemaType.Dictionary) {
                // dicts.objects or dicts.dictionaries 
                return false;
            } else if (p.type == SchemaType.Array) {
                for (let mp of values(p.properties)) {
                    if (mp['readOnly']) {
                        continue;
                    }
                    if (this.isComplexSchema(mp['schema'].type)) {
                        return false;
                    }
                }
                for (let parent of values(p['schema']?.['elementType']?.['parents']?.all)) {
                    for (let pp of values(parent['properties'])) {
                        if (pp['readOnly']) {
                            continue;
                        }
                        if (this.isComplexSchema(pp['schema'].type)) {
                            return false;
                        }
                    }
                }
            }
            else if (this.isComplexSchema(p.type)) {
                // dicts.objects or dicts.dictionaries 
                return false;
            }
            return true;
        }
        else if (this.MethodParameter_Type == SchemaType.Any) {
            return false;
        }
        return false;
    }

    public Parameter_IsPolyOfSimple(param: Parameter = this.MethodParameter): boolean {
        if (!isNullOrUndefined(param['isPolyOfSimple'])) {
            return param['isPolyOfSimple'];
        }
        if (param?.schema?.type == SchemaType.Object && !isNullOrUndefined(param.schema['children']) && !isNullOrUndefined(param.schema['discriminator'])) {
            let isSimplePoly = true;
            for (let child of param.schema['children'].all) {
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
        if (this.Parameter_Type(param) == SchemaType.Array) {
            let elementType = param['schema']['elementType'].type;
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
        if (!isNullOrUndefined(param.language?.['az']?.['positionalKeys']) && isArray(param.language?.['az']?.['positionalKeys'])) {
            keys = param.language?.['az']?.['positionalKeys'];
        }

        if (keys.length == 0 && !isNullOrUndefined(param.schema.language?.['cli']?.['positionalKeys']) && isArray(param.schema.language?.['cli']?.['positionalKeys'])) {
            keys = param.schema.language?.['cli']?.['positionalKeys'];
        }

        let allPossibleKeys = [];
        let requiredKeys = [];
        for (let subMethodParam of subMethodParams) {
            if (subMethodParam['readOnly']) {
                continue;
            }
            if (subMethodParam['schema']?.type == SchemaType.Constant) {
                continue;
            }
            allPossibleKeys.push(this.Parameter_NamePython(subMethodParam));
            if (subMethodParam['required'] || subMethodParam.language?.['cli']['required']) {
                if (!this.Parameter_IsHidden(subMethodParam)) {
                    requiredKeys.push(this.Parameter_NamePython(subMethodParam))
                }
            }
        }

        let coveredResult  = keys.every(val => allPossibleKeys.includes(val));
        let requiredCovered = requiredKeys.every(val => keys.includes(val));

        if(keys.length > 0) {
            if (coveredResult && requiredCovered) {
                return keys;
            } else {
                let text = "";
                if (!coveredResult) {
                    text += "The defined positional keys for " + this.Parameter_CliKey(param) + " contains invalid keys. All possible keys are: " + allPossibleKeys.join(", ") + " \n";
                } 
                if (!requiredCovered) {
                    text += "The defined positional keys for " + this.Parameter_CliKey(param) + " doesn't contain all required keys. All required keys are: " + requiredKeys.join(", ") + " \n";
                }
                this.session.message({Channel: Channel.Fatal, Text: text});
                return null;
            }
        }

        return allPossibleKeys;
    }

    public get MethodParameter_PositionalKeys(): string[] {
        let subMethodParams: Parameter[] = [];
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
        if (schema.language['cli'].json == true) {
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
            this.Method.parameters.splice(this.Method.parameters.indexOf(oriParam) + 1, 0, ...params);
            return true;
        }
        if (!isNullOrUndefined(this.Request) && !isNullOrUndefined(this.Request.parameters)) {
            if (this.Request.parameters.indexOf(oriParam) > -1) {
                this.Request.parameters.splice(this.Request.parameters.indexOf(oriParam) + 1, 0, ...params)
                return true;
            }
        }
        return false;
    }

    public get SubMethodParameter(): Parameter {
        if (this.submethodparameters != null) {
            return this.submethodparameters[this.currentSubOptionIndex];
        }
        return null;
    }

    public get MethodParameter_EnumValues(): string[] {
        let mtype = this.MethodParameter.schema.type;
        if (mtype == SchemaType.Choice || mtype == SchemaType.SealedChoice) {
            var enumArray = [];
            let schema = this.MethodParameter.schema;
            for (var item of schema['choices']) {
                enumArray.push(item['value']);
            }
            return enumArray;
        } else {
            return [];
        }
    }

    public get MethodParameter_In(): string {
        let protocol = this.MethodParameter.protocol;
        return protocol != undefined && protocol.http != undefined && protocol.http.in != undefined ? protocol.http.in : ParameterLocation.Body;
    }

    public get MethodParameter_IsHidden(): boolean {
        return this.Parameter_IsHidden(this.MethodParameter);
    }

    public Parameter_IsHidden(parameter: Parameter): boolean {
        if (!parameter.language['az'].hasOwnProperty('hidden')) {
            // Handle complex
            let shouldHidden = undefined;
            let defaultValue = undefined;
            if (this.EnterSubMethodParameters(parameter)) {
                shouldHidden = true;
                defaultValue = "{";
                if (this.SelectFirstMethodParameter()) {
                    do {
                        if (this.Parameter_Type(this.SubMethodParameter) != SchemaType.Constant
                            && this.SubMethodParameter['readOnly'] != true) {
                            shouldHidden = false;
                            break;
                        }
                        else if (this.Parameter_Type(this.SubMethodParameter) == SchemaType.Constant) {
                            defaultValue = defaultValue + "\"" + this.Parameter_NameAz(this.SubMethodParameter) + "\": \"" + this.Parameter_DefaultValue(this.SubMethodParameter) + "\"";
                        }
                    } while (this.SelectNextMethodParameter())
                }
                if (shouldHidden == true) {
                    defaultValue = defaultValue + "}";
                }
                else {
                    defaultValue = undefined;
                }
                this.ExitSubMethodParameters();
            }

            // Handle simple parameter
            if (parameter?.language?.['cli']?.removed || parameter?.language?.['cli']?.hidden) {
                if (this.Parameter_DefaultValue(parameter) == undefined && parameter.required == true) {
                    parameter.language['az'].hidden = false;
                    this.session.message({
                        Channel: Channel.Warning,
                        Text: "OperationGroup " + this.CommandGroup.language['az'].name
                            + " operation " + this.Method_Name
                            + " parameter " + parameter.language['az'].name
                            + " should not be hidden while it is required without default value"
                    });
                }
                else {
                    parameter.language['az'].hidden = true;
                }
            } else {
                parameter.language['az'].hidden = parameter['hidden'] ?? shouldHidden ?? false;
                if (!parameter.language['az'].hasOwnProperty('default-value') && defaultValue != undefined) {
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
        if (!parameter.language['az'].hasOwnProperty('default-value')) {
            if (parameter?.language?.['cli']?.hasOwnProperty('default-value')) {
                parameter.language['az']['default-value'] = parameter.language['cli']['default-value'];
            }
            else if (parameter.schema.type == SchemaType.Constant) {
                parameter.language['az']['default-value'] = parameter.schema?.['value']?.value;
            }
            else {
                parameter.language['az']['default-value'] = parameter.schema.defaultValue;
            }
        }

        return parameter.language['az']['default-value'];
    }


    public Parameter_DefaultConfigKey(parameter: Parameter): string | undefined {
        if (!parameter.language['az'].hasOwnProperty('default-config-key')) {
            if (parameter?.language?.['cli']?.hasOwnProperty('default-config-key')) {
                parameter.language['az']['default-config-key'] = parameter.language['cli']['default-config-key'];
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
        return schema?.language['cli']?.['pythonFlattenedFrom'];
    }

    public Schema_IsPositional(schema: Schema): boolean {
        return schema?.language?.['cli']?.['positional'];
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
        if (this.SDK_IsTrack1 && !isNullOrUndefined(param.language['cli']?.['track1_name'])) {
            return param.language['cli']?.['track1_name'];
        }
        return param.language?.['python']?.name;
    }

    public Parameter_IsPositional(param: Parameter = this.MethodParameter): boolean {
        if (param?.schema && this.Schema_IsPositional(param.schema)) {
            return true;
        }
        return param?.language?.['cli']?.['positional']? true: false;
    }

    public get MethodParameter_IsRequired(): boolean {
        return this.Parameter_IsRequired(this.MethodParameter);
    }

    private Parameter_IsRequired(param: Parameter): boolean {
        return param?.required;
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

    //=================================================================================================================
    // Top Level Python Related Information
    //
    // Most of the information included here should be either produced by Python namer, or come from readme.az.md file.
    // Detailed descriptions below.
    //=================================================================================================================

    public GetModuleOperationName(): string {
        return ToSnakeCase(this.CommandGroup.language.default.name);
    }

    public GetModuleOperationNamePython(): string {
        if (this.SDK_IsTrack1 && !isNullOrUndefined(this.CommandGroup.language['cli']?.['track1_name'])) {
            return this.CommandGroup.language['cli']?.['track1_name'];
        }
        return this.CommandGroup.language['python'].name;
    }

    public GetModuleOperationNamePythonUpper(): string {
        if (this.SDK_IsTrack1 && !isNullOrUndefined(this.CommandGroup.language['cli']?.['track1_class_name'])) {
            return this.CommandGroup.language['cli']?.['track1_class_name'];
        }
        return this.CommandGroup.language['python']['className'];
    }

    public GetPythonNamespace(): string {
        return this.codeModel.language['az']['pythonNamespace'];
    }

    public GetPythonPackageName(): string {
        return this.options['package-name'];
    }

    public get PythonMgmtClient(): string {
        return this.codeModel.info['pascal_case_title'];
    }

    //=================================================================================================================
    // Example / Test Scenario related interface.
    //
    // This interface enumerates examples related to currently selected command.
    // It should be implemented when example processor implementation is in place.
    //=================================================================================================================

    public SelectFirstExample(): boolean {
        if (this.Method.extensions == undefined)
            return false;

        let example = this.Method.extensions['x-ms-examples'];
        if (example && example.length > 0) {
            this.currentExampleIndex = 0;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }

    }

    public SelectNextExample(): boolean {
        let example = this.Method.extensions['x-ms-examples'];
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

    public get Examples(): object {
        let extensions = this.Method.extensions;
        return (extensions && 'x-ms-examples' in extensions ? extensions['x-ms-examples'] : {})
    }

    public get ExampleAmount(): number {
        return Object.keys(this.Examples).length;
    }

    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersList(): MethodParam[] {
        let method_param_list: MethodParam[] = [];

        if (this.SelectFirstMethodParameter()) {
            do {
                if ((this.MethodParameter.implementation == 'Method' || (this.MethodParameter as any).polyBaseParam) && !this.MethodParameter_IsFlattened && this.MethodParameter?.schema?.type != 'constant') {
                    let submethodparameters = null;
                    if (this.EnterSubMethodParameters()) {
                        submethodparameters = this.submethodparameters;
                        this.ExitSubMethodParameters();
                    }
                    method_param_list.push(new MethodParam(this.MethodParameter, this.Parameter_IsList(this.MethodParameter), this.MethodParameter_IsListOfSimple || this.MethodParameter_IsSimpleArray, submethodparameters, this.currentParameterIndex >= this.Method.parameters.length));
                }
            } while (this.SelectNextMethodParameter());
        }
        return method_param_list;
    }

    public GetExampleParameters(example_obj): ExampleParam[] {
        let parameters: ExampleParam[] = [];
        let method_param_list: MethodParam[] = this.GetMethodParametersList();
        Object.entries(example_obj.parameters).forEach(([param_name, param_value]) => {
            this.FlattenExampleParameter(method_param_list, parameters, param_name, param_value, []);
        })
        return parameters;
    }

    private isDiscriminator(param: any): boolean {
        return (this.Command_GetOriginalOperation && param?.targetProperty?.['isDiscriminator']) ? true : false;
    }

    private AddExampleParameter(methodParam: MethodParam, example_param: ExampleParam[], value: any, polySubParam: MethodParam, ancestors: string[], rawValue: any): boolean {
        if (isNullOrUndefined(methodParam)) return false;
        let isList: boolean = methodParam.isList;
        let isSimpleListOrArray: boolean = methodParam.isSimpleListOrArray;
        let defaultName: string = methodParam.value.language['cli'].cliKey;
        let name: string = this.Parameter_MapsTo(methodParam.value);
        if (!isNullOrUndefined(methodParam.value.language?.['az']?.['alias']) && isArray(methodParam.value.language['az']['alias']) && methodParam.value.language['az']['alias'].length > 0) {
            name = methodParam.value.language['az']['alias'][0];
        }
        let realParam = methodParam;
        if (polySubParam) {
            isList = polySubParam.isList;
            isSimpleListOrArray = polySubParam.isSimpleListOrArray;
            defaultName = polySubParam.value.language['cli'].cliKey;
            name = this.Parameter_MapsTo(polySubParam.value);
            if (!isNullOrUndefined(polySubParam.value.language?.['az']?.['alias']) && isArray(polySubParam.value.language['az']['alias']) && polySubParam.value.language['az']['alias'].length > 0) {
                name = polySubParam.value.language['az']['alias'][0];
            }
            realParam = polySubParam;
        }

        function toActionString(model: CodeModelCliImpl,dict, seperator=" ", init_keys=undefined): [string, string[]] {
            let ret: string = "";
            let keys: string[] = [];
            if (!isNullOrUndefined(init_keys)) {
                keys = init_keys;
            }
            for (let k in dict) {
                let cliName = null;
                for (let param of [methodParam, polySubParam]) {
                    if (param?.submethodparameters) {
                        for (let submethodProperty of param.submethodparameters) {
                            if (submethodProperty.language['cli'].cliKey.toLowerCase() == k.toLowerCase()) {
                                cliName = model.Parameter_NameAz(submethodProperty);
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
                    for (let v of dict[k]) {
                        if (ret.length > 0) {
                            ret += seperator;
                        }
                        ret += `${cliName}=${ToJsonString(v)}`;
                    }
                }
                else {
                    if (ret.length > 0) {
                        ret += seperator;
                    }
                    let v = ToJsonString(dict[k]);
                    // if (v.startsWith("\"")) {
                    //     v = v.substr(1, v.length-2);
                    // }
                    ret += `${cliName}=${v}`;
                }
                if (!keys.includes(cliName)) keys.push(cliName)
            }
            return [ret, keys];
        } 

        let handled = false;
        if (isList) {
            if (isSimpleListOrArray) {
                let keys = [];
                let ret = "";
                if (value instanceof Array) {       // spread list
                    handled = true;
                    if (this.Parameter_IsShorthandSyntax(realParam.value)) {
                        for (let i=0; i<value.length; i++) {
                            let instanceString: string;
                            [instanceString, keys] = toActionString(this, value[i], ",", keys);
                            instanceString = instanceString.trim();
                            if (ret.length>0 && instanceString.length>0) ret += " ";
                            ret += instanceString;
                        }
                        example_param.push(new ExampleParam(name, ret, false, KeyValueType.ShorthandSyntax, keys, defaultName, realParam, ancestors, value));
                    }
                    else if (this.Parameter_IsSimpleArray(realParam.value)) {
                        if (value.length>0) {           // use value only when it's lenght > 0
                            for (let i=0; i<value.length; i++) {
                                ret += ToJsonString(value[i]) + " ";
                            }
                            ret = ret.trim();
                            example_param.push(new ExampleParam(name, ret, false, KeyValueType.SimpleArray, [], defaultName, realParam, ancestors, value));
                        }
                    }
                    else {
                        for (let i=0; i<value.length; i++) {
                            this.AddExampleParameter(methodParam, example_param, value[i], polySubParam, ancestors, rawValue[i]);
                        }
                    }
                }
                else if (typeof rawValue == 'object') {    // KEY=VALUE form
                    handled = true;
                    if (this.Parameter_IsPositional(realParam.value)) {
                        keys = this.Parameter_PositionalKeys(realParam.value, realParam.submethodparameters);
                        for (let k of keys) {
                            ret += " ";
                            FIND_PARAM:
                            for (let param of [polySubParam, methodParam]) {
                                if (param?.submethodparameters) {
                                    for (let subMethodParam of param.submethodparameters) {
                                        if (this.Parameter_NamePython(subMethodParam) == k) {
                                            ret += ToJsonString(rawValue[subMethodParam.language['cli'].cliKey]);
                                            break FIND_PARAM;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ret = ret.trim();
                    if (ret.trim().length > 0) {
                        example_param.push(new ExampleParam(name, ret, false, KeyValueType.PositionalKey, keys, defaultName, realParam, ancestors, value));
                    }
                    else {
                        ////////////
                        [ret, keys] = toActionString(this, value);
                        if (ret.length > 0) {
                            example_param.push(new ExampleParam(name, ret, false, KeyValueType.Classic, keys, defaultName, realParam, ancestors, value));
                        }
                    }    
                }
            }
            if (!handled) {
                if (typeof value == 'string') {
                    example_param.push(new ExampleParam(name, value, false, KeyValueType.No, [], defaultName, realParam, ancestors, value));
                }
                else {
                    // JSON form
                    example_param.push(new ExampleParam(name, JSON.stringify(value).split(/[\r\n]+/).join(""), true, KeyValueType.No, [], defaultName, realParam, ancestors, value));
                }
            }
        }
        else if (typeof value != 'object') {
            example_param.push(new ExampleParam(name, value, false, KeyValueType.No, [], defaultName, realParam, ancestors, value));
        }
        else {
            // ignore object values if not isList.
            return false;
        }
        return true;
    }

    private FlattenProperty(paramSchema: any, exampleValue: any) {
        if (paramSchema?.type == 'array' && exampleValue instanceof Array) {
            return exampleValue.map(x => this.FlattenProperty(paramSchema?.elementType, x));
        }
        if (['object', 'dictionary'].indexOf(paramSchema?.type) >= 0 && paramSchema?.properties && typeof exampleValue == 'object' && !(exampleValue instanceof Array)) {
            let ret = deepCopy(exampleValue);
            for (let subProperty of paramSchema?.properties) {
                if (subProperty.flattenedNames && subProperty.flattenedNames.length > 0) {
                    let subValue = exampleValue;
                    let i = 0;
                    for (; i < subProperty.flattenedNames.length; i++) {
                        if (isNullOrUndefined(subValue)) break;
                        let k = subProperty.flattenedNames[i];
                        let v = subValue[k];
                        if (v === undefined) break;
                        subValue = v;
                    }
                    if (i == subProperty.flattenedNames.length) {
                        ret[subProperty?.language['cli'].cliKey] = subValue;
                    }
                }
            }
            for (let subProperty of paramSchema?.properties) {
                if (subProperty.flattenedNames && subProperty.flattenedNames.length > 0) {
                    delete ret[subProperty.flattenedNames[0]];
                }
            }
            for (let subProperty of paramSchema?.properties) {
                let k = subProperty?.language['cli'].cliKey;
                if (exampleValue && exampleValue[k]) {
                    exampleValue[k] = this.FlattenProperty(subProperty, exampleValue[k]);
                }
            }
            return ret;
        }
        return deepCopy(exampleValue);
    }

    private matchMethodParam(method_param_list: MethodParam[], paramName: string): MethodParam[] {
        let ret: MethodParam[] = [];
        if (!paramName) return ret;
        for (let method_param of method_param_list) {
            let serializedName = method_param.value.targetProperty?.serializedName;
            if (!serializedName) serializedName = method_param.value.language['cli'].cliKey;
            // let method_param_key = method_param.value.language['cli'].cliKey;
            if (serializedName.toLowerCase() == paramName.toLowerCase()) {
                ret.push(method_param);
            }
        }
        return ret;
    }

    public FlattenExampleParameter(method_param_list: MethodParam[], example_param: ExampleParam[], name: string, value: any, ancestors: string[]) {
        for (let methodParam of this.matchMethodParam(method_param_list, name)) {
            let polySubParam: MethodParam = null;
            let netValue = typeof value === 'object' && value !== null ? deepCopy(value) : value;
            let rawValue = deepCopy(netValue);
            if (methodParam.value['isPolyOfSimple']) {
                let keyToMatch = methodParam.value.schema.discriminator?.property?.language?.default?.name;
                if (keyToMatch) {
                    for (let method_param of method_param_list) {
                        let polySubParamObj = method_param.value;
                        if (polySubParamObj['polyBaseParam'] == methodParam.value && polySubParamObj.schema.extensions) {
                            let valueToMatch = polySubParamObj.schema.extensions['x-ms-discriminator-value'];
                            if (netValue[keyToMatch] == valueToMatch) {
                                polySubParam = method_param;
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
            }
            else {
                netValue = this.FlattenProperty(methodParam.value?.schema, netValue);
                rawValue = this.FlattenProperty(methodParam.value?.schema, rawValue);
            }
            if ('pathToProperty' in methodParam.value && ancestors.length - methodParam.value['pathToProperty'].length == 1) {
                // if the method parameter has 'pathToProperty', check the path with example parameter full path.
                let ancestors_ = deepCopy(ancestors) as string[];
                let match = true;
                for (let i = methodParam.value['pathToProperty'].length - 1; i >= 0; i--) {
                    let parent = ancestors_.pop();
                    if (methodParam.value['pathToProperty'][i].language.az.name.toLowerCase() != parent.toLowerCase()) {
                        match = false;
                    };
                }
                if (match) {
                    // example_param.set(name, value);
                    this.AddExampleParameter(methodParam, example_param, netValue, polySubParam, ancestors, rawValue);
                    return;
                }
            }
            else if ('targetProperty' in methodParam.value && 'flattenedNames' in methodParam.value['targetProperty'] && ancestors.length - methodParam.value['targetProperty']['flattenedNames'].length == 0 && ancestors.length > 0) {
                // if the method parameter has 'flattenedNames', check the names (except the last name) with example parameter full path.
                let ancestors_ = deepCopy(ancestors) as string[];
                let match = true;
                for (let i = methodParam.value['targetProperty']['flattenedNames'].length - 2; i >= 0; i--) {
                    if (ancestors_.length <= 0) {
                        match = false;
                        break;
                    }
                    let parent = ancestors_.pop();
                    if (methodParam.value['targetProperty']['flattenedNames'][i].toLowerCase() != parent.toLowerCase()) {
                        match = false;
                    };
                }
                if (methodParam.inBody && ancestors_.length != 1 || !methodParam.inBody && ancestors_.length > 0) {
                    match = false;
                }
                if (match) {
                    // example_param.set(name, value);
                    this.AddExampleParameter(methodParam, example_param, netValue, polySubParam, ancestors, rawValue);
                    return;
                }
            }
            else if (ancestors.length == 0) {
                // example_param.set(name, value);
                if (this.AddExampleParameter(methodParam, example_param, netValue, polySubParam, ancestors, rawValue)) return;
            }
        }

        if (value !== null && typeof value === 'object') {
            for (let sub_name in value) {
                this.FlattenExampleParameter(method_param_list, example_param, sub_name, value[sub_name], ancestors.concat(name));
            }
        }
    }

    public ConvertToCliParameters(example_params: ExampleParam[]): ExampleParam[] {
        let ret: ExampleParam[] = [];
        for (let param of example_params) {
            //Object.entries(example_params).forEach(() => {
            let param_name = ToSnakeCase(param.name);
            if (param_name.endsWith('_name')) {
                if (param_name == "resource_group_name") {
                    param_name = "resource_group";
                }
                // else {
                //     param_name = "name";
                // }
            }
            param_name = param_name.split("_").join("-");
            ret.push(new ExampleParam("--" + param_name, param.value, param.isJson, param.keyValue, param.keys, param.defaultName, param.methodParam, param.ancestors, param.rawValue));
        };
        return ret;
    }

    private filterExampleByPoly(example_obj: any, example: CommandExample): boolean {
        function getPolyClass(model): string {
            let cliKey = model.Method.language['cli'].cliKey;
            if (cliKey) {
                let names = cliKey.split('#');
                if (names && names.length > 1) {
                    return names[names.length - 1];
                }
            }
            return '';
        }
        let valueToMatch = getPolyClass(this);
        if (!valueToMatch) return true;

        function matchPolyClass(example: CommandExample, keyToMatch: string, valueToMatch: string) {
            for (let param of example.Parameters) {
                if ((('--' + keyToMatch).toLowerCase() == param.name.toLowerCase() || ('--' + keyToMatch + '-').toLowerCase() == param.name.toLowerCase()) && typeof param.value == 'string') {
                    return valueToMatch.toLowerCase() == param.value.toLowerCase();
                }
            }
            return true;
        }

        // check polymophism here
        let originalOperation = this.Method_GetOriginalOperation;
        if (!isNullOrUndefined(originalOperation)) {
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (!isNullOrUndefined(this.MethodParameter['extensions']?.['cli-poly-as-resource-base-schema'])) {
                        let originalSchema = this.MethodParameter['extensions']?.['cli-poly-as-resource-base-schema'];
                        let keyToMatch = (originalSchema as any).discriminator.property.language.default.name; //type
                        if (!matchPolyClass(example, keyToMatch, valueToMatch)) {
                            return false;
                        }
                    }
                } while (this.SelectNextMethodParameter())
            }
        }
        return true;
    }

    public GetExamples(): CommandExample[] {
        function forUpdate(model: CodeModelCliImpl,exampleName:string): boolean {
            let lowercase: string = exampleName.toLowerCase();
            return (lowercase.endsWith("_update") ||
            model.ExampleAmount>1 && lowercase.indexOf("update")>=0 && lowercase.indexOf("create")<0
            );
        }

        let examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, example_obj]) => {
                let example = new CommandExample();
                example.Method = this.Command_MethodName;
                example.Id = `/${this.CommandGroup_Key}/${this.Method_HttpMethod}/${id}`;
                example.Title = example_obj.title || id;
                example.Path = this.Method_Path;
                example.HttpMethod = this.Method_HttpMethod;
                example.ResourceClassName = this.CommandGroup_Key;
                const params = this.GetExampleParameters(example_obj);
                example.Parameters = this.ConvertToCliParameters(params);
                example.MethodResponses = this.Method.responses || [];
                example.Method_IsLongRun = this.Method.extensions?.['x-ms-long-running-operation'] ? true : false;
                example.ExampleObj = example_obj;
                if (this.Method_GetSplitOriginalOperation) {
                    //filter example by name for generic createorupdate
                    if (this.Command_MethodName.toLowerCase() == "update" && !forUpdate(this, id))
                        return;
                    if (this.Command_MethodName.toLowerCase() != "update" && forUpdate(this, id))
                        return;
                }
                if (this.filterExampleByPoly(example_obj, example)) {
                    for (let i = 0; i < example.Parameters.length; i++) {
                        if (this.isDiscriminator(example.Parameters[i].methodParam.value)) {
                            example.Parameters.splice(i, 1);
                            i--;
                        }
                    }
                    examples.push(example);
                }
                example.CommandString = this.GetExampleItems(example, false, undefined).join(" ");
                example.WaitCommandString = this.GetExampleWait(example).join(" ");
            });
        }
        return examples;
    }

    public GetExampleChecks(example: CommandExample): string[] {
        let ret: string[] = [];
        if (!this.GenChecks) return ret;
        let resourceObjectName = undefined;
        for (let param of example.Parameters) {
            if (example.ResourceClassName && this.resource_pool.isResource(param.defaultName) == example.ResourceClassName) {
                resourceObjectName = param.value;
            }
        }

        let resourceObject = this.resource_pool.findResource(example.ResourceClassName, resourceObjectName, ObjectStatus.Created);
        if (resourceObject) {
            ret.push(...resourceObject.getCheckers(this.resource_pool, example));
        }
        ret.push(...this.resource_pool.getListCheckers(example));
        return ret;
    }

    public GetExampleItems(example: CommandExample, isTest: boolean, commandParams: any, minimum=false): string[] {
        let parameters: string[] = [];
        parameters.push("az " + this.Command_Name);

        let hasRG = false;
        let resourceObjectName = undefined;
        for (let param of example.Parameters) {
            if (minimum && !this.Parameter_IsRequired(param.methodParam.value)) continue;
            let param_value = param.value;
            if (isTest || this.FormalizeNames) {
                let replaced_value = this.resource_pool.addEndpointResource(param_value, param.isJson, param.keyValue, [], [], param, isTest);
                if (replaced_value == param_value) {
                    replaced_value = this.resource_pool.addParamResource(param.defaultName, param_value, param.isJson, param.keyValue, isTest);
                }
                param_value = replaced_value;
                param.replacedValue = replaced_value;
            }
            let slp = param_value;
            if (param.keyValue == KeyValueType.No) {
                slp = ToJsonString(slp);
            }
            parameters.push(param.name + " " + slp);

            if (["--resource-group", "-g"].indexOf(param.name) >= 0) {
                hasRG = true;
            }

            if (example.ResourceClassName && this.resource_pool.isResource(param.defaultName) == example.ResourceClassName) {
                resourceObjectName = param.value;
            }
        }

        if (isTest && !hasRG && commandParams && commandParams[this.Command_Name] && commandParams[this.Command_Name].has("resourceGroupName")) {
            parameters.push('-g ""');
        }

        if (isTest) {
            let resourceObject = this.resource_pool.findResource(example.ResourceClassName, resourceObjectName, undefined);
            if (resourceObject) {
                let httpMethod = example.HttpMethod.toLowerCase();
                if (['put', 'post', 'patch'].indexOf(httpMethod) >= 0) {
                    if (httpMethod == 'post') {
                        resourceObject.example_params = [];
                    }
                    for (let param of example.Parameters) {
                        if (minimum && !this.Parameter_IsRequired(param.methodParam.value)) continue;
                        resourceObject.addOrUpdateParam(param);
                    }
                    resourceObject.testStatus = ObjectStatus.Created;
                }
                if (httpMethod == 'delete') {
                    resourceObject.testStatus = ObjectStatus.Deleted;
                }
            }
        }

        return parameters;
    }

    public GetExampleWait(example: CommandExample): string[] {
        let parameters: string[] = [];
        let foundResource = false;
        if (example.HttpMethod.toLowerCase() == 'put' && example.Method_IsLongRun && example.MethodResponses.length > 0 && (example.MethodResponses[0].schema?.properties || []).find(property => {
            return property?.language?.cli?.cliKey == "provisioningState";
        })) {
            let words = this.Command_Name.split(' ');
            words = words.slice(0, words.length - 1);
            words.push('wait');
            parameters.push(`az ${words.join(' ')} --created`);
            for (let param of example.Parameters) {
                let paramKey = param.methodParam.value.language?.cli?.cliKey;
                if (paramKey == 'resourceGroupName' || this.resource_pool.isResource(paramKey) == example.ResourceClassName) {
                    let param_value = param.value;
                    let replaced_value = this.resource_pool.addEndpointResource(param_value, param.isJson, param.keyValue, [], [], param);
                    if (replaced_value == param_value) {
                        replaced_value = this.resource_pool.addParamResource(param.defaultName, param_value, param.isJson, param.keyValue);
                    }
                    param_value = replaced_value;
                    let slp = param_value;
                    if (param.keyValue == KeyValueType.No) {
                        slp = ToJsonString(slp);
                    }
                    parameters.push(param.name + " " + slp);
                }
                if (this.resource_pool.isResource(paramKey) == example.ResourceClassName) foundResource = true;
            }
        }
        return foundResource ? parameters : [];
    }

    public GetPreparerEntities(): any[] {
        return this.resource_pool.createPreparerEntities();
    }

    public GetSubscriptionKey(): string {
        if (this.resource_pool.use_subscription) {
            return ResourcePool.KEY_SUBSCRIPTIONID;
        }
        else {
            return null;
        }
    }

    public FindExampleById(id: string, commandParams: any, examples: CommandExample[], minimum=false): string[][] {
        let ret: string[][] = [];
        this.GetAllExamples(id, (example) => {
            examples.push(example);
            ret.push(this.GetExampleItems(example, true, commandParams, minimum));
        });
        return ret;
    }

    public FindExampleWaitById(id: string): string[][] {
        let ret: string[][] = [];
        this.GetAllExamples(id, (example) => {
            let waitCmd = this.GetExampleWait(example);
            if (waitCmd.length > 0) ret.push(waitCmd);
        });
        return ret;
    }

    public GatherInternalResource() {
        let internal_resources = {};  // resource_key --> list of resource languages
        this.GetAllMethods(null, () => {
            if (!(this.CommandGroup_Key in internal_resources)) {
                internal_resources[this.CommandGroup_Key] = [this.CommandGroup_Key,];
            }
            // let commands = this.CommandGroup_Name.split(" ");
            // let resource_name = commands[commands.length - 1] + "-name";
            let resource_name = this.CommandGroup_DefaultName + "Name";
            if (internal_resources[this.CommandGroup_Key].indexOf(resource_name) < 0) {
                internal_resources[this.CommandGroup_Key].push(resource_name);
            }
        });
        this.resource_pool.addResourcesInfo(internal_resources);

        //find dependency relationships of internal_resources
        this.GetAllMethods(null, () => {
            let depend_resources = [];
            let depend_parameters = [];

            let examples = this.GetExamples();
            // recognize depends by endpoint in examples
            for (let example of examples) {
                for (let param of example.Parameters) {
                    let resources = [];
                    this.resource_pool.addEndpointResource(param.value, param.isJson, param.keyValue, [], resources, param);
                    for (let on_resource of resources) {
                        if (on_resource != this.CommandGroup_Key && depend_resources.indexOf(on_resource) < 0) {
                            depend_resources.push(on_resource);
                            depend_parameters.push(param.name);
                        }
                    }
                    this.resource_pool.addParamResource(param.defaultName, param.value, param.isJson, param.keyValue);
                }
            }

            //recognize depends by parameter name'
            let createdObjectNames = [];
            let isCreateMehod = this.Method_HttpMethod == 'put';
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (this.MethodParameter.implementation == 'Method' && !this.MethodParameter_IsFlattened && this.MethodParameter?.schema?.type != 'constant') {
                        let param_name = this.MethodParameter.language["cli"].cliKey;
                        let on_resource = this.resource_pool.isResource(param_name);
                        for (let example of examples) {
                            for (let param of example.Parameters) {
                                if (on_resource && (on_resource != this.CommandGroup_Key) && depend_resources.indexOf(on_resource) < 0) {
                                    // the resource is a dependency only when it's a parameter in an example.
                                    if (param_name == param.defaultName && depend_resources.indexOf(on_resource) < 0) {
                                        depend_resources.push(on_resource);
                                        depend_parameters.push(param_name);
                                    }
                                }
                                if (isCreateMehod && on_resource && on_resource == this.CommandGroup_Key && createdObjectNames.indexOf(param.value) < 0) {
                                    createdObjectNames.push(param.value);
                                }
                            }
                        }
                    }
                } while (this.SelectNextMethodParameter())
            }

            this.resource_pool.setResourceDepends(this.CommandGroup_Key, depend_resources, depend_parameters, createdObjectNames);
        });

        if (isNullOrUndefined(this._defaultTestScenario)) {
            this._defaultTestScenario = GenerateDefaultTestScenario(this.GetAllExamples());
            this._defaultTestScenario = GenerateDefaultTestScenarioByDependency(this.GetAllExamples(), this.resource_pool, this._defaultTestScenario);
            this.SortExamplesByDependency();
            PrintTestScenario(this._defaultTestScenario);
        }

        if (!this._configuredScenario && isNullOrUndefined(this._testScenario)) {
            this._testScenario = GroupTestScenario(this._defaultTestScenario, this.Extension_NameUnderscored);
        }

        let commandParams = {};
        this.GetAllMethods(null, () => {
            if (!commandParams[this.Command_Name]) commandParams[this.Command_Name] = new Set();
            if (this.SelectFirstMethodParameter()) {
                do {
                    if ((this.MethodParameter.implementation == 'Method' || (this.MethodParameter as any).polyBaseParam) && !this.MethodParameter_IsFlattened && this.MethodParameter?.schema?.type != 'constant') {
                        commandParams[this.Command_Name].add(this.MethodParameter.language['cli'].cliKey);
                    }
                } while (this.SelectNextMethodParameter());
            }
        });
        return commandParams;
    }

    public SortExamplesByDependency() {
        let depend_on = (example_a: CommandExample, example_b: CommandExample): boolean => {
            // TODO: check dependency by object
            return this.resource_pool.isDependResource(example_a.ResourceClassName, example_b.ResourceClassName);
        }

        let isCreate = (example: CommandExample): boolean => {
            return example.HttpMethod == 'put';
        }

        let isDelete = (example: CommandExample): boolean => {
            return example.HttpMethod == 'delete';
        }

        // stable sort
        let compare = (examples_a: CommandExample, examples_b: CommandExample): number => {
            if (!examples_a || !examples_b) return 0;

            if (examples_a.ResourceClassName == examples_b.ResourceClassName) {
                if (isCreate(examples_b) && !isCreate(examples_a)) {
                    return 1;
                }
                else if (isDelete(examples_b) && !isDelete(examples_a)) {
                    return -1;
                }
                else if (isCreate(examples_a) && !isCreate(examples_b)) {
                    return -1;
                }
                else if (isDelete(examples_a) && !isDelete(examples_b)) {
                    return 1;
                }
                else {
                    return examples_a.Id.localeCompare(examples_b.Id);
                }
            }
            else if (depend_on(examples_a, examples_b)) {
                if (isCreate(examples_b)) {
                    return 1;
                }
                else if (isDelete(examples_b)) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else if (depend_on(examples_b, examples_a)) {
                if (isCreate(examples_a)) {
                    return -1;
                }
                else if (isDelete(examples_a)) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            return examples_a.Id.localeCompare(examples_b.Id);
        };


        let scenarioExamples: Map<string, CommandExample> = new Map<string, CommandExample>();
        let commandExamples = this.GetAllExamples();
        for (let i = 0; i < this._defaultTestScenario.length; i++) {
            for (let commandExample of commandExamples) {
                if (this.matchExample(commandExample, this._defaultTestScenario[i]['name'])) {
                    scenarioExamples.set(this._defaultTestScenario[i]['name'], commandExample);
                    break;
                }
            }
        }

        this._defaultTestScenario = MergeSort(this._defaultTestScenario, (example_a, example_b) => {
            return compare(scenarioExamples.get(example_a['name']), scenarioExamples.get(example_b['name']));
        });
    }

    public GetAllMethods(command_group?: string, callback?: () => void): any[] {
        let ret: [];
        this.SelectFirstExtension();
        if (this.SelectFirstCommandGroup()) {
            do {    // iterate all CommandGroups
                if (command_group && command_group.toLowerCase() != this.CommandGroup_Key.toLowerCase()) continue;
                while (this.currentOperationIndex >= 0) {  // iterate all Commands
                    this.SelectFirstMethod();
                    do {
                        if (callback) {
                            callback();
                        }
                    } while (this.SelectNextMethod())
                    this.SelectNextCommand();
                }
            } while (this.SelectNextCommandGroup())
        }
        return ret;
    }

    private matchExample(example: CommandExample, id: string) {
        if (!id) return false;
        return example.Id.toLowerCase() == id.toLowerCase() || example.Id.toLowerCase().endsWith(`/${id.toLowerCase()}`);
    }
    public GetAllExamples(id?: string, callback?: (example) => void): CommandExample[] {
        let ret: CommandExample[] = [];
        let found = false;
        this.GetAllMethods(null, () => {
            if (found) return;
            for (let example of this.GetExamples()) {
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

    public set CliCoreLib(lib: string) {
        this._cliCoreLib = lib;
    }

    public get CliCoreLib(): string {
        if (isNullOrUndefined(this._cliCoreLib)) {
            return CodeModelCliImpl.DEFAULT_CLI_CORE_LIB;
        }
        return this._cliCoreLib;
    }

    public get AzureCliFolder(): string {
        return this.codeModel.language['az']?.['azureCliFolder'] + "/";
    }


    public get AzextFolder(): string {
        return this.codeModel.language['az']?.['azextFolder'];
    }

    public get azOutputFolder(): string {
        return this.codeModel.language['az']?.['azOutputFolder']
    }

    public get IsCliCore() {
        return this.codeModel.language['az']?.['isCliCore'] ? true : false;
    }

    public get SDK_NeedSDK() {
        return this.codeModel.language['az']?.['sdkNeeded'] ? true : false;
    }

    public get SDK_IsTrack1() {
        return this.codeModel.language['az']?.['sdkTrack1'] ? true : false;
    }

    public get SDK_NoFlatten() {
        return this.codeModel.language['az']?.['sdkNoFlatten'] ? true : false;
    }

}
