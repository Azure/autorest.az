# Azure CLI synapse Extension #
This is the extension for synapse

### How to use ###
Install this extension using the below CLI command
```
az extension add --name synapse
```

### Included Features ###
#### synapse big-data-pool ####
##### Create #####
```
az synapse big-data-pool create --location "West US 2" --auto-pause delay-in-minutes=15 enabled=true \
    --auto-scale enabled=true max-node-count=50 min-node-count=3 --default-spark-log-folder "/logs" \
    --library-requirements content="" filename="requirements.txt" --node-count 4 --node-size "Medium" \
    --node-size-family "MemoryOptimized" --spark-events-folder "/events" --spark-version "2.4" --tags key="value" \
    --name "ExamplePool" --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace" 

az synapse big-data-pool wait --created --name "{myBigDataPool}" --resource-group "{rg}"
```
##### Show #####
```
az synapse big-data-pool show --name "ExamplePool" --resource-group "ExampleResourceGroup" \
    --workspace-name "ExampleWorkspace" 
```
##### List #####
```
az synapse big-data-pool list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### Update #####
```
az synapse big-data-pool update --name "ExamplePool" --tags key="value" --resource-group "ExampleResourceGroup" \
    --workspace-name "ExampleWorkspace" 
```
##### Delete #####
```
az synapse big-data-pool delete --name "ExamplePool" --resource-group "ExampleResourceGroup" \
    --workspace-name "ExampleWorkspace" 
```
#### synapse operation ####
##### Get-azure-async-header-result #####
```
az synapse operation get-azure-async-header-result --operation-id "01234567-89ab-4def-0123-456789abcdef" \
    --resource-group "resourceGroup1" --workspace-name "workspace1" 
```
##### Get-location-header-result #####
```
az synapse operation get-location-header-result --operation-id "01234567-89ab-4def-0123-456789abcdef" \
    --resource-group "resourceGroup1" --workspace-name "workspace1" 
```
#### synapse ip-firewall-rule ####
##### Create #####
```
az synapse ip-firewall-rule create --end-ip-address "10.0.0.254" --start-ip-address "10.0.0.0" \
    --resource-group "ExampleResourceGroup" --rule-name "ExampleIpFirewallRule" --workspace-name "ExampleWorkspace" 
```
##### Show #####
```
az synapse ip-firewall-rule show --resource-group "ExampleResourceGroup" --rule-name "ExampleIpFirewallRule" \
    --workspace-name "ExampleWorkspace" 
