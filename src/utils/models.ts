/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

export enum GenerationMode {
    Manual,
    Full,
    Incremental,
}

export const ExtensionMode = {
    Preview: 'preview',
    Experimental: 'experimental',
    Stable: 'stable',
};

export enum TargetMode {
    Core = 'core',
    Extension = 'extension',
}

export enum CompatibleLevel {
    Track1 = 'track1',
    Track2 = 'track2',
}

export enum GenerateSdk {
    Yes = 'yes',
    No = 'no',
}

export enum SystemType {
    Darwin = 'Darwin',
    Linux = 'Linux',
    windows = 'windows',
}

export const EXCLUDED_PARAMS = [
    'self',
    'raw',
    'polling',
    'custom_headers',
    'operation_config',
    'content_version',
    'kwargs',
    'client',
    'no_wait',
];

export class PathConstants {
    public static readonly generatedFolder: string = 'generated';
    public static readonly testFolder: string = 'tests';
    public static readonly manualFolder: string = 'manual';
    public static readonly vendoredskdsFolder: string = 'vendored_sdks';
    public static readonly latestFolder: string = 'latest';
    public static readonly paramsFile: string = '_params.py';
    public static readonly commandsFile: string = 'commands.py';
    public static readonly customFile: string = 'custom.py';
    public static readonly clientFactoryFile: string = '_client_factory.py';
    public static readonly validatorsFile: string = '_validators.py';
    public static readonly actionFile: string = 'action.py';
    public static readonly actionFileOldVersion: string = '_actions.py';
    public static readonly initFile: string = '__init__.py';
    public static readonly helpFile: string = '_help.py';
    public static readonly reportFile: string = 'report.md';
    public static readonly preparersFile: string = 'preparers.py';
    public static readonly testStepFile: string = 'example_steps.py';
    public static readonly metadataFile: string = 'azext_metadata.json';
    public static readonly setupPyFile: string = 'setup.py';
    public static readonly docSourceJsonFile: string = '/doc/sphinx/azhelpgen/doc_source_map.json';
    public static readonly mainSetupPyFile: string = 'src/azure-cli/setup.py';
    public static readonly readmeFile: string = 'README.md';
    public static readonly recordingFolder: string = 'recordings';

    public static fullTestSceanrioFile(rpName: string): string {
        return 'test_' + rpName + '_scenario.py';
    }

    public static incTestScenarioFile(rpName: string): string {
        return 'test_' + rpName + '_scenario_incrementalGenerated.py';
    }
}

export enum CodeGenConstants {
    isCliCore,
    sdkNeeded,
    sdkTrack1,
    azextFolder,
    pythonNamespace,
    azOutputFolder,
    generationMode = 'generation-mode',
    clearOutputFolder = 'clear-output-folder',
    generateSDK = 'generate-sdk',
    targetMode = 'target-mode',
    compatibleLevel = 'compatible-level',
    sdkNoFlatten = 'sdk-no-flatten',
    sdkFlatten = 'sdk-flatten',
    extensionMode = 'extension-mode',
    azureCliFolder = 'azure-cli-folder',
    azureCliExtFolder = 'azure-cli-extension-folder',
    az = 'az',
    debug = 'debug',
    namespace = 'namespace',
    extensions = 'extensions',
    azOuputFolder = 'az-output-folder',
    pythonSdkOutputFolder = 'python-sdk-output-folder',
    cliCoreLib = 'cli-core-lib',
    use = 'use',
    parents = '_parents',
    parentExtension = 'parent-extension',
    clientBaseUrlBound = 'client-base-url-bound',
    clientSubscriptionBound = 'client-subscription-bound',
    clientAuthenticationPolicy = 'client-authentication-policy',
    directive = 'directive',
    minCliCoreVersion = '2.15.0',
    cliCodeModelName = 'code-model-cli-v4.yaml',
    m4CodeModelName = 'code-model-v4-no-tags.yaml',
    DEFAULT_CLI_CORE_LIB = 'azure.cli.core',
}

export interface AzextMetadata {
    'azext.minCliCoreVersion': string;
    'azext.isPreview': boolean;
    'azext.isExperimental': boolean;
}
