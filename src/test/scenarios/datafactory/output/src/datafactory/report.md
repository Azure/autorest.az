# Azure CLI Module Creation Report

### datafactory factory configure-factory-repo

configure-factory-repo a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--location-id**|string|The location identifier.|location_id|
|**--factory-resource-id**|string|The factory resource id.|factory_resource_id|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|
### datafactory factory create

create a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--if-match**|string|ETag of the factory entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|
|**--location**|string|The resource location.|location|
|**--tags**|dictionary|The resource tags.|tags|
|**--identity**|object|Managed service identity of the factory.|identity|
|**--factory-vsts-configuration**|object|Factory's VSTS repo information.|factory_vsts_configuration|
|**--factory-git-hub-configuration**|object|Factory's GitHub repo information.|factory_git_hub_configuration|
### datafactory factory delete

delete a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
### datafactory factory get-data-plane-access

get-data-plane-access a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--permissions**|string|The string with permissions for Data Plane access. Currently only 'r' is supported which grants read only access.|permissions|
|**--access-resource-path**|string|The resource path to get access relative to factory. Currently only empty string is supported which corresponds to the factory resource.|access_resource_path|
|**--profile-name**|string|The name of the profile. Currently only the default is supported. The default value is DefaultProfile.|profile_name|
|**--start-time**|string|Start time for the token. If not specified the current time will be used.|start_time|
|**--expire-time**|string|Expiration time for the token. Maximum duration for the token is eight hours and by default the token will expire in eight hours.|expire_time|
### datafactory factory get-git-hub-access-token

get-git-hub-access-token a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--git-hub-access-code**|string|GitHub access code.|git_hub_access_code|
|**--git-hub-access-token-base-url**|string|GitHub access token base URL.|git_hub_access_token_base_url|
|**--git-hub-client-id**|string|GitHub application client ID.|git_hub_client_id|
### datafactory factory list

list a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
### datafactory factory show

show a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--if-none-match**|string|ETag of the factory entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|
### datafactory factory update

update a datafactory factory.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The resource group name.|resource_group_name|
|**--factory-name**|string|The factory name.|factory_name|
|**--tags**|dictionary|The resource tags.|tags|
|**--identity**|object|Managed service identity of the factory.|identity|