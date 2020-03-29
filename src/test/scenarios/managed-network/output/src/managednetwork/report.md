# Azure CLI Module Creation Report

### managednetwork managed-network-group create

create a managednetwork managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--management_groups**|array|The collection of management groups covered by the Managed Network|management_groups|management_groups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|subscriptions|
|**--virtual_networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|virtual_networks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|subnets|
### managednetwork managed-network-group delete

delete a managednetwork managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
### managednetwork managed-network-group list

list a managednetwork managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|skiptoken|
### managednetwork managed-network-group show

show a managednetwork managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
### managednetwork managed-network-group update

create a managednetwork managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--management_groups**|array|The collection of management groups covered by the Managed Network|management_groups|management_groups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|subscriptions|
|**--virtual_networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|virtual_networks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|subnets|
### managednetwork managed-network-peering-policy delete

delete a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
### managednetwork managed-network-peering-policy hub-and-spoke-topology create

hub-and-spoke-topology create a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
|**--hub_and_spoke_topology_type**|choice|Gets or sets the connectivity type of a network structure policy|hubandspoketopology_type|type|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub_and_spoke_topology_hub**|object|Gets or sets the hub virtual network ID|hubandspoketopology_hub|hub|
|**--hub_and_spoke_topology_spokes**|array|Gets or sets the spokes group IDs|hubandspoketopology_spokes|spokes|
|**--hub_and_spoke_topology_mesh**|array|Gets or sets the mesh group IDs|hubandspoketopology_mesh|mesh|
### managednetwork managed-network-peering-policy hub-and-spoke-topology update

hub-and-spoke-topology create a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
|**--hub_and_spoke_topology_type**|choice|Gets or sets the connectivity type of a network structure policy|hubandspoketopology_type|type|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--hub_and_spoke_topology_hub**|object|Gets or sets the hub virtual network ID|hubandspoketopology_hub|hub|
|**--hub_and_spoke_topology_spokes**|array|Gets or sets the spokes group IDs|hubandspoketopology_spokes|spokes|
|**--hub_and_spoke_topology_mesh**|array|Gets or sets the mesh group IDs|hubandspoketopology_mesh|mesh|
### managednetwork managed-network-peering-policy list

list a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|skiptoken|
### managednetwork managed-network-peering-policy mesh-topology create

mesh-topology create a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
|**--mesh_topology_type**|choice|Gets or sets the connectivity type of a network structure policy|meshtopology_type|type|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--mesh_topology_hub**|object|Gets or sets the hub virtual network ID|meshtopology_hub|hub|
|**--mesh_topology_spokes**|array|Gets or sets the spokes group IDs|meshtopology_spokes|spokes|
|**--mesh_topology_mesh**|array|Gets or sets the mesh group IDs|meshtopology_mesh|mesh|
### managednetwork managed-network-peering-policy mesh-topology update

mesh-topology create a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
|**--mesh_topology_type**|choice|Gets or sets the connectivity type of a network structure policy|meshtopology_type|type|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--mesh_topology_hub**|object|Gets or sets the hub virtual network ID|meshtopology_hub|hub|
|**--mesh_topology_spokes**|array|Gets or sets the spokes group IDs|meshtopology_spokes|spokes|
|**--mesh_topology_mesh**|array|Gets or sets the mesh group IDs|meshtopology_mesh|mesh|
### managednetwork managed-network-peering-policy show

show a managednetwork managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
### managednetwork mn create

create a managednetwork mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags|tags|tags|
|**--properties**|object|The MNC properties|properties|properties|
### managednetwork mn delete

delete a managednetwork mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
### managednetwork mn list

list a managednetwork mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|skiptoken|
### managednetwork mn show

show a managednetwork mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
### managednetwork mn update

update a managednetwork mn.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--tags**|dictionary|Resource tags|tags|tags|
### managednetwork scope-assignment create

create a managednetwork scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to create.|scope_assignment_name|scope_assignment_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned_managed_network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|assigned_managed_network|
### managednetwork scope-assignment delete

delete a managednetwork scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The scope of the scope assignment to delete.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to delete.|scope_assignment_name|scope_assignment_name|
### managednetwork scope-assignment list

list a managednetwork scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
### managednetwork scope-assignment show

show a managednetwork scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to get.|scope_assignment_name|scope_assignment_name|
### managednetwork scope-assignment update

create a managednetwork scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment to create. The scope can be any REST resource instance. For example, use 'subscriptions/{subscription-id}' for a subscription, 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}' for a resource group, and 'subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}' for a resource.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to create.|scope_assignment_name|scope_assignment_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned_managed_network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|assigned_managed_network|