import { AnyARecord } from "dns";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class CommandExample
{
    // this should be "create", "update", "list", "show", or custom name
    public Method: string;
    public Id: string;
    public Title: string;
    public Parameters: Map<string, string>;
    // public MethodName: string;
    public Path: string;
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

    SelectFirstOption(): boolean;
    SelectNextOption(): boolean;
    EnterSubOptions(): boolean;
    ExitSubOptions(): boolean;

    Option_Name: string;
    Option_NameUnderscored: string;
    Option_NamePython: string;
    Option_IsRequired: boolean;
    Option_Description: string;
    Option_Type: string;
    Option_IsList: boolean;
    Option_IsListOfComplex: boolean;
    Option_In: string;
    Option_PathSdk: string;
    Option_PathSwagger: string;
    Option_EnumValues: string[];
    Option_IsHidden: boolean;
    Option_IsFlattened: boolean;
    
    SelectFirstMethod(): boolean;
    SelectNextMethod(): boolean;

    Method_IsFirst: boolean;
    Method_IsLast: boolean;
    Method_Name: string;
    Method_BodyParameterName: string;

    SelectFirstMethodParameter(): boolean;
    SelectNextMethodParameter(): boolean;
    EnterSubMethodParameters(): boolean;
    ExitSubMethodParameters(): boolean;

    MethodParameter_Name: string;
    MethodParameter_NamePython: string
    MethodParameter_MapsTo: string;
    MethodParameter_Description: string;
    MethodParameter_Type: string;
    MethodParameter_IsList: boolean;
    MethodParameter_IsListOfComplex: boolean;
    MethodParameter: any;
    MethodParameter_In: string;
    MethodParameter_IsHidden: boolean;
    MethodParameter_IsRequired: boolean;
    MethodParameter_IsFlattened: boolean;
    MethodParameter_RequiredByMethod: boolean;
    MethodParameter_EnumValues: string[];



    GetModuleOperationName(): string;
    GetModuleOperationNameUpper(): string;
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
}
