/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";
import { CodeModel, SchemaType, Schema, ParameterLocation, Value } from '@azure-tools/codemodel';
import { serialize, deserialize } from "@azure-tools/codegen";
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';
import { ToSnakeCase } from '../../utils/helper';


export class CommandExample
{
    // this should be "create", "update", "list", "show", or custom name
    public Method: string;
    public Id: string;
    // public Title: string;
    public Parameters: Map<string, string>;
    // public MethodName: string;
}

export class CodeModelCliImpl implements CodeModelAz
{
    codeModel: CodeModel;
    options: any;
    extensionName: string;
    currentOperationGroupIndex: number;
    currentOperationIndex: number;
    currentParameterIndex: number;
    currentExampleIndex: number;
    preMethodIndex: number;
    currentMethodIndex: number;
    private _testScenario: any;


    async init() {
        this.options = await this.session.getValue('az');
        this.extensionName = await this.options['extensions'];
        this.currentOperationGroupIndex = -1;
        this.currentOperationIndex = -1;
        this.currentParameterIndex = -1;
        this.currentExampleIndex = -1;
        this.preMethodIndex = -1;
        this.currentMethodIndex = -1;
        
    }

    public constructor(protected session: Session<CodeModel>, testScenario: any) 
    {
        this.codeModel = session.model;
        this._testScenario = testScenario;
        this.sortOperationByAzCommand();
    }

    private sortOperationByAzCommand() {
        for(let [idx, operationGroup] of this.codeModel.operationGroups.entries()) {
            operationGroup.operations.sort((a, b) => a.language['az'].command.localeCompare(b.language['az'].command));
            this.codeModel.operationGroups[idx] = operationGroup;
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
        return this.codeModel.info.title.replace(/ManagementClient/g, '');
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
            this.SelectFirstCommand();
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    public SelectNextCommandGroup(): boolean
    {
        if(this.currentOperationGroupIndex < this.codeModel.operationGroups.length - 1) {
            this.currentOperationGroupIndex++;
            this.SelectFirstCommand();
            return true;
        } else {
            this.currentOperationGroupIndex = -1;
            return false;
        }
    }

    public get CommandGroup_Name(): string
    {
        return this.extensionName + " " + ToSnakeCase(this.codeModel.operationGroups[this.currentOperationGroupIndex].$key);
    }

    public get CommandGroup_Help(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['az'].command;
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
        // just enumerate through commands in command group
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length > 0) {
            this.currentOperationIndex = 0;
            this.preMethodIndex = this.currentOperationIndex;
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
        if(this.currentOperationIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length - 1) {
            this.currentOperationIndex++;
            this.preMethodIndex = this.currentOperationIndex;
            while(this.currentOperationIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length) {
                if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command == this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex - 1].language['az'].command) {
                    this.currentOperationIndex++;
                } else {
                    break;
                }
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
        //return  this.Command_MethodName.toLowerCase() + "_" + this.Command_Name.replace(/ /g, "_");
        return this.Command_Name.replace(/ /g, "_");
    }

    public get Command_Name(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command;
    }

    public get Command_MethodName(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].name;
    }

    public get Command_Help(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].description;
    }

    public SelectFirstOption(): boolean
    {
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length > 0) {
            this.currentParameterIndex = 0;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex]
            const currentParameterName = parameter.language['az'].name;
            if(parameter.hidden || currentParameterName == "subscription-id" || currentParameterName == "api-version" || currentParameterName == "$host") {
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
        if(this.currentParameterIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length - 1) {
            this.currentParameterIndex++;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex];
            const currentParameterName = parameter.language['az'].name;
            if(parameter.hidden || currentParameterName == "subscription-id" || currentParameterName == "api-version" || currentParameterName == "$host") {
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

    public HasSubOptions(): boolean
    {
        /*if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema.type == "object") {
            return true;
        }*/
        return false;       
    }

    public EnterSubOptions(): boolean
    {
        return false;
    }

    public ExitSubOptions(): boolean
    {
        return false;
    }

    public get Option_Name(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].name;
    }

    public get Option_NameUnderscored(): string
    {
        this.session.message({Channel:Channel.Warning, Text: "CommandGroupIndex: " + this.currentOperationGroupIndex +" CommandIndex: " + this.currentOperationIndex + " ParameterIdx: " + this.currentParameterIndex});
        return this.Option_Name.replace(/-/g, "_");
    }

    public get Option_NamePython(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['python'].name;
    }

    public get Option_IsRequired(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].required;
    }

