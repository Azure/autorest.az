import { Host } from '@autorest/extension-base';
import { AzConfiguration, CodeGenConstants, PathConstants } from './utils/models';
import * as path from 'path';
import { runPython3 } from './python/setup';

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
        const fileName = path.join(
            folder,
            azextFolder,
            PathConstants.generatedFolder,
            PathConstants.commandsFile,
        );
        const azLinter = new AzLinter();
        await azLinter.process(fileName);
    } catch (error) {
        console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        throw error;
    }
}
