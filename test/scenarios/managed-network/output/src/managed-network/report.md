# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az managed-network|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az managed-network` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az managed-network mn|ManagedNetworks|[commands](#CommandsInManagedNetworks)|
|az managed-network mn scope-assignment|ScopeAssignments|[commands](#CommandsInScopeAssignments)|
|az managed-network mn group|ManagedNetworkGroups|[commands](#CommandsInManagedNetworkGroups)|
|az managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|[commands](#CommandsInManagedNetworkPeeringPolicies)|

## COMMANDS
### <a name="CommandsInManagedNetworkPeeringPolicies">Commands in `az managed-network managed-network-peering-policy` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az managed-network managed-network-peering-policy list](#ManagedNetworkPeeringPoliciesListByManagedNetwork)|ListByManagedNetwork|[Parameters](#ParametersManagedNetworkPeeringPoliciesListByManagedNetwork)|[Example](#ExamplesManagedNetworkPeeringPoliciesListByManagedNetwork)|
|[az managed-network managed-network-peering-policy show](#ManagedNetworkPeeringPoliciesGet)|Get|[Parameters](#ParametersManagedNetworkPeeringPoliciesGet)|[Example](#ExamplesManagedNetworkPeeringPoliciesGet)|
|[az managed-network managed-network-peering-policy hub-and-spoke-topology create](#ManagedNetworkPeeringPoliciesCreateOrUpdate#Create#HubAndSpokeTopology)|CreateOrUpdate#Create#HubAndSpokeTopology|[Parameters](#ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Create#HubAndSpokeTopology)|[Example](#ExamplesManagedNetworkPeeringPoliciesCreateOrUpdate#Create#HubAndSpokeTopology)|
|[az managed-network managed-network-peering-policy mesh-topology create](#ManagedNetworkPeeringPoliciesCreateOrUpdate#Create#MeshTopology)|CreateOrUpdate#Create#MeshTopology|[Parameters](#ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Create#MeshTopology)|Not Found|
|[az managed-network managed-network-peering-policy hub-and-spoke-topology update](#ManagedNetworkPeeringPoliciesCreateOrUpdate#Update#HubAndSpokeTopology)|CreateOrUpdate#Update#HubAndSpokeTopology|[Parameters](#ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Update#HubAndSpokeTopology)|[Example](#ExamplesManagedNetworkPeeringPoliciesCreateOrUpdate#Update#HubAndSpokeTopology)|
|[az managed-network managed-network-peering-policy mesh-topology update](#ManagedNetworkPeeringPoliciesCreateOrUpdate#Update#MeshTopology)|CreateOrUpdate#Update#MeshTopology|[Parameters](#ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Update#MeshTopology)|Not Found|
|[az managed-network managed-network-peering-policy delete](#ManagedNetworkPeeringPoliciesDelete)|Delete|[Parameters](#ParametersManagedNetworkPeeringPoliciesDelete)|[Example](#ExamplesManagedNetworkPeeringPoliciesDelete)|

### <a name="CommandsInManagedNetworks">Commands in `az managed-network mn` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az managed-network mn list](#ManagedNetworksListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersManagedNetworksListByResourceGroup)|[Example](#ExamplesManagedNetworksListByResourceGroup)|
|[az managed-network mn list](#ManagedNetworksListBySubscription)|ListBySubscription|[Parameters](#ParametersManagedNetworksListBySubscription)|[Example](#ExamplesManagedNetworksListBySubscription)|
|[az managed-network mn create](#ManagedNetworksCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersManagedNetworksCreateOrUpdate#Create)|[Example](#ExamplesManagedNetworksCreateOrUpdate#Create)|
|[az managed-network mn update](#ManagedNetworksUpdate)|Update|[Parameters](#ParametersManagedNetworksUpdate)|[Example](#ExamplesManagedNetworksUpdate)|
|[az managed-network mn delete](#ManagedNetworksDelete)|Delete|[Parameters](#ParametersManagedNetworksDelete)|[Example](#ExamplesManagedNetworksDelete)|
|[az managed-network mn show-modify](#ManagedNetworksGetModify)|GetModify|[Parameters](#ParametersManagedNetworksGetModify)|[Example](#ExamplesManagedNetworksGetModify)|

### <a name="CommandsInManagedNetworkGroups">Commands in `az managed-network mn group` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az managed-network mn group list](#ManagedNetworkGroupsListByManagedNetwork)|ListByManagedNetwork|[Parameters](#ParametersManagedNetworkGroupsListByManagedNetwork)|[Example](#ExamplesManagedNetworkGroupsListByManagedNetwork)|
|[az managed-network mn group show](#ManagedNetworkGroupsGet)|Get|[Parameters](#ParametersManagedNetworkGroupsGet)|[Example](#ExamplesManagedNetworkGroupsGet)|
|[az managed-network mn group create](#ManagedNetworkGroupsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersManagedNetworkGroupsCreateOrUpdate#Create)|[Example](#ExamplesManagedNetworkGroupsCreateOrUpdate#Create)|
|[az managed-network mn group update](#ManagedNetworkGroupsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersManagedNetworkGroupsCreateOrUpdate#Update)|Not Found|
|[az managed-network mn group delete](#ManagedNetworkGroupsDelete)|Delete|[Parameters](#ParametersManagedNetworkGroupsDelete)|[Example](#ExamplesManagedNetworkGroupsDelete)|

### <a name="CommandsInScopeAssignments">Commands in `az managed-network mn scope-assignment` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az managed-network mn scope-assignment list](#ScopeAssignmentsList)|List|[Parameters](#ParametersScopeAssignmentsList)|[Example](#ExamplesScopeAssignmentsList)|
|[az managed-network mn scope-assignment show](#ScopeAssignmentsGet)|Get|[Parameters](#ParametersScopeAssignmentsGet)|[Example](#ExamplesScopeAssignmentsGet)|
|[az managed-network mn scope-assignment create](#ScopeAssignmentsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersScopeAssignmentsCreateOrUpdate#Create)|[Example](#ExamplesScopeAssignmentsCreateOrUpdate#Create)|
|[az managed-network mn scope-assignment update](#ScopeAssignmentsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersScopeAssignmentsCreateOrUpdate#Update)|Not Found|
|[az managed-network mn scope-assignment delete](#ScopeAssignmentsDelete)|Delete|[Parameters](#ParametersScopeAssignmentsDelete)|[Example](#ExamplesScopeAssignmentsDelete)|


## COMMAND DETAILS

### group `az managed-network managed-network-peering-policy`
#### <a name="ManagedNetworkPeeringPoliciesListByManagedNetwork">Command `az managed-network managed-network-peering-policy list`</a>

##### <a name="ExamplesManagedNetworkPeeringPoliciesListByManagedNetwork">Example</a>
```
az managed-network managed-network-peering-policy list --managed-network-name "myManagedNetwork" --resource-group \
"myResourceGroup"
```
##### <a name="ParametersManagedNetworkPeeringPoliciesListByManagedNetwork">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|$skiptoken|

#### <a name="ManagedNetworkPeeringPoliciesGet">Command `az managed-network managed-network-peering-policy show`</a>

##### <a name="ExamplesManagedNetworkPeeringPoliciesGet">Example</a>
```
az managed-network managed-network-peering-policy show --managed-network-name "myManagedNetwork" --policy-name \
"myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkPeeringPoliciesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|

#### <a name="ManagedNetworkPeeringPoliciesCreateOrUpdate#Create#HubAndSpokeTopology">Command `az managed-network managed-network-peering-policy hub-and-spoke-topology create`</a>

##### <a name="ExamplesManagedNetworkPeeringPoliciesCreateOrUpdate#Create#HubAndSpokeTopology">Example</a>
```
az managed-network managed-network-peering-policy hub-and-spoke-topology create --managed-network-name \
"myManagedNetwork" --policy-name "myManagedNetworkPeeringPolicy" --managed-network-policy "lslsd" --hub \
id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNe\
twork4" --spokes id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/man\
agedNetworks/myManagedNetwork/managedNetworkGroups/myManagedNetworkGroup" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Create#HubAndSpokeTopology">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|hub_and_spoke_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|hub_and_spoke_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|hub_and_spoke_topology_mesh|mesh|
|**--managed-network-policy**|string|inside managedNetworkPolicy|managed_network_policy|managedNetworkPolicy|

#### <a name="ManagedNetworkPeeringPoliciesCreateOrUpdate#Create#MeshTopology">Command `az managed-network managed-network-peering-policy mesh-topology create`</a>

##### <a name="ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Create#MeshTopology">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|mesh_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|mesh_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|mesh_topology_mesh|mesh|
|**--managed-network-policy**|string|inside managedNetworkPolicy|managed_network_policy|managedNetworkPolicy|

#### <a name="ManagedNetworkPeeringPoliciesCreateOrUpdate#Update#HubAndSpokeTopology">Command `az managed-network managed-network-peering-policy hub-and-spoke-topology update`</a>

##### <a name="ExamplesManagedNetworkPeeringPoliciesCreateOrUpdate#Update#HubAndSpokeTopology">Example</a>
```
az managed-network managed-network-peering-policy hub-and-spoke-topology update --managed-network-name \
"myManagedNetwork" --policy-name "myManagedNetworkPeeringPolicy" --managed-network-policy "lslsd" --hub \
id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNe\
twork4" --spokes id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/man\
agedNetworks/myManagedNetwork/managedNetworkGroups/myManagedNetworkGroup" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Update#HubAndSpokeTopology">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|hub_and_spoke_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|hub_and_spoke_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|hub_and_spoke_topology_mesh|mesh|
|**--managed-network-policy**|string|inside managedNetworkPolicy|managed_network_policy|managedNetworkPolicy|

#### <a name="ManagedNetworkPeeringPoliciesCreateOrUpdate#Update#MeshTopology">Command `az managed-network managed-network-peering-policy mesh-topology update`</a>

##### <a name="ParametersManagedNetworkPeeringPoliciesCreateOrUpdate#Update#MeshTopology">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|mesh_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|mesh_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|mesh_topology_mesh|mesh|
|**--managed-network-policy**|string|inside managedNetworkPolicy|managed_network_policy|managedNetworkPolicy|

#### <a name="ManagedNetworkPeeringPoliciesDelete">Command `az managed-network managed-network-peering-policy delete`</a>

##### <a name="ExamplesManagedNetworkPeeringPoliciesDelete">Example</a>
```
az managed-network managed-network-peering-policy delete --managed-network-name "myManagedNetwork" --policy-name \
"myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkPeeringPoliciesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|

### group `az managed-network mn`
#### <a name="ManagedNetworksListByResourceGroup">Command `az managed-network mn list`</a>

##### <a name="ExamplesManagedNetworksListByResourceGroup">Example</a>
```
az managed-network mn list --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworksListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|$skiptoken|

#### <a name="ManagedNetworksListBySubscription">Command `az managed-network mn list`</a>

##### <a name="ExamplesManagedNetworksListBySubscription">Example</a>
```
az managed-network mn list
```
##### <a name="ParametersManagedNetworksListBySubscription">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="ManagedNetworksCreateOrUpdate#Create">Command `az managed-network mn create`</a>

##### <a name="ExamplesManagedNetworksCreateOrUpdate#Create">Example</a>
```
az managed-network mn create --managed-network "{\\"location\\":\\"eastus\\",\\"tags\\":{},\\"managementGroups\\":[{\\"\
id\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0001-0000-0000-000000000000\\"},{\\"id\\":\\"/provid\
ers/Microsoft.Management/managementGroups/20000000-0002-0000-0000-000000000000\\"}],\\"subscriptions\\":[{\\"id\\":\\"s\
ubscriptionA\\"},{\\"id\\":\\"subscriptionB\\"}],\\"virtualNetworks\\":[{\\"id\\":\\"/subscriptions/subscriptionC/resou\
rceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork\\"},{\\"id\\":\\"/subscriptions/\
subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork2\\"}],\\"subn\
ets\\":[{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNet\
works/myVirtualNetwork3/subnets/mySubnet\\"},{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/p\
roviders/Microsoft.Network/virtualNetworks/myVirtualNetwork3/subnets/mySubnet2\\"}]}" --name "myManagedNetwork" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworksCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--managed-network**|object|Parameters supplied to the create/update a Managed Network Resource|managed_network|managedNetwork|

#### <a name="ManagedNetworksUpdate">Command `az managed-network mn update`</a>

##### <a name="ExamplesManagedNetworksUpdate">Example</a>
```
az managed-network mn update --name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworksUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--tags**|dictionary|Resource tags|tags|tags|

#### <a name="ManagedNetworksDelete">Command `az managed-network mn delete`</a>

##### <a name="ExamplesManagedNetworksDelete">Example</a>
```
az managed-network mn delete --name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworksDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|

#### <a name="ManagedNetworksGetModify">Command `az managed-network mn show-modify`</a>

##### <a name="ExamplesManagedNetworksGetModify">Example</a>
```
az managed-network mn show-modify --name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworksGetModify">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|

### group `az managed-network mn group`
#### <a name="ManagedNetworkGroupsListByManagedNetwork">Command `az managed-network mn group list`</a>

##### <a name="ExamplesManagedNetworkGroupsListByManagedNetwork">Example</a>
```
az managed-network mn group list --managed-network-name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkGroupsListByManagedNetwork">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|$skiptoken|

#### <a name="ManagedNetworkGroupsGet">Command `az managed-network mn group show`</a>

##### <a name="ExamplesManagedNetworkGroupsGet">Example</a>
```
az managed-network mn group show --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkGroupsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|group_name|managedNetworkGroupName|

#### <a name="ManagedNetworkGroupsCreateOrUpdate#Create">Command `az managed-network mn group create`</a>

##### <a name="ExamplesManagedNetworkGroupsCreateOrUpdate#Create">Example</a>
```
az managed-network mn group create --management-groups "[]" --subnets id="/subscriptions/subscriptionB/resourceGroups/m\
yResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork/subnets/mySubnet" \
id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNe\
twork2/subnets/mySubnet2" --virtual-networks id="/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Netw\
ork/virtualNetworks/VnetA" --virtual-networks id="/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Net\
work/virtualNetworks/VnetB" --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkGroupsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|group_name|managedNetworkGroupName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--management-groups**|array|The collection of management groups covered by the Managed Network|management_groups|managementGroups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|subscriptions|
|**--virtual-networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|virtualNetworks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|subnets|

#### <a name="ManagedNetworkGroupsCreateOrUpdate#Update">Command `az managed-network mn group update`</a>

##### <a name="ParametersManagedNetworkGroupsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|group_name|managedNetworkGroupName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--management-groups**|array|The collection of management groups covered by the Managed Network|management_groups|managementGroups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|subscriptions|
|**--virtual-networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|virtualNetworks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|subnets|

#### <a name="ManagedNetworkGroupsDelete">Command `az managed-network mn group delete`</a>

##### <a name="ExamplesManagedNetworkGroupsDelete">Example</a>
```
az managed-network mn group delete --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" \
--resource-group "myResourceGroup"
```
##### <a name="ParametersManagedNetworkGroupsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|group_name|managedNetworkGroupName|

### group `az managed-network mn scope-assignment`
#### <a name="ScopeAssignmentsList">Command `az managed-network mn scope-assignment list`</a>

##### <a name="ExamplesScopeAssignmentsList">Example</a>
```
az managed-network mn scope-assignment list --scope "subscriptions/subscriptionC"
```
##### <a name="ParametersScopeAssignmentsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|

#### <a name="ScopeAssignmentsGet">Command `az managed-network mn scope-assignment show`</a>

##### <a name="ExamplesScopeAssignmentsGet">Example</a>
```
az managed-network mn scope-assignment show --scope "subscriptions/subscriptionC" --name "myScopeAssignment"
```
##### <a name="ParametersScopeAssignmentsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to get.|scope_assignment_name|scopeAssignmentName|

#### <a name="ScopeAssignmentsCreateOrUpdate#Create">Command `az managed-network mn scope-assignment create`</a>

##### <a name="ExamplesScopeAssignmentsCreateOrUpdate#Create">Example</a>
```
az managed-network mn scope-assignment create --assigned-managed-network "/subscriptions/subscriptionA/resourceGroups/m\
yResourceGroup/providers/Microsoft.ManagedNetwork/managedNetworks/myManagedNetwork" --scope \
"subscriptions/subscriptionC" --name "myScopeAssignment"
```
##### <a name="ParametersScopeAssignmentsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|scope_assignment_name|scopeAssignmentName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|assignedManagedNetwork|

#### <a name="ScopeAssignmentsCreateOrUpdate#Update">Command `az managed-network mn scope-assignment update`</a>

##### <a name="ParametersScopeAssignmentsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|scope_assignment_name|scopeAssignmentName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|assignedManagedNetwork|

#### <a name="ScopeAssignmentsDelete">Command `az managed-network mn scope-assignment delete`</a>

##### <a name="ExamplesScopeAssignmentsDelete">Example</a>
```
az managed-network mn scope-assignment delete --scope "subscriptions/subscriptionC" --name "myScopeAssignment"
```
##### <a name="ParametersScopeAssignmentsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The scope of the scope assignment to delete.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to delete.|scope_assignment_name|scopeAssignmentName|
