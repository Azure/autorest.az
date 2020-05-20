## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: datafactory
  package-name: azure-mgmt-datafactory
  namespace: azure.mgmt.datafactory
az-output-folder: $(azure-cli-extension-folder)/src/datafactory
python-sdk-output-folder: "$(az-output-folder)/azext_datafactory/vendored_sdks/datafactory"

directive:
    - where:
          group: datafactory factory
      set:
          group: datafactory
    - where:
          command: datafactory integration-runtime create-linked-integration-runtime
      set:
          command: datafactory integration-runtime linked-integration-runtime create

cli:
    cli-directive:
    # directive on operationGroup
      - where:
            group: datafactory
            parameter: factoryName
        alias:
            - name
            - n
      - where:
            group: IntegrationRuntimes
            op: CreateOrUpdate
            param: properties
        poly-resource: true
```
