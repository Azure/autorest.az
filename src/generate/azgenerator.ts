import { Host, startSession } from '@autorest/extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { EOL } from 'os';
import * as path from 'path';
import { CodeGenConstants, PathConstants, AzConfiguration } from '../utils/models';
import { AzGeneratorFactory } from './generators/Factory';
import { CodeModelCliImpl } from './codemodel/CodeModelAzImpl';
import { openInplaceGen, closeInplaceGen } from '../utils/inplace';

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);

        const model = new CodeModelCliImpl(session);
        const { configHandler } = model.GetHandler();

        if (model.SelectFirstExtension()) {
            do {
                const azextpath = path.join(
                    configHandler.azOutputFolder,
                    configHandler.AzextFolder,
                );
                session.protectFiles(path.join(azextpath, PathConstants.manualFolder));
                session.protectFiles(
                    path.join(
                        azextpath,
                        PathConstants.testFolder,
                        PathConstants.latestFolder,
                        PathConstants.recordingFolder,
                    ),
                );
                session.protectFiles(
                    path.join(configHandler.azOutputFolder, PathConstants.readmeFile),
                );
            } while (model.SelectNextExtension());
        }

        openInplaceGen();
        await model.GetResourcePool().loadTestResources();
        model.GenerateTestInit();
        const generator = AzGeneratorFactory.createAzGenerator(model);
        await generator.generateAll();
        const files = generator.files;

        // Remove the README.md from the write file list if it is exists
        const notGeneratedFileifExist: Array<string> = [PathConstants.readmeFile];
        for (const entry of notGeneratedFileifExist) {
            const exist = await host.ReadFile(entry);
            if (exist) {
                delete files[entry];
            }
        }

        for (const f in files) {
            if (typeof files[f] === 'string') {
                host.WriteFile(f, files[f]);
            } else {
                host.WriteFile(f, files[f].join(EOL));
            }
        }
        closeInplaceGen();
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}
