# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az synapse|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in `az synapse` extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az synapse big-data-pool|BigDataPools|[commands](#CommandsInBigDataPools)|
|az synapse operation|Operations|[commands](#CommandsInOperations)|
|az synapse ip-firewall-rule|IpFirewallRules|[commands](#CommandsInIpFirewallRules)|
|az synapse sql-pool|SqlPools|[commands](#CommandsInSqlPools)|
|az synapse sql-pool-metadata-sync-config|SqlPoolMetadataSyncConfigs|[commands](#CommandsInSqlPoolMetadataSyncConfigs)|
|az synapse sql-pool-operation-result|SqlPoolOperationResults|[commands](#CommandsInSqlPoolOperationResults)|
|az synapse sql-pool-geo-backup-policy|SqlPoolGeoBackupPolicies|[commands](#CommandsInSqlPoolGeoBackupPolicies)|
|az synapse sql-pool-data-warehouse-user-activity|SqlPoolDataWarehouseUserActivities|[commands](#CommandsInSqlPoolDataWarehouseUserActivities)|
|az synapse sql-pool-restore-point|SqlPoolRestorePoints|[commands](#CommandsInSqlPoolRestorePoints)|
|az synapse sql-pool-replication-link|SqlPoolReplicationLinks|[commands](#CommandsInSqlPoolReplicationLinks)|
|az synapse sql-pool-transparent-data-encryption|SqlPoolTransparentDataEncryptions|[commands](#CommandsInSqlPoolTransparentDataEncryptions)|
|az synapse sql-pool-blob-auditing-policy|SqlPoolBlobAuditingPolicies|[commands](#CommandsInSqlPoolBlobAuditingPolicies)|
|az synapse sql-pool-operation|SqlPoolOperations|[commands](#CommandsInSqlPoolOperations)|
|az synapse sql-pool-usage|SqlPoolUsages|[commands](#CommandsInSqlPoolUsages)|
|az synapse sql-pool-sensitivity-label|SqlPoolSensitivityLabels|[commands](#CommandsInSqlPoolSensitivityLabels)|
|az synapse sql-pool-schema|SqlPoolSchemas|[commands](#CommandsInSqlPoolSchemas)|
|az synapse sql-pool-table|SqlPoolTables|[commands](#CommandsInSqlPoolTables)|
|az synapse sql-pool-table-column|SqlPoolTableColumns|[commands](#CommandsInSqlPoolTableColumns)|
|az synapse sql-pool-connection-policy|SqlPoolConnectionPolicies|[commands](#CommandsInSqlPoolConnectionPolicies)|
|az synapse sql-pool-vulnerability-assessment|SqlPoolVulnerabilityAssessments|[commands](#CommandsInSqlPoolVulnerabilityAssessments)|
|az synapse sql-pool-vulnerability-assessment-scan|SqlPoolVulnerabilityAssessmentScans|[commands](#CommandsInSqlPoolVulnerabilityAssessmentScans)|
|az synapse sql-pool-security-alert-policy|SqlPoolSecurityAlertPolicies|[commands](#CommandsInSqlPoolSecurityAlertPolicies)|
|az synapse sql-pool-vulnerability-assessment-rule-baseline|SqlPoolVulnerabilityAssessmentRuleBaselines|[commands](#CommandsInSqlPoolVulnerabilityAssessmentRuleBaselines)|
|az synapse workspace|Workspaces|[commands](#CommandsInWorkspaces)|
|az synapse workspace-aad-admin|WorkspaceAadAdmins|[commands](#CommandsInWorkspaceAadAdmins)|
|az synapse workspace-managed-identity-sql-control-setting|WorkspaceManagedIdentitySqlControlSettings|[commands](#CommandsInWorkspaceManagedIdentitySqlControlSettings)|
|az synapse integration-runtime|IntegrationRuntimes|[commands](#CommandsInIntegrationRuntimes)|
|az synapse integration-runtime-node-ip-address|IntegrationRuntimeNodeIpAddress|[commands](#CommandsInIntegrationRuntimeNodeIpAddress)|
|az synapse integration-runtime-object-metadata|IntegrationRuntimeObjectMetadata|[commands](#CommandsInIntegrationRuntimeObjectMetadata)|
|az synapse integration-runtime-node|IntegrationRuntimeNodes|[commands](#CommandsInIntegrationRuntimeNodes)|
|az synapse integration-runtime-credentials|IntegrationRuntimeCredentials|[commands](#CommandsInIntegrationRuntimeCredentials)|
|az synapse integration-runtime-connection-info|IntegrationRuntimeConnectionInfos|[commands](#CommandsInIntegrationRuntimeConnectionInfos)|
|az synapse integration-runtime-auth-key|IntegrationRuntimeAuthKeys|[commands](#CommandsInIntegrationRuntimeAuthKeys)|
|az synapse integration-runtime-monitoring-data|IntegrationRuntimeMonitoringData|[commands](#CommandsInIntegrationRuntimeMonitoringData)|
|az synapse integration-runtime-status|IntegrationRuntimeStatus|[commands](#CommandsInIntegrationRuntimeStatus)|
|az synapse private-link-resource|PrivateLinkResources|[commands](#CommandsInPrivateLinkResources)|
|az synapse private-endpoint-connection|PrivateEndpointConnections|[commands](#CommandsInPrivateEndpointConnections)|
|az synapse private-link-hub|PrivateLinkHubs|[commands](#CommandsInPrivateLinkHubs)|

## COMMANDS
### <a name="CommandsInBigDataPools">Commands in `az synapse big-data-pool` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse big-data-pool list](#BigDataPoolsListByWorkspace)|ListByWorkspace|[Parameters](#ParametersBigDataPoolsListByWorkspace)|[Example](#ExamplesBigDataPoolsListByWorkspace)|
|[az synapse big-data-pool show](#BigDataPoolsGet)|Get|[Parameters](#ParametersBigDataPoolsGet)|[Example](#ExamplesBigDataPoolsGet)|
|[az synapse big-data-pool create](#BigDataPoolsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersBigDataPoolsCreateOrUpdate#Create)|[Example](#ExamplesBigDataPoolsCreateOrUpdate#Create)|
|[az synapse big-data-pool update](#BigDataPoolsUpdate)|Update|[Parameters](#ParametersBigDataPoolsUpdate)|[Example](#ExamplesBigDataPoolsUpdate)|
|[az synapse big-data-pool delete](#BigDataPoolsDelete)|Delete|[Parameters](#ParametersBigDataPoolsDelete)|[Example](#ExamplesBigDataPoolsDelete)|

### <a name="CommandsInIntegrationRuntimes">Commands in `az synapse integration-runtime` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime list](#IntegrationRuntimesListByWorkspace)|ListByWorkspace|[Parameters](#ParametersIntegrationRuntimesListByWorkspace)|[Example](#ExamplesIntegrationRuntimesListByWorkspace)|
|[az synapse integration-runtime show](#IntegrationRuntimesGet)|Get|[Parameters](#ParametersIntegrationRuntimesGet)|[Example](#ExamplesIntegrationRuntimesGet)|
|[az synapse integration-runtime create](#IntegrationRuntimesCreate)|Create|[Parameters](#ParametersIntegrationRuntimesCreate)|[Example](#ExamplesIntegrationRuntimesCreate)|
|[az synapse integration-runtime update](#IntegrationRuntimesUpdate)|Update|[Parameters](#ParametersIntegrationRuntimesUpdate)|[Example](#ExamplesIntegrationRuntimesUpdate)|
|[az synapse integration-runtime delete](#IntegrationRuntimesDelete)|Delete|[Parameters](#ParametersIntegrationRuntimesDelete)|[Example](#ExamplesIntegrationRuntimesDelete)|
|[az synapse integration-runtime start](#IntegrationRuntimesStart)|Start|[Parameters](#ParametersIntegrationRuntimesStart)|[Example](#ExamplesIntegrationRuntimesStart)|
|[az synapse integration-runtime stop](#IntegrationRuntimesStop)|Stop|[Parameters](#ParametersIntegrationRuntimesStop)|[Example](#ExamplesIntegrationRuntimesStop)|
|[az synapse integration-runtime upgrade](#IntegrationRuntimesUpgrade)|Upgrade|[Parameters](#ParametersIntegrationRuntimesUpgrade)|[Example](#ExamplesIntegrationRuntimesUpgrade)|

### <a name="CommandsInIntegrationRuntimeAuthKeys">Commands in `az synapse integration-runtime-auth-key` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-auth-key list](#IntegrationRuntimeAuthKeysList)|List|[Parameters](#ParametersIntegrationRuntimeAuthKeysList)|[Example](#ExamplesIntegrationRuntimeAuthKeysList)|
|[az synapse integration-runtime-auth-key regenerate](#IntegrationRuntimeAuthKeysRegenerate)|Regenerate|[Parameters](#ParametersIntegrationRuntimeAuthKeysRegenerate)|[Example](#ExamplesIntegrationRuntimeAuthKeysRegenerate)|

### <a name="CommandsInIntegrationRuntimeConnectionInfos">Commands in `az synapse integration-runtime-connection-info` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-connection-info get](#IntegrationRuntimeConnectionInfosGet)|Get|[Parameters](#ParametersIntegrationRuntimeConnectionInfosGet)|[Example](#ExamplesIntegrationRuntimeConnectionInfosGet)|

### <a name="CommandsInIntegrationRuntimeCredentials">Commands in `az synapse integration-runtime-credentials` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-credentials sync](#IntegrationRuntimeCredentialsSync)|Sync|[Parameters](#ParametersIntegrationRuntimeCredentialsSync)|[Example](#ExamplesIntegrationRuntimeCredentialsSync)|

### <a name="CommandsInIntegrationRuntimeMonitoringData">Commands in `az synapse integration-runtime-monitoring-data` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-monitoring-data get](#IntegrationRuntimeMonitoringDataGet)|Get|[Parameters](#ParametersIntegrationRuntimeMonitoringDataGet)|[Example](#ExamplesIntegrationRuntimeMonitoringDataGet)|

### <a name="CommandsInIntegrationRuntimeNodes">Commands in `az synapse integration-runtime-node` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-node show](#IntegrationRuntimeNodesGet)|Get|[Parameters](#ParametersIntegrationRuntimeNodesGet)|[Example](#ExamplesIntegrationRuntimeNodesGet)|
|[az synapse integration-runtime-node update](#IntegrationRuntimeNodesUpdate)|Update|[Parameters](#ParametersIntegrationRuntimeNodesUpdate)|[Example](#ExamplesIntegrationRuntimeNodesUpdate)|
|[az synapse integration-runtime-node delete](#IntegrationRuntimeNodesDelete)|Delete|[Parameters](#ParametersIntegrationRuntimeNodesDelete)|[Example](#ExamplesIntegrationRuntimeNodesDelete)|

### <a name="CommandsInIntegrationRuntimeNodeIpAddress">Commands in `az synapse integration-runtime-node-ip-address` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-node-ip-address get](#IntegrationRuntimeNodeIpAddressGet)|Get|[Parameters](#ParametersIntegrationRuntimeNodeIpAddressGet)|[Example](#ExamplesIntegrationRuntimeNodeIpAddressGet)|

### <a name="CommandsInIntegrationRuntimeObjectMetadata">Commands in `az synapse integration-runtime-object-metadata` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-object-metadata get](#IntegrationRuntimeObjectMetadataGet)|Get|[Parameters](#ParametersIntegrationRuntimeObjectMetadataGet)|[Example](#ExamplesIntegrationRuntimeObjectMetadataGet)|
|[az synapse integration-runtime-object-metadata refresh](#IntegrationRuntimeObjectMetadataRefresh)|Refresh|[Parameters](#ParametersIntegrationRuntimeObjectMetadataRefresh)|[Example](#ExamplesIntegrationRuntimeObjectMetadataRefresh)|

### <a name="CommandsInIntegrationRuntimeStatus">Commands in `az synapse integration-runtime-status` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse integration-runtime-status get](#IntegrationRuntimeStatusGet)|Get|[Parameters](#ParametersIntegrationRuntimeStatusGet)|[Example](#ExamplesIntegrationRuntimeStatusGet)|

### <a name="CommandsInIpFirewallRules">Commands in `az synapse ip-firewall-rule` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse ip-firewall-rule list](#IpFirewallRulesListByWorkspace)|ListByWorkspace|[Parameters](#ParametersIpFirewallRulesListByWorkspace)|[Example](#ExamplesIpFirewallRulesListByWorkspace)|
|[az synapse ip-firewall-rule show](#IpFirewallRulesGet)|Get|[Parameters](#ParametersIpFirewallRulesGet)|[Example](#ExamplesIpFirewallRulesGet)|
|[az synapse ip-firewall-rule create](#IpFirewallRulesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersIpFirewallRulesCreateOrUpdate#Create)|[Example](#ExamplesIpFirewallRulesCreateOrUpdate#Create)|
|[az synapse ip-firewall-rule update](#IpFirewallRulesCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersIpFirewallRulesCreateOrUpdate#Update)|Not Found|
|[az synapse ip-firewall-rule delete](#IpFirewallRulesDelete)|Delete|[Parameters](#ParametersIpFirewallRulesDelete)|[Example](#ExamplesIpFirewallRulesDelete)|
|[az synapse ip-firewall-rule replace-all](#IpFirewallRulesReplaceAll)|ReplaceAll|[Parameters](#ParametersIpFirewallRulesReplaceAll)|[Example](#ExamplesIpFirewallRulesReplaceAll)|

### <a name="CommandsInOperations">Commands in `az synapse operation` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse operation get-azure-async-header-result](#OperationsGetAzureAsyncHeaderResult)|GetAzureAsyncHeaderResult|[Parameters](#ParametersOperationsGetAzureAsyncHeaderResult)|[Example](#ExamplesOperationsGetAzureAsyncHeaderResult)|
|[az synapse operation get-location-header-result](#OperationsGetLocationHeaderResult)|GetLocationHeaderResult|[Parameters](#ParametersOperationsGetLocationHeaderResult)|[Example](#ExamplesOperationsGetLocationHeaderResult)|

### <a name="CommandsInPrivateEndpointConnections">Commands in `az synapse private-endpoint-connection` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse private-endpoint-connection list](#PrivateEndpointConnectionsList)|List|[Parameters](#ParametersPrivateEndpointConnectionsList)|[Example](#ExamplesPrivateEndpointConnectionsList)|
|[az synapse private-endpoint-connection show](#PrivateEndpointConnectionsGet)|Get|[Parameters](#ParametersPrivateEndpointConnectionsGet)|[Example](#ExamplesPrivateEndpointConnectionsGet)|
|[az synapse private-endpoint-connection create](#PrivateEndpointConnectionsCreate)|Create|[Parameters](#ParametersPrivateEndpointConnectionsCreate)|[Example](#ExamplesPrivateEndpointConnectionsCreate)|
|[az synapse private-endpoint-connection delete](#PrivateEndpointConnectionsDelete)|Delete|[Parameters](#ParametersPrivateEndpointConnectionsDelete)|[Example](#ExamplesPrivateEndpointConnectionsDelete)|

### <a name="CommandsInPrivateLinkHubs">Commands in `az synapse private-link-hub` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse private-link-hub list](#PrivateLinkHubsListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersPrivateLinkHubsListByResourceGroup)|[Example](#ExamplesPrivateLinkHubsListByResourceGroup)|
|[az synapse private-link-hub list](#PrivateLinkHubsList)|List|[Parameters](#ParametersPrivateLinkHubsList)|[Example](#ExamplesPrivateLinkHubsList)|
|[az synapse private-link-hub show](#PrivateLinkHubsGet)|Get|[Parameters](#ParametersPrivateLinkHubsGet)|[Example](#ExamplesPrivateLinkHubsGet)|
|[az synapse private-link-hub create](#PrivateLinkHubsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersPrivateLinkHubsCreateOrUpdate#Create)|[Example](#ExamplesPrivateLinkHubsCreateOrUpdate#Create)|
|[az synapse private-link-hub update](#PrivateLinkHubsUpdate)|Update|[Parameters](#ParametersPrivateLinkHubsUpdate)|[Example](#ExamplesPrivateLinkHubsUpdate)|
|[az synapse private-link-hub delete](#PrivateLinkHubsDelete)|Delete|[Parameters](#ParametersPrivateLinkHubsDelete)|[Example](#ExamplesPrivateLinkHubsDelete)|

### <a name="CommandsInPrivateLinkResources">Commands in `az synapse private-link-resource` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse private-link-resource list](#PrivateLinkResourcesList)|List|[Parameters](#ParametersPrivateLinkResourcesList)|[Example](#ExamplesPrivateLinkResourcesList)|
|[az synapse private-link-resource show](#PrivateLinkResourcesGet)|Get|[Parameters](#ParametersPrivateLinkResourcesGet)|[Example](#ExamplesPrivateLinkResourcesGet)|

### <a name="CommandsInSqlPools">Commands in `az synapse sql-pool` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool list](#SqlPoolsListByWorkspace)|ListByWorkspace|[Parameters](#ParametersSqlPoolsListByWorkspace)|[Example](#ExamplesSqlPoolsListByWorkspace)|
|[az synapse sql-pool show](#SqlPoolsGet)|Get|[Parameters](#ParametersSqlPoolsGet)|[Example](#ExamplesSqlPoolsGet)|
|[az synapse sql-pool create](#SqlPoolsCreate)|Create|[Parameters](#ParametersSqlPoolsCreate)|[Example](#ExamplesSqlPoolsCreate)|
|[az synapse sql-pool update](#SqlPoolsUpdate)|Update|[Parameters](#ParametersSqlPoolsUpdate)|[Example](#ExamplesSqlPoolsUpdate)|
|[az synapse sql-pool delete](#SqlPoolsDelete)|Delete|[Parameters](#ParametersSqlPoolsDelete)|[Example](#ExamplesSqlPoolsDelete)|
|[az synapse sql-pool pause](#SqlPoolsPause)|Pause|[Parameters](#ParametersSqlPoolsPause)|[Example](#ExamplesSqlPoolsPause)|
|[az synapse sql-pool rename](#SqlPoolsRename)|Rename|[Parameters](#ParametersSqlPoolsRename)|[Example](#ExamplesSqlPoolsRename)|
|[az synapse sql-pool resume](#SqlPoolsResume)|Resume|[Parameters](#ParametersSqlPoolsResume)|[Example](#ExamplesSqlPoolsResume)|

### <a name="CommandsInSqlPoolBlobAuditingPolicies">Commands in `az synapse sql-pool-blob-auditing-policy` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-blob-auditing-policy show](#SqlPoolBlobAuditingPoliciesGet)|Get|[Parameters](#ParametersSqlPoolBlobAuditingPoliciesGet)|[Example](#ExamplesSqlPoolBlobAuditingPoliciesGet)|
|[az synapse sql-pool-blob-auditing-policy create](#SqlPoolBlobAuditingPoliciesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersSqlPoolBlobAuditingPoliciesCreateOrUpdate#Create)|[Example](#ExamplesSqlPoolBlobAuditingPoliciesCreateOrUpdate#Create)|
|[az synapse sql-pool-blob-auditing-policy update](#SqlPoolBlobAuditingPoliciesCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersSqlPoolBlobAuditingPoliciesCreateOrUpdate#Update)|Not Found|

### <a name="CommandsInSqlPoolConnectionPolicies">Commands in `az synapse sql-pool-connection-policy` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-connection-policy show](#SqlPoolConnectionPoliciesGet)|Get|[Parameters](#ParametersSqlPoolConnectionPoliciesGet)|[Example](#ExamplesSqlPoolConnectionPoliciesGet)|

### <a name="CommandsInSqlPoolDataWarehouseUserActivities">Commands in `az synapse sql-pool-data-warehouse-user-activity` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-data-warehouse-user-activity show](#SqlPoolDataWarehouseUserActivitiesGet)|Get|[Parameters](#ParametersSqlPoolDataWarehouseUserActivitiesGet)|[Example](#ExamplesSqlPoolDataWarehouseUserActivitiesGet)|

### <a name="CommandsInSqlPoolGeoBackupPolicies">Commands in `az synapse sql-pool-geo-backup-policy` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-geo-backup-policy show](#SqlPoolGeoBackupPoliciesGet)|Get|[Parameters](#ParametersSqlPoolGeoBackupPoliciesGet)|[Example](#ExamplesSqlPoolGeoBackupPoliciesGet)|

### <a name="CommandsInSqlPoolMetadataSyncConfigs">Commands in `az synapse sql-pool-metadata-sync-config` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-metadata-sync-config show](#SqlPoolMetadataSyncConfigsGet)|Get|[Parameters](#ParametersSqlPoolMetadataSyncConfigsGet)|[Example](#ExamplesSqlPoolMetadataSyncConfigsGet)|
|[az synapse sql-pool-metadata-sync-config create](#SqlPoolMetadataSyncConfigsCreate)|Create|[Parameters](#ParametersSqlPoolMetadataSyncConfigsCreate)|[Example](#ExamplesSqlPoolMetadataSyncConfigsCreate)|

### <a name="CommandsInSqlPoolOperations">Commands in `az synapse sql-pool-operation` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-operation list](#SqlPoolOperationsList)|List|[Parameters](#ParametersSqlPoolOperationsList)|[Example](#ExamplesSqlPoolOperationsList)|

### <a name="CommandsInSqlPoolOperationResults">Commands in `az synapse sql-pool-operation-result` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-operation-result get-location-header-result](#SqlPoolOperationResultsGetLocationHeaderResult)|GetLocationHeaderResult|[Parameters](#ParametersSqlPoolOperationResultsGetLocationHeaderResult)|[Example](#ExamplesSqlPoolOperationResultsGetLocationHeaderResult)|

### <a name="CommandsInSqlPoolReplicationLinks">Commands in `az synapse sql-pool-replication-link` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-replication-link list](#SqlPoolReplicationLinksList)|List|[Parameters](#ParametersSqlPoolReplicationLinksList)|[Example](#ExamplesSqlPoolReplicationLinksList)|

### <a name="CommandsInSqlPoolRestorePoints">Commands in `az synapse sql-pool-restore-point` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-restore-point list](#SqlPoolRestorePointsList)|List|[Parameters](#ParametersSqlPoolRestorePointsList)|[Example](#ExamplesSqlPoolRestorePointsList)|
|[az synapse sql-pool-restore-point create](#SqlPoolRestorePointsCreate)|Create|[Parameters](#ParametersSqlPoolRestorePointsCreate)|[Example](#ExamplesSqlPoolRestorePointsCreate)|

### <a name="CommandsInSqlPoolSchemas">Commands in `az synapse sql-pool-schema` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-schema list](#SqlPoolSchemasList)|List|[Parameters](#ParametersSqlPoolSchemasList)|[Example](#ExamplesSqlPoolSchemasList)|

### <a name="CommandsInSqlPoolSecurityAlertPolicies">Commands in `az synapse sql-pool-security-alert-policy` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-security-alert-policy show](#SqlPoolSecurityAlertPoliciesGet)|Get|[Parameters](#ParametersSqlPoolSecurityAlertPoliciesGet)|[Example](#ExamplesSqlPoolSecurityAlertPoliciesGet)|
|[az synapse sql-pool-security-alert-policy create](#SqlPoolSecurityAlertPoliciesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersSqlPoolSecurityAlertPoliciesCreateOrUpdate#Create)|[Example](#ExamplesSqlPoolSecurityAlertPoliciesCreateOrUpdate#Create)|
|[az synapse sql-pool-security-alert-policy update](#SqlPoolSecurityAlertPoliciesCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersSqlPoolSecurityAlertPoliciesCreateOrUpdate#Update)|Not Found|

### <a name="CommandsInSqlPoolSensitivityLabels">Commands in `az synapse sql-pool-sensitivity-label` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-sensitivity-label create](#SqlPoolSensitivityLabelsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersSqlPoolSensitivityLabelsCreateOrUpdate#Create)|[Example](#ExamplesSqlPoolSensitivityLabelsCreateOrUpdate#Create)|
|[az synapse sql-pool-sensitivity-label update](#SqlPoolSensitivityLabelsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersSqlPoolSensitivityLabelsCreateOrUpdate#Update)|Not Found|
|[az synapse sql-pool-sensitivity-label delete](#SqlPoolSensitivityLabelsDelete)|Delete|[Parameters](#ParametersSqlPoolSensitivityLabelsDelete)|[Example](#ExamplesSqlPoolSensitivityLabelsDelete)|
|[az synapse sql-pool-sensitivity-label disable-recommendation](#SqlPoolSensitivityLabelsDisableRecommendation)|DisableRecommendation|[Parameters](#ParametersSqlPoolSensitivityLabelsDisableRecommendation)|[Example](#ExamplesSqlPoolSensitivityLabelsDisableRecommendation)|
|[az synapse sql-pool-sensitivity-label enable-recommendation](#SqlPoolSensitivityLabelsEnableRecommendation)|EnableRecommendation|[Parameters](#ParametersSqlPoolSensitivityLabelsEnableRecommendation)|[Example](#ExamplesSqlPoolSensitivityLabelsEnableRecommendation)|
|[az synapse sql-pool-sensitivity-label list-current](#SqlPoolSensitivityLabelsListCurrent)|ListCurrent|[Parameters](#ParametersSqlPoolSensitivityLabelsListCurrent)|[Example](#ExamplesSqlPoolSensitivityLabelsListCurrent)|
|[az synapse sql-pool-sensitivity-label list-recommended](#SqlPoolSensitivityLabelsListRecommended)|ListRecommended|[Parameters](#ParametersSqlPoolSensitivityLabelsListRecommended)|[Example](#ExamplesSqlPoolSensitivityLabelsListRecommended)|

### <a name="CommandsInSqlPoolTables">Commands in `az synapse sql-pool-table` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-table list](#SqlPoolTablesListBySchema)|ListBySchema|[Parameters](#ParametersSqlPoolTablesListBySchema)|[Example](#ExamplesSqlPoolTablesListBySchema)|

### <a name="CommandsInSqlPoolTableColumns">Commands in `az synapse sql-pool-table-column` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-table-column list](#SqlPoolTableColumnsListByTableName)|ListByTableName|[Parameters](#ParametersSqlPoolTableColumnsListByTableName)|[Example](#ExamplesSqlPoolTableColumnsListByTableName)|

### <a name="CommandsInSqlPoolTransparentDataEncryptions">Commands in `az synapse sql-pool-transparent-data-encryption` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-transparent-data-encryption show](#SqlPoolTransparentDataEncryptionsGet)|Get|[Parameters](#ParametersSqlPoolTransparentDataEncryptionsGet)|[Example](#ExamplesSqlPoolTransparentDataEncryptionsGet)|
|[az synapse sql-pool-transparent-data-encryption create](#SqlPoolTransparentDataEncryptionsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersSqlPoolTransparentDataEncryptionsCreateOrUpdate#Create)|[Example](#ExamplesSqlPoolTransparentDataEncryptionsCreateOrUpdate#Create)|
|[az synapse sql-pool-transparent-data-encryption update](#SqlPoolTransparentDataEncryptionsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersSqlPoolTransparentDataEncryptionsCreateOrUpdate#Update)|Not Found|

### <a name="CommandsInSqlPoolUsages">Commands in `az synapse sql-pool-usage` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-usage list](#SqlPoolUsagesList)|List|[Parameters](#ParametersSqlPoolUsagesList)|[Example](#ExamplesSqlPoolUsagesList)|

### <a name="CommandsInSqlPoolVulnerabilityAssessments">Commands in `az synapse sql-pool-vulnerability-assessment` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-vulnerability-assessment list](#SqlPoolVulnerabilityAssessmentsList)|List|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentsList)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentsList)|
|[az synapse sql-pool-vulnerability-assessment show](#SqlPoolVulnerabilityAssessmentsGet)|Get|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentsGet)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentsGet)|
|[az synapse sql-pool-vulnerability-assessment create](#SqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create)|
|[az synapse sql-pool-vulnerability-assessment update](#SqlPoolVulnerabilityAssessmentsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Update)|Not Found|
|[az synapse sql-pool-vulnerability-assessment delete](#SqlPoolVulnerabilityAssessmentsDelete)|Delete|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentsDelete)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentsDelete)|

### <a name="CommandsInSqlPoolVulnerabilityAssessmentRuleBaselines">Commands in `az synapse sql-pool-vulnerability-assessment-rule-baseline` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-vulnerability-assessment-rule-baseline create](#SqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Create)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Create)|
|[az synapse sql-pool-vulnerability-assessment-rule-baseline update](#SqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Update)|Not Found|
|[az synapse sql-pool-vulnerability-assessment-rule-baseline delete](#SqlPoolVulnerabilityAssessmentRuleBaselinesDelete)|Delete|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentRuleBaselinesDelete)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentRuleBaselinesDelete)|

### <a name="CommandsInSqlPoolVulnerabilityAssessmentScans">Commands in `az synapse sql-pool-vulnerability-assessment-scan` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse sql-pool-vulnerability-assessment-scan list](#SqlPoolVulnerabilityAssessmentScansList)|List|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentScansList)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentScansList)|
|[az synapse sql-pool-vulnerability-assessment-scan export](#SqlPoolVulnerabilityAssessmentScansExport)|Export|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentScansExport)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentScansExport)|
|[az synapse sql-pool-vulnerability-assessment-scan initiate-scan](#SqlPoolVulnerabilityAssessmentScansInitiateScan)|InitiateScan|[Parameters](#ParametersSqlPoolVulnerabilityAssessmentScansInitiateScan)|[Example](#ExamplesSqlPoolVulnerabilityAssessmentScansInitiateScan)|

### <a name="CommandsInWorkspaces">Commands in `az synapse workspace` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse workspace list](#WorkspacesListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersWorkspacesListByResourceGroup)|[Example](#ExamplesWorkspacesListByResourceGroup)|
|[az synapse workspace list](#WorkspacesList)|List|[Parameters](#ParametersWorkspacesList)|[Example](#ExamplesWorkspacesList)|
|[az synapse workspace show](#WorkspacesGet)|Get|[Parameters](#ParametersWorkspacesGet)|[Example](#ExamplesWorkspacesGet)|
|[az synapse workspace create](#WorkspacesCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersWorkspacesCreateOrUpdate#Create)|[Example](#ExamplesWorkspacesCreateOrUpdate#Create)|
|[az synapse workspace update](#WorkspacesUpdate)|Update|[Parameters](#ParametersWorkspacesUpdate)|[Example](#ExamplesWorkspacesUpdate)|
|[az synapse workspace delete](#WorkspacesDelete)|Delete|[Parameters](#ParametersWorkspacesDelete)|[Example](#ExamplesWorkspacesDelete)|

### <a name="CommandsInWorkspaceAadAdmins">Commands in `az synapse workspace-aad-admin` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse workspace-aad-admin show](#WorkspaceAadAdminsGet)|Get|[Parameters](#ParametersWorkspaceAadAdminsGet)|[Example](#ExamplesWorkspaceAadAdminsGet)|
|[az synapse workspace-aad-admin create](#WorkspaceAadAdminsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersWorkspaceAadAdminsCreateOrUpdate#Create)|[Example](#ExamplesWorkspaceAadAdminsCreateOrUpdate#Create)|
|[az synapse workspace-aad-admin update](#WorkspaceAadAdminsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersWorkspaceAadAdminsCreateOrUpdate#Update)|Not Found|
|[az synapse workspace-aad-admin delete](#WorkspaceAadAdminsDelete)|Delete|[Parameters](#ParametersWorkspaceAadAdminsDelete)|[Example](#ExamplesWorkspaceAadAdminsDelete)|

### <a name="CommandsInWorkspaceManagedIdentitySqlControlSettings">Commands in `az synapse workspace-managed-identity-sql-control-setting` group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az synapse workspace-managed-identity-sql-control-setting show](#WorkspaceManagedIdentitySqlControlSettingsGet)|Get|[Parameters](#ParametersWorkspaceManagedIdentitySqlControlSettingsGet)|[Example](#ExamplesWorkspaceManagedIdentitySqlControlSettingsGet)|
|[az synapse workspace-managed-identity-sql-control-setting create](#WorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Create)|CreateOrUpdate#Create|[Parameters](#ParametersWorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Create)|[Example](#ExamplesWorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Create)|
|[az synapse workspace-managed-identity-sql-control-setting update](#WorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Update)|CreateOrUpdate#Update|[Parameters](#ParametersWorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Update)|Not Found|


## COMMAND DETAILS

### group `az synapse big-data-pool`
#### <a name="BigDataPoolsListByWorkspace">Command `az synapse big-data-pool list`</a>

##### <a name="ExamplesBigDataPoolsListByWorkspace">Example</a>
```
az synapse big-data-pool list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersBigDataPoolsListByWorkspace">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="BigDataPoolsGet">Command `az synapse big-data-pool show`</a>

##### <a name="ExamplesBigDataPoolsGet">Example</a>
```
az synapse big-data-pool show --name "ExamplePool" --resource-group "ExampleResourceGroup" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersBigDataPoolsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--big-data-pool-name**|string|Big Data pool name|big_data_pool_name|bigDataPoolName|

#### <a name="BigDataPoolsCreateOrUpdate#Create">Command `az synapse big-data-pool create`</a>

##### <a name="ExamplesBigDataPoolsCreateOrUpdate#Create">Example</a>
```
az synapse big-data-pool create --location "West US 2" --auto-pause delay-in-minutes=15 enabled=true --auto-scale \
enabled=true max-node-count=50 min-node-count=3 --default-spark-log-folder "/logs" --library-requirements content="" \
filename="requirements.txt" --node-count 4 --node-size "Medium" --node-size-family "MemoryOptimized" \
--spark-events-folder "/events" --spark-version "2.4" --tags key="value" --name "ExamplePool" --resource-group \
"ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersBigDataPoolsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--big-data-pool-name**|string|Big Data pool name|big_data_pool_name|bigDataPoolName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--force**|boolean|Whether to stop any running jobs in the Big Data pool|force|force|
|**--tags**|dictionary|Resource tags.|tags|tags|
|**--provisioning-state**|string|The state of the Big Data pool.|provisioning_state|provisioningState|
|**--auto-scale**|object|Auto-scaling properties|auto_scale|autoScale|
|**--creation-date**|date-time|The time when the Big Data pool was created.|creation_date|creationDate|
|**--auto-pause**|object|Auto-pausing properties|auto_pause|autoPause|
|**--spark-events-folder**|string|The Spark events folder|spark_events_folder|sparkEventsFolder|
|**--node-count**|integer|The number of nodes in the Big Data pool.|node_count|nodeCount|
|**--library-requirements**|object|Library version requirements|library_requirements|libraryRequirements|
|**--spark-version**|string|The Apache Spark version.|spark_version|sparkVersion|
|**--default-spark-log-folder**|string|The default folder where Spark logs will be written.|default_spark_log_folder|defaultSparkLogFolder|
|**--node-size**|choice|The level of compute power that each node in the Big Data pool has.|node_size|nodeSize|
|**--node-size-family**|choice|The kind of nodes that the Big Data pool provides.|node_size_family|nodeSizeFamily|

#### <a name="BigDataPoolsUpdate">Command `az synapse big-data-pool update`</a>

##### <a name="ExamplesBigDataPoolsUpdate">Example</a>
```
az synapse big-data-pool update --name "ExamplePool" --tags key="value" --resource-group "ExampleResourceGroup" \
--workspace-name "ExampleWorkspace"
```
##### <a name="ParametersBigDataPoolsUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--big-data-pool-name**|string|Big Data pool name|big_data_pool_name|bigDataPoolName|
|**--tags**|dictionary|Updated tags for the Big Data pool|tags|tags|

#### <a name="BigDataPoolsDelete">Command `az synapse big-data-pool delete`</a>

##### <a name="ExamplesBigDataPoolsDelete">Example</a>
```
az synapse big-data-pool delete --name "ExamplePool" --resource-group "ExampleResourceGroup" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersBigDataPoolsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--big-data-pool-name**|string|Big Data pool name|big_data_pool_name|bigDataPoolName|

### group `az synapse integration-runtime`
#### <a name="IntegrationRuntimesListByWorkspace">Command `az synapse integration-runtime list`</a>

##### <a name="ExamplesIntegrationRuntimesListByWorkspace">Example</a>
```
az synapse integration-runtime list --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesListByWorkspace">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="IntegrationRuntimesGet">Command `az synapse integration-runtime show`</a>

##### <a name="ExamplesIntegrationRuntimesGet">Example</a>
```
az synapse integration-runtime show --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
--workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--if-none-match**|string|ETag of the integration runtime entity. Should only be specified for get. If the ETag matches the existing entity tag, or if * was provided, then no content will be returned.|if_none_match|If-None-Match|

#### <a name="IntegrationRuntimesCreate">Command `az synapse integration-runtime create`</a>

##### <a name="ExamplesIntegrationRuntimesCreate">Example</a>
```
az synapse integration-runtime create --properties "{\\"type\\":\\"SelfHosted\\",\\"description\\":\\"A selfhosted \
integration runtime\\"}" --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" --workspace-name \
"exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--properties**|object|Integration runtime properties.|properties|properties|
|**--if-match**|string|ETag of the integration runtime entity. Should only be specified for update, for which it should match existing entity or can be * for unconditional update.|if_match|If-Match|

#### <a name="IntegrationRuntimesUpdate">Command `az synapse integration-runtime update`</a>

##### <a name="ExamplesIntegrationRuntimesUpdate">Example</a>
```
az synapse integration-runtime update --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
--auto-update "Off" --update-delay-offset "\\"PT3H\\"" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--auto-update**|choice|Enables or disables the auto-update feature of the self-hosted integration runtime. See https://go.microsoft.com/fwlink/?linkid=854189.|auto_update|autoUpdate|
|**--update-delay-offset**|string|The time offset (in hours) in the day, e.g., PT03H is 3 hours. The integration runtime auto update will happen on that time.|update_delay_offset|updateDelayOffset|

#### <a name="IntegrationRuntimesDelete">Command `az synapse integration-runtime delete`</a>

##### <a name="ExamplesIntegrationRuntimesDelete">Example</a>
```
az synapse integration-runtime delete --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
--workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesStart">Command `az synapse integration-runtime start`</a>

##### <a name="ExamplesIntegrationRuntimesStart">Example</a>
```
az synapse integration-runtime start --name "exampleManagedIntegrationRuntime" --resource-group "exampleResourceGroup" \
--workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesStart">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesStop">Command `az synapse integration-runtime stop`</a>

##### <a name="ExamplesIntegrationRuntimesStop">Example</a>
```
az synapse integration-runtime stop --name "exampleManagedIntegrationRuntime" --resource-group "exampleResourceGroup" \
--workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesStop">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimesUpgrade">Command `az synapse integration-runtime upgrade`</a>

##### <a name="ExamplesIntegrationRuntimesUpgrade">Example</a>
```
az synapse integration-runtime upgrade --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
--workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimesUpgrade">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

### group `az synapse integration-runtime-auth-key`
#### <a name="IntegrationRuntimeAuthKeysList">Command `az synapse integration-runtime-auth-key list`</a>

##### <a name="ExamplesIntegrationRuntimeAuthKeysList">Example</a>
```
az synapse integration-runtime-auth-key list --integration-runtime-name "exampleIntegrationRuntime" --resource-group \
"exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeAuthKeysList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

#### <a name="IntegrationRuntimeAuthKeysRegenerate">Command `az synapse integration-runtime-auth-key regenerate`</a>

##### <a name="ExamplesIntegrationRuntimeAuthKeysRegenerate">Example</a>
```
az synapse integration-runtime-auth-key regenerate --integration-runtime-name "exampleIntegrationRuntime" --key-name \
"authKey2" --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeAuthKeysRegenerate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--key-name**|choice|The name of the authentication key to regenerate.|key_name|keyName|

### group `az synapse integration-runtime-connection-info`
#### <a name="IntegrationRuntimeConnectionInfosGet">Command `az synapse integration-runtime-connection-info get`</a>

##### <a name="ExamplesIntegrationRuntimeConnectionInfosGet">Example</a>
```
az synapse integration-runtime-connection-info get --integration-runtime-name "exampleIntegrationRuntime" \
--resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeConnectionInfosGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

### group `az synapse integration-runtime-credentials`
#### <a name="IntegrationRuntimeCredentialsSync">Command `az synapse integration-runtime-credentials sync`</a>

##### <a name="ExamplesIntegrationRuntimeCredentialsSync">Example</a>
```
az synapse integration-runtime-credentials sync --integration-runtime-name "exampleIntegrationRuntime" \
--resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeCredentialsSync">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

### group `az synapse integration-runtime-monitoring-data`
#### <a name="IntegrationRuntimeMonitoringDataGet">Command `az synapse integration-runtime-monitoring-data get`</a>

##### <a name="ExamplesIntegrationRuntimeMonitoringDataGet">Example</a>
```
az synapse integration-runtime-monitoring-data get --integration-runtime-name "exampleIntegrationRuntime" \
--resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeMonitoringDataGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

### group `az synapse integration-runtime-node`
#### <a name="IntegrationRuntimeNodesGet">Command `az synapse integration-runtime-node show`</a>

##### <a name="ExamplesIntegrationRuntimeNodesGet">Example</a>
```
az synapse integration-runtime-node show --integration-runtime-name "exampleIntegrationRuntime" --node-name "Node_1" \
--resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeNodesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--node-name**|string|Integration runtime node name|node_name|nodeName|

#### <a name="IntegrationRuntimeNodesUpdate">Command `az synapse integration-runtime-node update`</a>

##### <a name="ExamplesIntegrationRuntimeNodesUpdate">Example</a>
```
az synapse integration-runtime-node update --integration-runtime-name "exampleIntegrationRuntime" --node-name "Node_1" \
--resource-group "exampleResourceGroup" --concurrent-jobs-limit 2 --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeNodesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--node-name**|string|Integration runtime node name|node_name|nodeName|
|**--concurrent-jobs-limit**|integer|The number of concurrent jobs permitted to run on the integration runtime node. Values between 1 and maxConcurrentJobs(inclusive) are allowed.|concurrent_jobs_limit|concurrentJobsLimit|

#### <a name="IntegrationRuntimeNodesDelete">Command `az synapse integration-runtime-node delete`</a>

##### <a name="ExamplesIntegrationRuntimeNodesDelete">Example</a>
```
az synapse integration-runtime-node delete --integration-runtime-name "exampleIntegrationRuntime" --node-name "Node_1" \
--resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeNodesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--node-name**|string|Integration runtime node name|node_name|nodeName|

### group `az synapse integration-runtime-node-ip-address`
#### <a name="IntegrationRuntimeNodeIpAddressGet">Command `az synapse integration-runtime-node-ip-address get`</a>

##### <a name="ExamplesIntegrationRuntimeNodeIpAddressGet">Example</a>
```
az synapse integration-runtime-node-ip-address get --integration-runtime-name "exampleIntegrationRuntime" --node-name \
"Node_1" --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeNodeIpAddressGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--node-name**|string|Integration runtime node name|node_name|nodeName|

### group `az synapse integration-runtime-object-metadata`
#### <a name="IntegrationRuntimeObjectMetadataGet">Command `az synapse integration-runtime-object-metadata get`</a>

##### <a name="ExamplesIntegrationRuntimeObjectMetadataGet">Example</a>
```
az synapse integration-runtime-object-metadata get --metadata-path "ssisFolders" --integration-runtime-name \
"testactivityv2" --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeObjectMetadataGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|
|**--metadata-path**|string|Metadata path.|metadata_path|metadataPath|

#### <a name="IntegrationRuntimeObjectMetadataRefresh">Command `az synapse integration-runtime-object-metadata refresh`</a>

##### <a name="ExamplesIntegrationRuntimeObjectMetadataRefresh">Example</a>
```
az synapse integration-runtime-object-metadata refresh --integration-runtime-name "testactivityv2" --resource-group \
"exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeObjectMetadataRefresh">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

### group `az synapse integration-runtime-status`
#### <a name="IntegrationRuntimeStatusGet">Command `az synapse integration-runtime-status get`</a>

##### <a name="ExamplesIntegrationRuntimeStatusGet">Example</a>
```
az synapse integration-runtime-status get --integration-runtime-name "exampleIntegrationRuntime" --resource-group \
"exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### <a name="ParametersIntegrationRuntimeStatusGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--integration-runtime-name**|string|Integration runtime name|integration_runtime_name|integrationRuntimeName|

### group `az synapse ip-firewall-rule`
#### <a name="IpFirewallRulesListByWorkspace">Command `az synapse ip-firewall-rule list`</a>

##### <a name="ExamplesIpFirewallRulesListByWorkspace">Example</a>
```
az synapse ip-firewall-rule list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersIpFirewallRulesListByWorkspace">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="IpFirewallRulesGet">Command `az synapse ip-firewall-rule show`</a>

##### <a name="ExamplesIpFirewallRulesGet">Example</a>
```
az synapse ip-firewall-rule show --resource-group "ExampleResourceGroup" --rule-name "ExampleIpFirewallRule" \
--workspace-name "ExampleWorkspace"
```
##### <a name="ParametersIpFirewallRulesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--rule-name**|string|The IP firewall rule name|rule_name|ruleName|

#### <a name="IpFirewallRulesCreateOrUpdate#Create">Command `az synapse ip-firewall-rule create`</a>

##### <a name="ExamplesIpFirewallRulesCreateOrUpdate#Create">Example</a>
```
az synapse ip-firewall-rule create --end-ip-address "10.0.0.254" --start-ip-address "10.0.0.0" --resource-group \
"ExampleResourceGroup" --rule-name "ExampleIpFirewallRule" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersIpFirewallRulesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--rule-name**|string|The IP firewall rule name|rule_name|ruleName|
|**--end-ip-address**|string|The end IP address of the firewall rule. Must be IPv4 format. Must be greater than or equal to startIpAddress|end_ip_address|endIpAddress|
|**--start-ip-address**|string|The start IP address of the firewall rule. Must be IPv4 format|start_ip_address|startIpAddress|

#### <a name="IpFirewallRulesCreateOrUpdate#Update">Command `az synapse ip-firewall-rule update`</a>

##### <a name="ParametersIpFirewallRulesCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--rule-name**|string|The IP firewall rule name|rule_name|ruleName|
|**--end-ip-address**|string|The end IP address of the firewall rule. Must be IPv4 format. Must be greater than or equal to startIpAddress|end_ip_address|endIpAddress|
|**--start-ip-address**|string|The start IP address of the firewall rule. Must be IPv4 format|start_ip_address|startIpAddress|

#### <a name="IpFirewallRulesDelete">Command `az synapse ip-firewall-rule delete`</a>

##### <a name="ExamplesIpFirewallRulesDelete">Example</a>
```
az synapse ip-firewall-rule delete --resource-group "ExampleResourceGroup" --rule-name "ExampleIpFirewallRule" \
--workspace-name "ExampleWorkspace"
```
##### <a name="ParametersIpFirewallRulesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--rule-name**|string|The IP firewall rule name|rule_name|ruleName|

#### <a name="IpFirewallRulesReplaceAll">Command `az synapse ip-firewall-rule replace-all`</a>

##### <a name="ExamplesIpFirewallRulesReplaceAll">Example</a>
```
az synapse ip-firewall-rule replace-all --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace" \
--ip-firewall-rules "{\\"AnotherExampleFirewallRule\\":{\\"endIpAddress\\":\\"10.0.1.254\\",\\"startIpAddress\\":\\"10.\
0.1.0\\"},\\"ExampleFirewallRule\\":{\\"endIpAddress\\":\\"10.0.0.254\\",\\"startIpAddress\\":\\"10.0.0.0\\"}}"
```
##### <a name="ParametersIpFirewallRulesReplaceAll">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--ip-firewall-rules**|dictionary|IP firewall rule properties|ip_firewall_rules|ipFirewallRules|

### group `az synapse operation`
#### <a name="OperationsGetAzureAsyncHeaderResult">Command `az synapse operation get-azure-async-header-result`</a>

##### <a name="ExamplesOperationsGetAzureAsyncHeaderResult">Example</a>
```
az synapse operation get-azure-async-header-result --operation-id "01234567-89ab-4def-0123-456789abcdef" \
--resource-group "resourceGroup1" --workspace-name "workspace1"
```
##### <a name="ParametersOperationsGetAzureAsyncHeaderResult">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--operation-id**|string|Operation ID|operation_id|operationId|

#### <a name="OperationsGetLocationHeaderResult">Command `az synapse operation get-location-header-result`</a>

##### <a name="ExamplesOperationsGetLocationHeaderResult">Example</a>
```
az synapse operation get-location-header-result --operation-id "01234567-89ab-4def-0123-456789abcdef" --resource-group \
"resourceGroup1" --workspace-name "workspace1"
```
##### <a name="ParametersOperationsGetLocationHeaderResult">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--operation-id**|string|Operation ID|operation_id|operationId|

### group `az synapse private-endpoint-connection`
#### <a name="PrivateEndpointConnectionsList">Command `az synapse private-endpoint-connection list`</a>

##### <a name="ExamplesPrivateEndpointConnectionsList">Example</a>
```
az synapse private-endpoint-connection list --resource-group "ExampleResourceGroup" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersPrivateEndpointConnectionsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="PrivateEndpointConnectionsGet">Command `az synapse private-endpoint-connection show`</a>

##### <a name="ExamplesPrivateEndpointConnectionsGet">Example</a>
```
az synapse private-endpoint-connection show --name "ExamplePrivateEndpointConnection" --resource-group \
"ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersPrivateEndpointConnectionsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--private-endpoint-connection-name**|string|The name of the private endpoint connection.|private_endpoint_connection_name|privateEndpointConnectionName|

#### <a name="PrivateEndpointConnectionsCreate">Command `az synapse private-endpoint-connection create`</a>

##### <a name="ExamplesPrivateEndpointConnectionsCreate">Example</a>
```
az synapse private-endpoint-connection create --name "ExamplePrivateEndpointConnection" --resource-group \
"ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersPrivateEndpointConnectionsCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--private-endpoint-connection-name**|string|The name of the private endpoint connection.|private_endpoint_connection_name|privateEndpointConnectionName|

#### <a name="PrivateEndpointConnectionsDelete">Command `az synapse private-endpoint-connection delete`</a>

##### <a name="ExamplesPrivateEndpointConnectionsDelete">Example</a>
```
az synapse private-endpoint-connection delete --name "ExamplePrivateEndpointConnection" --resource-group \
"ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersPrivateEndpointConnectionsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--private-endpoint-connection-name**|string|The name of the private endpoint connection.|private_endpoint_connection_name|privateEndpointConnectionName|

### group `az synapse private-link-hub`
#### <a name="PrivateLinkHubsListByResourceGroup">Command `az synapse private-link-hub list`</a>

##### <a name="ExamplesPrivateLinkHubsListByResourceGroup">Example</a>
```
az synapse private-link-hub list --resource-group "resourceGroup1"
```
##### <a name="ParametersPrivateLinkHubsListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|

#### <a name="PrivateLinkHubsList">Command `az synapse private-link-hub list`</a>

##### <a name="ExamplesPrivateLinkHubsList">Example</a>
```
az synapse private-link-hub list
```
##### <a name="ParametersPrivateLinkHubsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="PrivateLinkHubsGet">Command `az synapse private-link-hub show`</a>

##### <a name="ExamplesPrivateLinkHubsGet">Example</a>
```
az synapse private-link-hub show --name "privateLinkHub1" --resource-group "resourceGroup1"
```
##### <a name="ParametersPrivateLinkHubsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--private-link-hub-name**|string|The name of the privateLinkHub|private_link_hub_name|privateLinkHubName|

#### <a name="PrivateLinkHubsCreateOrUpdate#Create">Command `az synapse private-link-hub create`</a>

##### <a name="ExamplesPrivateLinkHubsCreateOrUpdate#Create">Example</a>
```
az synapse private-link-hub create --location "East US" --tags key="value" --name "privateLinkHub1" --resource-group \
"resourceGroup1"
```
##### <a name="ParametersPrivateLinkHubsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--private-link-hub-name**|string|The name of the privateLinkHub|private_link_hub_name|privateLinkHubName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags.|tags|tags|

#### <a name="PrivateLinkHubsUpdate">Command `az synapse private-link-hub update`</a>

##### <a name="ExamplesPrivateLinkHubsUpdate">Example</a>
```
az synapse private-link-hub update --name "privateLinkHub1" --tags key="value" --resource-group "resourceGroup1"
```
##### <a name="ParametersPrivateLinkHubsUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--private-link-hub-name**|string|The name of the privateLinkHub|private_link_hub_name|privateLinkHubName|
|**--tags**|dictionary|Resource tags|tags|tags|

#### <a name="PrivateLinkHubsDelete">Command `az synapse private-link-hub delete`</a>

##### <a name="ExamplesPrivateLinkHubsDelete">Example</a>
```
az synapse private-link-hub delete --name "privateLinkHub1" --resource-group "resourceGroup1"
```
##### <a name="ParametersPrivateLinkHubsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--private-link-hub-name**|string|The name of the privateLinkHub|private_link_hub_name|privateLinkHubName|

### group `az synapse private-link-resource`
#### <a name="PrivateLinkResourcesList">Command `az synapse private-link-resource list`</a>

##### <a name="ExamplesPrivateLinkResourcesList">Example</a>
```
az synapse private-link-resource list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersPrivateLinkResourcesList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="PrivateLinkResourcesGet">Command `az synapse private-link-resource show`</a>

##### <a name="ExamplesPrivateLinkResourcesGet">Example</a>
```
az synapse private-link-resource show --name "sql" --resource-group "ExampleResourceGroup" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersPrivateLinkResourcesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--private-link-resource-name**|string|The name of the private link resource|private_link_resource_name|privateLinkResourceName|

### group `az synapse sql-pool`
#### <a name="SqlPoolsListByWorkspace">Command `az synapse sql-pool list`</a>

##### <a name="ExamplesSqlPoolsListByWorkspace">Example</a>
```
az synapse sql-pool list --resource-group "sqlcrudtest-6845" --workspace-name "sqlcrudtest-7177"
```
##### <a name="ExamplesSqlPoolsListByWorkspace">Example</a>
```
az synapse sql-pool list --resource-group "sqlcrudtest-6845" --workspace-name "sqlcrudtest-7177"
```
##### <a name="ParametersSqlPoolsListByWorkspace">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="SqlPoolsGet">Command `az synapse sql-pool show`</a>

##### <a name="ExamplesSqlPoolsGet">Example</a>
```
az synapse sql-pool show --resource-group "sqlcrudtest-6852" --name "sqlcrudtest-9187" --workspace-name \
"sqlcrudtest-2080"
```
##### <a name="ParametersSqlPoolsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolsCreate">Command `az synapse sql-pool create`</a>

##### <a name="ExamplesSqlPoolsCreate">Example</a>
```
az synapse sql-pool create --resource-group "ExampleResourceGroup" --location "West US 2" --collation "" --create-mode \
"" --creation-date "1970-01-01T00:00:00.000Z" --max-size-bytes 0 --recoverable-database-id "" --restore-point-in-time \
"1970-01-01T00:00:00.000Z" --source-database-id "" --sku name="" tier="" --name "ExampleSqlPool" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersSqlPoolsCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags.|tags|tags|
|**--sku**|object|SQL pool SKU|sku|sku|
|**--max-size-bytes**|integer|Maximum size in bytes|max_size_bytes|maxSizeBytes|
|**--collation**|string|Collation mode|collation|collation|
|**--source-database-id**|string|Source database to create from|source_database_id|sourceDatabaseId|
|**--recoverable-database-id**|string|Backup database to restore from|recoverable_database_id|recoverableDatabaseId|
|**--provisioning-state**|string|Resource state|provisioning_state|provisioningState|
|**--status**|string|Resource status|status|status|
|**--restore-point-in-time**|date-time|Snapshot time to restore|restore_point_in_time|restorePointInTime|
|**--create-mode**|string|What is this?|create_mode|createMode|
|**--creation-date**|date-time|Date the SQL pool was created|creation_date|creationDate|

#### <a name="SqlPoolsUpdate">Command `az synapse sql-pool update`</a>

##### <a name="ExamplesSqlPoolsUpdate">Example</a>
```
az synapse sql-pool update --resource-group "ExampleResourceGroup" --location "West US 2" --collation "" --create-mode \
"" --creation-date "1970-01-01T00:00:00.000Z" --max-size-bytes 0 --recoverable-database-id "" --restore-point-in-time \
"1970-01-01T00:00:00.000Z" --source-database-id "" --sku name="" tier="" --name "ExampleSqlPool" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersSqlPoolsUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--tags**|dictionary|Resource tags.|tags|tags|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--sku**|object|SQL pool SKU|sku|sku|
|**--max-size-bytes**|integer|Maximum size in bytes|max_size_bytes|maxSizeBytes|
|**--collation**|string|Collation mode|collation|collation|
|**--source-database-id**|string|Source database to create from|source_database_id|sourceDatabaseId|
|**--recoverable-database-id**|string|Backup database to restore from|recoverable_database_id|recoverableDatabaseId|
|**--provisioning-state**|string|Resource state|provisioning_state|provisioningState|
|**--status**|string|Resource status|status|status|
|**--restore-point-in-time**|date-time|Snapshot time to restore|restore_point_in_time|restorePointInTime|
|**--create-mode**|string|What is this?|create_mode|createMode|
|**--creation-date**|date-time|Date the SQL pool was created|creation_date|creationDate|

#### <a name="SqlPoolsDelete">Command `az synapse sql-pool delete`</a>

##### <a name="ExamplesSqlPoolsDelete">Example</a>
```
az synapse sql-pool delete --resource-group "ExampleResourceGroup" --name "ExampleSqlPool" --workspace-name \
"ExampleWorkspace"
```
##### <a name="ParametersSqlPoolsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolsPause">Command `az synapse sql-pool pause`</a>

##### <a name="ExamplesSqlPoolsPause">Example</a>
```
az synapse sql-pool pause --resource-group "Default-SQL-SouthEastAsia" --name "testdwdb" --workspace-name "testsvr"
```
##### <a name="ParametersSqlPoolsPause">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolsRename">Command `az synapse sql-pool rename`</a>

##### <a name="ExamplesSqlPoolsRename">Example</a>
```
az synapse sql-pool rename --id "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/Default-SQL-SouthEa\
stAsia/providers/Microsoft.Synapse/workspaces/testsvr/sqlPools/newtestdb" --resource-group "Default-SQL-SouthEastAsia" \
--name "testdb" --workspace-name "testsvr"
```
##### <a name="ParametersSqlPoolsRename">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--id**|string|The target ID for the resource|id|id|

#### <a name="SqlPoolsResume">Command `az synapse sql-pool resume`</a>

##### <a name="ExamplesSqlPoolsResume">Example</a>
```
az synapse sql-pool resume --resource-group "sqlcrudtest-6852" --name "sqlcrudtest-9187" --workspace-name \
"sqlcrudtest-2080"
```
##### <a name="ParametersSqlPoolsResume">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-blob-auditing-policy`
#### <a name="SqlPoolBlobAuditingPoliciesGet">Command `az synapse sql-pool-blob-auditing-policy show`</a>

##### <a name="ExamplesSqlPoolBlobAuditingPoliciesGet">Example</a>
```
az synapse sql-pool-blob-auditing-policy show --resource-group "blobauditingtest-6852" --sql-pool-name "testdb" \
--workspace-name "blobauditingtest-2080"
```
##### <a name="ParametersSqlPoolBlobAuditingPoliciesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolBlobAuditingPoliciesCreateOrUpdate#Create">Command `az synapse sql-pool-blob-auditing-policy create`</a>

##### <a name="ExamplesSqlPoolBlobAuditingPoliciesCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-blob-auditing-policy create --audit-actions-and-groups "DATABASE_LOGOUT_GROUP" \
--audit-actions-and-groups "DATABASE_ROLE_MEMBER_CHANGE_GROUP" --audit-actions-and-groups "UPDATE on \
database::TestDatabaseName by public" --is-azure-monitor-target-enabled true --is-storage-secondary-key-in-use false \
--retention-days 6 --state "Enabled" --storage-account-access-key "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdk\
fD2342309432849328476458/3RSD==" --storage-account-subscription-id "00000000-1234-0000-5678-000000000000" \
--storage-endpoint "https://mystorage.blob.core.windows.net" --resource-group "blobauditingtest-4799" --sql-pool-name \
"testdb" --workspace-name "blobauditingtest-6440"
```
##### <a name="ExamplesSqlPoolBlobAuditingPoliciesCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-blob-auditing-policy create --state "Enabled" --storage-account-access-key \
"sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdkfD2342309432849328476458/3RSD==" --storage-endpoint \
"https://mystorage.blob.core.windows.net" --resource-group "blobauditingtest-4799" --sql-pool-name "testdb" \
--workspace-name "blobauditingtest-6440"
```
##### <a name="ParametersSqlPoolBlobAuditingPoliciesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--state**|sealed-choice|Specifies the state of the policy. If state is Enabled, storageEndpoint or isAzureMonitorTargetEnabled are required.|state|state|
|**--storage-endpoint**|string|Specifies the blob storage endpoint (e.g. https://MyAccount.blob.core.windows.net). If state is Enabled, storageEndpoint is required.|storage_endpoint|storageEndpoint|
|**--storage-account-access-key**|string|Specifies the identifier key of the auditing storage account. If state is Enabled and storageEndpoint is specified, storageAccountAccessKey is required.|storage_account_access_key|storageAccountAccessKey|
|**--retention-days**|integer|Specifies the number of days to keep in the audit logs in the storage account.|retention_days|retentionDays|
|**--audit-actions-and-groups**|array|Specifies the Actions-Groups and Actions to audit.  The recommended set of action groups to use is the following combination - this will audit all the queries and stored procedures executed against the database, as well as successful and failed logins:  BATCH_COMPLETED_GROUP, SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP, FAILED_DATABASE_AUTHENTICATION_GROUP.  This above combination is also the set that is configured by default when enabling auditing from the Azure portal.  The supported action groups to audit are (note: choose only specific groups that cover your auditing needs. Using unnecessary groups could lead to very large quantities of audit records):  APPLICATION_ROLE_CHANGE_PASSWORD_GROUP BACKUP_RESTORE_GROUP DATABASE_LOGOUT_GROUP DATABASE_OBJECT_CHANGE_GROUP DATABASE_OBJECT_OWNERSHIP_CHANGE_GROUP DATABASE_OBJECT_PERMISSION_CHANGE_GROUP DATABASE_OPERATION_GROUP DATABASE_PERMISSION_CHANGE_GROUP DATABASE_PRINCIPAL_CHANGE_GROUP DATABASE_PRINCIPAL_IMPERSONATION_GROUP DATABASE_ROLE_MEMBER_CHANGE_GROUP FAILED_DATABASE_AUTHENTICATION_GROUP SCHEMA_OBJECT_ACCESS_GROUP SCHEMA_OBJECT_CHANGE_GROUP SCHEMA_OBJECT_OWNERSHIP_CHANGE_GROUP SCHEMA_OBJECT_PERMISSION_CHANGE_GROUP SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP USER_CHANGE_PASSWORD_GROUP BATCH_STARTED_GROUP BATCH_COMPLETED_GROUP  These are groups that cover all sql statements and stored procedures executed against the database, and should not be used in combination with other groups as this will result in duplicate audit logs.  For more information, see [Database-Level Audit Action Groups](https://docs.microsoft.com/en-us/sql/relational-databases/security/auditing/sql-server-audit-action-groups-and-actions#database-level-audit-action-groups).  For Database auditing policy, specific Actions can also be specified (note that Actions cannot be specified for Server auditing policy). The supported actions to audit are: SELECT UPDATE INSERT DELETE EXECUTE RECEIVE REFERENCES  The general form for defining an action to be audited is: {action} ON {object} BY {principal}  Note that <object> in the above format can refer to an object like a table, view, or stored procedure, or an entire database or schema. For the latter cases, the forms DATABASE::{db_name} and SCHEMA::{schema_name} are used, respectively.  For example: SELECT on dbo.myTable by public SELECT on DATABASE::myDatabase by public SELECT on SCHEMA::mySchema by public  For more information, see [Database-Level Audit Actions](https://docs.microsoft.com/en-us/sql/relational-databases/security/auditing/sql-server-audit-action-groups-and-actions#database-level-audit-actions)|audit_actions_and_groups|auditActionsAndGroups|
|**--storage-account-subscription-id**|uuid|Specifies the blob storage subscription Id.|storage_account_subscription_id|storageAccountSubscriptionId|
|**--is-storage-secondary-key-in-use**|boolean|Specifies whether storageAccountAccessKey value is the storage's secondary key.|is_storage_secondary_key_in_use|isStorageSecondaryKeyInUse|
|**--is-azure-monitor-target-enabled**|boolean|Specifies whether audit events are sent to Azure Monitor.  In order to send the events to Azure Monitor, specify 'state' as 'Enabled' and 'isAzureMonitorTargetEnabled' as true.  When using REST API to configure auditing, Diagnostic Settings with 'SQLSecurityAuditEvents' diagnostic logs category on the database should be also created. Note that for server level audit you should use the 'master' database as {databaseName}.  Diagnostic Settings URI format: PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Sql/servers/{serverName}/databases/{databaseName}/providers/microsoft.insights/diagnosticSettings/{settingsName}?api-version=2017-05-01-preview  For more information, see [Diagnostic Settings REST API](https://go.microsoft.com/fwlink/?linkid=2033207) or [Diagnostic Settings PowerShell](https://go.microsoft.com/fwlink/?linkid=2033043) |is_azure_monitor_target_enabled|isAzureMonitorTargetEnabled|

#### <a name="SqlPoolBlobAuditingPoliciesCreateOrUpdate#Update">Command `az synapse sql-pool-blob-auditing-policy update`</a>

##### <a name="ParametersSqlPoolBlobAuditingPoliciesCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--state**|sealed-choice|Specifies the state of the policy. If state is Enabled, storageEndpoint or isAzureMonitorTargetEnabled are required.|state|state|
|**--storage-endpoint**|string|Specifies the blob storage endpoint (e.g. https://MyAccount.blob.core.windows.net). If state is Enabled, storageEndpoint is required.|storage_endpoint|storageEndpoint|
|**--storage-account-access-key**|string|Specifies the identifier key of the auditing storage account. If state is Enabled and storageEndpoint is specified, storageAccountAccessKey is required.|storage_account_access_key|storageAccountAccessKey|
|**--retention-days**|integer|Specifies the number of days to keep in the audit logs in the storage account.|retention_days|retentionDays|
|**--audit-actions-and-groups**|array|Specifies the Actions-Groups and Actions to audit.  The recommended set of action groups to use is the following combination - this will audit all the queries and stored procedures executed against the database, as well as successful and failed logins:  BATCH_COMPLETED_GROUP, SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP, FAILED_DATABASE_AUTHENTICATION_GROUP.  This above combination is also the set that is configured by default when enabling auditing from the Azure portal.  The supported action groups to audit are (note: choose only specific groups that cover your auditing needs. Using unnecessary groups could lead to very large quantities of audit records):  APPLICATION_ROLE_CHANGE_PASSWORD_GROUP BACKUP_RESTORE_GROUP DATABASE_LOGOUT_GROUP DATABASE_OBJECT_CHANGE_GROUP DATABASE_OBJECT_OWNERSHIP_CHANGE_GROUP DATABASE_OBJECT_PERMISSION_CHANGE_GROUP DATABASE_OPERATION_GROUP DATABASE_PERMISSION_CHANGE_GROUP DATABASE_PRINCIPAL_CHANGE_GROUP DATABASE_PRINCIPAL_IMPERSONATION_GROUP DATABASE_ROLE_MEMBER_CHANGE_GROUP FAILED_DATABASE_AUTHENTICATION_GROUP SCHEMA_OBJECT_ACCESS_GROUP SCHEMA_OBJECT_CHANGE_GROUP SCHEMA_OBJECT_OWNERSHIP_CHANGE_GROUP SCHEMA_OBJECT_PERMISSION_CHANGE_GROUP SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP USER_CHANGE_PASSWORD_GROUP BATCH_STARTED_GROUP BATCH_COMPLETED_GROUP  These are groups that cover all sql statements and stored procedures executed against the database, and should not be used in combination with other groups as this will result in duplicate audit logs.  For more information, see [Database-Level Audit Action Groups](https://docs.microsoft.com/en-us/sql/relational-databases/security/auditing/sql-server-audit-action-groups-and-actions#database-level-audit-action-groups).  For Database auditing policy, specific Actions can also be specified (note that Actions cannot be specified for Server auditing policy). The supported actions to audit are: SELECT UPDATE INSERT DELETE EXECUTE RECEIVE REFERENCES  The general form for defining an action to be audited is: {action} ON {object} BY {principal}  Note that <object> in the above format can refer to an object like a table, view, or stored procedure, or an entire database or schema. For the latter cases, the forms DATABASE::{db_name} and SCHEMA::{schema_name} are used, respectively.  For example: SELECT on dbo.myTable by public SELECT on DATABASE::myDatabase by public SELECT on SCHEMA::mySchema by public  For more information, see [Database-Level Audit Actions](https://docs.microsoft.com/en-us/sql/relational-databases/security/auditing/sql-server-audit-action-groups-and-actions#database-level-audit-actions)|audit_actions_and_groups|auditActionsAndGroups|
|**--storage-account-subscription-id**|uuid|Specifies the blob storage subscription Id.|storage_account_subscription_id|storageAccountSubscriptionId|
|**--is-storage-secondary-key-in-use**|boolean|Specifies whether storageAccountAccessKey value is the storage's secondary key.|is_storage_secondary_key_in_use|isStorageSecondaryKeyInUse|
|**--is-azure-monitor-target-enabled**|boolean|Specifies whether audit events are sent to Azure Monitor.  In order to send the events to Azure Monitor, specify 'state' as 'Enabled' and 'isAzureMonitorTargetEnabled' as true.  When using REST API to configure auditing, Diagnostic Settings with 'SQLSecurityAuditEvents' diagnostic logs category on the database should be also created. Note that for server level audit you should use the 'master' database as {databaseName}.  Diagnostic Settings URI format: PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Sql/servers/{serverName}/databases/{databaseName}/providers/microsoft.insights/diagnosticSettings/{settingsName}?api-version=2017-05-01-preview  For more information, see [Diagnostic Settings REST API](https://go.microsoft.com/fwlink/?linkid=2033207) or [Diagnostic Settings PowerShell](https://go.microsoft.com/fwlink/?linkid=2033043) |is_azure_monitor_target_enabled|isAzureMonitorTargetEnabled|

### group `az synapse sql-pool-connection-policy`
#### <a name="SqlPoolConnectionPoliciesGet">Command `az synapse sql-pool-connection-policy show`</a>

##### <a name="ExamplesSqlPoolConnectionPoliciesGet">Example</a>
```
az synapse sql-pool-connection-policy show --resource-group "blobauditingtest-6852" --sql-pool-name "testdb" \
--workspace-name "blobauditingtest-2080"
```
##### <a name="ParametersSqlPoolConnectionPoliciesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-data-warehouse-user-activity`
#### <a name="SqlPoolDataWarehouseUserActivitiesGet">Command `az synapse sql-pool-data-warehouse-user-activity show`</a>

##### <a name="ExamplesSqlPoolDataWarehouseUserActivitiesGet">Example</a>
```
az synapse sql-pool-data-warehouse-user-activity show --resource-group "Default-SQL-SouthEastAsia" --sql-pool-name \
"testdb" --workspace-name "testsvr"
```
##### <a name="ParametersSqlPoolDataWarehouseUserActivitiesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-geo-backup-policy`
#### <a name="SqlPoolGeoBackupPoliciesGet">Command `az synapse sql-pool-geo-backup-policy show`</a>

##### <a name="ExamplesSqlPoolGeoBackupPoliciesGet">Example</a>
```
az synapse sql-pool-geo-backup-policy show --resource-group "sqlcrudtest-4799" --sql-pool-name "testdw" \
--workspace-name "sqlcrudtest-5961"
```
##### <a name="ParametersSqlPoolGeoBackupPoliciesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-metadata-sync-config`
#### <a name="SqlPoolMetadataSyncConfigsGet">Command `az synapse sql-pool-metadata-sync-config show`</a>

##### <a name="ExamplesSqlPoolMetadataSyncConfigsGet">Example</a>
```
az synapse sql-pool-metadata-sync-config show --resource-group "ExampleResourceGroup" --sql-pool-name "ExampleSqlPool" \
--workspace-name "ExampleWorkspace"
```
##### <a name="ParametersSqlPoolMetadataSyncConfigsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolMetadataSyncConfigsCreate">Command `az synapse sql-pool-metadata-sync-config create`</a>

##### <a name="ExamplesSqlPoolMetadataSyncConfigsCreate">Example</a>
```
az synapse sql-pool-metadata-sync-config create --enabled true --resource-group "ExampleResourceGroup" --sql-pool-name \
"ExampleSqlPool" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersSqlPoolMetadataSyncConfigsCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--enabled**|boolean|Indicates whether the metadata sync is enabled or disabled|enabled|enabled|

### group `az synapse sql-pool-operation`
#### <a name="SqlPoolOperationsList">Command `az synapse sql-pool-operation list`</a>

##### <a name="ExamplesSqlPoolOperationsList">Example</a>
```
az synapse sql-pool-operation list --resource-group "sqlcrudtest-7398" --sql-pool-name "testdb" --workspace-name \
"sqlcrudtest-4645"
```
##### <a name="ParametersSqlPoolOperationsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-operation-result`
#### <a name="SqlPoolOperationResultsGetLocationHeaderResult">Command `az synapse sql-pool-operation-result get-location-header-result`</a>

##### <a name="ExamplesSqlPoolOperationResultsGetLocationHeaderResult">Example</a>
```
az synapse sql-pool-operation-result get-location-header-result --operation-id "fedcba98-7654-4210-fedc-ba9876543210" \
--resource-group "ExampleResourceGroup" --sql-pool-name "ExampleSqlPool" --workspace-name "ExampleWorkspace"
```
##### <a name="ParametersSqlPoolOperationResultsGetLocationHeaderResult">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--operation-id**|string|Operation ID|operation_id|operationId|

### group `az synapse sql-pool-replication-link`
#### <a name="SqlPoolReplicationLinksList">Command `az synapse sql-pool-replication-link list`</a>

##### <a name="ExamplesSqlPoolReplicationLinksList">Example</a>
```
az synapse sql-pool-replication-link list --resource-group "sqlcrudtest-4799" --sql-pool-name "testdb" \
--workspace-name "sqlcrudtest-6440"
```
##### <a name="ParametersSqlPoolReplicationLinksList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-restore-point`
#### <a name="SqlPoolRestorePointsList">Command `az synapse sql-pool-restore-point list`</a>

##### <a name="ExamplesSqlPoolRestorePointsList">Example</a>
```
az synapse sql-pool-restore-point list --resource-group "Default-SQL-SouthEastAsia" --sql-pool-name "testDatabase" \
--workspace-name "testserver"
```
##### <a name="ParametersSqlPoolRestorePointsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolRestorePointsCreate">Command `az synapse sql-pool-restore-point create`</a>

##### <a name="ExamplesSqlPoolRestorePointsCreate">Example</a>
```
az synapse sql-pool-restore-point create --restore-point-label "mylabel" --resource-group "Default-SQL-SouthEastAsia" \
--sql-pool-name "testDatabase" --workspace-name "testserver"
```
##### <a name="ParametersSqlPoolRestorePointsCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--restore-point-label**|string|The restore point label to apply|restore_point_label|restorePointLabel|

### group `az synapse sql-pool-schema`
#### <a name="SqlPoolSchemasList">Command `az synapse sql-pool-schema list`</a>

##### <a name="ExamplesSqlPoolSchemasList">Example</a>
```
az synapse sql-pool-schema list --resource-group "myRG" --sql-pool-name "myDatabase" --workspace-name "serverName"
```
##### <a name="ParametersSqlPoolSchemasList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--filter**|string|An OData filter expression that filters elements in the collection.|filter|$filter|

### group `az synapse sql-pool-security-alert-policy`
#### <a name="SqlPoolSecurityAlertPoliciesGet">Command `az synapse sql-pool-security-alert-policy show`</a>

##### <a name="ExamplesSqlPoolSecurityAlertPoliciesGet">Example</a>
```
az synapse sql-pool-security-alert-policy show --resource-group "securityalert-6852" --sql-pool-name "testdb" \
--workspace-name "securityalert-2080"
```
##### <a name="ParametersSqlPoolSecurityAlertPoliciesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolSecurityAlertPoliciesCreateOrUpdate#Create">Command `az synapse sql-pool-security-alert-policy create`</a>

##### <a name="ExamplesSqlPoolSecurityAlertPoliciesCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-security-alert-policy create --disabled-alerts "Sql_Injection" --disabled-alerts "Usage_Anomaly" \
--email-account-admins true --email-addresses "test@microsoft.com" --email-addresses "user@microsoft.com" \
--retention-days 6 --state "Enabled" --storage-account-access-key "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdk\
fD2342309432849328476458/3RSD==" --storage-endpoint "https://mystorage.blob.core.windows.net" --resource-group \
"securityalert-4799" --sql-pool-name "testdb" --workspace-name "securityalert-6440"
```
##### <a name="ExamplesSqlPoolSecurityAlertPoliciesCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-security-alert-policy create --state "Enabled" --resource-group "securityalert-4799" \
--sql-pool-name "testdb" --workspace-name "securityalert-6440"
```
##### <a name="ParametersSqlPoolSecurityAlertPoliciesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--state**|sealed-choice|Specifies the state of the policy, whether it is enabled or disabled or a policy has not been applied yet on the specific Sql pool.|state|state|
|**--disabled-alerts**|array|Specifies an array of alerts that are disabled. Allowed values are: Sql_Injection, Sql_Injection_Vulnerability, Access_Anomaly, Data_Exfiltration, Unsafe_Action|disabled_alerts|disabledAlerts|
|**--email-addresses**|array|Specifies an array of e-mail addresses to which the alert is sent.|email_addresses|emailAddresses|
|**--email-account-admins**|boolean|Specifies that the alert is sent to the account administrators.|email_account_admins|emailAccountAdmins|
|**--storage-endpoint**|string|Specifies the blob storage endpoint (e.g. https://MyAccount.blob.core.windows.net). This blob storage will hold all Threat Detection audit logs.|storage_endpoint|storageEndpoint|
|**--storage-account-access-key**|string|Specifies the identifier key of the Threat Detection audit storage account.|storage_account_access_key|storageAccountAccessKey|
|**--retention-days**|integer|Specifies the number of days to keep in the Threat Detection audit logs.|retention_days|retentionDays|

#### <a name="SqlPoolSecurityAlertPoliciesCreateOrUpdate#Update">Command `az synapse sql-pool-security-alert-policy update`</a>

##### <a name="ParametersSqlPoolSecurityAlertPoliciesCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--state**|sealed-choice|Specifies the state of the policy, whether it is enabled or disabled or a policy has not been applied yet on the specific Sql pool.|state|state|
|**--disabled-alerts**|array|Specifies an array of alerts that are disabled. Allowed values are: Sql_Injection, Sql_Injection_Vulnerability, Access_Anomaly, Data_Exfiltration, Unsafe_Action|disabled_alerts|disabledAlerts|
|**--email-addresses**|array|Specifies an array of e-mail addresses to which the alert is sent.|email_addresses|emailAddresses|
|**--email-account-admins**|boolean|Specifies that the alert is sent to the account administrators.|email_account_admins|emailAccountAdmins|
|**--storage-endpoint**|string|Specifies the blob storage endpoint (e.g. https://MyAccount.blob.core.windows.net). This blob storage will hold all Threat Detection audit logs.|storage_endpoint|storageEndpoint|
|**--storage-account-access-key**|string|Specifies the identifier key of the Threat Detection audit storage account.|storage_account_access_key|storageAccountAccessKey|
|**--retention-days**|integer|Specifies the number of days to keep in the Threat Detection audit logs.|retention_days|retentionDays|

### group `az synapse sql-pool-sensitivity-label`
#### <a name="SqlPoolSensitivityLabelsCreateOrUpdate#Create">Command `az synapse sql-pool-sensitivity-label create`</a>

##### <a name="ExamplesSqlPoolSensitivityLabelsCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-sensitivity-label create --column-name "myColumn" --information-type "PhoneNumber" \
--information-type-id "d22fa6e9-5ee4-3bde-4c2b-a409604c4646" --label-id "bf91e08c-f4f0-478a-b016-25164b2a65ff" \
--label-name "PII" --resource-group "myRG" --schema-name "dbo" --sql-pool-name "myDatabase" --table-name "myTable" \
--workspace-name "myServer"
```
##### <a name="ParametersSqlPoolSensitivityLabelsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--table-name**|string|The name of the table.|table_name|tableName|
|**--column-name**|string|The name of the column.|column_name|columnName|
|**--label-name**|string|The label name.|label_name|labelName|
|**--label-id**|string|The label ID.|label_id|labelId|
|**--information-type**|string|The information type.|information_type|informationType|
|**--information-type-id**|string|The information type ID.|information_type_id|informationTypeId|

#### <a name="SqlPoolSensitivityLabelsCreateOrUpdate#Update">Command `az synapse sql-pool-sensitivity-label update`</a>

##### <a name="ParametersSqlPoolSensitivityLabelsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--table-name**|string|The name of the table.|table_name|tableName|
|**--column-name**|string|The name of the column.|column_name|columnName|
|**--label-name**|string|The label name.|label_name|labelName|
|**--label-id**|string|The label ID.|label_id|labelId|
|**--information-type**|string|The information type.|information_type|informationType|
|**--information-type-id**|string|The information type ID.|information_type_id|informationTypeId|

#### <a name="SqlPoolSensitivityLabelsDelete">Command `az synapse sql-pool-sensitivity-label delete`</a>

##### <a name="ExamplesSqlPoolSensitivityLabelsDelete">Example</a>
```
az synapse sql-pool-sensitivity-label delete --column-name "myColumn" --resource-group "myRG" --schema-name "dbo" \
--sql-pool-name "myDatabase" --table-name "myTable" --workspace-name "myServer"
```
##### <a name="ParametersSqlPoolSensitivityLabelsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--table-name**|string|The name of the table.|table_name|tableName|
|**--column-name**|string|The name of the column.|column_name|columnName|

#### <a name="SqlPoolSensitivityLabelsDisableRecommendation">Command `az synapse sql-pool-sensitivity-label disable-recommendation`</a>

##### <a name="ExamplesSqlPoolSensitivityLabelsDisableRecommendation">Example</a>
```
az synapse sql-pool-sensitivity-label disable-recommendation --column-name "myColumn" --resource-group "myRG" \
--schema-name "dbo" --sql-pool-name "myDatabase" --table-name "myTable" --workspace-name "myServer"
```
##### <a name="ParametersSqlPoolSensitivityLabelsDisableRecommendation">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--table-name**|string|The name of the table.|table_name|tableName|
|**--column-name**|string|The name of the column.|column_name|columnName|

#### <a name="SqlPoolSensitivityLabelsEnableRecommendation">Command `az synapse sql-pool-sensitivity-label enable-recommendation`</a>

##### <a name="ExamplesSqlPoolSensitivityLabelsEnableRecommendation">Example</a>
```
az synapse sql-pool-sensitivity-label enable-recommendation --column-name "myColumn" --resource-group "myRG" \
--schema-name "dbo" --sql-pool-name "myDatabase" --table-name "myTable" --workspace-name "myServer"
```
##### <a name="ParametersSqlPoolSensitivityLabelsEnableRecommendation">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--table-name**|string|The name of the table.|table_name|tableName|
|**--column-name**|string|The name of the column.|column_name|columnName|

#### <a name="SqlPoolSensitivityLabelsListCurrent">Command `az synapse sql-pool-sensitivity-label list-current`</a>

##### <a name="ExamplesSqlPoolSensitivityLabelsListCurrent">Example</a>
```
az synapse sql-pool-sensitivity-label list-current --resource-group "myRG" --sql-pool-name "myDatabase" \
--workspace-name "myServer"
```
##### <a name="ParametersSqlPoolSensitivityLabelsListCurrent">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--filter**|string|An OData filter expression that filters elements in the collection.|filter|$filter|

#### <a name="SqlPoolSensitivityLabelsListRecommended">Command `az synapse sql-pool-sensitivity-label list-recommended`</a>

##### <a name="ExamplesSqlPoolSensitivityLabelsListRecommended">Example</a>
```
az synapse sql-pool-sensitivity-label list-recommended --resource-group "myRG" --sql-pool-name "myDatabase" \
--workspace-name "myServer"
```
##### <a name="ParametersSqlPoolSensitivityLabelsListRecommended">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--include-disabled-recommendations**|boolean|Specifies whether to include disabled recommendations or not.|include_disabled_recommendations|includeDisabledRecommendations|
|**--skip-token**|string|An OData query option to indicate how many elements to skip in the collection.|skip_token|$skipToken|
|**--filter**|string|An OData filter expression that filters elements in the collection.|filter|$filter|

### group `az synapse sql-pool-table`
#### <a name="SqlPoolTablesListBySchema">Command `az synapse sql-pool-table list`</a>

##### <a name="ExamplesSqlPoolTablesListBySchema">Example</a>
```
az synapse sql-pool-table list --resource-group "myRG" --schema-name "dbo" --sql-pool-name "myDatabase" \
--workspace-name "serverName"
```
##### <a name="ParametersSqlPoolTablesListBySchema">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--filter**|string|An OData filter expression that filters elements in the collection.|filter|$filter|

### group `az synapse sql-pool-table-column`
#### <a name="SqlPoolTableColumnsListByTableName">Command `az synapse sql-pool-table-column list`</a>

##### <a name="ExamplesSqlPoolTableColumnsListByTableName">Example</a>
```
az synapse sql-pool-table-column list --resource-group "myRG" --schema-name "dbo" --sql-pool-name "myDatabase" \
--table-name "table1" --workspace-name "serverName"
```
##### <a name="ParametersSqlPoolTableColumnsListByTableName">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--schema-name**|string|The name of the schema.|schema_name|schemaName|
|**--table-name**|string|The name of the table.|table_name|tableName|
|**--filter**|string|An OData filter expression that filters elements in the collection.|filter|$filter|

### group `az synapse sql-pool-transparent-data-encryption`
#### <a name="SqlPoolTransparentDataEncryptionsGet">Command `az synapse sql-pool-transparent-data-encryption show`</a>

##### <a name="ExamplesSqlPoolTransparentDataEncryptionsGet">Example</a>
```
az synapse sql-pool-transparent-data-encryption show --resource-group "sqlcrudtest-6852" --sql-pool-name \
"sqlcrudtest-9187" --workspace-name "sqlcrudtest-2080"
```
##### <a name="ParametersSqlPoolTransparentDataEncryptionsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolTransparentDataEncryptionsCreateOrUpdate#Create">Command `az synapse sql-pool-transparent-data-encryption create`</a>

##### <a name="ExamplesSqlPoolTransparentDataEncryptionsCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-transparent-data-encryption create --status "Enabled" --resource-group "sqlcrudtest-6852" \
--sql-pool-name "sqlcrudtest-9187" --workspace-name "sqlcrudtest-2080"
```
##### <a name="ParametersSqlPoolTransparentDataEncryptionsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--status**|sealed-choice|The status of the database transparent data encryption.|status|status|

#### <a name="SqlPoolTransparentDataEncryptionsCreateOrUpdate#Update">Command `az synapse sql-pool-transparent-data-encryption update`</a>

##### <a name="ParametersSqlPoolTransparentDataEncryptionsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--status**|sealed-choice|The status of the database transparent data encryption.|status|status|

### group `az synapse sql-pool-usage`
#### <a name="SqlPoolUsagesList">Command `az synapse sql-pool-usage list`</a>

##### <a name="ExamplesSqlPoolUsagesList">Example</a>
```
az synapse sql-pool-usage list --resource-group "sqlcrudtest-6730" --sql-pool-name "3481" --workspace-name \
"sqlcrudtest-9007"
```
##### <a name="ParametersSqlPoolUsagesList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-vulnerability-assessment`
#### <a name="SqlPoolVulnerabilityAssessmentsList">Command `az synapse sql-pool-vulnerability-assessment list`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentsList">Example</a>
```
az synapse sql-pool-vulnerability-assessment list --resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name \
"testdb" --workspace-name "vulnerabilityaseessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentsList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolVulnerabilityAssessmentsGet">Command `az synapse sql-pool-vulnerability-assessment show`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentsGet">Example</a>
```
az synapse sql-pool-vulnerability-assessment show --resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name \
"testdb" --workspace-name "vulnerabilityaseessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create">Command `az synapse sql-pool-vulnerability-assessment create`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-vulnerability-assessment create --recurring-scans email-subscription-admins=true \
emails="email1@mail.com" emails="email2@mail.com" is-enabled=true --storage-account-access-key \
"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" --storage-container-path "https://myStorage.blob.core.window\
s.net/vulnerability-assessment/" --storage-container-sas-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"\
 --resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name "testdb" --workspace-name \
"vulnerabilityaseessmenttest-6440"
```
##### <a name="ExamplesSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-vulnerability-assessment create --storage-account-access-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\
XXXXXXXXXXXXXXXXXXX" --storage-container-path "https://myStorage.blob.core.windows.net/vulnerability-assessment/" \
--resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name "testdb" --workspace-name \
"vulnerabilityaseessmenttest-6440"
```
##### <a name="ExamplesSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-vulnerability-assessment create --storage-container-path "https://myStorage.blob.core.windows.net/v\
ulnerability-assessment/" --storage-container-sas-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
--resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name "testdb" --workspace-name \
"vulnerabilityaseessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--storage-container-path**|string|A blob storage container path to hold the scan results (e.g. https://myStorage.blob.core.windows.net/VaScans/).  It is required if server level vulnerability assessment policy doesn't set|storage_container_path|storageContainerPath|
|**--storage-container-sas-key**|string|A shared access signature (SAS Key) that has write access to the blob container specified in 'storageContainerPath' parameter. If 'storageAccountAccessKey' isn't specified, StorageContainerSasKey is required.|storage_container_sas_key|storageContainerSasKey|
|**--storage-account-access-key**|string|Specifies the identifier key of the storage account for vulnerability assessment scan results. If 'StorageContainerSasKey' isn't specified, storageAccountAccessKey is required.|storage_account_access_key|storageAccountAccessKey|
|**--recurring-scans**|object|The recurring scans settings|recurring_scans|recurringScans|

#### <a name="SqlPoolVulnerabilityAssessmentsCreateOrUpdate#Update">Command `az synapse sql-pool-vulnerability-assessment update`</a>

##### <a name="ParametersSqlPoolVulnerabilityAssessmentsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--storage-container-path**|string|A blob storage container path to hold the scan results (e.g. https://myStorage.blob.core.windows.net/VaScans/).  It is required if server level vulnerability assessment policy doesn't set|storage_container_path|storageContainerPath|
|**--storage-container-sas-key**|string|A shared access signature (SAS Key) that has write access to the blob container specified in 'storageContainerPath' parameter. If 'storageAccountAccessKey' isn't specified, StorageContainerSasKey is required.|storage_container_sas_key|storageContainerSasKey|
|**--storage-account-access-key**|string|Specifies the identifier key of the storage account for vulnerability assessment scan results. If 'StorageContainerSasKey' isn't specified, storageAccountAccessKey is required.|storage_account_access_key|storageAccountAccessKey|
|**--recurring-scans**|object|The recurring scans settings|recurring_scans|recurringScans|

#### <a name="SqlPoolVulnerabilityAssessmentsDelete">Command `az synapse sql-pool-vulnerability-assessment delete`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentsDelete">Example</a>
```
az synapse sql-pool-vulnerability-assessment delete --resource-group "vulnerabilityaseessmenttest-4799" \
--sql-pool-name "testdb" --workspace-name "vulnerabilityaseessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

### group `az synapse sql-pool-vulnerability-assessment-rule-baseline`
#### <a name="SqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Create">Command `az synapse sql-pool-vulnerability-assessment-rule-baseline create`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Create">Example</a>
```
az synapse sql-pool-vulnerability-assessment-rule-baseline create --baseline-name "default" --baseline-results \
result="userA" result="SELECT" --baseline-results result="userB" result="SELECT" --baseline-results result="userC" \
result="SELECT" result="tableId_4" --resource-group "vulnerabilityaseessmenttest-4799" --rule-id "VA1001" \
--sql-pool-name "testdb" --workspace-name "vulnerabilityaseessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--rule-id**|string|The vulnerability assessment rule ID.|rule_id|ruleId|
|**--baseline-name**|sealed-choice|The name of the vulnerability assessment rule baseline (default implies a baseline on a Sql pool level rule and master for workspace level rule).|baseline_name|baselineName|
|**--baseline-results**|array|The rule baseline result|baseline_results|baselineResults|

#### <a name="SqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Update">Command `az synapse sql-pool-vulnerability-assessment-rule-baseline update`</a>

##### <a name="ParametersSqlPoolVulnerabilityAssessmentRuleBaselinesCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--rule-id**|string|The vulnerability assessment rule ID.|rule_id|ruleId|
|**--baseline-name**|sealed-choice|The name of the vulnerability assessment rule baseline (default implies a baseline on a Sql pool level rule and master for workspace level rule).|baseline_name|baselineName|
|**--baseline-results**|array|The rule baseline result|baseline_results|baselineResults|

#### <a name="SqlPoolVulnerabilityAssessmentRuleBaselinesDelete">Command `az synapse sql-pool-vulnerability-assessment-rule-baseline delete`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentRuleBaselinesDelete">Example</a>
```
az synapse sql-pool-vulnerability-assessment-rule-baseline delete --baseline-name "default" --resource-group \
"vulnerabilityaseessmenttest-4799" --rule-id "VA1001" --sql-pool-name "testdb" --workspace-name \
"vulnerabilityaseessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentRuleBaselinesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--rule-id**|string|The vulnerability assessment rule ID.|rule_id|ruleId|
|**--baseline-name**|sealed-choice|The name of the vulnerability assessment rule baseline (default implies a baseline on a Sql pool level rule and master for workspace level rule).|baseline_name|baselineName|

### group `az synapse sql-pool-vulnerability-assessment-scan`
#### <a name="SqlPoolVulnerabilityAssessmentScansList">Command `az synapse sql-pool-vulnerability-assessment-scan list`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentScansList">Example</a>
```
az synapse sql-pool-vulnerability-assessment-scan list --resource-group "vulnerabilityassessmenttest-4711" \
--sql-pool-name "testdb" --workspace-name "vulnerabilityassessmenttest-6411"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentScansList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|

#### <a name="SqlPoolVulnerabilityAssessmentScansExport">Command `az synapse sql-pool-vulnerability-assessment-scan export`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentScansExport">Example</a>
```
az synapse sql-pool-vulnerability-assessment-scan export --resource-group "vulnerabilityassessmenttest-4799" --scan-id \
"scan001" --sql-pool-name "testdb" --workspace-name "vulnerabilityassessmenttest-6440"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentScansExport">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--scan-id**|string|The vulnerability assessment scan Id of the scan to retrieve.|scan_id|scanId|

#### <a name="SqlPoolVulnerabilityAssessmentScansInitiateScan">Command `az synapse sql-pool-vulnerability-assessment-scan initiate-scan`</a>

##### <a name="ExamplesSqlPoolVulnerabilityAssessmentScansInitiateScan">Example</a>
```
az synapse sql-pool-vulnerability-assessment-scan initiate-scan --resource-group "vulnerabilityassessmenttest-4711" \
--scan-id "scan01" --sql-pool-name "testdb" --workspace-name "vulnerabilityassessmenttest-6411"
```
##### <a name="ParametersSqlPoolVulnerabilityAssessmentScansInitiateScan">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--sql-pool-name**|string|SQL pool name|sql_pool_name|sqlPoolName|
|**--scan-id**|string|The vulnerability assessment scan Id of the scan to retrieve.|scan_id|scanId|

### group `az synapse workspace`
#### <a name="WorkspacesListByResourceGroup">Command `az synapse workspace list`</a>

##### <a name="ExamplesWorkspacesListByResourceGroup">Example</a>
```
az synapse workspace list --resource-group "resourceGroup1"
```
##### <a name="ParametersWorkspacesListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|

#### <a name="WorkspacesList">Command `az synapse workspace list`</a>

##### <a name="ExamplesWorkspacesList">Example</a>
```
az synapse workspace list
```
##### <a name="ParametersWorkspacesList">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="WorkspacesGet">Command `az synapse workspace show`</a>

##### <a name="ExamplesWorkspacesGet">Example</a>
```
az synapse workspace show --resource-group "resourceGroup1" --name "workspace1"
```
##### <a name="ParametersWorkspacesGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="WorkspacesCreateOrUpdate#Create">Command `az synapse workspace create`</a>

##### <a name="ExamplesWorkspacesCreateOrUpdate#Create">Example</a>
```
az synapse workspace create --resource-group "resourceGroup1" --identity-type "SystemAssigned" --location "East US" \
--default-data-lake-storage account-url="https://accountname.dfs.core.windows.net" filesystem="default" \
--managed-resource-group-name "workspaceManagedResourceGroupUnique" --managed-virtual-network "default" \
--sql-administrator-login "login" --sql-administrator-login-password "password" --tags key="value" --name "workspace1"
```
##### <a name="ParametersWorkspacesCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--location**|string|The geo-location where the resource lives|location|location|
|**--tags**|dictionary|Resource tags.|tags|tags|
|**--default-data-lake-storage**|object|Workspace default data lake storage account details|default_data_lake_storage|defaultDataLakeStorage|
|**--sql-administrator-login-password**|string|SQL administrator login password|sql_administrator_login_password|sqlAdministratorLoginPassword|
|**--managed-resource-group-name**|string|Workspace managed resource group. The resource group name uniquely identifies the resource group within the user subscriptionId. The resource group name must be no longer than 90 characters long, and must be alphanumeric characters (Char.IsLetterOrDigit()) and '-', '_', '(', ')' and'.'. Note that the name cannot end with '.'|managed_resource_group_name|managedResourceGroupName|
|**--sql-administrator-login**|string|Login for workspace SQL active directory administrator|sql_administrator_login|sqlAdministratorLogin|
|**--connectivity-endpoints**|dictionary|Connectivity endpoints|connectivity_endpoints|connectivityEndpoints|
|**--managed-virtual-network**|string|Setting this to 'default' will ensure that all compute for this workspace is in a virtual network managed on behalf of the user.|managed_virtual_network|managedVirtualNetwork|
|**--private-endpoint-connections**|array|Private endpoint connections to the workspace|private_endpoint_connections|privateEndpointConnections|
|**--virtual-network-profile-compute-subnet-id**|string|Subnet ID used for computes in workspace|compute_subnet_id|computeSubnetId|
|**--identity-type**|sealed-choice|The type of managed identity for the workspace|type|type|

#### <a name="WorkspacesUpdate">Command `az synapse workspace update`</a>

##### <a name="ExamplesWorkspacesUpdate">Example</a>
```
az synapse workspace update --resource-group "resourceGroup1" --name "workspace1" --identity-type "SystemAssigned" \
--sql-administrator-login-password "password" --tags key="value"
```
##### <a name="ParametersWorkspacesUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--tags**|dictionary|Resource tags|tags|tags|
|**--sql-administrator-login-password**|string|SQL administrator login password|sql_administrator_login_password|sqlAdministratorLoginPassword|
|**--identity-type**|sealed-choice|The type of managed identity for the workspace|type|type|

#### <a name="WorkspacesDelete">Command `az synapse workspace delete`</a>

##### <a name="ExamplesWorkspacesDelete">Example</a>
```
az synapse workspace delete --resource-group "resourceGroup1" --name "workspace1"
```
##### <a name="ParametersWorkspacesDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

### group `az synapse workspace-aad-admin`
#### <a name="WorkspaceAadAdminsGet">Command `az synapse workspace-aad-admin show`</a>

##### <a name="ExamplesWorkspaceAadAdminsGet">Example</a>
```
az synapse workspace-aad-admin show --resource-group "resourceGroup1" --workspace-name "workspace1"
```
##### <a name="ParametersWorkspaceAadAdminsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="WorkspaceAadAdminsCreateOrUpdate#Create">Command `az synapse workspace-aad-admin create`</a>

##### <a name="ExamplesWorkspaceAadAdminsCreateOrUpdate#Create">Example</a>
```
az synapse workspace-aad-admin create --administrator-type "ActiveDirectory" --login "bob@contoso.com" --sid \
"c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c" --tenant-id "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c" --resource-group \
"resourceGroup1" --workspace-name "workspace1"
```
##### <a name="ParametersWorkspaceAadAdminsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--tenant-id**|string|Tenant ID of the workspace active directory administrator|tenant_id|tenantId|
|**--login**|string|Login of the workspace active directory administrator|login|login|
|**--administrator-type**|string|Workspace active directory administrator type|administrator_type|administratorType|
|**--sid**|string|Object ID of the workspace active directory administrator|sid|sid|

#### <a name="WorkspaceAadAdminsCreateOrUpdate#Update">Command `az synapse workspace-aad-admin update`</a>

##### <a name="ParametersWorkspaceAadAdminsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--tenant-id**|string|Tenant ID of the workspace active directory administrator|tenant_id|tenantId|
|**--login**|string|Login of the workspace active directory administrator|login|login|
|**--administrator-type**|string|Workspace active directory administrator type|administrator_type|administratorType|
|**--sid**|string|Object ID of the workspace active directory administrator|sid|sid|

#### <a name="WorkspaceAadAdminsDelete">Command `az synapse workspace-aad-admin delete`</a>

##### <a name="ExamplesWorkspaceAadAdminsDelete">Example</a>
```
az synapse workspace-aad-admin delete --resource-group "resourceGroup1" --workspace-name "workspace1"
```
##### <a name="ParametersWorkspaceAadAdminsDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

### group `az synapse workspace-managed-identity-sql-control-setting`
#### <a name="WorkspaceManagedIdentitySqlControlSettingsGet">Command `az synapse workspace-managed-identity-sql-control-setting show`</a>

##### <a name="ExamplesWorkspaceManagedIdentitySqlControlSettingsGet">Example</a>
```
az synapse workspace-managed-identity-sql-control-setting show --resource-group "resourceGroup1" --workspace-name \
"workspace1"
```
##### <a name="ParametersWorkspaceManagedIdentitySqlControlSettingsGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|

#### <a name="WorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Create">Command `az synapse workspace-managed-identity-sql-control-setting create`</a>

##### <a name="ExamplesWorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Create">Example</a>
```
az synapse workspace-managed-identity-sql-control-setting create --grant-sql-control-to-managed-identity-desired-state \
"Enabled" --resource-group "resourceGroup1" --workspace-name "workspace1"
```
##### <a name="ParametersWorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Create">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--grant-sql-control-to-managed-identity-desired-state**|choice|Desired state|desired_state|desiredState|

#### <a name="WorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Update">Command `az synapse workspace-managed-identity-sql-control-setting update`</a>

##### <a name="ParametersWorkspaceManagedIdentitySqlControlSettingsCreateOrUpdate#Update">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--workspace-name**|string|The name of the workspace|workspace_name|workspaceName|
|**--grant-sql-control-to-managed-identity-desired-state**|choice|Desired state|desired_state|desiredState|
