/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import * as path from 'path';
import { readFile, rmFile, writeFile } from '@azure-tools/async-io';
import * as sourceMapSupport from 'source-map-support';
import {
    AzConfiguration,
    CodeGenConstants,
    CodeModelTypes,
    RenderInput,
    SortOrder,
} from '../../src/utils/models';
import { isNullOrUndefined, ToPythonString, runLintball } from '../../src/utils/helper';
import { RenderDataBase } from './render-getRenderDataBase';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../../test/unittest/');

const fileName = 'datafactory-az-modifier-after.yaml';

@suite
export class Process extends RenderDataBase {
    async getCommandsRenderData() {
        await super.init('datafactory', fileName);
        let data = {};

        const extraProperties = ['maxApi', 'minApi', 'resourceType', 'mode'];
        const commandGroupConverter = (item) => {
            item['propertiesString'] = {};
            extraProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    item['propertiesString'][prop] = ToPythonString(item[prop], typeof item[prop]);
                }
            });
            return item;
        };

        const commandConverter = (item) => {
            item['propertiesString'] = {};
            extraProperties.forEach((prop) => {
                if (!isNullOrUndefined(item[prop])) {
                    item['propertiesString'][prop] = ToPythonString(item[prop], typeof item[prop]);
                }
            });
            if (item['isLongRun']) {
                item['propertiesString']['suppose_no_wait'] = 'True';
            }
            if (item['type'] === 'delete') {
                item['propertiesString']['confirmation'] = 'True';
            }
            if (item['needGeneric'] && !isNullOrUndefined(item['genericSetterArgName'])) {
                item['propertiesString']['custom_func_name'] = item['functionName'];
                const setterName = item['genericSetterArgName'];
                if (setterName && setterName !== '' && setterName !== 'parameters') {
                    item['propertiesString']['setter_arg_name'] = setterName;
                }
                if (item['isLongRun'] && !AzConfiguration.getValue(CodeGenConstants.sdkTrack1)) {
                    item['propertiesString']['setter_name'] = 'begin_create_or_update';
                }
            }
            return item;
        };

        const inputProperties: Map<CodeModelTypes, RenderInput> = new Map<
            CodeModelTypes,
            RenderInput
        >([
            [
                'extension',
                new RenderInput(['name', 'parent', 'mode', 'nameUnderscored'], {
                    name: SortOrder.ASEC,
                }),
            ],
            [
                'commandGroup',
                new RenderInput(
                    [
                        'name',
                        'clientFactoryName',
                        'customCommandTypeName',
                        'operationTmplName',
                        'maxApi',
                        'minApi',
                        'resourceType',
                        'mode',
                    ],
                    { name: SortOrder.ASEC },
                    [],
                    commandGroupConverter,
                ),
            ],
            [
                'command',
                new RenderInput(
                    [
                        'methodName',
                        'type',
                        'mode',
                        'maxApi',
                        'minApi',
                        'resourceType',
                        'isLongRun',
                        'functionName',
                        'needGeneric',
                        'genericSetterArgName',
                    ],
                    {},
                    [],
                    commandConverter,
                ),
            ],
        ]);

        const dependencies = <[CodeModelTypes, CodeModelTypes][]>[
            ['extension', 'commandGroup'],
            ['commandGroup', 'command'],
        ];
        data = this.model.getModelData('extension', inputProperties, dependencies);
        data['azextFolder'] = 'azext_datafactory';
        return data;
    }

    @test(slow(600000), timeout(1500000)) async getCommandRenderDataTest() {
        const expected = JSON.parse(
            await readFile(path.join(resources, 'expected', 'data/render-commands.json')),
        );
        let data = await this.getCommandsRenderData();
        data = JSON.parse(JSON.stringify(data));
        // console.log(JSON.stringify(data));
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
        const data = {
            data: {},
        };
        data.data = await this.getCommandsRenderData();
        data.data['imports'] = {
            'azure.cli.core.commands': ['CliCommandType'],
        };
        data.data['pylints'] = [
            '# pylint: disable=too-many-statements',
            '# pylint: disable=too-many-locals',
            '# pylint: disable=line-too-long',
        ];
        let result = super.render(tmplPath, data);
        console.log(result);
        const oriFile = path.join(
            `${__dirname}`,
            '../../../test/unittest/expected/generated/ori_commands.py',
        );
        await writeFile(oriFile, result);
        await runLintball(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../../test/unittest/expected/generated/commands2.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic for commands.py is incorrect');
        // await rmFile(oriFile);
    }
}
