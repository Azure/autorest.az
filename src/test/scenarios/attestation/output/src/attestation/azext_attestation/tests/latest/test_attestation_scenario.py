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


class AttestationManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_attestation_MyResourceGroup'[:9], key='rg')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_testrg1'[:9], key='rg_2')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_sample-resource-group'[:9], key='rg_3')
    def test_attestation(self, resource_group):

        # EXAMPLE NOT FOUND: Operations_List

        # EXAMPLE: AttestationProviders_Create
        self.cmd('az attestation attestation-provider create '
                 '--provider-name "myattestationprovider" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: AttestationProviders_Get
        self.cmd('az attestation attestation-provider show '
                 '--provider-name "myattestationprovider" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: AttestationProviders_List
        self.cmd('az attestation attestation-provider list',
                 checks=[])

        # EXAMPLE: AttestationProviders_ListByResourceGroup
        self.cmd('az attestation attestation-provider list '
                 '--resource-group "{rg_2}"',
                 checks=[])

        # EXAMPLE: AttestationProviders_Delete
        self.cmd('az attestation attestation-provider delete '
                 '--provider-name "myattestationprovider" '
                 '--resource-group "{rg_3}"',
                 checks=[])
