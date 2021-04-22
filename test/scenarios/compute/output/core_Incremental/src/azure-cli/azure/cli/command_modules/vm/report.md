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
|az vm virtual-machine-scale-set-vm-extension|VirtualMachineScaleSetVMExtensions|[commands](#CommandsInVirtualMachineScaleSetVMExtensions)|

## COMMANDS
### <a name="CommandsInVirtualMachines">Commands in `az vm virtual-machine` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az vm virtual-machine assess-patch](#VirtualMachinesAssessPatches)|AssessPatches|[Parameters](#ParametersVirtualMachinesAssessPatches)|[Example](#ExamplesVirtualMachinesAssessPatches)|

### <a name="CommandsInVirtualMachineScaleSetVMExtensions">Commands in `az vm virtual-machine-scale-set-vm-extension` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az vm virtual-machine-scale-set-vm-extension list](#VirtualMachineScaleSetVMExtensionsList)|List|[Parameters](#ParametersVirtualMachineScaleSetVMExtensionsList)|[Example](#ExamplesVirtualMachineScaleSetVMExtensionsList)|
|[az vm virtual-machine-scale-set-vm-extension show](#VirtualMachineScaleSetVMExtensionsGet)|Get|[Parameters](#ParametersVirtualMachineScaleSetVMExtensionsGet)|[Example](#ExamplesVirtualMachineScaleSetVMExtensionsGet)|
|[az vm virtual-machine-scale-set-vm-extension create](#VirtualMachineScaleSetVMExtensionsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersVirtualMachineScaleSetVMExtensionsCreateOrUpdate#Create)|[Example](#ExamplesVirtualMachineScaleSetVMExtensionsCreateOrUpdate#Create)|


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

### group `az vm virtual-machine-scale-set-vm-extension`
#### <a name="VirtualMachineScaleSetVMExtensionsList">Command `az vm virtual-machine-scale-set-vm-extension list`</a>

##### <a name="ExamplesVirtualMachineScaleSetVMExtensionsList">Example</a>
```
az vm virtual-machine-scale-set-vm-extension list --instance-id "0" --resource-group "myResourceGroup" \
--vm-scale-set-name "myvmScaleSet"
```
##### <a name="ParametersVirtualMachineScaleSetVMExtensionsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--vm-scale-set-name**|string|The name of the VM scale set.|vm_scale_set_name|vmScaleSetName|
|**--instance-id**|string|The instance ID of the virtual machine.|instance_id|instanceId|
|**--expand**|string|The expand expression to apply on the operation.|expand|$expand|

#### <a name="VirtualMachineScaleSetVMExtensionsGet">Command `az vm virtual-machine-scale-set-vm-extension show`</a>

##### <a name="ExamplesVirtualMachineScaleSetVMExtensionsGet">Example</a>
```
az vm virtual-machine-scale-set-vm-extension show --instance-id "0" --resource-group "myResourceGroup" \
--vm-extension-name "myVMExtension" --vm-scale-set-name "myvmScaleSet"
```
##### <a name="ParametersVirtualMachineScaleSetVMExtensionsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--vm-scale-set-name**|string|The name of the VM scale set.|vm_scale_set_name|vmScaleSetName|
|**--instance-id**|string|The instance ID of the virtual machine.|instance_id|instanceId|
|**--vm-extension-name**|string|The name of the virtual machine extension.|vm_extension_name|vmExtensionName|
|**--expand**|string|The expand expression to apply on the operation.|expand|$expand|

#### <a name="VirtualMachineScaleSetVMExtensionsCreateOrUpdate#Create">Command `az vm virtual-machine-scale-set-vm-extension create`</a>

##### <a name="ExamplesVirtualMachineScaleSetVMExtensionsCreateOrUpdate#Create">Example</a>
```
az vm virtual-machine-scale-set-vm-extension create --location "westus" --type-properties-type "extType" \
--auto-upgrade-minor-version true --publisher "extPublisher" --settings "{\\"UserName\\":\\"xyz@microsoft.com\\"}" \
--type-handler-version "1.2" --instance-id "0" --resource-group "myResourceGroup" --vm-extension-name "myVMExtension" \
--vm-scale-set-name "myvmScaleSet"
```
##### <a name="ParametersVirtualMachineScaleSetVMExtensionsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group.|resource_group_name|resourceGroupName|
|**--vm-scale-set-name**|string|The name of the VM scale set.|vm_scale_set_name|vmScaleSetName|
|**--instance-id**|string|The instance ID of the virtual machine.|instance_id|instanceId|
|**--vm-extension-name**|string|The name of the virtual machine extension.|vm_extension_name|vmExtensionName|
|**--location**|string|Resource location|location|location|
|**--tags**|dictionary|Resource tags|tags|tags|
|**--force-update-tag**|string|How the extension handler should be forced to update even if the extension configuration has not changed.|force_update_tag|forceUpdateTag|
|**--publisher**|string|The name of the extension handler publisher.|publisher|publisher|
|**--type-properties-type**|string|Specifies the type of the extension; an example is "CustomScriptExtension".|type_properties_type|type|
|**--type-handler-version**|string|Specifies the version of the script handler.|type_handler_version|typeHandlerVersion|
|**--auto-upgrade-minor-version**|boolean|Indicates whether the extension should use a newer minor version if one is available at deployment time. Once deployed, however, the extension will not upgrade minor versions unless redeployed, even with this property set to true.|auto_upgrade_minor_version|autoUpgradeMinorVersion|
|**--enable-automatic-upgrade**|boolean|Indicates whether the extension should be automatically upgraded by the platform if there is a newer version of the extension available.|enable_automatic_upgrade|enableAutomaticUpgrade|
|**--settings**|any|Json formatted public settings for the extension.|settings|settings|
|**--protected-settings**|any|The extension can contain either protectedSettings or protectedSettingsFromKeyVault or no protected settings at all.|protected_settings|protectedSettings|
|**--name**|string|The virtual machine extension name.|name|name|
|**--type**|string|Specifies the type of the extension; an example is "CustomScriptExtension".|type|type|
|**--virtual-machine-extension-instance-view-type-handler-version-type-handler-version**|string|Specifies the version of the script handler.|virtual_machine_extension_instance_view_type_handler_version_type_handler_version|typeHandlerVersion|
|**--substatuses**|array|The resource status information.|substatuses|substatuses|
|**--statuses**|array|The resource status information.|statuses|statuses|
