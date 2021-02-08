import * as cp from 'child_process';
import { updatePythonPath } from './util';

export async function runPython3(scriptName, debug = '') {
    const command = ['python', scriptName, debug];
    console.log(command);
    updatePythonPath(command);
    cp.execSync(command.join(' '), {
        stdio: [0, 1, 2],
    });
}

runPython3(process.argv[2], ...process.argv.slice(3)).catch((err) => {
    const error = err.toString();

    // Python script errors are already written out via stderr so don't
    // write them twice.  Write out all other errors to stderr.
    if (!error.startsWith('Error: Command failed')) {
        console.error(error);
    }
    process.exit(1);
});
