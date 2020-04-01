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


class DataFactoryManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_datafactory_exampleResourceGroup'[:9], key='rg')
    def test_datafactory(self, resource_group):

        self.kwargs.update({
            'subscription_id': self.get_subscription_id()
        })

        self.kwargs.update({
            'exampleFactoryName': self.create_random_name(prefix='cli_test_factories'[:9], length=24),
        })

        # EXAMPLE: Factories/resource-group-name/Factories_CreateOrUpdate
        self.cmd('az datafactory factory create '
                 '--location "East US" '
                 '--factory-name "{exampleFactoryName}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: Factories/resource-group-name/Factories_Get
        self.cmd('az datafactory factory show '
                 '--factory-name "{exampleFactoryName}" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: Factories/resource-group-name/Factories_ListByResourceGroup
        self.cmd('az datafactory factory list '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: Factories/api-version/Factories_List
        self.cmd('az datafactory factory list',
                 checks=[])

        # EXAMPLE: Factories/resource-group-name/Factories_GetGitHubAccessToken
        self.cmd('az datafactory factory get-git-hub-access-token '
                 '--factory-name "{exampleFactoryName}" '
                 '--git-hub-access-code "some" '
                 '--git-hub-access-token-base-url "some" '
                 '--git-hub-client-id "some" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: Factories/resource-group-name/Factories_GetDataPlaneAccess
        self.cmd('az datafactory factory get-data-plane-access '
                 '--factory-name "{exampleFactoryName}" '
                 '--access-resource-path "" '
                 '--expire-time "2018-11-10T09:46:20.2659347Z" '
                 '--permissions "r" '
                 '--profile-name "DefaultProfile" '
                 '--start-time "2018-11-10T02:46:20.2659347Z" '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: Factories/resource-group-name/Factories_Update
        self.cmd('az datafactory factory update '
                 '--factory-name "{exampleFactoryName}" '
                 '--tags exampleTag=exampleValue '
                 '--resource-group "{rg}"',
                 checks=[])

        # EXAMPLE: Factories/location-id/Factories_ConfigureFactoryRepo
        self.cmd('az datafactory factory configure-factory-repo '
                 '--factory-resource-id "/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.DataF'
                 'actory/factories/{exampleFactoryName}" '
                 '--repo-configuration "{{\\"type\\":\\"FactoryVSTSConfiguration\\",\\"accountName\\":\\"ADF\\",\\"coll'
                 'aborationBranch\\":\\"master\\",\\"lastCommitId\\":\\"\\",\\"projectName\\":\\"project\\",\\"reposito'
                 'ryName\\":\\"repo\\",\\"rootFolder\\":\\"/\\",\\"tenantId\\":\\"\\"}}" '
                 '--location-id "East US"',
                 checks=[])

        # EXAMPLE: Factories/resource-group-name/Factories_Delete
        self.cmd('az datafactory factory delete '
                 '--factory-name "{exampleFactoryName}" '
                 '--resource-group "{rg}"',
                 checks=[])
