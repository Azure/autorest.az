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
from .. import try_manual, raise_if
from azure.cli.testsdk import ResourceGroupPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


@try_manual
def setup(test, rg):
    pass


# EXAMPLE: /Factories/put/Factories_CreateOrUpdate
@try_manual
def step__factories_put_factories_createorupdate(test, rg):
    test.cmd('az datafactory create '
             '--location "East US" '
             '--name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/get/Factories_Get
@try_manual
def step__factories_get_factories_get(test, rg):
    test.cmd('az datafactory show '
             '--name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/get/Factories_List
@try_manual
def step__factories_get_factories_list(test, rg):
    test.cmd('az datafactory list '
             '-g ""',
             checks=[])


# EXAMPLE: /Factories/get/Factories_ListByResourceGroup
@try_manual
def step__factories_get_factories_listbyresourcegroup(test, rg):
    test.cmd('az datafactory list '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/post/Factories_ConfigureFactoryRepo
@try_manual
def step__factories_post_factories_configurefactoryrepo(test, rg):
    test.cmd('az datafactory configure-factory-repo '
             '--factory-resource-id "/subscriptions/{subscription_id}/resourceGroups/{rg}/providers/Microsoft.DataFacto'
             'ry/factories/{exampleFactoryName}" '
             '--factory-vsts-configuration account-name="ADF" collaboration-branch="master" last-commit-id="" project-n'
             'ame="project" repository-name="repo" root-folder="/" tenant-id="" '
             '--location-id "East US"',
             checks=[])


# EXAMPLE: /Factories/post/Factories_GetDataPlaneAccess
@try_manual
def step__factories_post_factories_getdataplaneaccess(test, rg):
    test.cmd('az datafactory get-data-plane-access '
             '--name "{exampleFactoryName}" '
             '--access-resource-path "" '
             '--expire-time "2018-11-10T09:46:20.2659347Z" '
             '--permissions "r" '
             '--profile-name "DefaultProfile" '
             '--start-time "2018-11-10T02:46:20.2659347Z" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/post/Factories_GetGitHubAccessToken
@try_manual
def step__factories_post_factories_getgithubaccesstoken(test, rg):
    test.cmd('az datafactory get-git-hub-access-token '
             '--name "{exampleFactoryName}" '
             '--git-hub-access-code "some" '
             '--git-hub-access-token-base-url "some" '
             '--git-hub-client-id "some" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Factories/patch/Factories_Update
@try_manual
def step__factories_patch_factories_update(test, rg):
    test.cmd('az datafactory update '
             '--name "{exampleFactoryName}" '
             '--tags exampleTag="exampleValue" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/put/IntegrationRuntimes_Create
@try_manual
def step__integrationruntimes_put_integrationruntimes_create(test, rg):
    test.cmd('az datafactory integration-runtime managed create '
             '--factory-name "{exampleFactoryName}" '
             '--description "A selfhosted integration runtime" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/put/IntegrationRuntimes_Create
@try_manual
def step__integrationruntimes_put_integrationruntimes_create(test, rg):
    test.cmd('az datafactory integration-runtime managed create '
             '--factory-name "{exampleFactoryName}" '
             '--description "A selfhosted integration runtime" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/get/IntegrationRuntimes_Get
@try_manual
def step__integrationruntimes_get_integrationruntimes_get(test, rg):
    test.cmd('az datafactory integration-runtime show '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/get/IntegrationRuntimes_ListByFactory
@try_manual
def step__integrationruntimes_get_integrationruntimes_listbyfactory(test, rg):
    test.cmd('az datafactory integration-runtime list '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_CreateLinkedIntegrationRuntime
@try_manual
def step__integrationruntimes_post_integrationruntimes_createlinkedintegrationruntime(test, rg):
    test.cmd('az datafactory integration-runtime linked-integration-runtime create '
             '--name "bfa92911-9fb6-4fbe-8f23-beae87bc1c83" '
             '--data-factory-location "West US" '
             '--data-factory-name "e9955d6d-56ea-4be3-841c-52a12c1a9981" '
             '--subscription-id "061774c7-4b5a-4159-a55b-365581830283" '
             '--factory-name "{exampleFactoryName}" '
             '--integration-runtime-name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}" '
             '--subscription-id "12345678-1234-1234-1234-12345678abc"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_GetConnectionInfo
@try_manual
def step__integrationruntimes_post_integrationruntimes_getconnectioninfo(test, rg):
    test.cmd('az datafactory integration-runtime get-connection-info '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_GetMonitoringData
@try_manual
def step__integrationruntimes_post_integrationruntimes_getmonitoringdata(test, rg):
    test.cmd('az datafactory integration-runtime get-monitoring-data '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_GetStatus
@try_manual
def step__integrationruntimes_post_integrationruntimes_getstatus(test, rg):
    test.cmd('az datafactory integration-runtime get-status '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_ListAuthKeys
@try_manual
def step__integrationruntimes_post_integrationruntimes_listauthkeys(test, rg):
    test.cmd('az datafactory integration-runtime list-auth-key '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_RegenerateAuthKey
@try_manual
def step__integrationruntimes_post_integrationruntimes_regenerateauthkey(test, rg):
    test.cmd('az datafactory integration-runtime regenerate-auth-key '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--key-name "authKey2" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_Start
@try_manual
def step__integrationruntimes_post_integrationruntimes_start(test, rg):
    test.cmd('az datafactory integration-runtime start '
             '--factory-name "{exampleFactoryName}" '
             '--name "{IntegrationRuntimes_2}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_Stop
@try_manual
def step__integrationruntimes_post_integrationruntimes_stop(test, rg):
    test.cmd('az datafactory integration-runtime stop '
             '--factory-name "{exampleFactoryName}" '
             '--name "{IntegrationRuntimes_2}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_SyncCredentials
@try_manual
def step__integrationruntimes_post_integrationruntimes_synccredentials(test, rg):
    test.cmd('az datafactory integration-runtime sync-credentials '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_Upgrade
@try_manual
def step__integrationruntimes_post_integrationruntimes_upgrade(test, rg):
    test.cmd('az datafactory integration-runtime remove-link '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/post/IntegrationRuntimes_Upgrade
@try_manual
def step__integrationruntimes_post_integrationruntimes_upgrade(test, rg):
    test.cmd('az datafactory integration-runtime remove-link '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/patch/IntegrationRuntimes_Update
@try_manual
def step__integrationruntimes_patch_integrationruntimes_update(test, rg):
    test.cmd('az datafactory integration-runtime update '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}" '
             '--auto-update "Off" '
             '--update-delay-offset "\\"PT3H\\""',
             checks=[])


# EXAMPLE: /Triggers/put/Triggers_Create
@try_manual
def step__triggers_put_triggers_create(test, rg):
    test.cmd('az datafactory trigger create '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--properties "{{\\"type\\":\\"ScheduleTrigger\\",\\"pipelines\\":[{{\\"parameters\\":{{\\"OutputBlobNameL'
             'ist\\":[\\"exampleoutput.csv\\"]}},\\"pipelineReference\\":{{\\"type\\":\\"PipelineReference\\",\\"refere'
             'nceName\\":\\"examplePipeline\\"}}}}],\\"typeProperties\\":{{\\"recurrence\\":{{\\"endTime\\":\\"2018-06-'
             '16T00:55:13.8441801Z\\",\\"frequency\\":\\"Minute\\",\\"interval\\":4,\\"startTime\\":\\"2018-06-16T00:39'
             ':13.8441801Z\\",\\"timeZone\\":\\"UTC\\"}}}}}}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/put/Triggers_Update
@try_manual
def step__triggers_put_triggers_update(test, rg):
    test.cmd('az datafactory trigger create '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--properties "{{\\"type\\":\\"ScheduleTrigger\\",\\"description\\":\\"Example description\\",\\"pipelines'
             '\\":[{{\\"parameters\\":{{\\"OutputBlobNameList\\":[\\"exampleoutput.csv\\"]}},\\"pipelineReference\\":{{'
             '\\"type\\":\\"PipelineReference\\",\\"referenceName\\":\\"examplePipeline\\"}}}}],\\"typeProperties\\":{{'
             '\\"recurrence\\":{{\\"endTime\\":\\"2018-06-16T00:55:14.905167Z\\",\\"frequency\\":\\"Minute\\",\\"interv'
             'al\\":4,\\"startTime\\":\\"2018-06-16T00:39:14.905167Z\\",\\"timeZone\\":\\"UTC\\"}}}}}}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/get/Triggers_Get
@try_manual
def step__triggers_get_triggers_get(test, rg):
    test.cmd('az datafactory trigger show '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/get/Triggers_ListByFactory
@try_manual
def step__triggers_get_triggers_listbyfactory(test, rg):
    test.cmd('az datafactory trigger list '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Triggers/post/Triggers_GetEventSubscriptionStatus
@try_manual
def step__triggers_post_triggers_geteventsubscriptionstatus(test, rg):
    test.cmd('az datafactory trigger get-event-subscription-status '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/post/Triggers_QueryByFactory
@try_manual
def step__triggers_post_triggers_querybyfactory(test, rg):
    test.cmd('az datafactory trigger query-by-factory '
             '--factory-name "{exampleFactoryName}" '
             '--parent-trigger-name "exampleTrigger" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Triggers/post/Triggers_Start
@try_manual
def step__triggers_post_triggers_start(test, rg):
    test.cmd('az datafactory trigger start '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/post/Triggers_Stop
@try_manual
def step__triggers_post_triggers_stop(test, rg):
    test.cmd('az datafactory trigger stop '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/post/Triggers_SubscribeToEvents
@try_manual
def step__triggers_post_triggers_subscribetoevents(test, rg):
    test.cmd('az datafactory trigger subscribe-to-event '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Triggers/post/Triggers_UnsubscribeFromEvents
@try_manual
def step__triggers_post_triggers_unsubscribefromevents(test, rg):
    test.cmd('az datafactory trigger unsubscribe-from-event '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /IntegrationRuntimes/delete/IntegrationRuntimes_Delete
@try_manual
def step__integrationruntimes_delete_integrationruntimes_delete(test, rg):
    test.cmd('az datafactory integration-runtime delete '
             '--factory-name "{exampleFactoryName}" '
             '--name "{exampleIntegrationRuntime}" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: /Triggers/delete/Triggers_Delete
@try_manual
def step__triggers_delete_triggers_delete(test, rg):
    test.cmd('az datafactory trigger delete '
             '--factory-name "{exampleFactoryName}" '
             '--resource-group "{rg}" '
             '--name "{exampleTrigger}"',
             checks=[])


# EXAMPLE: /Factories/delete/Factories_Delete
@try_manual
def step__factories_delete_factories_delete(test, rg):
    test.cmd('az datafactory delete '
             '--name "{exampleFactoryName}" '
             '--resource-group "{rg}"',
             checks=[])


@try_manual
def cleanup(test, rg):
    pass


@try_manual
def call_scenario(test, rg):
    setup(test, rg)
    step__factories_put_factories_createorupdate(test, rg)
    step__factories_get_factories_get(test, rg)
    step__factories_get_factories_list(test, rg)
    step__factories_get_factories_listbyresourcegroup(test, rg)
    step__factories_post_factories_configurefactoryrepo(test, rg)
    step__factories_post_factories_getdataplaneaccess(test, rg)
    step__factories_post_factories_getgithubaccesstoken(test, rg)
    step__factories_patch_factories_update(test, rg)
    step__integrationruntimes_put_integrationruntimes_create(test, rg)
    step__integrationruntimes_put_integrationruntimes_create(test, rg)
    step__integrationruntimes_get_integrationruntimes_get(test, rg)
    step__integrationruntimes_get_integrationruntimes_listbyfactory(test, rg)
    step__integrationruntimes_post_integrationruntimes_createlinkedintegrationruntime(test, rg)
    step__integrationruntimes_post_integrationruntimes_getconnectioninfo(test, rg)
    step__integrationruntimes_post_integrationruntimes_getmonitoringdata(test, rg)
    step__integrationruntimes_post_integrationruntimes_getstatus(test, rg)
    step__integrationruntimes_post_integrationruntimes_listauthkeys(test, rg)
    step__integrationruntimes_post_integrationruntimes_regenerateauthkey(test, rg)
    step__integrationruntimes_post_integrationruntimes_start(test, rg)
    step__integrationruntimes_post_integrationruntimes_stop(test, rg)
    step__integrationruntimes_post_integrationruntimes_synccredentials(test, rg)
    step__integrationruntimes_post_integrationruntimes_upgrade(test, rg)
    step__integrationruntimes_post_integrationruntimes_upgrade(test, rg)
    step__integrationruntimes_patch_integrationruntimes_update(test, rg)
    step__triggers_put_triggers_create(test, rg)
    step__triggers_put_triggers_update(test, rg)
    step__triggers_get_triggers_get(test, rg)
    step__triggers_get_triggers_listbyfactory(test, rg)
    step__triggers_post_triggers_geteventsubscriptionstatus(test, rg)
    step__triggers_post_triggers_querybyfactory(test, rg)
    step__triggers_post_triggers_start(test, rg)
    step__triggers_post_triggers_stop(test, rg)
    step__triggers_post_triggers_subscribetoevents(test, rg)
    step__triggers_post_triggers_unsubscribefromevents(test, rg)
    step__integrationruntimes_delete_integrationruntimes_delete(test, rg)
    step__triggers_delete_triggers_delete(test, rg)
    step__factories_delete_factories_delete(test, rg)
    cleanup(test, rg)


@try_manual
class DFAZManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestdatafactory_exampleResourceGroup'[:7], key='rg', parameter_name='rg')
    def test_datafactory(self, rg):

        self.kwargs.update({
            'subscription_id': self.get_subscription_id()
        })

        self.kwargs.update({
            'exampleFactoryName': 'exampleFactoryName',
            'exampleTrigger': 'exampleTrigger',
            'exampleIntegrationRuntime': 'exampleIntegrationRuntime',
            'IntegrationRuntimes_2': 'exampleManagedIntegrationRuntime',
        })

        call_scenario(self, rg)
        raise_if()
