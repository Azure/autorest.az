# Azure CLI Module Creation Report

### datafactory configure-factory-repo

configure-factory-repo a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--location-id**|string|The location identifier.|location_id|
|**--factory-resource-id**|string|The factory resource id.|factory_resource_id|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|
### datafactory create

create a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--if-match**|string|ETag of the factory entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|
|**--location**|string|The resource location.|location|
|**--tags**|dictionary|The resource tags.|tags|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|
|**--fake-identity**|object|This is only for az test.|fake_identity|
|**--zones**|array|This is only for az test.|zones|
### datafactory delete

delete a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
### datafactory get-data-plane-access

get-data-plane-access a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--permissions**|string|The string with permissions for Data Plane access. Currently only 'r' is supported which grants read only access.|permissions|
|**--access-resource-path**|string|The resource path to get access relative to factory. Currently only empty string is supported which corresponds to the factory resource.|access_resource_path|
|**--profile-name**|string|The name of the profile. Currently only the default is supported. The default value is DefaultProfile.|profile_name|
|**--start-time**|string|Start time for the token. If not specified the current time will be used.|start_time|
|**--expire-time**|string|Expiration time for the token. Maximum duration for the token is eight hours and by default the token will expire in eight hours.|expire_time|
### datafactory get-git-hub-access-token

get-git-hub-access-token a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--git-hub-access-code**|string|GitHub access code.|git_hub_access_code|
|**--git-hub-access-token-base-url**|string|GitHub access token base URL.|git_hub_access_token_base_url|
|**--git-hub-client-id**|string|GitHub application client ID.|git_hub_client_id|
### datafactory integration-runtime delete

delete a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime get-connection-info

get-connection-info a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime get-monitoring-data

get-monitoring-data a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime get-status

get-status a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime linked-integration-runtime create

linked-integration-runtime create a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--name**|string|The name of the linked integration runtime.|name|
|**--subscription-id**|string|The ID of the subscription that the linked integration runtime belongs to.|subscription_id|
|**--data-factory-name**|string|The name of the data factory that the linked integration runtime belongs to.|data_factory_name|
|**--data-factory-location**|string|The location of the data factory that the linked integration runtime belongs to.|data_factory_location|
### datafactory integration-runtime list

list a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
### datafactory integration-runtime list-auth-key

list-auth-key a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime managed create

managed create a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|
|**--description**|string|Integration runtime description.|managed_description|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|
|**--fake-identity**|object|This is only for az test.|managed_fake_identity|
|**--zones**|array|This is only for az test.|managed_zones|
|**--type-properties-compute-properties**|object|The compute resource for managed integration runtime.|managed_compute_properties|
|**--type-properties-ssis-properties**|object|SSIS properties for managed integration runtime.|managed_ssis_properties|
### datafactory integration-runtime regenerate-auth-key

regenerate-auth-key a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--key-name**|choice|The name of the authentication key to regenerate.|key_name|
### datafactory integration-runtime remove-link

remove-link a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--linked-factory-name**|string|The data factory name for linked integration runtime.|linked_factory_name|
### datafactory integration-runtime self-hosted create

self-hosted create a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|
|**--description**|string|Integration runtime description.|self_hosted_description|
|**--type-properties-linked-info**|object|The base definition of a linked integration runtime.|self_hosted_linked_info|
### datafactory integration-runtime show

show a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--if-none-match**|string|ETag of the integration runtime entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|
### datafactory integration-runtime start

start a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime stop

stop a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime sync-credentials

sync-credentials a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory integration-runtime update

update a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
|**--auto-update**|choice|Enables or disables the auto-update feature of the self-hosted integration runtime. See https://go.microsoft.com/fwlink/?linkid=854189.|auto_update|
|**--update-delay-offset**|string|The time offset (in hours) in the day, e.g., PT03H is 3 hours. The integration runtime auto update will happen on that time.|update_delay_offset|
### datafactory integration-runtime upgrade

upgrade a datafactory integration-runtime.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--integration-runtime-name**|string|The integration runtime name.|integration_runtime_name|
### datafactory list

list a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
### datafactory show

show a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--if-none-match**|string|ETag of the factory entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|
### datafactory trigger create

create a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
|**--properties**|object|Properties of the trigger.|properties|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|
### datafactory trigger delete

delete a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
### datafactory trigger get-event-subscription-status

get-event-subscription-status a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
### datafactory trigger list

list a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
### datafactory trigger query-by-factory

query-by-factory a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--continuation-token**|string|The continuation token for getting the next page of results. Null for first page.|continuation_token|
|**--parent-trigger-name**|string|The name of the parent TumblingWindowTrigger to get the child rerun triggers|parent_trigger_name|
### datafactory trigger show

show a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
|**--if-none-match**|string|ETag of the trigger entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|
### datafactory trigger start

start a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
### datafactory trigger stop

stop a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
### datafactory trigger subscribe-to-event

subscribe-to-event a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
### datafactory trigger unsubscribe-from-event

unsubscribe-from-event a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
### datafactory trigger update

update a datafactory trigger.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--trigger-name**|string|The trigger name.|trigger_name|
|**--properties**|object|Properties of the trigger.|properties|
|**--if-match**|string|ETag of the trigger entity.  Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|
### datafactory update

update a datafactory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--tags**|dictionary|The resource tags.|tags|