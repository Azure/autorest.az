# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az kusto|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in 'az kusto' extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az kusto cluster|Clusters|[commands](#CommandsInClusters)|
|az kusto cluster-principal-assignment|ClusterPrincipalAssignments|[commands](#CommandsInClusterPrincipalAssignments)|
|az kusto database|Databases|[commands](#CommandsInDatabases)|
|az kusto database-principal-assignment|DatabasePrincipalAssignments|[commands](#CommandsInDatabasePrincipalAssignments)|
|az kusto attached-database-configuration|AttachedDatabaseConfigurations|[commands](#CommandsInAttachedDatabaseConfigurations)|
|az kusto data-connection|DataConnections|[commands](#CommandsInDataConnections)|

## COMMANDS
### <a name="CommandsInAttachedDatabaseConfigurations">Commands in 'az kusto attached-database-configuration' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto attached-database-configuration list](#AttachedDatabaseConfigurationsListByCluster)|ListByCluster|[Parameters](#ParametersAttachedDatabaseConfigurationsListByCluster)|Not Found|
|[az kusto attached-database-configuration show](#AttachedDatabaseConfigurationsGet)|Get|[Parameters](#ParametersAttachedDatabaseConfigurationsGet)|Not Found|
|[az kusto attached-database-configuration create](#AttachedDatabaseConfigurationsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersAttachedDatabaseConfigurationsCreateOrUpdate#Create)|Not Found|
|[az kusto attached-database-configuration update](#AttachedDatabaseConfigurationsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersAttachedDatabaseConfigurationsCreateOrUpdate#Update)|Not Found|
|[az kusto attached-database-configuration delete](#AttachedDatabaseConfigurationsDelete)|Delete|[Parameters](#ParametersAttachedDatabaseConfigurationsDelete)|Not Found|

### <a name="CommandsInClusters">Commands in 'az kusto cluster' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto cluster list](#ClustersListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersClustersListByResourceGroup)|Not Found|
|[az kusto cluster list](#ClustersList)|List|[Parameters](#ParametersClustersList)|Not Found|
|[az kusto cluster show](#ClustersGet)|Get|[Parameters](#ParametersClustersGet)|Not Found|
|[az kusto cluster create](#ClustersCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersClustersCreateOrUpdate#Create)|Not Found|
|[az kusto cluster update](#ClustersUpdate)|Update|[Parameters](#ParametersClustersUpdate)|Not Found|
|[az kusto cluster delete](#ClustersDelete)|Delete|[Parameters](#ParametersClustersDelete)|Not Found|
|[az kusto cluster add-language-extension](#ClustersAddLanguageExtensions)|AddLanguageExtensions|[Parameters](#ParametersClustersAddLanguageExtensions)|Not Found|
|[az kusto cluster detach-follower-database](#ClustersDetachFollowerDatabases)|DetachFollowerDatabases|[Parameters](#ParametersClustersDetachFollowerDatabases)|Not Found|
|[az kusto cluster diagnose-virtual-network](#ClustersDiagnoseVirtualNetwork)|DiagnoseVirtualNetwork|[Parameters](#ParametersClustersDiagnoseVirtualNetwork)|Not Found|
|[az kusto cluster list-follower-database](#ClustersListFollowerDatabases)|ListFollowerDatabases|[Parameters](#ParametersClustersListFollowerDatabases)|Not Found|
|[az kusto cluster list-language-extension](#ClustersListLanguageExtensions)|ListLanguageExtensions|[Parameters](#ParametersClustersListLanguageExtensions)|Not Found|
|[az kusto cluster list-sku](#ClustersListSkusByResource)|ListSkusByResource|[Parameters](#ParametersClustersListSkusByResource)|Not Found|
|[az kusto cluster list-sku](#ClustersListSkus)|ListSkus|[Parameters](#ParametersClustersListSkus)|Not Found|
|[az kusto cluster remove-language-extension](#ClustersRemoveLanguageExtensions)|RemoveLanguageExtensions|[Parameters](#ParametersClustersRemoveLanguageExtensions)|Not Found|
|[az kusto cluster start](#ClustersStart)|Start|[Parameters](#ParametersClustersStart)|Not Found|
|[az kusto cluster stop](#ClustersStop)|Stop|[Parameters](#ParametersClustersStop)|Not Found|

### <a name="CommandsInClusterPrincipalAssignments">Commands in 'az kusto cluster-principal-assignment' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto cluster-principal-assignment list](#ClusterPrincipalAssignmentsList)|List|[Parameters](#ParametersClusterPrincipalAssignmentsList)|Not Found|
|[az kusto cluster-principal-assignment show](#ClusterPrincipalAssignmentsGet)|Get|[Parameters](#ParametersClusterPrincipalAssignmentsGet)|Not Found|
|[az kusto cluster-principal-assignment create](#ClusterPrincipalAssignmentsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersClusterPrincipalAssignmentsCreateOrUpdate#Create)|Not Found|
|[az kusto cluster-principal-assignment update](#ClusterPrincipalAssignmentsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersClusterPrincipalAssignmentsCreateOrUpdate#Update)|Not Found|
|[az kusto cluster-principal-assignment delete](#ClusterPrincipalAssignmentsDelete)|Delete|[Parameters](#ParametersClusterPrincipalAssignmentsDelete)|Not Found|

### <a name="CommandsInDataConnections">Commands in 'az kusto data-connection' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto data-connection list](#DataConnectionsListByDatabase)|ListByDatabase|[Parameters](#ParametersDataConnectionsListByDatabase)|Not Found|
|[az kusto data-connection show](#DataConnectionsGet)|Get|[Parameters](#ParametersDataConnectionsGet)|Not Found|
|[az kusto data-connection create](#DataConnectionsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDataConnectionsCreateOrUpdate#Create)|Not Found|
|[az kusto data-connection update](#DataConnectionsUpdate)|Update|[Parameters](#ParametersDataConnectionsUpdate)|Not Found|
|[az kusto data-connection delete](#DataConnectionsDelete)|Delete|[Parameters](#ParametersDataConnectionsDelete)|Not Found|
|[az kusto data-connection data-connection-validation](#DataConnectionsdataConnectionValidation)|dataConnectionValidation|[Parameters](#ParametersDataConnectionsdataConnectionValidation)|Not Found|

### <a name="CommandsInDatabases">Commands in 'az kusto database' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto database list](#DatabasesListByCluster)|ListByCluster|[Parameters](#ParametersDatabasesListByCluster)|Not Found|
|[az kusto database show](#DatabasesGet)|Get|[Parameters](#ParametersDatabasesGet)|Not Found|
|[az kusto database create](#DatabasesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDatabasesCreateOrUpdate#Create)|Not Found|
|[az kusto database update](#DatabasesUpdate)|Update|[Parameters](#ParametersDatabasesUpdate)|Not Found|
|[az kusto database delete](#DatabasesDelete)|Delete|[Parameters](#ParametersDatabasesDelete)|Not Found|
|[az kusto database add-principal](#DatabasesAddPrincipals)|AddPrincipals|[Parameters](#ParametersDatabasesAddPrincipals)|Not Found|
|[az kusto database list-principal](#DatabasesListPrincipals)|ListPrincipals|[Parameters](#ParametersDatabasesListPrincipals)|Not Found|
|[az kusto database remove-principal](#DatabasesRemovePrincipals)|RemovePrincipals|[Parameters](#ParametersDatabasesRemovePrincipals)|Not Found|

### <a name="CommandsInDatabasePrincipalAssignments">Commands in 'az kusto database-principal-assignment' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto database-principal-assignment list](#DatabasePrincipalAssignmentsList)|List|[Parameters](#ParametersDatabasePrincipalAssignmentsList)|Not Found|
|[az kusto database-principal-assignment show](#DatabasePrincipalAssignmentsGet)|Get|[Parameters](#ParametersDatabasePrincipalAssignmentsGet)|Not Found|
|[az kusto database-principal-assignment create](#DatabasePrincipalAssignmentsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDatabasePrincipalAssignmentsCreateOrUpdate#Create)|Not Found|
|[az kusto database-principal-assignment update](#DatabasePrincipalAssignmentsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersDatabasePrincipalAssignmentsCreateOrUpdate#Update)|Not Found|
|[az kusto database-principal-assignment delete](#DatabasePrincipalAssignmentsDelete)|Delete|[Parameters](#ParametersDatabasePrincipalAssignmentsDelete)|Not Found|


## COMMAND DETAILS

### group 'az kusto attached-database-configuration'
#### <a name="AttachedDatabaseConfigurationsListByCluster">Command 'az kusto attached-database-configuration list'</a>

##### <a name="ParametersAttachedDatabaseConfigurationsListByCluster">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="AttachedDatabaseConfigurationsGet">Command 'az kusto attached-database-configuration show'</a>

##### <a name="ParametersAttachedDatabaseConfigurationsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--attached-database-configuration-name**|string|The name of the attached database configuration.|attached_database_configuration_name|attachedDatabaseConfigurationName|

#### <a name="AttachedDatabaseConfigurationsCreateOrUpdate#Create">Command 'az kusto attached-database-configuration create'</a>

##### <a name="ParametersAttachedDatabaseConfigurationsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--attached-database-configuration-name**|string|The name of the attached database configuration.|attached_database_configuration_name|attachedDatabaseConfigurationName|
|**--location**|string|Resource location.|location|location|
|**--database-name**|string|The name of the database which you would like to attach, use * if you want to follow all current and future databases.|database_name|databaseName|
|**--cluster-resource-id**|string|The resource id of the cluster where the databases you would like to attach reside.|cluster_resource_id|clusterResourceId|
|**--default-principals-modification-kind**|choice|The default principals modification kind|default_principals_modification_kind|defaultPrincipalsModificationKind|

#### <a name="AttachedDatabaseConfigurationsCreateOrUpdate#Update">Command 'az kusto attached-database-configuration update'</a>

##### <a name="ParametersAttachedDatabaseConfigurationsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--attached-database-configuration-name**|string|The name of the attached database configuration.|attached_database_configuration_name|attachedDatabaseConfigurationName|
|**--location**|string|Resource location.|location|location|
|**--database-name**|string|The name of the database which you would like to attach, use * if you want to follow all current and future databases.|database_name|databaseName|
|**--cluster-resource-id**|string|The resource id of the cluster where the databases you would like to attach reside.|cluster_resource_id|clusterResourceId|
|**--default-principals-modification-kind**|choice|The default principals modification kind|default_principals_modification_kind|defaultPrincipalsModificationKind|

#### <a name="AttachedDatabaseConfigurationsDelete">Command 'az kusto attached-database-configuration delete'</a>

##### <a name="ParametersAttachedDatabaseConfigurationsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--attached-database-configuration-name**|string|The name of the attached database configuration.|attached_database_configuration_name|attachedDatabaseConfigurationName|

### group 'az kusto cluster'
#### <a name="ClustersListByResourceGroup">Command 'az kusto cluster list'</a>

##### <a name="ParametersClustersListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="ClustersList">Command 'az kusto cluster list'</a>

|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|

#### <a name="ClustersGet">Command 'az kusto cluster show'</a>

##### <a name="ParametersClustersGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersCreateOrUpdate#Create">Command 'az kusto cluster create'</a>

##### <a name="ParametersClustersCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--sku**|object|The SKU of the cluster.|sku|sku|
|**--tags**|dictionary|Resource tags.|tags|tags|
|**--zones**|array|The availability zones of the cluster.|zones|zones|
|**--trusted-external-tenants**|array|The cluster's external tenants.|trusted_external_tenants|trustedExternalTenants|
|**--optimized-autoscale**|object|Optimized auto scale definition.|optimized_autoscale|optimizedAutoscale|
|**--enable-disk-encryption**|boolean|A boolean value that indicates if the cluster's disks are encrypted.|enable_disk_encryption|enableDiskEncryption|
|**--enable-streaming-ingest**|boolean|A boolean value that indicates if the streaming ingest is enabled.|enable_streaming_ingest|enableStreamingIngest|
|**--virtual-network-configuration**|object|Virtual network definition.|virtual_network_configuration|virtualNetworkConfiguration|
|**--key-vault-properties**|object|KeyVault properties for the cluster encryption.|key_vault_properties|keyVaultProperties|
|**--enable-purge**|boolean|A boolean value that indicates if the purge operations are enabled.|enable_purge|enablePurge|
|**--enable-double-encryption**|boolean|A boolean value that indicates if double encryption is enabled.|enable_double_encryption|enableDoubleEncryption|
|**--identity-type**|sealed-choice|The identity type.|type|type|
|**--identity-user-assigned-identities**|dictionary|The list of user identities associated with the Kusto cluster. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.|user_assigned_identities|userAssignedIdentities|

#### <a name="ClustersUpdate">Command 'az kusto cluster update'</a>

##### <a name="ParametersClustersUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--tags**|dictionary|Resource tags.|tags|tags|
|**--location**|string|Resource location.|location|location|
|**--sku**|object|The SKU of the cluster.|sku|sku|
|**--trusted-external-tenants**|array|The cluster's external tenants.|trusted_external_tenants|trustedExternalTenants|
|**--optimized-autoscale**|object|Optimized auto scale definition.|optimized_autoscale|optimizedAutoscale|
|**--enable-disk-encryption**|boolean|A boolean value that indicates if the cluster's disks are encrypted.|enable_disk_encryption|enableDiskEncryption|
|**--enable-streaming-ingest**|boolean|A boolean value that indicates if the streaming ingest is enabled.|enable_streaming_ingest|enableStreamingIngest|
|**--virtual-network-configuration**|object|Virtual network definition.|virtual_network_configuration|virtualNetworkConfiguration|
|**--key-vault-properties**|object|KeyVault properties for the cluster encryption.|key_vault_properties|keyVaultProperties|
|**--enable-purge**|boolean|A boolean value that indicates if the purge operations are enabled.|enable_purge|enablePurge|
|**--enable-double-encryption**|boolean|A boolean value that indicates if double encryption is enabled.|enable_double_encryption|enableDoubleEncryption|
|**--identity-type**|sealed-choice|The identity type.|type|type|
|**--identity-user-assigned-identities**|dictionary|The list of user identities associated with the Kusto cluster. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.|user_assigned_identities|userAssignedIdentities|

#### <a name="ClustersDelete">Command 'az kusto cluster delete'</a>

##### <a name="ParametersClustersDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersAddLanguageExtensions">Command 'az kusto cluster add-language-extension'</a>

##### <a name="ParametersClustersAddLanguageExtensions">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--value**|array|The list of language extensions.|value|value|

#### <a name="ClustersDetachFollowerDatabases">Command 'az kusto cluster detach-follower-database'</a>

##### <a name="ParametersClustersDetachFollowerDatabases">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--cluster-resource-id**|string|Resource id of the cluster that follows a database owned by this cluster.|cluster_resource_id|clusterResourceId|
|**--attached-database-configuration-name**|string|Resource name of the attached database configuration in the follower cluster.|attached_database_configuration_name|attachedDatabaseConfigurationName|

#### <a name="ClustersDiagnoseVirtualNetwork">Command 'az kusto cluster diagnose-virtual-network'</a>

##### <a name="ParametersClustersDiagnoseVirtualNetwork">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListFollowerDatabases">Command 'az kusto cluster list-follower-database'</a>

##### <a name="ParametersClustersListFollowerDatabases">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListLanguageExtensions">Command 'az kusto cluster list-language-extension'</a>

##### <a name="ParametersClustersListLanguageExtensions">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListSkusByResource">Command 'az kusto cluster list-sku'</a>

##### <a name="ParametersClustersListSkusByResource">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="ClustersListSkus">Command 'az kusto cluster list-sku'</a>

|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersRemoveLanguageExtensions">Command 'az kusto cluster remove-language-extension'</a>

##### <a name="ParametersClustersRemoveLanguageExtensions">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--value**|array|The list of language extensions.|value|value|

#### <a name="ClustersStart">Command 'az kusto cluster start'</a>

##### <a name="ParametersClustersStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersStop">Command 'az kusto cluster stop'</a>

##### <a name="ParametersClustersStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

### group 'az kusto cluster-principal-assignment'
#### <a name="ClusterPrincipalAssignmentsList">Command 'az kusto cluster-principal-assignment list'</a>

##### <a name="ParametersClusterPrincipalAssignmentsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClusterPrincipalAssignmentsGet">Command 'az kusto cluster-principal-assignment show'</a>

##### <a name="ParametersClusterPrincipalAssignmentsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|

#### <a name="ClusterPrincipalAssignmentsCreateOrUpdate#Create">Command 'az kusto cluster-principal-assignment create'</a>

##### <a name="ParametersClusterPrincipalAssignmentsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|
|**--principal-id**|string|The principal ID assigned to the cluster principal. It can be a user email, application ID, or security group name.|principal_id|principalId|
|**--role**|choice|Cluster principal role.|role|role|
|**--tenant-id**|string|The tenant id of the principal|tenant_id|tenantId|
|**--principal-type**|choice|Principal type.|principal_type|principalType|

#### <a name="ClusterPrincipalAssignmentsCreateOrUpdate#Update">Command 'az kusto cluster-principal-assignment update'</a>

##### <a name="ParametersClusterPrincipalAssignmentsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|
|**--principal-id**|string|The principal ID assigned to the cluster principal. It can be a user email, application ID, or security group name.|principal_id|principalId|
|**--role**|choice|Cluster principal role.|role|role|
|**--tenant-id**|string|The tenant id of the principal|tenant_id|tenantId|
|**--principal-type**|choice|Principal type.|principal_type|principalType|

#### <a name="ClusterPrincipalAssignmentsDelete">Command 'az kusto cluster-principal-assignment delete'</a>

##### <a name="ParametersClusterPrincipalAssignmentsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|

### group 'az kusto data-connection'
#### <a name="DataConnectionsListByDatabase">Command 'az kusto data-connection list'</a>

##### <a name="ParametersDataConnectionsListByDatabase">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DataConnectionsGet">Command 'az kusto data-connection show'</a>

##### <a name="ParametersDataConnectionsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|

#### <a name="DataConnectionsCreateOrUpdate#Create">Command 'az kusto data-connection create'</a>

##### <a name="ParametersDataConnectionsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|
|**--event-hub-data-connection**|object|Class representing an event hub data connection.|event_hub_data_connection|EventHubDataConnection|
|**--iot-hub-data-connection**|object|Class representing an iot hub data connection.|iot_hub_data_connection|IotHubDataConnection|
|**--event-grid-data-connection**|object|Class representing an Event Grid data connection.|event_grid_data_connection|EventGridDataConnection|

#### <a name="DataConnectionsUpdate">Command 'az kusto data-connection update'</a>

##### <a name="ParametersDataConnectionsUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|
|**--event-hub-data-connection**|object|Class representing an event hub data connection.|event_hub_data_connection|EventHubDataConnection|
|**--iot-hub-data-connection**|object|Class representing an iot hub data connection.|iot_hub_data_connection|IotHubDataConnection|
|**--event-grid-data-connection**|object|Class representing an Event Grid data connection.|event_grid_data_connection|EventGridDataConnection|

#### <a name="DataConnectionsDelete">Command 'az kusto data-connection delete'</a>

##### <a name="ParametersDataConnectionsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|

#### <a name="DataConnectionsdataConnectionValidation">Command 'az kusto data-connection data-connection-validation'</a>

##### <a name="ParametersDataConnectionsdataConnectionValidation">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|
|**--event-hub-data-connection**|object|Class representing an event hub data connection.|event_hub_data_connection|EventHubDataConnection|
|**--iot-hub-data-connection**|object|Class representing an iot hub data connection.|iot_hub_data_connection|IotHubDataConnection|
|**--event-grid-data-connection**|object|Class representing an Event Grid data connection.|event_grid_data_connection|EventGridDataConnection|

### group 'az kusto database'
#### <a name="DatabasesListByCluster">Command 'az kusto database list'</a>

##### <a name="ParametersDatabasesListByCluster">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="DatabasesGet">Command 'az kusto database show'</a>

##### <a name="ParametersDatabasesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasesCreateOrUpdate#Create">Command 'az kusto database create'</a>

##### <a name="ParametersDatabasesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--read-write-database**|object|Class representing a read write database.|read_write_database|ReadWriteDatabase|
|**--read-only-following-database**|object|Class representing a read only following database.|read_only_following_database|ReadOnlyFollowingDatabase|

#### <a name="DatabasesUpdate">Command 'az kusto database update'</a>

##### <a name="ParametersDatabasesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--read-write-database**|object|Class representing a read write database.|read_write_database|ReadWriteDatabase|
|**--read-only-following-database**|object|Class representing a read only following database.|read_only_following_database|ReadOnlyFollowingDatabase|

#### <a name="DatabasesDelete">Command 'az kusto database delete'</a>

##### <a name="ParametersDatabasesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasesAddPrincipals">Command 'az kusto database add-principal'</a>

##### <a name="ParametersDatabasesAddPrincipals">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--value**|array|The list of Kusto database principals.|value|value|

#### <a name="DatabasesListPrincipals">Command 'az kusto database list-principal'</a>

##### <a name="ParametersDatabasesListPrincipals">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasesRemovePrincipals">Command 'az kusto database remove-principal'</a>

##### <a name="ParametersDatabasesRemovePrincipals">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--value**|array|The list of Kusto database principals.|value|value|

### group 'az kusto database-principal-assignment'
#### <a name="DatabasePrincipalAssignmentsList">Command 'az kusto database-principal-assignment list'</a>

##### <a name="ParametersDatabasePrincipalAssignmentsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasePrincipalAssignmentsGet">Command 'az kusto database-principal-assignment show'</a>

##### <a name="ParametersDatabasePrincipalAssignmentsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|

#### <a name="DatabasePrincipalAssignmentsCreateOrUpdate#Create">Command 'az kusto database-principal-assignment create'</a>

##### <a name="ParametersDatabasePrincipalAssignmentsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|
|**--principal-id**|string|The principal ID assigned to the database principal. It can be a user email, application ID, or security group name.|principal_id|principalId|
|**--role**|choice|Database principal role.|role|role|
|**--tenant-id**|string|The tenant id of the principal|tenant_id|tenantId|
|**--principal-type**|choice|Principal type.|principal_type|principalType|

#### <a name="DatabasePrincipalAssignmentsCreateOrUpdate#Update">Command 'az kusto database-principal-assignment update'</a>

##### <a name="ParametersDatabasePrincipalAssignmentsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|
|**--principal-id**|string|The principal ID assigned to the database principal. It can be a user email, application ID, or security group name.|principal_id|principalId|
|**--role**|choice|Database principal role.|role|role|
|**--tenant-id**|string|The tenant id of the principal|tenant_id|tenantId|
|**--principal-type**|choice|Principal type.|principal_type|principalType|

#### <a name="DatabasePrincipalAssignmentsDelete">Command 'az kusto database-principal-assignment delete'</a>

##### <a name="ParametersDatabasePrincipalAssignmentsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|
