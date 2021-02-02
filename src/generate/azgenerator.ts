import { Channel, Host, startSession } from '@azure-tools/autorest-extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { EOL } from 'os';
import * as path from 'path';
import { isNullOrUndefined, runLintball } from '../utils/helper';
import {
    CodeGenConstants,
    PathConstants,
    AzConfiguration,
    TargetMode,
    GenerationMode,
} from '../utils/models';
import { AzGeneratorFactory } from './generators/Factory';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { openInplaceGen, closeInplaceGen } from '../utils/inplace';

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);

        const model = new CodeModelCliImpl(session);

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
                    (AzConfiguration.getValue(CodeGenConstants.generationMode) !==
                        GenerationMode.Incremental &&
                        (f.endsWith('azext_metadata.json') ||
                            (f.endsWith('setup.py') &&
                                AzConfiguration.getValue(CodeGenConstants.targetMode) !==
                                    TargetMode.Core))) ||
                    f.endsWith('HISTORY.rst') ||
                    f.endsWith('setup.cfg') ||
                    // f.endsWith('report.md') ||
                    f.endsWith('tests/__init__.py') ||
                    f.endsWith('preparers.py') ||
                    f.endsWith('commands.py')
                ) {
                    host.WriteFile(f, files[f]);
                } else {
                    host.WriteFile(f, files[f].join(EOL));
                }
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
