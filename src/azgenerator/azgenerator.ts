import { Host, startSession } from '@azure-tools/autorest-extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined } from '../utils/helper';
import { CodeGenConstants, PathConstants, AzConfiguration } from '../utils/models';
import { AzGeneratorFactory } from './AzGeneratorFactory';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { openInplaceGen, closeInplaceGen } from '../utils/inplace';
import { CLIModule } from './climodels/CLIModule';

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);

        const model = new CodeModelCliImpl(session);

        const cliModule = model.CreateCliModule();

        cliModule.render();

        if (model.SelectFirstExtension()) {
            do {
                const azextpath = path.join(model.azOutputFolder, model.AzextFolder);
                session.protectFiles(path.join(azextpath, PathConstants.manualFolder));
                session.protectFiles(
                    path.join(
                        azextpath,
                        PathConstants.testFolder,
                        PathConstants.latestFolder,
                        PathConstants.recordingFolder,
                    ),
                );
                session.protectFiles(path.join(model.azOutputFolder, PathConstants.readmeFile));
            } while (model.SelectNextExtension());
        }

        openInplaceGen();
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
            if (!isNullOrUndefined(files[f])) {
                if (
                    f.endsWith('HISTORY.rst') ||
                    f.endsWith('azext_metadata.json') ||
                    f.endsWith('setup.cfg') ||
                    f.endsWith('setup.py')
                ) {
                    host.WriteFile(f, files[f]);
                } else {
                    host.WriteFile(f, files[f].join(EOL));
                }
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
