# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements

from knack.arguments import CLIArgumentType
from azure.cli.core.commands.parameters import (
    tags_type,
    get_enum_type,
    resource_group_name_type,
    get_location_type
)
from azext_managednetwork.action import (
    AddSubscriptions,
    AddVirtualNetworks,
    AddSubnets,
    AddHub,
    AddSpokes,
    AddMesh
)


def load_arguments(self, _):

    with self.argument_context('managednetwork mn list') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a pr'
                   'evious response contains a nextLink element, the value of the nextLink element will include a skipt'
                   'oken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managednetwork mn show') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')

    with self.argument_context('managednetwork mn create') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('tags', tags_type, help='Resource tags')
        c.argument('properties', arg_type=CLIArgumentType(options_list=['--properties'], help='The MNC properties'))

    with self.argument_context('managednetwork mn update') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('tags', tags_type, help='Resource tags')

    with self.argument_context('managednetwork mn delete') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')

    with self.argument_context('managednetwork scope-assignment list') as c:
        c.argument('scope', help='The base resource of the scope assignment.')

    with self.argument_context('managednetwork scope-assignment show') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')

    with self.argument_context('managednetwork scope-assignment create') as c:
        c.argument('scope', help='The base resource of the scope assignment to create. The scope can be any REST resour'
                   'ce instance. For example, use \'subscriptions/{subscription-id}\' for a subscription, \'subscriptio'
                   'ns/{subscription-id}/resourceGroups/{resource-group-name}\' for a resource group, and \'subscriptio'
                   'ns/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-t'
                   'ype}/{resource-name}\' for a resource.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to create.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('assigned_managed_network', help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managednetwork scope-assignment update') as c:
        c.argument('scope', help='The base resource of the scope assignment to create. The scope can be any REST resour'
                   'ce instance. For example, use \'subscriptions/{subscription-id}\' for a subscription, \'subscriptio'
                   'ns/{subscription-id}/resourceGroups/{resource-group-name}\' for a resource group, and \'subscriptio'
                   'ns/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-t'
                   'ype}/{resource-name}\' for a resource.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to create.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('assigned_managed_network', help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managednetwork scope-assignment delete') as c:
        c.argument('scope', help='The scope of the scope assignment to delete.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to delete.')

    with self.argument_context('managednetwork managed-network-group list') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a pr'
                   'evious response contains a nextLink element, the value of the nextLink element will include a skipt'
                   'oken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managednetwork managed-network-group show') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')
        c.ignore('managed_network_group_name')

    with self.argument_context('managednetwork managed-network-group create') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('management_groups', arg_type=CLIArgumentType(options_list=['--management-groups'], help='The collec'
                   'tion of management groups covered by the Managed Network'))
        c.argument('subscriptions', action=AddSubscriptions, nargs='+', help='The collection of subscriptions covered b'
                   'y the Managed Network')
        c.argument('virtual_networks', action=AddVirtualNetworks, nargs='+', help='The collection of virtual nets cover'
                   'ed by the Managed Network')
        c.argument('subnets', action=AddSubnets, nargs='+', help='The collection of  subnets covered by the Managed Net'
                   'work')
        c.ignore('managed_network_group_name')

    with self.argument_context('managednetwork managed-network-group update') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('management_groups', arg_type=CLIArgumentType(options_list=['--management-groups'], help='The collec'
                   'tion of management groups covered by the Managed Network'))
        c.argument('subscriptions', action=AddSubscriptions, nargs='+', help='The collection of subscriptions covered b'
                   'y the Managed Network')
        c.argument('virtual_networks', action=AddVirtualNetworks, nargs='+', help='The collection of virtual nets cover'
                   'ed by the Managed Network')
        c.argument('subnets', action=AddSubnets, nargs='+', help='The collection of  subnets covered by the Managed Net'
                   'work')
        c.ignore('managed_network_group_name')

    with self.argument_context('managednetwork managed-network-group delete') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')
        c.ignore('managed_network_group_name')

    with self.argument_context('managednetwork managed-network-peering-policy list') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a pr'
                   'evious response contains a nextLink element, the value of the nextLink element will include a skipt'
                   'oken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managednetwork managed-network-peering-policy show') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.ignore('managed_network_peering_policy_name')

    with self.argument_context('managednetwork managed-network-peering-policy hub-and-spoke-topology create') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('_type', options_list=['--type'], arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']),
                   help='Gets or sets the connectivity type of a network structure policy')
        c.argument('hub', action=AddHub, nargs='+', help='Gets or sets the hub virtual network ID')
        c.argument('spokes', action=AddSpokes, nargs='+', help='Gets or sets the spokes group IDs')
        c.argument('mesh', action=AddMesh, nargs='+', help='Gets or sets the mesh group IDs')
        c.ignore('managed_network_peering_policy_name', 'content_type', 'properties')

    with self.argument_context('managednetwork managed-network-peering-policy hub-and-spoke-topology update') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('_type', options_list=['--type'], arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']),
                   help='Gets or sets the connectivity type of a network structure policy')
        c.argument('hub', action=AddHub, nargs='+', help='Gets or sets the hub virtual network ID')
        c.argument('spokes', action=AddSpokes, nargs='+', help='Gets or sets the spokes group IDs')
        c.argument('mesh', action=AddMesh, nargs='+', help='Gets or sets the mesh group IDs')
        c.ignore('managed_network_peering_policy_name', 'content_type', 'properties')

    with self.argument_context('managednetwork managed-network-peering-policy mesh-topology create') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('_type', options_list=['--type'], arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']),
                   help='Gets or sets the connectivity type of a network structure policy')
        c.argument('hub', action=AddHub, nargs='+', help='Gets or sets the hub virtual network ID')
        c.argument('spokes', action=AddSpokes, nargs='+', help='Gets or sets the spokes group IDs')
        c.argument('mesh', action=AddMesh, nargs='+', help='Gets or sets the mesh group IDs')
        c.ignore('managed_network_peering_policy_name', 'content_type', 'properties')

    with self.argument_context('managednetwork managed-network-peering-policy mesh-topology update') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The geo-location where the resource live'
                   's')
        c.argument('_type', options_list=['--type'], arg_type=get_enum_type(['HubAndSpokeTopology', 'MeshTopology']),
                   help='Gets or sets the connectivity type of a network structure policy')
        c.argument('hub', action=AddHub, nargs='+', help='Gets or sets the hub virtual network ID')
        c.argument('spokes', action=AddSpokes, nargs='+', help='Gets or sets the spokes group IDs')
        c.argument('mesh', action=AddMesh, nargs='+', help='Gets or sets the mesh group IDs')
        c.ignore('managed_network_peering_policy_name', 'content_type', 'properties')

    with self.argument_context('managednetwork managed-network-peering-policy delete') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group.')
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.ignore('managed_network_peering_policy_name')
