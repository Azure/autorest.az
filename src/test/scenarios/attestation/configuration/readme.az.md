## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: attestation
  package-name: azure-mgmt-attestation
  namespace: azure.mgmt.attestation
  test-setup:
    - name: Operations_List
    - name: AttestationProviders_Create
    - name: AttestationProviders_Get
    - name: AttestationProviders_List
    - name: AttestationProviders_ListByResourceGroup
    - name: AttestationProviders_Delete
python-sdk-output-folder: "$(output-folder)/src/attestation/azext_attestation/vendored_sdks/attestation"


cli:
    cli-directive:
    # directive on operationGroup
      - select: 'operation'
        where:
            operationGroup: 'operations'
            operation: 'list'
        hidden: true
      - where:
            parameter: location
        required: true
    flatten:
        cli-flatten-set-enabled: true
        cli-flatten-all: true
        #cli-flatten-directive:
        #    - where:
        #        type: ResourceProviderOperation
        #        prop: display
        #      flatten: false

```
