# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

# pylint: disable=line-too-long
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements
# pylint: disable=too-many-locals
from azure.cli.core.commands import CliCommandType


def load_command_table(self, _):

    from ._client_factory import cf_managednetwork
    managed_network_managednetwork = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._managednetwork_operations#ManagednetworkOperations.{}',
        client_factory=cf_managednetwork)
    with self.command_group('managed-network managednetwork', managed_network_managednetwork, client_factory=cf_managednetwork) as g:
        g.custom_command('list', 'managed_network_managednetwork_list')
        g.custom_show_command('show', 'managed_network_managednetwork_show')
        g.custom_command('create', 'managed_network_managednetwork_create')
        g.custom_command('update', 'managed_network_managednetwork_update')
        g.custom_command('delete', 'managed_network_managednetwork_delete')

    from ._client_factory import cf_scopeassignment
    managed_network_scopeassignment = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._scopeassignment_operations#ScopeassignmentOperations.{}',
        client_factory=cf_scopeassignment)
    with self.command_group('managed-network scopeassignment', managed_network_scopeassignment, client_factory=cf_scopeassignment) as g:
        g.custom_command('list', 'managed_network_scopeassignment_list')
        g.custom_show_command('show', 'managed_network_scopeassignment_show')
        g.custom_command('create', 'managed_network_scopeassignment_create')
        g.custom_command('update', 'managed_network_scopeassignment_update')
        g.custom_command('delete', 'managed_network_scopeassignment_delete')

    from ._client_factory import cf_managednetworkgroup
    managed_network_managednetworkgroup = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._managednetworkgroup_operations#ManagednetworkgroupOperations.{}',
        client_factory=cf_managednetworkgroup)
    with self.command_group('managed-network managednetworkgroup', managed_network_managednetworkgroup, client_factory=cf_managednetworkgroup) as g:
        g.custom_command('list', 'managed_network_managednetworkgroup_list')
        g.custom_show_command('show', 'managed_network_managednetworkgroup_show')
        g.custom_command('create', 'managed_network_managednetworkgroup_create')
        g.custom_command('update', 'managed_network_managednetworkgroup_update')
        g.custom_command('delete', 'managed_network_managednetworkgroup_delete')

    from ._client_factory import cf_managednetworkpeeringpolicy
    managed_network_managednetworkpeeringpolicy = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._managednetworkpeeringpolicy_operations#ManagednetworkpeeringpolicyOperations.{}',
        client_factory=cf_managednetworkpeeringpolicy)
    with self.command_group('managed-network managednetworkpeeringpolicy', managed_network_managednetworkpeeringpolicy, client_factory=cf_managednetworkpeeringpolicy) as g:
        g.custom_command('list', 'managed_network_managednetworkpeeringpolicy_list')
        g.custom_show_command('show', 'managed_network_managednetworkpeeringpolicy_show')
        g.custom_command('create', 'managed_network_managednetworkpeeringpolicy_create')
        g.custom_command('update', 'managed_network_managednetworkpeeringpolicy_update')
        g.custom_command('delete', 'managed_network_managednetworkpeeringpolicy_delete')

    from ._client_factory import cf_operation
    managed_network_operation = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._operation_operations#OperationOperations.{}',
        client_factory=cf_operation)
    with self.command_group('managed-network operation', managed_network_operation, client_factory=cf_operation) as g:
        g.custom_command('list', 'managed_network_operation_list')
