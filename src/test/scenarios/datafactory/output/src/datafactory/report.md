# Azure CLI Module Creation Report

## extensions
datafactory

## groups
### Command groups in `az datafactory` extension
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|
|datafactory integration-runtime|IntegrationRuntimes|
|datafactory trigger|Triggers|

## commands
### Commands in `az datafactory` group
|CLI Command|Swagger name|Parameters|
|---------|------------|--------|
|az datafactory configure-factory-repo|ConfigureFactoryRepo|[Parameters](#Parameters001001)|
|az datafactory create|CreateOrUpdate#Create|[Parameters](#Parameters001002)|
|az datafactory delete|Delete|
|az datafactory get-data-plane-access|GetDataPlaneAccess|
|az datafactory get-git-hub-access-token|GetGitHubAccessToken|
|az datafactory list|ListByResourceGroup|
|az datafactory list|List|
|az datafactory update|Update|

### Commands in `az datafactory integration-runtime` group
|CLI Command|Swagger name|
|---------|------------|
|az datafactory integration-runtime delete|Delete|
|az datafactory integration-runtime get-connection-info|GetConnectionInfo|
|az datafactory integration-runtime get-status|GetStatus|
|az datafactory integration-runtime linked-integration-runtime create|CreateLinkedIntegrationRuntime|
|az datafactory integration-runtime list|ListByFactory|
|az datafactory integration-runtime managed create|CreateOrUpdate#Create#Managed|
|az datafactory integration-runtime regenerate-auth-key|RegenerateAuthKey|
|az datafactory integration-runtime remove-link|RemoveLinks|


## parameters
### group `az datafactory`
#### <a name="Parameters001001">Parameters in `az datafactory configure-factory-repo` command</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--location-id**|string|The location identifier.|location_id|locationId|
|**--factory-resource-id**|string|The factory resource id.|factory_resource_id|factoryResourceId|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|FactoryGitHubConfiguration|

#### <a name="Parameters001001"> Parameters in `az datafactory create` Command</a> 
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

#### Parameters in `az datafactory delete` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### Parameters in `az datafactory get-data-plane-access` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--permissions**|string|The string with permissions for Data Plane access. Currently only 'r' is supported which grants read only access.|permissions|permissions|
|**--access-resource-path**|string|The resource path to get access relative to factory. Currently only empty string is supported which corresponds to the factory resource.|access_resource_path|accessResourcePath|
|**--profile-name**|string|The name of the profile. Currently only the default is supported. The default value is DefaultProfile.|profile_name|profileName|
|**--start-time**|string|Start time for the token. If not specified the current time will be used.|start_time|startTime|
|**--expire-time**|string|Expiration time for the token. Maximum duration for the token is eight hours and by default the token will expire in eight hours.|expire_time|expireTime|

#### Parameters in `az datafactory get-git-hub-access-token` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--git-hub-access-code**|string|GitHub access code.|git_hub_access_code|gitHubAccessCode|
|**--git-hub-access-token-base-url**|string|GitHub access token base URL.|git_hub_access_token_base_url|gitHubAccessTokenBaseUrl|
|**--git-hub-client-id**|string|GitHub application client ID.|git_hub_client_id|gitHubClientId|


### group `az datafactory integration-runtime`
#### Parameters in `az datafactory integration-runtime delete` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### Parameters in `az datafactory integration-runtime get-connection-info` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### Parameters in `az datafactory integration-runtime get-monitoring-data` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### Parameters in `az datafactory integration-runtime get-status` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### Parameters in `az datafactory integration-runtime linked-integration-runtime create` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--name**|string|The name of the linked integration runtime.|name|name|
|**--subscription-id**|string|The ID of the subscription that the linked integration runtime belongs to.|subscription_id|subscriptionId|
|**--data-factory-name**|string|The name of the data factory that the linked integration runtime belongs to.|data_factory_name|dataFactoryName|
|**--data-factory-location**|string|The location of the data factory that the linked integration runtime belongs to.|data_factory_location|dataFactoryLocation|

#### Parameters in `az datafactory integration-runtime list` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

#### Parameters in `az datafactory integration-runtime list-auth-key` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

#### Parameters in `az datafactory integration-runtime managed create` command
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

#### Parameters in `az datafactory integration-runtime regenerate-auth-key` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--key-name**|choice|The name of the authentication key to regenerate.|key_name|keyName|

#### Parameters in `az datafactory integration-runtime remove-link` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--linked-factory-name**|string|The data factory name for linked integration runtime.|linked_factory_name|linkedFactoryName|

#### Parameters in `az datafactory integration-runtime self-hosted create`
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Integration runtime description.|self_hosted_description|description|
|**--type-properties-linked-info**|object|The base definition of a linked integration runtime.|self_hosted_linked_info|linkedInfo|

#### Parameters in `datafactory integration-runtime show` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--if-none-match**|string|ETag of the integration runtime entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### Parameters in `az datafactory integration-runtime start` command
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime stop

stop a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|stop|Stop|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime sync-credentials

sync-credentials a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|sync-credentials|SyncCredentials|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime update

update a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|update|Update|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|
|**--auto-update**|choice|Enables or disables the auto-update feature of the self-hosted integration runtime. See https://go.microsoft.com/fwlink/?linkid=854189.|auto_update|autoUpdate|
|**--update-delay-offset**|string|The time offset (in hours) in the day, e.g., PT03H is 3 hours. The integration runtime auto update will happen on that time.|update_delay_offset|updateDelayOffset|

### datafactory integration-runtime upgrade

upgrade a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|upgrade|Upgrade|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|integrationRuntimeName|

### datafactory list

list a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Methods
|Name (az)|Swagger name|
|---------|------------|


#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|

### datafactory show

show a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|show|Get|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--if-none-match**|string|ETag of the factory entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

### datafactory trigger create

create a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|


#### Methods
|Name (az)|Swagger name|
|---------|------------|
|create|CreateOrUpdate#Create|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--properties**|object|Properties of the trigger.|properties|properties|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|

### datafactory trigger delete

delete a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|delete|Delete|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

### datafactory trigger get-event-subscription-status

get-event-subscription-status a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|get-event-subscription-status|GetEventSubscriptionStatus|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

### datafactory trigger list

list a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|list|ListByFactory|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|

### datafactory trigger query-by-factory

query-by-factory a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|query-by-factory|QueryByFactory|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--continuation-token**|string|The continuation token for getting the next page of results. Null for first page.|continuation_token|continuationToken|
|**--parent-trigger-name**|string|The name of the parent TumblingWindowTrigger to get the child rerun triggers|parent_trigger_name|parentTriggerName|

### datafactory trigger show

show a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|show|Get|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-none-match**|string|ETag of the trigger entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

### datafactory trigger start

start a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|start|Start|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

### datafactory trigger stop

stop a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|stop|Stop|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

### datafactory trigger subscribe-to-event

subscribe-to-event a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|subscribe-to-event|SubscribeToEvents|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

### datafactory trigger unsubscribe-from-event

unsubscribe-from-event a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|unsubscribe-from-event|UnsubscribeFromEvents|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|

### datafactory trigger update

update a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|update|CreateOrUpdate#Update|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|trigger_name|triggerName|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|
|**--description**|string|Trigger description.|properties_description|description|
|**--annotations**|array|List of tags that can be used for describing the trigger.|properties_annotations|annotations|

### datafactory update

update a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Methods
|Name (az)|Swagger name|
|---------|------------|


#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|factory_name|factoryName|
|**--tags**|dictionary|The resource tags.|tags|tags|
