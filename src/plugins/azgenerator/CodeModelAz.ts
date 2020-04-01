import { AnyARecord } from "dns";
import { Operation, Parameter, OperationGroup } from "@azure-tools/codemodel";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class ExampleParam {
    name: string;
    value: any;
    isJson: boolean;
    isKeyValues: boolean;
    defaultName: string;
    public constructor(name: string, value: any, isJson: boolean, isKeyValues: boolean, defaultName: string) {
        this.name = name;
        this.value = value;
        this.isJson = isJson;
        this.isKeyValues = isKeyValues;
        this.defaultName = defaultName;
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

    CommandGroup: OperationGroup;
    CommandGroup_Name: string;
    CommandGroup_Help: string;

    SelectFirstCommand(): boolean;
    SelectNextCommand(): boolean;

    Command: Operation;
    Command_Name: string;
    Command_MethodName: string;
    Command_FunctionName: string;
    Command_GetOriginalOperation: any;
    Command_GenericSetterParameter(Operation): Parameter;

    Command_Help: string;

    Command_CanSplit: boolean;
    Command_IsLongRun: boolean;
    Command_SubGroupName: string;
    
    SelectFirstMethod(): boolean;
    SelectNextMethod(): boolean;

    Method: Operation;
    Method_IsFirst: boolean;
    Method_IsLast: boolean;
    Method_Name: string;
    Method_NameAz: string;
    Method_BodyParameterName: string;
    Method_IsLongRun: boolean;
    Method_GetOriginalOperation: any;
    Method_CanSplit: boolean;
    Method_GenericSetterParameter(Operation): Parameter;


    SelectFirstMethodParameter(): boolean;
    SelectNextMethodParameter(): boolean;
    EnterSubMethodParameters(): boolean;
    ExitSubMethodParameters(): boolean;

    MethodParameter_Name: string;
    MethodParameter_NameAz: string;
    MethodParameter_NamePython: string;
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
    MethodParameters_AddPolySubClass(oriParam, para): boolean;
    Parameter_Type(Parameter): string;
    Schema_Type(Schema): string;
    Parameter_IsList(Parameter): boolean;
    Parameter_IsListOfSimple(Parameter): boolean;
    Parameter_IsPolyOfSimple(Parameter): boolean;
    Schema_ActionName(Schema): string;
    Parameter_SetAzNameMapsTo(string, Parameter): void;
    Parameter_InGlobal(Parameter): boolean;
    Parameter_IsHidden(Parameter): boolean;
    Parameter_IsFlattened(Parameter): boolean;
    Parameter_MapsTo(Parameter): string;
    Schema_MapsTo(Schema);
    Parameter_Name(): string;
    Parameter_NameAz(Parameter): string;
    Parameter_NamePython(Parameter): string;
    Parameter_Description(Parameter): string;
    Schema_Description(Schema): string;

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
