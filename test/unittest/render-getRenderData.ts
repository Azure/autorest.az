/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { readFile } from '@azure-tools/async-io';
import { CodeModel, SchemaType } from '@azure-tools/codemodel';
import * as sourceMapSupport from 'source-map-support';
import { CodeModelTypes, DataGraph, RenderInput, SortOrder } from '../../src/utils/models';
import { Entry } from '../../src/entry';
import { CodeModelCliImpl } from '../../src/generate/CodeModelAzImpl';
import { isNullOrUndefined } from '../../src/utils/helper';
import { createTestSession } from '../utils/test-helper';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../test/unittest/');

const fileName = 'offazure-az-modifier-after.yaml';

describe('RenderSetupPy', () => {
    let model: CodeModelCliImpl;
    async function init(extensionName: string, fileName: string): Promise<void> {
        const cfg = {
            az: {
                extensions: extensionName,
            },
        };
        if (!fs.existsSync(path.join(resources, 'input', fileName))) {
            throw Error;
        }
        const session = await createTestSession<CodeModel>(cfg, path.join(resources, 'input'), [
            fileName,
        ]);

        const entry = new Entry(session);
        await entry.init();

        const codeModel = new CodeModelCliImpl(session);
        codeModel.GenerateTestInit();

        model = codeModel;
    }

    function getRenderTestData(dependencies: DataGraph, arrayOutputFormat = false) {
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
            ['azExample', new RenderInput(['commandStringItems'], {}, [['isGenerated', false]])],
        ]);

        if (arrayOutputFormat) {
            data.model = model.getArrayModelData('extension', inputProperties, dependencies);
        } else {
            data.model = model.getModelData('extension', inputProperties, dependencies);
        }
        return data;
    }

    const originalWarn = console.warn.bind(console.warn);
    beforeAll(() => {
        console.warn = (msg) => msg.toString().includes('ShowInTest') && originalWarn(msg);
    });
    afterAll(() => {
        console.warn = originalWarn;
    });

    it('getModelDataTest1', async () => {
        await init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/command-groups.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[['extension', 'commandGroup']];
        const data = getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to commandGroup ',
        );
    });

    it('getModelDataTest2', async () => {
        await init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/commands.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        const data = getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to command ',
        );
    });

    it('getModelDataTest3', async () => {
        await init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/methods.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
        ];
        const data = getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to method ',
        );
    });

    it('getModelDataTest4', async () => {
        await init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/method-parameters.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            ['method', 'methodParameter'],
        ];
        const data = getRenderTestData(dependencies);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    });

    it('getModelDataTest5', async () => {
        await init('offazure', fileName);
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/methods-array.json')),
        );
        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
            ['command', 'method'],
            // ['method', 'methodParameter'],
        ];
        const data = getRenderTestData(dependencies, true);

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    });

    it('getModelDataTest6', async () => {
        await init('offazure', fileName);
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
        const data = getRenderTestData(dependencies);
        // console.log(JSON.stringify(data));
        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    });

    it('testConverter', () => {
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
    });
});
