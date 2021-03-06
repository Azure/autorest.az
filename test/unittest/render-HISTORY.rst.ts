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
    it('renderHistoryRSTTest', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/HISTORY.rst.njx');
        const result = nunjucks.render(tmplPath, {});
        const expectedFile = path.join(`${__dirname}`, '../../test/unittest/expected/HISTORY.rst');
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic in HISTORY.rst is incorrect');
    });
});
