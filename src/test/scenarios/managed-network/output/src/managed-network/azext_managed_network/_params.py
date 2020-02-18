# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements

from azure.cli.core.commands.parameters import (
    tags_type,
    get_enum_type,
    resource_group_name_type,
    get_location_type
)
from azext_managed_network.actions import (
    AddManagementGroups,
    AddSubscriptions,
    AddVirtualNetworks,
    AddSubnets,
    AddManagedNetworkGroup,
    AddSpokes,
    AddMesh
)


def load_arguments(self, _):

    with self.argument_context('managed-network managed_networks list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('top', id_part=None, help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', id_part=None, help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed_networks show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')

    with self.argument_context('managed-network managed_networks create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('tags', tags_type, nargs='+')
        c.argument('scope_management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('scope_subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('scope_virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('scope_subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed_networks update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('tags', tags_type, nargs='+')

    with self.argument_context('managed-network managed_networks delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')

    with self.argument_context('managed-network scope_assignments list') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scope_assignments show') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scope_assignments create') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('assigned_managed_network', id_part=None, help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scope_assignments update') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('assigned_managed_network', id_part=None, help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scope_assignments delete') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')

    with self.argument_context('managed-network managed_network_groups list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('top', id_part=None, help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', id_part=None, help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed_network_groups show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed_network_groups create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')
        c.argument('managed_network_group', id_part=None, help='Parameters supplied to the create/update a Managed Network Group resource', action=AddManagedNetworkGroup, nargs='+')

    with self.argument_context('managed-network managed_network_groups update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')
        c.argument('managed_network_group', id_part=None, help='Parameters supplied to the create/update a Managed Network Group resource', action=AddManagedNetworkGroup, nargs='+')

    with self.argument_context('managed-network managed_network_groups delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed_network_peering_policies list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('top', id_part=None, help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', id_part=None, help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed_network_peering_policies show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network managed_network_peering_policies create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_type', arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']), id_part=None, help='Gets or sets the connectivity type of a network structure policy')
        c.argument('id', id_part=None, help='Resource Id')
        c.argument('properties_spokes', id_part=None, help='Gets or sets the spokes group IDs', action=AddSpokes, nargs='+')
        c.argument('properties_mesh', id_part=None, help='Gets or sets the mesh group IDs', action=AddMesh, nargs='+')

    with self.argument_context('managed-network managed_network_peering_policies update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_type', arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']), id_part=None, help='Gets or sets the connectivity type of a network structure policy')
        c.argument('id', id_part=None, help='Resource Id')
        c.argument('properties_spokes', id_part=None, help='Gets or sets the spokes group IDs', action=AddSpokes, nargs='+')
        c.argument('properties_mesh', id_part=None, help='Gets or sets the mesh group IDs', action=AddMesh, nargs='+')

    with self.argument_context('managed-network managed_network_peering_policies delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network operations list') as c:
        pass
