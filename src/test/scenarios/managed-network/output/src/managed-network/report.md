# Azure CLI Module Creation Report

### managed-network managed_network_groups create

create a managed-network managed_network_groups.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--managed_network_group**|object|Parameters supplied to the create/update a Managed Network Group resource|/something/my_option|/something/myOption|
### managed-network managed_network_groups delete

delete a managed-network managed_network_groups.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network managed_network_groups list

list a managed-network managed_network_groups.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|--$top**|integer|May be used to limit the number of results in a page for list queries.|/something/my_option|/something/myOption|
|--$skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|/something/my_option|/something/myOption|
### managed-network managed_network_groups show

show a managed-network managed_network_groups.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network managed_network_groups update

create a managed-network managed_network_groups.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--managed_network_group**|object|Parameters supplied to the create/update a Managed Network Group resource|/something/my_option|/something/myOption|
### managed-network managed_network_peering_policies create

create a managed-network managed_network_peering_policies.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--managed_network_policy**|object|Parameters supplied to create/update a Managed Network Peering Policy|/something/my_option|/something/myOption|
|**--type**|choice|Gets or sets the connectivity type of a network structure policy|/something/my_option|/something/myOption|
|--location**|string|The geo-location where the resource lives|/something/my_option|/something/myOption|
|--id**|string|Resource Id|/something/my_option|/something/myOption|
|--spokes**|array|Gets or sets the spokes group IDs|/something/my_option|/something/myOption|
|--mesh**|array|Gets or sets the mesh group IDs|/something/my_option|/something/myOption|
### managed-network managed_network_peering_policies delete

delete a managed-network managed_network_peering_policies.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network managed_network_peering_policies list

list a managed-network managed_network_peering_policies.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|--$top**|integer|May be used to limit the number of results in a page for list queries.|/something/my_option|/something/myOption|
|--$skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|/something/my_option|/something/myOption|
### managed-network managed_network_peering_policies show

show a managed-network managed_network_peering_policies.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network managed_network_peering_policies update

create a managed-network managed_network_peering_policies.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--managed_network_policy**|object|Parameters supplied to create/update a Managed Network Peering Policy|/something/my_option|/something/myOption|
|**--type**|choice|Gets or sets the connectivity type of a network structure policy|/something/my_option|/something/myOption|
|--location**|string|The geo-location where the resource lives|/something/my_option|/something/myOption|
|--id**|string|Resource Id|/something/my_option|/something/myOption|
|--spokes**|array|Gets or sets the spokes group IDs|/something/my_option|/something/myOption|
|--mesh**|array|Gets or sets the mesh group IDs|/something/my_option|/something/myOption|
### managed-network managed_networks create

create a managed-network managed_networks.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--managed_network**|object|Parameters supplied to the create/update a Managed Network Resource|/something/my_option|/something/myOption|
|--location**|string|The geo-location where the resource lives|/something/my_option|/something/myOption|
|--tags**|dictionary|Resource tags|/something/my_option|/something/myOption|
|--management_groups**|array|The collection of management groups covered by the Managed Network|/something/my_option|/something/myOption|
|--subscriptions**|array|The collection of subscriptions covered by the Managed Network|/something/my_option|/something/myOption|
|--virtual_networks**|array|The collection of virtual nets covered by the Managed Network|/something/my_option|/something/myOption|
|--subnets**|array|The collection of  subnets covered by the Managed Network|/something/my_option|/something/myOption|
### managed-network managed_networks delete

delete a managed-network managed_networks.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network managed_networks list

list a managed-network managed_networks.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|--$top**|integer|May be used to limit the number of results in a page for list queries.|/something/my_option|/something/myOption|
|--$skiptoken**|string|Skiptoken is only used if a previous operation returned a partial result. If a previous response contains a nextLink element, the value of the nextLink element will include a skiptoken parameter that specifies a starting point to use for subsequent calls.|/something/my_option|/something/myOption|
### managed-network managed_networks show

show a managed-network managed_networks.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network managed_networks update

update a managed-network managed_networks.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--parameters**|object|Parameters supplied to update application gateway tags and/or scope.|/something/my_option|/something/myOption|
|--tags**|dictionary|Resource tags|/something/my_option|/something/myOption|
### managed-network operations list

list a managed-network operations.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network scope_assignments create

create a managed-network scope_assignments.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--parameters**|object|Parameters supplied to the specify which Managed Network this scope is being assigned|/something/my_option|/something/myOption|
|--location**|string|The geo-location where the resource lives|/something/my_option|/something/myOption|
|--assigned_managed_network**|string|The managed network ID with scope will be assigned to.|/something/my_option|/something/myOption|
### managed-network scope_assignments delete

delete a managed-network scope_assignments.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network scope_assignments list

list a managed-network scope_assignments.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network scope_assignments show

show a managed-network scope_assignments.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
### managed-network scope_assignments update

create a managed-network scope_assignments.

|Option|Type|Description|Path (SDK)|Path (swagger)|
|------|----|-----------|----------|--------------|
|**--parameters**|object|Parameters supplied to the specify which Managed Network this scope is being assigned|/something/my_option|/something/myOption|
|--location**|string|The geo-location where the resource lives|/something/my_option|/something/myOption|
|--assigned_managed_network**|string|The managed network ID with scope will be assigned to.|/something/my_option|/something/myOption|