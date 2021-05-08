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
import { CliCommands } from '../../src/generate/renders/generated/CliCommands';
import { AzLinter } from '../../src/azlinter';
import { Entry } from '../../src/entry';
import { CodeModelCliImpl } from '../../src/generate/codemodel/CodeModelAzImpl';
import { createTestSession } from '../utils/test-helper';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../test/unittest/');

const fileName = 'datafactory-az-modifier-after.yaml';

describe('getCommandsRender', () => {
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
        const { exampleHandler } = codeModel.GetHandler();
        exampleHandler.GenerateTestInit();

        model = codeModel;
    }

    async function getCommandsRenderData() {
        await init('datafactory', fileName);
        AzConfiguration.setValue(CodeGenConstants.extensionMode, ExtensionMode.Experimental);
        AzConfiguration.setValue(CodeGenConstants.azextFolder, 'azext_datafactory_preview');
        AzConfiguration.setValue(
            CodeGenConstants.pythonNamespace,
            'azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory',
        );
        const cliCommandsRender = new CliCommands(model);
        const data = await cliCommandsRender.GetRenderData();
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

    it('getCommandRenderDataTest1', async () => {
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/render-commands.json')),
        );
        let data = await getCommandsRenderData();
        // console.log(JSON.stringify(data));
        data = JSON.parse(JSON.stringify(data));
        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    });

    it('getCommandRenderDataTest2', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/commands.py.njx');
        const data = await getCommandsRenderData();
        let result = render(path.relative(process.cwd(), tmplPath), data);
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_commands3.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/commands3.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic for commands.py is incorrect');
        await rmFile(oriFile);
    }, 10000);
});
