/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from '@azure-tools/async-io';
import { deserialize, serialize, fail } from '@azure-tools/codegen';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { createTestSession } from './utils/test-helper';
import { Modifiers } from '../plugins/modifiers';


require('source-map-support').install();


const resources = `${__dirname}/../../src/test/resources`;


@suite class Process {
    @test async simpleModifierTest() {
        let cfg = {
            az:{
                extensions:"attestation"
            },
            directive:[
                {
                    where:{
                        command:"attestation operations list"
                    },
                    set:{
                        command:"attestation list"
                    }
                }
            ]
        }
        const session = await createTestSession<CodeModel>(cfg, resources, ['attestation-az-namer.yaml'], []);

        // process OAI model
        const modeler = new Modifiers(session);

        // go!
        const codeModel = await modeler.process();

        // console.log(serialize(codeModel))
        const yaml = serialize(codeModel);
        //await (writeFile(`${__dirname}/../../src/test/resources/attestation-az-modifier.yaml`, yaml));
        const supposeFile = await readFile(`${__dirname}/../../src/test/resources/attestation-az-modifier.yaml`);

        //const cms = deserialize<CodeModel>(yaml, 'foo.yaml');

        assert.strictEqual(yaml, supposeFile, 'namer has failed the unit test');
    }
}