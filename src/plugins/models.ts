/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export enum GenerationMode {
    Manual,
    Full,
    Incremental
}

export class PathConstants {
    public static readonly generatedFolder: string = "generated";
    public static readonly testFolder: string = "tests";
    public static readonly manualFolder: string = "manual";
    public static readonly vendoredskdsFolder: string = "vendored_sdks";
    public static readonly latestFolder: string = "latest";
    public static readonly paramsFile: string = "_params.py";
    public static readonly commandsFile: string = "commands.py";
    public static readonly customFile: string = "custom.py";
    public static readonly clientFactoryFile: string = "_client_factory.py";
    public static readonly validatorsFile: string = "_validators.py";
    public static readonly actionFile: string = "action.py";
    public static readonly initFile: string = "__init__.py";
    public static readonly helpFile: string = "_help.py";
    public static readonly preparersFile: string = "preparers.py";
    public static readonly metadataFile: string = "azext_metadata.json";
    public static readonly setupPyFile: string = "setup.py";
}

export class ArgumentConstants {
    public static readonly generationMode: string = "generation-mode";
}

export class CodeGenConstants {
    public static readonly minCliCoreVersion = "2.11.0";
}

export interface AzextMetadata {
    "azext.minCliCoreVersion": string;
    "azext.isPreview": boolean;
    "azext.isExperimental": boolean;
}