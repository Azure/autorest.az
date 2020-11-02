## CLI

These settings don't need to apply `--cli` on the command line.

``` yaml $(cli)
cli:
  cli-name: managednetwork
  test-scenario:
    - ManagedNetworks:
      - name: ManagedNetworksPut
      - name: ManagementNetworkGroupsPut
      - name: ManagedNetworkPeeringPoliciesPut
      - name: ManagedNetworksGet
      - name: ManagedNetworksListByResourceGroup
      - name: ManagedNetworksListBySubscription
      - name: ManagedNetworksDelete
      - name: ManagementNetworkGroupsGet
      - name: ManagedNetworksGroupsListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesGet
      - name: ManagedNetworkPeeringPoliciesListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesDelete
      - name: ManagementNetworkGroupsDelete
    - ScopeAssignments:
      - name: ScopeAssignmentsPut
      - name: ScopeAssignmentsGet
      - name: ScopeAssignmentsList
      - name: ScopeAssignmentsDelete
```
