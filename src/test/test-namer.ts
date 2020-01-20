/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from '@azure-tools/async-io';
import { deserialize, serialize, fail } from '@azure-tools/codegen';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { createTestSession, createPassThruSession } from './utils/test-helper';
import { AzNamer } from '../plugins/aznamer';


require('source-map-support').install();


const resources = `${__dirname}/../../src/test/resources/`;


@suite class Process {
    @test async simpleNamerTest() {
        let cfg = {
            az:{
                extensions:"attestation"
            }
        }
        const session = await createTestSession<CodeModel>(cfg, resources, ['attestation-cli-common.yaml'], []);

        // process OAI model
        const aznamer = new AzNamer(session);

        // go!
        //const extensionName = "attestation";
        const codeModel = await aznamer.process();

        // console.log(serialize(codeModel))
        const yaml = serialize(codeModel);

        const supposeFile = await readFile(`${__dirname}/../../src/test/resources/attestation-az-namer.yaml`);

        //const cms = deserialize<CodeModel>(supposeFile, 'foo.yaml');

        assert.strictEqual(yaml, supposeFile, 'namer has failed the unit test');
    }


}