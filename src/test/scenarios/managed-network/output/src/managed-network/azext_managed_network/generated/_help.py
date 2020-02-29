# coding=utf-8
# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

# pylint: disable=too-many-lines
# pylint: disable=line-too-long
from knack.help_files import helps  # pylint: disable=unused-import


helps['managed-network managednetwork'] = """
    type: group
    short-summary: managed-network managednetwork
"""

helps['managed-network managednetwork list'] = """
    type: command
    short-summary: The ListBySubscription  ManagedNetwork operation retrieves all the Managed Network Resources in the current subscription in a paginated format.
    examples:
      - name: Get Managed Network
        text: |-
               az managed-network managednetwork list
"""

helps['managed-network managednetwork show'] = """
    type: command
    short-summary: The Get ManagedNetworks operation gets a Managed Network Resource, specified by the resource group and Managed Network name
    examples:
      - name: Get Managed Network
        text: |-
               az managed-network managednetwork show
"""

helps['managed-network managednetwork create'] = """
    type: command
    short-summary: The Put ManagedNetworks operation creates/updates a Managed Network Resource, specified by resource group and Managed Network name
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network managednetwork create --location "eastus"
"""

helps['managed-network managednetwork update'] = """
    type: command
    short-summary: Updates the specified Managed Network resource tags.
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network managednetwork update
"""

helps['managed-network managednetwork delete'] = """
    type: command
    short-summary: The Delete ManagedNetworks operation deletes a Managed Network Resource, specified by the  resource group and Managed Network name
    examples:
      - name: Delete Managed Network
        text: |-
               az managed-network managednetwork delete
"""

helps['managed-network scopeassignment'] = """
    type: group
    short-summary: managed-network scopeassignment
"""

helps['managed-network scopeassignment list'] = """
    type: command
    short-summary: Get the specified scope assignment.
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network scopeassignment list --scope "subscriptions/subscriptionC"
"""

helps['managed-network scopeassignment show'] = """
    type: command
    short-summary: Get the specified scope assignment.
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network scopeassignment show --scope "subscriptions/subscriptionC"
"""

helps['managed-network scopeassignment create'] = """
    type: command
    short-summary: Creates a scope assignment.
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network scopeassignment create --scope "subscriptions/subscriptionC"
"""

helps['managed-network scopeassignment update'] = """
    type: command
    short-summary: Creates a scope assignment.
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network scopeassignment create --scope "subscriptions/subscriptionC"
"""

helps['managed-network scopeassignment delete'] = """
    type: command
    short-summary: Deletes a scope assignment.
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network scopeassignment delete --scope "subscriptions/subscriptionC"
"""

helps['managed-network managednetworkgroup'] = """
    type: group
    short-summary: managed-network managednetworkgroup
"""

helps['managed-network managednetworkgroup list'] = """
    type: command
    short-summary: The ListByManagedNetwork ManagedNetworkGroup operation retrieves all the Managed Network Groups in a specified Managed Networks in a paginated format.
    examples:
      - name: Get Managed Network Group
        text: |-
               az managed-network managednetworkgroup list
"""

helps['managed-network managednetworkgroup show'] = """
    type: command
    short-summary: The Get ManagedNetworkGroups operation gets a Managed Network Group specified by the resource group, Managed Network name, and group name
    examples:
      - name: Get Managed Network Group
        text: |-
               az managed-network managednetworkgroup show
"""

helps['managed-network managednetworkgroup create'] = """
    type: command
    short-summary: The Put ManagedNetworkGroups operation creates or updates a Managed Network Group resource
    examples:
      - name: Create/Update Managed Network Group
        text: |-
               az managed-network managednetworkgroup create
"""

helps['managed-network managednetworkgroup update'] = """
    type: command
    short-summary: The Put ManagedNetworkGroups operation creates or updates a Managed Network Group resource
    examples:
      - name: Create/Update Managed Network Group
        text: |-
               az managed-network managednetworkgroup create
"""

helps['managed-network managednetworkgroup delete'] = """
    type: command
    short-summary: The Delete ManagedNetworkGroups operation deletes a Managed Network Group specified by the resource group, Managed Network name, and group name
    examples:
      - name: Delete Managed Network Group
        text: |-
               az managed-network managednetworkgroup delete
"""

helps['managed-network managednetworkpeeringpolicy'] = """
    type: group
    short-summary: managed-network managednetworkpeeringpolicy
"""

helps['managed-network managednetworkpeeringpolicy list'] = """
    type: command
    short-summary: The ListByManagedNetwork PeeringPolicies operation retrieves all the Managed Network Peering Policies in a specified Managed Network, in a paginated format.
    examples:
      - name: Get Managed Network Group
        text: |-
               az managed-network managednetworkpeeringpolicy list
"""

helps['managed-network managednetworkpeeringpolicy show'] = """
    type: command
    short-summary: The Get ManagedNetworkPeeringPolicies operation gets a Managed Network Peering Policy resource, specified by the  resource group, Managed Network name, and peering policy name
    examples:
      - name: Get Managed Network Peering Policy
        text: |-
               az managed-network managednetworkpeeringpolicy show
"""

helps['managed-network managednetworkpeeringpolicy create'] = """
    type: command
    short-summary: The Put ManagedNetworkPeeringPolicies operation creates/updates a new Managed Network Peering Policy
    examples:
      - name: Create/Update Managed Network Peering Policy
        text: |-
               az managed-network managednetworkpeeringpolicy create
"""

helps['managed-network managednetworkpeeringpolicy update'] = """
    type: command
    short-summary: The Put ManagedNetworkPeeringPolicies operation creates/updates a new Managed Network Peering Policy
    examples:
      - name: Create/Update Managed Network Peering Policy
        text: |-
               az managed-network managednetworkpeeringpolicy create
"""

helps['managed-network managednetworkpeeringpolicy delete'] = """
    type: command
    short-summary: The Delete ManagedNetworkPeeringPolicies operation deletes a Managed Network Peering Policy, specified by the  resource group, Managed Network name, and peering policy name
    examples:
      - name: Get Managed Network Peering Policy
        text: |-
               az managed-network managednetworkpeeringpolicy delete
"""

helps['managed-network operation'] = """
    type: group
    short-summary: managed-network operation
"""

helps['managed-network operation list'] = """
    type: command
    short-summary: Lists all of the available MNC operations.
"""
