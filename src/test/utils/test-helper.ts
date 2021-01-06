/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from '@azure-tools/async-io';
import { deserialize, fail } from '@azure-tools/codegen';
import { startSession, Session } from '@azure-tools/autorest-extension-base';
import { values } from '@azure-tools/linq';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

export async function readData(
    folder: string,
    ...files: Array<string>
): Promise<Array<{ model: any; filename: string; content: string }>> {
    const results = [];
    for (const filename of files) {
        const content = await readFile(`${folder}/${filename}`);
        const model = deserialize<any>(content, filename);
        results.push({
            model,
            filename,
            content,
        });
    }
    return results;
}

export async function cts<TInputModel>(
    config: unknown,
    filename: string,
    content: string,
): Promise<Session<TInputModel>> {
    const ii = [
        {
            model: deserialize<unknown>(content, filename),
            filename,
            content,
        },
    ];

    return await startSession<TInputModel>({
        ReadFile: async (filename: string): Promise<string> =>
            (
                values(ii).first((each) => each.filename === filename) ||
                fail(`missing input '${filename}'`)
            ).content,
        GetValue: async (key: string): Promise<unknown> => {
            if (!key) {
                return config;
            }
            return config[key];
        },
        ListInputs: async (artifactType?: string): Promise<Array<string>> =>
            ii.map((each) => each.filename),

        ProtectFiles: async (path: string): Promise<void> => {
            // test
        },
        WriteFile: (
            filename: string,
            content: string,
            sourceMap?: any,
            artifactType?: string,
        ): void => {
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

export async function createTestSession<TInputModel>(
    config: unknown,
    folder: string,
    inputs: Array<string>,
): Promise<Session<TInputModel>> {
    const ii = await readData(folder, ...inputs);

    return await startSession<TInputModel>({
        ReadFile: async (filename: string): Promise<string> =>
            (
                values(ii).first((each) => each.filename === filename) ||
                fail(`missing input '${filename}'`)
            ).content,
        GetValue: async (key: string): Promise<unknown> => {
            if (!key) {
                return config;
            }
            return config[key];
        },
        ListInputs: async (artifactType?: string): Promise<Array<string>> =>
            ii.map((each) => each.filename),

        ProtectFiles: async (path: string): Promise<void> => {
            // test
        },
        WriteFile: (
            filename: string,
            content: string,
            sourceMap?: any,
            artifactType?: string,
        ): void => {
            // test
        },
        Message: (message: unknown): void => {
            // test
            console.error(message);
        },
        UpdateConfigurationFile: (filename: string, content: string): void => {
            // test
        },
        GetConfigurationFile: async (filename: string): Promise<string> => '',
    });
}

export async function createPassThruSession(
    config: unknown,
    input: string,
    inputArtifactType: string,
): Promise<Session<CodeModel>> {
    return await startSession<CodeModel>(
        {
            ReadFile: async (filename: string): Promise<string> => input,
            GetValue: async (key: string): Promise<unknown> => {
                if (!key) {
                    return config;
                }
                return config[key];
            },
            ListInputs: async (artifactType?: string): Promise<Array<string>> => [
                inputArtifactType,
            ],

            ProtectFiles: async (path: string): Promise<void> => {
                // test
            },
            WriteFile: (
                filename: string,
                content: string,
                sourceMap?: unknown,
                artifactType?: string,
            ): void => {
                // test
            },
            Message: (message: unknown): void => {
                // test
                console.error(message);
            },
            UpdateConfigurationFile: (filename: string, content: string): void => {
                // test
            },
            GetConfigurationFile: async (filename: string): Promise<string> => '',
        },
        {},
        codeModelSchema,
    );
}
