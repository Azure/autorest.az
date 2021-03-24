# configuration for az common
 
``` yaml $(az)

# customize library used in extension. azure.cli.core by default
# cli-core-lib: azure.cli.core
cli:
    naming:
        default:
            singularize:
              - operationGroup
              - operation
    split-operation:
        cli-split-operation-enabled: true
        cli-split-operation-extend-poly-resource: true
    cli-directive:
        - where:
            operation: CheckNameAvailability
          hidden: true
        - where:
            operationGroup: Operations
            operation: List
          hidden: true
        - where:
            op: CreateOrUpdate
          split-operation-names:
            - Create
            - Update
    flatten:
        cli-flatten-set-enabled: true
        cli-flatten-payload: true
        cli-flatten-schema: false
        cli-flatten-all-overwrite-swagger: false

az:
  preparers:
    virtualNetworks:
      abbr:  vn
      alias:
        - virtualnetwork
      create:
        - az network vnet create --resource-group {resourceGroups} --name {name}
      delete:
        - az network vnet delete --resource-group {resourceGroups} --name {name}

    subnets:
      alias:
        - subnet
      create: |-
        az network vnet subnet create -n {name} --vnet-name {virtualNetworks} -g {resourceGroups} --address-prefixes "10.0.0.0/21"
      delete:  |-
        az network vnet subnet delete --name {name} --resource-group {resourceGroups} --vnet-name {virtualNetworks}

    serviceEndpointPolicies:
      abbr: sep
      alias:
        - serviceendpointpolicy
      create: |-
        az network service-endpoint policy create --name {name} --resource-group {resourceGroups}
      delete:  |-
        az network service-endpoint policy delete --name {name} -g {resourceGroups}

    networkInterfaces:
      abbr: nic
      alias:
        - virtualinterface
      create:
        - az network nic create --resource-group {resourceGroups} --name {name} --vnet-name {virtualNetworks} --subnet {subnets}
      delete:
        - az network nic delete --resource-group {resourceGroups} --name {name}
```
 
``` yaml $(python) && ($(generate-sdk) == 'yes' || ($(target-mode) != 'core' && !$(generate-sdk)))
add-credential: true
no-namespace-folders: true
license-header: MICROSOFT_MIT_NO_VERSION
#clear-output-folder: true
scope-codegen/emitter:
    output-folder: "$(python-sdk-output-folder)"
```


``` yaml $(python) && ($(generate-sdk) == 'no' || ($(target-mode) == 'core' && !$(generate-sdk)))
add-credential: true
no-namespace-folders: true
license-header: MICROSOFT_MIT_NO_VERSION
#clear-output-folder: true
scope-codegen/emitter: false
```

``` yaml $(az) && (($(target-mode) == 'core' && $(compatible-level) != "track2") || ((!$(sdk-flatten) || ($(sdk-flatten) && $(sdk-no-flatten))) && $(compatible-level) == 'track1'))
cli:
    flatten:
        cli-m4flatten-payload-max-prop: 2
        cli-m4flatten-payload-track1-enabled: true
```