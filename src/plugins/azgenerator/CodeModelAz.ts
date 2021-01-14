/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { Operation, OperationGroup, Parameter, Property, Schema } from '@azure-tools/codemodel';
import { CodeModelTypes, DataGraph, GenerationMode, RenderInput, RenderProperties } from '../../utils/models';
import { ResourcePool } from './renders/tests/ScenarioTool';

export class MethodParam {
    public value: any;
    public isList: boolean;
    public isSimpleListOrArray: boolean;
    public submethodparameters: Property[];
    public inBody: boolean;
    public constructor(value, isList, isSimpleListOrArray, submethodparameters, inBody) {
        this.value = value;
        this.isList = isList;
        this.isSimpleListOrArray = isSimpleListOrArray;
        this.submethodparameters = submethodparameters;
        this.inBody = inBody;
    }
}

export enum KeyValueType {
    No,
    Classic,
    PositionalKey,
    ShorthandSyntax,
    SimpleArray,
}

export class ExampleParam {
    name: string;
    value: any;
    isJson: boolean;
    keyValue: KeyValueType;
    keys: string[];
    defaultName: string;
    methodParam: MethodParam;
    ancestors: string[];
    replacedValue: any;
    rawValue: any;
    public constructor(
        name: string,
        value: any,
        isJson: boolean,
        keyValue: KeyValueType,
        keys: string[],
        defaultName: string,
        methodParam: MethodParam,
        ancestors: string[],
        rawValue: any,
    ) {
        this.name = name;
        this.value = value;
        this.isJson = isJson;
        this.keyValue = keyValue;
        this.keys = keys;
        this.defaultName = defaultName;
        this.methodParam = methodParam;
        this.ancestors = ancestors;
        this.rawValue = rawValue;
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
    public HttpMethod: string; // Get, Post, Put ...
    public MethodResponses: any[];
    public Method_IsLongRun: boolean;
    public MethodParams: MethodParam[];
    public ExampleObj: any;
    public CommandString: string;
    public WaitCommandString: string;
}

export interface CodeModelAz {
    init(): any;
    SelectFirstExtension(): boolean;
    SelectNextExtension(): boolean;
    CliGenerationMode: GenerationMode;
    AzextFolder: string;

    IsCliCore: boolean;
    minCliCoreVersion: string;
    SDK_NeedSDK: boolean;
    SDK_IsTrack1: boolean;
    SDK_NoFlatten: boolean;
    AzureCliFolder: string;
    AzureCliExtFolder: string;
    azOutputFolder: string;
    Extension_Name: string;
    Extension_Parent: string;
    Extension_NameUnderscored: string;
    ConfiguredScenario: boolean;
    Extension_NameClass: string;
    Extension_TestScenario: any;
    Extension_DefaultTestScenario: any;
    Extension_ClientSubscriptionBound: boolean;
    Extension_ClientBaseUrlBound: boolean;
    Extension_ClientAuthenticationPolicy: string;
    Extension_Mode: string;
    ResourceType: string | undefined;
    isComplexSchema(type: string): boolean;

    SelectFirstCommandGroup(): boolean;
    SelectNextCommandGroup(): boolean;

    CommandGroup: OperationGroup;
    CommandGroup_Name: string;
    CommandGroup_Help: string;
    CommandGroup_DefaultName: string;
    CommandGroup_HasShowCommand: boolean;
    CommandGroup_CliKey: string;
    CommandGroup_MaxApi: string;
    CommandGroup_MinApi: string;
    CommandGroup_ResourceType: string | undefined;
    CommandGroup_Mode: string;

    SelectFirstCommand(): boolean;
    SelectNextCommand(): boolean;

    Command: Operation;
    Command_Name: string;
    Command_MethodName: string;
    Command_FunctionName: string;
    Command_GetOriginalOperation: any;
    Command_NeedGeneric: boolean;
    Command_MaxApi: string;
    Command_MinApi: string;
    Command_ResourceType: string | undefined;
    Command_GenericSetterParameter(Operation): Parameter;

    Command_Help: string;
    Command_IsLongRun: boolean;
    Command_SubGroupName: string;
    Command_Mode: string;

    SelectFirstMethod(): boolean;
    SelectNextMethod(): boolean;

