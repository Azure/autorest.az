# Azure CLI managed-network Extension #
This is the extension for managed-network

### How to use ###
Install this extension using the below CLI command
```
az extension add --name managed-network
```

### Included Features ###
#### managed-network mn ####
##### Create #####
```
az managed-network mn create --location "eastus" \
    --properties "{\\"managementGroups\\":[{\\"id\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0001-0000-0000-000000000000\\"},{\\"id\\":\\"/providers/Microsoft.Management/managementGroups/20000000-0002-0000-0000-000000000000\\"}],\\"subscriptions\\":[{\\"id\\":\\"subscriptionA\\"},{\\"id\\":\\"subscriptionB\\"}],\\"virtualNetworks\\":[{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork\\"},{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork2\\"}],\\"subnets\\":[{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork3/subnets/default\\"},{\\"id\\":\\"/subscriptions/subscriptionC/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork3/subnets/default\\"}]}" \
    --name "myManagedNetwork" --resource-group "myResourceGroup" 
```
##### List #####
```
az managed-network mn list --resource-group "myResourceGroup"
```
##### Update #####
```
az managed-network mn update --name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### Show-modify #####
```
az managed-network mn show-modify --name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### Delete #####
```
az managed-network mn delete --name "myManagedNetwork" --resource-group "myResourceGroup"
```
#### managed-network mn scope-assignment ####
##### Create #####
```
az managed-network mn scope-assignment create \
    --assigned-managed-network "/subscriptions/subscriptionA/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/managedNetworks/myManagedNetwork" \
    --scope "subscriptions/subscriptionC" --name "myScopeAssignment" 
```
##### Show #####
```
az managed-network mn scope-assignment show --scope "subscriptions/subscriptionC" --name "myScopeAssignment"
```
##### List #####
```
az managed-network mn scope-assignment list --scope "subscriptions/subscriptionC"
```
##### Delete #####
```
az managed-network mn scope-assignment delete --scope "subscriptions/subscriptionC" --name "myScopeAssignment"
```
#### managed-network mn group ####
##### Create #####
```
az managed-network mn group create --management-groups "[]" \
    --subnets id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork/subnets/default" id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork2/subnets/default" \
    --virtual-networks id="/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetA" \
    --virtual-networks id="/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/VnetB" \
    --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" --resource-group "myResourceGroup" 

az managed-network mn group wait --created --group-name "{myManagedNetworkGroup}" --resource-group "{rg}"
```
##### Show #####
```
az managed-network mn group show --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" \
    --resource-group "myResourceGroup" 
```
##### List #####
```
az managed-network mn group list --managed-network-name "myManagedNetwork" --resource-group "myResourceGroup"
```
##### Delete #####
```
az managed-network mn group delete --group-name "myManagedNetworkGroup" --managed-network-name "myManagedNetwork" \
    --resource-group "myResourceGroup" 
```
#### managed-network managed-network-peering-policy ####
##### Hub-and-spoke-topology create #####
```
az managed-network managed-network-peering-policy hub-and-spoke-topology create \
    --managed-network-name "myManagedNetwork" --policy-name "myManagedNetworkPeeringPolicy" \
    --hub id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork4" \
    --spokes id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/managedNetworks/myManagedNetwork/managedNetworkGroups/myManagedNetworkGroup" \
    --resource-group "myResourceGroup" 
```
##### Hub-and-spoke-topology update #####
```
az managed-network managed-network-peering-policy hub-and-spoke-topology update \
    --managed-network-name "myManagedNetwork" --policy-name "myManagedNetworkPeeringPolicy" \
    --hub id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork4" \
    --spokes id="/subscriptions/subscriptionB/resourceGroups/myResourceGroup/providers/Microsoft.ManagedNetwork/managedNetworks/myManagedNetwork/managedNetworkGroups/myManagedNetworkGroup" \
    --resource-group "myResourceGroup" 
```
##### List #####
```
az managed-network managed-network-peering-policy list --managed-network-name "myManagedNetwork" \
    --resource-group "myResourceGroup" 
```
##### Show #####
```
az managed-network managed-network-peering-policy show --managed-network-name "myManagedNetwork" \
    --policy-name "myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup" 
```
##### Delete #####
```
az managed-network managed-network-peering-policy delete --managed-network-name "myManagedNetwork" \
    --policy-name "myManagedNetworkPeeringPolicy" --resource-group "myResourceGroup" 
```