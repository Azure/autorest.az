import * as cp from 'child_process';
import * as extension from '@azure-tools/extension';

export async function runPython3(scriptName, debug = '') {
    const command = ['python', scriptName, debug];
    extension.updatePythonPath(command);
    const commandScript = command.join(' ');
    cp.execSync(commandScript);
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
