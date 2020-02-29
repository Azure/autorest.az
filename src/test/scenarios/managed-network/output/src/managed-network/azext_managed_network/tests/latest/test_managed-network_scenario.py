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

        self.cmd('az managed-network managednetwork create '
                 '--location "eastus"',
                 checks=[])

        self.cmd('az managed-network managednetworkgroup create',
                 checks=[])

        self.cmd('az managed-network scopeassignment create '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network managednetworkpeeringpolicy create',
                 checks=[])

        self.cmd('az managed-network managednetwork show',
                 checks=[])

        self.cmd('az managed-network managednetwork list',
                 checks=[])

        self.cmd('az managed-network managednetwork list',
                 checks=[])

        self.cmd('az managed-network scopeassignment show '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network scopeassignment list '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network managednetworkgroup show',
                 checks=[])

        self.cmd('az managed-network managednetworkgroup list',
                 checks=[])

        self.cmd('az managed-network managednetworkpeeringpolicy show',
                 checks=[])

        self.cmd('az managed-network managednetworkpeeringpolicy list',
                 checks=[])

        self.cmd('az managed-network managednetworkpeeringpolicy delete',
                 checks=[])

        self.cmd('az managed-network scopeassignment delete '
                 '--scope "subscriptions/subscriptionC"',
                 checks=[])

        self.cmd('az managed-network managednetworkgroup delete',
                 checks=[])

        self.cmd('az managed-network managednetwork delete',
                 checks=[])
