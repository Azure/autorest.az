﻿import { AnyARecord } from "dns";
import { Operation, Parameter } from "@azure-tools/codemodel";
import { Property } from '@azure-tools/codemodel';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class MethodParam {
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

export class ExampleParam {
    name: string;
    value: any;
    isJson: boolean;
    isKeyValues: boolean;
    keys: string[];
    defaultName: string;
    methodParam: MethodParam;
    public constructor(name: string, value: any, isJson: boolean, isKeyValues: boolean, keys:string[], defaultName: string, methodParam: MethodParam) {
        this.name = name;
        this.value = value;
        this.isJson = isJson;
        this.isKeyValues = isKeyValues;
        this.keys = keys;
        this.defaultName = defaultName;
        this.methodParam = methodParam;
    }
}
export class CommandExample {
    // this should be "create", "update", "list", "show", or custom name
    public Method: string;
    public Id: string;
    public Title: string;
    public Parameters: ExampleParam[];
    // public MethodName: string;
    public Path: string;
    public ResourceClassName: string;
    public HttpMethod: string;    // Get, Post, Put ...
}

export interface CodeModelAz
{
    init(): any;
    SelectFirstExtension(): boolean;
    SelectNextExtension(): boolean;

    Extension_Name: string;
    Extension_NameUnderscored: string;
    Extension_NameClass: string;
    Extension_TestScenario: any;

    SelectFirstCommandGroup(): boolean;
    SelectNextCommandGroup(): boolean;

    CommandGroup_Name: string;
    CommandGroup_Help: string;

    SelectFirstCommand(): boolean;
    SelectNextCommand(): boolean;

    Command_Name: string;
    Command_MethodName: string;
    Command_FunctionName: string;

    Command_Help: string;

    Command_CanSplit: boolean;
    Command_IsLongRun: boolean;
    
    SelectFirstMethod(): boolean;
    SelectNextMethod(): boolean;

    Method: Operation;
    Method_IsFirst: boolean;
    Method_IsLast: boolean;
    Method_Name: string;
    Method_BodyParameterName: string;
    Method_IsLongRun: boolean;


    SelectFirstMethodParameter(): boolean;
    SelectNextMethodParameter(): boolean;
    EnterSubMethodParameters(): boolean;
    ExitSubMethodParameters(): boolean;

    MethodParameter_Name: string;
    MethodParameter_NameAz: string;
    MethodParameter_IsArray: boolean
    MethodParameter_NamePython: string
    MethodParameter_MapsTo: string;
    MethodParameter_Description: string;
    MethodParameter_Type: string;
    MethodParameter_IsList: boolean;
    MethodParameter_IsSimpleArray: boolean;
    MethodParameter_IsListOfSimple: boolean;
    MethodParameter: Parameter;
    MethodParameters: Array<Parameter>;
    SubMethodParameter: Parameter;

    MethodParameter_In: string;
    MethodParameter_IsHidden: boolean;
    MethodParameter_IsRequired: boolean;
    MethodParameter_IsFlattened: boolean;
    MethodParameter_RequiredByMethod: boolean;
    MethodParameter_EnumValues: string[];



    GetModuleOperationName(): string;
    GetModuleOperationNamePython(): string;
    GetModuleOperationNamePythonUpper(): string;
    GetPythonNamespace(): string;

    // Python
    PythonMgmtClient: string;
    PythonOperationsName: string;

    SelectFirstExample(): boolean;
    SelectNextExample(): boolean;
    FindExampleById(id: string): string[][];
    Example_Body: string[];
    Example_Title: string;
    Example_Params: any;
    GetExamples(): CommandExample[];
    GetSubscriptionKey(): string;
    GetPreparerEntities(): any[];
    GatherInternalResource();
}
