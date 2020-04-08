# Azure CLI Module Creation Report

### managed-network managed-network-group create

create a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--group-name**|string|The name of the Managed Network Group.|group_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--management-groups**|array|The collection of management groups covered by the Managed Network|management_groups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|
|**--virtual-networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|
### managed-network managed-network-group delete

delete a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--group-name**|string|The name of the Managed Network Group.|group_name|
### managed-network managed-network-group list

list a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|
### managed-network managed-network-group show

show a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--group-name**|string|The name of the Managed Network Group.|group_name|
### managed-network managed-network-group update

create a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--group-name**|string|The name of the Managed Network Group.|group_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--management-groups**|array|The collection of management groups covered by the Managed Network|management_groups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|
|**--virtual-networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|
### managed-network managed-network-peering-policy delete

delete a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|
### managed-network managed-network-peering-policy hub-and-spoke-topology create

hub-and-spoke-topology create a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--hub**|object|Gets or sets the hub virtual network ID|hub_and_spoke_topology_hub|
|**--spokes**|array|Gets or sets the spokes group IDs|hub_and_spoke_topology_spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|hub_and_spoke_topology_mesh|
### managed-network managed-network-peering-policy hub-and-spoke-topology update

hub-and-spoke-topology create a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--hub**|object|Gets or sets the hub virtual network ID|hub_and_spoke_topology_hub|
|**--spokes**|array|Gets or sets the spokes group IDs|hub_and_spoke_topology_spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|hub_and_spoke_topology_mesh|
### managed-network managed-network-peering-policy list

list a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|
### managed-network managed-network-peering-policy mesh-topology create

mesh-topology create a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--hub**|object|Gets or sets the hub virtual network ID|mesh_topology_hub|
|**--spokes**|array|Gets or sets the spokes group IDs|mesh_topology_spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|mesh_topology_mesh|
### managed-network managed-network-peering-policy mesh-topology update

mesh-topology create a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--hub**|object|Gets or sets the hub virtual network ID|mesh_topology_hub|
|**--spokes**|array|Gets or sets the spokes group IDs|mesh_topology_spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|mesh_topology_mesh|
### managed-network managed-network-peering-policy show

show a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|
### managed-network mn create

create a managed-network mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--tags**|dictionary|Resource tags|tags|
|**--properties**|object|The MNC properties|properties|
### managed-network mn delete

delete a managed-network mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
### managed-network mn list

list a managed-network mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|
### managed-network mn show

show a managed-network mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
### managed-network mn update

update a managed-network mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|
|**--tags**|dictionary|Resource tags|tags|
### managed-network scope-assignment create

create a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|scope_assignment_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|
### managed-network scope-assignment delete

delete a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The scope of the scope assignment to delete.|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to delete.|scope_assignment_name|
### managed-network scope-assignment list

list a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|
### managed-network scope-assignment show

show a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to get.|scope_assignment_name|
### managed-network scope-assignment update

create a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|scope_assignment_name|
|**--location**|string|The geo-location where the resource lives|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|