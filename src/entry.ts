import * as path from 'path';
import { isNullOrUndefined } from './utils/helper';
import {
    TargetMode,
    CodeGenConstants,
    GenerateSdk,
    CompatibleLevel,
    ExtensionMode,
    GenerationMode,
    PathConstants,
    AzConfiguration,
} from './utils/models';
import { HeaderGenerator } from './generate/renders/Header';
import { Host, Channel, startSession, Session } from '@autorest/extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { serialize } from '@azure-tools/codegen';

export class Entry {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    async init() {
        const config = await this.session.getValue('');
        const azConfig = new AzConfiguration(config);
    }

    async process() {
        await this.init();
        processSimpleOption();
        processGenerationOption(this.session);
        processFolderPath();
        await autoDetectGenerationMode(
            this.session,
            AzConfiguration.getValue(CodeGenConstants.azextFolder),
            AzConfiguration.getValue(CodeGenConstants.isCliCore),
        );
        return this.codeModel;
    }
}

export async function processRequest(host: Host) {
    const debug = (await host.GetValue(CodeGenConstants.debug)) || false;

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = new Entry(session);
        const result = await plugin.process();
        host.WriteFile(CodeGenConstants.AZ_ENTRY_CODE_MODEL_NAME, serialize(result));
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}

function processSimpleOption() {
    // handling extension-mode by default it's experimental.
    let extensionMode = ExtensionMode.Experimental;
    extensionMode = AzConfiguration.getValue(CodeGenConstants.extensionMode) || extensionMode;
    AzConfiguration.setValue(CodeGenConstants.extensionMode, extensionMode);

    // handling default debug
    if (isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.debug))) {
        AzConfiguration.setValue(CodeGenConstants.debug, false);
    }

    // handling azure-cli-folder
    const azureCliFolder = AzConfiguration.getValue(CodeGenConstants.azureCliFolder);
    if (!isNullOrUndefined(azureCliFolder)) {
        AzConfiguration.setValue(CodeGenConstants.azureCliFolder, azureCliFolder);
    }

    // handle cli-core-lib
    const cliCoreLib: string = AzConfiguration.getValue(CodeGenConstants.cliCoreLib);
    if (!isNullOrUndefined(cliCoreLib) && cliCoreLib.length > 0) {
        AzConfiguration.setValue(CodeGenConstants.cliCoreLib, cliCoreLib);
    }
}

function processGenerationOption(session: Session<CodeModel>) {
    const targetMode =
        AzConfiguration.getValue(CodeGenConstants.targetMode) || TargetMode.Extension;
    const cliCore = <TargetMode>targetMode === TargetMode.Core;
    // change both core and extension mode into no flattened mode.
    let sdkFlatten = false;
    sdkFlatten = !isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.sdkFlatten))
        ? true
        : sdkFlatten;
    sdkFlatten = !isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.sdkNoFlatten))
        ? false
        : sdkFlatten;
    const sdkNoFlatten = !isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.sdkNoFlatten))
        ? true
        : !sdkFlatten;
    if (cliCore && !sdkNoFlatten) {
        session.message({
            Channel: Channel.Fatal,
            Text:
                'You have specified the --target-mode=core and --sdk-no-flatten=false at the same time. which is not a valid configuration',
        });
        throw new Error('Wrong configuration detected, please check!');
    }
    let azExtensionFolder = '';
    let azCoreFolder = '';
    if (isNullOrUndefined(cliCore) || cliCore === false) {
        azExtensionFolder = AzConfiguration.getValue(CodeGenConstants.azureCliExtFolder);
    } else {
        azCoreFolder = AzConfiguration.getValue(CodeGenConstants.azureCliFolder);
    }
    if ((isNullOrUndefined(cliCore) || cliCore === false) && isNullOrUndefined(azExtensionFolder)) {
        session.message({
            Channel: Channel.Fatal,
            Text:
                '--azure-cli-extension-folder is not provided in the command line ! \nplease use --azure-cli-extension-folder=your-local-azure-cli-extensions-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example',
        });
        throw new Error('Wrong configuration, please check!');
    } else if (cliCore && isNullOrUndefined(azCoreFolder)) {
        session.message({
            Channel: Channel.Fatal,
            Text:
                '--azure-cli-folder is not provided in the command line and you are using --target-mode=core to generate azure-cli repo command modules ! \nplease use --azure-cli-folder=your-local-azure-cli-repo instead of --output-folder now ! \nThe readme.az.md example can be found here https://github.com/Azure/autorest.az/blob/master/doc/01-authoring-azure-cli-commands.md#az-readme-example',
        });
        throw new Error('Wrong configuration, please check!');
    }
    let isSdkNeeded = !cliCore;
    const generateSdk = AzConfiguration.getValue(CodeGenConstants.generateSDK);
    isSdkNeeded = isNullOrUndefined(generateSdk) ? isSdkNeeded : generateSdk === GenerateSdk.Yes;
    let compatibleLevel = AzConfiguration.getValue(CodeGenConstants.compatibleLevel);
    compatibleLevel =
        isNullOrUndefined(compatibleLevel) && cliCore
            ? CompatibleLevel.Track1
            : CompatibleLevel.Track2;
    const isTrack1 = compatibleLevel === CompatibleLevel.Track1;
    AzConfiguration.setValue(CodeGenConstants.isCliCore, cliCore);
    AzConfiguration.setValue(CodeGenConstants.sdkNeeded, isSdkNeeded);
    AzConfiguration.setValue(CodeGenConstants.sdkTrack1, isTrack1);
    AzConfiguration.setValue(CodeGenConstants.sdkNoFlatten, sdkNoFlatten);
}

