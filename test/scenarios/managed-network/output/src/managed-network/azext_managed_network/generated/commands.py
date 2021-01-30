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
from azure.cli.core.profiles import ResourceType


def load_command_table(self, _):

    from azext_managed_network.generated._client_factory import cf_managed_network

    managed_network_managed_network = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._managed_networks_operations#ManagedNetworksOperations.{}',
        client_factory=cf_managed_network,
    )
    with self.command_group('managed-network mn', managed_network_managed_network, is_experimental=True) as g:
        g.custom_command('list', 'managed_network_mn_list')
        g.custom_command('create', 'managed_network_mn_create')
        g.custom_command('update', 'managed_network_mn_update', supports_no_wait=True)
        g.custom_command('delete', 'managed_network_mn_delete', supports_no_wait=True, confirmation=True)
        g.custom_command('show-modify', 'managed_network_mn_show_modify')

    from azext_managed_network.generated._client_factory import cf_scope_assignment

    managed_network_scope_assignment = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._scope_assignments_operations#ScopeAssignmentsOperations.{}',
        client_factory=cf_scope_assignment,
    )
    with self.command_group('managed-network mn scope-assignment', managed_network_scope_assignment) as g:
        g.custom_command('list', 'managed_network_mn_scope_assignment_list')
        g.custom_show_command('show', 'managed_network_mn_scope_assignment_show')
        g.custom_command('create', 'managed_network_mn_scope_assignment_create')
        g.generic_update_command('update', custom_func_name='managed_network_mn_scope_assignment_update')
        g.custom_command('delete', 'managed_network_mn_scope_assignment_delete', confirmation=True)

    from azext_managed_network.generated._client_factory import cf_managed_network_group

    managed_network_managed_network_group = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._managed_network_groups_operations#ManagedNetworkGroupsOperations.{}',
        client_factory=cf_managed_network_group,
    )
    with self.command_group('managed-network mn group', managed_network_managed_network_group) as g:
        g.custom_command('list', 'managed_network_mn_group_list')
        g.custom_show_command('show', 'managed_network_mn_group_show')
        g.custom_command('create', 'managed_network_mn_group_create', supports_no_wait=True)
        g.generic_update_command(
            'update',
            supports_no_wait=True,
            custom_func_name='managed_network_mn_group_update',
            setter_arg_name='managed_network_group',
            setter_name='begin_create_or_update',
        )
        g.custom_command('delete', 'managed_network_mn_group_delete', supports_no_wait=True, confirmation=True)
        g.custom_wait_command('wait', 'managed_network_mn_group_show')

    from azext_managed_network.generated._client_factory import cf_managed_network_peering_policy

    managed_network_managed_network_peering_policy = CliCommandType(
        operations_tmpl='azext_managed_network.vendored_sdks.managednetwork.operations._managed_network_peering_policies_operations#ManagedNetworkPeeringPoliciesOperations.{}',
        client_factory=cf_managed_network_peering_policy,
    )
    with self.command_group(
        'managed-network managed-network-peering-policy',
        managed_network_managed_network_peering_policy,
        maxApi='2020-07-01-preview',
        minApi='2019-07-01',
        resourceType=ResourceType.DATA_STORAGE_BLOB,
    ) as g:
        g.custom_command('list', 'managed_network_managed_network_peering_policy_list')
        g.custom_show_command('show', 'managed_network_managed_network_peering_policy_show')
        g.custom_command(
            'hub-and-spoke-topology create',
            'managed_network_managed_network_peering_policy_hub_and_spoke_topology_create',
            supports_no_wait=True,
        )
        g.custom_command(
            'mesh-topology create',
            'managed_network_managed_network_peering_policy_mesh_topology_create',
            supports_no_wait=True,
        )
        g.generic_update_command(
            'hub-and-spoke-topology update',
            supports_no_wait=True,
            custom_func_name='managed_network_managed_network_peering_policy_hub_and_spoke_topology_update',
            setter_arg_name='managed_network_policy',
            setter_name='begin_create_or_update',
        )
        g.generic_update_command(
            'mesh-topology update',
            supports_no_wait=True,
            custom_func_name='managed_network_managed_network_peering_policy_mesh_topology_update',
            setter_arg_name='managed_network_policy',
            setter_name='begin_create_or_update',
        )
        g.custom_command(
            'delete',
            'managed_network_managed_network_peering_policy_delete',
            maxApi='2020-09-01',
            minApi='2019-09-01',
            resourceType=ResourceType.DATA_COMPUTE,
            supports_no_wait=True,
            confirmation=True,
        )
        g.custom_wait_command('wait', 'managed_network_managed_network_peering_policy_show')

    with self.command_group('managed-network', is_preview=True):
        pass
