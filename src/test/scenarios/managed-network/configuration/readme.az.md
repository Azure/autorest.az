## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: managed-network
  namespace: azure.mgmt.managednetwork
  package-name: azure-mgmt-managednetwork
python-sdk-output-folder: "$(output-folder)/src/managed-network/azext_managed_network/vendored_sdks/managed-network"


directive:
  - where:
      parameter-name: managed-network-group-name
    set:
      parameter-name: group-name
#  - from: swagger-document
#    where: $..parameters[?(@.in=='body')]
#    transform: >
#      $['x-ms-client-flatten'] = true;
#    reason: Flatten everything for Azure CLI
#  - from: swagger-document
#    where: $.definitions[*].properties.*
#    transform: >
#      $['x-ms-client-flatten'] = true;
#    reason: Flatten everything for Azure CLI
#  - from: swagger-document
#    where: $.definitions[?(@.discriminator)]
#    transform: >
#      $['x-ms-client-flatten'] = false;
#  - from: swagger-document
#    where: $.definitions[?(@.discriminator)].properties.*
#    transform: >
#      $['x-ms-client-flatten'] = false;
#  - from: swagger-document
#    where: $.definitions.ManagedNetworkPeeringPolicy.properties.*
#    transform: >
#      $['x-ms-client-flatten'] = false;
#    reason: manually don't flatten the polymorphic base class
#  - from: swagger-document
#    where: $.definitions[*].properties.[?(@.type=='array')]
#    transform: >
#      $['x-ms-client-flatten'] = false;

cli:
    cli-directive:
    # directive on operationGroup
      - where:
            parameter: location
        required: true
      - where:
            group: 'ManagedNetworkPeeringPolicies'
            param: 'managedNetworkPeeringPolicyName'
        name: 'policy_name'
      - where:
            group: 'ManagedNetworkGroups'
            param: 'managementGroups'
        json: true
      - where:
            type: 'ManagedNetwork'
            prop: 'properties'
        json: true
        #cli-flatten-directive:
        #    - where:
        #        type: ResourceProviderOperation
        #        prop: display
        #      flatten: false

```
