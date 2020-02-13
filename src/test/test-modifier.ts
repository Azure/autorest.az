/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from "@azure-tools/async-io";
import { deserialize, serialize, fail } from "@azure-tools/codegen";
import { CodeModel, codeModelSchema } from "@azure-tools/codemodel";
import { createTestSession } from "./utils/test-helper";
import { Modifiers } from '../plugins/modifiers';


require('source-map-support').install();


const resources = `${__dirname}/../../src/test/resources`;


@suite class Process {
    @test async simpleModifierTest() {
        const folders = await readdir(resources);
        for(var each of folders) {
            let cfg = {
                az:{
                    extensions:each
                },
                directive:[
                    {
                        where:{
                            command: each + " operations list"
                        },
                        set:{
                            command: each + " list"
                        }
                    }
                ]
            }
            const session = await createTestSession<CodeModel>(cfg, resources+ "/" + each, [each + '-az-namer.yaml'], []);

            // process OAI model
            const modeler = new Modifiers(session);

            // go!
            const codeModel = await modeler.process();

            // console.log(serialize(codeModel))
            const yaml = serialize(codeModel);
            const fileName = `${__dirname}/../../src/test/resources/` + each + "/" + each + `-az-modifier.yaml`;
            //await (writeFile(fileName, yaml));
            const supposeFile = await readFile(fileName);

            //const cms = deserialize<CodeModel>(yaml, 'foo.yaml');

            assert.strictEqual(yaml, supposeFile, 'namer has failed the unit test');
        }
    }
}