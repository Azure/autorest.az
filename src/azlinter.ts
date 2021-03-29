import { Host } from '@autorest/extension-base';
import { AzConfiguration, CodeGenConstants, PathConstants } from './utils/models';
import * as path from 'path';
import { runPython3 } from './python/setup';
import { NeedPreparers } from './generate/renders/tests/CliTestStep';

export class AzLinter {
    async process(fileName: string): Promise<void> {
        const scriptName = path.join('dist/src/python/install.py') + ' ' + fileName;
        await runPython3(scriptName);
    }
}

export async function processRequest(host: Host): Promise<void> {
    try {
        const folder = AzConfiguration.getValue(CodeGenConstants.azOutputFolder);
        const azextFolder = AzConfiguration.getValue(CodeGenConstants.azextFolder);
        const azLinter = new AzLinter();
        const fileName = path.join(
            folder,
            azextFolder,
            PathConstants.generatedFolder,
            PathConstants.commandsFile,
        );
        await azLinter.process(fileName);

        // fileName = path.join(
        //     folder,
        //     azextFolder,
        //     PathConstants.generatedFolder,
        //     PathConstants.actionFile,
        // );
        // await azLinter.process(fileName);

        if (NeedPreparers().size > 0) {
            await azLinter.process(
                path.join(
                    folder,
                    azextFolder,
                    PathConstants.testFolder,
                    PathConstants.latestFolder,
                    PathConstants.preparersFile,
                ),
            );
        }
    } catch (error) {
        console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        throw error;
    }
}
