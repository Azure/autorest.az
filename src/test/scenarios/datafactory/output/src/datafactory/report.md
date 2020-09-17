# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az datafactory|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in 'az datafactory' extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az datafactory|Factories|[commands](#CommandsInFactories)|
|az datafactory trigger|Triggers|[commands](#CommandsInTriggers)|
|az datafactory integration-runtime|IntegrationRuntimes|[commands](#CommandsInIntegrationRuntimes)|

## COMMANDS
### <a name="CommandsInFactories">Commands in 'az datafactory' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory list](#FactoriesListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersFactoriesListByResourceGroup)|Not Found|
|[az datafactory list](#FactoriesList)|List|[Parameters](#ParametersFactoriesList)|Not Found|
|[az datafactory show](#FactoriesGet)|Get|[Parameters](#ParametersFactoriesGet)|Not Found|
|[az datafactory create](#FactoriesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersFactoriesCreateOrUpdate#Create)|Not Found|
|[az datafactory update](#FactoriesUpdate)|Update|[Parameters](#ParametersFactoriesUpdate)|Not Found|
|[az datafactory delete](#FactoriesDelete)|Delete|[Parameters](#ParametersFactoriesDelete)|Not Found|
|[az datafactory configure-factory-repo](#FactoriesConfigureFactoryRepo)|ConfigureFactoryRepo|[Parameters](#ParametersFactoriesConfigureFactoryRepo)|Not Found|
|[az datafactory get-data-plane-access](#FactoriesGetDataPlaneAccess)|GetDataPlaneAccess|[Parameters](#ParametersFactoriesGetDataPlaneAccess)|Not Found|
|[az datafactory get-git-hub-access-token](#FactoriesGetGitHubAccessToken)|GetGitHubAccessToken|[Parameters](#ParametersFactoriesGetGitHubAccessToken)|Not Found|

### <a name="CommandsInIntegrationRuntimes">Commands in 'az datafactory integration-runtime' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory integration-runtime list](#IntegrationRuntimesListByFactory)|ListByFactory|[Parameters](#ParametersIntegrationRuntimesListByFactory)|Not Found|
|[az datafactory integration-runtime show](#IntegrationRuntimesGet)|Get|[Parameters](#ParametersIntegrationRuntimesGet)|Not Found|
|[az datafactory integration-runtime linked-integration-runtime create](#IntegrationRuntimesCreateLinkedIntegrationRuntime)|CreateLinkedIntegrationRuntime|[Parameters](#ParametersIntegrationRuntimesCreateLinkedIntegrationRuntime)|Not Found|
|[az datafactory integration-runtime managed create](#IntegrationRuntimesCreateOrUpdate#Create#Managed)|CreateOrUpdate#Create#Managed|[Parameters](#ParametersIntegrationRuntimesCreateOrUpdate#Create#Managed)|Not Found|
|[az datafactory integration-runtime self-hosted create](#IntegrationRuntimesCreateOrUpdate#Create#SelfHosted)|CreateOrUpdate#Create#SelfHosted|[Parameters](#ParametersIntegrationRuntimesCreateOrUpdate#Create#SelfHosted)|Not Found|
|[az datafactory integration-runtime update](#IntegrationRuntimesUpdate)|Update|[Parameters](#ParametersIntegrationRuntimesUpdate)|Not Found|
|[az datafactory integration-runtime delete](#IntegrationRuntimesDelete)|Delete|[Parameters](#ParametersIntegrationRuntimesDelete)|Not Found|
|[az datafactory integration-runtime get-connection-info](#IntegrationRuntimesGetConnectionInfo)|GetConnectionInfo|[Parameters](#ParametersIntegrationRuntimesGetConnectionInfo)|Not Found|
|[az datafactory integration-runtime get-monitoring-data](#IntegrationRuntimesGetMonitoringData)|GetMonitoringData|[Parameters](#ParametersIntegrationRuntimesGetMonitoringData)|Not Found|
|[az datafactory integration-runtime get-status](#IntegrationRuntimesGetStatus)|GetStatus|[Parameters](#ParametersIntegrationRuntimesGetStatus)|Not Found|
|[az datafactory integration-runtime list-auth-key](#IntegrationRuntimesListAuthKeys)|ListAuthKeys|[Parameters](#ParametersIntegrationRuntimesListAuthKeys)|Not Found|
|[az datafactory integration-runtime regenerate-auth-key](#IntegrationRuntimesRegenerateAuthKey)|RegenerateAuthKey|[Parameters](#ParametersIntegrationRuntimesRegenerateAuthKey)|Not Found|
|[az datafactory integration-runtime remove-link](#IntegrationRuntimesRemoveLinks)|RemoveLinks|[Parameters](#ParametersIntegrationRuntimesRemoveLinks)|Not Found|
|[az datafactory integration-runtime start](#IntegrationRuntimesStart)|Start|[Parameters](#ParametersIntegrationRuntimesStart)|Not Found|
|[az datafactory integration-runtime stop](#IntegrationRuntimesStop)|Stop|[Parameters](#ParametersIntegrationRuntimesStop)|Not Found|
|[az datafactory integration-runtime sync-credentials](#IntegrationRuntimesSyncCredentials)|SyncCredentials|[Parameters](#ParametersIntegrationRuntimesSyncCredentials)|Not Found|
|[az datafactory integration-runtime upgrade](#IntegrationRuntimesUpgrade)|Upgrade|[Parameters](#ParametersIntegrationRuntimesUpgrade)|Not Found|

### <a name="CommandsInTriggers">Commands in 'az datafactory trigger' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az datafactory trigger list](#TriggersListByFactory)|ListByFactory|[Parameters](#ParametersTriggersListByFactory)|Not Found|
|[az datafactory trigger show](#TriggersGet)|Get|[Parameters](#ParametersTriggersGet)|Not Found|
|[az datafactory trigger create](#TriggersCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersTriggersCreateOrUpdate#Create)|Not Found|
|[az datafactory trigger update](#TriggersCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersTriggersCreateOrUpdate#Update)|Not Found|
|[az datafactory trigger delete](#TriggersDelete)|Delete|[Parameters](#ParametersTriggersDelete)|Not Found|
|[az datafactory trigger get-event-subscription-status](#TriggersGetEventSubscriptionStatus)|GetEventSubscriptionStatus|[Parameters](#ParametersTriggersGetEventSubscriptionStatus)|Not Found|
|[az datafactory trigger query-by-factory](#TriggersQueryByFactory)|QueryByFactory|[Parameters](#ParametersTriggersQueryByFactory)|Not Found|
|[az datafactory trigger start](#TriggersStart)|Start|[Parameters](#ParametersTriggersStart)|Not Found|
|[az datafactory trigger stop](#TriggersStop)|Stop|[Parameters](#ParametersTriggersStop)|Not Found|
|[az datafactory trigger subscribe-to-event](#TriggersSubscribeToEvents)|SubscribeToEvents|[Parameters](#ParametersTriggersSubscribeToEvents)|Not Found|
|[az datafactory trigger unsubscribe-from-event](#TriggersUnsubscribeFromEvents)|UnsubscribeFromEvents|[Parameters](#ParametersTriggersUnsubscribeFromEvents)|Not Found|


## COMMAND DETAILS

### group 'az datafactory'
#### <a name="FactoriesListByResourceGroup">Command 'az datafactory list'</a>

##### <a name="ParametersFactoriesListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="FactoriesList">Command 'az datafactory list'</a>

|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|

#### <a name="FactoriesGet">Command 'az datafactory show'</a>

##### <a name="ParametersFactoriesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--if-none-match**|string|ETag of the factory entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="FactoriesCreateOrUpdate#Create">Command 'az datafactory create'</a>

##### <a name="ParametersFactoriesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--if-match**|string|ETag of the factory entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--location**|string|The resource location.|location|location|
|**--tags**|dictionary|The resource tags.|tags|tags|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|FactoryGitHubConfiguration|
|**--fake-identity**|object|This is only for az test.|fake_identity|fakeIdentity|
|**--zones**|array|This is only for az test.|zones|zones|

#### <a name="FactoriesUpdate">Command 'az datafactory update'</a>

##### <a name="ParametersFactoriesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--tags**|dictionary|The resource tags.|tags|tags|

#### <a name="FactoriesDelete">Command 'az datafactory delete'</a>

##### <a name="ParametersFactoriesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### <a name="FactoriesConfigureFactoryRepo">Command 'az datafactory configure-factory-repo'</a>

##### <a name="ParametersFactoriesConfigureFactoryRepo">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--location-id**|string|The location identifier.|location_id|locationId|
|**--factory-resource-id**|string|The factory resource id.|factory_resource_id|factoryResourceId|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|FactoryGitHubConfiguration|

#### <a name="FactoriesGetDataPlaneAccess">Command 'az datafactory get-data-plane-access'</a>

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

#### <a name="FactoriesGetGitHubAccessToken">Command 'az datafactory get-git-hub-access-token'</a>

##### <a name="ParametersFactoriesGetGitHubAccessToken">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--git-hub-access-code**|string|GitHub access code.|git_hub_access_code|gitHubAccessCode|
|**--git-hub-access-token-base-url**|string|GitHub access token base URL.|git_hub_access_token_base_url|gitHubAccessTokenBaseUrl|
|**--git-hub-client-id**|string|GitHub application client ID.|git_hub_client_id|gitHubClientId|

### group 'az datafactory integration-runtime'
#### <a name="IntegrationRuntimesListByFactory">Command 'az datafactory integration-runtime list'</a>

##### <a name="ParametersIntegrationRuntimesListByFactory">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### <a name="IntegrationRuntimesGet">Command 'az datafactory integration-runtime show'</a>

##### <a name="ParametersIntegrationRuntimesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-none-match**|string|ETag of the integration runtime entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="IntegrationRuntimesCreateLinkedIntegrationRuntime">Command 'az datafactory integration-runtime linked-integration-runtime create'</a>

##### <a name="ParametersIntegrationRuntimesCreateLinkedIntegrationRuntime">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--name**|string|The name of the linked integration runtime.|name|name|
|**--subscription-id**|string|The ID of the subscription that the linked integration runtime belongs to.|subscription_id|subscriptionId|
|**--data-factory-name**|string|The name of the data factory that the linked integration runtime belongs to.|data_factory_name|dataFactoryName|
|**--data-factory-location**|string|The location of the data factory that the linked integration runtime belongs to.|data_factory_location|dataFactoryLocation|

#### <a name="IntegrationRuntimesCreateOrUpdate#Create#Managed">Command 'az datafactory integration-runtime managed create'</a>

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
|**--type-properties-compute-properties**|object|The compute resource for managed integration runtime.|managed_compute_properties|computeProperties|
|**--type-properties-ssis-properties**|object|SSIS properties for managed integration runtime.|managed_ssis_properties|ssisProperties|

#### <a name="IntegrationRuntimesCreateOrUpdate#Create#SelfHosted">Command 'az datafactory integration-runtime self-hosted create'</a>

##### <a name="ParametersIntegrationRuntimesCreateOrUpdate#Create#SelfHosted">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Integration runtime description.|self_hosted_description|description|
|**--type-properties-linked-info**|object|The base definition of a linked integration runtime.|self_hosted_linked_info|linkedInfo|

#### <a name="IntegrationRuntimesUpdate">Command 'az datafactory integration-runtime update'</a>

##### <a name="ParametersIntegrationRuntimesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--auto-update**|choice|Enables or disables the auto-update feature of the self-hosted integration runtime. See https://go.microsoft.com/fwlink/?linkid=854189.|auto_update|autoUpdate|
|**--update-delay-offset**|string|The time offset (in hours) in the day, e.g., PT03H is 3 hours. The integration runtime auto update will happen on that time.|update_delay_offset|updateDelayOffset|

#### <a name="IntegrationRuntimesDelete">Command 'az datafactory integration-runtime delete'</a>

##### <a name="ParametersIntegrationRuntimesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesGetConnectionInfo">Command 'az datafactory integration-runtime get-connection-info'</a>

##### <a name="ParametersIntegrationRuntimesGetConnectionInfo">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesGetMonitoringData">Command 'az datafactory integration-runtime get-monitoring-data'</a>

##### <a name="ParametersIntegrationRuntimesGetMonitoringData">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesGetStatus">Command 'az datafactory integration-runtime get-status'</a>

##### <a name="ParametersIntegrationRuntimesGetStatus">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesListAuthKeys">Command 'az datafactory integration-runtime list-auth-key'</a>

##### <a name="ParametersIntegrationRuntimesListAuthKeys">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesRegenerateAuthKey">Command 'az datafactory integration-runtime regenerate-auth-key'</a>

##### <a name="ParametersIntegrationRuntimesRegenerateAuthKey">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--key-name**|choice|The name of the authentication key to regenerate.|key_name|keyName|

#### <a name="IntegrationRuntimesRemoveLinks">Command 'az datafactory integration-runtime remove-link'</a>

##### <a name="ParametersIntegrationRuntimesRemoveLinks">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--linked-factory-name**|string|The data factory name for linked integration runtime.|linked_factory_name|linkedFactoryName|

#### <a name="IntegrationRuntimesStart">Command 'az datafactory integration-runtime start'</a>

##### <a name="ParametersIntegrationRuntimesStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesStop">Command 'az datafactory integration-runtime stop'</a>

##### <a name="ParametersIntegrationRuntimesStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesSyncCredentials">Command 'az datafactory integration-runtime sync-credentials'</a>

##### <a name="ParametersIntegrationRuntimesSyncCredentials">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesUpgrade">Command 'az datafactory integration-runtime upgrade'</a>

##### <a name="ParametersIntegrationRuntimesUpgrade">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

### group 'az datafactory trigger'
#### <a name="TriggersListByFactory">Command 'az datafactory trigger list'</a>

##### <a name="ParametersTriggersListByFactory">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### <a name="TriggersGet">Command 'az datafactory trigger show'</a>

##### <a name="ParametersTriggersGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-none-match**|string|ETag of the trigger entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="TriggersCreateOrUpdate#Create">Command 'az datafactory trigger create'</a>

##### <a name="ParametersTriggersCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--properties**|object|Properties of the trigger.|properties|properties|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|

#### <a name="TriggersCreateOrUpdate#Update">Command 'az datafactory trigger update'</a>

##### <a name="ParametersTriggersCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Trigger description.|description|description|
|**--annotations**|array|List of tags that can be used for describing the trigger.|annotations|annotations|

#### <a name="TriggersDelete">Command 'az datafactory trigger delete'</a>

##### <a name="ParametersTriggersDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersGetEventSubscriptionStatus">Command 'az datafactory trigger get-event-subscription-status'</a>

##### <a name="ParametersTriggersGetEventSubscriptionStatus">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersQueryByFactory">Command 'az datafactory trigger query-by-factory'</a>

##### <a name="ParametersTriggersQueryByFactory">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--continuation-token**|string|The continuation token for getting the next page of results. Null for first page.|continuation_token|continuationToken|
|**--parent-trigger-name**|string|The name of the parent TumblingWindowTrigger to get the child rerun triggers|parent_trigger_name|parentTriggerName|

#### <a name="TriggersStart">Command 'az datafactory trigger start'</a>

##### <a name="ParametersTriggersStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersStop">Command 'az datafactory trigger stop'</a>

##### <a name="ParametersTriggersStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersSubscribeToEvents">Command 'az datafactory trigger subscribe-to-event'</a>

##### <a name="ParametersTriggersSubscribeToEvents">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

#### <a name="TriggersUnsubscribeFromEvents">Command 'az datafactory trigger unsubscribe-from-event'</a>

##### <a name="ParametersTriggersUnsubscribeFromEvents">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
