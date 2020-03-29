# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

from azure.cli.core.commands import CliCommandType


def load_command_table(self, _):

    from azext_managednetwork.generated._client_factory import cf_mn
    managednetwork_mn = CliCommandType(
        operations_tmpl='azext_managednetwork.vendored_sdks.managednetwork.operations._managed_network_operations#Manag'
        'edNetworkOperations.{}',
        client_factory=cf_mn)
    with self.command_group('managednetwork mn', managednetwork_mn, client_factory=cf_mn) as g:
        g.custom_command('list', 'managednetwork_mn_list')
        g.custom_show_command('show', 'managednetwork_mn_show')
        g.custom_command('create', 'managednetwork_mn_create')
        g.custom_command('update', 'managednetwork_mn_update', supports_no_wait=True)
        g.custom_command('delete', 'managednetwork_mn_delete', supports_no_wait=True)
        g.wait_command('wait')

    from azext_managednetwork.generated._client_factory import cf_scope_assignment
    managednetwork_scope_assignment = CliCommandType(
        operations_tmpl='azext_managednetwork.vendored_sdks.managednetwork.operations._scope_assignment_operations#Scop'
        'eAssignmentOperations.{}',
        client_factory=cf_scope_assignment)
    with self.command_group('managednetwork scope-assignment', managednetwork_scope_assignment,
                            client_factory=cf_scope_assignment) as g:
        g.custom_command('list', 'managednetwork_scope_assignment_list')
        g.custom_show_command('show', 'managednetwork_scope_assignment_show')
        g.custom_command('create', 'managednetwork_scope_assignment_create')
        g.custom_command('update', 'managednetwork_scope_assignment_update')
        g.custom_command('delete', 'managednetwork_scope_assignment_delete')

    from azext_managednetwork.generated._client_factory import cf_managed_network_group
    managednetwork_managed_network_group = CliCommandType(
        operations_tmpl='azext_managednetwork.vendored_sdks.managednetwork.operations._managed_network_group_operations'
        '#ManagedNetworkGroupOperations.{}',
        client_factory=cf_managed_network_group)
    with self.command_group('managednetwork managed-network-group', managednetwork_managed_network_group,
                            client_factory=cf_managed_network_group) as g:
        g.custom_command('list', 'managednetwork_managed_network_group_list')
        g.custom_show_command('show', 'managednetwork_managed_network_group_show')
        g.custom_command('create', 'managednetwork_managed_network_group_create', supports_no_wait=True)
        g.custom_command('update', 'managednetwork_managed_network_group_update', supports_no_wait=True)
        g.custom_command('delete', 'managednetwork_managed_network_group_delete', supports_no_wait=True)
        g.wait_command('wait')

    from azext_managednetwork.generated._client_factory import cf_managed_network_peering_policy
    managednetwork_managed_network_peering_policy = CliCommandType(
        operations_tmpl='azext_managednetwork.vendored_sdks.managednetwork.operations._managed_network_peering_policy_o'
        'perations#ManagedNetworkPeeringPolicyOperations.{}',
        client_factory=cf_managed_network_peering_policy)
    with self.command_group('managednetwork managed-network-peering-policy',
                            managednetwork_managed_network_peering_policy,
                            client_factory=cf_managed_network_peering_policy) as g:
        g.custom_command('list', 'managednetwork_managed_network_peering_policy_list')
        g.custom_show_command('show', 'managednetwork_managed_network_peering_policy_show')
        g.custom_command('hub-and-spoke-topology create', 'managednetwork_managed_network_peering_policy_hub_and_spoke_'
                         'topology_create', supports_no_wait=True)
        g.generic_update_command('hub-and-spoke-topology update', setter_arg_name = 'properties', setter_name = 'begin_'
                                 'create_or_update', custom_func_name = 'managednetwork_managed_network_peering_policy_'
                                 'hub_and_spoke_topology_update', supports_no_wait=True)
        g.custom_command('mesh-topology create', 'managednetwork_managed_network_peering_policy_mesh_topology_create',
                         supports_no_wait=True)
        g.generic_update_command('mesh-topology update', setter_arg_name = 'properties', setter_name = 'begin_create_or'
                                 '_update', custom_func_name = 'managednetwork_managed_network_peering_policy_mesh_topo'
                                 'logy_update', supports_no_wait=True)
        g.custom_command('delete', 'managednetwork_managed_network_peering_policy_delete', supports_no_wait=True)
        g.wait_command('wait')
