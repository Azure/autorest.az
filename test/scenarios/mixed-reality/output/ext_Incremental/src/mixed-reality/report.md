# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az mixed-reality|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az mixed-reality` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az remote-rendering-account|RemoteRenderingAccounts|[commands](#CommandsInRemoteRenderingAccounts)|
|az spatial-anchors-account|SpatialAnchorsAccounts|[commands](#CommandsInSpatialAnchorsAccounts)|

## COMMANDS
### <a name="CommandsInRemoteRenderingAccounts">Commands in `az remote-rendering-account` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az remote-rendering-account list](#RemoteRenderingAccountsListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersRemoteRenderingAccountsListByResourceGroup)|[Example](#ExamplesRemoteRenderingAccountsListByResourceGroup)|
|[az remote-rendering-account list](#RemoteRenderingAccountsListBySubscription)|ListBySubscription|[Parameters](#ParametersRemoteRenderingAccountsListBySubscription)|[Example](#ExamplesRemoteRenderingAccountsListBySubscription)|
|[az remote-rendering-account show](#RemoteRenderingAccountsGet)|Get|[Parameters](#ParametersRemoteRenderingAccountsGet)|[Example](#ExamplesRemoteRenderingAccountsGet)|
|[az remote-rendering-account create](#RemoteRenderingAccountsCreate)|Create|[Parameters](#ParametersRemoteRenderingAccountsCreate)|[Example](#ExamplesRemoteRenderingAccountsCreate)|
|[az remote-rendering-account update](#RemoteRenderingAccountsUpdate)|Update|[Parameters](#ParametersRemoteRenderingAccountsUpdate)|[Example](#ExamplesRemoteRenderingAccountsUpdate)|
|[az remote-rendering-account delete](#RemoteRenderingAccountsDelete)|Delete|[Parameters](#ParametersRemoteRenderingAccountsDelete)|[Example](#ExamplesRemoteRenderingAccountsDelete)|
|[az remote-rendering-account list-key](#RemoteRenderingAccountsListKeys)|ListKeys|[Parameters](#ParametersRemoteRenderingAccountsListKeys)|[Example](#ExamplesRemoteRenderingAccountsListKeys)|
|[az remote-rendering-account regenerate-key](#RemoteRenderingAccountsRegenerateKeys)|RegenerateKeys|[Parameters](#ParametersRemoteRenderingAccountsRegenerateKeys)|[Example](#ExamplesRemoteRenderingAccountsRegenerateKeys)|

### <a name="CommandsInSpatialAnchorsAccounts">Commands in `az spatial-anchors-account` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az spatial-anchors-account regenerate-key](#SpatialAnchorsAccountsRegenerateKeys)|RegenerateKeys|[Parameters](#ParametersSpatialAnchorsAccountsRegenerateKeys)|[Example](#ExamplesSpatialAnchorsAccountsRegenerateKeys)|


## COMMAND DETAILS
### group `az remote-rendering-account`
#### <a name="RemoteRenderingAccountsListByResourceGroup">Command `az remote-rendering-account list`</a>

##### <a name="ExamplesRemoteRenderingAccountsListByResourceGroup">Example</a>
```
az remote-rendering-account list --resource-group "MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|

#### <a name="RemoteRenderingAccountsListBySubscription">Command `az remote-rendering-account list`</a>

##### <a name="ExamplesRemoteRenderingAccountsListBySubscription">Example</a>
```
az remote-rendering-account list
```
##### <a name="ParametersRemoteRenderingAccountsListBySubscription">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|

#### <a name="RemoteRenderingAccountsGet">Command `az remote-rendering-account show`</a>

##### <a name="ExamplesRemoteRenderingAccountsGet">Example</a>
```
az remote-rendering-account show --account-name "MyAccount" --resource-group "MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|

#### <a name="RemoteRenderingAccountsCreate">Command `az remote-rendering-account create`</a>

##### <a name="ExamplesRemoteRenderingAccountsCreate">Example</a>
```
az remote-rendering-account create --account-name "MyAccount" --location "eastus2euap" --resource-group \
"MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags.|tags|tags|

#### <a name="RemoteRenderingAccountsUpdate">Command `az remote-rendering-account update`</a>

##### <a name="ExamplesRemoteRenderingAccountsUpdate">Example</a>
```
az remote-rendering-account update --account-name "MyAccount" --location "eastus2euap" --tags hero="romeo" \
heroine="juliet" --resource-group "MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags.|tags|tags|

#### <a name="RemoteRenderingAccountsDelete">Command `az remote-rendering-account delete`</a>

##### <a name="ExamplesRemoteRenderingAccountsDelete">Example</a>
```
az remote-rendering-account delete --account-name "MyAccount" --resource-group "MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|

#### <a name="RemoteRenderingAccountsListKeys">Command `az remote-rendering-account list-key`</a>

##### <a name="ExamplesRemoteRenderingAccountsListKeys">Example</a>
```
az remote-rendering-account list-key --account-name "MyAccount" --resource-group "MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsListKeys">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|

#### <a name="RemoteRenderingAccountsRegenerateKeys">Command `az remote-rendering-account regenerate-key`</a>

##### <a name="ExamplesRemoteRenderingAccountsRegenerateKeys">Example</a>
```
az remote-rendering-account regenerate-key --account-name "MyAccount" --serial 1 --resource-group "MyResourceGroup"
```
##### <a name="ParametersRemoteRenderingAccountsRegenerateKeys">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|
|**--serial**|sealed-choice|serial of key to be regenerated|serial|serial|

### group `az spatial-anchors-account`
#### <a name="SpatialAnchorsAccountsRegenerateKeys">Command `az spatial-anchors-account regenerate-key`</a>

##### <a name="ExamplesSpatialAnchorsAccountsRegenerateKeys">Example</a>
```
az spatial-anchors-account regenerate-key --account-name "MyAccount" --serial 1 --resource-group "MyResourceGroup"
```
##### <a name="ParametersSpatialAnchorsAccountsRegenerateKeys">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|Name of an Azure resource group.|resource_group_name|resourceGroupName|
|**--account-name**|string|Name of an Mixed Reality Account.|account_name|accountName|
|**--serial**|sealed-choice|serial of key to be regenerated|serial|serial|
