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
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njk');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(path.relative(process.cwd(), tmplPath), {
            data: {
                pylints: ['# pylint: disable=protected-access', '# pylint: disable=no-self-use'],
                actions: [
                    {
                        actionName: 'AddFactoryVstsConfiguration',
                        actionType: 'Positional',
                        mapsTo: 'factory_vsts_configuration',
                        type: 'object',
                        nameAz: 'factory-vsts-configuration',
                        baseClass: 'Action',
                        subProperties: [
                            {
                                namePython: 'type',
                                nameAz: 'type',
                                type: 'string',
                            },
                            {
                                namePython: 'project_name',
                                nameAz: 'project-name',
                                type: 'string',
                            },
                            {
                                namePython: 'tenant_id',
                                nameAz: 'tenant-id',
                                type: 'string',
                            },
                            {
                                namePython: 'account_name',
                                nameAz: 'account-name',
                                type: 'string',
                            },
                            {
                                namePython: 'repository_name',
                                nameAz: 'repository-name',
                                type: 'string',
                            },
                            {
                                namePython: 'root_folder',
                                nameAz: 'root-folder',
                                type: 'string',
                            },
                            {
                                namePython: 'collaboration_branch',
                                nameAz: 'collaboration-branch',
                                type: 'string',
                            },
                        ],
                        subPropertiesMapsTo: [
                            'type',
                            'project_name',
                            'tenant_id',
                            'account_name',
                            'repository_name',
                            'root_folder',
                            'collaboration_branch',
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
                        subPropertiesNameAz: [
                            'type',
                            'project-name',
                            'tenant-id',
                            'account-name',
                            'repository-name',
                            'root-folder',
                            'collaboration-branch',
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
    }, 30000);

    it('single key value action test', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njk');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(path.relative(process.cwd(), tmplPath), {
            data: {
                pylints: ['# pylint: disable=protected-access', '# pylint: disable=no-self-use'],
                actions: [
                    {
                        actionName: 'AddFactoryGitHubConfiguration',
                        actionType: 'KeyValue',
                        mapsTo: 'factory_git_hub_configuration',
                        type: 'object',
                        nameAz: 'factory-git-hub-configuration',
                        baseClass: 'Action',
                        subProperties: [
                            {
                                nameAz: 'host-name',
                                namePython: 'host_name',
                                type: 'string',
                            },
                            {
                                nameAz: 'account-name',
                                namePython: 'account_name',
                                type: 'string',
                            },
                            {
                                nameAz: 'repository-name',
                                namePython: 'repository_name',
                                type: 'string',
                            },
                            {
                                nameAz: 'collaboration-branch',
                                namePython: 'collaboration_branch',
                                type: 'string',
                            },
                            {
                                nameAz: 'root-folder',
                                namePython: 'root_folder',
                                type: 'string',
                            },
                            {
                                nameAz: 'last-commit-id',
                                namePython: 'last_commit_id',
                                type: 'string',
                            },
                        ],
                        subPropertiesMapsTo: [
                            'host_name',
                            'account_name',
                            'repository_name',
                            'collaboration_branch',
                            'root_folder',
                            'last_commit_id',
                        ],
                        subPropertiesNamePython: [
                            'host_name',
                            'account_name',
                            'repository_name',
                            'collaboration_branch',
                            'root_folder',
                            'last_commit_id',
                        ],
                        subPropertiesNameAz: [
                            'host-name',
                            'account-name',
                            'repository-name',
                            'collaboration-branch',
                            'root-folder',
                            'last-commit-id',
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
    }, 30000);

    it('single shorthand syntax action test', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/action.py.njk');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(path.relative(process.cwd(), tmplPath), {
            data: {
                pylints: ['# pylint: disable=protected-access', '# pylint: disable=no-self-use'],
                actions: [
                    {
                        actionName: 'AddSubnets',
                        actionType: 'ShortHandSyntax',
                        mapsTo: 'subnets',
                        type: 'array',
                        nameAz: 'subnets',
                        baseClass: '_AppendAction',
                        subProperties: [
                            {
                                nameAz: 'id',
                                namePython: 'id',
                                type: 'string',
                            },
                            {
                                nameAz: 'name',
                                namePython: 'name',
                                type: 'string',
                            },
                        ],
                        subPropertiesMapsTo: ['id', 'name'],
                        subPropertiesNamePython: ['id', 'name'],
                        subPropertiesNameAz: ['id', 'name'],
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
    }, 30000);
});
