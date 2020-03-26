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


def setup(test):
    pass


# EXAMPLE: Operations_List
def step_Operations_List(test):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: AttestationProviders_Create
def step_AttestationProviders_Create(test):
    test.cmd('az attestation attestation-provider create '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: AttestationProviders_Get
def step_AttestationProviders_Get(test):
    test.cmd('az attestation attestation-provider show '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


def mytest(test):
    pass


# EXAMPLE: AttestationProviders_List
def step_AttestationProviders_List(test):
    test.cmd('az attestation attestation-provider list',
             checks=[])


# EXAMPLE: AttestationProviders_ListByResourceGroup
def step_AttestationProviders_ListByResourceGroup(test):
    test.cmd('az attestation attestation-provider list '
             '--resource-group "{rg_2}"',
             checks=[])


# EXAMPLE: AttestationProviders_Delete
def step_AttestationProviders_Delete(test):
    test.cmd('az attestation attestation-provider delete '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg_3}"',
             checks=[])


def cleanup(test):
    pass


class AttestationManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_attestation_MyResourceGroup'[:9], key='rg')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_testrg1'[:9], key='rg_2')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_sample-resource-group'[:9], key='rg_3')
    def test_attestation(self, resource_group):

        setup(self)
        step_Operations_List(self)
        step_AttestationProviders_Create(self)
        step_AttestationProviders_Get(self)
        mytest(self)
        step_AttestationProviders_List(self)
        step_AttestationProviders_ListByResourceGroup(self)
        step_AttestationProviders_Delete(self)
        cleanup(self)
