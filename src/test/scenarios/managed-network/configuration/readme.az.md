## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: managed-network
  namespace: azure.mgmt.managednetwork
  package-name: azure-mgmt-managednetwork
  randomize-names: true
  formalize-names: true
  resource-type: DATA_NETWORK
  gen-min-test: true
az-output-folder: $(azure-cli-extension-folder)/src/managed-network
python-sdk-output-folder: $(az-output-folder)/azext_managed_network/vendored_sdks/managednetwork

extension-mode: preview

directive:
    - where:
        parameter-name: managed-network-group-name
      set:
        parameter-name: group-name
    - where:
        group: managed-network managed-network-group
      set:
        group: managed-network mn group
    - where:
        group: managed-network scope-assignment
      set:
        group: managed-network mn scope-assignment

cli:
    cli-directive:
    # directive on operationGroup
      - where:
            group: 'ManagedNetworks'
        set:
            extensionMode: 'experimental'
      - where:
            parameter: location
        required: true
      - where:
            group: ManagedNetworks
        name: mn
      - where:
            group: 'ManagedNetworkPeeringPolicies'
            param: 'managedNetworkPeeringPolicyName'
        name: 'policy_name'
      - where:
            group: 'ManagedNetworkGroups'
            param: 'managementGroups'
        json: true
      - where:
            group: 'ManagedNetworks'
            param: 'managedNetwork'
        json: true
      - where:
            group: managedNetworkPeeringPolicies
            op: CreateOrUpdate
            param: properties
        poly-resource: true
      - where:
            group: managedNetworkPeeringPolicies
            op: Delete
        max-api: '2020-09-01'
        min-api: '2019-09-01'
        resource-type: DATA_COMPUTE
      - where:
            group: managedNetworkPeeringPolicies
        max-api: '2020-07-01-preview'
        min-api: '2019-07-01'
        resource-type: DATA_STORAGE_BLOB
      - where:
            group: managedNetworkPeeringPolicies
            op: Delete
            #param: managedNetworkName
        max-api: '2020-05-01'
        min-api: '2019-05-01'
        resource-type: DATA_NETWORK
      - where:
            param: subnets
        set:
            shorthandSyntax: true
        #cli-flatten-directive:
        #    - where:
        #        type: ResourceProviderOperation
        #        prop: display
        #      flatten: false

```
