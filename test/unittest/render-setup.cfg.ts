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

describe('renderSetupCFG', () => {
    it('renderSetupCFGTest', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/setup.cfg.njx');
        const result = nunjucks.render(tmplPath, {});
        const expectedFile = path.join(`${__dirname}`, '../../test/unittest/expected/setup.cfg');
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic in setup.cfg is incorrect');
    });
});
