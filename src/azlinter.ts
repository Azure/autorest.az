import { Host } from '@azure-tools/autorest-extension-base';
import { AzConfiguration, CodeGenConstants, PathConstants } from './utils/models';
import * as path from 'path';
import { runLintball } from './utils/helper';

export async function processRequest(host: Host): Promise<void> {
    try {
        const folder = await host.GetValue(CodeGenConstants.azOutputFolder);
        const azextFolder = AzConfiguration.getValue(CodeGenConstants.azextFolder);
        const fileName = path.join(
            folder,
            azextFolder,
            PathConstants.generatedFolder,
            PathConstants.commandsFile,
        );
        await runLintball(fileName);
        return;
    } catch (error) {
        console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        throw error;
    }
}