    public get Option_Description(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].description;
    }

    public get Option_In(): string
    {
        let protocol = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].protocol;
        return protocol != undefined && protocol.http != undefined && protocol.http.in != undefined ? protocol.http.in: ParameterLocation.Body;
    }

    public get Option_IsHidden(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].hidden? true: false;   
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

    public get Option_IsList(): boolean
    {
        let mtype = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema.type;
        return (mtype == SchemaType.Dictionary || mtype == SchemaType.Object || mtype == SchemaType.Array)? true: false;
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
            return true;
        } else {
            this.currentMethodIndex = -1;
            return false;
        }
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

    public get Method_Name(): string
    {
       return  this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].language['az'].name;
    }

    public get Method_BodyParameterName(): string
    {
        return null;
    }

    //=================================================================================================================
    // Methods Parameters.
    //
    // This interface is designed to enumerate all parameters of the selected method and their mapping to Python SDK.
    //=================================================================================================================
    public SelectFirstMethodParameter(): boolean
    {
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters.length > 0) {
            this.currentParameterIndex = 0;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
            const currentParameterName = parameter.language['python'].name;
            if(parameter.hidden || currentParameterName == "subscription_id" || currentParameterName == "api_version" || currentParameterName == "host") {
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
        if(this.currentParameterIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters.length - 1) {
            this.currentParameterIndex++;
            let parameter = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
            const currentParameterName = parameter.language['python'].name;
            if(parameter.hidden || currentParameterName == "subscription_id" || currentParameterName == "api_version" || currentParameterName == "host") {
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

    public get MethodParameter_Name(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].language['python'].name;
    }

    public get MethodParameter_MapsTo(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].language['python'].name;
    }
    public get MethodParameter_Type(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].schema.type;
    }

    public get MethodParameter_IsList(): boolean
    {
        let mtype = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].schema.type;
        return (mtype == SchemaType.Dictionary || mtype == SchemaType.Object || mtype == SchemaType.Array)? true: false;
    }

    public get MethodParameter(): any {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex];
    }



    public get MethodParameter_In(): string
    {
        let protocol = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].protocol;
        return protocol != undefined && protocol.http != undefined && protocol.http.in != undefined? protocol.http.in: ParameterLocation.Body;
    }

    public get MethodParameter_IsHidden(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].hidden? true: false;
    }

    public get MethodParameter_IsRequired(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].request.parameters[this.currentParameterIndex].required;
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
        return this.codeModel.info.title;
    }

    public get PythonOperationsName(): string
    {
        //return this.options['namespace'].split('.').pop();
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].language['python'].name;
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

        //this.session.message({Channel:Channel.Warning, Text:serialize(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].extensions['x-ms-examples'])});
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

    public get Examples(): any {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentMethodIndex].extensions['x-ms-examples'];
    }

    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersDict(): Map<string, Value> {
        let method_param_dict: Map<string, Value> = new Map<string, Value>();
        if (this.SelectFirstMethodParameter()) {
            do {
                if (this.MethodParameter.implementation == 'Method') {
                    // method_param_dict[this.MethodParameter.language.default.name] = this.MethodParameter;
                    this.AddFlattenedParameter(method_param_dict, this.MethodParameter, this.MethodParameter.language.default.name)
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
        else {
            dict[name] = value;
        }
    }

    public GetExampleParameters(example_obj): Map<string, string> {
        let parameters: Map<string, string> = new Map<string, string>();
        let method_param_dict: Map<string, Value> = this.GetMethodParametersDict();
        Object.entries(example_obj.parameters).forEach(([param_name, param_value]) => {
            this.FlattenExampleParameter(method_param_dict, parameters, param_name, param_value);
        })
        return parameters;
    }

    public FlattenExampleParameter(method_param: Map<string, Value>, example_parm: Map<string, string>, name: string, value: any) {
        if (typeof value === 'object' && value !== null) {
            for (let sub_name in value) {
                this.FlattenExampleParameter(method_param, example_parm, sub_name, value[sub_name]);
            }
        }
        else if (name in method_param) {
            example_parm[name] = value;
        }
    }

    public ConvertToCliParameters(example_params): Map<string, string> {
        let ret: Map<string, string> = new Map<string, string>();
        Object.entries(example_params).forEach(([param_name, param_value]) => {
            param_name = ToSnakeCase(param_name);
            //// Here are some rename logic in POC, but not implement in current az codegen, so comment them here 
            // if (param_name.endsWith('_name')) {
            //     if (param_name == "resource_group_name") {
            //         param_name = "resource_group";
            //     }
            //     else {
            //         param_name = "name";
            //     }
            // }
            param_name = param_name.split("_").join("-");
            ret["--" + param_name] = param_value;
        });
        return ret;
    }


    private GetExamples(): CommandExample[] {
        let examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, example_obj]) => {
                let example = new CommandExample();
                example.Method = this.Method_Name;
                example.Id = id;
                let params: Map<string, string> = this.GetExampleParameters(example_obj);
                example.Parameters = this.ConvertToCliParameters(params);
                examples.push(example);
            });
        }
        return examples;
    }

    public GetExampleItems(example: CommandExample, isTest: boolean): string[] {
        let parameters: string[] = [];

        parameters.push("az " + this.CommandGroup_Name.split("_").join("-") + " " + example.Method)

        for (let k in example.Parameters) {
            let slp = JSON.stringify(example.Parameters[k]).split(/[\r\n]+/).join("");
            if (isTest) {
                if (k != "--resource-group-name") {
                    parameters.push(k + " " + slp);
                }
                else {
                    parameters.push(k + " {rg}");
                }
            }
            else {
                parameters.push(k + " " + slp);
            }
        }

        return parameters;
    }

    public FindExampleById(id: string): string[] {
        this.SelectFirstExtension();
        if (this.SelectFirstCommandGroup()) {
            do {    // iterate all CommandGroups
                while (this.currentOperationIndex >= 0) {  // iterate all Commands
                    this.SelectFirstMethod();
                    do {                        // iterate all Methods
                        for (let example of this.GetExamples()) {
                            if (example.Id.toLowerCase() == id.toLowerCase()) {
                                return this.GetExampleItems(example, true);
                            }
                        }
                    } while (this.SelectNextMethod())
                    this.SelectNextCommand();
                }
            } while (this.SelectNextCommandGroup())
        }
        return [];

    }
}
