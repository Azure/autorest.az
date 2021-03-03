/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import * as assert from 'assert';
import { readFile, readdir, writeFile } from '@azure-tools/async-io';
import { deserialize, serialize } from '@azure-tools/codegen';
import { CodeModel } from '@azure-tools/codemodel';
import { createTestSession } from './utils/test-helper';
import { AzNamer } from '../src/aznamer';
import { Entry } from '../src/entry';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../test/resources/');

describe('simpleNamerTest', () => {
    it('simpleNamerTestCase1', async () => {
        const folders = await readdir(resources);
        for (const each of folders) {
            const cfg = {
                'azure-cli-extension-folder': true,
                az: {
                    extensions: each,
                },
            };
            const session = await createTestSession<CodeModel>(cfg, resources + '/' + each, [
                each + '-cli-common.yaml',
            ]);

            const entry = new Entry(session);
            await entry.init();

            // process OAI model
            const aznamer = new AzNamer(session);

            // go!
            // const extensionName = "attestation";
            const codeModel = await aznamer.process();

            // console.log(serialize(codeModel))
            const fileName = path.join(
                `${__dirname}`,
                '/../test/resources/' + each + '/' + each + '-az-namer.yaml',
            );

            // uncomment this line to overwrite existing file
            // await writeFile(fileName, serialize(codeModel));

            const supposeFile = await readFile(fileName);

            const codeModelSupposed = deserialize<CodeModel>(supposeFile, fileName);
            assert.deepEqual(codeModel, codeModelSupposed, 'namer has failed the unit test');
        }
    });
});
