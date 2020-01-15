/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { serialize, deserialize } from "@azure-tools/codegen";
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';

export class CodeModelCliImpl implements CodeModelAz
{
    codeModel: CodeModel;
    options: any;
    extensionName: string;
    currentOperationGroupIndex: number;
    currentOperationIndex: number;
    currentParameterIndex: number;



    async init() {
        this.options = await this.session.getValue('az');
        this.extensionName = await this.options['az-name'];
        this.currentOperationGroupIndex = 0;
        this.currentOperationIndex = 0;
        this.currentParameterIndex = 0;
    }

    public constructor(protected session: Session<CodeModel>) 
    {
        this.codeModel = session.model;
    }


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
        return [];
    }

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
        return this.codeModel.operationGroups[this.currentOperationGroupIndex]['$keys'];
    }

    public get CommandGroup_Help(): string
    {
        return "Commands to manage somehting.";
    }

    public SelectFirstCommand(): boolean
    {
        // just enumerate through commands in command group
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations.length > 0) {
            this.currentOperationIndex = 0;
            this.SelectFirstOption();
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
            this.SelectFirstOption();
            return true;
        } else {
            this.currentOperationIndex = -1;
            return false;
        }
    }

    public SelectCommand(name: string): boolean
    {
        return true;
    }

    public get Command_FunctionName()
    {
        return  this.Command_MethodName.toLowerCase + "_" + this.Command_Name.replace(/ /g, "_");
    }

    public get Command_Name(): string
    {
        this.session.message({Channel:Channel.Warning, Text:"currentOperationGroupIndex: " + this.currentOperationGroupIndex + " currentOperationIndex: " + this.currentOperationIndex + " currentParameterIndex: " + this.currentParameterIndex});
        //+ " operationGroup: " + this.session.model.operationGroups[thi]
        return this.session.model.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].command;
    }

    public get Command_MethodName(): string
    {
        return this.session.model.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].name;
    }

    public SelectFirstExample(): boolean
    {
        return true;
    }

    public SelectNextExample(): boolean
    {
        return false;
    }

    public get Example_Body(): string[]
    {
        // TBD
        return null;
    }

    public get Example_Params(): any
    {
        // TBD
        return {};
    }

    public get Example_Title(): string
    {
        return "Create something";
    }

    public SelectFirstOption(): boolean
    {
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length > 0) {
            this.currentParameterIndex = 0;
            return true;
        } else {
            this.currentParameterIndex = -1;
            return false;
        }
    }

    public SelectNextOption(): boolean
    {
        if(this.currentParameterIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length - 1) {
            this.currentParameterIndex++;
            return true;
        } else {
            this.currentParameterIndex = -1;
            return false;
        }
    }

    public HasSubOptions(): boolean
    {
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
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].name.replace(/-/g, "_");
    }

    public get Option_NamePython(): string
    {
        return "python_sdk_name";
    }

    public get Option_IsRequired(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].required;
    }

    public get Option_Description(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].description;
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
        return typeof this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex];
    }

    public get Option_IsList(): boolean
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex] instanceof Array? true: null;
    }

    public get Option_EnumValues(): string[]
    {
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema.type == "sealed-choice") {
            var enumArray = [];
            let schema = this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].schema;
            for(var item in schema['choices']) {
                enumArray.push(item);
            }
            return enumArray;
        } else {
            return [];
        }
    }

    public SelectFirstMethod(): boolean
    {
        return true;
    }

    public SelectNextMethod(): boolean
    {
        return false;
    }

    public get Method_IsFirst(): boolean
    {
        return true;
    }

    public get Method_IsLast(): boolean
    {
        return true;
    }

    public get Method_Name(): string
    {
       return  this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].language['az'].name;
    }

    public get Method_BodyParameterName(): string
    {
        return null;
    }

    public SelectFirstMethodParameter(): boolean
    {
        if(this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length > 0) {
            this.currentParameterIndex = 0;
            return true;
        } else {
            return false;
        }
    }

    public SelectNextMethodParameter(): boolean
    {
        if(this.currentParameterIndex < this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters.length - 1) {
            this.currentParameterIndex++;
            return true;
        } else {
            return false;
        }    
    }

    public get MethodParameter_Name(): string
    {
        return this.codeModel.operationGroups[this.currentOperationGroupIndex].operations[this.currentOperationIndex].request.parameters[this.currentParameterIndex].language['az'].name;
    }

    public get MethodParamerer_MapsTo(): string
    {
        return "param";
    }

    public get Command_Help(): string
    {
        return "This command does something amazing"
    }

    public GetModuleOperationName(): string
    {
        return "OperationName";
    }

    public GetModuleOperationNameUpper(): string
    {
        return "operation_name";
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
        return "whatever";
    }

    public FindExampleById(id: string): string[]
    {
        return [];
    }
}
