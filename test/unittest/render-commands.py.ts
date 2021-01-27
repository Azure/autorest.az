/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { readFile } from '@azure-tools/async-io';
import { ToMultiLine } from '../../src/utils/helper';
sourceMapSupport.install();

@suite
export class Process {
    @test(slow(600000), timeout(1500000)) async renderCommandsPYTest1() {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../../src/templates/generated/commands.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        const result = nunjucks.render(tmplPath, {
            data: {
                pylints: [
                    '# pylint: disable=too-many-statements',
                    '# pylint: disable=too-many-locals',
                ],
                imports: {
                    'azure.cli.core.commands': ['CliCommandType'],
                },
                hasExtension: true,
                Extensions: [
                    {
                        hasCommandGroup: true,
                        CommandGroups: [
                            {
                                hasCommand: true,
                                Commands: [
                                    {
                                        name: 'list',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_factory_list',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'show',
                                        type: 'custom_show_command',
                                        customFunctionName: 'datafactory_factory_show',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'create',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_factory_create',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'update',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_factory_update',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'delete',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_factory_delete',
                                        propertiesString: {
                                            confirmation: 'True',
                                        },
                                    },
                                    {
                                        name: 'configure-factory-repo',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_factory_configure_factory_repo',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'get-data-plane-access',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_factory_get_data_plane_access',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'get-git-hub-access-token',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_factory_get_git_hub_access_token',
                                        propertiesString: {},
                                    },
                                ],
                                clientFactoryName: 'cf_factory',
                                customCommandTypeName: 'datafactory_factory',
                                operationTmpl:
                                    'azext_datafactory.vendored_sdks.datafactory.operations._factory_operations#FactoryOperations.{}',
                                name: 'datafactory factory',
                                propertiesString: {
                                    is_experimental: 'True',
                                },
                            },
                            {
                                hasCommand: true,
                                Commands: [
                                    {
                                        name: 'list',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_integration_runtime_list',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'show',
                                        type: 'custom_show_command',
                                        customFunctionName: 'datafactory_integration_runtime_show',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'linked-integration-runtime create',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_linked_integration_runtime_create',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'managed create',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_managed_create',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'self-hosted create',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_self_hosted_create',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'update',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_update',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'delete',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_delete',
                                        propertiesString: {
                                            confirmation: 'True',
                                        },
                                    },
                                    {
                                        name: 'get-connection-info',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_get_connection_info',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'get-monitoring-data',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_get_monitoring_data',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'get-status',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_get_status',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'list-auth-key',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_list_auth_key',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'regenerate-auth-key',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_regenerate_auth_key',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'remove-link',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_remove_link',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'start',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_integration_runtime_start',
                                        propertiesString: {
                                            supports_no_wait: 'True',
                                        },
                                    },
                                    {
                                        name: 'stop',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_integration_runtime_stop',
                                        propertiesString: {
                                            supports_no_wait: 'True',
                                        },
                                    },
                                    {
                                        name: 'sync-credentials',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_sync_credentials',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'upgrade',
                                        type: 'custom_command',
                                        customFunctionName:
                                            'datafactory_integration_runtime_upgrade',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'wait',
                                        type: 'custom_wait_command',
                                        customFunctionName: 'datafactory_integration_runtime_show',
                                        propertiesString: {},
                                    },
                                ],
                                clientFactoryName: 'cf_integration_runtime',
                                customCommandTypeName: 'datafactory_integration_runtime',
                                operationTmpl:
                                    'azext_datafactory.vendored_sdks.datafactory.operations._integration_runtime_operations#IntegrationRuntimeOperations.{}',
                                name: 'datafactory integration-runtime',
                                propertiesString: {
                                    is_experimental: 'True',
                                },
                            },
                            {
                                hasCommand: true,
                                Commands: [
                                    {
                                        name: 'list',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_linked_service_list',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'show',
                                        type: 'custom_show_command',
                                        customFunctionName: 'datafactory_linked_service_show',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'create',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_linked_service_create',
                                        propertiesString: {},
                                    },
                                    {
                                        name: 'update',
                                        type: 'generic_update_command',
                                        customFunctionName: 'datafactory_linked_service_update',
                                        propertiesString: {
                                            setter_arg_name: "'properties'",
                                            custom_func_name: "'datafactory_linked_service_update'",
                                        },
                                    },
                                    {
                                        name: 'delete',
                                        type: 'custom_command',
                                        customFunctionName: 'datafactory_linked_service_delete',
                                        propertiesString: {
                                            confirmation: 'True',
                                        },
                                    },
                                ],
                                clientFactoryName: 'cf_linked_service',
                                customCommandTypeName: 'datafactory_linked_service',
                                operationTmpl:
                                    'azext_datafactory.vendored_sdks.datafactory.operations._linked_service_operations#LinkedServiceOperations.{}',
                                name: 'datafactory linked-service',
                                propertiesString: {
                                    is_experimental: 'True',
                                },
                            },
                        ],
                        azextFolder: 'azext_datafactory',
                        nameUnderscore: 'datafactory',
                    },
                ],
            },
        });
        const expectedFile = path.join(
            `${__dirname}`,
            '../../../test/unittest/expected/generated/commands.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 1 in commands.py is incorrect');
    }

    @test(slow(600000), timeout(1500000)) async renderCommandsPYTest2() {
        const tmplPath = path.join(
            `${__dirname}`,
            '../../../src/templates/generated/commands.py.njx',
        );
        nunjucks.configure({ autoescape: false });
        const result = nunjucks.render(tmplPath, {
            data: {
                pylints: [],
                imports: {},
                hasExtension: false,
                Extensions: [],
            },
        });
        const expectedFile = path.join(
            `${__dirname}`,
            '../../../test/unittest/expected/generated/commands2.py',
        );
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 2 in commands.py is incorrect');
    }
}
