/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as path from 'path';
import { readFile, readdir, writeFile } from '@azure-tools/async-io';
import { deserialize, serialize } from '@azure-tools/codegen';
import { CodeModel } from '@azure-tools/codemodel';
import { createTestSession } from './utils/test-helper';
import { Modifiers } from '../src/modifiers';
import * as sourceMapSupport from 'source-map-support';
import { Entry } from '../src/entry';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../test/resources');

describe('simpleModifierTest', () => {
    it('simpleModifierTestCase1', async () => {
        const folders = await readdir(resources);
        for (const each of folders) {
            const cfg = {
                az: {
                    extensions: each,
                },
                directive: [
                    {
                        where: {
                            command: each + ' operations list',
                        },
                        set: {
                            command: each + ' list',
                        },
                    },
                ],
            };
            const session = await createTestSession<CodeModel>(cfg, resources + '/' + each, [
                each + '-az-namer.yaml',
            ]);

            const entry = new Entry(session);
            await entry.init();

            // process OAI model
            const modeler = new Modifiers(session);

            // go!
            const codeModel = await modeler.process();

            const fileName = path.join(
                `${__dirname}`,
                '/../test/resources/' + each + '/' + each + '-az-modifier.yaml',
            );

            // uncomment this line to overwrite existing file
            await writeFile(fileName, serialize(codeModel));

            // const supposeFile = await readFile(fileName);

            // const codeModelSupposed = deserialize<CodeModel>(supposeFile, fileName);
            // assert.deepEqual(codeModel, codeModelSupposed, 'modifier has failed the unit test');
        }
    });
});
