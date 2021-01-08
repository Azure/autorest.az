import * as path from 'path';
import { isNullOrUndefined } from './helper';
import {
    TargetMode,
    CodeGenConstants,
    GenerateSdk,
    CompatibleLevel,
    ExtensionMode,
    GenerationMode,
    PathConstants,
} from './models';
import { HeaderGenerator } from '../plugins/azgenerator/Header';
import { Host, Channel } from '@azure-tools/autorest-extension-base';

export class AzConfiguration {
    private static dict: Map<CodeGenConstants, unknown>;

    constructor() {
        AzConfiguration.dict = new Map<CodeGenConstants, unknown>();
    }

    public static getValue(key: CodeGenConstants) {
        return AzConfiguration.dict[key];
    }

    public static setValue(key: CodeGenConstants, value: unknown): void {
        AzConfiguration.dict[key] = value;
    }
}

export async function configure(host: Host): Promise<void> {
    const debug = (await host.GetValue(CodeGenConstants.debug)) || false;

    try {
        await processSimpleOption(host);
        await processGenerationOption(host);
        await processFolderPath(host);
        await autoDetectGenerationMode(
            host,
            AzConfiguration.getValue(CodeGenConstants.azextFolder),
            AzConfiguration.getValue(CodeGenConstants.isCliCore),
        );
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }
}

async function processSimpleOption(host: Host) {
    // handling extension-mode by default it's experimental.
    let extensionMode = ExtensionMode.Experimental;
    extensionMode = (await host.GetValue(CodeGenConstants.extensionMode)) || extensionMode;
    AzConfiguration.setValue(CodeGenConstants.extensionMode, extensionMode);

    // handling azure-cli-folder
    const azureCliFolder = await host.GetValue(CodeGenConstants.azureCliFolder);
    if (!isNullOrUndefined(azureCliFolder)) {
        AzConfiguration.setValue(CodeGenConstants.azureCliFolder, azureCliFolder);
    }

    // handling az-output-folder
    const azOutputFolder = await host.GetValue(CodeGenConstants.azOuputFolder);
    AzConfiguration.setValue(CodeGenConstants.azOutputFolder, azOutputFolder);

    // handle cli-core-lib
    const cliCoreLib: string = await host.GetValue(CodeGenConstants.cliCoreLib);
    if (!isNullOrUndefined(cliCoreLib) && cliCoreLib.length > 0) {
        AzConfiguration.setValue(CodeGenConstants.cliCoreLib, cliCoreLib);
    }

    // handle __parents
    const parents = await host.GetValue(CodeGenConstants.parents);
    AzConfiguration.setValue(CodeGenConstants.parents, parents);

    // handle use
    const use = await host.GetValue(CodeGenConstants.use);
    AzConfiguration.setValue(CodeGenConstants.use, use);

    for (const key of [
        CodeGenConstants.azOuputFolder,
        CodeGenConstants.parents,
        CodeGenConstants.use,
        CodeGenConstants.az,
        CodeGenConstants.directive,
    ]) {
        // handle key
        const value = await host.GetValue(key);
        AzConfiguration.setValue(key, value);
    }
}

async function processGenerationOption(host: Host) {
    const targetMode = (await host.GetValue(CodeGenConstants.targetMode)) || TargetMode.Extension;
    const cliCore = targetMode === TargetMode.Core;
    // change both core and extension mode into no flattened mode.
    let sdkFlatten = false;
    sdkFlatten = !isNullOrUndefined(await host.GetValue(CodeGenConstants.sdkFlatten))
        ? true
        : sdkFlatten;
    sdkFlatten = !isNullOrUndefined(await host.GetValue(CodeGenConstants.sdkNoFlatten))
        ? false
        : sdkFlatten;
    const sdkNoFlatten = !isNullOrUndefined(await host.GetValue(CodeGenConstants.sdkNoFlatten))
        ? true
        : !sdkFlatten;
    if (cliCore && !sdkNoFlatten) {
        host.Message({
            Channel: Channel.Fatal,
            Text:
                'You have specified the --target-mode=core and --sdk-no-flatten=false at the same time. which is not a valid configuration',
        });
        throw new Error('Wrong configuration detected, please check!');
    }
    let azExtensionFolder = '';
    let azCoreFolder = '';
    if (isNullOrUndefined(cliCore) || cliCore === false) {
        azExtensionFolder = await host.GetValue(CodeGenConstants.azureCliExtFolder);
    } else {
        azCoreFolder = await host.GetValue(CodeGenConstants.azureCliFolder);
    }
    if ((isNullOrUndefined(cliCore) || cliCore === false) && isNullOrUndefined(azExtensionFolder)) {
        host.Message({
            Channel: Channel.Fatal,
            Text:
                '--azure-cli-extension-folder is not provided in the command line ! \nplease use --azure-cli-extension-folder=your-local-azure-cli-extensions-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example',
        });
        throw new Error('Wrong configuration, please check!');
    } else if (cliCore && isNullOrUndefined(azCoreFolder)) {
        host.Message({
            Channel: Channel.Fatal,
            Text:
                '--azure-cli-folder is not provided in the command line and you are using --target-mode=core to generate azure-cli repo command modules ! \nplease use --azure-cli-folder=your-local-azure-cli-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example',
        });
        throw new Error('Wrong configuration, please check!');
    }
    let isSdkNeeded = !cliCore;
    const generateSdk = await host.GetValue(CodeGenConstants.generateSDK);
    isSdkNeeded = isNullOrUndefined(generateSdk) ? isSdkNeeded : generateSdk === GenerateSdk.Yes;
    const compatibleLevel =
        (await host.GetValue(CodeGenConstants.compatibleLevel)) || cliCore
            ? CompatibleLevel.Track1
            : CompatibleLevel.Track2;
    const isTrack1 = compatibleLevel === CompatibleLevel.Track1;
    AzConfiguration.setValue(CodeGenConstants.isCliCore, cliCore);
    AzConfiguration.setValue(CodeGenConstants.sdkNeeded, isSdkNeeded);
    AzConfiguration.setValue(CodeGenConstants.sdkTrack1, isTrack1);
    AzConfiguration.setValue(CodeGenConstants.sdkNoFlatten, sdkNoFlatten);
}

