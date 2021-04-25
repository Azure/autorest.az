# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az datafactory|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az datafactory` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az datafactory|Factories|[commands](#CommandsInFactories)|
|az datafactory domain-service|DomainServices|[commands](#CommandsInDomainServices)|
|az datafactory group|Groups|[commands](#CommandsInGroups)|
|az datafactory integration-runtime|IntegrationRuntimes|[commands](#CommandsInIntegrationRuntimes)|
|az datafactory linked-integration-runtime||[commands](#CommandsIn)|
|az datafactory trigger|Triggers|[commands](#CommandsInTriggers)|

## COMMANDS
### <a name="CommandsInFactories">Commands in `az datafactory` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory list](#FactoriesListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersFactoriesListByResourceGroup)|[Example](#ExamplesFactoriesListByResourceGroup)|
|[az datafactory list](#FactoriesList)|List|[Parameters](#ParametersFactoriesList)|[Example](#ExamplesFactoriesList)|
|[az datafactory show](#FactoriesGet)|Get|[Parameters](#ParametersFactoriesGet)|[Example](#ExamplesFactoriesGet)|
|[az datafactory create](#FactoriesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersFactoriesCreateOrUpdate#Create)|[Example](#ExamplesFactoriesCreateOrUpdate#Create)|
|[az datafactory update](#FactoriesUpdate)|Update|[Parameters](#ParametersFactoriesUpdate)|[Example](#ExamplesFactoriesUpdate)|
|[az datafactory delete](#FactoriesDelete)|Delete|[Parameters](#ParametersFactoriesDelete)|[Example](#ExamplesFactoriesDelete)|
|[az datafactory configure-factory-repo](#FactoriesConfigureFactoryRepo)|ConfigureFactoryRepo|[Parameters](#ParametersFactoriesConfigureFactoryRepo)|[Example](#ExamplesFactoriesConfigureFactoryRepo)|
|[az datafactory get-data-plane-access](#FactoriesGetDataPlaneAccess)|GetDataPlaneAccess|[Parameters](#ParametersFactoriesGetDataPlaneAccess)|[Example](#ExamplesFactoriesGetDataPlaneAccess)|
|[az datafactory get-git-hub-access-token](#FactoriesGetGitHubAccessToken)|GetGitHubAccessToken|[Parameters](#ParametersFactoriesGetGitHubAccessToken)|[Example](#ExamplesFactoriesGetGitHubAccessToken)|

### <a name="CommandsInDomainServices">Commands in `az datafactory domain-service` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory domain-service create](#DomainServicesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDomainServicesCreateOrUpdate#Create)|Not Found|
|[az datafactory domain-service update](#DomainServicesCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersDomainServicesCreateOrUpdate#Update)|Not Found|

### <a name="CommandsInGroups">Commands in `az datafactory group` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory group create](#GroupsCreate)|Create|[Parameters](#ParametersGroupsCreate)|Not Found|

### <a name="CommandsInIntegrationRuntimes">Commands in `az datafactory integration-runtime` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory integration-runtime list](#IntegrationRuntimesListByFactory)|ListByFactory|[Parameters](#ParametersIntegrationRuntimesListByFactory)|[Example](#ExamplesIntegrationRuntimesListByFactory)|
|[az datafactory integration-runtime show](#IntegrationRuntimesGet)|Get|[Parameters](#ParametersIntegrationRuntimesGet)|[Example](#ExamplesIntegrationRuntimesGet)|
|[az datafactory integration-runtime managed create](#IntegrationRuntimesCreateOrUpdate#Create#Managed)|CreateOrUpdate#Create#Managed|[Parameters](#ParametersIntegrationRuntimesCreateOrUpdate#Create#Managed)|Not Found|
|[az datafactory integration-runtime self-hosted create](#IntegrationRuntimesCreateOrUpdate#Create#SelfHosted)|CreateOrUpdate#Create#SelfHosted|[Parameters](#ParametersIntegrationRuntimesCreateOrUpdate#Create#SelfHosted)|[Example](#ExamplesIntegrationRuntimesCreateOrUpdate#Create#SelfHosted)|
|[az datafactory integration-runtime update](#IntegrationRuntimesUpdate)|Update|[Parameters](#ParametersIntegrationRuntimesUpdate)|[Example](#ExamplesIntegrationRuntimesUpdate)|
|[az datafactory integration-runtime delete](#IntegrationRuntimesDelete)|Delete|[Parameters](#ParametersIntegrationRuntimesDelete)|[Example](#ExamplesIntegrationRuntimesDelete)|
|[az datafactory integration-runtime get-connection-info](#IntegrationRuntimesGetConnectionInfo)|GetConnectionInfo|[Parameters](#ParametersIntegrationRuntimesGetConnectionInfo)|[Example](#ExamplesIntegrationRuntimesGetConnectionInfo)|
|[az datafactory integration-runtime get-monitoring-data](#IntegrationRuntimesGetMonitoringData)|GetMonitoringData|[Parameters](#ParametersIntegrationRuntimesGetMonitoringData)|[Example](#ExamplesIntegrationRuntimesGetMonitoringData)|
|[az datafactory integration-runtime get-status](#IntegrationRuntimesGetStatus)|GetStatus|[Parameters](#ParametersIntegrationRuntimesGetStatus)|[Example](#ExamplesIntegrationRuntimesGetStatus)|
|[az datafactory integration-runtime list-auth-key](#IntegrationRuntimesListAuthKeys)|ListAuthKeys|[Parameters](#ParametersIntegrationRuntimesListAuthKeys)|[Example](#ExamplesIntegrationRuntimesListAuthKeys)|
|[az datafactory integration-runtime regenerate-auth-key](#IntegrationRuntimesRegenerateAuthKey)|RegenerateAuthKey|[Parameters](#ParametersIntegrationRuntimesRegenerateAuthKey)|[Example](#ExamplesIntegrationRuntimesRegenerateAuthKey)|
|[az datafactory integration-runtime remove-link](#IntegrationRuntimesRemoveLinks)|RemoveLinks|[Parameters](#ParametersIntegrationRuntimesRemoveLinks)|[Example](#ExamplesIntegrationRuntimesRemoveLinks)|
|[az datafactory integration-runtime start](#IntegrationRuntimesStart)|Start|[Parameters](#ParametersIntegrationRuntimesStart)|[Example](#ExamplesIntegrationRuntimesStart)|
|[az datafactory integration-runtime stop](#IntegrationRuntimesStop)|Stop|[Parameters](#ParametersIntegrationRuntimesStop)|[Example](#ExamplesIntegrationRuntimesStop)|
|[az datafactory integration-runtime sync-credentials](#IntegrationRuntimesSyncCredentials)|SyncCredentials|[Parameters](#ParametersIntegrationRuntimesSyncCredentials)|[Example](#ExamplesIntegrationRuntimesSyncCredentials)|
|[az datafactory integration-runtime upgrade](#IntegrationRuntimesUpgrade)|Upgrade|[Parameters](#ParametersIntegrationRuntimesUpgrade)|[Example](#ExamplesIntegrationRuntimesUpgrade)|

### <a name="CommandsIn">Commands in `az datafactory linked-integration-runtime` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory linked-integration-runtime create](#CreateLinkedIntegrationRuntime)|CreateLinkedIntegrationRuntime|[Parameters](#ParametersCreateLinkedIntegrationRuntime)|[Example](#ExamplesCreateLinkedIntegrationRuntime)|

### <a name="CommandsInTriggers">Commands in `az datafactory trigger` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory trigger list](#TriggersListByFactory)|ListByFactory|[Parameters](#ParametersTriggersListByFactory)|[Example](#ExamplesTriggersListByFactory)|
|[az datafactory trigger show](#TriggersGet)|Get|[Parameters](#ParametersTriggersGet)|[Example](#ExamplesTriggersGet)|
|[az datafactory trigger create](#TriggersCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersTriggersCreateOrUpdate#Create)|[Example](#ExamplesTriggersCreateOrUpdate#Create)|
|[az datafactory trigger update](#TriggersCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersTriggersCreateOrUpdate#Update)|[Example](#ExamplesTriggersCreateOrUpdate#Update)|
|[az datafactory trigger delete](#TriggersDelete)|Delete|[Parameters](#ParametersTriggersDelete)|[Example](#ExamplesTriggersDelete)|
|[az datafactory trigger get-event-subscription-status](#TriggersGetEventSubscriptionStatus)|GetEventSubscriptionStatus|[Parameters](#ParametersTriggersGetEventSubscriptionStatus)|[Example](#ExamplesTriggersGetEventSubscriptionStatus)|
|[az datafactory trigger query-by-factory](#TriggersQueryByFactory)|QueryByFactory|[Parameters](#ParametersTriggersQueryByFactory)|[Example](#ExamplesTriggersQueryByFactory)|
|[az datafactory trigger start](#TriggersStart)|Start|[Parameters](#ParametersTriggersStart)|[Example](#ExamplesTriggersStart)|
|[az datafactory trigger stop](#TriggersStop)|Stop|[Parameters](#ParametersTriggersStop)|[Example](#ExamplesTriggersStop)|
|[az datafactory trigger subscribe-to-event](#TriggersSubscribeToEvents)|SubscribeToEvents|[Parameters](#ParametersTriggersSubscribeToEvents)|[Example](#ExamplesTriggersSubscribeToEvents)|
|[az datafactory trigger unsubscribe-from-event](#TriggersUnsubscribeFromEvents)|UnsubscribeFromEvents|[Parameters](#ParametersTriggersUnsubscribeFromEvents)|[Example](#ExamplesTriggersUnsubscribeFromEvents)|


## COMMAND DETAILS
### group `az datafactory`
#### <a name="FactoriesListByResourceGroup">Command `az datafactory list`</a>

##### <a name="ExamplesFactoriesListByResourceGroup">Example</a>
```
az datafactory list --resource-group "myResourceGroup"
```
##### <a name="ParametersFactoriesListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|

#### <a name="FactoriesList">Command `az datafactory list`</a>

##### <a name="ExamplesFactoriesList">Example</a>
```
az datafactory list
```
##### <a name="ParametersFactoriesList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--gen-custom-headers**|string|Test the ability to rename ignoring attributes.|custom_headers|customHeaders|

#### <a name="FactoriesGet">Command `az datafactory show`</a>

##### <a name="ExamplesFactoriesGet">Example</a>
```
az datafactory show --name "myFactory" --resource-group "myResourceGroup"
```
##### <a name="ParametersFactoriesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--if-none-match**|string|ETag of the factory entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="FactoriesCreateOrUpdate#Create">Command `az datafactory create`</a>

##### <a name="ExamplesFactoriesCreateOrUpdate#Create">Example</a>
```
az datafactory create --location "East US" --zones "earth" "moon" --name "myFactory" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersFactoriesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--if-match**|string|ETag of the factory entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--location**|string|The resource location.|location|location|
|**--tags**|dictionary|The resource tags.|tags|tags|
|**--test-inherit**|object|Test Job Base|test_inherit|testInherit|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|FactoryGitHubConfiguration|
|**--fake-identity**|object|This is only for az test.|fake_identity|fakeIdentity|
|**--zones**|array|This is only for az test.|zones|zones|

#### <a name="FactoriesUpdate">Command `az datafactory update`</a>

##### <a name="ExamplesFactoriesUpdate">Example</a>
```
az datafactory update --name "myFactory" --tags exampleTag="exampleValue" --resource-group "myResourceGroup"
```
##### <a name="ParametersFactoriesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--tags**|dictionary|The resource tags.|tags|tags|

#### <a name="FactoriesDelete">Command `az datafactory delete`</a>

##### <a name="ExamplesFactoriesDelete">Example</a>
```
az datafactory delete --name "myFactory" --resource-group "myResourceGroup"
```
##### <a name="ParametersFactoriesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### <a name="FactoriesConfigureFactoryRepo">Command `az datafactory configure-factory-repo`</a>

##### <a name="ExamplesFactoriesConfigureFactoryRepo">Example</a>
```
az datafactory configure-factory-repo --factory-resource-id "/subscriptions/12345678-1234-1234-1234-12345678abc/resourc\
eGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myFactory" --factory-vsts-configuration \
"FactoryVSTSConfiguration" "project" "" "ADF" "repo" "/" "master" --location-id "East US"
```
##### <a name="ParametersFactoriesConfigureFactoryRepo">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--location-id**|string|The location identifier.|location_id|locationId|
|**--factory-resource-id**|string|The factory resource id.|factory_resource_id|factoryResourceId|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|FactoryGitHubConfiguration|

#### <a name="FactoriesGetDataPlaneAccess">Command `az datafactory get-data-plane-access`</a>

##### <a name="ExamplesFactoriesGetDataPlaneAccess">Example</a>
```
az datafactory get-data-plane-access --name "myFactory" --access-resource-path "" --expire-time \
"2018-11-10T09:46:20.2659347Z" --permissions "r" --profile-name "DefaultProfile" --start-time \
"2018-11-10T02:46:20.2659347Z" --resource-group "myResourceGroup"
```
##### <a name="ParametersFactoriesGetDataPlaneAccess">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--permissions**|string|The string with permissions for Data Plane access. Currently only 'r' is supported which grants read only access.|permissions|permissions|
|**--access-resource-path**|string|The resource path to get access relative to factory. Currently only empty string is supported which corresponds to the factory resource.|access_resource_path|accessResourcePath|
|**--profile-name**|string|The name of the profile. Currently only the default is supported. The default value is DefaultProfile.|profile_name|profileName|
|**--start-time**|string|Start time for the token. If not specified the current time will be used.|start_time|startTime|
|**--expire-time**|string|Expiration time for the token. Maximum duration for the token is eight hours and by default the token will expire in eight hours.|expire_time|expireTime|

#### <a name="FactoriesGetGitHubAccessToken">Command `az datafactory get-git-hub-access-token`</a>

##### <a name="ExamplesFactoriesGetGitHubAccessToken">Example</a>
```
az datafactory get-git-hub-access-token --name "myFactory" --git-hub-access-code "some" --git-hub-access-token-base-url\
 "some" --git-hub-client-id "some" --resource-group "myResourceGroup"
```
##### <a name="ParametersFactoriesGetGitHubAccessToken">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--git-hub-access-code**|string|GitHub access code.|git_hub_access_code|gitHubAccessCode|
|**--git-hub-access-token-base-url**|string|GitHub access token base URL.|git_hub_access_token_base_url|gitHubAccessTokenBaseUrl|
|**--git-hub-client-id**|string|GitHub application client ID.|git_hub_client_id|gitHubClientId|

### group `az datafactory domain-service`
#### <a name="DomainServicesCreateOrUpdate#Create">Command `az datafactory domain-service create`</a>


##### <a name="ParametersDomainServicesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--domain-service-name**|string|The name of the domain service.|domain_service_name|domainServiceName|
|**--location**|string|The resource location.|location|location|
|**--tags**|dictionary|The resource tags.|tags|tags|
|**--domain-name**|string|The name of the Azure domain that the user would like to deploy Domain Services to.|domain_name|domainName|
|**--replica-sets**|array|List of ReplicaSets|replica_sets|replicaSets|
|**--domain-configuration-type**|choice|Domain Configuration Type|domain_configuration_type|domainConfigurationType|
|**--sku**|choice|Sku Type|sku|sku|
|**--filtered-sync**|choice|Enabled or Disabled flag to turn on Group-based filtered sync|filtered_sync|filteredSync|

#### <a name="DomainServicesCreateOrUpdate#Update">Command `az datafactory domain-service update`</a>


##### <a name="ParametersDomainServicesCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--domain-service-name**|string|The name of the domain service.|domain_service_name|domainServiceName|
|**--location**|string|The resource location.|location|location|
|**--tags**|dictionary|The resource tags.|tags|tags|
|**--domain-name**|string|The name of the Azure domain that the user would like to deploy Domain Services to.|domain_name|domainName|
|**--replica-sets**|array|List of ReplicaSets|replica_sets|replicaSets|
|**--domain-configuration-type**|choice|Domain Configuration Type|domain_configuration_type|domainConfigurationType|
|**--sku**|choice|Sku Type|sku|sku|
|**--filtered-sync**|choice|Enabled or Disabled flag to turn on Group-based filtered sync|filtered_sync|filteredSync|

### group `az datafactory group`
#### <a name="GroupsCreate">Command `az datafactory group create`</a>


##### <a name="ParametersGroupsCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--project-name**|string|Name of the Azure Migrate project.|project_name|projectName|
|**--group-name**|string|Unique name of a group within a project.|group_name|groupName|
|**--e-tag**|string|For optimistic concurrency control.|e_tag|eTag|

### group `az datafactory integration-runtime`
#### <a name="IntegrationRuntimesListByFactory">Command `az datafactory integration-runtime list`</a>

##### <a name="ExamplesIntegrationRuntimesListByFactory">Example</a>
```
az datafactory integration-runtime list --factory-name "myFactory" --resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesListByFactory">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### <a name="IntegrationRuntimesGet">Command `az datafactory integration-runtime show`</a>

##### <a name="ExamplesIntegrationRuntimesGet">Example</a>
```
az datafactory integration-runtime show --factory-name "myFactory" --name "myIntegrationRuntime" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-none-match**|string|ETag of the integration runtime entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="IntegrationRuntimesCreateOrUpdate#Create#Managed">Command `az datafactory integration-runtime managed create`</a>


##### <a name="ParametersIntegrationRuntimesCreateOrUpdate#Create#Managed">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Integration runtime description.|managed_description|description|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|FactoryGitHubConfiguration|
|**--fake-identity**|object|This is only for az test.|managed_fake_identity|fakeIdentity|
|**--zones**|array|This is only for az test.|managed_zones|zones|
|**--compute-properties**|object|The compute resource for managed integration runtime.|managed_compute_properties|computeProperties|
|**--ssis-properties**|object|SSIS properties for managed integration runtime.|managed_ssis_properties|ssisProperties|

#### <a name="IntegrationRuntimesCreateOrUpdate#Create#SelfHosted">Command `az datafactory integration-runtime self-hosted create`</a>

##### <a name="ExamplesIntegrationRuntimesCreateOrUpdate#Create#SelfHosted">Example</a>
```
az datafactory integration-runtime self-hosted create --factory-name "myFactory" --description "A selfhosted \
integration runtime" --name "myIntegrationRuntime" --resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesCreateOrUpdate#Create#SelfHosted">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Integration runtime description.|self_hosted_description|description|
|**--linked-info**|object|The base definition of a linked integration runtime.|self_hosted_linked_info|linkedInfo|

#### <a name="IntegrationRuntimesUpdate">Command `az datafactory integration-runtime update`</a>

##### <a name="ExamplesIntegrationRuntimesUpdate">Example</a>
```
az datafactory integration-runtime update --factory-name "myFactory" --name "myIntegrationRuntime" --resource-group \
"myResourceGroup" --auto-update "Off" --update-delay-offset "\\"PT3H\\""
```
##### <a name="ParametersIntegrationRuntimesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--auto-update**|choice|Enables or disables the auto-update feature of the self-hosted integration runtime. See https://go.microsoft.com/fwlink/?linkid=854189.|auto_update|autoUpdate|
|**--update-delay-offset**|string|The time offset (in hours) in the day, e.g., PT03H is 3 hours. The integration runtime auto update will happen on that time.|update_delay_offset|updateDelayOffset|

#### <a name="IntegrationRuntimesDelete">Command `az datafactory integration-runtime delete`</a>

##### <a name="ExamplesIntegrationRuntimesDelete">Example</a>
```
az datafactory integration-runtime delete --factory-name "myFactory" --name "myIntegrationRuntime" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesGetConnectionInfo">Command `az datafactory integration-runtime get-connection-info`</a>

##### <a name="ExamplesIntegrationRuntimesGetConnectionInfo">Example</a>
```
az datafactory integration-runtime get-connection-info --factory-name "myFactory" --name "myIntegrationRuntime" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesGetConnectionInfo">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesGetMonitoringData">Command `az datafactory integration-runtime get-monitoring-data`</a>

##### <a name="ExamplesIntegrationRuntimesGetMonitoringData">Example</a>
```
az datafactory integration-runtime get-monitoring-data --factory-name "myFactory" --name "myIntegrationRuntime" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesGetMonitoringData">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesGetStatus">Command `az datafactory integration-runtime get-status`</a>

##### <a name="ExamplesIntegrationRuntimesGetStatus">Example</a>
```
az datafactory integration-runtime get-status --factory-name "myFactory" --name "myIntegrationRuntime" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesGetStatus">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesListAuthKeys">Command `az datafactory integration-runtime list-auth-key`</a>

##### <a name="ExamplesIntegrationRuntimesListAuthKeys">Example</a>
```
az datafactory integration-runtime list-auth-key --factory-name "myFactory" --name "myIntegrationRuntime" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesListAuthKeys">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesRegenerateAuthKey">Command `az datafactory integration-runtime regenerate-auth-key`</a>

##### <a name="ExamplesIntegrationRuntimesRegenerateAuthKey">Example</a>
```
az datafactory integration-runtime regenerate-auth-key --factory-name "myFactory" --name "myIntegrationRuntime" \
--key-name "authKey2" --resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesRegenerateAuthKey">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--key-name**|choice|The name of the authentication key to regenerate.|key_name|keyName|

#### <a name="IntegrationRuntimesRemoveLinks">Command `az datafactory integration-runtime remove-link`</a>

##### <a name="ExamplesIntegrationRuntimesRemoveLinks">Example</a>
```
az datafactory integration-runtime remove-link --factory-name "myFactory" --name "myIntegrationRuntime" \
--linked-factory-name "exampleFactoryName-linked" --resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesRemoveLinks">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--linked-factory-name**|string|The data factory name for linked integration runtime.|linked_factory_name|linkedFactoryName|

#### <a name="IntegrationRuntimesStart">Command `az datafactory integration-runtime start`</a>

##### <a name="ExamplesIntegrationRuntimesStart">Example</a>
```
az datafactory integration-runtime start --factory-name "myFactory" --name "myIntegrationRuntime2" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesStop">Command `az datafactory integration-runtime stop`</a>

##### <a name="ExamplesIntegrationRuntimesStop">Example</a>
```
az datafactory integration-runtime stop --factory-name "myFactory" --name "myIntegrationRuntime2" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesSyncCredentials">Command `az datafactory integration-runtime sync-credentials`</a>

##### <a name="ExamplesIntegrationRuntimesSyncCredentials">Example</a>
```
az datafactory integration-runtime sync-credentials --factory-name "myFactory" --name "myIntegrationRuntime" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesSyncCredentials">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesUpgrade">Command `az datafactory integration-runtime upgrade`</a>

##### <a name="ExamplesIntegrationRuntimesUpgrade">Example</a>
```
az datafactory integration-runtime upgrade --factory-name "myFactory" --name "myIntegrationRuntime" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersIntegrationRuntimesUpgrade">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

### group `az datafactory linked-integration-runtime`
#### <a name="CreateLinkedIntegrationRuntime">Command `az datafactory linked-integration-runtime create`</a>

##### <a name="ExamplesCreateLinkedIntegrationRuntime">Example</a>
```
az datafactory linked-integration-runtime create --name "myDatafactoryLinkedIntegrationRuntime" \
--data-factory-location "West US" --data-factory-name "e9955d6d-56ea-4be3-841c-52a12c1a9981" --subscription-id \
"061774c7-4b5a-4159-a55b-365581830283" --factory-name "myFactory" --integration-runtime-name "myIntegrationRuntime" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersCreateLinkedIntegrationRuntime">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--name**|string|The name of the linked integration runtime.|name|name|
|**--subscription-id**|string|The ID of the subscription that the linked integration runtime belongs to.|subscription_id|subscriptionId|
|**--data-factory-name**|string|The name of the data factory that the linked integration runtime belongs to.|data_factory_name|dataFactoryName|
|**--data-factory-location**|string|The location of the data factory that the linked integration runtime belongs to.|data_factory_location|dataFactoryLocation|

### group `az datafactory trigger`
#### <a name="TriggersListByFactory">Command `az datafactory trigger list`</a>

##### <a name="ExamplesTriggersListByFactory">Example</a>
```
az datafactory trigger list --factory-name "myFactory" --resource-group "myResourceGroup"
```
##### <a name="ParametersTriggersListByFactory">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### <a name="TriggersGet">Command `az datafactory trigger show`</a>

##### <a name="ExamplesTriggersGet">Example</a>
```
az datafactory trigger show --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### <a name="ParametersTriggersGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-none-match**|string|ETag of the trigger entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="TriggersCreateOrUpdate#Create">Command `az datafactory trigger create`</a>

##### <a name="ExamplesTriggersCreateOrUpdate#Create">Example</a>
```
az datafactory trigger create --factory-name "myFactory" --resource-group "myResourceGroup" --properties \
"{\\"type\\":\\"ScheduleTrigger\\",\\"pipelines\\":[{\\"parameters\\":{\\"OutputBlobNameList\\":[\\"exampleoutput.csv\\\
"]},\\"pipelineReference\\":{\\"type\\":\\"PipelineReference\\",\\"referenceName\\":\\"examplePipeline\\"}}],\\"typePro\
perties\\":{\\"recurrence\\":{\\"endTime\\":\\"2018-06-16T00:55:13.8441801Z\\",\\"frequency\\":\\"Minute\\",\\"interval\
\\":4,\\"startTime\\":\\"2018-06-16T00:39:13.8441801Z\\",\\"timeZone\\":\\"UTC\\"}}}" --name "myTrigger"
```
##### <a name="ParametersTriggersCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--properties**|object|Properties of the trigger.|properties|properties|

#### <a name="TriggersCreateOrUpdate#Update">Command `az datafactory trigger update`</a>

##### <a name="ExamplesTriggersCreateOrUpdate#Update">Example</a>
```
az datafactory trigger update --factory-name "myFactory" --resource-group "myResourceGroup" --description "Example \
description" --name "myTrigger"
```
##### <a name="ParametersTriggersCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Trigger description.|description|description|
|**--annotations**|array|List of tags that can be used for describing the trigger.|annotations|annotations|

#### <a name="TriggersDelete">Command `az datafactory trigger delete`</a>

##### <a name="ExamplesTriggersDelete">Example</a>
```
az datafactory trigger delete --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### <a name="ParametersTriggersDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersGetEventSubscriptionStatus">Command `az datafactory trigger get-event-subscription-status`</a>

##### <a name="ExamplesTriggersGetEventSubscriptionStatus">Example</a>
```
az datafactory trigger get-event-subscription-status --factory-name "myFactory" --resource-group "myResourceGroup" \
--name "myTrigger"
```
##### <a name="ParametersTriggersGetEventSubscriptionStatus">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersQueryByFactory">Command `az datafactory trigger query-by-factory`</a>

##### <a name="ExamplesTriggersQueryByFactory">Example</a>
```
az datafactory trigger query-by-factory --factory-name "myFactory" --parent-trigger-name "myTrigger" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersTriggersQueryByFactory">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--continuation-token**|string|The continuation token for getting the next page of results. Null for first page.|continuation_token|continuationToken|
|**--parent-trigger-name**|string|The name of the parent TumblingWindowTrigger to get the child rerun triggers|parent_trigger_name|parentTriggerName|

#### <a name="TriggersStart">Command `az datafactory trigger start`</a>

##### <a name="ExamplesTriggersStart">Example</a>
```
az datafactory trigger start --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### <a name="ParametersTriggersStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersStop">Command `az datafactory trigger stop`</a>

##### <a name="ExamplesTriggersStop">Example</a>
```
az datafactory trigger stop --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### <a name="ParametersTriggersStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersSubscribeToEvents">Command `az datafactory trigger subscribe-to-event`</a>

##### <a name="ExamplesTriggersSubscribeToEvents">Example</a>
```
az datafactory trigger subscribe-to-event --factory-name "myFactory" --resource-group "myResourceGroup" --name \
"myTrigger"
```
##### <a name="ParametersTriggersSubscribeToEvents">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersUnsubscribeFromEvents">Command `az datafactory trigger unsubscribe-from-event`</a>

##### <a name="ExamplesTriggersUnsubscribeFromEvents">Example</a>
```
az datafactory trigger unsubscribe-from-event --factory-name "myFactory" --resource-group "myResourceGroup" --name \
"myTrigger"
```
##### <a name="ParametersTriggersUnsubscribeFromEvents">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
