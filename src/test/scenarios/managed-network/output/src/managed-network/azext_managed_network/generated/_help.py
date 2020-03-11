# coding=utf-8
# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

# pylint: disable=too-many-lines
# pylint: disable=line-too-long
from knack.help_files import helps  # pylint: disable=unused-import


helps['managed-network managed-network'] = """
    type: group
    short-summary: managed-network managed-network
"""

helps['managed-network managed-network list'] = """
    type: command
    short-summary: The ListBySubscription  ManagedNetwork operation retrieves all the Managed Network Resources in the current subscription in a paginated format.
"""

helps['managed-network managed-network show'] = """
    type: command
    short-summary: The Get ManagedNetworks operation gets a Managed Network Resource, specified by the resource group and Managed Network name
"""

helps['managed-network managed-network create'] = """
    type: command
    short-summary: The Put ManagedNetworks operation creates/updates a Managed Network Resource, specified by resource group and Managed Network name
"""

helps['managed-network managed-network update'] = """
    type: command
    short-summary: Updates the specified Managed Network resource tags.
"""

helps['managed-network managed-network delete'] = """
    type: command
    short-summary: The Delete ManagedNetworks operation deletes a Managed Network Resource, specified by the  resource group and Managed Network name
"""

helps['managed-network scope-assignment'] = """
    type: group
    short-summary: managed-network scope-assignment
"""

helps['managed-network scope-assignment list'] = """
    type: command
    short-summary: Get the specified scope assignment.
"""

helps['managed-network scope-assignment show'] = """
    type: command
    short-summary: Get the specified scope assignment.
"""

helps['managed-network scope-assignment create'] = """
    type: command
    short-summary: Creates a scope assignment.
"""

helps['managed-network scope-assignment update'] = """
    type: command
    short-summary: Creates a scope assignment.
"""

helps['managed-network scope-assignment delete'] = """
    type: command
    short-summary: Deletes a scope assignment.
"""

helps['managed-network managed-network-group'] = """
    type: group
    short-summary: managed-network managed-network-group
"""

helps['managed-network managed-network-group list'] = """
    type: command
    short-summary: The ListByManagedNetwork ManagedNetworkGroup operation retrieves all the Managed Network Groups in a specified Managed Networks in a paginated format.
"""

helps['managed-network managed-network-group show'] = """
    type: command
    short-summary: The Get ManagedNetworkGroups operation gets a Managed Network Group specified by the resource group, Managed Network name, and group name
"""

helps['managed-network managed-network-group create'] = """
    type: command
    short-summary: The Put ManagedNetworkGroups operation creates or updates a Managed Network Group resource
"""

helps['managed-network managed-network-group update'] = """
    type: command
    short-summary: The Put ManagedNetworkGroups operation creates or updates a Managed Network Group resource
"""

helps['managed-network managed-network-group delete'] = """
    type: command
    short-summary: The Delete ManagedNetworkGroups operation deletes a Managed Network Group specified by the resource group, Managed Network name, and group name
"""

helps['managed-network managed-network-peering-policy'] = """
    type: group
    short-summary: managed-network managed-network-peering-policy
"""

helps['managed-network managed-network-peering-policy list'] = """
    type: command
    short-summary: The ListByManagedNetwork PeeringPolicies operation retrieves all the Managed Network Peering Policies in a specified Managed Network, in a paginated format.
"""

helps['managed-network managed-network-peering-policy show'] = """
    type: command
    short-summary: The Get ManagedNetworkPeeringPolicies operation gets a Managed Network Peering Policy resource, specified by the  resource group, Managed Network name, and peering policy name
"""

helps['managed-network managed-network-peering-policy create'] = """
    type: command
    short-summary: The Put ManagedNetworkPeeringPolicies operation creates/updates a new Managed Network Peering Policy
"""

helps['managed-network managed-network-peering-policy update'] = """
    type: command
    short-summary: The Put ManagedNetworkPeeringPolicies operation creates/updates a new Managed Network Peering Policy
"""

helps['managed-network managed-network-peering-policy delete'] = """
    type: command
    short-summary: The Delete ManagedNetworkPeeringPolicies operation deletes a Managed Network Peering Policy, specified by the  resource group, Managed Network name, and peering policy name
"""
