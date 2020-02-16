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

    from ._client_factory import cf_managed_networks
    managed_network_managed_networks = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managed_networks.operations._managed_networks_operations#ManagedNetworksOperations.{}',
        client_factory=cf_managed_networks)
    with self.command_group('managed-network managed_networks', managed_network_managed_networks, client_factory=cf_managed_networks) as g:
        g.custom_command('list', 'managed-network_managed-networks_list')
        g.custom_show_command('show', 'managed-network_managed-networks_show')
        g.custom_command('create', 'managed-network_managed-networks_create')
        g.custom_command('update', 'managed-network_managed-networks_update')
        g.custom_command('delete', 'managed-network_managed-networks_delete')

    from ._client_factory import cf_scope_assignments
    managed_network_scope_assignments = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.scope_assignments.operations._scope_assignments_operations#ScopeAssignmentsOperations.{}',
        client_factory=cf_scope_assignments)
    with self.command_group('managed-network scope_assignments', managed_network_scope_assignments, client_factory=cf_scope_assignments) as g:
        g.custom_command('list', 'managed-network_scope-assignments_list')
        g.custom_show_command('show', 'managed-network_scope-assignments_show')
        g.custom_command('create', 'managed-network_scope-assignments_create')
        g.custom_command('update', 'managed-network_scope-assignments_update')
        g.custom_command('delete', 'managed-network_scope-assignments_delete')

    from ._client_factory import cf_managed_network_groups
    managed_network_managed_network_groups = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managed_network_groups.operations._managed_network_groups_operations#ManagedNetworkGroupsOperations.{}',
        client_factory=cf_managed_network_groups)
    with self.command_group('managed-network managed_network_groups', managed_network_managed_network_groups, client_factory=cf_managed_network_groups) as g:
        g.custom_command('list', 'managed-network_managed-network-groups_list')
        g.custom_show_command('show', 'managed-network_managed-network-groups_show')
        g.custom_command('create', 'managed-network_managed-network-groups_create')
        g.custom_command('update', 'managed-network_managed-network-groups_update')
        g.custom_command('delete', 'managed-network_managed-network-groups_delete')

    from ._client_factory import cf_managed_network_peering_policies
    managed_network_managed_network_peering_policies = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managed_network_peering_policies.operations._managed_network_peering_policies_operations#ManagedNetworkPeeringPoliciesOperations.{}',
        client_factory=cf_managed_network_peering_policies)
    with self.command_group('managed-network managed_network_peering_policies', managed_network_managed_network_peering_policies, client_factory=cf_managed_network_peering_policies) as g:
        g.custom_command('list', 'managed-network_managed-network-peering-policies_list')
        g.custom_show_command('show', 'managed-network_managed-network-peering-policies_show')
        g.custom_command('create', 'managed-network_managed-network-peering-policies_create')
        g.custom_command('update', 'managed-network_managed-network-peering-policies_update')
        g.custom_command('delete', 'managed-network_managed-network-peering-policies_delete')

    from ._client_factory import cf_operations
    managed_network_operations = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.operations.operations._operations_operations#OperationsOperations.{}',
        client_factory=cf_operations)
    with self.command_group('managed-network operations', managed_network_operations, client_factory=cf_operations) as g:
        g.custom_command('list', 'managed-network_operations_list')
