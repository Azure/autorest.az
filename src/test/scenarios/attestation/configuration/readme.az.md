## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: attestation
  package-name: azure-mgmt-attestation
  namespace: azure.mgmt.attestation
python-sdk-output-folder: "$(output-folder)/src/attestation/azext_attestation/vendored_sdks/attestation"
```
