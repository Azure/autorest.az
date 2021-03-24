# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------
# pylint: disable=too-many-lines

from knack.help_files import helps


helps['managed-network'] = '''
    type: group
    short-summary: Manage Managed Network
'''

helps['managed-network mn'] = """
    type: group
    short-summary: Manage mn with managed network
"""

helps['managed-network mn list'] = """
    type: command
    short-summary: "The ListByResourceGroup ManagedNetwork operation retrieves all the Managed Network resources in a \
resource group in a paginated format. And The ListBySubscription  ManagedNetwork operation retrieves all the Managed \
Network Resources in the current subscription in a paginated format."
    examples:
      - name: Get Managed Network
        text: |-
               az managed-network mn list --resource-group "myResourceGroup"
      - name: Get Managed Network
        text: |-
               az managed-network mn list
"""

helps['managed-network mn create'] = """
    type: command
    short-summary: "The Put ManagedNetworks operation Create a Managed Network Resource, specified by resource group \
and Managed Network name."
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network mn create --managed-network "{\\"location\\":\\"eastus\\",\\"tags\\":{},\\"management\
Groups\\":[{\\"id\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0001-0000-0000-000000000000\\"},{\\"i\
d\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0002-0000-0000-000000000000\\"}],\\"subscriptions\\":\
[{\\"id\\":\\"subscriptionA\\"},{\\"id\\":\\"subscriptionB\\"}],\\"virtualNetworks\\":[{\\"id\\":\\"/subscriptions/subs\
criptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork\\"},{\\"id\\":\\"\
/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwor\
k2\\"}],\\"subnets\\":[{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Net\
work/virtualNetworks/myVirtualNetwork3/subnets/mySubnet\\"},{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/my\
ResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork3/subnets/mySubnet2\\"}]}" --name \
"myManagedNetwork" --resource-group "myResourceGroup"
"""

helps['managed-network mn update'] = """
    type: command
    short-summary: "Updates the specified Managed Network resource tags."
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network mn update --name "myManagedNetwork" --resource-group "myResourceGroup"
"""

helps['managed-network mn delete'] = """
    type: command
    short-summary: "The Delete ManagedNetworks operation deletes a Managed Network Resource, specified by the  \
resource group and Managed Network name."
    examples:
      - name: Delete Managed Network
        text: |-
               az managed-network mn delete --name "myManagedNetwork" --resource-group "myResourceGroup"
"""

helps['managed-network mn show-modify'] = """
    type: command
    short-summary: "The Get ManagedNetworks operation gets a Managed Network Resource, specified by the resource group \
and Managed Network name."
    examples:
      - name: Get Managed Network
        text: |-
               az managed-network mn show-modify --name "myManagedNetwork" --resource-group "myResourceGroup"
"""

helps['managed-network mn scope-assignment'] = """
    type: group
    short-summary: Manage scope assignment with managed network
"""

helps['managed-network mn scope-assignment list'] = """
    type: command
    short-summary: "Get the specified scope assignment."
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network mn scope-assignment list --scope "subscriptions/subscriptionC"
"""

helps['managed-network mn scope-assignment show'] = """
    type: command
    short-summary: "Get the specified scope assignment."
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network mn scope-assignment show --scope "subscriptions/subscriptionC" --name \
"myScopeAssignment"
"""

helps['managed-network mn scope-assignment create'] = """
    type: command
    short-summary: "Creates a scope assignment."
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network mn scope-assignment create --assigned-managed-network "/subscriptions/subscriptionA/r\
esourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/managedNetworks/myManagedNetwork" --scope \
"subscriptions/subscriptionC" --name "myScopeAssignment"
"""

helps['managed-network mn scope-assignment update'] = """
    type: command
    short-summary: "Update a scope assignment."
"""

helps['managed-network mn scope-assignment delete'] = """
    type: command
    short-summary: "Deletes a scope assignment."
    examples:
      - name: Create/Update Managed Network
        text: |-
               az managed-network mn scope-assignment delete --scope "subscriptions/subscriptionC" --name \
"myScopeAssignment"
"""

helps['managed-network mn group'] = """
    type: group
    short-summary: Manage managed network group with managed network
"""

helps['managed-network mn group list'] = """
    type: command
    short-summary: "The ListByManagedNetwork ManagedNetworkGroup operation retrieves all the Managed Network Groups in \
a specified Managed Networks in a paginated format."
    examples:
      - name: Get Managed Network Group
        text: |-
               az managed-network mn group list --managed-network-name "myManagedNetwork" --resource-group \
"myResourceGroup"
"""

helps['managed-network mn group show'] = """
    type: command
    short-summary: "The Get ManagedNetworkGroups operation gets a Managed Network Group specified by the resource \
group, Managed Network name, and group name."
    examples:
      - name: Get Managed Network Group
        text: |-
               az managed-network mn group show --group-name "myManagedNetworkGroup" --managed-network-name \
"myManagedNetwork" --resource-group "myResourceGroup"
"""

