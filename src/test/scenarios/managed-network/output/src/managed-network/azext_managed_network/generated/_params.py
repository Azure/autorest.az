# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements

from azure.cli.core.commands.parameters import (
    tags_type,
    resource_group_name_type,
    get_location_type
)
from azext_managed_network.actions import (
    AddManagementgroups,
    AddSubscriptions,
    AddVirtualnetworks,
    AddSubnets,
    AddProperties
)


def load_arguments(self, _):

    with self.argument_context('managed-network managednetwork list') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managednetwork show') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')

    with self.argument_context('managed-network managednetwork create') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('tags', tags_type, nargs='+')
        c.argument('managed_network_managementgroups', help='The collection of management groups covered by the Managed Network', action=AddManagementgroups, nargs='+')
        c.argument('managed_network_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_virtualnetworks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualnetworks, nargs='+')
        c.argument('managed_network_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managednetwork update') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('tags', tags_type, nargs='+')

    with self.argument_context('managed-network managednetwork delete') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')

    with self.argument_context('managed-network scopeassignment list') as c:
        c.argument('scope', help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scopeassignment show') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scopeassignmentname', help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scopeassignment create') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scopeassignmentname', help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('parameters_assignedmanagednetwork', help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scopeassignment update') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scopeassignmentname', help='The name of the scope assignment to get.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('parameters_assignedmanagednetwork', help='The managed network ID with scope will be assigned to.')

    with self.argument_context('managed-network scopeassignment delete') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scopeassignmentname', help='The name of the scope assignment to get.')

    with self.argument_context('managed-network managednetworkgroup list') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managednetworkgroup show') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkgroupname', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managednetworkgroup create') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkgroupname', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_group_managementgroups', help='The collection of management groups covered by the Managed Network', action=AddManagementgroups, nargs='+')
        c.argument('managed_network_group_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtualnetworks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualnetworks, nargs='+')
        c.argument('managed_network_group_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managednetworkgroup update') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkgroupname', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_group_managementgroups', help='The collection of management groups covered by the Managed Network', action=AddManagementgroups, nargs='+')
        c.argument('managed_network_group_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtualnetworks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualnetworks, nargs='+')
        c.argument('managed_network_group_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managednetworkgroup delete') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkgroupname', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managednetworkpeeringpolicy list') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managednetworkpeeringpolicy show') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkpeeringpolicyname', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network managednetworkpeeringpolicy create') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkpeeringpolicyname', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_policy_properties', help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')

    with self.argument_context('managed-network managednetworkpeeringpolicy update') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkpeeringpolicyname', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_policy_properties', help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')

    with self.argument_context('managed-network managednetworkpeeringpolicy delete') as c:
        c.argument('resourcegroupname', help='The name of the resource group.')
        c.argument('managednetworkname', help='The name of the Managed Network.')
        c.argument('managednetworkpeeringpolicyname', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network operation list') as c:
        pass
