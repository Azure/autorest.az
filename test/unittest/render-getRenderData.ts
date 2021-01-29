/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import * as path from 'path';
import { readFile } from '@azure-tools/async-io';
import { SchemaType } from '@azure-tools/codemodel';
import * as sourceMapSupport from 'source-map-support';
import { CodeModelTypes, DataGraph, RenderInput, SortOrder } from '../../src/utils/models';
import { isNullOrUndefined } from '../../src/utils/helper';
import { RenderDataBase } from './render-getRenderDataBase';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../../test/unittest/');

const fileName = 'offazure-az-modifier-after.yaml';

@suite
export class Process extends RenderDataBase {
    getRenderTestData(dependencies: DataGraph, arrayOutputFormat = false) {
        const data = {
            model: {},
        };

        const converter = (item) => {
            let mapsTo = item['mapsTo'];
            if (isNullOrUndefined(mapsTo)) {
                return undefined;
            }
            if (mapsTo.endsWith('_')) {
                mapsTo = mapsTo.substr(0, mapsTo.length - 1);
            }
            item['mapsTo'] = mapsTo.replace(/_/g, '-');
            return item;
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            ['extension', new RenderInput(['name'], { name: SortOrder.ASEC })],
            ['commandGroup', new RenderInput(['name', 'cliKey'], { name: SortOrder.ASEC })],
            ['command', new RenderInput(['name'])],
            ['method', new RenderInput(['nameAz', 'cliKey'], { nameAz: SortOrder.ASEC })],
            [
                'methodParameter',
                new RenderInput(
                    ['mapsTo', 'type', 'description', 'cliKey'],
                    {},
                    [
                        ['isFlattened', true],
                        ['type', SchemaType.Constant],
                        ['isPolyOfSimple', true],
                        ['isDiscriminator', true],
                    ],
                    converter,
                ),
            ],
            ['azExample', new RenderInput(['commandStringItems'], {})],
        ]);

        if (arrayOutputFormat) {
            data.model = this.model.getArrayModelData('extension', inputProperties, dependencies);
        } else {
            data.model = this.model.getModelData('extension', inputProperties, dependencies);
        }
        return data;
    }

    @test(slow(600000), timeout(1500000)) async getModelDataTest1() {
        await super.init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/command-groups.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[['extension', 'commandGroup']];
        const data = this.getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to commandGroup ',
        );
    }

    @test(slow(600000), timeout(1500000)) async getModelDataTest2() {
        await super.init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/commands.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        const data = this.getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to command ',
        );
    }

    @test(slow(600000), timeout(1500000)) async getModelDataTest3() {
        await super.init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/methods.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
        ];
        const data = this.getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to method ',
        );
    }

    @test(slow(600000), timeout(1500000)) async getModelDataTest4() {
        await super.init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/method-parameters.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
        ];
        const data = this.getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    }

    @test(slow(600000), timeout(1500000)) async getModelDataTest5() {
        await super.init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/methods-array.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            // ['method', 'methodParameter'],
        ];
        const data = this.getRenderTestData(dependencies, true);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    }

    @test(slow(600000), timeout(1500000)) async getModelDataTest6() {
        await super.init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(
                path.join(resources, 'expected', 'data/method-parameters-az-examples.json'),
            ),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
            ['method', 'azExample'],
        ];
        const data = this.getRenderTestData(dependencies);
        // console.log(JSON.stringify(data));
        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    }

    @test(slow(600000), timeout(1500000)) async testConverter() {
        const converter = (item) => {
            let mapsTo = item['mapsTo'];
            if (isNullOrUndefined(mapsTo)) {
                return undefined;
            }
            if (mapsTo.endsWith('_')) {
                mapsTo = mapsTo.substr(0, mapsTo.length - 1);
            }
            item['mapsTo'] = mapsTo.replace(/_/g, '-');
            return item;
        };
        const item = {
            mapsTo: 'converter_test_',
        };
        const data = converter(item);
        assert.deepStrictEqual(data, { mapsTo: 'converter-test' }, 'testConverter error!');
    }
}
