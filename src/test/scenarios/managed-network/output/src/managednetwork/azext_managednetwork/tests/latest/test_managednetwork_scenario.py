# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import os
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import ScenarioTest
from azure.cli.testsdk import ResourceGroupPreparer
from .preparers import VirtualNetworkPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


class ManagedNetworkManagementClientScenarioTest(ScenarioTest):

    def current_subscription(self):
        subs = self.cmd('az account show').get_output_in_json()
        return subs['id']

    @ResourceGroupPreparer(name_prefix='cli_test_managednetwork_myResourceGroup'[:9], key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managednetwork_VnetC'[:9], key='vn', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managednetwork_VnetA'[:9], key='vn_2', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managednetwork_VnetB'[:9], key='vn_3', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managednetwork_myHubVnet'[:9], key='vn_4', resource_group_key='rg')
    def test_managednetwork(self, resource_group):

        self.kwargs.update({
            'subscription_id': self.current_subscription()
        })

        self.kwargs.update({
            'myManagedNetwork': self.create_random_name(prefix='cli_test_managed_networks'[:9], length=24),
            'subscriptionCAssignment': self.create_random_name(prefix='cli_test_scope_assignments'[:9], length=24),
            'myManagedNetworkGroup1': self.create_random_name(prefix='cli_test_managed_network_groups'[:9], length=24),
            'myHubAndSpoke': self.create_random_name(prefix='cli_test_managed_network_peering_policies'[:9], length=24),
        })

        # EXAMPLE: ManagedNetworksPut
        self.cmd('az managed-network managed-network create '
                 '--location "eastus" '
                 '--properties "{{\\"scope\\":{{\\"managementGroups\\":[{{\\"id\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0001-0000-0000-000000000000\\"}},{{\\"id\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0002-0000-0000-000000000000\\"}}],\\"subnets\\":[{{\\"id\\":\\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn}/subnets/default\\"}},{{\\"id\\":\\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn}/subnets/default\\"}}],\\"subscriptions\\":[{{\\"id\\":\\"subscriptionA\\"}},{{\\"id\\":\\"subscriptionB\\"}}],\\"virtualNetworks\\":[{{\\"id\\":\\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn_2}\\"}},{{\\"id\\":\\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn_3}\\"}}]}}}}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagementNetworkGroupsPut
        self.cmd('az managed-network managed-network-group create '
                 '--properties-management-groups "[]" '
                 '--properties-subnets id=/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetA/subnets/subnetA '
                 '--properties-virtual-networks id=/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetA '
                 '--properties-virtual-networks id=/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetB '
                 '--group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ScopeAssignmentsPut
        self.cmd('az managed-network scope-assignment create '
                 '--properties-assigned-managed-network "/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.ManagedNetwork/managedNetworks/{myManagedNetwork}" '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        # EXAMPLE: ManagedNetworkPeeringPoliciesPut
        self.cmd('az managed-network managed-network-peering-policy create '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--policy-name "{myHubAndSpoke}" '
                 '--properties "{{\\"type\\":\\"HubAndSpokeTopology\\",\\"hub\\":{{\\"id\\":\\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn_4}\\"}},\\"spokes\\":[{{\\"id\\":\\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.ManagedNetwork/managedNetworks/{myManagedNetwork}/managedNetworkGroups/{myManagedNetworkGroup1}\\"}}]}}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworksGet
        self.cmd('az managed-network managed-network show '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworksListByResourceGroup
        self.cmd('az managed-network managed-network list '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworksListBySubscription
        self.cmd('az managed-network managed-network list',
                 checks=[])

        # EXAMPLE: ScopeAssignmentsGet
        self.cmd('az managed-network scope-assignment show '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        # EXAMPLE: ScopeAssignmentsList
        self.cmd('az managed-network scope-assignment list '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        # EXAMPLE: ManagementNetworkGroupsGet
        self.cmd('az managed-network managed-network-group show '
                 '--group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworksGroupsListByManagedNetwork
        self.cmd('az managed-network managed-network-group list '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworkPeeringPoliciesGet
        self.cmd('az managed-network managed-network-peering-policy show '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--policy-name "{myHubAndSpoke}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworkPeeringPoliciesListByManagedNetwork
        self.cmd('az managed-network managed-network-peering-policy list '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworkPeeringPoliciesDelete
        self.cmd('az managed-network managed-network-peering-policy delete '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--policy-name "{myHubAndSpoke}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ScopeAssignmentsDelete
        self.cmd('az managed-network scope-assignment delete '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        # EXAMPLE: ManagementNetworkGroupsDelete
        self.cmd('az managed-network managed-network-group delete '
                 '--group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: ManagedNetworksDelete
        self.cmd('az managed-network managed-network delete '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])
