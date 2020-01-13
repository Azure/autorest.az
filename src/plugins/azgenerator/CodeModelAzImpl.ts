/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz";


export class CodeModelCliImpl implements CodeModelAz
{
    public constructor(/* add model here */)
    {
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

    public SelectFirstCommandGroup(): boolean
    {
        return true;
    }

    public SelectNextCommandGroup(): boolean
    {
        return false;
    }

    public get Extension_Name()
    {
        return "my-extension";
    }

    public get Extension_NameUnderscored()
    {
        return "my_extension";
    }

    public get Extension_NameClass(): string
    {
        return "MyExtensionClassName";
    }

    public get Extension_TestScenario(): any
    {
        return [];
    }

    public get CommandGroup_Name(): string
    {
        return "my-extension something";
    }

    public get Command_FunctionName()
    {
        return "create_my_extension_something";
    }

    public get Command_Name(): string
    {
        return "my-extension something create";
    }

    public get Command_MethodName(): string
    {
        return "show";
    }

    public get CommandGroup_Help(): string
    {
        return "Commands to manage somehting.";
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
        return true;
    }

    public SelectNextOption(): boolean
    {
        return false;
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
        return "my-option";
    }

    public get Option_NameUnderscored(): string
    {
        return "my_option";
    }

    public get Option_NamePython(): string
    {
        return "python_sdk_name";
    }

    public get Option_IsRequired(): boolean
    {
        return true;
    }

    public get Option_Description(): string
    {
        return "My option doing to enable amazing feature";
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
        return "str";
    }

    public get Option_IsList(): boolean
    {
        return false;
    }

    public get Option_EnumValues(): string[]
    {
        return ["value1", "value2"];
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
       return "show";
    }

    public get Method_BodyParameterName(): string
    {
        return null;
    }

    public SelectFirstMethodParameter(): boolean
    {
        return true
    }

    public SelectNextMethodParameter(): boolean
    {
        return false;
    }

    public get MethodParameter_Name(): string
    {
        return "param";
    }

    public get MethodParamerer_MapsTo(): string
    {
        return "param";
    }

    public get Command_Help(): string
    {
        return "This command does something amazing"
    }

    public SelectFirstCommand(): boolean
    {
        return true;
    }

    public SelectNextCommand(): boolean
    {
        return false;
    }

    public SelectCommand(name: string): boolean
    {
        return true;
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
        return "azure.mgmt.whatever";
    }

    public get PythonMgmtClient(): string
    {
        return "MyMgmtClient";
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
