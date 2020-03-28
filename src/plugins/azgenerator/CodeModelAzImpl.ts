/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz, CommandExample, ExampleParam } from "./CodeModelAz";
import { CodeModel, SchemaType, Schema, ParameterLocation, Operation, Value, Parameter, VirtualParameter, Property, Request } from '@azure-tools/codemodel';
import { serialize, deserialize, EnglishPluralizationService, pascalCase } from "@azure-tools/codegen";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { ToSnakeCase, MergeSort, deepCopy } from '../../utils/helper';
import { values } from "@azure-tools/linq";
import { GenerateDefaultTestScenario, ResourcePool, getResourceKey, PreparerEntity } from './ScenarioTool'
import { timingSafeEqual } from "crypto";
import { isNullOrUndefined } from "util";


class MethodParam {
    public value: any;
    public isList: boolean;
    public isSimpleList: boolean;
    public submethodparameters: Property[];
    public constructor(value, isList, isSimpleList, submethodparameters) {
        this.value = value;
        this.isList = isList;
        this.isSimpleList = isSimpleList;
        this.submethodparameters = submethodparameters;
    }
}

export class CodeModelCliImpl implements CodeModelAz {
    codeModel: CodeModel;
    options: any;
    extensionName: string;
    currentOperationGroupIndex: number;
    currentOperationIndex: number;
    currentParameterIndex: number;
    currentExampleIndex: number;
    preMethodIndex: number;
    currentMethodIndex: number;
    resource_pool: ResourcePool;

    suboptions: Property[];
    submethodparameters: Property[];
    currentSubOptionIndex: number;
    private _testScenario: any[];

    async init() {
        this.options = await this.session.getValue('az');
        this.extensionName = this.options['extensions'];
        this.currentOperationGroupIndex = -1;
        this.currentOperationIndex = -1;
        this.currentParameterIndex = -1;
        this.currentExampleIndex = -1;
        this.preMethodIndex = -1;
        this.currentMethodIndex = -1;
        this.suboptions = null;
        this.currentSubOptionIndex = -1;
        this.submethodparameters = null;
        //this.sortOperationByAzCommand();
    }

