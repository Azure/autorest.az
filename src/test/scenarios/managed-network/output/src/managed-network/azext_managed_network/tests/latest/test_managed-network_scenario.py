# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import os
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import ScenarioTest
from azure.cli.testsdk import ResourceGroupPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


class ManagedNetworkManagementClientScenarioTest(ScenarioTest):

    def current_subscription(self):
        subs = self.cmd('az account show').get_output_in_json()
        return subs['id']

    @ResourceGroupPreparer(name_prefix='cli_test_managed_network_myResourceGroup', key='rg')
    def test_managed_network(self, resource_group):

        self.kwargs.update({
            'subscription_id': self.current_subscription()
        })

        self.kwargs.update({
            'myManagedNetwork': self.create_random_name(prefix='managed_networks', length=24)
            'subscriptionCAssignment': self.create_random_name(prefix='scope_assignments', length=24)
            'myManagedNetworkGroup1': self.create_random_name(prefix='managed_network_groups', length=24)
            'myHubAndSpoke': self.create_random_name(prefix='managed_network_peering_policies', length=24)
        })

        self.cmd('az managed-network managed-network create '
                 '--location "eastus" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network-group create '
                 '--managed-network-group-name "{myManagedNetworkGroup1}" '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network scope-assignment create '
                 '--assigned-managed-network "/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.ManagedNetwork/managedNetworks/{myManagedNetwork}" '
                 '--scope "subscriptions/subscriptionC" '
                 '--scope-assignment-name "{subscriptionCAssignment}"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policy create '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--managed-network-peering-policy-name "{myHubAndSpoke}" '
                 '--resource-group "{rg}"',
                 checks=[])

        self.cmd('az managed-network managed-network show '
                 '--managed-network-name "{myManagedNetwork}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE NOT FOUND: ManagedNetworksListByResourceGroup

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
