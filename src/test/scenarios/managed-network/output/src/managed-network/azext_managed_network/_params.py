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
from azext_managed_network.action import (
    PeeringAddManagementGroups,
    PeeringAddSubscriptions,
    PeeringAddVirtualNetworks,
    PeeringAddSubnets,
    PeeringAddManagedNetworkGroup,
    PeeringAddSpokes,
    PeeringAddMesh
)


def load_arguments(self, _):

    with self.argument_context('managed-network managed-networks list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('top', id_part=None, help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', id_part=None, help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-networks show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')

    with self.argument_context('managed-network managed-networks create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('tags', tags_type, nargs='+')
        c.argument('scope_management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=PeeringAddManagementGroups, nargs='+')
        c.argument('scope_subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=PeeringAddSubscriptions, nargs='+')
        c.argument('scope_virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=PeeringAddVirtualNetworks, nargs='+')
        c.argument('scope_subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=PeeringAddSubnets, nargs='+')

    with self.argument_context('managed-network managed-networks update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('tags', tags_type, nargs='+')

    with self.argument_context('managed-network managed-networks delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')

    with self.argument_context('managed-network scope-assignments list') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scope-assignments show') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scope-assignments create') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('assigned_managed_network', id_part=None, help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scope-assignments update') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('assigned_managed_network', id_part=None, help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scope-assignments delete') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')

    with self.argument_context('managed-network managed-network-groups list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('top', id_part=None, help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', id_part=None, help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network-groups show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed-network-groups create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')
        c.argument('managed_network_group', id_part=None, help='Parameters supplied to the create/update a Managed Network Group resource', action=PeeringAddManagedNetworkGroup, nargs='+')

    with self.argument_context('managed-network managed-network-groups update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')
        c.argument('managed_network_group', id_part=None, help='Parameters supplied to the create/update a Managed Network Group resource', action=PeeringAddManagedNetworkGroup, nargs='+')

    with self.argument_context('managed-network managed-network-groups delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_group_name', id_part=None, help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed-network-peering-policies list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('top', id_part=None, help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', id_part=None, help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network-peering-policies show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network managed-network-peering-policies create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_type', arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']), id_part=None, help='Gets or sets the connectivity type of a network structure policy')
        c.argument('id', id_part=None, help='Resource Id')
        c.argument('properties_spokes', id_part=None, help='Gets or sets the spokes group IDs', action=PeeringAddSpokes, nargs='+')
        c.argument('properties_mesh', id_part=None, help='Gets or sets the mesh group IDs', action=PeeringAddMesh, nargs='+')

    with self.argument_context('managed-network managed-network-peering-policies update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_type', arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']), id_part=None, help='Gets or sets the connectivity type of a network structure policy')
        c.argument('id', id_part=None, help='Resource Id')
        c.argument('properties_spokes', id_part=None, help='Gets or sets the spokes group IDs', action=PeeringAddSpokes, nargs='+')
        c.argument('properties_mesh', id_part=None, help='Gets or sets the mesh group IDs', action=PeeringAddMesh, nargs='+')

    with self.argument_context('managed-network managed-network-peering-policies delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', id_part=None, help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', id_part=None, help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network operations list') as c:
        pass
