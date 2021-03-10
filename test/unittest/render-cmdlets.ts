/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { readFile, writeFile, rmFile } from '@azure-tools/async-io';
sourceMapSupport.install();

describe('renderTestsCmdlets', () => {
    const data = {
        testData: {
            className: 'PositiveTest',
            cmds: [
                {
                    id: '/Operation/put/AttestationProviders_Create',
                    name: 'create_provider',
                    lines: [
                        'az attestation create-provider ',
                        '--provider-name "myattestationprovider" ',
                    ],
                    lastLine: '--resource-group "MyResourceGroup"',
                },
                {
                    id: '/Operation/get/Operations_List',
                    name: 'list_operation',
                    lines: [],
                    lastLine: 'az attestation list-operation',
                },
                {
                    id: '/AttestationProviders/get/AttestationProviders_ListByResourceGroup',
                    name: 'attestation_provider_provider_list',
                    lines: ['az attestation attestation-provider provider list '],
                    lastLine: '--resource-group "testrg1"',
                },
                {
                    id: '/AttestationProviders/get/AttestationProviders_List',
                    name: 'attestation_provider_provider_list2',
                    lines: [],
                    lastLine: 'az attestation attestation-provider provider list',
                },
                {
                    id: '/AttestationProviders/get/AttestationProviders_Get',
                    name: 'attestation_provider_show',
                    lines: [
                        'az attestation attestation-provider show ',
                        '--provider-name "myattestationprovider" ',
                    ],
                    lastLine: '--resource-group "MyResourceGroup"',
                },
                {
                    id: '/AttestationProviders/patch/AttestationProviders_Update',
                    name: 'attestation_provider_update',
                    lines: [
                        'az attestation attestation-provider update ',
                        '--provider-name "myattestationprovider" ',
                        '--resource-group "MyResourceGroup" ',
                    ],
                    lastLine: '--tags Property1="Value1" Property2="Value2" Property3="Value3"',
                },
                {
                    id: '/AttestationProviders/delete/AttestationProviders_Delete',
                    name: 'attestation_provider_delete',
                    lines: [
                        'az attestation attestation-provider delete -y ',
                        '--provider-name "myattestationprovider" ',
                    ],
                    lastLine: '--resource-group "sample-resource-group"',
                },
            ],
        },
    };

    const data_empty = {
        testData: {
            className: 'PositiveTest',
            cmds: [],
        },
    };

    it('renderPositive', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/tests/cmdlet/test_positive.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        data.testData.className = 'PositiveTest';
        const result = nunjucks.render(tmplPath, data);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/test_positive.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic in test_positive.py is incorrect');
    });

    it('renderNegative', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/tests/cmdlet/test_negative.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        data.testData.className = 'NegativeTest';
        const result = nunjucks.render(tmplPath, data);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/test_negative.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic in test_negative.py is incorrect');
    });

    it('renderEmptyData', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/tests/cmdlet/test_positive.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        data_empty.testData.className = 'PositiveTest';
        const result = nunjucks.render(tmplPath, data_empty);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/test_positive_empty.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render empty data in test_positive.py is incorrect',
        );
    });
});
