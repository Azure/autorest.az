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


cli:
    cli-directive:
    # directive on operationGroup
      - where:
            parameter: factoryName
        alias:
            - name
            - n

```
