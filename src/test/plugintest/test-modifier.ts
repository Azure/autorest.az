/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from '@azure-tools/async-io';
import { deserialize, serialize, fail } from '@azure-tools/codegen';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { createTestSession } from '../utils/test-helper';
import { Modifiers } from '../../plugins/modifiers';


require('source-map-support').install();


const resources = `${__dirname}/../../test/resources`;
const supposes = `${__dirname}/../../test/supposes`;


@suite class Process {
    @test async 'simple model test'() {
        const session = await createTestSession<CodeModel>({}, resources, ['input2.yaml'], ['output1.yaml']);

        // process OAI model
        const modeler = new Modifiers(session);

        // go!
        const codeModel = await modeler.process();

        // console.log(serialize(codeModel))
        const yaml = serialize(codeModel, codeModelSchema);

        //await (writeFile(`${__dirname}/../../output.yaml`, yaml));

        const cms = deserialize<CodeModel>(yaml, 'foo.yaml', codeModelSchema);

        assert.strictEqual(true, cms instanceof CodeModel, 'Type Info is maintained in deserialization.');
    }
}