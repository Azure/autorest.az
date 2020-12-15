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
from .example_steps import step_virtual_machine_assess_patch
from .example_steps import step_virtual_machine_assess_patch_min
from .. import (
    try_manual,
    raise_if,
    calc_coverage
)


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


# Env setup_scenario
@try_manual
def setup_scenario(test, rg):
    pass


# Env cleanup_scenario
@try_manual
def cleanup_scenario(test, rg):
    pass


# Testcase: Scenario
@try_manual
def call_scenario(test, rg):
    setup_scenario(test, rg)
    step_virtual_machine_assess_patch(test, rg, checks=[])
    cleanup_scenario(test, rg)


@try_manual
def call_scenario_min(test, rg):
    setup_scenario(test, rg)
    step_virtual_machine_assess_patch_min(test, rg, checks=[])
    cleanup_scenario(test, rg)


# Test class for Scenario
@try_manual
class VmScenarioTest(ScenarioTest):

    def __init__(self):
        pass


    @ResourceGroupPreparer(name_prefix='clitestvm_myResourceGroupName'[:7], key='rg', parameter_name='rg')
    def test_vm_Scenario(self, rg):
        call_scenario(self, rg)
        calc_coverage(__file__)
        raise_if()


    @ResourceGroupPreparer(name_prefix='clitestvm_myResourceGroupName'[:7], key='rg', parameter_name='rg')
    def test_vm_Scenario_min(self, rg):
        call_scenario_min(self, rg)
        calc_coverage(__file__)
        raise_if()

