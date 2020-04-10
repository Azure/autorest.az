## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
extensions: datafactory
az:
  package-name: azure-mgmt-datafactory
  namespace: azure.mgmt.datafactory
python-sdk-output-folder: "$(az-output-folder)/azext_datafactory/vendored_sdks/datafactory"

directive:
    - where:
        group: datafactory factory
      set:
        group: datafactory

```
