import { Host } from '@azure-tools/autorest-extension-base';
import { AzConfiguration, CodeGenConstants, PathConstants } from './utils/models';
import * as path from 'path';
import { runLintball } from './utils/helper';

export async function processRequest(host: Host) {
    try {
        const folder = await host.GetValue(CodeGenConstants.azOutputFolder);
        const azextFolder = AzConfiguration.getValue(CodeGenConstants.azextFolder);
        let fileName = path.join(
            folder,
            azextFolder,
            PathConstants.generatedFolder,
            PathConstants.commandsFile,
        );
        if (AzConfiguration.getValue(CodeGenConstants.isCliCore)) {
            fileName = path.join(folder, PathConstants.generatedFolder, PathConstants.commandsFile);
        }
        await runLintball(fileName);
        return;
    } catch (E) {
        console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        throw E;
    }
}
