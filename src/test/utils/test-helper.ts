import { readFile, writeFile, readdir, mkdir } from '@azure-tools/async-io';
import { deserialize, serialize, fail } from '@azure-tools/codegen';
import { startSession } from '@azure-tools/autorest-extension-base';
import { values } from '@azure-tools/linq';
import { CodeModel } from '@azure-tools/codemodel';
import { codeModelSchema } from '@azure-tools/codemodel';


require('source-map-support').install();


export async function readData(folder: string, ...files: Array<string>): Promise<Array<{ model: any; filename: string; content: string }>> {
    const results = [];
    for (const filename of files) {
        const content = await readFile(`${folder}/${filename}`);
        const model = deserialize<any>(content, filename);
        results.push({
            model,
            filename,
            content
        });
    }
    return results;
}

export async function cts<TInputModel>(config: any, filename: string, content: string) {
    const ii = [{
        model: deserialize<any>(content, filename),
        filename,
        content
    }];

    return await startSession<TInputModel>({
        ReadFile: async (filename: string): Promise<string> => (values(ii).first(each => each.filename === filename) || fail(`missing input '${filename}'`)).content,
        GetValue: async (key: string): Promise<any> => {
            if (!key) {
                return config;
            }
            return config[key];
        },
        ListInputs: async (artifactType?: string): Promise<Array<string>> => ii.map(each => each.filename),

        ProtectFiles: async (path: string): Promise<void> => {
            // test 
        },
        WriteFile: (filename: string, content: string, sourceMap?: any, artifactType?: string): void => {
            // test 
        },
        Message: (message: any): void => {
            // test 
            console.error(message);
        },
        UpdateConfigurationFile: (filename: string, content: string): void => {
            // test 
        },
        GetConfigurationFile: async (filename: string): Promise<string> => '',
    });
}

export async function createTestSession<TInputModel>(config: any, folder: string, inputs: Array<string>, outputs: Array<string>) {
    const ii = await readData(folder, ...inputs);
    const oo = await readData(folder, ...outputs);

    return await startSession<TInputModel>({
        ReadFile: async (filename: string): Promise<string> => (values(ii).first(each => each.filename === filename) || fail(`missing input '${filename}'`)).content,
        GetValue: async (key: string): Promise<any> => {
            if (!key) {
                return config;
            }
            return config[key];
        },
        ListInputs: async (artifactType?: string): Promise<Array<string>> => ii.map(each => each.filename),

        ProtectFiles: async (path: string): Promise<void> => {
            // test 
        },
        WriteFile: (filename: string, content: string, sourceMap?: any, artifactType?: string): void => {
            // test 
        },
        Message: (message: any): void => {
            // test 
            console.error(message);
        },
        UpdateConfigurationFile: (filename: string, content: string): void => {
            // test 
        },
        GetConfigurationFile: async (filename: string): Promise<string> => '',
    });
}

export async function createPassThruSession(config: any, input: string, inputArtifactType: string) {
    return await startSession<CodeModel>({
        ReadFile: async (filename: string): Promise<string> => input,
        GetValue: async (key: string): Promise<any> => {
            if (!key) {
                return config;
            }
            return config[key];
        },
        ListInputs: async (artifactType?: string): Promise<Array<string>> => [inputArtifactType],

        ProtectFiles: async (path: string): Promise<void> => {
            // test 
        },
        WriteFile: (filename: string, content: string, sourceMap?: any, artifactType?: string): void => {
            // test 
        },
        Message: (message: any): void => {
            // test 
            console.error(message);
        },
        UpdateConfigurationFile: (filename: string, content: string): void => {
            // test 
        },
        GetConfigurationFile: async (filename: string): Promise<string> => '',
    }, {}, codeModelSchema);
}