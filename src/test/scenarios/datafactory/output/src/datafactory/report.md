# Azure CLI Module Creation Report

### datafactory configure-factory-repo

configure-factory-repo a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--location-id**|string|The location identifier.|ConfigureFactoryRepo|location_id|locationId|
|**--factory-resource-id**|string|The factory resource id.|ConfigureFactoryRepo|factory_resource_id|factoryResourceId|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|ConfigureFactoryRepo|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|ConfigureFactoryRepo|factory_git_hub_configuration|FactoryGitHubConfiguration|

### datafactory create

create a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|CreateOrUpdate|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|CreateOrUpdate|factory_name|factoryName|
|**--if-match**|string|ETag of the factory entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|CreateOrUpdate|if_match|If-Match|
|**--location**|string|The resource location.|CreateOrUpdate|location|location|
|**--tags**|dictionary|The resource tags.|CreateOrUpdate|tags|tags|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|CreateOrUpdate|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|CreateOrUpdate|factory_git_hub_configuration|FactoryGitHubConfiguration|
|**--fake-identity**|object|This is only for az test.|CreateOrUpdate|fake_identity|fakeIdentity|
|**--zones**|array|This is only for az test.|CreateOrUpdate|zones|zones|

### datafactory delete

delete a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Delete|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Delete|factory_name|factoryName|

### datafactory get-data-plane-access

get-data-plane-access a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|GetDataPlaneAccess|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|GetDataPlaneAccess|factory_name|factoryName|
|**--permissions**|string|The string with permissions for Data Plane access. Currently only 'r' is supported which grants read only access.|GetDataPlaneAccess|permissions|permissions|
|**--access-resource-path**|string|The resource path to get access relative to factory. Currently only empty string is supported which corresponds to the factory resource.|GetDataPlaneAccess|access_resource_path|accessResourcePath|
|**--profile-name**|string|The name of the profile. Currently only the default is supported. The default value is DefaultProfile.|GetDataPlaneAccess|profile_name|profileName|
|**--start-time**|string|Start time for the token. If not specified the current time will be used.|GetDataPlaneAccess|start_time|startTime|
|**--expire-time**|string|Expiration time for the token. Maximum duration for the token is eight hours and by default the token will expire in eight hours.|GetDataPlaneAccess|expire_time|expireTime|

### datafactory get-git-hub-access-token

get-git-hub-access-token a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|GetGitHubAccessToken|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|GetGitHubAccessToken|factory_name|factoryName|
|**--git-hub-access-code**|string|GitHub access code.|GetGitHubAccessToken|git_hub_access_code|gitHubAccessCode|
|**--git-hub-access-token-base-url**|string|GitHub access token base URL.|GetGitHubAccessToken|git_hub_access_token_base_url|gitHubAccessTokenBaseUrl|
|**--git-hub-client-id**|string|GitHub application client ID.|GetGitHubAccessToken|git_hub_client_id|gitHubClientId|

### datafactory integration-runtime delete

delete a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Delete|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Delete|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|Delete|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime get-connection-info

get-connection-info a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|GetConnectionInfo|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|GetConnectionInfo|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|GetConnectionInfo|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime get-monitoring-data

get-monitoring-data a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|GetMonitoringData|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|GetMonitoringData|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|GetMonitoringData|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime get-status

get-status a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|GetStatus|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|GetStatus|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|GetStatus|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime linked-integration-runtime create

linked-integration-runtime create a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|CreateLinkedIntegrationRuntime|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|CreateLinkedIntegrationRuntime|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|CreateLinkedIntegrationRuntime|integration_runtime_name|integrationRuntimeName|
|**--name**|string|The name of the linked integration runtime.|CreateLinkedIntegrationRuntime|name|name|
|**--subscription-id**|string|The ID of the subscription that the linked integration runtime belongs to.|CreateLinkedIntegrationRuntime|subscription_id|subscriptionId|
|**--data-factory-name**|string|The name of the data factory that the linked integration runtime belongs to.|CreateLinkedIntegrationRuntime|data_factory_name|dataFactoryName|
|**--data-factory-location**|string|The location of the data factory that the linked integration runtime belongs to.|CreateLinkedIntegrationRuntime|data_factory_location|dataFactoryLocation|

### datafactory integration-runtime list

list a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|ListByFactory|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|ListByFactory|factory_name|factoryName|

### datafactory integration-runtime list-auth-key

list-auth-key a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|ListAuthKeys|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|ListAuthKeys|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|ListAuthKeys|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime managed create

managed create a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|CreateOrUpdate#Managed|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|CreateOrUpdate#Managed|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|CreateOrUpdate#Managed|integration_runtime_name|integrationRuntimeName|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|CreateOrUpdate#Managed|if_match|If-Match|
|**--description**|string|Integration runtime description.|CreateOrUpdate#Managed|managed_description|description|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|CreateOrUpdate#Managed|factory_vsts_configuration|FactoryVSTSConfiguration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|CreateOrUpdate#Managed|factory_git_hub_configuration|FactoryGitHubConfiguration|
|**--fake-identity**|object|This is only for az test.|CreateOrUpdate#Managed|managed_fake_identity|fakeIdentity|
|**--zones**|array|This is only for az test.|CreateOrUpdate#Managed|managed_zones|zones|
|**--type-properties-compute-properties**|object|The compute resource for managed integration runtime.|CreateOrUpdate#Managed|managed_compute_properties|computeProperties|
|**--type-properties-ssis-properties**|object|SSIS properties for managed integration runtime.|CreateOrUpdate#Managed|managed_ssis_properties|ssisProperties|

