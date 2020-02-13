/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from "mocha-typescript";
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from "@azure-tools/async-io";
import { deserialize, serialize, fail } from "@azure-tools/codegen";
import { CodeModel, codeModelSchema } from "@azure-tools/codemodel";
import { createTestSession, createPassThruSession } from './utils/test-helper';
import { AzNamer } from '../plugins/aznamer';


require('source-map-support').install();


const resources = `${__dirname}/../../src/test/resources/`;


@suite class Process {
    @test async simpleNamerTest() {

        const folders = await readdir(resources);
        for(var each of folders) {
            let cfg = {
                az:{
                    extensions:each
                }
            }
            const session = await createTestSession<CodeModel>(cfg, resources + "/" + each, [each + '-cli-common.yaml'], []);
    
            // process OAI model
            const aznamer = new AzNamer(session);
    
            // go!
            //const extensionName = "attestation";
            const codeModel = await aznamer.process();
    
            // console.log(serialize(codeModel))
            const yaml = serialize(codeModel);
            const fileName = `${__dirname}/../../src/test/resources/`+ each + "/" + each + `-az-namer.yaml`;
            const supposeFile = await readFile(fileName);
            //await (writeFile(fileName, yaml));
            //const cms = deserialize<CodeModel>(supposeFile, 'foo.yaml');
    
            assert.strictEqual(yaml, supposeFile, 'namer has failed the unit test');
        }

    }


}