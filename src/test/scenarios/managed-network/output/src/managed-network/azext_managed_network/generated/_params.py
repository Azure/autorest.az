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
from azext_managed_network.action import (
    AddManagementGroups,
    AddSubscriptions,
    AddVirtualNetworks,
    AddSubnets,
    AddProperties
)


def load_arguments(self, _):

    with self.argument_context('managed-network managed-networks list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-networks show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')

    with self.argument_context('managed-network managed-networks create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('tags', tags_type, nargs='+')
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        c.argument('managed_network_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
=======
        c.argument('scope_management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('scope_subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('scope_virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('scope_subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
>>>>>>> updated test
=======
        c.argument('management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
>>>>>>> updated test
=======
        c.argument('managed_network_management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
>>>>>>> fix some change folder and name issue

    with self.argument_context('managed-network managed-networks update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('tags', tags_type, nargs='+')

    with self.argument_context('managed-network managed-networks delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')

<<<<<<< HEAD
<<<<<<< HEAD
    with self.argument_context('managed-network scope-assignments list') as c:
        c.argument('scope', help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scope-assignments show') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scope-assignments create') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
=======
    with self.argument_context('managed-network scope_assignments list') as c:
=======
    with self.argument_context('managed-network scope-assignments list') as c:
>>>>>>> updated test
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scope-assignments show') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scope-assignments create') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
>>>>>>> updated test
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
<<<<<<< HEAD
        c.argument('parameters_assigned_managed_network', help='The managed network ID with scope will be assigned to.')
=======
        c.argument('parameters_assigned_managed_network', id_part=None, help='The managed network ID with scope will be assigned to.')
>>>>>>> fix some change folder and name issue

<<<<<<< HEAD
<<<<<<< HEAD
    with self.argument_context('managed-network scope-assignments update') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
=======
    with self.argument_context('managed-network scope_assignments update') as c:
=======
    with self.argument_context('managed-network scope-assignments update') as c:
>>>>>>> updated test
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
>>>>>>> updated test
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
<<<<<<< HEAD
        c.argument('parameters_assigned_managed_network', help='The managed network ID with scope will be assigned to.')
=======
        c.argument('parameters_assigned_managed_network', id_part=None, help='The managed network ID with scope will be assigned to.')
>>>>>>> fix some change folder and name issue

<<<<<<< HEAD
<<<<<<< HEAD
    with self.argument_context('managed-network scope-assignments delete') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
=======
    with self.argument_context('managed-network scope_assignments delete') as c:
=======
    with self.argument_context('managed-network scope-assignments delete') as c:
>>>>>>> updated test
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
>>>>>>> updated test

    with self.argument_context('managed-network managed-network-groups list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network-groups show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed-network-groups create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
<<<<<<< HEAD
        c.argument('managed_network_group_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_group_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_group_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
=======
        c.argument('managed_network_group_management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_group_subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_group_subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
>>>>>>> fix some change folder and name issue

    with self.argument_context('managed-network managed-network-groups update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
<<<<<<< HEAD
        c.argument('managed_network_group_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_group_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_group_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
=======
        c.argument('managed_network_group_management_groups', id_part=None, help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_group_subscriptions', id_part=None, help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtual_networks', id_part=None, help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_group_subnets', id_part=None, help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')
>>>>>>> fix some change folder and name issue

    with self.argument_context('managed-network managed-network-groups delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed-network-peering-policies list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed-network-peering-policies show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network managed-network-peering-policies create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
<<<<<<< HEAD
        c.argument('managed_network_policy_properties', help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')
=======
        c.argument('managed_network_policy_properties', id_part=None, help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')
>>>>>>> fix some change folder and name issue

    with self.argument_context('managed-network managed-network-peering-policies update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
<<<<<<< HEAD
        c.argument('managed_network_policy_properties', help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')
=======
        c.argument('managed_network_policy_properties', id_part=None, help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')
>>>>>>> fix some change folder and name issue

    with self.argument_context('managed-network managed-network-peering-policies delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network operations list') as c:
        pass