```
##### List #####
```
az synapse ip-firewall-rule list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### Replace-all #####
```
az synapse ip-firewall-rule replace-all --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace" \
    --ip-firewall-rules "{\\"AnotherExampleFirewallRule\\":{\\"endIpAddress\\":\\"10.0.1.254\\",\\"startIpAddress\\":\\"10.0.1.0\\"},\\"ExampleFirewallRule\\":{\\"endIpAddress\\":\\"10.0.0.254\\",\\"startIpAddress\\":\\"10.0.0.0\\"}}" 
```
##### Delete #####
```
az synapse ip-firewall-rule delete --resource-group "ExampleResourceGroup" --rule-name "ExampleIpFirewallRule" \
    --workspace-name "ExampleWorkspace" 
```
#### synapse sql-pool ####
##### Create #####
```
az synapse sql-pool create --resource-group "ExampleResourceGroup" --location "West US 2" --collation "" \
    --create-mode "" --creation-date "1970-01-01T00:00:00.000Z" --max-size-bytes 0 --recoverable-database-id "" \
    --restore-point-in-time "1970-01-01T00:00:00.000Z" --source-database-id "" --sku name="" tier="" \
    --name "ExampleSqlPool" --workspace-name "ExampleWorkspace" 

az synapse sql-pool wait --created --resource-group "{rg}" --name "{mySqlPool2}"
```
##### List #####
```
az synapse sql-pool list --resource-group "sqlcrudtest-6845" --workspace-name "sqlcrudtest-7177"
```
##### Show #####
```
az synapse sql-pool show --resource-group "sqlcrudtest-6852" --name "sqlcrudtest-9187" \
    --workspace-name "sqlcrudtest-2080" 
```
##### List #####
```
az synapse sql-pool list --resource-group "sqlcrudtest-6845" --workspace-name "sqlcrudtest-7177"
```
##### Update #####
```
az synapse sql-pool update --resource-group "ExampleResourceGroup" --location "West US 2" --collation "" \
    --create-mode "" --creation-date "1970-01-01T00:00:00.000Z" --max-size-bytes 0 --recoverable-database-id "" \
    --restore-point-in-time "1970-01-01T00:00:00.000Z" --source-database-id "" --sku name="" tier="" \
    --name "ExampleSqlPool" --workspace-name "ExampleWorkspace" 
```
##### Pause #####
```
az synapse sql-pool pause --resource-group "Default-SQL-SouthEastAsia" --name "testdwdb" --workspace-name "testsvr"
```
##### Rename #####
```
az synapse sql-pool rename \
    --id "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/Default-SQL-SouthEastAsia/providers/Microsoft.Synapse/workspaces/testsvr/sqlPools/newtestdb" \
    --resource-group "Default-SQL-SouthEastAsia" --name "testdb" --workspace-name "testsvr" 
```
##### Resume #####
```
az synapse sql-pool resume --resource-group "sqlcrudtest-6852" --name "sqlcrudtest-9187" \
    --workspace-name "sqlcrudtest-2080" 
```
##### Delete #####
```
az synapse sql-pool delete --resource-group "ExampleResourceGroup" --name "ExampleSqlPool" \
    --workspace-name "ExampleWorkspace" 
```
#### synapse sql-pool-metadata-sync-config ####
##### Create #####
```
az synapse sql-pool-metadata-sync-config create --enabled true --resource-group "ExampleResourceGroup" \
    --sql-pool-name "ExampleSqlPool" --workspace-name "ExampleWorkspace" 
```
##### Show #####
```
az synapse sql-pool-metadata-sync-config show --resource-group "ExampleResourceGroup" --sql-pool-name "ExampleSqlPool" \
    --workspace-name "ExampleWorkspace" 
```
#### synapse sql-pool-operation-result ####
##### Get-location-header-result #####
```
az synapse sql-pool-operation-result get-location-header-result --operation-id "fedcba98-7654-4210-fedc-ba9876543210" \
    --resource-group "ExampleResourceGroup" --sql-pool-name "ExampleSqlPool" --workspace-name "ExampleWorkspace" 
```
#### synapse sql-pool-geo-backup-policy ####
##### Show #####
```
az synapse sql-pool-geo-backup-policy show --resource-group "sqlcrudtest-4799" --sql-pool-name "testdw" \
    --workspace-name "sqlcrudtest-5961" 
```
#### synapse sql-pool-data-warehouse-user-activity ####
##### Show #####
```
az synapse sql-pool-data-warehouse-user-activity show --resource-group "Default-SQL-SouthEastAsia" \
    --sql-pool-name "testdb" --workspace-name "testsvr" 
```
#### synapse sql-pool-restore-point ####
##### List #####
```
az synapse sql-pool-restore-point list --resource-group "Default-SQL-SouthEastAsia" --sql-pool-name "testDatabase" \
    --workspace-name "testserver" 
```
##### Create #####
```
az synapse sql-pool-restore-point create --restore-point-label "mylabel" --resource-group "Default-SQL-SouthEastAsia" \
    --sql-pool-name "testDatabase" --workspace-name "testserver" 
```
#### synapse sql-pool-replication-link ####
##### List #####
```
az synapse sql-pool-replication-link list --resource-group "sqlcrudtest-4799" --sql-pool-name "testdb" \
    --workspace-name "sqlcrudtest-6440" 
```
#### synapse sql-pool-transparent-data-encryption ####
##### Create #####
```
az synapse sql-pool-transparent-data-encryption create --status "Enabled" --resource-group "sqlcrudtest-6852" \
    --sql-pool-name "sqlcrudtest-9187" --workspace-name "sqlcrudtest-2080" 
```
##### Show #####
```
az synapse sql-pool-transparent-data-encryption show --resource-group "sqlcrudtest-6852" \
    --sql-pool-name "sqlcrudtest-9187" --workspace-name "sqlcrudtest-2080" 
```
#### synapse sql-pool-blob-auditing-policy ####
##### Create #####
```
az synapse sql-pool-blob-auditing-policy create --audit-actions-and-groups "DATABASE_LOGOUT_GROUP" \
    --audit-actions-and-groups "DATABASE_ROLE_MEMBER_CHANGE_GROUP" \
    --audit-actions-and-groups "UPDATE on database::TestDatabaseName by public" --is-azure-monitor-target-enabled true \
    --is-storage-secondary-key-in-use false --retention-days 6 --state "Enabled" \
    --storage-account-access-key "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdkfD2342309432849328476458/3RSD==" \
    --storage-account-subscription-id "00000000-1234-0000-5678-000000000000" \
    --storage-endpoint "https://mystorage.blob.core.windows.net" --resource-group "blobauditingtest-4799" \
    --sql-pool-name "testdb" --workspace-name "blobauditingtest-6440" 
```
##### Create #####
```
az synapse sql-pool-blob-auditing-policy create --state "Enabled" \
    --storage-account-access-key "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdkfD2342309432849328476458/3RSD==" \
    --storage-endpoint "https://mystorage.blob.core.windows.net" --resource-group "blobauditingtest-4799" \
    --sql-pool-name "testdb" --workspace-name "blobauditingtest-6440" 
```
##### Show #####
```
az synapse sql-pool-blob-auditing-policy show --resource-group "blobauditingtest-6852" --sql-pool-name "testdb" \
    --workspace-name "blobauditingtest-2080" 
```
#### synapse sql-pool-operation ####
##### List #####
```
az synapse sql-pool-operation list --resource-group "sqlcrudtest-7398" --sql-pool-name "testdb" \
    --workspace-name "sqlcrudtest-4645" 
```
#### synapse sql-pool-usage ####
##### List #####
```
az synapse sql-pool-usage list --resource-group "sqlcrudtest-6730" --sql-pool-name "3481" \
    --workspace-name "sqlcrudtest-9007" 
```
#### synapse sql-pool-sensitivity-label ####
##### Create #####
```
az synapse sql-pool-sensitivity-label create --column-name "myColumn" --information-type "PhoneNumber" \
    --information-type-id "d22fa6e9-5ee4-3bde-4c2b-a409604c4646" --label-id "bf91e08c-f4f0-478a-b016-25164b2a65ff" \
    --label-name "PII" --resource-group "myRG" --schema-name "dbo" --sql-pool-name "myDatabase" --table-name "myTable" \
    --workspace-name "myServer" 
```
##### Disable-recommendation #####
```
az synapse sql-pool-sensitivity-label disable-recommendation --column-name "myColumn" --resource-group "myRG" \
    --schema-name "dbo" --sql-pool-name "myDatabase" --table-name "myTable" --workspace-name "myServer" 
```
##### Enable-recommendation #####
```
az synapse sql-pool-sensitivity-label enable-recommendation --column-name "myColumn" --resource-group "myRG" \
    --schema-name "dbo" --sql-pool-name "myDatabase" --table-name "myTable" --workspace-name "myServer" 
```
##### List-current #####
```
az synapse sql-pool-sensitivity-label list-current --resource-group "myRG" --sql-pool-name "myDatabase" \
    --workspace-name "myServer" 
```
##### List-recommended #####
```
az synapse sql-pool-sensitivity-label list-recommended --resource-group "myRG" --sql-pool-name "myDatabase" \
    --workspace-name "myServer" 
```
##### Delete #####
```
az synapse sql-pool-sensitivity-label delete --column-name "myColumn" --resource-group "myRG" --schema-name "dbo" \
    --sql-pool-name "myDatabase" --table-name "myTable" --workspace-name "myServer" 
```
#### synapse sql-pool-schema ####
##### List #####
```
az synapse sql-pool-schema list --resource-group "myRG" --sql-pool-name "myDatabase" --workspace-name "serverName"
```
#### synapse sql-pool-table ####
##### List #####
```
az synapse sql-pool-table list --resource-group "myRG" --schema-name "dbo" --sql-pool-name "myDatabase" \
    --workspace-name "serverName" 
```
#### synapse sql-pool-table-column ####
##### List #####
```
az synapse sql-pool-table-column list --resource-group "myRG" --schema-name "dbo" --sql-pool-name "myDatabase" \
    --table-name "table1" --workspace-name "serverName" 
```
#### synapse sql-pool-connection-policy ####
##### Show #####
```
az synapse sql-pool-connection-policy show --resource-group "blobauditingtest-6852" --sql-pool-name "testdb" \
    --workspace-name "blobauditingtest-2080" 
```
#### synapse sql-pool-vulnerability-assessment ####
##### Create #####
```
az synapse sql-pool-vulnerability-assessment create \
    --recurring-scans email-subscription-admins=true emails="email1@mail.com" emails="email2@mail.com" is-enabled=true \
    --storage-account-access-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
    --storage-container-path "https://myStorage.blob.core.windows.net/vulnerability-assessment/" \
    --storage-container-sas-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
    --resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name "testdb" \
    --workspace-name "vulnerabilityaseessmenttest-6440" 
```
##### Create #####
```
az synapse sql-pool-vulnerability-assessment create \
    --storage-account-access-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
    --storage-container-path "https://myStorage.blob.core.windows.net/vulnerability-assessment/" \
    --resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name "testdb" \
    --workspace-name "vulnerabilityaseessmenttest-6440" 
```
##### Create #####
```
az synapse sql-pool-vulnerability-assessment create \
    --storage-container-path "https://myStorage.blob.core.windows.net/vulnerability-assessment/" \
    --storage-container-sas-key "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
    --resource-group "vulnerabilityaseessmenttest-4799" --sql-pool-name "testdb" \
    --workspace-name "vulnerabilityaseessmenttest-6440" 
```
##### Show #####
```
az synapse sql-pool-vulnerability-assessment show --resource-group "vulnerabilityaseessmenttest-4799" \
    --sql-pool-name "testdb" --workspace-name "vulnerabilityaseessmenttest-6440" 
```
##### List #####
```
az synapse sql-pool-vulnerability-assessment list --resource-group "vulnerabilityaseessmenttest-4799" \
    --sql-pool-name "testdb" --workspace-name "vulnerabilityaseessmenttest-6440" 
```
##### Delete #####
```
az synapse sql-pool-vulnerability-assessment delete --resource-group "vulnerabilityaseessmenttest-4799" \
    --sql-pool-name "testdb" --workspace-name "vulnerabilityaseessmenttest-6440" 
```
#### synapse sql-pool-vulnerability-assessment-scan ####
##### List #####
```
az synapse sql-pool-vulnerability-assessment-scan list --resource-group "vulnerabilityassessmenttest-4711" \
    --sql-pool-name "testdb" --workspace-name "vulnerabilityassessmenttest-6411" 
```
##### Export #####
```
az synapse sql-pool-vulnerability-assessment-scan export --resource-group "vulnerabilityassessmenttest-4799" \
    --scan-id "scan001" --sql-pool-name "testdb" --workspace-name "vulnerabilityassessmenttest-6440" 
```
##### Initiate-scan #####
```
az synapse sql-pool-vulnerability-assessment-scan initiate-scan --resource-group "vulnerabilityassessmenttest-4711" \
    --scan-id "scan01" --sql-pool-name "testdb" --workspace-name "vulnerabilityassessmenttest-6411" 
```
#### synapse sql-pool-security-alert-policy ####
##### Create #####
```
az synapse sql-pool-security-alert-policy create --disabled-alerts "Sql_Injection" --disabled-alerts "Usage_Anomaly" \
    --email-account-admins true --email-addresses "test@microsoft.com" --email-addresses "user@microsoft.com" \
    --retention-days 6 --state "Enabled" \
    --storage-account-access-key "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdkfD2342309432849328476458/3RSD==" \
    --storage-endpoint "https://mystorage.blob.core.windows.net" --resource-group "securityalert-4799" \
    --sql-pool-name "testdb" --workspace-name "securityalert-6440" 
```
##### Create #####
```
az synapse sql-pool-security-alert-policy create --state "Enabled" --resource-group "securityalert-4799" \
    --sql-pool-name "testdb" --workspace-name "securityalert-6440" 
```
##### Show #####
```
az synapse sql-pool-security-alert-policy show --resource-group "securityalert-6852" --sql-pool-name "testdb" \
    --workspace-name "securityalert-2080" 
```
#### synapse sql-pool-vulnerability-assessment-rule-baseline ####
##### Create #####
```
az synapse sql-pool-vulnerability-assessment-rule-baseline create --baseline-name "default" \
    --baseline-results result="userA" result="SELECT" --baseline-results result="userB" result="SELECT" \
    --baseline-results result="userC" result="SELECT" result="tableId_4" \
    --resource-group "vulnerabilityaseessmenttest-4799" --rule-id "VA1001" --sql-pool-name "testdb" \
    --workspace-name "vulnerabilityaseessmenttest-6440" 
```
##### Delete #####
```
az synapse sql-pool-vulnerability-assessment-rule-baseline delete --baseline-name "default" \
    --resource-group "vulnerabilityaseessmenttest-4799" --rule-id "VA1001" --sql-pool-name "testdb" \
    --workspace-name "vulnerabilityaseessmenttest-6440" 
```
#### synapse workspace ####
##### Create #####
```
az synapse workspace create --resource-group "resourceGroup1" --identity-type "SystemAssigned" --location "East US" \
    --default-data-lake-storage account-url="https://accountname.dfs.core.windows.net" filesystem="default" \
    --managed-resource-group-name "workspaceManagedResourceGroupUnique" --managed-virtual-network "default" \
    --sql-administrator-login "login" --sql-administrator-login-password "password" --tags key="value" \
    --name "workspace1" 

az synapse workspace wait --created --resource-group "{rg_2}" --name "{myWorkspace2}"
```
##### Show #####
```
az synapse workspace show --resource-group "resourceGroup1" --name "workspace1"
```
##### List #####
```
az synapse workspace list --resource-group "resourceGroup1"
```
##### Update #####
```
az synapse workspace update --resource-group "resourceGroup1" --name "workspace1" --identity-type "SystemAssigned" \
    --sql-administrator-login-password "password" --tags key="value" 
```
##### Delete #####
```
az synapse workspace delete --resource-group "resourceGroup1" --name "workspace1"
```
#### synapse workspace-aad-admin ####
##### Create #####
```
az synapse workspace-aad-admin create --administrator-type "ActiveDirectory" --login "bob@contoso.com" \
    --sid "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c" --tenant-id "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c" \
    --resource-group "resourceGroup1" --workspace-name "workspace1" 
```
##### Show #####
```
az synapse workspace-aad-admin show --resource-group "resourceGroup1" --workspace-name "workspace1"
```
##### Delete #####
```
az synapse workspace-aad-admin delete --resource-group "resourceGroup1" --workspace-name "workspace1"
```
#### synapse workspace-managed-identity-sql-control-setting ####
##### Create #####
```
az synapse workspace-managed-identity-sql-control-setting create --resource-group "resourceGroup1" \
    --workspace-name "workspace1" 
```
##### Show #####
```
az synapse workspace-managed-identity-sql-control-setting show --resource-group "resourceGroup1" \
    --workspace-name "workspace1" 
```
#### synapse integration-runtime ####
##### Create #####
```
az synapse integration-runtime create \
    --properties "{\\"type\\":\\"SelfHosted\\",\\"description\\":\\"A selfhosted integration runtime\\"}" \
    --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
##### Show #####
```
az synapse integration-runtime show --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
    --workspace-name "exampleWorkspace" 
