## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: attestation
  package-name: azure-mgmt-attestation
  namespace: azure.mgmt.attestation
az-output-folder: $(azure-cli-extension-folder)/src/attestation
python-sdk-output-folder: "$(az-output-folder)/azext_attestation/vendored_sdks/attestation"

directive:
    - where:
        command: attestation attestation-provider list
      set:
        command: attestation attestation-provider provider list
    - where:
        command: attestation operation list
      set:
        command: attestation list-operation
    - where:
        command: attestation attestation-provider create
      set:
        command: attestation create-provider
```
