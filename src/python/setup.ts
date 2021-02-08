import * as cp from 'child_process';
import { isNullOrUndefined } from '../utils/helper';
import * as extension from '@azure-tools/extension';

export async function runPython3(scriptName, debug = '') {
    const command = ['python', scriptName, debug];
    await extension.updatePythonPath(command);
    const commandScript = command.join(' ');
    return await new Promise<boolean>((resolve, reject) => {
        cp.exec(commandScript, function (error) {
            if (!isNullOrUndefined(error)) {
                console.log(error.message);
                console.log(error.stack);
                console.log('exec error: ' + error);
                // Reject if there is an error:
                return reject(false);
            }
            // Otherwise resolve the promise:
            return resolve(true);
        });
    });
}

if (require.main === module) {
    runPython3(process.argv.slice(2)).catch((err) => {
        const error = err.toString();
        // Python script errors are already written out via stderr so don't
        // write them twice.  Write out all other errors to stderr.
        if (!error.startsWith('Error: Command failed')) {
            console.error(error);
        }
        process.exit(1);
    });
}
