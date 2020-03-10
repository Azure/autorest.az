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
from .preparers import VnetSubnetPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


class ManagedNetworkManagementClientScenarioTest(ScenarioTest):

    def current_subscription(self):
        subs = self.cmd('az account show').get_output_in_json()
        return subs['id']

    @ResourceGroupPreparer(name_prefix='cli_test_managed_network_myResourceGroup'[:9], key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managed_network_VnetC'[:9], key='vn', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managed_network_VnetA'[:9], key='vn_2', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managed_network_VnetB'[:9], key='vn_3', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='cli_test_managed_network_myHubVnet'[:9], key='vn_4', resource_group_key='rg')
    @VnetSubnetPreparer(name_prefix='cli_test_managed_network_subnetA'[:9], key='sn', resource_group_key='rg', vnet_key='vn')
    @VnetSubnetPreparer(name_prefix='cli_test_managed_network_subnetB'[:9], key='sn_2', resource_group_key='rg', vnet_key='vn')
    def test_managed_network(self, resource_group):

        self.kwargs.update({
            'subscription_id': self.current_subscription()
        })

        self.kwargs.update({
            'myManagedNetwork': self.create_random_name(prefix='cli_test_managed_networks'[:9], length=24),
            'subscriptionCAssignment': self.create_random_name(prefix='cli_test_scope_assignments'[:9], length=24),
            'myManagedNetworkGroup1': self.create_random_name(prefix='cli_test_managed_network_groups'[:9], length=24),
            'myHubAndSpoke': self.create_random_name(prefix='cli_test_managed_network_peering_policies'[:9], length=24),
        })

        self.cmd('az managed-network managed-network create '
                 '--location "eastus" '
                 '--properties-scope-management-groups "id=/providers/Microsoft.Management/managementGroups/20000000-0001-0000-0000-000000000000" '
                 '--properties-scope-management-groups "id=/providers/Microsoft.Management/managementGroups/20000000-0002-0000-0000-000000000000" '
                 '--properties-scope-subnets "id=/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn}/subnets/{sn}" '
                 '--properties-scope-subnets "id=/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn}/subnets/{sn_2}" '
                 '--properties-scope-subscriptions "id=subscriptionA" '
                 '--properties-scope-subscriptions "id=subscriptionB" '
                 '--properties-scope-virtual-networks "id=/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn_2}" '
                 '--properties-scope-virtual-networks "id=/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn_3}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network-group create '
                 '--properties-subnets "id=/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetA/subnets/subnetA" '
                 '--properties-virtual-networks "id=/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetA" '
                 '--properties-virtual-networks "id=/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetB" '
                 '--managed-network-group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network scope-assignment create '
                 '--properties-assigned-managed-network "/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.ManagedNetwork/managedNetworks/{myManagedNetwork}" '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy create '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--managed-network-peering-policy-name "{myHubAndSpoke}" '
                 '--properties "{\"type\":\"HubAndSpokeTopology\",\"hub\":{\"id\":\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vn_4}\"},\"spokes\":[{\"id\":\"/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.ManagedNetwork/managedNetworks/{myManagedNetwork}/managedNetworkGroups/{myManagedNetworkGroup1}\"}]}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network show '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network list '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network list',
                 checks=[])

        self.cmd('az managed-network scope-assignment show '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        self.cmd('az managed-network scope-assignment list '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network managed-network-group show '
                 '--managed-network-group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network-group list '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy show '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--managed-network-peering-policy-name "{myHubAndSpoke}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy list '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy delete '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--managed-network-peering-policy-name "{myHubAndSpoke}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network scope-assignment delete '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        self.cmd('az managed-network managed-network-group delete '
                 '--managed-network-group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network delete '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])