helps['managed-network mn group create'] = """
    type: command
    short-summary: "The Put ManagedNetworkGroups operation Create a Managed Network Group resource."
    parameters:
      - name: --subscriptions
        short-summary: "The collection of subscriptions covered by the Managed Network"
        long-summary: |
            Usage: --subscriptions id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --subscriptions argument.
      - name: --virtual-networks
        short-summary: "The collection of virtual nets covered by the Managed Network"
        long-summary: |
            Usage: --virtual-networks id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --virtual-networks argument.
      - name: --subnets
        short-summary: "The collection of  subnets covered by the Managed Network"
        long-summary: |
            Usage: --subnets id=XX id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --subnets argument.
    examples:
      - name: Create/Update Managed Network Group
        text: |-
               az managed-network mn group create --management-groups "[]" --subnets id="/subscriptions/subscriptionB/r\
esourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork/subnets/mySubnet" \
id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNe\
twork2/subnets/mySubnet2" --virtual-networks id="/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Netw\
ork/virtualNetworks/VnetA" --virtual-networks id="/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Net\
work/virtualNetworks/VnetB" --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" \
--resource-group "myResourceGroup"
"""

helps['managed-network mn group update'] = """
    type: command
    short-summary: "The Put ManagedNetworkGroups operation Update a Managed Network Group resource."
    parameters:
      - name: --subscriptions
        short-summary: "The collection of subscriptions covered by the Managed Network"
        long-summary: |
            Usage: --subscriptions id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --subscriptions argument.
      - name: --virtual-networks
        short-summary: "The collection of virtual nets covered by the Managed Network"
        long-summary: |
            Usage: --virtual-networks id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --virtual-networks argument.
      - name: --subnets
        short-summary: "The collection of  subnets covered by the Managed Network"
        long-summary: |
            Usage: --subnets id=XX id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --subnets argument.
"""

helps['managed-network mn group delete'] = """
    type: command
    short-summary: "The Delete ManagedNetworkGroups operation deletes a Managed Network Group specified by the \
resource group, Managed Network name, and group name."
    examples:
      - name: Delete Managed Network Group
        text: |-
               az managed-network mn group delete --group-name "myManagedNetworkGroup" --managed-network-name \
"myManagedNetwork" --resource-group "myResourceGroup"
"""

