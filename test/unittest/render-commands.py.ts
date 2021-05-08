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

describe('renderCommandsPYTest', () => {
    it('renderCommandsPYTestCase1', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/commands.py.njx');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(path.relative(process.cwd(), tmplPath), {
            data: {
                pylints: [
                    '# pylint: disable=too-many-statements',
                    '# pylint: disable=too-many-locals',
                    '# pylint: disable=line-too-long',
                ],
                imports: {
                    'azure.cli.core.commands': ['CliCommandType'],
                    'azext_datafactory_preview.generated._client_factory': [
                        'cf_factory',
                        'cf_linked_service',
                        'cf_integration_runtime',
                    ],
                },
                hasExtension: true,
                Extensions: [
                    {
                        name: 'datafactory',
                        hasCommandGroup: true,
                        CommandGroups: [
                            {
                                hasCommand: true,
                                Commands: [
                                    {
                                        methodName: 'list',
                                        type: 'custom_command',
                                        functionName: 'datafactory_factory_list',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'show',
                                        type: 'custom_show_command',
                                        functionName: 'datafactory_factory_show',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'create',
                                        type: 'custom_command',
                                        functionName: 'datafactory_factory_create',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'update',
                                        type: 'custom_command',
                                        functionName: 'datafactory_factory_update',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'delete',
                                        type: 'custom_command',
                                        functionName: 'datafactory_factory_delete',
                                        propertiesString: {
                                            confirmation: 'True',
                                        },
                                    },
                                    {
                                        methodName: 'configure-factory-repo',
                                        type: 'custom_command',
                                        functionName: 'datafactory_factory_configure_factory_repo',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'get-data-plane-access',
                                        type: 'custom_command',
                                        functionName: 'datafactory_factory_get_data_plane_access',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'get-git-hub-access-token',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_factory_get_git_hub_access_token',
                                        propertiesString: {},
                                    },
                                ],
                                clientFactoryName: 'cf_factory',
                                customCommandTypeName: 'datafactory_factory',
                                operationTmplName:
                                    'azext_datafactory.vendored_sdks.datafactory.operations._factory_operations#FactoryOperations.{}',
                                name: 'datafactory factory',
                                propertiesString: {
                                    mode: 'experimental',
                                },
                            },
                            {
                                hasCommand: true,
                                Commands: [
                                    {
                                        methodName: 'list',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_list',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'show',
                                        type: 'custom_show_command',
                                        functionName: 'datafactory_integration_runtime_show',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'linked-integration-runtime create',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_linked_integration_runtime_create',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'managed create',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_managed_create',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'self-hosted create',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_self_hosted_create',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'update',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_update',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'delete',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_delete',
                                        propertiesString: {
                                            confirmation: 'True',
                                        },
                                    },
                                    {
                                        methodName: 'get-connection-info',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_get_connection_info',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'get-monitoring-data',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_get_monitoring_data',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'get-status',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_get_status',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'list-auth-key',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_list_auth_key',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'regenerate-auth-key',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_regenerate_auth_key',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'remove-link',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_remove_link',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'start',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_start',
                                        propertiesString: {
                                            supports_no_wait: 'True',
                                        },
                                    },
                                    {
                                        methodName: 'stop',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_stop',
                                        propertiesString: {
                                            supports_no_wait: 'True',
                                        },
                                    },
                                    {
                                        methodName: 'sync-credentials',
                                        type: 'custom_command',
                                        functionName:
                                            'datafactory_integration_runtime_sync_credentials',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'upgrade',
                                        type: 'custom_command',
                                        functionName: 'datafactory_integration_runtime_upgrade',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'wait',
                                        type: 'custom_wait_command',
                                        functionName: 'datafactory_integration_runtime_show',
                                        propertiesString: {},
                                    },
                                ],
                                clientFactoryName: 'cf_integration_runtime',
                                customCommandTypeName: 'datafactory_integration_runtime',
                                operationTmplName:
                                    'azext_datafactory.vendored_sdks.datafactory.operations._integration_runtime_operations#IntegrationRuntimeOperations.{}',
                                name: 'datafactory integration-runtime',
                                propertiesString: {
                                    mode: 'experimental',
                                },
                            },
                            {
                                hasCommand: true,
                                Commands: [
                                    {
                                        methodName: 'list',
                                        type: 'custom_command',
                                        functionName: 'datafactory_linked_service_list',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'show',
                                        type: 'custom_show_command',
                                        functionName: 'datafactory_linked_service_show',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'create',
                                        type: 'custom_command',
                                        functionName: 'datafactory_linked_service_create',
                                        propertiesString: {},
                                    },
                                    {
                                        methodName: 'update',
                                        type: 'generic_update_command',
                                        functionName: 'datafactory_linked_service_update',
                                        propertiesString: {
                                            setter_arg_name: "'properties'",
                                            custom_func_name: "'datafactory_linked_service_update'",
                                        },
                                    },
                                    {
                                        methodName: 'delete',
                                        type: 'custom_command',
                                        functionName: 'datafactory_linked_service_delete',
                                        propertiesString: {
                                            confirmation: 'True',
                                        },
                                    },
                                ],
                                clientFactoryName: 'cf_linked_service',
                                customCommandTypeName: 'datafactory_linked_service',
                                operationTmplName:
                                    'azext_datafactory.vendored_sdks.datafactory.operations._linked_service_operations#LinkedServiceOperations.{}',
                                name: 'datafactory linked-service',
                                propertiesString: {
                                    mode: 'preview',
                                },
                            },
                        ],
                        nameUnderscore: 'datafactory',
                        mode: 'experimental',
                    },
                ],
                azextFolder: 'azext_datafactory',
            },
        });
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_commands.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/commands.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 1 in commands.py is incorrect');
        await rmFile(oriFile);
    }, 30000);

    it('renderCommandsPYTestCase2', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/generated/commands.py.njx');
        nunjucks.configure({ autoescape: false });
        let result = nunjucks.render(path.relative(process.cwd(), tmplPath), {
            data: {
                pylints: [],
                imports: {},
                hasExtension: false,
                Extensions: [],
            },
        });
        const oriFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/ori_commands2.py',
        );
        await writeFile(oriFile, result);
        const azLinter = new AzLinter();
        await azLinter.process(oriFile);
        result = await readFile(oriFile);
        const expectedFile = path.join(
            `${__dirname}`,
            '../../test/unittest/expected/generated/commands2.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 2 in commands.py is incorrect');
        await rmFile(oriFile);
    }, 30000);
});
