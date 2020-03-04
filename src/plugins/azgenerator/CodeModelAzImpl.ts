/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz, CommandExample, ExampleParam} from "./CodeModelAz";
import { CodeModel, SchemaType, Schema, ParameterLocation, Operation, Value, Parameter, VirtualParameter, Property, Example } from '@azure-tools/codemodel';
import { serialize, deserialize } from "@azure-tools/codegen";
import { Session, startSession, Host, Channel } from "@azure-tools/autorest-extension-base";
import { ToSnakeCase, MergeSort, deepCopy } from '../../utils/helper';
import { values } from "@azure-tools/linq";
import { GenerateDefaultTestScenario, ResourcePool, getResourceKey, PreparerEntity} from './ScenarioTool'
import { timingSafeEqual } from "crypto";

class SubGroup
{
    public constructor(name: string, methodIdx: number, parameterIdx: number)
    {
        this.name = name;
        this.methodIdx = methodIdx;
        this.parameterIdx = parameterIdx;
    }
    public name: string;
    public methodIdx: number;
    public parameterIdx: number;
    public getMethodIdx: number;
}


export class CodeModelCliImpl implements CodeModelAz
{
    codeModel: CodeModel;
    options: any;
    extensionName: string;
    currentOperationGroupIndex: number;
    currentOperationSubGroupIndex: number;
    subgroups: SubGroup[];
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
        this.currentOperationSubGroupIndex = -1;
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

    public constructor(protected session: Session<CodeModel>) 
    {
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
        if(order == -1) {
            order = opOrder.length;
        }
        return order.toLocaleString();
    }

    private sortOperationByAzCommand() {
        for(let [idx, operationGroup] of this.codeModel.operationGroups.entries()) {
            operationGroup.operations.sort((a, b) => {
                let oa = this.getOrder(a.language['az']['name']) + "_" + (100 - a.request.parameters.length);
                let ob = this.getOrder(b.language['az']['name']) + "_" + (100 - b.request.parameters.length);
                return oa.localeCompare(ob);
            });
            this.codeModel.operationGroups[idx] = operationGroup;
        }

    }

