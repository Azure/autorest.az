## CLI

These settings apply only when `--cli` is specified on the command line.

``` yaml $(cli)
cli:
  test-scenario:
    - name: KustoClustersCreateOrUpdate
    - name: AttachedDatabaseConfigurationsCreateOrUpdate
    - name: KustoAttachedDatabaseConfigurationsListByCluster
    - name: AttachedDatabaseConfigurationsGet
    - name: KustoClustersGet
    - name: KustoClustersList
    - name: KustoClustersListByResourceGroup
    - name: KustoClustersListResourceSkus
    - name: KustoClustersListSkus
    - name: KustoClusterAddLanguageExtensions
    - name: KustoClusterDetachFollowerDatabases
    - name: KustoClusterDiagnoseVirtualNetwork
    - name: KustoClusterListFollowerDatabases
    - name: KustoClusterListLanguageExtensions
    - name: KustoClusterRemoveLanguageExtensions
    - name: KustoClustersStart
    - name: KustoClustersStop
    - name: KustoClustersUpdate
    - name: KustoClusterPrincipalAssignmentsCreateOrUpdate
    - name: KustoClusterPrincipalAssignmentsGet
    - name: KustoPrincipalAssignmentsList
    - name: KustoDataConnectionsCreateOrUpdate
    - name: KustoDataConnectionsGet
    - name: KustoDatabasesListByCluster
    - name: KustoDataConnectionValidation
    - name: KustoDataConnectionsUpdate
    - name: KustoDatabasePrincipalAssignmentsCreateOrUpdate
    - name: KustoDatabasePrincipalAssignmentsGet
    - name: KustoPrincipalAssignmentsList
    - name: KustoDatabasesCreateOrUpdate
    - name: KustoDatabasesGet
    - name: KustoDatabasesListByCluster
    - name: KustoDatabaseAddPrincipals
    - name: KustoDatabaseListPrincipals
    - name: KustoDatabaseRemovePrincipals
    - name: KustoDatabasesUpdate
    - name: KustoClusterPrincipalAssignmentsDelete
    - name: AttachedDatabaseConfigurationsDelete
    - name: KustoDataConnectionsDelete
    - name: KustoDatabasePrincipalAssignmentsDelete
    - name: KustoDatabasesDelete
    - name: KustoClustersDelete
