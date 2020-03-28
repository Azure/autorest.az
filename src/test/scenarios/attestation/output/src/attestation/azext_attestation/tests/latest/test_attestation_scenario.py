# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import os
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import ScenarioTest
from .. import try_manual
from azure.cli.testsdk import ResourceGroupPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


@try_manual
def setup(test):
    pass


# EXAMPLE: Operations_List
@try_manual
def step_operations_list(test):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: AttestationProviders_Create
@try_manual
def step_attestationproviders_create(test):
    test.cmd('az attestation attestation-provider create '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: AttestationProviders_Get
@try_manual
def step_attestationproviders_get(test):
    test.cmd('az attestation attestation-provider show '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


@try_manual
def mytest(test):
    pass


# EXAMPLE: AttestationProviders_List
@try_manual
def step_attestationproviders_list(test):
    test.cmd('az attestation attestation-provider list',
             checks=[])


# EXAMPLE: AttestationProviders_ListByResourceGroup
@try_manual
def step_attestationproviders_listbyresourcegroup(test):
    test.cmd('az attestation attestation-provider list '
             '--resource-group "{rg_2}"',
             checks=[])


# EXAMPLE: AttestationProviders_Delete
@try_manual
def step_attestationproviders_delete(test):
    test.cmd('az attestation attestation-provider delete '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg_3}"',
             checks=[])


@try_manual
def cleanup(test):
    pass


class AttestationManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_attestation_MyResourceGroup'[:9], key='rg')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_testrg1'[:9], key='rg_2')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_sample-resource-group'[:9], key='rg_3')
    def test_attestation(self, resource_group):

        setup(self)
        step_operations_list(self)
        step_attestationproviders_create(self)
        step_attestationproviders_get(self)
        mytest(self)
        step_attestationproviders_list(self)
        step_attestationproviders_listbyresourcegroup(self)
        step_attestationproviders_delete(self)
        cleanup(self)
