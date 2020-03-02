# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import os
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import (ScenarioTest, ResourceGroupPreparer)


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


class ManagedNetworkManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_managed_network')
    def test_managed_network(self, resource_group):

        self.cmd('az managed-network managed-network create '
                 '--location "eastus" '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-group create '
                 '--managed-network-group-name "myManagedNetworkGroup1" '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network scope-assignment create '
                 '--assigned-managed-network "/subscriptions/subscriptionA/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/managedNetworks/myManagedNetwork" '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "subscriptionCAssignment"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy create '
                 '--managed-network-name "myManagedNetwork" '
                 '--managed-network-peering-policy-name "myHubAndSpoke" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network show '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        # EXAMPLE NOT FOUND: ManagedNetworksListByResourceGroup

        self.cmd('az managed-network managed-network list',
                 checks=[])

        self.cmd('az managed-network scope-assignment show '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "subscriptionCAssignment"',
                 checks=[])

        self.cmd('az managed-network scope-assignment list '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network managed-network-group show '
                 '--managed-network-group-name "myManagedNetworkGroup1" '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-group list '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy show '
                 '--managed-network-name "myManagedNetwork" '
                 '--managed-network-peering-policy-name "myHubAndSpoke" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy list '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy delete '
                 '--managed-network-name "myManagedNetwork" '
                 '--managed-network-peering-policy-name "myHubAndSpoke" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network scope-assignment delete '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "subscriptionCAssignment"',
                 checks=[])

        self.cmd('az managed-network managed-network-group delete '
                 '--managed-network-group-name "myManagedNetworkGroup1" '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network delete '
                 '--managed-network-name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])
