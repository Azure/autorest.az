# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az vm|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az vm` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az vm virtual-machine|VirtualMachines|[commands](#CommandsInVirtualMachines)|

## COMMANDS
### <a name="CommandsInVirtualMachines">Commands in `az vm virtual-machine` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az vm virtual-machine assess-patch](#VirtualMachinesAssessPatches)|AssessPatches|[Parameters](#ParametersVirtualMachinesAssessPatches)|[Example](#ExamplesVirtualMachinesAssessPatches)|


## COMMAND DETAILS

### group `az vm virtual-machine`
#### <a name="VirtualMachinesAssessPatches">Command `az vm virtual-machine assess-patch`</a>

##### <a name="ExamplesVirtualMachinesAssessPatches">Example</a>
```
az vm virtual-machine assess-patch --resource-group "myResourceGroupName" --vm-name "myVMName"
```
##### <a name="ParametersVirtualMachinesAssessPatches">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--vm-name**|string|The name of the virtual machine.|vm_name|vmName|
