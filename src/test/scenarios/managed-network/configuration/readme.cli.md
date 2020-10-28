## CLI

These settings don't need to apply `--cli` on the command line.

``` yaml $(cli)
cli:
  cli-name: managednetwork
  test-scenario:
    ManagedNetworks_scenario1:
      - name: ManagedNetworksPut
      - name: ManagementNetworkGroupsPut
      - name: ManagedNetworkPeeringPoliciesPut
      - name: ManagedNetworksGet
    ManagedNetworks_scenario2:
      - name: ManagedNetworksListByResourceGroup
      - name: ManagedNetworksListBySubscription
      - name: ManagedNetworksDelete
      - name: ManagementNetworkGroupsGet
    ManagedNetworks_scenario3:
      - name: ManagedNetworksGroupsListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesGet
      - name: ManagedNetworkPeeringPoliciesListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesDelete
      - name: ManagementNetworkGroupsDelete
    ScopeAssignments:
      - name: ScopeAssignmentsPut
      - name: ScopeAssignmentsGet
      - name: ScopeAssignmentsList
      - name: ScopeAssignmentsDelete
```
