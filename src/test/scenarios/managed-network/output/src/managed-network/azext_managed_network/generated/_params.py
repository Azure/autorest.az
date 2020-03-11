# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements

from knack.arguments import CLIArgumentType
from azure.cli.core.commands.parameters import (
    tags_type,
    resource_group_name_type,
    get_location_type
)
from azext_managed_network.action import (
    AddManagementGroups,
    AddSubscriptions,
    AddVirtualNetworks,
    AddSubnets
)


def load_arguments(self, _):

    with self.argument_context('managed-network managed-network list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')

    with self.argument_context('managed-network managed-network create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('tags', tags_type)
        c.argument('properties_scope_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('properties_scope_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('properties_scope_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('properties_scope_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed-network update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('tags', tags_type)

    with self.argument_context('managed-network managed-network delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')

    with self.argument_context('managed-network scope-assignment list') as c:
        c.argument('scope', help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scope-assignment show') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scope-assignment create') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_assigned_managed_network', help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scope-assignment update') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_assigned_managed_network', help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scope-assignment delete') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')

    with self.argument_context('managed-network managed-network-group list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network-group show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed-network-group create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('properties_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('properties_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('properties_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed-network-group update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('properties_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('properties_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('properties_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed-network-group delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('group_name', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed-network-peering-policy list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network-peering-policy show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network managed-network-peering-policy create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties', arg_type=CLIArgumentType(options_list=['--properties'], help='Properties of a Managed Network Peering Policy'))

    with self.argument_context('managed-network managed-network-peering-policy update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('properties', arg_type=CLIArgumentType(options_list=['--properties'], help='Properties of a Managed Network Peering Policy'))

    with self.argument_context('managed-network managed-network-peering-policy delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('policy_name', help='The name of the Managed Network Peering Policy.')