helps['managed-network mn group wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the managed-network mn group is met.
    examples:
      - name: Pause executing next line of CLI script until the managed-network mn group is successfully created.
        text: |-
               az managed-network mn group wait --group-name "myManagedNetworkGroup" --managed-network-name \
"myManagedNetwork" --resource-group "myResourceGroup" --created
      - name: Pause executing next line of CLI script until the managed-network mn group is successfully updated.
        text: |-
               az managed-network mn group wait --group-name "myManagedNetworkGroup" --managed-network-name \
"myManagedNetwork" --resource-group "myResourceGroup" --updated
      - name: Pause executing next line of CLI script until the managed-network mn group is successfully deleted.
        text: |-
               az managed-network mn group wait --group-name "myManagedNetworkGroup" --managed-network-name \
"myManagedNetwork" --resource-group "myResourceGroup" --deleted
"""

helps['managed-network managed-network-peering-policy'] = """
    type: group
    short-summary: Manage managed network peering policy with managed network
"""

helps['managed-network managed-network-peering-policy list'] = """
    type: command
    short-summary: "The ListByManagedNetwork PeeringPolicies operation retrieves all the Managed Network Peering \
Policies in a specified Managed Network, in a paginated format."
    examples:
      - name: Get Managed Network Group
        text: |-
               az managed-network managed-network-peering-policy list --managed-network-name "myManagedNetwork" \
--resource-group "myResourceGroup"
"""

helps['managed-network managed-network-peering-policy show'] = """
    type: command
    short-summary: "The Get ManagedNetworkPeeringPolicies operation gets a Managed Network Peering Policy resource, \
specified by the  resource group, Managed Network name, and peering policy name."
    examples:
      - name: Get Managed Network Peering Policy
        text: |-
               az managed-network managed-network-peering-policy show --managed-network-name "myManagedNetwork" \
--policy-name "myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup"
"""

helps['managed-network managed-network-peering-policy hub-and-spoke-topology'] = """
    type: group
    short-summary: Manage managed network peering policy with managed network sub group hub-and-spoke-topology
"""

helps['managed-network managed-network-peering-policy hub-and-spoke-topology create'] = """
    type: command
    short-summary: "The Put ManagedNetworkPeeringPolicies operation Create a new Managed Network Peering Policy."
    parameters:
      - name: --hub
        short-summary: "Gets or sets the hub virtual network ID"
        long-summary: |
            Usage: --hub id=XX

            id: Resource Id
      - name: --spokes
        short-summary: "Gets or sets the spokes group IDs"
        long-summary: |
            Usage: --spokes id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --spokes argument.
      - name: --mesh
        short-summary: "Gets or sets the mesh group IDs"
        long-summary: |
            Usage: --mesh id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --mesh argument.
    examples:
      - name: Create/Update Managed Network Peering Policy
        text: |-
               az managed-network managed-network-peering-policy hub-and-spoke-topology create --managed-network-name \
"myManagedNetwork" --policy-name "myManagedNetworkPeeringPolicy" --managed-network-policy "lslsd" --hub \
id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNe\
twork4" --spokes id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/man\
agedNetworks/myManagedNetwork/managedNetworkGroups/myManagedNetworkGroup" --resource-group "myResourceGroup"
"""

helps['managed-network managed-network-peering-policy mesh-topology'] = """
    type: group
    short-summary: Manage managed network peering policy with managed network sub group mesh-topology
"""

helps['managed-network managed-network-peering-policy mesh-topology create'] = """
    type: command
    short-summary: "The Put ManagedNetworkPeeringPolicies operation Create a new Managed Network Peering Policy."
    parameters:
      - name: --hub
        short-summary: "Gets or sets the hub virtual network ID"
        long-summary: |
            Usage: --hub id=XX

            id: Resource Id
      - name: --spokes
        short-summary: "Gets or sets the spokes group IDs"
        long-summary: |
            Usage: --spokes id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --spokes argument.
      - name: --mesh
        short-summary: "Gets or sets the mesh group IDs"
        long-summary: |
            Usage: --mesh id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --mesh argument.
"""

helps['managed-network managed-network-peering-policy hub-and-spoke-topology update'] = """
    type: command
    short-summary: "The Put ManagedNetworkPeeringPolicies operation Update a new Managed Network Peering Policy."
    parameters:
      - name: --hub
        short-summary: "Gets or sets the hub virtual network ID"
        long-summary: |
            Usage: --hub id=XX

            id: Resource Id
      - name: --spokes
        short-summary: "Gets or sets the spokes group IDs"
        long-summary: |
            Usage: --spokes id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --spokes argument.
      - name: --mesh
        short-summary: "Gets or sets the mesh group IDs"
        long-summary: |
            Usage: --mesh id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --mesh argument.
    examples:
      - name: Create/Update Managed Network Peering Policy
        text: |-
               az managed-network managed-network-peering-policy hub-and-spoke-topology update --managed-network-name \
"myManagedNetwork" --policy-name "myManagedNetworkPeeringPolicy" --managed-network-policy "lslsd" --hub \
id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNe\
twork4" --spokes id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/man\
agedNetworks/myManagedNetwork/managedNetworkGroups/myManagedNetworkGroup" --resource-group "myResourceGroup"
"""

helps['managed-network managed-network-peering-policy mesh-topology update'] = """
    type: command
    short-summary: "The Put ManagedNetworkPeeringPolicies operation Update a new Managed Network Peering Policy."
    parameters:
      - name: --hub
        short-summary: "Gets or sets the hub virtual network ID"
        long-summary: |
            Usage: --hub id=XX

            id: Resource Id
      - name: --spokes
        short-summary: "Gets or sets the spokes group IDs"
        long-summary: |
            Usage: --spokes id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --spokes argument.
      - name: --mesh
        short-summary: "Gets or sets the mesh group IDs"
        long-summary: |
            Usage: --mesh id=XX

            id: Resource Id

            Multiple actions can be specified by using more than one --mesh argument.
"""

helps['managed-network managed-network-peering-policy delete'] = """
    type: command
    short-summary: "The Delete ManagedNetworkPeeringPolicies operation deletes a Managed Network Peering Policy, \
specified by the  resource group, Managed Network name, and peering policy name."
    examples:
      - name: Get Managed Network Peering Policy
        text: |-
               az managed-network managed-network-peering-policy delete --managed-network-name "myManagedNetwork" \
--policy-name "myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup"
"""

helps['managed-network managed-network-peering-policy wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the managed-network \
managed-network-peering-policy is met.
    examples:
      - name: Pause executing next line of CLI script until the managed-network managed-network-peering-policy is \
successfully created.
        text: |-
               az managed-network managed-network-peering-policy wait --managed-network-name "myManagedNetwork" \
--policy-name "myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup" --created
      - name: Pause executing next line of CLI script until the managed-network managed-network-peering-policy is \
successfully deleted.
        text: |-
               az managed-network managed-network-peering-policy wait --managed-network-name "myManagedNetwork" \
--policy-name "myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup" --deleted
"""
