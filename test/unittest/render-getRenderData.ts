/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { readFile } from '@azure-tools/async-io';
import { CodeModel } from '@azure-tools/codemodel';
import { createTestSession } from '../utils/test-helper';
import * as sourceMapSupport from 'source-map-support';
import { Entry } from '../../src/plugins/entry';
import { CodeModelCliImpl } from '../../src/plugins/azgenerator/CodeModelAzImpl';
import { CodeModelTypes, RenderInput, SortOrder } from '../../src/utils/models';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../../test/unittest/');

const fileName = 'offazure-az-modifier-after.yaml';

@suite
export class Process {
    private model: CodeModelCliImpl;

    async init(): Promise<void> {
        const cfg = {
            az: {
                extensions: 'offazure',
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

        const model = new CodeModelCliImpl(session);

        this.model = model;
    }

    getRenderTestData(layer: CodeModelTypes, nextLayer: CodeModelTypes) {
        const data = {
            model: {},
        };

        const converter = new Map<string, (item) => unknown>([
            [
                'mapsTo',
                function (item: string) {
                    if (item.endsWith('_')) {
                        item = item.substr(0, item.length - 1);
                    }
                    item = item.replace(/_/g, '-');
                    return item;
                },
            ],
        ]);

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
                        'this.MethodParameter_IsFlattened',
                        'this.MethodParameter_Type === SchemaType.Constant',
                        'this.Parameter_IsPolyOfSimple(this.MethodParameter)',
                        "!isNullOrUndefined(this.Method_GetOriginalOperation) && this.MethodParameter['targetProperty']?.isDiscriminator",
                    ],
                    converter,
                ),
            ],
        ]);

        data.model = this.model.getRenderData(layer, nextLayer, inputProperties);
        return data;
    }

    @test(slow(600000), timeout(1500000)) async getRenderDataTest1() {
        await this.init();
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/extension-command-groups.json')),
        );
        const data = this.getRenderTestData('extension', 'commandGroup');

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to commandGroup ',
        );
    }

    @test(slow(600000), timeout(1500000)) async getRenderDataTest2() {
        await this.init();
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/command-groups-command.json')),
        );
        const data = this.getRenderTestData('commandGroup', 'command');

        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to commandGroup ',
        );
    }
}
