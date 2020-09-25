/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export enum GenerationMode {
    Manual,
    Full,
    Incremental
}

export enum ExtensionMode {
    Preview = "preview",
    Experimental = "experimental",
    Stable = "stable"
}

export enum TargetMode {
    Core = 'core',
    Extension = 'extension'
}

export enum CompatibleLevel {
    Track1 = "track1",
    Track2 = "track2"
}

export enum GenerateSdk {
    Yes = "yes",
    No = "no"
}

export enum SystemType {
    Darwin = "Darwin",
    Linux = "Linux",
    windows = "windows"
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
    public static readonly actionFileOldVersion: string = "_actions.py";
    public static readonly initFile: string = "__init__.py";
    public static readonly helpFile: string = "_help.py";
    public static readonly reportFile: string = "report.md";
    public static readonly fullPreparersFile: string = "preparers.py";
    public static readonly incPreparersFile: string = "preparers_incrementalGenerated.py";
    public static readonly metadataFile: string = "azext_metadata.json";
    public static readonly setupPyFile: string = "setup.py";
    public static readonly docSourceJsonFile: string = "/doc/sphinx/azhelpgen/doc_source_map.json";
    public static readonly mainSetupPyFile: string = "src/azure-cli/setup.py";
    public static readonly readmeFile: string = "README.md";

    public static fullTestSceanrioFile(rpName: string): string {
        return "test_" + rpName + "_scenario.py";
    }

    public static incTestScenarioFile(rpName: string): string {
        return "test_" + rpName + "_scenario_incrementalGenerated.py";
    }
}

export class ArgumentConstants {
    public static readonly generationMode: string = "generation-mode";
    public static readonly clearOutputFolder: string = "clear-output-folder";
    public static readonly generateSDK: string = "generate-sdk";
    public static readonly targetMode: string = "target-mode";
    public static readonly compatibleLevel: string = "compatible-level";
    public static readonly sdkNoFlatten = "sdk-no-flatten";
    public static readonly extensionMode = "extension-mode";
    public static readonly azureCliFolder = "azure-cli-folder";
    public static readonly azureCliExtFolder = "azure-cli-extension-folder";
}

export class CodeGenConstants {
    public static readonly minCliCoreVersion = "2.11.0";
}

export interface AzextMetadata {
    "azext.minCliCoreVersion": string;
    "azext.isPreview": boolean;
    "azext.isExperimental": boolean;
}