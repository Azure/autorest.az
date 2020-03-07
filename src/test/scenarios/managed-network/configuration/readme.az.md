## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: managed-network
  namespace: azure.mgmt.managednetwork
  package-name: azure-mgmt-managednetwork
  test-setup:
    - name: ManagedNetworksPut
    - name: ManagementNetworkGroupsPut
    - name: ScopeAssignmentsPut
    - name: ManagedNetworkPeeringPoliciesPut
    - name: ManagedNetworksGet
    - name: ManagedNetworksListByResourceGroup
    - name: ManagedNetworksListBySubscription
    - name: ScopeAssignmentsGet
    - name: ScopeAssignmentsList
    - name: ManagementNetworkGroupsGet
    - name: ManagedNetworksGroupsListByManagedNetwork
    - name: ManagedNetworkPeeringPoliciesGet
    - name: ManagedNetworkPeeringPoliciesListByManagedNetwork
    - name: ManagedNetworkPeeringPoliciesDelete
    - name: ScopeAssignmentsDelete
    - name: ManagementNetworkGroupsDelete
    - name: ManagedNetworksDelete
python-sdk-output-folder: "$(output-folder)/src/managed-network/azext_managed_network/vendored_sdks/managed-network"

directive:
  - from: swagger-document
    where: $..parameters[?(@.in=='body')]
    transform: >
      $['x-ms-client-flatten'] = true;
    reason: Flatten everything for Azure CLI
  - from: swagger-document
    where: $.definitions[*].properties.*
    transform: >
      $['x-ms-client-flatten'] = true;
    reason: Flatten everything for Azure CLI
  - from: swagger-document
    where: $.definitions[?(@.discriminator)]
    transform: >
      $['x-ms-client-flatten'] = false;
  - from: swagger-document
    where: $.definitions[?(@.discriminator)].properties.*
    transform: >
      $['x-ms-client-flatten'] = false;
  - from: swagger-document
    where: $.definitions.ManagedNetworkPeeringPolicy.properties.*
    transform: >
      $['x-ms-client-flatten'] = false;
    reason: manually don't flatten the polymorphic base class

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

```
