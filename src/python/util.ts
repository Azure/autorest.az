import { spawnSync } from 'child_process';
import { delimiter, extname, isAbsolute, resolve } from 'path';
import { isFile } from '@azure-tools/async-io';

export async function updatePythonPath(command: Array<string>) {
    const detect = quoteIfNecessary('import sys; print(sys.hexversion >= 0x03060000)');
    const path = process.env[getPathVariableName()];

    const pyexe = process.env['AUTOREST_PYTHON_EXE'];
    if (pyexe) {
        command[0] = pyexe;
        return;
    }

    // detect the python interpreter.
    const py = await getFullPath('py', path);
    try {
        if (py && process.platform === 'win32') {
            // check if 'py -3' works
            if (
                spawnSync(py, ['-3', '-c', detect], { encoding: 'utf8', shell: true })
                    .stdout.toLowerCase()
                    .trim() === 'true'
            ) {
                command[0] = py;
                command.splice(1, 0, '-3');
                return;
            }
        }
    } catch {
        // no worries
    }

    const python3 = await getFullPath('python3', path);
    try {
        if (python3) {
            // check if 'python3' works
            if (
                spawnSync(python3, ['-c', detect], { encoding: 'utf8', shell: true })
                    .stdout.toLowerCase()
                    .trim() === 'true'
            ) {
                command[0] = python3;
                return;
            }
        }
    } catch {
        // no worries
    }

    const python = await getFullPath('python', path);
    try {
        if (python) {
            // check if 'python' works (ie, is a v3)

            if (
                spawnSync(python, ['-c', detect], { encoding: 'utf8', shell: true })
                    .stdout.toLowerCase()
                    .trim() === 'true'
            ) {
                command[0] = python;
                return;
            }
        }
    } catch {
        // no worries
    }

    switch (process.platform) {
        case 'win32':
            console.error(
                'Python interpreter not found -- please install from Microsoft Store or from python.org (at least 3.6)',
            );
            break;
        case 'darwin':
            console.error(
                'Python interpreter not found -- please install from homebrew (at least 3.6)',
            );
            break;
        default:
            console.error('Python interpreter not found -- please install python >= 3.6');
            break;
    }
    throw new Error('Python interpreter not available.');
}

function quoteIfNecessary(text: string): string {
    if (text && text.indexOf(' ') > -1 && text.charAt(0) != '"') {
        return `"${text}"`;
    }
    return text;
}
const nodePath = quoteIfNecessary(process.execPath);

function getPathVariableName() {
    // windows calls it's path 'Path' usually, but this is not guaranteed.
    if (process.platform === 'win32') {
        let PATH = 'Path';
        Object.keys(process.env).forEach(function (e) {
            if (e.match(/^PATH$/i)) {
                PATH = e;
            }
        });
        return PATH;
    }
    return 'PATH';
}

async function realPathWithExtension(command: string): Promise<string | undefined> {
    const pathExt = (process.env.pathext || '.EXE').split(';');
    for (const each of pathExt) {
        const filename = `${command}${each}`;
        if (await isFile(filename)) {
            return filename;
        }
    }
    return undefined;
}

async function getFullPath(command: string, searchPath?: string): Promise<string | undefined> {
    command = command.replace(/"/g, '');
    const ext = extname(command);

    if (isAbsolute(command)) {
        // if the file has an extension, or we're not on win32, and this is an actual file, use it.
        if (ext || process.platform !== 'win32') {
            if (await isFile(command)) {
                return command;
            }
        }

        // if we're on windows, look for a file with an acceptable extension.
        if (process.platform === 'win32') {
            // try all the PATHEXT extensions to see if it is a recognized program
            const cmd = await realPathWithExtension(command);
            if (cmd) {
                return cmd;
            }
        }
        return undefined;
    }

    if (searchPath) {
        const folders = searchPath.split(delimiter);
        for (const each of folders) {
            const fullPath = await getFullPath(resolve(each, command));
            if (fullPath) {
                return fullPath;
            }
        }
    }

    return undefined;
}
