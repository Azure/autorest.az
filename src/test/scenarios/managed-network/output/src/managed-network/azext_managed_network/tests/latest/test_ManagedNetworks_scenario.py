# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------

import os
from azure.cli.testsdk import ScenarioTest
from azure.cli.testsdk import ResourceGroupPreparer
from .preparers import VirtualNetworkPreparer
from .example_steps import step_mn_create
from .example_steps import step_mn_group_create
from .example_steps import step_managed_network_peering
from .example_steps import step_mn_get_modify
from azure.cli.testsdk import ResourceGroupPreparer
from .preparers import VirtualNetworkPreparer
from .example_steps import step_mn_list
from .example_steps import step_mn_list
from .example_steps import step_mn_delete
from .example_steps import step_mn_group_show
from azure.cli.testsdk import ResourceGroupPreparer
from .preparers import VirtualNetworkPreparer
from .example_steps import step_mn_group_list
from .example_steps import step_managed_network_peering_policy_show
from .example_steps import step_managed_network_peering_policy_list
from .example_steps import step_managed_network_peering_policy_delete
from .example_steps import step_mn_group_delete
from .. import (
    try_manual,
    raise_if,
    calc_coverage
)


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


# Env setup_scenario1
@try_manual
def setup_scenario1(test, rg):
    pass


# Env cleanup_scenario1
@try_manual
def cleanup_scenario1(test, rg):
    pass


# Testcase: scenario1
@try_manual
def call_scenario1(test, rg):
    setup_scenario1(test, rg)
    step_mn_create(test, rg, checks=[
        test.check("location", "eastus", case_sensitive=False),
        test.check("name", "{myManagedNetwork}", case_sensitive=False),
    ])
    step_mn_group_create(test, rg, checks=[
        test.check("managementGroups", []),
        test.check("name", "{myManagedNetworkGroup}", case_sensitive=False),
    ])
    step_managed_network_peering(test, rg, checks=[])
    step_mn_get_modify(test, rg, checks=[])
    cleanup_scenario1(test, rg)


# Test class for scenario1
@try_manual
class ManagedNetworksscenario1Test(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestmanaged_network_myResourceGroup'[:7], key='rg', parameter_name='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetA'[:7], key='vn', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetB'[:7], key='vn_2', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetC'[:7], key='vn_3', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_myHubVnet'[:7], key='vn_4', resource_group_key='rg')
    def test_ManagedNetworks_scenario1(self, rg):

        self.kwargs.update({
            'subscription_id': self.get_subscription_id()
        })

        self.kwargs.update({
            'myManagedNetwork': self.create_random_name(prefix='myManagedNetwork'[:8], length=16),
            'myScopeAssignment': self.create_random_name(prefix='subscriptionCAssignment'[:11], length=23),
            'myManagedNetworkGroup': self.create_random_name(prefix='myManagedNetworkGroup1'[:11], length=22),
            'myManagedNetworkPeeringPolicy': self.create_random_name(prefix='myHubAndSpoke'[:6], length=13),
        })

        call_scenario1(self, rg)
        calc_coverage(__file__)
        raise_if()


# Env setup_scenario2
@try_manual
def setup_scenario2(test, rg):
    pass


# Env cleanup_scenario2
@try_manual
def cleanup_scenario2(test, rg):
    pass


# Testcase: scenario2
@try_manual
def call_scenario2(test, rg):
    setup_scenario2(test, rg)
    step_mn_list(test, rg, checks=[])
    step_mn_list(test, rg, checks=[
        test.check('length(@)', 1),
    ])
    step_mn_delete(test, rg, checks=[])
    step_mn_group_show(test, rg, checks=[])
    cleanup_scenario2(test, rg)


# Test class for scenario2
@try_manual
class ManagedNetworksscenario2Test(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestmanaged_network_myResourceGroup'[:7], key='rg', parameter_name='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetA'[:7], key='vn', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetB'[:7], key='vn_2', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetC'[:7], key='vn_3', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_myHubVnet'[:7], key='vn_4', resource_group_key='rg')
    def test_ManagedNetworks_scenario2(self, rg):

        self.kwargs.update({
            'subscription_id': self.get_subscription_id()
        })

        self.kwargs.update({
            'myManagedNetwork': self.create_random_name(prefix='myManagedNetwork'[:8], length=16),
            'myScopeAssignment': self.create_random_name(prefix='subscriptionCAssignment'[:11], length=23),
            'myManagedNetworkGroup': self.create_random_name(prefix='myManagedNetworkGroup1'[:11], length=22),
            'myManagedNetworkPeeringPolicy': self.create_random_name(prefix='myHubAndSpoke'[:6], length=13),
        })

        call_scenario2(self, rg)
        calc_coverage(__file__)
        raise_if()


# Env setup_scenario3
@try_manual
def setup_scenario3(test, rg):
    pass


# Env cleanup_scenario3
@try_manual
def cleanup_scenario3(test, rg):
    pass


# Testcase: scenario3
@try_manual
def call_scenario3(test, rg):
    setup_scenario3(test, rg)
    step_mn_group_list(test, rg, checks=[])
    step_managed_network_peering_policy_show(test, rg, checks=[])
    step_managed_network_peering_policy_list(test, rg, checks=[])
    step_managed_network_peering_policy_delete(test, rg, checks=[])
    step_mn_group_delete(test, rg, checks=[])
    cleanup_scenario3(test, rg)


# Test class for scenario3
@try_manual
class ManagedNetworksscenario3Test(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestmanaged_network_myResourceGroup'[:7], key='rg', parameter_name='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetA'[:7], key='vn', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetB'[:7], key='vn_2', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_VnetC'[:7], key='vn_3', resource_group_key='rg')
    @VirtualNetworkPreparer(name_prefix='clitestmanaged_network_myHubVnet'[:7], key='vn_4', resource_group_key='rg')
    def test_ManagedNetworks_scenario3(self, rg):

        self.kwargs.update({
            'subscription_id': self.get_subscription_id()
        })

        self.kwargs.update({
            'myManagedNetwork': self.create_random_name(prefix='myManagedNetwork'[:8], length=16),
            'myScopeAssignment': self.create_random_name(prefix='subscriptionCAssignment'[:11], length=23),
            'myManagedNetworkGroup': self.create_random_name(prefix='myManagedNetworkGroup1'[:11], length=22),
            'myManagedNetworkPeeringPolicy': self.create_random_name(prefix='myHubAndSpoke'[:6], length=13),
        })

        call_scenario3(self, rg)
        calc_coverage(__file__)
        raise_if()

