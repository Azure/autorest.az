## AZ

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: vm
  namespace: azure.mgmt.compute
  package-name: azure-mgmt-compute
az-output-folder: $(azure-cli-folder)/src/azure-cli/azure/cli/command_modules/vm
python-sdk-output-folder: "$(az-output-folder)/az_vm/vendored_sdks/vm"

extension-mode: stable

cli:
    cli-directive:
        - where:
              group: "*"
              op: "*"
          hidden: true
        - where:
              group: VirtualMachines
              op: AssessPatches
          hidden: false
          min-api: '2020-06-01'
        - where:
              group: VirtualMachines
          set:
              extensionMode: experimental
        - where:
            group: 'VirtualMachineScaleSetVMExtensions'
            op: List|Get|CreateOrUpdate
          hidden: false
```