```
##### List #####
```
az synapse integration-runtime list --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace"
```
##### Update #####
```
az synapse integration-runtime update --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
    --auto-update "Off" --update-delay-offset "\\"PT3H\\"" --workspace-name "exampleWorkspace" 
```
##### Start #####
```
az synapse integration-runtime start --name "exampleManagedIntegrationRuntime" --resource-group "exampleResourceGroup" \
    --workspace-name "exampleWorkspace" 
```
##### Stop #####
```
az synapse integration-runtime stop --name "exampleManagedIntegrationRuntime" --resource-group "exampleResourceGroup" \
    --workspace-name "exampleWorkspace" 
```
##### Upgrade #####
```
az synapse integration-runtime upgrade --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
    --workspace-name "exampleWorkspace" 
```
##### Delete #####
```
az synapse integration-runtime delete --name "exampleIntegrationRuntime" --resource-group "exampleResourceGroup" \
    --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-node-ip-address ####
##### Get #####
```
az synapse integration-runtime-node-ip-address get --integration-runtime-name "exampleIntegrationRuntime" \
    --node-name "Node_1" --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-object-metadata ####
##### Get #####
```
az synapse integration-runtime-object-metadata get --metadata-path "ssisFolders" \
    --integration-runtime-name "testactivityv2" --resource-group "exampleResourceGroup" \
    --workspace-name "exampleWorkspace" 
