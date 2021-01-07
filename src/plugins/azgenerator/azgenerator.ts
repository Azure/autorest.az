import { Channel, Host, startSession } from '@azure-tools/autorest-extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../../utils/helper';
import { ArgumentConstants, GenerationMode, PathConstants } from '../models';
import { AzGeneratorFactory } from './AzGeneratorFactory';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { HeaderGenerator } from './Header';
import { openInplaceGen, closeInplaceGen } from '../../utils/inplace';

export async function processRequest(host: Host) {
    const debug = (await host.GetValue('debug')) || false;
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const azureCliFolder = await host.GetValue(ArgumentConstants.azureCliFolder);
        if (!isNullOrUndefined(azureCliFolder)) {
            if (isNullOrUndefined(session.model.language['az'])) {
                session.model.language['az'] = {};
            }
            session.model.language['az'].azureCliFolder = azureCliFolder;
        }

        const azOutputFolder = await host.GetValue('az-output-folder');
        session.model.language['az'].azOutputFolder = azOutputFolder;
        const model = new CodeModelCliImpl(session);
        const cliCoreLib: string = await host.GetValue('cli-core-lib');
        if (!isNullOrUndefined(cliCoreLib) && cliCoreLib.length > 0) {
            model.CliCoreLib = cliCoreLib;
        }

        if (model.SelectFirstExtension()) {
            do {
                const azextpath = path.join(model.azOutputFolder, model.AzextFolder);
                session.protectFiles(path.join(azextpath, 'manual'));
                session.protectFiles(path.join(azextpath, 'tests/latest/recordings'));
                session.protectFiles(path.join(model.azOutputFolder, 'README.md'));
            } while (model.SelectNextExtension());
        }
        // Read existing file generation-mode
        model.CliGenerationMode = await autoDetectGenerationMode(
            host,
            model.AzextFolder,
            model.IsCliCore,
        );
        model.CliOutputFolder = azOutputFolder;

        openInplaceGen();
        const generator = await AzGeneratorFactory.createAzGenerator(model, debug);
        await generator.generateAll();
        const files = generator.files;

        // Remove the README.md from the write file list if it is exists
        const notGeneratedFileifExist: Array<string> = ['README.md'];
        for (const entry of notGeneratedFileifExist) {
            const exist = await host.ReadFile(entry);
            if (exist) {
                delete files[entry];
            }
        }

        for (const f in files) {
            if (!isNullOrUndefined(files[f])) {
                host.WriteFile(f, files[f].join(EOL));
            }
        }
        closeInplaceGen();
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }
}

async function autoDetectGenerationMode(
    host: Host,
    azextFolder: string,
    isCliCore: boolean,
): Promise<GenerationMode> {
    // Verify the __init__.py in generated folder
    if (isNullOrUndefined(azextFolder)) {
        throw new Error('name should not be null');
    }
    let result: GenerationMode;
    const needClearOutputFolder = await host.GetValue(ArgumentConstants.clearOutputFolder);

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
        const generationMode = (await host.GetValue(ArgumentConstants.generationMode)) || 'auto';
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
    return result;
}
