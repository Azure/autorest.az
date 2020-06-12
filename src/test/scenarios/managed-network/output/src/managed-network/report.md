# Azure CLI Module Creation Report

### managed-network managed-network-peering-policy delete

delete a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|delete|Delete|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|

### managed-network managed-network-peering-policy hub-and-spoke-topology create

hub-and-spoke-topology create a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|hub-and-spoke-topology create|CreateOrUpdate#HubAndSpokeTopology|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|hub_and_spoke_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|hub_and_spoke_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|hub_and_spoke_topology_mesh|mesh|

### managed-network managed-network-peering-policy hub-and-spoke-topology update

hub-and-spoke-topology update a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|hub-and-spoke-topology create|CreateOrUpdate#HubAndSpokeTopology|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|hub_and_spoke_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|hub_and_spoke_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|hub_and_spoke_topology_mesh|mesh|

### managed-network managed-network-peering-policy list

list a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|list|ListByManagedNetwork|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|$skiptoken|

### managed-network managed-network-peering-policy mesh-topology create

mesh-topology create a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|mesh-topology create|CreateOrUpdate#MeshTopology|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|mesh_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|mesh_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|mesh_topology_mesh|mesh|

### managed-network managed-network-peering-policy mesh-topology update

mesh-topology update a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|mesh-topology create|CreateOrUpdate#MeshTopology|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub**|object|Gets or sets the hub virtual network ID|mesh_topology_hub|hub|
|**--spokes**|array|Gets or sets the spokes group IDs|mesh_topology_spokes|spokes|
|**--mesh**|array|Gets or sets the mesh group IDs|mesh_topology_mesh|mesh|

### managed-network managed-network-peering-policy show

show a managed-network managed-network-peering-policy.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network managed-network-peering-policy|ManagedNetworkPeeringPolicies|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|show|Get|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--policy-name**|string|The name of the Managed Network Peering Policy.|policy_name|managedNetworkPeeringPolicyName|

### managed-network mn create

create a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|create|CreateOrUpdate|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags|tags|tags|
|**--properties**|object|The MNC properties|properties|properties|

### managed-network mn delete

delete a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|delete|Delete|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|

### managed-network mn get-modify

get-modify a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|get-modify|GetModify|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|

### managed-network mn group create

create a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|create|CreateOrUpdate|

#### Parameters
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

### managed-network mn group delete

delete a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|delete|Delete|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|group_name|managedNetworkGroupName|

### managed-network mn group list

list a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|list|ListByManagedNetwork|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|$skiptoken|

### managed-network mn group show

show a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|show|Get|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--group-name**|string|The name of the Managed Network Group.|group_name|managedNetworkGroupName|

### managed-network mn group update

update a managed-network mn group.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn group|ManagedNetworkGroups|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|create|CreateOrUpdate|

#### Parameters
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

### managed-network mn list

list a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|list|ListByResourceGroup|
|list|ListBySubscription|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|$top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|$skiptoken|

### managed-network mn scope-assignment create

create a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|create|CreateOrUpdate|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|scope_assignment_name|scopeAssignmentName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|assignedManagedNetwork|

### managed-network mn scope-assignment delete

delete a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|delete|Delete|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The scope of the scope assignment to delete.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to delete.|scope_assignment_name|scopeAssignmentName|

### managed-network mn scope-assignment list

list a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|list|List|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|

### managed-network mn scope-assignment show

show a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|show|Get|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to get.|scope_assignment_name|scopeAssignmentName|

### managed-network mn scope-assignment update

update a managed-network mn scope-assignment.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn scope-assignment|ScopeAssignments|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|create|CreateOrUpdate|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|scope|
|**--scope-assignment-name**|string|The name of the scope assignment to create.|scope_assignment_name|scopeAssignmentName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned-managed-network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|assignedManagedNetwork|

### managed-network mn update

update a managed-network mn.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|managed-network mn|ManagedNetworks|

#### Methods
|Name (az)|Swagger name|
|---------|------------|
|update|Update|

#### Parameters
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--managed-network-name**|string|The name of the Managed Network.|managed_network_name|managedNetworkName|
|**--tags**|dictionary|Resource tags|tags|tags|