```
##### Refresh #####
```
az synapse integration-runtime-object-metadata refresh --integration-runtime-name "testactivityv2" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-node ####
##### Show #####
```
az synapse integration-runtime-node show --integration-runtime-name "exampleIntegrationRuntime" --node-name "Node_1" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
##### Update #####
```
az synapse integration-runtime-node update --integration-runtime-name "exampleIntegrationRuntime" --node-name "Node_1" \
    --resource-group "exampleResourceGroup" --concurrent-jobs-limit 2 --workspace-name "exampleWorkspace" 
```
##### Delete #####
```
az synapse integration-runtime-node delete --integration-runtime-name "exampleIntegrationRuntime" --node-name "Node_1" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-credentials ####
##### Sync #####
```
az synapse integration-runtime-credentials sync --integration-runtime-name "exampleIntegrationRuntime" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-connection-info ####
##### Get #####
```
az synapse integration-runtime-connection-info get --integration-runtime-name "exampleIntegrationRuntime" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-auth-key ####
##### List #####
```
az synapse integration-runtime-auth-key list --integration-runtime-name "exampleIntegrationRuntime" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
##### Regenerate #####
```
az synapse integration-runtime-auth-key regenerate --integration-runtime-name "exampleIntegrationRuntime" \
    --key-name "authKey2" --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-monitoring-data ####
