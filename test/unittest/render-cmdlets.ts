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

    it('renderPositive', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/tests/cmdlet/test_positive.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        data.testData.className = 'PositiveTest';
        let result = nunjucks.render(tmplPath, data);
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/ori_test_positive.py',
        );
        await writeFile(oriFile, result);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/test_positive.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic in test_positive.py is incorrect');
        await rmFile(oriFile);
    });

    it('renderNegative', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/tests/cmdlet/test_negative.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        data.testData.className = 'NegativeTest';
        let result = nunjucks.render(tmplPath, data);
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/ori_test_negative.py',
        );
        await writeFile(oriFile, result);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/tests/cmdlet/test_negative.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic in test_negative.py is incorrect');
        await rmFile(oriFile);
    });
});
