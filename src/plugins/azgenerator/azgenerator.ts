import { Channel, Host, startSession } from '@azure-tools/autorest-extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { EOL } from "os";
import * as path from 'path';
import { isNullOrUndefined } from 'util';
import { ArgumentConstants, GenerationMode, PathConstants } from "../models";
import { AzGeneratorFactory } from "./AzGeneratorFactory";
import { CodeModelCliImpl } from "./CodeModelAzImpl";
import { HeaderGenerator } from './Header';

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const azureCliFolder = await host.GetValue(ArgumentConstants.azureCliFolder);
        if (!isNullOrUndefined(azureCliFolder)) {
            if (isNullOrUndefined(session.model.language['az'])) {
                session.model.language['az'] = {}
            }
            session.model.language['az']['azureCliFolder'] = azureCliFolder;
        }

        const azOutputFolder = await host.GetValue('az-output-folder');
        session.model.language['az']['azOutputFolder'] = azOutputFolder;
        let model = new CodeModelCliImpl(session);
        const cliCoreLib: string = await host.GetValue('cli-core-lib');
        if (!isNullOrUndefined(cliCoreLib) && cliCoreLib.length > 0) {
            model.CliCoreLib = cliCoreLib;
        }

        // Read existing file generation-mode
        let options = await session.getValue('az');
        model.CliGenerationMode = await autoDetectGenerationMode(host, options['extensions'], model.IsCliCore);
        model.CliOutputFolder = azOutputFolder;

        let generator = await AzGeneratorFactory.createAzGenerator(model, debug);
        await generator.generateAll();
        let files = generator.files;

        if (model.SelectFirstExtension()) {
            do {
                let path = "azext_" + model.Extension_Name.replace("-", "_") + "/";
                session.protectFiles(path + "manual");
                session.protectFiles(path + "tests/latest/recordings")
            } while (model.SelectNextExtension());
        }

        // Remove the README.md from the write file list if it is exists
        let notGeneratedFileifExist: Array<string> = ["README.md"];
        for (let entry of notGeneratedFileifExist) {
            let exist = await host.ReadFile(entry);
            if (exist) {
                delete files[entry];
            }
        }

        for (let f in files) {
            host.WriteFile(f, files[f].join(EOL));
        }
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }
}

async function autoDetectGenerationMode(host: Host, name: string, isCliCore: boolean): Promise<GenerationMode> {
    // Verify the __init__.py in generated folder
    if (isNullOrUndefined(name)) {
        throw new Error("name should not be null");
    }
    let result: GenerationMode;
    const needClearOutputFolder = await host.GetValue(ArgumentConstants.clearOutputFolder);

    if (needClearOutputFolder) {
        result = GenerationMode.Full;
        host.Message({ Channel: Channel.Information, Text: "As clear output folder is set, generation-mode in code model is: " + GenerationMode[result] });
    }
    else {
        let azName: string = "";
        if (!isCliCore) {
            azName = "azext_" + name.replace("-", "_");
        }
        let relativePath = path.join(azName, PathConstants.initFile);
        let rootInit = await host.ReadFile(relativePath);
        let existingMode = HeaderGenerator.GetCliGenerationMode(rootInit);

        host.Message({ Channel: Channel.Information, Text: "Existing Cli code generation-mode is: " + GenerationMode[existingMode] });

        // Read the argument of generation-mode, detect if needed
        let generationMode = await host.GetValue(ArgumentConstants.generationMode) || "auto";
        host.Message({ Channel: Channel.Information, Text: "Input generation-mode is: " + generationMode });

        if (String(generationMode).toLowerCase() == GenerationMode[GenerationMode.Full].toLowerCase()) {
            result = GenerationMode.Full;
        }
        else if (String(generationMode).toLowerCase() == GenerationMode[GenerationMode.Incremental].toLowerCase()) {
            result = GenerationMode.Incremental;
        }
        else {
            if (existingMode == GenerationMode.Full) {
                result = GenerationMode.Full;
            }
            else {
                result = GenerationMode.Incremental;
            }
        }
        host.Message({ Channel: Channel.Information, Text: "generation-mode in code model is: " + GenerationMode[result] });
    }
    return result;
}