# Azure CLI Module Creation Report

### managed-network managed-network create

create a managed-network managed-network.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags|tags|tags|
|**--properties**|object|Properties of Managed Network|properties|properties|
### managed-network managed-network delete

delete a managed-network managed-network.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
### managed-network managed-network list

list a managed-network managed-network.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|skiptoken|
### managed-network managed-network show

show a managed-network managed-network.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
### managed-network managed-network update

update a managed-network managed-network.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--tags**|dictionary|Resource tags|tags|tags|
### managed-network managed-network-group create

create a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--management_groups**|array|The collection of management groups covered by the Managed Network|management_groups|properties_management_groups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|properties_subscriptions|
|**--virtual_networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|properties_virtual_networks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|properties_subnets|
### managed-network managed-network-group delete

delete a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
### managed-network managed-network-group list

list a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|skiptoken|
### managed-network managed-network-group show

show a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
### managed-network managed-network-group update

create a managed-network managed-network-group.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--group_name**|string|The name of the Managed Network Group.|managed_network_group_name|group_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--management_groups**|array|The collection of management groups covered by the Managed Network|management_groups|properties_management_groups|
|**--subscriptions**|array|The collection of subscriptions covered by the Managed Network|subscriptions|properties_subscriptions|
|**--virtual_networks**|array|The collection of virtual nets covered by the Managed Network|virtual_networks|properties_virtual_networks|
|**--subnets**|array|The collection of  subnets covered by the Managed Network|subnets|properties_subnets|
### managed-network managed-network-peering-policy create

create a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--properties**|object|Properties of a Managed Network Peering Policy|properties|properties|
### managed-network managed-network-peering-policy delete

delete a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
### managed-network managed-network-peering-policy list

list a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--top**|integer|May be used to limit the number of results in a page for list queries.|top|top|
|**--skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|skiptoken|skiptoken|
### managed-network managed-network-peering-policy show

show a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
### managed-network managed-network-peering-policy update

create a managed-network managed-network-peering-policy.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--resource_group_name**|string|The name of the resource group.|resource_group_name|resource_group_name|
|**--managed_network_name**|string|The name of the Managed Network.|managed_network_name|managed_network_name|
|**--policy_name**|string|The name of the Managed Network Peering Policy.|managed_network_peering_policy_name|policy_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--properties**|object|Properties of a Managed Network Peering Policy|properties|properties|
### managed-network scope-assignment create

create a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to get.|scope_assignment_name|scope_assignment_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned_managed_network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|properties_assigned_managed_network|
### managed-network scope-assignment delete

delete a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to get.|scope_assignment_name|scope_assignment_name|
### managed-network scope-assignment list

list a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
### managed-network scope-assignment show

show a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to get.|scope_assignment_name|scope_assignment_name|
### managed-network scope-assignment update

create a managed-network scope-assignment.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--scope**|string|The base resource of the scope assignment.|scope|scope|
|**--scope_assignment_name**|string|The name of the scope assignment to get.|scope_assignment_name|scope_assignment_name|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--assigned_managed_network**|string|The managed network ID with scope will be assigned to.|assigned_managed_network|properties_assigned_managed_network|
