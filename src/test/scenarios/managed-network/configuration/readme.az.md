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
flatten-all: true

directive:
  - from: swagger-document
    where: $..parameters[?(@.in=='body')]
    transform: >
      $['x-ms-client-flatten'] = true;
    reason: Flatten everything for Azure CLI

clicommon:
    cli-directive:
    # directive on operationGroup
      - select: 'operationGroup'
        where:
            operationGroup: 'operations'
        hidden: true
      - where:
            operationGroup: 'managed_networks'
            operation: 'list_by_resource_group'
        removed: true

```