### datafactory integration-runtime regenerate-auth-key

regenerate-auth-key a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|RegenerateAuthKey|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|RegenerateAuthKey|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|RegenerateAuthKey|integration_runtime_name|integrationRuntimeName|
|**--key-name**|choice|The name of the authentication key to regenerate.|RegenerateAuthKey|key_name|keyName|

### datafactory integration-runtime remove-link

remove-link a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|RemoveLinks|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|RemoveLinks|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|RemoveLinks|integration_runtime_name|integrationRuntimeName|
|**--linked-factory-name**|string|The data factory name for linked integration runtime.|RemoveLinks|linked_factory_name|linkedFactoryName|

### datafactory integration-runtime self-hosted create

self-hosted create a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|CreateOrUpdate#SelfHosted|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|CreateOrUpdate#SelfHosted|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|CreateOrUpdate#SelfHosted|integration_runtime_name|integrationRuntimeName|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|CreateOrUpdate#SelfHosted|if_match|If-Match|
|**--description**|string|Integration runtime description.|CreateOrUpdate#SelfHosted|self_hosted_description|description|
|**--type-properties-linked-info**|object|The base definition of a linked integration runtime.|CreateOrUpdate#SelfHosted|self_hosted_linked_info|linkedInfo|

### datafactory integration-runtime show

show a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Get|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Get|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|Get|integration_runtime_name|integrationRuntimeName|
|**--if-none-match**|string|ETag of the integration runtime entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|Get|if_none_match|If-None-Match|

### datafactory integration-runtime start

start a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Start|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Start|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|Start|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime stop

stop a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Stop|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Stop|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|Stop|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime sync-credentials

sync-credentials a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|SyncCredentials|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|SyncCredentials|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|SyncCredentials|integration_runtime_name|integrationRuntimeName|

### datafactory integration-runtime update

update a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Update|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Update|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|Update|integration_runtime_name|integrationRuntimeName|
|**--auto-update**|choice|Enables or disables the auto-update feature of the self-hosted integration runtime. See https://go.microsoft.com/fwlink/?linkid=854189.|Update|auto_update|autoUpdate|
|**--update-delay-offset**|string|The time offset (in hours) in the day, e.g., PT03H is 3 hours. The integration runtime auto update will happen on that time.|Update|update_delay_offset|updateDelayOffset|

### datafactory integration-runtime upgrade

upgrade a datafactory integration-runtime.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory integration-runtime|IntegrationRuntimes|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Upgrade|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Upgrade|factory_name|factoryName|
|**--integration-runtime-name**|string|The integration runtime name.|Upgrade|integration_runtime_name|integrationRuntimeName|

### datafactory list

list a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|ListByResourceGroup|resource_group_name|resourceGroupName|

### datafactory show

show a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Get|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Get|factory_name|factoryName|
|**--if-none-match**|string|ETag of the factory entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|Get|if_none_match|If-None-Match|

### datafactory trigger create

create a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|CreateOrUpdate|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|CreateOrUpdate|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|CreateOrUpdate|trigger_name|triggerName|
|**--properties**|object|Properties of the trigger.|CreateOrUpdate|properties|properties|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|CreateOrUpdate|if_match|If-Match|

### datafactory trigger delete

delete a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Delete|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Delete|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|Delete|trigger_name|triggerName|

### datafactory trigger get-event-subscription-status

get-event-subscription-status a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|GetEventSubscriptionStatus|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|GetEventSubscriptionStatus|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|GetEventSubscriptionStatus|trigger_name|triggerName|

### datafactory trigger list

list a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|ListByFactory|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|ListByFactory|factory_name|factoryName|

### datafactory trigger query-by-factory

query-by-factory a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|QueryByFactory|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|QueryByFactory|factory_name|factoryName|
|**--continuation-token**|string|The continuation token for getting the next page of results. Null for first page.|QueryByFactory|continuation_token|continuationToken|
|**--parent-trigger-name**|string|The name of the parent TumblingWindowTrigger to get the child rerun triggers|QueryByFactory|parent_trigger_name|parentTriggerName|

### datafactory trigger show

show a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Get|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Get|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|Get|trigger_name|triggerName|
|**--if-none-match**|string|ETag of the trigger entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|Get|if_none_match|If-None-Match|

### datafactory trigger start

start a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Start|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Start|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|Start|trigger_name|triggerName|

### datafactory trigger stop

stop a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Stop|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Stop|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|Stop|trigger_name|triggerName|

### datafactory trigger subscribe-to-event

subscribe-to-event a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|SubscribeToEvents|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|SubscribeToEvents|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|SubscribeToEvents|trigger_name|triggerName|

### datafactory trigger unsubscribe-from-event

unsubscribe-from-event a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|UnsubscribeFromEvents|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|UnsubscribeFromEvents|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|UnsubscribeFromEvents|trigger_name|triggerName|

### datafactory trigger update

create a datafactory trigger.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory trigger|Triggers|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|CreateOrUpdate|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|CreateOrUpdate|factory_name|factoryName|
|**--trigger-name**|string|The trigger name.|CreateOrUpdate|trigger_name|triggerName|
|**--properties**|object|Properties of the trigger.|CreateOrUpdate|properties|properties|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|CreateOrUpdate|if_match|If-Match|

### datafactory update

update a datafactory.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|datafactory|Factories|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The resource group name.|Update|resource_group_name|resourceGroupName|
|**--factory-name**|string|The factory name.|Update|factory_name|factoryName|
|**--tags**|dictionary|The resource tags.|Update|tags|tags|
