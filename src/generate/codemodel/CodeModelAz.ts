/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { Operation, OperationGroup, Parameter, Property, Schema } from '@azure-tools/codemodel';
import { CodeModelTypes, DataGraph, GenerationMode, RenderInput } from '../../utils/models';
import { ResourcePool } from '../renders/tests/ScenarioTool';
import { TestStepExampleFileRestCall } from 'oav/dist/lib/testScenario/testResourceTypes';
import { ExtensionModel } from './Extension';
import { CommandGroupModel } from './CommandGroup';
import { CommandModel } from './Command';
import { MethodModel } from './Method';
import { MethodParameterModel } from './MethodParameter';
import { ParameterModel } from './Parameter';
import { SchemaModel } from './Schema';
import { ConfigModel } from './Config';

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
    public commandStringItems: string[];
    public CommandString: string;
    public WaitCommandString: string;
}

export class Handler {
    public constructor(
        public extensionHandler: ExtensionModel,
        public commandGroupHandler: CommandGroupModel,
        public commandHandler: CommandModel,
        public methodHandler: MethodModel,
        public methodParameterHandler: MethodParameterModel,
        public parameterHandler: ParameterModel,
        public schemaHandler: SchemaModel,
        public configHandler: ConfigModel,
    ) {}
}
export interface CodeModelAz {
    init(): any;
    SelectFirstExtension(): boolean;
    SelectNextExtension(): boolean;

    isComplexSchema(type: string, param: any): boolean;

    SelectFirstCommandGroup(needRefer?: boolean): boolean;
    SelectNextCommandGroup(needRefer?: boolean): boolean;

    SelectFirstCommand(): boolean;
    SelectNextCommand(): boolean;

    SelectFirstMethod(): boolean;
    SelectNextMethod(): boolean;

    // Method_SetAzExamples(examples: CommandExample[]): void;
    Operation_IsHidden(op?: Operation): boolean;

    SelectFirstMethodParameter(containHidden?: boolean): boolean;
    SelectNextMethodParameter(containHidden?: boolean): boolean;
    EnterSubMethodParameters(param?: Parameter): boolean;
    ExitSubMethodParameters(): boolean;

    MethodParameters: Array<Parameter>;
    SubMethodParameter: Parameter;
    GetModuleOperationName(group?: OperationGroup): string;
    GetModuleOperationNamePython(): string;
    GetModuleOperationNamePythonUpper(): string;
    GetResourcePool(): ResourcePool;

    // Python
    PythonMgmtClient: string;

    GenerateTestInit(): void;
    SelectFirstExample(): boolean;
    SelectNextExample(): boolean;
    FindExampleById(
        id: string,
        commandParams: any,
        examples: any[],
        minimum: boolean,
        step?: TestStepExampleFileRestCall,
    ): string[][];
    SelectFirstAzExample(): boolean;
    SelectNextAzExample(): boolean;
    GetExamples(includeGenerated: boolean): CommandExample[];
    GetSubscriptionKey(): string;
    GetPreparerEntities(): any[];
    GatherInternalResource();
    FindExampleWaitById(id: string, step?: TestStepExampleFileRestCall): string[][];
    GetExampleItems(example: CommandExample, isTest: boolean, commandParams: any): string[];
    GetExampleChecks(example: CommandExample): string[];

    GetMetaData(): { [key: string]: any };
    getModelData(
        layer: CodeModelTypes,
        inputProperties: Map<CodeModelTypes, RenderInput>,
        dependencies: DataGraph,
    );
    GetActionData(): any[];
    GetHandler(): Handler;
}
