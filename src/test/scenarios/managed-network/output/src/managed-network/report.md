# Azure CLI Module Creation Report

### managed-network managed-network-peering-policy delete

delete a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|Delete|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|Delete|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|Delete|policy_name|managedNetworkPeeringPolicyName|

### managed-network managed-network-peering-policy hub-and-spoke-topology create

hub-and-spoke-topology create a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate#HubAndSpokeTopology|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate#HubAndSpokeTopology|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|CreateOrUpdate#HubAndSpokeTopology|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate#HubAndSpokeTopology|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|CreateOrUpdate#HubAndSpokeTopology|hub_and_spoke_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|CreateOrUpdate#HubAndSpokeTopology|hub_and_spoke_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|CreateOrUpdate#HubAndSpokeTopology|hub_and_spoke_topology_mesh|mesh|

### managed-network managed-network-peering-policy hub-and-spoke-topology update

hub-and-spoke-topology create a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate#HubAndSpokeTopology|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate#HubAndSpokeTopology|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|CreateOrUpdate#HubAndSpokeTopology|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate#HubAndSpokeTopology|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|CreateOrUpdate#HubAndSpokeTopology|hub_and_spoke_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|CreateOrUpdate#HubAndSpokeTopology|hub_and_spoke_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|CreateOrUpdate#HubAndSpokeTopology|hub_and_spoke_topology_mesh|mesh|

### managed-network managed-network-peering-policy list

list a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|ListByManagedNetwork|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|ListByManagedNetwork|managed_network_name|managedNetworkName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|ListByManagedNetwork|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|ListByManagedNetwork|skiptoken|$skiptoken|

### managed-network managed-network-peering-policy mesh-topology create

mesh-topology create a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate#MeshTopology|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate#MeshTopology|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|CreateOrUpdate#MeshTopology|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate#MeshTopology|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|CreateOrUpdate#MeshTopology|mesh_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|CreateOrUpdate#MeshTopology|mesh_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|CreateOrUpdate#MeshTopology|mesh_topology_mesh|mesh|

### managed-network managed-network-peering-policy mesh-topology update

mesh-topology create a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate#MeshTopology|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate#MeshTopology|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|CreateOrUpdate#MeshTopology|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate#MeshTopology|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|CreateOrUpdate#MeshTopology|mesh_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|CreateOrUpdate#MeshTopology|mesh_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|CreateOrUpdate#MeshTopology|mesh_topology_mesh|mesh|

### managed-network managed-network-peering-policy show

show a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|Get|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|Get|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|Get|policy_name|managedNetworkPeeringPolicyName|

### managed-network mn create

create a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate|managed_network_name|managedNetworkName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate|location|location|
|**--tags**|dictionary|Resource tags|CreateOrUpdate|tags|tags|
|**--properties**|object|The MNC properties|CreateOrUpdate|properties|properties|

### managed-network mn delete

delete a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|Delete|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|Delete|managed_network_name|managedNetworkName|

### managed-network mn get-modify

get-modify a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|GetModify|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|GetModify|managed_network_name|managedNetworkName|

### managed-network mn group create

create a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|CreateOrUpdate|group_name|managedNetworkGroupName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate|location|location|
|**--management-groups**|array|The collection of management groups covered by the Managed Network|CreateOrUpdate|management_groups|managementGroups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|CreateOrUpdate|subscriptions|subscriptions|
|**--virtual-networks**|array|The collection of virtual nets covered by the Managed Network|CreateOrUpdate|virtual_networks|virtualNetworks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|CreateOrUpdate|subnets|subnets|

### managed-network mn group delete

delete a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|Delete|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|Delete|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|Delete|group_name|managedNetworkGroupName|

### managed-network mn group list

list a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|ListByManagedNetwork|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|ListByManagedNetwork|managed_network_name|managedNetworkName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|ListByManagedNetwork|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|ListByManagedNetwork|skiptoken|$skiptoken|

### managed-network mn group show

show a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|Get|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|Get|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|Get|group_name|managedNetworkGroupName|

### managed-network mn group update

create a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|CreateOrUpdate|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|CreateOrUpdate|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|CreateOrUpdate|group_name|managedNetworkGroupName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate|location|location|
|**--management-groups**|array|The collection of management groups covered by the Managed Network|CreateOrUpdate|management_groups|managementGroups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|CreateOrUpdate|subscriptions|subscriptions|
|**--virtual-networks**|array|The collection of virtual nets covered by the Managed Network|CreateOrUpdate|virtual_networks|virtualNetworks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|CreateOrUpdate|subnets|subnets|

### managed-network mn list

list a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|ListByResourceGroup|resource_group_name|resourceGroupName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|ListByResourceGroup|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|ListByResourceGroup|skiptoken|$skiptoken|

### managed-network mn scope-assignment create

create a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|CreateOrUpdate|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|CreateOrUpdate|scope_assignment_name|scopeAssignmentName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate|location|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|CreateOrUpdate|assigned_managed_network|assignedManagedNetwork|

### managed-network mn scope-assignment delete

delete a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--scope**|string|The scope of the scope assignment to delete.|Delete|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to delete.|Delete|scope_assignment_name|scopeAssignmentName|

### managed-network mn scope-assignment list

list a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--scope**|string|The base resource of the scope assignment.|List|scope|scope|

### managed-network mn scope-assignment show

show a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--scope**|string|The base resource of the scope assignment.|Get|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to get.|Get|scope_assignment_name|scopeAssignmentName|

### managed-network mn scope-assignment update

create a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|CreateOrUpdate|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|CreateOrUpdate|scope_assignment_name|scopeAssignmentName|
|**--location**|string|The geo-location where the resource lives|CreateOrUpdate|location|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|CreateOrUpdate|assigned_managed_network|assignedManagedNetwork|

### managed-network mn update

update a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|Update|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|Update|managed_network_name|managedNetworkName|
|**--tags**|dictionary|Resource tags|Update|tags|tags|
