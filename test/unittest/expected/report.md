# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az offazure|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az offazure` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az offazure hyperv cluster|HyperVCluster|[commands](#CommandsInHyperVCluster)|
|az offazure hyperv host|HyperVHost|[commands](#CommandsInHyperVHost)|

## COMMANDS
### <a name="CommandsInHyperVCluster">Commands in `az offazure hyperv cluster` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az offazure hyperv cluster cluster list](#HyperVClusterGetAllClustersInSite)|GetAllClustersInSite|[Parameters](#ParametersHyperVClusterGetAllClustersInSite)|[Example](#ExamplesHyperVClusterGetAllClustersInSite)|
|[az offazure hyperv cluster cluster show](#HyperVClusterGetCluster)|GetCluster|[Parameters](#ParametersHyperVClusterGetCluster)|[Example](#ExamplesHyperVClusterGetCluster)|

### <a name="CommandsInHyperVHost">Commands in `az offazure hyperv host` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az offazure hyperv host put-host](#HyperVHostPutHost)|PutHost|[Parameters](#ParametersHyperVHostPutHost)|[Example](#ExamplesHyperVHostPutHost)|
|[az offazure hyperv host show-all-host-in-site](#HyperVHostGetAllHostsInSite)|GetAllHostsInSite|[Parameters](#ParametersHyperVHostGetAllHostsInSite)|[Example](#ExamplesHyperVHostGetAllHostsInSite)|
|[az offazure hyperv host show-host](#HyperVHostGetHost)|GetHost|[Parameters](#ParametersHyperVHostGetHost)|[Example](#ExamplesHyperVHostGetHost)|


## COMMAND DETAILS
### group `az offazure hyperv cluster`
#### <a name="HyperVClusterGetAllClustersInSite">Command `az offazure hyperv cluster cluster list`</a>

##### <a name="ExamplesHyperVClusterGetAllClustersInSite">Example</a>
```
az offazure hyperv cluster cluster list --resource-group "ipsahoo-RI-121119" --site-name "hyperv121319c813site" 
--subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"
```
##### <a name="ParametersHyperVClusterGetAllClustersInSite">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--subscription-id**|string|The ID of the target subscription.||subscriptionId|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.||resourceGroupName|
|**--site-name**|string|Site name.||siteName|
|**--filter**|string|||$filter|

#### <a name="HyperVClusterGetCluster">Command `az offazure hyperv cluster cluster show`</a>

##### <a name="ExamplesHyperVClusterGetCluster">Example</a>
```
az offazure hyperv cluster show --name "hypgqlclusrs1-ntdev-corp-micros-11e77b27-67cc-5e46-a5d8-0ff3dc2ef179" 
--resource-group "ipsahoo-RI-121119" --site-name "hyperv121319c813site" --subscription-id 
"4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"
```
##### <a name="ParametersHyperVClusterGetCluster">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--subscription-id**|string|The ID of the target subscription.||subscriptionId|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.||resourceGroupName|
|**--site-name**|string|Site name.||siteName|
|**--name**|string|Cluster ARM name.||clusterName|

### group `az offazure hyperv host`
#### <a name="HyperVHostPutHost">Command `az offazure hyperv host put-host`</a>

##### <a name="ExamplesHyperVHostPutHost">Example</a>
```
az offazure hyperv host put-host --fqdn "10.10.10.20" --run-as-account-id "Account1" --host-name "Host1" 
--resource-group "pajindTest" --site-name "appliance1e39site" --subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"
```
##### <a name="ParametersHyperVHostPutHost">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--subscription-id**|string|The ID of the target subscription.||subscriptionId|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.||resourceGroupName|
|**--site-name**|string|Site name.||siteName|
|**--host-name**|string|Host ARM name.||hostName|
|**--name**|string|Name of the host.||name|
|**--fqdn**|string|FQDN/IPAddress of the Hyper-V host.||fqdn|
|**--run-as-account-id**|string|Run as account ID of the Hyper-V host.||runAsAccountId|

#### <a name="HyperVHostGetAllHostsInSite">Command `az offazure hyperv host show-all-host-in-site`</a>

##### <a name="ExamplesHyperVHostGetAllHostsInSite">Example</a>
```
az offazure hyperv host show-all-host-in-site --resource-group "pajindTest" --site-name "appliance1e39site" 
--subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"
```
##### <a name="ParametersHyperVHostGetAllHostsInSite">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--subscription-id**|string|The ID of the target subscription.||subscriptionId|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.||resourceGroupName|
|**--site-name**|string|Site name.||siteName|
|**--filter**|string|||$filter|

#### <a name="HyperVHostGetHost">Command `az offazure hyperv host show-host`</a>

##### <a name="ExamplesHyperVHostGetHost">Example</a>
```
az offazure hyperv host show-host --host-name "bcdr-ewlab-46-ntdev-corp-micros-e4638031-3b19-5642-926d-385da60cfb8a" 
--resource-group "pajindTest" --site-name "appliance1e39site" --subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"
```
##### <a name="ParametersHyperVHostGetHost">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--subscription-id**|string|The ID of the target subscription.||subscriptionId|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.||resourceGroupName|
|**--site-name**|string|Site name.||siteName|
|**--host-name**|string|Host ARM name.||hostName|
