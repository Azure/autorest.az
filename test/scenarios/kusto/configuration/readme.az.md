## AZ

These settings apply only when `--az` is specified on the command line.

``` yaml $(az) && $(target-mode) != 'core'
az:
  extensions: kusto
  namespace: azure.mgmt.kusto
  package-name: azure-mgmt-kusto
az-output-folder: $(azure-cli-extension-folder)/src/kusto
python-sdk-output-folder: "$(az-output-folder)/azext_kusto/vendored_sdks/kusto"
extension-mode: stable

cli:
    cli-directive:
      - where:
            group: 'DataConnections'
            op: 'CreateOrUpdate|Update'
            param: 'parameters'
        poly-resource: true
      - where:
            group: 'DataConnections'
            op: 'dataConnectionValidation'
            param: 'properties'
        poly-resource: true
      - where:
            group: 'Clusters'
        set:
            extensionMode: 'experimental'
      - where:
            group: 'Clusters'
            op: 'AddLanguageExtensions'
        set:
            extensionMode: 'preview'
      - where:
            group: 'Clusters'
            op: 'AddLanguageExtensions'
            param: 'clusterName'
        set:
            extensionMode: 'experimental'

```

``` yaml $(az) && $(target-mode) == 'core'
az:
  extensions: kusto
  namespace: azure.mgmt.kusto
  package-name: azure-mgmt-kusto
az-output-folder: $(azure-cli-folder)/src/azure-cli/azure/cli/command_modules/kusto
python-sdk-output-folder: "$(az-output-folder)/vendored_sdks/kusto"
```