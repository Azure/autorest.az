# Compute

> see https://aka.ms/autorest

This is the AutoRest configuration file for Compute.


The compute RP comprises of small services where each service has its own tag.
Hence, each sub-service has its own swagger spec.

All of them are tied together using this configuration and are packaged together into one compute client library.
This makes it easier for customers to download one (NuGet/npm/pip/maven/gem) compute client library package rather than installing individual packages for each sub service.


---
## Getting Started
To build the SDK for Compute, simply [Install AutoRest](https://aka.ms/autorest/install) and in this folder, run:

> `autorest`

To see additional help and options, run:

> `autorest --help`
---

## Configuration



### Basic Information
These are the global settings for the Compute API.

``` yaml
title: ComputeManagementClient
description: Compute Client
openapi-type: arm
tag: package-2020-06-30

directive:
  - where:
      - $.definitions.VirtualMachine.properties
    suppress:
      - BodyTopLevelProperties
  - where:
      - $.definitions.VirtualMachineScaleSetVM.properties
    suppress:
      - BodyTopLevelProperties
  - where:
      - $.definitions.ImageReference.properties
    suppress:
      - BodyTopLevelProperties
  - where:
      - $.definitions.ManagedDiskParameters.properties
    suppress:
      - BodyTopLevelProperties
  - where:
      - $.definitions.Disk.properties
    suppress:
      - BodyTopLevelProperties
  - where:
      - $.definitions.Snapshot.properties
    suppress:
      - BodyTopLevelProperties
  - where:
      - $.definitions.VirtualMachineScaleSetExtension
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineImageResource
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineImage
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.ImageReference
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.ManagedDiskParameters
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.NetworkInterfaceReference
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineScaleSetIPConfiguration
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineScaleSetUpdateIPConfiguration
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineScaleSetNetworkConfiguration
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineScaleSetUpdateNetworkConfiguration
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineScaleSetUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.AvailabilitySetUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.ProximityPlacementGroupUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineExtensionUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.ImageUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.DedicatedHostGroupUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.DedicatedHostUpdate
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.DiskEncryptionSetParameters
    suppress:
      - RequiredPropertiesMissingInResourceModel
  - where:
      - $.definitions.VirtualMachineScaleSetVM
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.VirtualMachineExtensionImage
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.RollingUpgradeStatusInfo
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.VirtualMachineImageResource
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.VirtualMachineImage
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.Gallery
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.GalleryImage
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.GalleryImageVersion
    suppress:
      - TrackedResourcePatchOperation
  - where:
      - $.definitions.VirtualMachineImageResource
    suppress:
      - TrackedResourceGetOperation
  - where:
      - $.definitions.AdditionalCapabilities.properties.ultraSSDEnabled
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.DiskProperties.properties.diskIOPSReadWrite
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.DiskUpdateProperties.properties.diskIOPSReadWrite
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.DiskProperties.properties.diskIOPSReadOnly
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.DiskUpdateProperties.properties.diskIOPSReadOnly
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.DataDisk.properties.diskIOPSReadWrite
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.VirtualMachineScaleSetDataDisk.properties.diskIOPSReadWrite
    suppress:
      - DefinitionsPropertiesNamesCamelCase
  - where:
      - $.definitions.ContainerService
    suppress:
      - TrackedResourcePatchOperation
    reason:
      - ACS service is deprecated so a PATCH endpoint won't be implemented

```
### Tag: package-2020-06-30

These settings apply only when `--tag=package-2020-06-30` is specified on the command line.

``` yaml $(tag) == 'package-2020-06-30'
input-file:
- ../input/Microsoft.Compute/stable/2020-06-01/compute.json
- ../input/Microsoft.Compute/stable/2020-06-01/runCommands.json
- ../input/Microsoft.Compute/stable/2019-04-01/skus.json
- ../input/Microsoft.Compute/stable/2020-06-30/disk.json
- ../input/Microsoft.Compute/stable/2019-12-01/gallery.json
- ../input/Microsoft.ContainerService/stable/2017-01-31/containerService.json
```

---
# Code Generation


## Swagger to SDK

This section describes what SDK should be generated by the automatic system.
This is not used by Autorest itself.