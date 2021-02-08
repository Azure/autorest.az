/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import * as path from 'path';
import { readFile, rmFile, writeFile } from '@azure-tools/async-io';
import * as sourceMapSupport from 'source-map-support';
import { AzConfiguration, CodeGenConstants, ExtensionMode } from '../../src/utils/models';
import { RenderDataBase } from './render-getRenderDataBase';
import { CliCommands } from '../../src/generate/renders/generated/CliCommands';
import { AzLinter } from '../../src/azlinter';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../../test/unittest/');

const fileName = 'datafactory-az-modifier-after.yaml';

@suite
export class Process extends RenderDataBase {
    async getCommandsRenderData() {
        await super.init('datafactory', fileName);
        AzConfiguration.setValue(CodeGenConstants.extensionMode, ExtensionMode.Experimental);
        AzConfiguration.setValue(CodeGenConstants.azextFolder, 'azext_datafactory_preview');
        AzConfiguration.setValue(
            CodeGenConstants.pythonNamespace,
            'azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory',
        );
        const cliCommandsRender = new CliCommands(this.model);
        const data = await cliCommandsRender.GetRenderData();
        return data;
    }

    @test(slow(600000), timeout(1500000)) async getCommandRenderDataTest() {
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/render-commands.json')),
        );
        let data = await this.getCommandsRenderData();
        // console.log(JSON.stringify(data));
        data = JSON.parse(JSON.stringify(data));
        assert.deepStrictEqual(
            data,
            expected,
            'Getting render data error from extension to methodParameter ',
        );
    }

    @test(slow(600000), timeout(1500000)) async renderCommandsPYTest2() {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../../src/templates/generated/commands.py.njx',
        );
        const data = await this.getCommandsRenderData();
        let result = super.render(tmplPath, data);
        const oriFile = path.join(
            `${__dirname}`,
            '../../../test/unittest/expected/generated/ori_commands.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../../test/unittest/expected/generated/commands3.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic for commands.py is incorrect');
        await rmFile(oriFile);
    }
}