    Method: Operation;
    Method_IsFirst: boolean;
    Method_IsLast: boolean;
    Method_Name: string;
    Method_NameAz: string;
    Method_NameCli: string;
    Method_Help: string;
    Method_CliKey: string;
    Method_MaxApi: string;
    Method_MinApi: string;
    Method_ResourceType: string | undefined;
    Method_BodyParameterName: string;
    Method_IsLongRun: boolean;
    Method_GetOriginalOperation: any;
    Method_GenericSetterParameter(Operation): Parameter;
    Method_NeedGeneric: boolean;
    Method_Mode: string;
    Operation_IsHidden(op?: Operation): boolean;

    SelectFirstMethodParameter(containHidden?: boolean): boolean;
    SelectNextMethodParameter(containHidden?: boolean): boolean;
    EnterSubMethodParameters(param?: Parameter): boolean;
    ExitSubMethodParameters(): boolean;

    MethodParameter_Name: string;
    MethodParameter_NameAz: string;
    MethodParameter_CliKey: string;
    MethodParameter_MaxApi: string;
    MethodParameter_MinApi: string;
    MethodParameter_ResourceType: string | undefined;
    MethodParameter_IsArray: boolean;
    MethodParameter_NamePython: string;
    MethodParameter_MapsTo: string;
    MethodParameter_Description: string;
    MethodParameter_Type: string;
    MethodParameter_IsList: boolean;
    MethodParameter_IsSimpleArray: boolean;
    MethodParameter_IsListOfSimple: boolean;
    MethodParameter_IdPart: string;
    MethodParameter_ArgGroup: string;
    MethodParameter: Parameter;
    MethodParameters: Array<Parameter>;
    SubMethodParameter: Parameter;

    MethodParameter_In: string;
    MethodParameter_IsHidden: boolean;
    MethodParameter_IsRequired: boolean;
    MethodParameter_IsFlattened: boolean;
    MethodParameter_IsCliFlattened: boolean;
    MethodParameter_RequiredByMethod: boolean;
    MethodParameter_EnumValues: string[];
    MethodParameters_AddPolySubClass(oriParam, para): boolean;
    MethodParameter_DefaultValue: any | undefined;
    MethodParameter_DefaultConfigKey: string | undefined;
    MethodParameter_Mode: string;
    MethodParameter_IsPositional: boolean;
    MethodParameter_IsShorthandSyntax: boolean;
    MethodParameter_PositionalKeys: string[];
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
    Parameter_IsCliFlattened(Parameter): boolean;
    Parameter_MapsTo(Parameter): string;
    Parameter_SubMapsTo(subMethodName, Parameter): string;
    Schema_MapsTo(Schema);
    Parameter_Name(): string;
    Parameter_NameAz(Parameter): string;
    Parameter_CliKey(Parameter): string;
    Parameter_NamePython(Parameter): string;
    Parameter_Description(Parameter): string;
    Parameter_DefaultValue(Parameter): any | undefined;
    Parameter_DefaultConfigKey(Parameter): string | undefined;
    Parameter_IsPositional(Parameter): boolean;
    Parameter_IsShorthandSyntax(Parameter): boolean;
    Schema_Description(Schema): string;
    Schema_FlattenedFrom(Schema): Schema;
    Schema_IsPositional(Schema): boolean;

    GetModuleOperationName(): string;
    GetModuleOperationNamePython(): string;
    GetModuleOperationNamePythonUpper(): string;
    GetPythonNamespace(): string;
    GetPythonPackageName(): string;
    GetResourcePool(): ResourcePool;

    // Python
    PythonMgmtClient: string;

    GenerateTestInit(): void;
    SelectFirstExample(): boolean;
    SelectNextExample(): boolean;
    FindExampleById(id: string, commandParams: any, examples: any[], minimum: boolean): string[][];
    Example_Body: string[];
    Example_Title: string;
    Example_Params: any;
    GetExamples(): CommandExample[];
    GetSubscriptionKey(): string;
    GetPreparerEntities(): any[];
    GatherInternalResource();
    FindExampleWaitById(id: string): string[][];
    GetExampleItems(example: CommandExample, isTest: boolean, commandParams: any): string[];
    GetExampleChecks(example: CommandExample): string[];
    RandomizeNames: boolean;

    // readme config
    CliCoreLib: string;
    GenMinTest: boolean;
    GetMetaData(): { [key: string]: any };
    getRenderData(
        layer: CodeModelTypes,
        inputProperties: Map<CodeModelTypes, RenderInput>,
        dependencies: DataGraph,
    );
}
