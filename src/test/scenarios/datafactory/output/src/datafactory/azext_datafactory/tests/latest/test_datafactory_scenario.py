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
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import ScenarioTest
from .. import try_manual
from azure.cli.testsdk import ResourceGroupPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


@try_manual
def setup(test, rg):
    pass


# EXAMPLE: /Factories/put/Factories_CreateOrUpdate
@try_manual
def step__factories_put_factories_createorupdate(test, rg):
    test.cmd('az datafactory factory create '
             '--location "East US" '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/get/Factories_Get
@try_manual
def step__factories_get_factories_get(test, rg):
    test.cmd('az datafactory factory show '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/get/Factories_ListByResourceGroup
@try_manual
def step__factories_get_factories_listbyresourcegroup(test, rg):
    test.cmd('az datafactory factory list '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/get/Factories_List
@try_manual
def step__factories_get_factories_list(test, rg):
    test.cmd('az datafactory factory list',
             checks=[])


# EXAMPLE: /Factories/post/Factories_GetGitHubAccessToken
@try_manual
def step__factories_post_factories_getgithubaccesstoken(test, rg):
    test.cmd('az datafactory factory get-git-hub-access-token '
             '--factory-name "{exampleFactoryName}" '
             '--git-hub-access-code "some" '
             '--git-hub-access-token-base-url "some" '
             '--git-hub-client-id "some" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/post/Factories_GetDataPlaneAccess
@try_manual
def step__factories_post_factories_getdataplaneaccess(test, rg):
    test.cmd('az datafactory factory get-data-plane-access '
             '--factory-name "{exampleFactoryName}" '
             '--access-resource-path "" '
             '--expire-time "2018-11-10T09:46:20.2659347Z" '
             '--permissions "r" '
             '--profile-name "DefaultProfile" '
             '--start-time "2018-11-10T02:46:20.2659347Z" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/patch/Factories_Update
@try_manual
def step__factories_patch_factories_update(test, rg):
    test.cmd('az datafactory factory update '
             '--factory-name "{exampleFactoryName}" '
             '--tags exampleTag="exampleValue" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/post/Factories_ConfigureFactoryRepo
@try_manual
def step__factories_post_factories_configurefactoryrepo(test, rg):
    test.cmd('az datafactory factory configure-factory-repo '
             '--factory-resource-id "/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.DataFacto'
             'ry/factories/{exampleFactoryName}" '
             '--repo-configuration "{{\\"type\\":\\"FactoryVSTSConfiguration\\",\\"accountName\\":\\"ADF\\",\\"collabor'
             'ationBranch\\":\\"master\\",\\"lastCommitId\\":\\"\\",\\"projectName\\":\\"project\\",\\"repositoryName\\'
             '":\\"repo\\",\\"rootFolder\\":\\"/\\",\\"tenantId\\":\\"\\"}}" '
             '--location-id "East US"',
             checks=[])


# EXAMPLE: /Factories/delete/Factories_Delete
@try_manual
def step__factories_delete_factories_delete(test, rg):
    test.cmd('az datafactory factory delete '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


@try_manual
def cleanup(test, rg):
    pass


class DataFactoryManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestdatafactory_exampleResourceGroup'[:7], key='rg', parameter_name='rg')
    def test_datafactory(self, rg):

        self.kwargs.update({
            'subscription_id': self.get_subscription_id()
        })

        self.kwargs.update({
            'exampleFactoryName': self.create_random_name(prefix='clitestfactories'[:7], length=24),
        })

        setup(self, rg)
        step__factories_put_factories_createorupdate(self, rg)
        step__factories_get_factories_get(self, rg)
        step__factories_get_factories_listbyresourcegroup(self, rg)
        step__factories_get_factories_list(self, rg)
        step__factories_post_factories_getgithubaccesstoken(self, rg)
        step__factories_post_factories_getdataplaneaccess(self, rg)
        step__factories_patch_factories_update(self, rg)
        step__factories_post_factories_configurefactoryrepo(self, rg)
        step__factories_delete_factories_delete(self, rg)
        cleanup(self, rg)
