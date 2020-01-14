/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface CodeModelAz
{
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

    SelectFirstOption(): boolean;
    SelectNextOption(): boolean;
    HasSubOptions(): boolean;
    EnterSubOptions(): boolean;
    ExitSubOptions(): boolean;

    Option_Name: string;
    Option_NameUnderscored: string;
    Option_NamePython: string;
    Option_IsRequired: boolean;
    Option_Description: string;
    Option_Type: string;
    Option_IsList: boolean;
    Option_PathSdk: string;
    Option_PathSwagger: string;
    Option_EnumValues: string[];

    SelectFirstMethod(): boolean;
    SelectNextMethod(): boolean;

    Method_IsFirst: boolean;
    Method_IsLast: boolean;
    Method_Name: string;
    Method_BodyParameterName: string;

    SelectFirstMethodParameter(): boolean;
    SelectNextMethodParameter(): boolean;

    MethodParameter_Name: string;
    MethodParamerer_MapsTo: string;


    GetModuleOperationName(): string;
    GetModuleOperationNameUpper(): string;
    GetPythonNamespace(): string;

    // Python
    PythonMgmtClient: string;
    PythonOperationsName: string;

    SelectFirstExample(): boolean;
    SelectNextExample(): boolean;
    FindExampleById(id: string): string[];
    Example_Body: string[];
    Example_Title: string;
    Example_Params: any;
}
