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

    from azext_datafactory_preview.generated._client_factory import cf_factory

    datafactory_factory = CliCommandType(
        operations_tmpl='azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory.operations._factories_operations#FactoriesOperations.{}',
        client_factory=cf_factory,
    )
    with self.command_group('datafactory', datafactory_factory, client_factory=cf_factory, is_experimental=True) as g:
        g.custom_command('list', 'datafactory_list')
        g.custom_show_command('show', 'datafactory_show')
        g.custom_command('create', 'datafactory_create')
        g.custom_command('update', 'datafactory_update')
        g.custom_command('delete', 'datafactory_delete', confirmation=True)
        g.custom_command('configure-factory-repo', 'datafactory_configure_factory_repo')
        g.custom_command('get-data-plane-access', 'datafactory_get_data_plane_access')
        g.custom_command('get-git-hub-access-token', 'datafactory_get_git_hub_access_token')

    from azext_datafactory_preview.generated._client_factory import cf_trigger

    datafactory_trigger = CliCommandType(
        operations_tmpl='azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory.operations._triggers_operations#TriggersOperations.{}',
        client_factory=cf_trigger,
    )
    with self.command_group('datafactory trigger', datafactory_trigger, client_factory=cf_trigger) as g:
        g.custom_command('list', 'datafactory_trigger_list')
        g.custom_show_command('show', 'datafactory_trigger_show')
        g.custom_command('create', 'datafactory_trigger_create')
        g.generic_update_command('update', custom_func_name='datafactory_trigger_update', setter_arg_name='trigger')
        g.custom_command('delete', 'datafactory_trigger_delete', confirmation=True)
        g.custom_command('get-event-subscription-status', 'datafactory_trigger_get_event_subscription_status')
        g.custom_command('query-by-factory', 'datafactory_trigger_query_by_factory')
        g.custom_command('start', 'datafactory_trigger_start', supports_no_wait=True)
        g.custom_command('stop', 'datafactory_trigger_stop', supports_no_wait=True)
        g.custom_command('subscribe-to-event', 'datafactory_trigger_subscribe_to_event', supports_no_wait=True)
        g.custom_command('unsubscribe-from-event', 'datafactory_trigger_unsubscribe_from_event', supports_no_wait=True)
        g.custom_wait_command('wait', 'datafactory_trigger_show')

    from azext_datafactory_preview.generated._client_factory import cf_integration_runtime

    datafactory_integration_runtime = CliCommandType(
        operations_tmpl='azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory.operations._integration_runtimes_operations#IntegrationRuntimesOperations.{}',
        client_factory=cf_integration_runtime,
    )
    with self.command_group(
        'datafactory integration-runtime', datafactory_integration_runtime, client_factory=cf_integration_runtime
    ) as g:
        g.custom_command('list', 'datafactory_integration_runtime_list')
        g.custom_show_command('show', 'datafactory_integration_runtime_show')
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

    from azext_datafactory_preview.generated._client_factory import cf_datafactory_cl

    datafactory_ = CliCommandType(
        operations_tmpl='azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory.operations._dfaz_management_client_operations#DFAZManagementClientOperationsMixin.{}',
        client_factory=cf_datafactory_cl,
    )
    with self.command_group('datafactory', datafactory_, client_factory=cf_datafactory_cl, is_experimental=True) as g:
        g.custom_command('create-linked-integration-runtime', 'datafactory_create_linked_integration_runtime')

    from azext_datafactory_preview.generated._client_factory import cf_domain_service

    datafactory_domain_service = CliCommandType(
        operations_tmpl='azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory.operations._domain_services_operations#DomainServicesOperations.{}',
        client_factory=cf_domain_service,
    )
    with self.command_group(
        'datafactory domain-service', datafactory_domain_service, client_factory=cf_domain_service
    ) as g:
        g.custom_command('create', 'datafactory_domain_service_create')
        g.custom_command('update', 'datafactory_domain_service_update')

    from azext_datafactory_preview.generated._client_factory import cf_group

    datafactory_group = CliCommandType(
        operations_tmpl='azext_datafactory_preview.vendored_sdks.azure_mgmt_datafactory.operations._groups_operations#GroupsOperations.{}',
        client_factory=cf_group,
    )
    with self.command_group('datafactory group', datafactory_group, client_factory=cf_group) as g:
        g.custom_command('create', 'datafactory_group_create')
