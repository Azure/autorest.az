# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az kusto|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az kusto` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az kusto attached-database-configuration|AttachedDatabaseConfigurations|[commands](#CommandsInAttachedDatabaseConfigurations)|
|az kusto cluster|Clusters|[commands](#CommandsInClusters)|
|az kusto cluster-principal-assignment|ClusterPrincipalAssignments|[commands](#CommandsInClusterPrincipalAssignments)|
|az kusto data-connection|DataConnections|[commands](#CommandsInDataConnections)|
|az kusto database|Databases|[commands](#CommandsInDatabases)|
|az kusto database-principal-assignment|DatabasePrincipalAssignments|[commands](#CommandsInDatabasePrincipalAssignments)|

## COMMANDS
### <a name="CommandsInAttachedDatabaseConfigurations">Commands in `az kusto attached-database-configuration` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto attached-database-configuration list](#AttachedDatabaseConfigurationsListByCluster)|ListByCluster|[Parameters](#ParametersAttachedDatabaseConfigurationsListByCluster)|[Example](#ExamplesAttachedDatabaseConfigurationsListByCluster)|
|[az kusto attached-database-configuration show](#AttachedDatabaseConfigurationsGet)|Get|[Parameters](#ParametersAttachedDatabaseConfigurationsGet)|[Example](#ExamplesAttachedDatabaseConfigurationsGet)|
|[az kusto attached-database-configuration create](#AttachedDatabaseConfigurationsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersAttachedDatabaseConfigurationsCreateOrUpdate#Create)|[Example](#ExamplesAttachedDatabaseConfigurationsCreateOrUpdate#Create)|
|[az kusto attached-database-configuration update](#AttachedDatabaseConfigurationsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersAttachedDatabaseConfigurationsCreateOrUpdate#Update)|Not Found|
|[az kusto attached-database-configuration delete](#AttachedDatabaseConfigurationsDelete)|Delete|[Parameters](#ParametersAttachedDatabaseConfigurationsDelete)|[Example](#ExamplesAttachedDatabaseConfigurationsDelete)|

### <a name="CommandsInClusters">Commands in `az kusto cluster` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto cluster list](#ClustersListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersClustersListByResourceGroup)|[Example](#ExamplesClustersListByResourceGroup)|
|[az kusto cluster list](#ClustersList)|List|[Parameters](#ParametersClustersList)|[Example](#ExamplesClustersList)|
|[az kusto cluster show](#ClustersGet)|Get|[Parameters](#ParametersClustersGet)|[Example](#ExamplesClustersGet)|
|[az kusto cluster create](#ClustersCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersClustersCreateOrUpdate#Create)|[Example](#ExamplesClustersCreateOrUpdate#Create)|
|[az kusto cluster update](#ClustersUpdate)|Update|[Parameters](#ParametersClustersUpdate)|[Example](#ExamplesClustersUpdate)|
|[az kusto cluster delete](#ClustersDelete)|Delete|[Parameters](#ParametersClustersDelete)|[Example](#ExamplesClustersDelete)|
|[az kusto cluster add-language-extension](#ClustersAddLanguageExtensions)|AddLanguageExtensions|[Parameters](#ParametersClustersAddLanguageExtensions)|[Example](#ExamplesClustersAddLanguageExtensions)|
|[az kusto cluster detach-follower-database](#ClustersDetachFollowerDatabases)|DetachFollowerDatabases|[Parameters](#ParametersClustersDetachFollowerDatabases)|[Example](#ExamplesClustersDetachFollowerDatabases)|
|[az kusto cluster diagnose-virtual-network](#ClustersDiagnoseVirtualNetwork)|DiagnoseVirtualNetwork|[Parameters](#ParametersClustersDiagnoseVirtualNetwork)|[Example](#ExamplesClustersDiagnoseVirtualNetwork)|
|[az kusto cluster list-follower-database](#ClustersListFollowerDatabases)|ListFollowerDatabases|[Parameters](#ParametersClustersListFollowerDatabases)|[Example](#ExamplesClustersListFollowerDatabases)|
|[az kusto cluster list-language-extension](#ClustersListLanguageExtensions)|ListLanguageExtensions|[Parameters](#ParametersClustersListLanguageExtensions)|[Example](#ExamplesClustersListLanguageExtensions)|
|[az kusto cluster list-sku](#ClustersListSkusByResource)|ListSkusByResource|[Parameters](#ParametersClustersListSkusByResource)|[Example](#ExamplesClustersListSkusByResource)|
|[az kusto cluster list-sku](#ClustersListSkus)|ListSkus|[Parameters](#ParametersClustersListSkus)|[Example](#ExamplesClustersListSkus)|
|[az kusto cluster remove-language-extension](#ClustersRemoveLanguageExtensions)|RemoveLanguageExtensions|[Parameters](#ParametersClustersRemoveLanguageExtensions)|[Example](#ExamplesClustersRemoveLanguageExtensions)|
|[az kusto cluster start](#ClustersStart)|Start|[Parameters](#ParametersClustersStart)|[Example](#ExamplesClustersStart)|
|[az kusto cluster stop](#ClustersStop)|Stop|[Parameters](#ParametersClustersStop)|[Example](#ExamplesClustersStop)|

### <a name="CommandsInClusterPrincipalAssignments">Commands in `az kusto cluster-principal-assignment` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto cluster-principal-assignment list](#ClusterPrincipalAssignmentsList)|List|[Parameters](#ParametersClusterPrincipalAssignmentsList)|[Example](#ExamplesClusterPrincipalAssignmentsList)|
|[az kusto cluster-principal-assignment show](#ClusterPrincipalAssignmentsGet)|Get|[Parameters](#ParametersClusterPrincipalAssignmentsGet)|[Example](#ExamplesClusterPrincipalAssignmentsGet)|
|[az kusto cluster-principal-assignment create](#ClusterPrincipalAssignmentsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersClusterPrincipalAssignmentsCreateOrUpdate#Create)|[Example](#ExamplesClusterPrincipalAssignmentsCreateOrUpdate#Create)|
|[az kusto cluster-principal-assignment update](#ClusterPrincipalAssignmentsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersClusterPrincipalAssignmentsCreateOrUpdate#Update)|Not Found|
|[az kusto cluster-principal-assignment delete](#ClusterPrincipalAssignmentsDelete)|Delete|[Parameters](#ParametersClusterPrincipalAssignmentsDelete)|[Example](#ExamplesClusterPrincipalAssignmentsDelete)|

### <a name="CommandsInDataConnections">Commands in `az kusto data-connection` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto data-connection list](#DataConnectionsListByDatabase)|ListByDatabase|[Parameters](#ParametersDataConnectionsListByDatabase)|[Example](#ExamplesDataConnectionsListByDatabase)|
|[az kusto data-connection show](#DataConnectionsGet)|Get|[Parameters](#ParametersDataConnectionsGet)|[Example](#ExamplesDataConnectionsGet)|
|[az kusto data-connection create](#DataConnectionsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDataConnectionsCreateOrUpdate#Create)|[Example](#ExamplesDataConnectionsCreateOrUpdate#Create)|
|[az kusto data-connection update](#DataConnectionsUpdate)|Update|[Parameters](#ParametersDataConnectionsUpdate)|[Example](#ExamplesDataConnectionsUpdate)|
|[az kusto data-connection delete](#DataConnectionsDelete)|Delete|[Parameters](#ParametersDataConnectionsDelete)|[Example](#ExamplesDataConnectionsDelete)|
|[az kusto data-connection data-connection-validation](#DataConnectionsdataConnectionValidation)|dataConnectionValidation|[Parameters](#ParametersDataConnectionsdataConnectionValidation)|[Example](#ExamplesDataConnectionsdataConnectionValidation)|

### <a name="CommandsInDatabases">Commands in `az kusto database` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto database list](#DatabasesListByCluster)|ListByCluster|[Parameters](#ParametersDatabasesListByCluster)|[Example](#ExamplesDatabasesListByCluster)|
|[az kusto database show](#DatabasesGet)|Get|[Parameters](#ParametersDatabasesGet)|[Example](#ExamplesDatabasesGet)|
|[az kusto database create](#DatabasesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDatabasesCreateOrUpdate#Create)|[Example](#ExamplesDatabasesCreateOrUpdate#Create)|
|[az kusto database update](#DatabasesUpdate)|Update|[Parameters](#ParametersDatabasesUpdate)|[Example](#ExamplesDatabasesUpdate)|
|[az kusto database delete](#DatabasesDelete)|Delete|[Parameters](#ParametersDatabasesDelete)|[Example](#ExamplesDatabasesDelete)|
|[az kusto database add-principal](#DatabasesAddPrincipals)|AddPrincipals|[Parameters](#ParametersDatabasesAddPrincipals)|[Example](#ExamplesDatabasesAddPrincipals)|
|[az kusto database list-principal](#DatabasesListPrincipals)|ListPrincipals|[Parameters](#ParametersDatabasesListPrincipals)|[Example](#ExamplesDatabasesListPrincipals)|
|[az kusto database remove-principal](#DatabasesRemovePrincipals)|RemovePrincipals|[Parameters](#ParametersDatabasesRemovePrincipals)|[Example](#ExamplesDatabasesRemovePrincipals)|

### <a name="CommandsInDatabasePrincipalAssignments">Commands in `az kusto database-principal-assignment` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az kusto database-principal-assignment list](#DatabasePrincipalAssignmentsList)|List|[Parameters](#ParametersDatabasePrincipalAssignmentsList)|[Example](#ExamplesDatabasePrincipalAssignmentsList)|
|[az kusto database-principal-assignment show](#DatabasePrincipalAssignmentsGet)|Get|[Parameters](#ParametersDatabasePrincipalAssignmentsGet)|[Example](#ExamplesDatabasePrincipalAssignmentsGet)|
|[az kusto database-principal-assignment create](#DatabasePrincipalAssignmentsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersDatabasePrincipalAssignmentsCreateOrUpdate#Create)|[Example](#ExamplesDatabasePrincipalAssignmentsCreateOrUpdate#Create)|
|[az kusto database-principal-assignment update](#DatabasePrincipalAssignmentsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersDatabasePrincipalAssignmentsCreateOrUpdate#Update)|Not Found|
|[az kusto database-principal-assignment delete](#DatabasePrincipalAssignmentsDelete)|Delete|[Parameters](#ParametersDatabasePrincipalAssignmentsDelete)|[Example](#ExamplesDatabasePrincipalAssignmentsDelete)|


## COMMAND DETAILS
### group `az kusto attached-database-configuration`
#### <a name="AttachedDatabaseConfigurationsListByCluster">Command `az kusto attached-database-configuration list`</a>

##### <a name="ExamplesAttachedDatabaseConfigurationsListByCluster">Example</a>
```
az kusto attached-database-configuration list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersAttachedDatabaseConfigurationsListByCluster">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="AttachedDatabaseConfigurationsGet">Command `az kusto attached-database-configuration show`</a>

##### <a name="ExamplesAttachedDatabaseConfigurationsGet">Example</a>
```
az kusto attached-database-configuration show --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersAttachedDatabaseConfigurationsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--attached-database-configuration-name**|string|The name of the attached database configuration.|attached_database_configuration_name|attachedDatabaseConfigurationName|

#### <a name="AttachedDatabaseConfigurationsCreateOrUpdate#Create">Command `az kusto attached-database-configuration create`</a>

##### <a name="ExamplesAttachedDatabaseConfigurationsCreateOrUpdate#Create">Example</a>
```
az kusto attached-database-configuration create --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --location "westus" --cluster-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/re\
sourceGroups/kustorptest/providers/Microsoft.Kusto/Clusters/KustoClusterLeader" --database-name "kustodatabase" \
--default-principals-modification-kind "Union" --resource-group "kustorptest"
```
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

#### <a name="AttachedDatabaseConfigurationsCreateOrUpdate#Update">Command `az kusto attached-database-configuration update`</a>


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

#### <a name="AttachedDatabaseConfigurationsDelete">Command `az kusto attached-database-configuration delete`</a>

##### <a name="ExamplesAttachedDatabaseConfigurationsDelete">Example</a>
```
az kusto attached-database-configuration delete --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersAttachedDatabaseConfigurationsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--attached-database-configuration-name**|string|The name of the attached database configuration.|attached_database_configuration_name|attachedDatabaseConfigurationName|

### group `az kusto cluster`
#### <a name="ClustersListByResourceGroup">Command `az kusto cluster list`</a>

##### <a name="ExamplesClustersListByResourceGroup">Example</a>
```
az kusto cluster list --resource-group "kustorptest"
```
##### <a name="ParametersClustersListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|

#### <a name="ClustersList">Command `az kusto cluster list`</a>

##### <a name="ExamplesClustersList">Example</a>
```
az kusto cluster list
```
##### <a name="ParametersClustersList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|

#### <a name="ClustersGet">Command `az kusto cluster show`</a>

##### <a name="ExamplesClustersGet">Example</a>
```
az kusto cluster show --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersCreateOrUpdate#Create">Command `az kusto cluster create`</a>

##### <a name="ExamplesClustersCreateOrUpdate#Create">Example</a>
```
az kusto cluster create --name "kustoclusterrptest4" --type "SystemAssigned" --location "westus" \
--enable-double-encryption false --enable-purge true --enable-streaming-ingest true --sku name="Standard_L8s" \
capacity=2 tier="Standard" --resource-group "kustorptest"
```
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
|**--type**|sealed-choice|The identity type.|type|type|
|**--user-assigned-identities**|dictionary|The list of user identities associated with the Kusto cluster. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.|user_assigned_identities|userAssignedIdentities|

#### <a name="ClustersUpdate">Command `az kusto cluster update`</a>

##### <a name="ExamplesClustersUpdate">Example</a>
```
az kusto cluster update --name "kustoclusterrptest4" --type "SystemAssigned" --location "westus" --enable-purge true \
--enable-streaming-ingest true --key-vault-properties key-name="keyName" key-vault-uri="https://dummy.keyvault.com" \
key-version="keyVersion" --resource-group "kustorptest"
```
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
|**--type**|sealed-choice|The identity type.|type|type|
|**--user-assigned-identities**|dictionary|The list of user identities associated with the Kusto cluster. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.|user_assigned_identities|userAssignedIdentities|

#### <a name="ClustersDelete">Command `az kusto cluster delete`</a>

##### <a name="ExamplesClustersDelete">Example</a>
```
az kusto cluster delete --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersAddLanguageExtensions">Command `az kusto cluster add-language-extension`</a>

##### <a name="ExamplesClustersAddLanguageExtensions">Example</a>
```
az kusto cluster add-language-extension --name "kustoclusterrptest4" --value language-extension-name="PYTHON" --value \
language-extension-name="R" --resource-group "kustorptest"
```
##### <a name="ParametersClustersAddLanguageExtensions">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--value**|array|The list of language extensions.|value|value|

#### <a name="ClustersDetachFollowerDatabases">Command `az kusto cluster detach-follower-database`</a>

##### <a name="ExamplesClustersDetachFollowerDatabases">Example</a>
```
az kusto cluster detach-follower-database --name "kustoclusterrptest4" --attached-database-configuration-name \
"myAttachedDatabaseConfiguration" --cluster-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGr\
oups/kustorptest/providers/Microsoft.Kusto/clusters/leader4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersDetachFollowerDatabases">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--cluster-resource-id**|string|Resource id of the cluster that follows a database owned by this cluster.|cluster_resource_id|clusterResourceId|
|**--attached-database-configuration-name**|string|Resource name of the attached database configuration in the follower cluster.|attached_database_configuration_name|attachedDatabaseConfigurationName|

#### <a name="ClustersDiagnoseVirtualNetwork">Command `az kusto cluster diagnose-virtual-network`</a>

##### <a name="ExamplesClustersDiagnoseVirtualNetwork">Example</a>
```
az kusto cluster diagnose-virtual-network --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersDiagnoseVirtualNetwork">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListFollowerDatabases">Command `az kusto cluster list-follower-database`</a>

##### <a name="ExamplesClustersListFollowerDatabases">Example</a>
```
az kusto cluster list-follower-database --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersListFollowerDatabases">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListLanguageExtensions">Command `az kusto cluster list-language-extension`</a>

##### <a name="ExamplesClustersListLanguageExtensions">Example</a>
```
az kusto cluster list-language-extension --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersListLanguageExtensions">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListSkusByResource">Command `az kusto cluster list-sku`</a>

##### <a name="ExamplesClustersListSkusByResource">Example</a>
```
az kusto cluster list-sku --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersListSkusByResource">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersListSkus">Command `az kusto cluster list-sku`</a>

##### <a name="ExamplesClustersListSkus">Example</a>
```
az kusto cluster list-sku
```
##### <a name="ParametersClustersListSkus">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|

#### <a name="ClustersRemoveLanguageExtensions">Command `az kusto cluster remove-language-extension`</a>

##### <a name="ExamplesClustersRemoveLanguageExtensions">Example</a>
```
az kusto cluster remove-language-extension --name "kustoclusterrptest4" --value language-extension-name="PYTHON" \
--value language-extension-name="R" --resource-group "kustorptest"
```
##### <a name="ParametersClustersRemoveLanguageExtensions">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--value**|array|The list of language extensions.|value|value|

#### <a name="ClustersStart">Command `az kusto cluster start`</a>

##### <a name="ExamplesClustersStart">Example</a>
```
az kusto cluster start --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClustersStop">Command `az kusto cluster stop`</a>

##### <a name="ExamplesClustersStop">Example</a>
```
az kusto cluster stop --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClustersStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

### group `az kusto cluster-principal-assignment`
#### <a name="ClusterPrincipalAssignmentsList">Command `az kusto cluster-principal-assignment list`</a>

##### <a name="ExamplesClusterPrincipalAssignmentsList">Example</a>
```
az kusto cluster-principal-assignment list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersClusterPrincipalAssignmentsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="ClusterPrincipalAssignmentsGet">Command `az kusto cluster-principal-assignment show`</a>

##### <a name="ExamplesClusterPrincipalAssignmentsGet">Example</a>
```
az kusto cluster-principal-assignment show --cluster-name "kustoclusterrptest4" --principal-assignment-name \
"kustoprincipal1" --resource-group "kustorptest"
```
##### <a name="ParametersClusterPrincipalAssignmentsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|

#### <a name="ClusterPrincipalAssignmentsCreateOrUpdate#Create">Command `az kusto cluster-principal-assignment create`</a>

##### <a name="ExamplesClusterPrincipalAssignmentsCreateOrUpdate#Create">Example</a>
```
az kusto cluster-principal-assignment create --cluster-name "kustoclusterrptest4" --principal-id \
"87654321-1234-1234-1234-123456789123" --principal-type "App" --role "AllDatabasesAdmin" --tenant-id \
"12345678-1234-1234-1234-123456789123" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
```
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

#### <a name="ClusterPrincipalAssignmentsCreateOrUpdate#Update">Command `az kusto cluster-principal-assignment update`</a>


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

#### <a name="ClusterPrincipalAssignmentsDelete">Command `az kusto cluster-principal-assignment delete`</a>

##### <a name="ExamplesClusterPrincipalAssignmentsDelete">Example</a>
```
az kusto cluster-principal-assignment delete --cluster-name "kustoclusterrptest4" --principal-assignment-name \
"kustoprincipal1" --resource-group "kustorptest"
```
##### <a name="ParametersClusterPrincipalAssignmentsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|

### group `az kusto data-connection`
#### <a name="DataConnectionsListByDatabase">Command `az kusto data-connection list`</a>

##### <a name="ExamplesDataConnectionsListByDatabase">Example</a>
```
az kusto data-connection list --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --resource-group \
"kustorptest"
```
##### <a name="ParametersDataConnectionsListByDatabase">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DataConnectionsGet">Command `az kusto data-connection show`</a>

##### <a name="ExamplesDataConnectionsGet">Example</a>
```
az kusto data-connection show --cluster-name "kustoclusterrptest4" --name "DataConnections8" --database-name \
"KustoDatabase8" --resource-group "kustorptest"
```
##### <a name="ParametersDataConnectionsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|

#### <a name="DataConnectionsCreateOrUpdate#Create">Command `az kusto data-connection create`</a>

##### <a name="ExamplesDataConnectionsCreateOrUpdate#Create">Example</a>
```
az kusto data-connection create --cluster-name "kustoclusterrptest4" --name "DataConnections8" --database-name \
"KustoDatabase8" --event-hub-data-connection location="westus" event-hub-resource-id="/subscriptions/12345678-1234-1234\
-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhu\
bTest1" consumer-group="testConsumerGroup1" --resource-group "kustorptest"
```
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

#### <a name="DataConnectionsUpdate">Command `az kusto data-connection update`</a>

##### <a name="ExamplesDataConnectionsUpdate">Example</a>
```
az kusto data-connection update --cluster-name "kustoclusterrptest4" --name "DataConnections8" --database-name \
"KustoDatabase8" --event-hub-data-connection location="westus" event-hub-resource-id="/subscriptions/12345678-1234-1234\
-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhu\
bTest1" consumer-group="testConsumerGroup1" --resource-group "kustorptest"
```
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

#### <a name="DataConnectionsDelete">Command `az kusto data-connection delete`</a>

##### <a name="ExamplesDataConnectionsDelete">Example</a>
```
az kusto data-connection delete --cluster-name "kustoclusterrptest4" --name "kustoeventhubconnection1" --database-name \
"KustoDatabase8" --resource-group "kustorptest"
```
##### <a name="ParametersDataConnectionsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--data-connection-name**|string|The name of the data connection.|data_connection_name|dataConnectionName|

#### <a name="DataConnectionsdataConnectionValidation">Command `az kusto data-connection data-connection-validation`</a>

##### <a name="ExamplesDataConnectionsdataConnectionValidation">Example</a>
```
az kusto data-connection data-connection-validation --cluster-name "kustoclusterrptest4" --database-name \
"KustoDatabase8" --name "DataConnections8" --event-hub-data-connection consumer-group="testConsumerGroup1" \
event-hub-resource-id="/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Microso\
ft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" --resource-group "kustorptest"
```
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

### group `az kusto database`
#### <a name="DatabasesListByCluster">Command `az kusto database list`</a>

##### <a name="ExamplesDatabasesListByCluster">Example</a>
```
az kusto database list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### <a name="ParametersDatabasesListByCluster">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|

#### <a name="DatabasesGet">Command `az kusto database show`</a>

##### <a name="ExamplesDatabasesGet">Example</a>
```
az kusto database show --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --resource-group \
"kustorptest"
```
##### <a name="ParametersDatabasesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasesCreateOrUpdate#Create">Command `az kusto database create`</a>

##### <a name="ExamplesDatabasesCreateOrUpdate#Create">Example</a>
```
az kusto database create --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --read-write-database \
location="westus" soft-delete-period="P1D" --resource-group "kustorptest"
```
##### <a name="ParametersDatabasesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--read-write-database**|object|Class representing a read write database.|read_write_database|ReadWriteDatabase|
|**--read-only-following-database**|object|Class representing a read only following database.|read_only_following_database|ReadOnlyFollowingDatabase|

#### <a name="DatabasesUpdate">Command `az kusto database update`</a>

##### <a name="ExamplesDatabasesUpdate">Example</a>
```
az kusto database update --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --read-write-database \
soft-delete-period="P1D" --resource-group "kustorptest"
```
##### <a name="ParametersDatabasesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--read-write-database**|object|Class representing a read write database.|read_write_database|ReadWriteDatabase|
|**--read-only-following-database**|object|Class representing a read only following database.|read_only_following_database|ReadOnlyFollowingDatabase|

#### <a name="DatabasesDelete">Command `az kusto database delete`</a>

##### <a name="ExamplesDatabasesDelete">Example</a>
```
az kusto database delete --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --resource-group \
"kustorptest"
```
##### <a name="ParametersDatabasesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasesAddPrincipals">Command `az kusto database add-principal`</a>

##### <a name="ExamplesDatabasesAddPrincipals">Example</a>
```
az kusto database add-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --value \
name="Some User" type="User" app-id="" email="user@microsoft.com" fqn="aaduser=some_guid" role="Admin" --value \
name="Kusto" type="Group" app-id="" email="kusto@microsoft.com" fqn="aadgroup=some_guid" role="Viewer" --value \
name="SomeApp" type="App" app-id="some_guid_app_id" email="" fqn="aadapp=some_guid_app_id" role="Admin" \
--resource-group "kustorptest"
```
##### <a name="ParametersDatabasesAddPrincipals">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--value**|array|The list of Kusto database principals.|value|value|

#### <a name="DatabasesListPrincipals">Command `az kusto database list-principal`</a>

##### <a name="ExamplesDatabasesListPrincipals">Example</a>
```
az kusto database list-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest"
```
##### <a name="ParametersDatabasesListPrincipals">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasesRemovePrincipals">Command `az kusto database remove-principal`</a>

##### <a name="ExamplesDatabasesRemovePrincipals">Example</a>
```
az kusto database remove-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" --value \
name="Some User" type="User" app-id="" email="user@microsoft.com" fqn="aaduser=some_guid" role="Admin" --value \
name="Kusto" type="Group" app-id="" email="kusto@microsoft.com" fqn="aadgroup=some_guid" role="Viewer" --value \
name="SomeApp" type="App" app-id="some_guid_app_id" email="" fqn="aadapp=some_guid_app_id" role="Admin" \
--resource-group "kustorptest"
```
##### <a name="ParametersDatabasesRemovePrincipals">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--value**|array|The list of Kusto database principals.|value|value|

### group `az kusto database-principal-assignment`
#### <a name="DatabasePrincipalAssignmentsList">Command `az kusto database-principal-assignment list`</a>

##### <a name="ExamplesDatabasePrincipalAssignmentsList">Example</a>
```
az kusto database-principal-assignment list --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
--resource-group "kustorptest"
```
##### <a name="ParametersDatabasePrincipalAssignmentsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|

#### <a name="DatabasePrincipalAssignmentsGet">Command `az kusto database-principal-assignment show`</a>

##### <a name="ExamplesDatabasePrincipalAssignmentsGet">Example</a>
```
az kusto database-principal-assignment show --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
```
##### <a name="ParametersDatabasePrincipalAssignmentsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|

#### <a name="DatabasePrincipalAssignmentsCreateOrUpdate#Create">Command `az kusto database-principal-assignment create`</a>

##### <a name="ExamplesDatabasePrincipalAssignmentsCreateOrUpdate#Create">Example</a>
```
az kusto database-principal-assignment create --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
--principal-id "87654321-1234-1234-1234-123456789123" --principal-type "App" --role "Admin" --tenant-id \
"12345678-1234-1234-1234-123456789123" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
```
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

#### <a name="DatabasePrincipalAssignmentsCreateOrUpdate#Update">Command `az kusto database-principal-assignment update`</a>


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

#### <a name="DatabasePrincipalAssignmentsDelete">Command `az kusto database-principal-assignment delete`</a>

##### <a name="ExamplesDatabasePrincipalAssignmentsDelete">Example</a>
```
az kusto database-principal-assignment delete --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
```
##### <a name="ParametersDatabasePrincipalAssignmentsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group containing the Kusto cluster.|resource_group_name|resourceGroupName|
|**--cluster-name**|string|The name of the Kusto cluster.|cluster_name|clusterName|
|**--database-name**|string|The name of the database in the Kusto cluster.|database_name|databaseName|
|**--principal-assignment-name**|string|The name of the Kusto principalAssignment.|principal_assignment_name|principalAssignmentName|