##### Get #####
```
az synapse integration-runtime-monitoring-data get --integration-runtime-name "exampleIntegrationRuntime" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse integration-runtime-status ####
##### Get #####
```
az synapse integration-runtime-status get --integration-runtime-name "exampleIntegrationRuntime" \
    --resource-group "exampleResourceGroup" --workspace-name "exampleWorkspace" 
```
#### synapse private-link-resource ####
##### List #####
```
az synapse private-link-resource list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### Show #####
```
az synapse private-link-resource show --name "sql" --resource-group "ExampleResourceGroup" \
    --workspace-name "ExampleWorkspace" 
```
#### synapse private-endpoint-connection ####
##### Create #####
```
az synapse private-endpoint-connection create --name "ExamplePrivateEndpointConnection" \
    --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace" 

az synapse private-endpoint-connection wait --created --name "{myPrivateEndpointConnection}" --resource-group "{rg}"
```
##### Show #####
```
az synapse private-endpoint-connection show --name "ExamplePrivateEndpointConnection" \
    --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace" 
```
##### List #####
```
az synapse private-endpoint-connection list --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace"
```
##### Delete #####
```
az synapse private-endpoint-connection delete --name "ExamplePrivateEndpointConnection" \
    --resource-group "ExampleResourceGroup" --workspace-name "ExampleWorkspace" 
```
#### synapse private-link-hub ####
##### Create #####
```
az synapse private-link-hub create --location "East US" --tags key="value" --name "privateLinkHub1" \
    --resource-group "resourceGroup1" 
```
##### Show #####
```
az synapse private-link-hub show --name "privateLinkHub1" --resource-group "resourceGroup1"
```
##### List #####
```
az synapse private-link-hub list --resource-group "resourceGroup1"
```
##### Update #####
```
az synapse private-link-hub update --name "privateLinkHub1" --tags key="value" --resource-group "resourceGroup1"
```
##### Delete #####
```
az synapse private-link-hub delete --name "privateLinkHub1" --resource-group "resourceGroup1"
```