    public constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
        this.resource_pool = new ResourcePool();
        this.sortOperationByAzCommand();
        this.calcOptionRequiredByMethod();
        if (this.codeModel['test-scenario']) {
            if ('examples' in this.codeModel['test-scenario']) {
                //new style of example configuration
                this._testScenario = this.codeModel['test-scenario']['examples'];
            }
            else {
                //old style of example configuration
                this._testScenario = this.codeModel['test-scenario']
            }
        }
        else {
            this._testScenario = GenerateDefaultTestScenario(this.GetAllExamples());
        }
    }

    private getOrder(op: string) {
        let opOrder = ["list", "show", "create", "update", "delete"];
        let order = opOrder.indexOf(op.toLowerCase());
        if (order == -1) {
            order = opOrder.length;
        }
        return order.toLocaleString();
    }

    private sortOperationByAzCommand() {
        for (let [idx, operationGroup] of this.codeModel.operationGroups.entries()) {
            operationGroup.operations.sort((a, b) => {
                let oa = this.getOrder(a.language['az']['name']) + "_" + a.language['az']['name'] + "_" + (100 - a.parameters.length);
                let ob = this.getOrder(b.language['az']['name']) + "_" + b.language['az']['name'] + "_" + (100 - b.parameters.length);
                return oa.localeCompare(ob);
            });
            this.codeModel.operationGroups[idx] = operationGroup;
        }

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
                            if (this.SelectFirstMethodParameter()) {
                                do {
                                    let parameters = this.MethodParameter;
                                    if (parameters.language['cli'].required) {
                                        this.MethodParameter['RequiredByMethod'] = true;
                                    } else {
                                        this.MethodParameter['RequiredByMethod'] = paramRequired.get(this.MethodParameter_Name) == paramTime ? true : false;
                                    }
                                } while (this.SelectNextMethodParameter());
                            }
                            while (this.SelectNextMethod()) {
                                if (this.SelectFirstMethodParameter()) {
                                    do {
                                        let parameters = this.MethodParameter;
                                        if (parameters.language['cli'].required) {
                                            this.MethodParameter['RequiredByMethod'] = true;
                                        } else {
                                            this.MethodParameter['RequiredByMethod'] = paramRequired.get(this.MethodParameter_Name) == paramTime ? true : false;
                                        }
                                    } while (this.SelectNextMethodParameter());
                                }

                            }
                        }
                    } while (this.SelectNextCommand());
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

    public get Extension_NameUnderscored() {
        return this.extensionName.replace(/-/g, '_');
    }

    public get Extension_NameClass(): string {
        return this.codeModel.info['pascal_case_title']
    }

    public get Extension_TestScenario(): any {
        return this._testScenario;
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
            if (this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].hidden || this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].removed) {
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
            if (this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].hidden || this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].removed) {
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

    public get CommandGroup_Name(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].command;
    }

    public get CommandGroup_Help(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].command;
    }

    public get CommandGroup_Key(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].$key || this.CommandGroup_Name;
    }

    public get CommandGroup_DefaultName(): string {
        let eps = new EnglishPluralizationService();
        return eps.singularize(this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].cliKey);
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
        if (this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length > 0) {
            this.currentOperationIndex = 0;
            let operation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex];
            this.preMethodIndex = this.currentOperationIndex;
            let needNext = false;
            if (operation.language['cli'].hidden || operation.language['cli'].removed) {
                needNext = true;
            }
            while (this.currentOperationIndex + 1 < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                let tmpOperation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1];
                if (tmpOperation.language['az'].command == operation.language['az'].command) {
                    this.currentOperationIndex++;
                    if (tmpOperation.language['cli'].hidden != true && tmpOperation.language['cli'].removed != true) {
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
        if (this.currentOperationIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length - 1) {
            this.currentOperationIndex++;
            this.preMethodIndex = this.currentOperationIndex;
            let operation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex];
            let needNext = false;
            if (operation.language['cli'].hidden || operation.language['cli'].removed) {
                needNext = true;
            }
            while (this.currentOperationIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length - 1) {
                let tmpOperation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1];
                if (operation.language['az'].command == tmpOperation.language['az'].command) {
                    this.currentOperationIndex++;
                    if (tmpOperation.language['cli'].hidden != true && tmpOperation.language['cli'].removed != true) {
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

    public get Command_FunctionName() {
        return this.Command_Name.replace(/( |-)/g, "_");
    }

    public get Command_Name(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command;
    }

    public get Command_MethodName(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].name;
    }

    public get Command_Help(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].description.replace(/\n/g, " ");
    }

    public get Command_CanSplit(): boolean {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex]['canSplitOperation'] ? true : false;
    }

    public get Command_IsLongRun(): boolean {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions?.['x-ms-long-running-operation'] ? true : false;
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
            if (method.language['cli'].removed || method.language['cli'].hidden) {
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
            if (method.language['cli'].removed || method.language['cli'].hidden) {
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
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex];
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
            return false;
        }
    }

    public get Method_IsLongRun(): boolean {
        return this.Method.extensions?.['x-ms-long-running-operation'] ? true : false;
    }

    public get Method_Name(): string {
        return this.Method.language['python'].name;
    }

    public get Method_BodyParameterName(): string {
        return null;
    }

    public get Method_Path(): string {
        return this.Method.requests[0].protocol?.http?.path;
    }

    public get Method_HttpMethod(): string
    {
        let ret = this.Method.requests[0].protocol?.http?.method || "unknown";
        return ret.toLowerCase();
    }

    public Get_Method_Name(language = "az"): string {
        return this.Method.language[language].name;
    }

    //=================================================================================================================
    // Methods Parameters.
    //
    // This interface is designed to enumerate all parameters of the selected method and their mapping to Python SDK.
    //=================================================================================================================
    public SelectFirstMethodParameter(): boolean {
        if (this.submethodparameters != null) {
            this.currentSubOptionIndex = 0;
            let parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (parameter?.language['cli']?.hidden || parameter?.language['cli']?.removed) {
                if (!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if (this.MethodParameters.length > 0) {
            this.currentParameterIndex = 0;
            let parameter = this.MethodParameter;
            const currentParameterName = parameter.language['python'].name;
            if (this.MethodParameter_IsHidden || this.codeModel.globalParameters.indexOf(this.MethodParameter) > -1) {
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

    public SelectNextMethodParameter(): boolean {
        if (this.submethodparameters != null) {
            this.currentSubOptionIndex++;

            if (this.currentSubOptionIndex >= this.submethodparameters.length) {
                return false;
            }
            let parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (parameter?.language['cli']?.hidden || parameter?.language['cli']?.removed) {
                if (!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if (this.currentParameterIndex < this.MethodParameters.length - 1) {
            this.currentParameterIndex++;
            let parameter = this.MethodParameter;
            const currentParameterName = parameter.language['python'].name;
            if (this.MethodParameter_IsHidden || this.codeModel.globalParameters.indexOf(this.MethodParameter) > -1) {
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

    public EnterSubMethodParameters(): boolean {
        // this should only works for 
        // 1. objects with simple properties 
        // 2. or objects with arrays as properties but has simple element type 
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        if (!this.MethodParameter_IsList) {
            return false;
        }
        if (!this.MethodParameter_IsListOfSimple)
            return false;

        this.submethodparameters = null;
        if (this.MethodParameter_Type == SchemaType.Array || this.MethodParameter_Type == SchemaType.Dictionary) {
            if ((this.MethodParameter['schema'])['elementType'].type == SchemaType.Object) {
                this.submethodparameters = this.MethodParameter['schema']?.['elementType']?.properties;
                for (let parent of values(this.MethodParameter['schema']?.['elementType']?.['parents']?.all)) {
                    if (parent['properties'] == undefined || parent['properties'] == null) {
                        continue;
                    }
                    this.submethodparameters = this.submethodparameters.concat(parent['properties'])
                }
            }
        } else if (this.MethodParameter_Type == SchemaType.Object) {
            this.submethodparameters = this.MethodParameter['schema']['properties'];
            for (let parent of values(this.MethodParameter['schema']?.['parents']?.all)) {
                if (parent['properties'] == undefined || parent['properties'] == null) {
                    continue;
                }
                this.submethodparameters = this.submethodparameters.concat(parent['properties'])
            }
        }
        if (this.submethodparameters == null) {
            return false;
        }
        return true;
    }

    public ExitSubMethodParameters(): boolean {
        if (this.submethodparameters != null) {
            this.submethodparameters = null;
            this.currentSubOptionIndex = -1;
            return true;
        }
        return false;
    }

    public get MethodParameter_Name(): string {
        let name = "";
        if (this.submethodparameters != null) {
            name = this.submethodparameters[this.currentSubOptionIndex].language['az'].name;
        } else {
            name = this.MethodParameter.language['az'].name;
        }
        name = name.replace(/-/g, '_');
        return name;
    }

    public get MethodParameter_NameAz(): string {
        let name = "";
        if (this.submethodparameters != null) {
            name = this.submethodparameters[this.currentSubOptionIndex].language['az'].name;
        } else {
            name = this.MethodParameter.language['az'].name;
        }
        return name;
    }

    public get MethodParameter_NamePython(): string {
        if (this.submethodparameters != null) {
            return this.submethodparameters[this.currentSubOptionIndex]?.language?.python?.name;
        }
        let parameter = this.MethodParameter;
        return parameter.language['python'].name;
    }

    public get MethodParameter_MapsTo(): string {
        let parameter = this.MethodParameter;
        return this.GetMethodParameterMapName(parameter);
    }

    private GetMethodParameterMapName(parameter): string {
        /*if(parameter['originalParameter'] != null && parameter.language['python'].name != 'location' && parameter.language['python'].name != "tags") {
            return (parameter['originalParameter']).language['python'].name + "_" + parameter.language['python'].name;
        } else {*/
        let mapName: Array<any> = [];
        for (var name of values(parameter?.['targetProperty']?.['flattenedNames'])) {
            mapName.push(ToSnakeCase(name.toLocaleString()));
        }
        if (mapName.length <= 0) {
            return parameter.language['az'].name.replace(/-/g, '_');
        } else {
            return mapName.join('_');
        }
    }

    public get MethodParameter_Description(): string {
        return this.MethodParameter.language['az'].description.replace(/\n/g, " ");
    }

    public get MethodParameter_Type(): string {
        return this.MethodParameter.schema.type;
    }

    public get MethodParameter_IsListOfSimple(): boolean {
        // objects that is not base class of polymorphic and satisfy one of the four conditions
        // 1. objects with simple properties 
        // 2. or objects with arrays as properties but has simple element type 
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        // 5. or dicts with simple element properties
        // 6. or dicts with arrays as element properties but has simple element type 
        if (this.MethodParameter_Type == SchemaType.Any) {
            return false;
        }
        if (this.MethodParameter_IsFlattened) {
            return false;
        }
        if (this.MethodParameter.language['cli'].json == true) {
            return false;
        }
        if (this.MethodParameter_Type == SchemaType.Array) {
            if ((this.MethodParameter['schema'])['elementType'].type == SchemaType.Object || (this.MethodParameter['schema'])['elementType'].type == SchemaType.Dictionary) {
                for (let p of values(this.MethodParameter['schema']?.['elementType']?.properties)) {
                    if (p['schema'].type == SchemaType.Object || p['schema'].type == SchemaType.Dictionary) {
                        return false;
                    } else if (p['schema'].type == SchemaType.Array) {
                        for (let mp of values(p['schema']?.['elementType']?.properties)) {
                            if (mp['schema'].type == SchemaType.Object || mp['schema'].type == SchemaType.Array || mp['schema'].type == SchemaType.Dictionary) {
                                return false;
                            }
                        }
                        for (let parent of values(p['schema']?.['elementType']?.['parents']?.all)) {
                            for (let pp of values(parent['properties'])) {
                                if (pp['schema'].type == SchemaType.Object || pp['schema'].type == SchemaType.Array || pp['schema'].type == SchemaType.Dictionary) {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            }
        } else if (this.MethodParameter_Type == SchemaType.Object) {
            if (this.MethodParameter.schema['children'] != null && this.MethodParameter.schema['discriminator'] != null) {
                return false;
            }
            for (let p of values(this.MethodParameter['schema']['properties'])) {
                if (p['schema'].type == SchemaType.Object || p['schema'].type == SchemaType.Dictionary) {
                    // objects.objects
                    return false;
                } else if (p['schema'].type == SchemaType.Array) {
                    for (let mp of values(p['schema']?.['elementType']?.properties)) {
                        if (mp['schema'].type == SchemaType.Object || mp['schema'].type == SchemaType.Array || mp['schema'].type == SchemaType.Dictionary) {
                            return false;
                        }
                    }
                    for (let parent of values(p['schema']?.['elementType']?.['parents']?.all)) {
                        for (let pp of values(parent['properties'])) {
                            if (pp['schema'].type == SchemaType.Object || pp['schema'].type == SchemaType.Array || pp['schema'].type == SchemaType.Dictionary) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        } else if (this.MethodParameter_Type == SchemaType.Dictionary) {
            if (this.MethodParameter.schema['children'] != null && this.MethodParameter.schema['discriminator'] != null) {
                return false;
            }
            let p = this.MethodParameter['schema']['elementType'];
            if (p.type == SchemaType.Object || p.type == SchemaType.Dictionary) {
                // dicts.objects or dicts.dictionaries 
                return false;
            } else if (p.type == SchemaType.Array) {
                for (let mp of values(p.properties)) {
                    if (mp['schema'].type == SchemaType.Object || mp['schema'].type == SchemaType.Array || mp['schema'].type == SchemaType.Dictionary) {
                        return false;
                    }
                }
                for (let parent of values(p['schema']?.['elementType']?.['parents']?.all)) {
                    for (let pp of values(parent['properties'])) {
                        if (pp['schema'].type == SchemaType.Object || pp['schema'].type == SchemaType.Array || pp['schema'].type == SchemaType.Dictionary) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }

    public get MethodParameter_IsSimpleArray(): boolean {
        if (this.MethodParameter_Type == SchemaType.Array) {
            let elementType = this.MethodParameter['schema']['elementType'].type;
            if (elementType != SchemaType.Object && elementType != SchemaType.Array && elementType != SchemaType.Dictionary) {
                return true;
            }
        }
        return false;
    }

    public get MethodParameter_IsList(): boolean {
        if (this.MethodParameter_IsFlattened) {
            return false;
        }
        if (this.MethodParameter_Type == SchemaType.Any || this.MethodParameter_Type == SchemaType.Array || this.MethodParameter_Type == SchemaType.Object || this.MethodParameter_Type == SchemaType.Dictionary) {
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
        let operation = this.MethodParameter;
        if (operation.language['cli'].removed || operation.language['cli'].hidden) {
            return true;
        }
        let parameter = this.MethodParameter;
        if (parameter.language['cli'].removed || parameter.language['cli'].hidden) {
            return true;
        } else {
            return this.MethodParameter['hidden'] ? true : false;
        }

    }

    public get MethodParameter_IsRequired(): boolean {
        return this.MethodParameter.required;
    }

    public get MethodParameter_IsFlattened(): boolean {
        return this.MethodParameter['flattened'] ? true : false;
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
        return ToSnakeCase(this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].name);
    }

    public GetModuleOperationNamePython(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['python'].name;
    }

    public GetModuleOperationNamePythonUpper(): string {
        return pascalCase(this.codeModel.operationGroups[this.currentOperationGroupIndex].language['python'].name);
    }

    public GetPythonNamespace(): string {
        return this.options['namespace'];
    }

    public get PythonMgmtClient(): string {
        return this.codeModel.info['pascal_case_title'];
    }

    public get PythonOperationsName(): string {
        return this.options['namespace'].split('.').pop();
        //return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['python'].name;
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

    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersDict(): Map<string, MethodParam> {
        let method_param_dict: Map<string, MethodParam> = new Map<string, MethodParam>();

        if (this.SelectFirstMethodParameter()) {
            do {
                if (this.MethodParameter.implementation == 'Method' && !this.MethodParameter_IsFlattened && this.MethodParameter?.schema?.type != 'constant') {
                    let submethodparameters = null;
                    if (this.EnterSubMethodParameters()) {
                        submethodparameters = this.submethodparameters;
                        this.ExitSubMethodParameters();
                    }
                    method_param_dict.set(this.MethodParameter.language['cli'].cliKey, new MethodParam(this.MethodParameter, this.MethodParameter_IsList, this.MethodParameter_IsListOfSimple, submethodparameters));
                }
            } while (this.SelectNextMethodParameter());
        }
        return method_param_dict;
    }

    public GetExampleParameters(example_obj): ExampleParam[] {
        let parameters: ExampleParam[] = [];
        let method_param_dict: Map<string, MethodParam> = this.GetMethodParametersDict();
        Object.entries(example_obj.parameters).forEach(([param_name, param_value]) => {
            this.FlattenExampleParameter(method_param_dict, parameters, param_name, param_value, []);
        })
        return parameters;
    }

    private AddExampleParameter(methodParam: MethodParam, example_param: ExampleParam[], value: any) {
        let isList: boolean = methodParam.isList;
        let isSimpleList: boolean = methodParam.isSimpleList;
        let defaultName: string = methodParam.value.language['cli'].cliKey;
        let name: string = this.GetMethodParameterMapName(methodParam.value);
        if (isList) {
            if (isSimpleList) {
                if (value instanceof Array) {       // spread list
                    for (let e of value) {
                        this.AddExampleParameter(methodParam, example_param, e);
                    }
                }
                else if (typeof value == 'object') {    // KEY=VALUE form
                    let ret = "";
                    for (let k in value) {
                        let cliName = null;
                        if (methodParam.submethodparameters) {
                            for (let submethodProperty of methodParam.submethodparameters) {
                                if (submethodProperty.language['cli'].cliKey.toLowerCase() == k.toLowerCase()) {
                                    cliName = submethodProperty.language['az'].name;
                                    break;
                                }
                            }
                        }
                        if (!cliName) {
                            // If no submethodparameters, keep all KEYs as the origin name
                            // This is for type of schema.Dictionary
                            cliName = k;
                        }
                        if (ret.length > 0) {
                            ret += " ";
                        }
                        let v = this.ToJsonString(value[k]);
                        if (v.startsWith("\"")) {
                            v = v.substr(1, v.length-2);
                        }
                        ret += `${cliName}=${v}`;
                    }
                    if (ret.length > 0) {
                        example_param.push(new ExampleParam(name, ret, false, true, defaultName));
                    }
                }
            }
            else if (isList && !isSimpleList) {
                example_param.push(new ExampleParam(name, JSON.stringify(value).split(/[\r\n]+/).join(""), true, false, defaultName));
            }
        }
        else if (typeof value != 'object') {     // ignore object values if not isList.
            example_param.push(new ExampleParam(name, value, false, false, defaultName));
        }
    }

    public FlattenExampleParameter(method_param: Map<string, MethodParam>, example_param: ExampleParam[], name: string, value: any, ancestors: string[]) {
        if (typeof method_param.get(name) !== 'undefined') {
            let methodParam = method_param.get(name);
            if ('pathToProperty' in methodParam.value && ancestors.length - methodParam.value['pathToProperty'].length == 1) {
                // if the method parameter has 'pathToProperty', check the path with example parameter full path.
                let ancestors_ = deepCopy(ancestors) as string[];
                let match = true;
                for (let i = methodParam.value['pathToProperty'].length - 1; i >= 0; i--) {
                    let parent = ancestors_.pop();
                    if (methodParam.value['pathToProperty'][i].language.az.name != parent) {
                        match = false;
                    };
                }
                if (match) {
                    // example_param.set(name, value);
                    this.AddExampleParameter(methodParam, example_param, value);
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
                    if (methodParam.value['targetProperty']['flattenedNames'][i] != parent) {
                        match = false;
                    };
                }
                if (match) {
                    // example_param.set(name, value);
                    this.AddExampleParameter(methodParam, example_param, value);
                    return;
                }
            }
            else if (ancestors.length == 0) {
                // example_param.set(name, value);
                this.AddExampleParameter(methodParam, example_param, value);
                return;
            }
        }

        if (typeof value === 'object' && value !== null) {
            for (let sub_name in value) {
                this.FlattenExampleParameter(method_param, example_param, sub_name, value[sub_name], ancestors.concat(name));
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
            ret.push(new ExampleParam("--" + param_name, param.value, param.isJson, param.isKeyValues, param.defaultName));
        };
        return ret;
    }


    public GetExamples(): CommandExample[] {
        let examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, example_obj]) => {
                let example = new CommandExample();
                example.Method = this.Command_MethodName;
                example.Id = `${this.CommandGroup_Key}/${this.MethodParameter_NameAz}/${id}`;
                example.Title = example_obj.title || id;
                example.Path = this.Method_Path;
                example.HttpMethod = this.Method_HttpMethod;
                example.ResourceClassName = this.CommandGroup_Key;
                let params: ExampleParam[] = this.GetExampleParameters(example_obj);
                example.Parameters = this.ConvertToCliParameters(params);
                examples.push(example);
            });
        }
        return examples;
    }

    public GetExampleItems(example: CommandExample, isTest: boolean): string[] {
        let parameters: string[] = [];
        parameters.push("az " + this.CommandGroup_Name.split("_").join("-") + " " + example.Method)

        for (let param of example.Parameters) {
            let param_value = param.value;
            if (isTest) {
                let replaced_value = this.resource_pool.addEndpointResource(param_value, param.isJson, param.isKeyValues, [], []);
                if (replaced_value == param_value) {
                    replaced_value = this.resource_pool.addParamResource(param.defaultName, param_value, param.isJson, param.isKeyValues);
                }
                param_value = replaced_value;
            }
            let slp = param_value; 
            if (!param.isKeyValues) {
                slp = this.ToJsonString(slp); 
            }
            parameters.push(param.name + " " + slp);
        }

        return parameters;
    }

    private ToJsonString(str: string): string {
        return JSON.stringify(str).split(/[\r\n]+/).join("").split("\\").join("\\\\").split("'").join("\\'")
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

    public FindExampleById(id: string): string[][] {
        let ret: string[][] = [];
        this.GetAllExamples(id, (example) => {
            ret.push(this.GetExampleItems(example, true));
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
                    this.resource_pool.addEndpointResource(param.value, param.isJson, param.isKeyValues, [], resources);
                    for (let on_resource of resources) {
                        if (on_resource != this.CommandGroup_Key && depend_resources.indexOf(on_resource) < 0) {
                            depend_resources.push(on_resource);
                            depend_parameters.push(param.name);
                        }
                    }
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

        this.SortExamplesByDependency();
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
        let compare = (config_a: object, config_b: object): number => {
            let examples_a: CommandExample[] = this.GetAllExamples(config_a['name']);
            let examples_b: CommandExample[] = this.GetAllExamples(config_b['name']);
            if (examples_a.length <= 0 || examples_b.length <= 0) {
                return 0; // if any example can't be found, keep the original order
            }

            if (examples_a[0].ResourceClassName == examples_b[0].ResourceClassName) {
                if (isCreate(examples_b[0]) && !isCreate(examples_a[0])) {
                    return 1;
                }
                else if (isDelete(examples_b[0]) && !isDelete(examples_a[0])) {
                    return -1;
                }
                else if (isCreate(examples_a[0]) && !isCreate(examples_b[0])) {
                    return -1;
                }
                else if (isDelete(examples_a[0]) && !isDelete(examples_b[0])) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (depend_on(examples_a[0], examples_b[0])) {
                if (isCreate(examples_b[0])) {
                    return 1;
                }
                else if (isDelete(examples_b[0])) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else if (depend_on(examples_b[0], examples_a[0])) {
                if (isCreate(examples_a[0])) {
                    return -1;
                }
                else if (isDelete(examples_a[0])) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            return 0;
        };

        let i = 0;
        let swapped = new Set<string>();    //for loop detecting
        while (i < this._testScenario.length) {
            for (let j = i + 1; j < this._testScenario.length; j++) {
                let swapId = `${i}<->${j}`;
                if (swapped.has(swapId)) continue; // has loop, ignore the compare.
                if (compare(this._testScenario[i], this._testScenario[j]) > 0) {
                    let tmp = this._testScenario[i];
                    this._testScenario[i] = this._testScenario[j];
                    this._testScenario[j] = tmp;
                    swapped.add(swapId);
                    i--;
                    break;
                }
            }
            i++;
        }
        //this._testScenario = MergeSort(this._testScenario,compare);
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

    public GetAllExamples(id?: string, callback?: (example) => void): CommandExample[] {
        let ret: CommandExample[] = [];
        this.GetAllMethods(null, () => {
            for (let example of this.GetExamples()) {
                if (id && (example.Id.toLowerCase() != id.toLowerCase() && !example.Id.toLowerCase().endsWith(`/${id.toLowerCase()}`))) continue;
                if (callback) {
                    callback(example);
                }
                if(ret.indexOf(example) > -1) {
                    continue;
                }
                ret.push(example);
            }
        });
        return ret;
    }
}
