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
from .. import try_manual, raise_if, calc_coverage
from azure.cli.testsdk import ResourceGroupPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


@try_manual
def setup(test, rg):
    pass


# EXAMPLE: Create spatial anchor account
@try_manual
def step_create_spatial_anchor_account(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: Create remote rendering account
@try_manual
def step_create_remote_rendering_account(test, rg):
    test.cmd('az remote-rendering-account create '
             '--account-name "MyAccount" '
             '--location "eastus2euap" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: Get remote rendering account key
@try_manual
def step_get_remote_rendering_account_key(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: Get spatial anchor account key
@try_manual
def step_get_spatial_anchor_account_key(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: List spatial anchor accounts by resource group
@try_manual
def step_list_spatial_anchor(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: List remote rendering accounts by resource group
@try_manual
def step_list_remote_rendering(test, rg):
    test.cmd('az remote-rendering-account list '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: Get spatial anchors account
@try_manual
def step_get_spatial_anchors_account(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: Get remote rendering account
@try_manual
def step_get_remote_rendering_account(test, rg):
    test.cmd('az remote-rendering-account show '
             '--account-name "MyAccount" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: List remote rendering accounts by subscription
@try_manual
def step_list_remote_rendering2(test, rg):
    test.cmd('az remote-rendering-account list '
             '-g ""',
             checks=[])


# EXAMPLE: List spatial anchors accounts by subscription
@try_manual
def step_list_spatial_anchors_accounts_by_subscription(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: List available operations
@try_manual
def step_list_available_operations(test, rg):
    # EXAMPLE NOT FOUND!
    pass
    pass


# EXAMPLE: Regenerate remote rendering account keys
@try_manual
def step_regenerate_remote_rendering_account_keys(test, rg):
    test.cmd('az remote-rendering-account regenerate-key '
             '--account-name "MyAccount" '
             '--serial 1 '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: Regenerate spatial anchors account keys
@try_manual
def step_regenerate_spatial_anchors_account_keys(test, rg):
    test.cmd('az spatial-anchors-account regenerate-key '
             '--account-name "MyAccount" '
             '--serial 1 '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: Update remote rendering account
@try_manual
def step_update_remote_rendering_account(test, rg):
    # test.cmd('az remote-rendering-account update '
    #          '--account-name "MyAccount" '
    #          '--location "eastus2euap" '
    #          '--tags hero="romeo" heroine="juliet" '
    #          '--resource-group "{rg}"',
    #          checks=[])
    pass


# EXAMPLE: Update spatial anchors account
@try_manual
def step_update_spatial_anchors_account(test, rg):
    # EXAMPLE NOT FOUND!
    pass
    pass


# EXAMPLE: CheckLocalNameAvailability
@try_manual
def step_checklocalnameavailability(test, rg):
    # EXAMPLE NOT FOUND!
    pass
    pass


# EXAMPLE: Delete spatial anchors account
@try_manual
def step_delete_spatial_anchors_account(test, rg):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: Delete remote rendering account
@try_manual
def step_delete_remote_rendering_account(test, rg):
    test.cmd('az remote-rendering-account delete -y '
             '--account-name "MyAccount" '
             '--resource-group "{rg}"',
             checks=[])


@try_manual
def cleanup(test, rg):
    pass


@try_manual
def call_scenario(test, rg):
    setup(test, rg)
    step_create_spatial_anchor_account(test, rg)
    step_create_remote_rendering_account(test, rg)
    step_get_remote_rendering_account_key(test, rg)
    step_get_spatial_anchor_account_key(test, rg)
    step_list_spatial_anchor(test, rg)
    step_list_remote_rendering(test, rg)
    step_get_spatial_anchors_account(test, rg)
    step_get_remote_rendering_account(test, rg)
    step_list_remote_rendering2(test, rg)
    step_list_spatial_anchors_accounts_by_subscription(test, rg)
    step_list_available_operations(test, rg)
    step_regenerate_remote_rendering_account_keys(test, rg)
    step_regenerate_spatial_anchors_account_keys(test, rg)
    step_update_remote_rendering_account(test, rg)
    step_update_spatial_anchors_account(test, rg)
    step_checklocalnameavailability(test, rg)
    step_delete_spatial_anchors_account(test, rg)
    step_delete_remote_rendering_account(test, rg)
    cleanup(test, rg)


@try_manual
class MixedRealityClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestmixed_reality_MyResourceGroup'[:7], key='rg', parameter_name='rg')
    def test_mixed_reality(self, rg):

        call_scenario(self, rg)
        calc_coverage(__file__)
        raise_if()
