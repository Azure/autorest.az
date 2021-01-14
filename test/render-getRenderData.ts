/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import * as path from 'path';
import { readFile, readdir } from '@azure-tools/async-io';
import { deserialize } from '@azure-tools/codegen';
import { CodeModel } from '@azure-tools/codemodel';
import { createTestSession } from './utils/test-helper';
import { Modifiers } from '../src/plugins/modifiers';
import * as sourceMapSupport from 'source-map-support';
import { Entry } from '../src/plugins/entry';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../test/resources');

@suite
export class Process {
    @test(slow(600000), timeout(1500000)) async getRenderDataTest() {
        const folders = await readdir(resources);
        for (const each of folders) {
            const cfg = {
                az: {
                    extensions: each,
                },
            };
            const session = await createTestSession<CodeModel>(cfg, resources + '/' + each, [
                each + '-az-modifier-after.yaml',
            ]);

            const entry = new Entry(session);
            await entry.init();

            // uncomment this line to overwrite existing file
            // await (writeFile(fileName, serialize(codeModel)));
        }
    }
}
