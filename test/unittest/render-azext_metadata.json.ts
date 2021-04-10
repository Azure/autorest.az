/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { readFile } from '@azure-tools/async-io';
sourceMapSupport.install();

describe('renderHistoryRST', () => {
    it('renderHistoryRSTCase1', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/azext/azext_metadata.json.njx',
        );
        const result = nunjucks.render(tmplPath, {
            model: { Extension_Mode: 'experimental', minCliCoreVersion: '2.15.0' },
        });
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/azext/azext_metadata1.json',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render logic 1 in azext_metadata.json is incorrect',
        );
    });

    it('renderHistoryRSTCase2', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/azext/azext_metadata.json.njx',
        );
        const result = nunjucks.render(tmplPath, {
            model: { Extension_Mode: 'preview', minCliCoreVersion: '2.15.1' },
        });
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/azext/azext_metadata2.json',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render logic 2 in azext_metadata.json is incorrect',
        );
    });

    it('renderHistoryRSTCase3', async () => {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../src/templates/azext/azext_metadata.json.njx',
        );

        const result = nunjucks.render(tmplPath, {
            model: { Extension_Mode: 'stable', minCliCoreVersion: '2.15.1' },
        });
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/azext/azext_metadata3.json',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render logic 3 in azext_metadata.json is incorrect',
        );
    });
});