function processFolderPath() {
    const options = AzConfiguration.getValue(CodeGenConstants.az);
    const extensionName = options[CodeGenConstants.extensions];
    const azOutputFolder: string = AzConfiguration.getValue(CodeGenConstants.azOutputFolder);
    const pythonSdkOutputFolder: string = AzConfiguration.getValue(
        CodeGenConstants.pythonSdkOutputFolder,
    );
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
    if (AzConfiguration.getValue(CodeGenConstants.isCliCore)) {
        AzConfiguration.setValue(CodeGenConstants.azextFolder, '.');
    }
    if (
        !AzConfiguration.getValue(CodeGenConstants.sdkNeeded) &&
        !isNullOrUndefined(options[CodeGenConstants.namespace])
    ) {
        AzConfiguration.setValue(
            CodeGenConstants.pythonNamespace,
            options[CodeGenConstants.namespace],
        );
    } else if (
        AzConfiguration.getValue(CodeGenConstants.sdkNeeded) === true ||
        isNullOrUndefined(options[CodeGenConstants.namespace])
    ) {
        AzConfiguration.setValue(CodeGenConstants.pythonNamespace, sdkFolder.replace(/\//g, '.'));
    }
}

async function autoDetectGenerationMode(
    session: Session<CodeModel>,
    azextFolder: string,
    isCliCore: boolean,
): Promise<void> {
    // Verify the __init__.py in generated folder
    if (isNullOrUndefined(azextFolder)) {
        throw new Error('name should not be null');
    }
    let result: GenerationMode;
    const needClearOutputFolder = AzConfiguration.getValue(CodeGenConstants.clearOutputFolder);

    if (needClearOutputFolder) {
        result = GenerationMode.Full;
        session.message({
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
        const rootInit = await session.readFile(relativePath);
        const existingMode = HeaderGenerator.GetCliGenerationMode(rootInit);

        session.message({
            Channel: Channel.Information,
            Text: 'Existing Cli code generation-mode is: ' + GenerationMode[existingMode],
        });

        // Read the argument of generation-mode, detect if needed
        const generationMode = AzConfiguration.getValue(CodeGenConstants.generationMode) || 'auto';
        session.message({
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
        session.message({
            Channel: Channel.Information,
            Text: 'generation-mode in code model is: ' + GenerationMode[result],
        });
    }
    AzConfiguration.setValue(CodeGenConstants.generationMode, result);
}
