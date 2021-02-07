import { Host } from '@azure-tools/autorest-extension-base';
import { AzConfiguration, CodeGenConstants, PathConstants } from './utils/models';
import * as path from 'path';

import runPython3 from '../python/setup';

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
        runPython3('python/install.py ' + fileName);
    } catch (error) {
        console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        throw error;
    }
}