async function processFolderPath(host: Host) {
    const options = await host.GetValue(CodeGenConstants.az);
    const extensionName = options[CodeGenConstants.extensions];
    const azOutputFolder = await host.GetValue(CodeGenConstants.azOuputFolder);
    const pythonSdkOutputFolder = await host.GetValue(CodeGenConstants.pythonSdkOutputFolder);
    let sdkFolder = pythonSdkOutputFolder.replace(azOutputFolder, '');
    if (sdkFolder.startsWith('/')) {
        sdkFolder = sdkFolder.substring(1, sdkFolder.length);
    }
    const azextFolder = sdkFolder.split('/')[0];
    if (!isNullOrUndefined(azextFolder) && azextFolder.startsWith('azext_')) {
        AzConfiguration.setValue(CodeGenConstants.azextFolder, azextFolder);
    } else {
        AzConfiguration.setValue(
            CodeGenConstants.azextFolder,
            'azext_' + extensionName.replace(/-/g, '_'),
        );
    }
    if (
        isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.sdkNeeded)) &&
        !isNullOrUndefined(options[CodeGenConstants.namespace])
    ) {
        AzConfiguration.setValue(
            CodeGenConstants.pythonNamespace,
            options[CodeGenConstants.namespace],
        );
    } else if (
        !isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.sdkNeeded)) ||
        isNullOrUndefined(options[CodeGenConstants.namespace])
    ) {
        AzConfiguration.setValue(CodeGenConstants.pythonNamespace, sdkFolder.replace(/\//g, '.'));
    }
}

async function autoDetectGenerationMode(
    host: Host,
    azextFolder: string,
    isCliCore: boolean,
): Promise<void> {
    // Verify the __init__.py in generated folder
    if (isNullOrUndefined(azextFolder)) {
        throw new Error('name should not be null');
    }
    let result: GenerationMode;
    const needClearOutputFolder = await host.GetValue(CodeGenConstants.clearOutputFolder);

    if (needClearOutputFolder) {
        result = GenerationMode.Full;
        host.Message({
            Channel: Channel.Information,
            Text:
                'As clear output folder is set, generation-mode in code model is: ' +
                GenerationMode[result],
        });
    } else {
        let azName = '';
        if (!isCliCore) {
            azName = azextFolder;
        }
        const relativePath = path.join(azName, PathConstants.initFile);
        const rootInit = await host.ReadFile(relativePath);
        const existingMode = HeaderGenerator.GetCliGenerationMode(rootInit);

        host.Message({
            Channel: Channel.Information,
            Text: 'Existing Cli code generation-mode is: ' + GenerationMode[existingMode],
        });

        // Read the argument of generation-mode, detect if needed
        const generationMode = (await host.GetValue(CodeGenConstants.generationMode)) || 'auto';
        host.Message({
            Channel: Channel.Information,
            Text: 'Input generation-mode is: ' + generationMode,
        });

        if (
            String(generationMode).toLowerCase() ===
            GenerationMode[GenerationMode.Full].toLowerCase()
        ) {
            result = GenerationMode.Full;
        } else if (
            String(generationMode).toLowerCase() ===
            GenerationMode[GenerationMode.Incremental].toLowerCase()
        ) {
            result = GenerationMode.Incremental;
        } else {
            if (existingMode === GenerationMode.Full) {
                result = GenerationMode.Full;
            } else {
                result = GenerationMode.Incremental;
            }
        }
        host.Message({
            Channel: Channel.Information,
            Text: 'generation-mode in code model is: ' + GenerationMode[result],
        });
    }
    AzConfiguration.setValue(CodeGenConstants.generationMode, result);
}
