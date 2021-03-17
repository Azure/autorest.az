/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { readFile, writeFile, rmFile } from '@azure-tools/async-io';
import { AzLinter } from '../../src/azlinter';
sourceMapSupport.install();

describe('renderActionPYTest', () => {
    it('single positional action test', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njx');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(tmplPath, {
            data: {
                pylints: ['# pylint: disable=protected-access', '# pylint: disable=no-self-use'],
                actions: [
                    {
                        name: 'FactoryVstsConfiguration',
                        namePython: 'factory_vsts_configuration',
                        type: 'object',
                        actionType: 'Positional',
                        baseClass: 'Action',
                        subProperties: [
                            {
                                mapsTo: 'type',
                                namePython: 'type',
                            },
                            {
                                mapsTo: 'project-name',
                                namePython: 'project_name',
                            },
                            {
                                mapsTo: 'tenant-id',
                                namePython: 'tenant_id',
                            },
                            {
                                mapsTo: 'account-name',
                                namePython: 'account_name',
                            },
                            {
                                mapsTo: 'repository-name',
                                namePython: 'repository_name',
                            },
                            {
                                mapsTo: 'root-folder',
                                namePython: 'root_folder',
                            },
                            {
                                mapsTo: 'collaboration-branch',
                                namePython: 'collaboration_branch',
                            },
                        ],
                        subPropertiesMapsTo: [
                            'type',
                            'project-name',
                            'tenant-id',
                            'account-name',
                            'repository-name',
                            'root-folder',
                            'collaboration-branch',
                        ],
                        subPropertiesNamePython: [
                            'type',
                            'project_name',
                            'tenant_id',
                            'account_name',
                            'repository_name',
                            'root_folder',
                            'collaboration_branch',
                        ],
                    },
                ],
            },
        });
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_positional_action.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/positional_action.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render positional action in action.py is incorrect',
        );
        await rmFile(oriFile);
    });

    it('single key value action test', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njx');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(tmplPath, {
            data: {
                pylints: ['# pylint: disable=protected-access', '# pylint: disable=no-self-use'],
                actions: [
                    {
                        name: 'FactoryGitHubConfiguration',
                        namePython: 'factory_git_hub_configuration',
                        type: 'object',
                        actionType: 'KeyValue',
                        baseClass: 'Action',
                        subProperties: [
                            {
                                mapsTo: 'host-name',
                                namePython: 'host_name',
                            },
                            {
                                mapsTo: 'account-name',
                                namePython: 'account_name',
                            },
                            {
                                mapsTo: 'repository-name',
                                namePython: 'repository_name',
                            },
                            {
                                mapsTo: 'collaboration-branch',
                                namePython: 'collaboration_branch',
                            },
                            {
                                mapsTo: 'root-folder',
                                namePython: 'root_folder',
                            },
                            {
                                mapsTo: 'last-commit-id',
                                namePython: 'last_commit_id',
                            },
                        ],
                        subPropertiesMapsTo: [
                            'host-name',
                            'account-name',
                            'repository-name',
                            'collaboration-branch',
                            'root-folder',
                            'last-commit-id',
                        ],
                        subPropertiesNamePython: [
                            'host_name',
                            'account_name',
                            'repository_name',
                            'collaboration_branch',
                            'root_folder',
                            'last_commit_id',
                        ],
                        constants: {
                            "'type'": "'FactoryGitHubConfiguration'",
                        },
                    },
                ],
            },
        });
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_key_value_action.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/key_value_action.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render key value action in action.py is incorrect',
        );
        await rmFile(oriFile);
    });

    it('single shorthand syntax action test', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njx');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(tmplPath, {
            data: {
                pylints: ['# pylint: disable=protected-access', '# pylint: disable=no-self-use'],
                actions: [
                    {
                        name: 'Subnets',
                        namePython: 'subnets',
                        type: 'array',
                        actionType: 'ShortHandSyntax',
                        baseClass: '_AppendAction',
                        subProperties: [
                            {
                                mapsTo: 'id',
                                namePython: 'id',
                            },
                            {
                                mapsTo: 'name',
                                namePython: 'name',
                            },
                        ],
                        subPropertiesMapsTo: ['id', 'name'],
                        subPropertiesNamePython: ['id', 'name'],
                        constants: {},
                    },
                ],
            },
        });
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_short_hand_syntax_action.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/short_hand_syntax_action.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(
            result,
            expected,
            'render shorthand syntax action in action.py is incorrect',
        );
        await rmFile(oriFile);
    });
});
