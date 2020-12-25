## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: datafactory
  package-name: azure-mgmt-datafactory
  namespace: azure.mgmt.datafactory
  formalize-names: true
  disable-checks: true
  resource-type: MGMT_DATAFACTORY
  default-resource-type: MGMT_DATAFACTORY
az-output-folder: $(azure-cli-extension-folder)/src/datafactory-preview
python-sdk-output-folder: "$(az-output-folder)/azext_datafactory_preview/vendored_sdks/azure_mgmt_datafactory"
az-custom-resource-type: 
   - CUSTOM_MGMT_PREVIEW_DATAFACTORY: 2018-01-01
   - CUSTOM_MGMT_DATAFACTORY: 2019-01-02-preview

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
            group: Factories
            parameter: factoryName
        alias:
            - name
            - n
      - where:
            group: IntegrationRuntimes
            op: CreateOrUpdate
            param: properties
        poly-resource: true
      - where:
            group: Triggers
            op: CreateOrUpdate#Update
            param: properties
        cli-flatten: true
      - where:
            param: factoryName
        set:
            default-config-key: factory
      - where:
            param: fakeIdentity
        set:
            positional: true
      - where:
            type: FactoryVstsConfiguration
        set:
            positional: true
            positionalKeys:
              - type
              - project_name
              - tenant_id
              - account_name
              - repository_name
              - root_folder
              - collaboration_branch
```
