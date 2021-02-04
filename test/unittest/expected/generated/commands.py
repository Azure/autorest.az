# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------
# pylint: disable=too-many-statements
# pylint: disable=too-many-locals
# pylint: disable=line-too-long

from azure.cli.core.commands import CliCommandType


def load_command_table(self, _):

    from azext_datafactory.generated._client_factory import cf_factory

    datafactory_factory = CliCommandType(
        operations_tmpl=(
            'azext_datafactory.vendored_sdks.datafactory.operations._factory_operations#FactoryOperations.{}'
        ),
        client_factory=cf_factory,
    )
    with self.command_group('datafactory factory', datafactory_factory) as g:
        g.custom_command('list', 'datafactory_factory_list')
        g.custom_show_command('show', 'datafactory_factory_show')
        g.custom_command('create', 'datafactory_factory_create')
        g.custom_command('update', 'datafactory_factory_update')
        g.custom_command('delete', 'datafactory_factory_delete', confirmation=True)
        g.custom_command('configure-factory-repo', 'datafactory_factory_configure_factory_repo')
        g.custom_command('get-data-plane-access', 'datafactory_factory_get_data_plane_access')
        g.custom_command('get-git-hub-access-token', 'datafactory_factory_get_git_hub_access_token')

    from azext_datafactory.generated._client_factory import cf_integration_runtime

    datafactory_integration_runtime = CliCommandType(
        operations_tmpl='azext_datafactory.vendored_sdks.datafactory.operations._integration_runtime_operations#IntegrationRuntimeOperations.{}',
        client_factory=cf_integration_runtime,
    )
    with self.command_group('datafactory integration-runtime', datafactory_integration_runtime) as g:
        g.custom_command('list', 'datafactory_integration_runtime_list')
        g.custom_show_command('show', 'datafactory_integration_runtime_show')
        g.custom_command(
            'linked-integration-runtime create', 'datafactory_integration_runtime_linked_integration_runtime_create'
        )
        g.custom_command('managed create', 'datafactory_integration_runtime_managed_create')
        g.custom_command('self-hosted create', 'datafactory_integration_runtime_self_hosted_create')
        g.custom_command('update', 'datafactory_integration_runtime_update')
        g.custom_command('delete', 'datafactory_integration_runtime_delete', confirmation=True)
        g.custom_command('get-connection-info', 'datafactory_integration_runtime_get_connection_info')
        g.custom_command('get-monitoring-data', 'datafactory_integration_runtime_get_monitoring_data')
        g.custom_command('get-status', 'datafactory_integration_runtime_get_status')
        g.custom_command('list-auth-key', 'datafactory_integration_runtime_list_auth_key')
        g.custom_command('regenerate-auth-key', 'datafactory_integration_runtime_regenerate_auth_key')
        g.custom_command('remove-link', 'datafactory_integration_runtime_remove_link')
        g.custom_command('start', 'datafactory_integration_runtime_start', supports_no_wait=True)
        g.custom_command('stop', 'datafactory_integration_runtime_stop', supports_no_wait=True)
        g.custom_command('sync-credentials', 'datafactory_integration_runtime_sync_credentials')
        g.custom_command('upgrade', 'datafactory_integration_runtime_upgrade')
        g.custom_wait_command('wait', 'datafactory_integration_runtime_show')

    from azext_datafactory.generated._client_factory import cf_linked_service

    datafactory_linked_service = CliCommandType(
        operations_tmpl='azext_datafactory.vendored_sdks.datafactory.operations._linked_service_operations#LinkedServiceOperations.{}',
        client_factory=cf_linked_service,
    )
    with self.command_group('datafactory linked-service', datafactory_linked_service, is_preview=True) as g:
        g.custom_command('list', 'datafactory_linked_service_list')
        g.custom_show_command('show', 'datafactory_linked_service_show')
        g.custom_command('create', 'datafactory_linked_service_create')
        g.generic_update_command(
            'update', setter_arg_name='properties', custom_func_name='datafactory_linked_service_update'
        )
        g.custom_command('delete', 'datafactory_linked_service_delete', confirmation=True)

    with self.command_group('datafactory', is_experimental=True):
        pass