    private calcOptionRequiredByMethod() {
        if(this.SelectFirstCommandGroup()) {
            do {
                if(this.SelectFirstCommand()) {
                    do {
                        var paramTime = 0;
                        if(this.SelectFirstMethod()) {
                            let paramRequired: Map<string, number> = new Map<string, number>();
                            paramTime++;
                            if(this.SelectFirstMethodParameter()) {
                                do {
                                    paramRequired.set(this.MethodParameter_Name, this.MethodParameter_IsRequired? 1: 0);
                                } while(this.SelectNextMethodParameter());
                            }
                            while(this.SelectNextMethod()) {
                                paramTime++;
                                if(this.SelectFirstMethodParameter()) {
                                    do {
                                        if(!paramRequired.has(this.MethodParameter_Name)) {
                                            paramRequired.set(this.MethodParameter_Name, this.MethodParameter_IsRequired? 1: 0);
                                        } else if(this.MethodParameter_IsRequired){
                                            paramRequired.set(this.MethodParameter_Name, paramRequired.get(this.MethodParameter_Name) + 1);
                                        }
                                    } while(this.SelectNextMethodParameter());
                                }                                
                            }
                            if(this.SelectFirstMethod()) {
                                if(this.SelectFirstMethodParameter()) {
                                    do {
                                        let parameters = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
                                        if(parameters.language['cli'].required) {
                                            this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex]['RequiredByMethod'] = true;
                                        } else {
                                            this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex]['RequiredByMethod'] = paramRequired.get(this.MethodParameter_Name) == paramTime? true: false;
                                        }
                                    } while(this.SelectNextMethodParameter());
                                }
                                while(this.SelectNextMethod()) {
                                    if(this.SelectFirstMethodParameter()) {
                                        do {
                                            let parameters = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
                                            if(parameters.language['cli'].required) {
                                                this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex]['RequiredByMethod'] = true;
                                            } else {
                                                this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex]['RequiredByMethod'] = paramRequired.get(this.MethodParameter_Name) == paramTime? true: false;
                                            }
                                        } while(this.SelectNextMethodParameter());
                                    }                                
                                }
                            }
                        }

                    } while(this.SelectNextCommand());
                }
            } while (this.SelectNextCommandGroup());
        }
        //this.session.message({Channel:Channel.Warning, Text:serialize(this.codeModel)});
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

    public SelectFirstExtension(): boolean
    {
        // support only one initially
        return true;
    }

    public SelectNextExtension(): boolean
    {
        return false;
    }

    public get Extension_Name()
    { 
        return this.extensionName;
    }

    public get Extension_NameUnderscored()
    {
        return this.extensionName.replace(/-/g, '_');
    }

    public get Extension_NameClass(): string
    {
        return this.codeModel.info['pascal_case_title']
    }

    public get Extension_TestScenario(): any
    {
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

    public SelectFirstCommandGroup(): boolean
    {
        // just enumerate through command groups in code-model-v4
        if(this.codeModel.operationGroups.length > 0) {
            this.currentOperationGroupIndex = 0;
            if(this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].hidden || this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].removed) {
                if(this.SelectNextCommandGroup()) {
                    if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
                    return true;
                } else {
                    return false;
                }
            }
            if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
            // create a list of subgroups for current group
            this.CreateVirtualSubGroups();

            this.SelectFirstCommand();
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    public SelectNextCommandGroup(): boolean
    {
        // if enumerating virtual sub-groups, try to select next sub-group
        if (this.SelectNextSubGroup())
            return true;

        // try to select first sub-group if exists
        if (this.SelectFirstSubGroup())
            return true;

        if(this.currentOperationGroupIndex < this.codeModel.operationGroups.length - 1) {
            this.currentOperationGroupIndex++;

            if(this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].hidden || this.codeModel.operationGroups[this.currentOperationGroupIndex].language['cli'].removed) {
                if(this.SelectNextCommandGroup()) {
                    if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
                    return true;
                } else {
                    return false;
                }
            }
<<<<<<< HEAD
            if (!this.SelectFirstCommand()) return this.SelectNextCommandGroup();
=======

            // create a list of subgroups for current group
            this.CreateVirtualSubGroups();

            this.SelectFirstCommand();
>>>>>>> updates
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    private CreateVirtualSubGroups(): void
    {
        // iterate through methods and parameters to find all the parameters that are list of complex
        // and create list of subgroups
        this.subgroups = [];
        let methodGetIndex: number = -1;

        if (this.SelectFirstCommand()) {
            do {
                if (this.SelectFirstMethod()) {
                    do {
                        if (this.Command_MethodName == "get") {
                            methodGetIndex = this.currentMethodIndex;
                        }
                    
                        //if (this.Command_MethodName == "create_or_update") {
                            if (this.SelectFirstMethodParameter()) {
                                do {
                                    if (this.MethodParameter_IsListOfComplex) {
                                        this.subgroups.push(new SubGroup(this.MethodParameter_Name, this.currentMethodIndex, this.currentParameterIndex));
                                    }
                                } while (this.SelectNextMethodParameter());
                            }
                        //}
                    } while (this.SelectNextMethod());
                }

            } while (this.SelectNextCommand());
        }

        // make sure any subgroups were created and we have get method
        if (this.subgroups.length == 0 /*|| methodGetIndex < 0*/) {
            this.subgroups = null;
        } else {
            // store get method index for each subgroup
            this.subgroups.forEach(element => {
                element.getMethodIdx = methodGetIndex;       
            });
        }

        this.SelectFirstCommand();
    }

    private SelectFirstSubGroup(): boolean
    {
        if (this.subgroups != null)
        {
            this.currentOperationSubGroupIndex = 0;
            return true;
        }

        return false;
    }

    private SelectNextSubGroup(): boolean
    {
        if (this.currentOperationSubGroupIndex < 0)
            return false;

        if ( this.subgroups == null)
            return false;

        if (this.currentOperationSubGroupIndex + 1 < this.subgroups.length)
        {
            this.currentOperationSubGroupIndex++;
            return true;
        }

        // clear list of subgroups
        this.currentOperationSubGroupIndex = -1;
        this.subgroups = null;

        return false;
    }

    public get CommandGroup_Name(): string
    {
        if (this.currentOperationSubGroupIndex < 0)
        {
            return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].command;
        }
        else
        {
            return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].command + " " + this.subgroups[this.currentOperationSubGroupIndex].name;
        }
    }

    public get CommandGroup_Help(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].command;
    }

    public get CommandGroup_Key(): string {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].$key || this.CommandGroup_Name;
    }
    
    public get CommandGroup_IsVirtual(): boolean
    {
        return (this.currentOperationSubGroupIndex >= 0);
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

    public SelectFirstCommand(): boolean
    {
        if (this.CommandGroup_IsVirtual)
            return true;

        // just enumerate through commands in command group
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length > 0) {
            this.currentOperationIndex = 0;
            let operation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex];
            this.preMethodIndex = this.currentOperationIndex;
            let needNext = false; 
            if(operation.language['cli'].hidden || operation.language['cli'].removed) {
                needNext = true;
            }
            while(this.currentOperationIndex + 1 < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                let tmpOperation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1];
                if(tmpOperation.language['az'].command == operation.language['az'].command) {
                    this.currentOperationIndex++;
                    if(tmpOperation.language['cli'].hidden != true && tmpOperation.language['cli'].removed != true) {
                        needNext = false;
                    }
                } else {
                    break;
                }
            }
            if(needNext && !this.SelectNextCommand()) {
                return false;
            }
            this.SelectFirstOption();
            this.SelectFirstMethod();
            this.SelectFirstMethodParameter();
            return true;
        } else {
            this.currentOperationIndex = -1;
            return false;
        }
    }

    public SelectNextCommand(): boolean
    {
        if (this.CommandGroup_IsVirtual)
            return false;

        if(this.currentOperationIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length - 1) {
            this.currentOperationIndex++;
            this.preMethodIndex = this.currentOperationIndex;
            let operation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex];
            let needNext = false; 
            if(operation.language['cli'].hidden || operation.language['cli'].removed) {
                needNext = true;
            }
            while(this.currentOperationIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                let tmpOperation =  this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex - 1];
                if(operation.language['az'].command == tmpOperation.language['az'].command) {
                    this.currentOperationIndex++;
                    if(tmpOperation.language['cli'].hidden != true && tmpOperation.language['cli'].removed != true) {
                        needNext = false;
                    }
                } else {
                    break;
                }
            }
            if(needNext && !this.SelectNextCommand()) {
                return false;
            }
            this.SelectFirstOption();
            this.SelectFirstMethod();
            this.SelectFirstMethodParameter();
            return true;
        } else {
            this.currentOperationIndex = -1;
            return false;
        }
    }

    public get Command_FunctionName()
    {
        return this.Command_Name.replace(/( |-)/g, "_");
    }

    public get Command_Name(): string
    {
        if (this.CommandGroup_IsVirtual)
        {
            return this.CommandGroup_Name + " add";
        }
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command;
    }

    public get Command_MethodName(): string
    {
        if (this.CommandGroup_IsVirtual)
        {
            return this.CommandGroup_Name + " add";
        }

        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].name;
    }

    public get Command_Help(): string
    {
        if (this.CommandGroup_IsVirtual)
        {
            return "Add subitem";
        }

        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].description.replace(/\n/g, " ");
    }

    public get Command_CanSplit(): boolean 
    {
        if (this.CommandGroup_IsVirtual)
            return false;

        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex]['canSplitOperation']? true: false;
    }

    public get Command_IsLongRun(): boolean
    {
        // no support yet for virtual commands
        if (this.CommandGroup_IsVirtual)
            return false;

        if (this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions) {
            return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-long-running-operation']? true: false;
        } else {
            return false;
        }
    }

    public SelectFirstOption(): boolean
    {
        if (this.CommandGroup_IsVirtual)
        {
            return false;
        }

        if (this.suboptions != null)
        {
            this.currentSubOptionIndex = 0;
            let option = this.suboptions[this.currentSubOptionIndex];
            if (option.language['cli'].hidden || option.language['cli'].removed) {
                if(!this.SelectNextOption()) {
                    return false;
                }
            }
            return true;
        }

        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length > 0) {
            this.currentParameterIndex = 0;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]
            const currentParameterName = parameter.language['az'].name;
            if(this.Option_IsHidden || currentParameterName == "subscription_id" || currentParameterName == "api_version" || currentParameterName == "$host") {
                if(this.SelectNextOption()) {
                    return true;
                } else {
                    if(this.currentOperationIndex + 1 < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1].language['az'].command) {
                            this.currentOperationIndex++;
                            if(this.SelectFirstOption()) {
                                for(var previousParam of this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex - 1].request.parameters) {
                                    if(previousParam == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]) {
                                        return this.SelectNextOption();
                                    }
                                }
                            }
                        }
                    }
                    this.currentParameterIndex = -1;
                    return false;
                };
            }
            return true;
        } else {
            if(this.currentOperationIndex + 1 < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1].language['az'].command) {
                    this.currentOperationIndex++;
                    if(this.SelectFirstOption()) {
                        for(var previousParam of this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex - 1].request.parameters) {
                            if(previousParam == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]) {
                                return this.SelectNextOption();
                            }
                        }
                    }
                }
            }
            this.currentParameterIndex = -1;
            return false;
        }
    }

    public SelectNextOption(): boolean
    {
        if (this.suboptions != null)
        {
            this.currentSubOptionIndex++;

            if (this.currentSubOptionIndex >= this.suboptions.length)
            {
                return false;
            }
            let option = this.suboptions[this.currentSubOptionIndex];
            if (option.language['cli'].hidden || option.language['cli'].removed) {
                if(!this.SelectNextOption()) {
                    return false;
                }
            }
            return true;
        }

        if(this.currentParameterIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length - 1) {
            this.currentParameterIndex++;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex];
            const currentParameterName = parameter.language['az'].name;
            if(this.Option_IsHidden || currentParameterName == "subscription_id" || currentParameterName == "api_version" || currentParameterName == "$host") {
                if(this.SelectNextOption()) {
                    return true;
                } else {
                    //If 
                    if(this.currentOperationIndex + 1 < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1].language['az'].command) {
                            this.currentOperationIndex++;
                            if(this.SelectFirstOption()) {
                                for(var previousParam of this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex - 1].request.parameters) {
                                    if(previousParam == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]) {
                                        return this.SelectNextOption();
                                    }
                                }
                            }
                        }
                    }
                    this.currentParameterIndex = -1;
                    return false;
                };
            }
            return true;
        } else {
            if(this.currentOperationIndex + 1 < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex + 1].language['az'].command) {
                    this.currentOperationIndex++;
                    if(this.SelectFirstOption()) {
                        for(var previousParam of this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex - 1].request.parameters) {
                            if(previousParam == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]) {
                                return this.SelectNextOption();
                            }
                        }
                    }
                }
            }
            this.currentParameterIndex = -1;
            return false;
        }
        
    }

    public get Option_Name(): string
    {
        if (this.suboptions != null)
        {
            return this.suboptions[this.currentSubOptionIndex].language.python.name;
        }

        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].name;
    }

    public get Option_NameUnderscored(): string
    {
        return this.Option_Name.replace(/-/g, "_");
    }

    public get Option_NamePython(): string
    {
        if (this.suboptions != null)
        {
            return this.suboptions[this.currentSubOptionIndex].language.python.name;
        }

        let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex];
        if(parameter['pathToProperty']?.length == 1) {
            return (parameter['pathToProperty'][0]).language['python'].name + "_" + parameter.language['python'].name;
        } else {
            return parameter.language['python'].name;
        }
        
    }

    public get Option_IsRequired(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].required;
    }

    public get Option_Description(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].description.replace(/\n/g, " ");
    }

    public get Option_In(): string
    {
        let protocol = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].protocol;
        return protocol != undefined && protocol.http != undefined && protocol.http.in != undefined ? protocol.http.in: ParameterLocation.Body;
    }

    public get Option_IsHidden(): boolean
    {
        let operation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex];
        if(operation.language['cli'].hidden || operation.language['cli'].removed) {
            return true;
        }
        let parameter = operation.request.parameters[this.currentParameterIndex];
        if (parameter.language['cli'].hidden || parameter.language['cli'].removed) {
            return true;
        } else {
            return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].hidden ? true : false;
        }  
    }

    public get Option_IsFlattened(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]['flattened']? true: false;   
    }

    public get Option_PathSdk(): string
    {
        return "/something/my_option";
    }

    public get Option_PathSwagger(): string
    {
        return "/something/myOption";
    }

    public get Option_Type(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema.type;
    }

    public get Option_EnumValues(): string[]
    {
        let mtype = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema.type;
        if(mtype == SchemaType.Choice || mtype == SchemaType.SealedChoice) {
            var enumArray = [];
            let schema = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema;
            for(var item of schema['choices']) {
                enumArray.push(item['value']);
            }
            return enumArray;
        } else {
            return [];
        }
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

    public SelectFirstMethod(): boolean
    {
        if(this.currentOperationIndex >= this.preMethodIndex) {
            this.currentMethodIndex = this.preMethodIndex;
            let method = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex];
            if(method.language['cli'].removed || method.language['cli'].hidden) {
                if(!this.SelectNextMethod()) {
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

    public SelectNextMethod(): boolean
    {
        if(this.currentMethodIndex < this.currentOperationIndex) {
            this.currentMethodIndex++;
            let method = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex];
            if(method.language['cli'].removed || method.language['cli'].hidden) {
                if(!this.SelectNextMethod()) {
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

    public SelectMethodByName(name: string): boolean
    {
        for (let i: number = 0; i < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length; i++) {
            this.currentMethodIndex = i;
            if (this.Method_Name == name)
                return true;
        }

        return false;
    }

    public get Method_IsFirst(): boolean
    {
        if(this.currentMethodIndex == this.preMethodIndex) {
            return true;
        } else {
            return false;
        }
        
    }

    public get Method_IsLast(): boolean
    {
        if(this.currentMethodIndex == this.currentOperationIndex) {
            return true;
        } else {
            return false;
        }
    }

    public get Method_IsLongRun(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].extensions['x-ms-long-running-operation']? true: false;
    }
    public get Method_Name(): string
    {
       return  this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].language['python'].name;
    }

    public get Method_BodyParameterName(): string
    {
        return null;
    }

    public get Method_Path(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.protocol?.http?.path;
    }

    public Get_Method_Name(language="az"): string
    {
       return  this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].language[language].name;
    }

    //=================================================================================================================
    // Methods Parameters.
    //
    // This interface is designed to enumerate all parameters of the selected method and their mapping to Python SDK.
    //=================================================================================================================
    public SelectFirstMethodParameter(): boolean
    {
        if (this.submethodparameters != null)
        {
            this.currentSubOptionIndex = 0;
            let parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (parameter.language['cli'].hidden || parameter.language['cli'].removed) {
                if(!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters.length > 0) {
            this.currentParameterIndex = 0;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
            const currentParameterName = parameter.language['python'].name;
            if(this.MethodParameter_IsHidden || currentParameterName == "subscription_id" || currentParameterName == "api_version" || currentParameterName == "host") {
                if(this.SelectNextMethodParameter()) {
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

    public SelectNextMethodParameter(): boolean
    {
        if (this.submethodparameters != null)
        {
            this.currentSubOptionIndex++;

            if (this.currentSubOptionIndex >= this.submethodparameters.length)
            {
                return false;
            }
            let parameter = this.submethodparameters[this.currentSubOptionIndex];
            if (parameter.language['cli'].hidden || parameter.language['cli'].removed) {
                if(!this.SelectNextMethodParameter()) {
                    return false;
                }
            }
            return true;
        }
        if(this.currentParameterIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters.length - 1) {
            this.currentParameterIndex++;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
            const currentParameterName = parameter.language['python'].name;
            if(this.MethodParameter_IsHidden || currentParameterName == "subscription_id" || currentParameterName == "api_version" || currentParameterName == "host") {
                if(this.SelectNextMethodParameter()) {
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

    public EnterSubMethodParameters(): boolean
    {
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
        if(this.MethodParameter_Type == SchemaType.Array) {
            if((this.MethodParameter['schema'])['elementType'].type == SchemaType.Object) {
                this.submethodparameters = this.MethodParameter['schema']?.['elementType']?.properties;
            }
        } if(this.MethodParameter_Type == SchemaType.Object) {
            this.submethodparameters = this.MethodParameter['schema']['properties'];
        }
        if(this.submethodparameters == null) {
            return false;
        }
        return true;
    }

    public ExitSubMethodParameters(): boolean
    {
        if (this.submethodparameters != null)
        {
            this.submethodparameters = null;
            this.currentSubOptionIndex = -1;
            return true;
        }
        return false;
    }

    public get MethodParameter_Name(): string
    {
        if (this.submethodparameters != null)
        {
            return this.submethodparameters[this.currentSubOptionIndex].language.python.name;
        }
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].language['python'].name;
    }

    public get MethodParameter_NamePython(): string
    {
        if (this.submethodparameters != null)
        {
            return this.submethodparameters[this.currentSubOptionIndex].language.python.name;
        }
        let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
        return parameter.language['python'].name;
    }

    public get MethodParameter_MapsTo(): string
    {
        let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
        return this.GetMethodParameterMapName(parameter);
    }

    private GetMethodParameterMapName(parameter): string {
        /*if(parameter['originalParameter'] != null && parameter.language['python'].name != 'location' && parameter.language['python'].name != "tags") {
            return (parameter['originalParameter']).language['python'].name + "_" + parameter.language['python'].name;
        } else {*/
        let mapName: Array<any> = [];
        for(var name of values(parameter['flattenedNames'])) {
            mapName.push(ToSnakeCase(name.toLocaleString()));
        }
        if(mapName.length <= 0) {
            return parameter.language.python.name;
        } else {
            return mapName.join('_');
        }
    }

    public get MethodParameter_Description(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].language['az'].description.replace(/\n/g, " ");
    }

    public get MethodParameter_Type(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].schema.type;
    }

    public get MethodParameter_IsListOfSimple(): boolean
    {
        // objects that is not base class of polymorphic and satisfy one of the four conditions
        // 1. objects with simple properties 
        // 2. or objects with arrays as properties but has simple element type 
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        if(this.MethodParameter_IsFlattened) {
            return false;
        }
        if (this.MethodParameter_Type == SchemaType.Array) {
            if ((this.MethodParameter['schema'])['elementType'].type == SchemaType.Object) {
                for (let p of values(this.MethodParameter['schema']?.['elementType']?.properties)) {
                    if (p['schema'].type == SchemaType.Object) {
                        return false;
                    } else if(p['schema'].type == SchemaType.Array) {
                        for(let mp of values(p['schema']?.['elementType']?.properties)) {
                            if(mp['schema'].type == SchemaType.Object || mp['schema'].type == SchemaType.Array) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        } if (this.MethodParameter_Type == SchemaType.Object) {
            if (this.MethodParameter.schema.children != null && this.MethodParameter.schema.discriminator != null) {
                return false;
            }
            for(let p of values(this.MethodParameter['schema']['properties'])) {
                if(p['schema'].type == SchemaType.Object) {
                    // objects.objects
                    return false;
                } else if(p['schema'].type == SchemaType.Array) {
                    for(let mp of values(p['schema']?.['elementType']?.properties)) {
                        if(mp['schema'].type == SchemaType.Object || mp['schema'].type == SchemaType.Array) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        return false; 
    }

    public get MethodParameter_IsList(): boolean
    {
        if(this.MethodParameter_IsFlattened) {
            return false;
        }
        if (this.MethodParameter_Type == SchemaType.Array || this.MethodParameter_Type == SchemaType.Object) {
            return true;
        }
        return false;
    }

    

    public get MethodParameter(): any {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
    }

    public get MethodParameter_EnumValues(): string[]
    {
        let mtype = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].schema.type;
        if(mtype == SchemaType.Choice || mtype == SchemaType.SealedChoice) {
            var enumArray = [];
            let schema = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].schema;
            for(var item of schema['choices']) {
                enumArray.push(item['value']);
            }
            return enumArray;
        } else {
            return [];
        }
    }

    public get MethodParameter_In(): string
    {
        let protocol = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].protocol;
        return protocol != undefined && protocol.http != undefined && protocol.http.in != undefined? protocol.http.in: ParameterLocation.Body;
    }

    public get MethodParameter_IsHidden(): boolean
    {
        let operation = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex];
        if(operation.language['cli'].removed || operation.language['cli'].hidden) {
            return true;
        }
        let parameter = operation.request.parameters[this.currentParameterIndex];
        if(parameter.language['cli'].removed || parameter.language['cli'].hidden) {
            return true;
        } else {
            return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].hidden? true: false;
        }
        
    }

    public get MethodParameter_IsRequired(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].required;
    }

    public get MethodParameter_IsFlattened(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex]['flattened']? true: false;
    }

    public get MethodParameter_RequiredByMethod(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex]['RequiredByMethod'];
    }

    //=================================================================================================================
    // Top Level Python Related Information
    //
    // Most of the information included here should be either produced by Python namer, or come from readme.az.md file.
    // Detailed descriptions below.
    //=================================================================================================================

    public GetModuleOperationName(): string
    {
        return ToSnakeCase(this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].name);
    }

    public GetModuleOperationNameUpper(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].name;
    }

    public GetPythonNamespace(): string
    {
        return this.options['namespace'];
    }

    public get PythonMgmtClient(): string
    {
        return this.codeModel.info['pascal_case_title'];
    }

    public get PythonOperationsName(): string
    {
        return this.options['namespace'].split('.').pop();
        //return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['python'].name;
    }

    //=================================================================================================================
    // Example / Test Scenario related interface.
    //
    // This interface enumerates examples related to currently selected command.
    // It should be implemented when example processor implementation is in place.
    //=================================================================================================================

    public SelectFirstExample(): boolean
    {
        if (this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions == undefined)
            return false;

        let example = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-examples'];
        if(example && example.length > 0) {
            this.currentExampleIndex = 0;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }
        
    }

    public SelectNextExample(): boolean
    {
        let example = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-examples'];
        if(example && this.currentExampleIndex < example.length - 1) {
            this.currentExampleIndex++;
            return true;
        } else {
            this.currentExampleIndex = -1;
            return false;
        }
    }

    public get Example_Title(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-examples'][this.currentExampleIndex].value().title;
    }

    public get Example_Body(): string[]
    {
        // TBD
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-examples'][this.currentExampleIndex].key();
    }

    public get Example_Params(): any
    {
        // TBD
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-examples'][this.currentExampleIndex].value().parameters;
    }

    public get Examples(): object {
        let extensions = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].extensions;
        return (extensions && 'x-ms-examples' in extensions? extensions['x-ms-examples']: {})
    }

    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersDict(): Map<string, Value> {
        let method_param_dict: Map<string, Value> = new Map<string, Value>();
        if (this.SelectFirstMethodParameter()) {
            do {
                if (this.MethodParameter.implementation == 'Method' && !this.MethodParameter_IsFlattened && this.MethodParameter?.schema?.type != 'constant') {
                    
                    method_param_dict.set(this.MethodParameter.language.default.name, this.MethodParameter);
                    // this.AddFlattenedParameter(method_param_dict, this.MethodParameter, this.MethodParameter.language.default.name)
                }
            } while (this.SelectNextMethodParameter());
        }
        return method_param_dict;
    }

    public AddFlattenedParameter(dict: Map<string, Value>, value: any, name: string) {
        if (value?.flattened) {
            for (let k of value?.schema?.properties || []) {
                this.AddFlattenedParameter(dict, k, k.language.default.name)
            }
        }
        else if (value?.schema?.type != 'constant') {
            dict[name] = value;
        }
    }

    public GetExampleParameters(example_obj): ExampleParam[]{
        let parameters: ExampleParam[] = [];
        let method_param_dict: Map<string, Value> = this.GetMethodParametersDict();
        Object.entries(example_obj.parameters).forEach(([param_name, param_value]) => {
            this.FlattenExampleParameter(method_param_dict, parameters, param_name, param_value, []);
        })
        return parameters;
    }

    private AddExampleParameter(example_param: ExampleParam[], name: string, value: any) {
        if (value instanceof Array) {
            for (let e of value) {
                this.AddExampleParameter(example_param, name, e);
            }
        }
        else if (value) {
            if (typeof value == 'object') {
                let ret = "";
                for (let k in value) {
                    if (ret.length>0) {
                        ret += " ";
                    }
                    //let v = JSON.stringify(value[k]).split(/[\r\n]+/).join("");
                    //ret += `${k}=${v.substr(1, v.length-2)}`;
                    ret += `${k}=${value[k]}`;
                }
                example_param.push(new ExampleParam(name, ret, typeof value));
            }
            else {
                example_param.push(new ExampleParam(name, value, typeof values));
            }
        }

    }

    public FlattenExampleParameter(method_param: Map<string, Value>, example_param: ExampleParam[], name: string, value: any, ancestors: string[]) {
        if (typeof method_param.get(name) !== 'undefined') {
            if ('pathToProperty' in method_param.get(name) && ancestors.length - method_param.get(name)['pathToProperty'].length==-1) {
                // if the method parameter has 'pathToProperty', check the path with example parameter full path.
                let ancestors_ = deepCopy(ancestors) as string[];
                let match = true;
                for (let i = method_param.get(name)['pathToProperty'].length - 1; i >= 0; i--) {
                    if (ancestors_.length <= 0) {
                        match = false;
                        break;
                    }
                    let parent = ancestors_.pop();
                    if (method_param.get(name)['pathToProperty'][i].language.az.name != parent) {
                        match = false;
                    };
                }
                if (match) {
                    // example_param.set(name, value);
                    this.AddExampleParameter(example_param, this.GetMethodParameterMapName(method_param.get(name)), value);
                    return;
                }
            }
            else if ('flattenedNames' in method_param.get(name) && ancestors.length - method_param.get(name)['flattenedNames'].length == 0 && ancestors.length>0) {
                // if the method parameter has 'flattenedNames', check the names (except the last name) with example parameter full path.
                let ancestors_ = deepCopy(ancestors) as string[];
                let match = true;
                for (let i = method_param.get(name)['flattenedNames'].length - 2; i >= 0; i--) {
                    if (ancestors_.length <= 0) {
                        match = false;
                        break;
                    }
                    let parent = ancestors_.pop();
                    if (method_param.get(name)['flattenedNames'][i] != parent) {
                        match = false;
                    };
                }
                if (match) {
                    // example_param.set(name, value);
                    this.AddExampleParameter(example_param, this.GetMethodParameterMapName(method_param.get(name)), value);
                    return;
                }
            }
            else if (ancestors.length==0){
                // example_param.set(name, value);
                this.AddExampleParameter(example_param, this.GetMethodParameterMapName(method_param.get(name)), value);
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
        for(let param of example_params) {
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
            ret.push(new ExampleParam("--" + param_name, param.value, param.original_type));
        };
        return ret;
    }


    public GetExamples(): CommandExample[] {
        let examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, example_obj]) => {
                let example = new CommandExample();
                example.Method = this.Command_MethodName;
                example.Id = id;
                example.Title = example_obj.title || id;
                example.Path = this.Method_Path;
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
                let replaced_value = this.resource_pool.addEndpointResource(param_value, param.original_type);
                if (replaced_value == param_value) {
                    replaced_value = this.resource_pool.addParamResource(param.name, param_value);
                }
                param_value = replaced_value;
            }
            let slp = JSON.stringify(param_value).split(/[\r\n]+/).join("");
            parameters.push(param.name + " " + slp);
        }

        return parameters;
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
            if ( !(this.CommandGroup_Key in internal_resources)) {
                internal_resources[this.CommandGroup_Key] = [this.CommandGroup_Key, ];
            }
            let commands = this.CommandGroup_Name.split(" ");
            let resource_name = commands[commands.length-1]+"-name";
            if (internal_resources[this.CommandGroup_Key].indexOf(resource_name)<0){
                internal_resources[this.CommandGroup_Key].push(resource_name);
            }
        });
        this.resource_pool.addResourcesInfo(internal_resources);

        //find dependency relationships of internal_resources
        this.GetAllMethods(null, () => {
            if (this.Get_Method_Name("az") == 'create') {
                let depend_resources = [];
                let depend_parameters = [];
                if (this.SelectFirstMethodParameter()) {
                    do {
                        if (this.MethodParameter.implementation == 'Method' && !this.MethodParameter_IsFlattened && this.MethodParameter?.schema?.type != 'constant') {
                            let param_name = this.MethodParameter.language["az"].name;
                            if (internal_resources[this.CommandGroup_Key].indexOf(param_name)<0 ) {// if it isn't name of current resource) 
                                let on_resource = this.resource_pool.isResource(param_name);
                                if (on_resource)
                                    // the resource is a dependency only when it's a parameter in an example.
                                    for (let example of this.GetExamples()) {
                                        for (let param of example.Parameters) {
                                            if(param_name == param.name) {
                                                depend_resources.push(on_resource);
                                                depend_parameters.push(param_name);
                                            }
                                        }
                                    }
                                }
                        }
                    } while(this.SelectNextMethodParameter())
                }
                this.resource_pool.setResourceDepends(this.CommandGroup_Key, depend_resources, depend_parameters);
            }
        });

        this.SortExamplesByDependency();
    }

    public SortExamplesByDependency() {
        let depend_on = (example_a: CommandExample, example_b: CommandExample): boolean => {
            return example_a.Parameters.some((param): boolean => {
                if (this.resource_pool.isResource(param.name.substr(2)) == example_b.ResourceClassName) return true;
                if (typeof  param.value == 'string') {
                    for (let resource_name of param.value.split('/')) {
                        if (this.resource_pool.isResource(resource_name) == example_b.ResourceClassName) return true;
                    }
                }
                return false;
            });
        }

        // stable sort
        this._testScenario = MergeSort(this._testScenario, (config_a: object, config_b: object): number => {
            let examples_a: CommandExample[] = this.GetAllExamples(config_a['name']);
            let examples_b: CommandExample[] = this.GetAllExamples(config_b['name']);
            if (examples_a.length <= 0 || examples_b.length <=0 ){
                return 0; // if any example can't be found, keep the original order
            }

            if (examples_a[0].ResourceClassName == examples_b[0].ResourceClassName) {
                if (examples_b[0].Method.toLowerCase() == "create") {
                    return 1;
                }
                else if (examples_b[0].Method.toLowerCase() == "delete") {
                    return -1;
                }
                else if (examples_a[0].Method.toLowerCase() == "create") {
                    return -1;
                }
                else if (examples_a[0].Method.toLowerCase() == "delete") {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (depend_on(examples_a[0], examples_b[0])) {
                if (examples_b[0].Method.toLowerCase() == "create") {
                    return 1;
                }
                else if (examples_b[0].Method.toLowerCase() == "delete") {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else if (depend_on(examples_b[0], examples_a[0])) {
                if (examples_a[0].Method.toLowerCase() == "create") {
                    return -1;
                }
                else if (examples_a[0].Method.toLowerCase() == "delete") {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            return 0;
        });
    }

    public GetAllMethods(command_group?: string, callback?: ()=>void): any[] {
        let ret: [];
        this.SelectFirstExtension();
        if (this.SelectFirstCommandGroup()) {
            do {    // iterate all CommandGroups
                if (command_group && command_group.toLowerCase() != this.CommandGroup_Key.toLowerCase()) continue;
                while (this.currentOperationIndex >= 0) {  // iterate all Commands
                    this.SelectFirstMethod();
                    do {                                   
                        if(callback) {
                            callback();
                        }                       
                    } while (this.SelectNextMethod())
                    this.SelectNextCommand();
                }
            } while (this.SelectNextCommandGroup())
        }
        return ret;
    }

    public GetAllExamples(id?: string, callback?: (example)=>void): CommandExample[] {
        let ret: CommandExample[] = [];
        this.GetAllMethods(null, () => {
            for (let example of this.GetExamples()) {
                if (id && (example.Id.toLowerCase() != id.toLowerCase())) continue;
                if(callback) {
                    callback(example);
                }
                ret.push(example);
            }
        });
        return ret;
    }
}
