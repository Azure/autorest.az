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
    AddManagementGroups,
    AddSubscriptions,
    AddVirtualNetworks,
    AddSubnets,
    AddProperties
)


def load_arguments(self, _):

    with self.argument_context('managed-network managed_networks list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed_networks show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')

    with self.argument_context('managed-network managed_networks create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('tags', tags_type, nargs='+')
        c.argument('managed_network_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed_networks update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('tags', tags_type, nargs='+')

    with self.argument_context('managed-network managed_networks delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')

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
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')

    with self.argument_context('managed-network scope_assignments show') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')

    with self.argument_context('managed-network scope_assignments create') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
>>>>>>> updated test
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('parameters_assigned_managed_network', help='The managed network ID with scope will be assigned to.')

<<<<<<< HEAD
    with self.argument_context('managed-network scope-assignments update') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
=======
    with self.argument_context('managed-network scope_assignments update') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
>>>>>>> updated test
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('parameters_assigned_managed_network', help='The managed network ID with scope will be assigned to.')

<<<<<<< HEAD
    with self.argument_context('managed-network scope-assignments delete') as c:
        c.argument('scope', help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', help='The name of the scope assignment to get.')
=======
    with self.argument_context('managed-network scope_assignments delete') as c:
        c.argument('scope', id_part=None, help='The base resource of the scope assignment.')
        c.argument('scope_assignment_name', id_part=None, help='The name of the scope assignment to get.')
>>>>>>> updated test

    with self.argument_context('managed-network managed_network_groups list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed_network_groups show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed_network_groups create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_group_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_group_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_group_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed_network_groups update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_group_management_groups', help='The collection of management groups covered by the Managed Network', action=AddManagementGroups, nargs='+')
        c.argument('managed_network_group_subscriptions', help='The collection of subscriptions covered by the Managed Network', action=AddSubscriptions, nargs='+')
        c.argument('managed_network_group_virtual_networks', help='The collection of virtual nets covered by the Managed Network', action=AddVirtualNetworks, nargs='+')
        c.argument('managed_network_group_subnets', help='The collection of  subnets covered by the Managed Network', action=AddSubnets, nargs='+')

    with self.argument_context('managed-network managed_network_groups delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_group_name', help='The name of the Managed Network Group.')

    with self.argument_context('managed-network managed_network_peering_policies list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('top', help='May be used to limit the number of results in a page for list queries.')
        c.argument('skiptoken', help='Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.')

    with self.argument_context('managed-network managed_network_peering_policies show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network managed_network_peering_policies create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_policy_properties', help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')

    with self.argument_context('managed-network managed_network_peering_policies update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx))
        c.argument('managed_network_policy_properties', help='Properties of a Managed Network Peering Policy', action=AddProperties, nargs='+')

    with self.argument_context('managed-network managed_network_peering_policies delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('managed_network_name', help='The name of the Managed Network.')
        c.argument('managed_network_peering_policy_name', help='The name of the Managed Network Peering Policy.')

    with self.argument_context('managed-network operations list') as c:
        pass
