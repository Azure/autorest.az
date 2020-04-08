## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: datafactory
  package-name: azure-mgmt-datafactory
  namespace: azure.mgmt.datafactory
python-sdk-output-folder: "$(output-folder)/azext_datafactory/vendored_sdks/datafactory"
```
