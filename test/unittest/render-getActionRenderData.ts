/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { readFile, rmFile, writeFile } from '@azure-tools/async-io';
import { CodeModel } from '@azure-tools/codemodel';
import { AzConfiguration, CodeGenConstants, ExtensionMode } from '../../src/utils/models';
import { CliActions } from '../../src/generate/renders/generated/CliActions';
import { AzLinter } from '../../src/azlinter';
import { Entry } from '../../src/entry';
import { CodeModelCliImpl } from '../../src/generate/CodeModelAzImpl';
import { createTestSession } from '../utils/test-helper';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../test/unittest/');

const fileName = 'datafactory-az-modifier-after.yaml';

describe('getActionsRender', () => {
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

    async function getActionsRenderData() {
        await init('datafactory', fileName);
        AzConfiguration.setValue(CodeGenConstants.extensionMode, ExtensionMode.Experimental);
        AzConfiguration.setValue(CodeGenConstants.azextFolder, 'azext_datafactory_preview');
        AzConfiguration.setValue(
            CodeGenConstants.pythonNamespace,
            'azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory',
        );
        const cliActionRender = new CliActions(model);
        const data = await cliActionRender.GetRenderData();
        return data;
    }

    function render(tmplPath: string, data: any) {
        nunjucks.configure({ autoescape: false });
        const result = nunjucks.render(tmplPath, data);
        return result;
    }

    const originalWarn = console.warn.bind(console.warn);
    beforeAll(() => {
        console.warn = (msg) => msg.toString().includes('ShowInTest') && originalWarn(msg);
    });
    afterAll(() => {
        console.warn = originalWarn;
    });

    it('getActionRenderDataTest1', async () => {
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/actions.json')),
        );
        let data = await getActionsRenderData();
        data = JSON.parse(JSON.stringify(data));
        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    });

    it('getActionRenderDataTest2', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njx');
        const data = await getActionsRenderData();
        let result = render(tmplPath, data);
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_action.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/action.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic for action.py is incorrect');
        await rmFile(oriFile);
    });
});
