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

describe('RenderSetupPy', () => {
    it('setupPYTestCase1', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/setup.py.njx');
        const result = nunjucks.render(tmplPath, {
            model: {
                AzextFolder: 'azext_offazure',
                Extension_Name: 'offazure',
                azRelativeOutputFolder: 'src/offazure',
                Extension_NameClass: 'AzureMigrateV2',
                Extension_NameUnderscored: 'offazure',
            },
        });
        const expectedFile = path.join(`${__dirname}`, '../../test/unittest/expected/setup1.py');
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 1 in setup.py is incorrect');
    });

    it('setupPYTestCase2', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/setup.py.njx');
        const result = nunjucks.render(tmplPath, {
            model: {
                AzextFolder: 'azext_offazure',
                Extension_Name: 'offazure',
                azRelativeOutputFolder: 'src/offazure',
                Extension_NameClass: 'AzureMigrateV2',
                Extension_NameUnderscored: 'offazure',
                dependencies: ['azure-mgmt-offazure~=0.1.0', 'python==3.6'],
            },
        });
        const expectedFile = path.join(`${__dirname}`, '../../test/unittest/expected/setup2.py');
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 2 in setup.py is incorrect');
    });
});
