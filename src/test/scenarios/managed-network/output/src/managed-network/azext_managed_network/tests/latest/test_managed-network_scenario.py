# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import os
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import (ScenarioTest, ResourceGroupPreparer)


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


class ManagedNetworkScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_managed_network')
    def test_managed_network(self, resource_group):

        self.cmd('az managed-network managed-networks create_or_update '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-groups create_or_update '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network scope-assignments create_or_update '
                 '--scope "subscriptions/subscriptionC" '
                 '--name "subscriptionCAssignment"',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policies create_or_update '
                 '--name "myHubAndSpoke" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-networks get '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-networks list_by_resource_group '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-networks list_by_subscription',
                 checks=[])

        self.cmd('az managed-network scope-assignments get '
                 '--scope "subscriptions/subscriptionC" '
                 '--name "subscriptionCAssignment"',
                 checks=[])

        self.cmd('az managed-network scope-assignments list '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network managed-network-groups get '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-groups list_by_managed_network '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policies get '
                 '--name "myHubAndSpoke" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policies list_by_managed_network '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-network-peering-policies delete '
                 '--name "myHubAndSpoke" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network scope-assignments delete '
                 '--scope "subscriptions/subscriptionC" '
                 '--name "subscriptionCAssignment"',
                 checks=[])

        self.cmd('az managed-network managed-network-groups delete '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])

        self.cmd('az managed-network managed-networks delete '
                 '--name "myManagedNetwork" '
                 '--resource-group {rg}',
                 checks=[])
