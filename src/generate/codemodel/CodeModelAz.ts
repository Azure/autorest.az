/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { Operation, OperationGroup, Parameter, CodeModel } from '@azure-tools/codemodel';
import { CodeModelTypes, DataGraph, RenderInput } from '../../utils/models';
import { ExtensionModel } from './Extension';
import { CommandGroupModel } from './CommandGroup';
import { CommandModel } from './Command';
import { MethodModel } from './Method';
import { MethodParameterModel } from './MethodParameter';
import { ParameterModel } from './Parameter';
import { SchemaModel } from './Schema';
import { ConfigModel } from './Config';
import { ExampleModel } from './Example';
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
        public exampleHandler: ExampleModel,
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

    // Python
    PythonMgmtClient: string;

    SelectFirstExample(): boolean;
    SelectNextExample(): boolean;
    SelectFirstAzExample(): boolean;
    SelectNextAzExample(): boolean;
    getModelData(
        layer: CodeModelTypes,
        inputProperties: Map<CodeModelTypes, RenderInput>,
        dependencies: DataGraph,
    ): Record<string, any>;
    getFirstGroups(): string[];
    getActualExtensionName(): string;
    GetActionData(): any[];
    GetHandler(): Handler;
}
