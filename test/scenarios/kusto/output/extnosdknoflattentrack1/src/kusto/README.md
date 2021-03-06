# Azure CLI kusto Extension #
This is the extension for kusto

### How to use ###
Install this extension using the below CLI command
```
az extension add --name kusto
```

### Included Features ###
#### kusto cluster ####
##### Create #####
```
az kusto cluster create --cluster-name "kustoclusterrptest4" --type "SystemAssigned" --location "westus" \
    --enable-double-encryption false --enable-purge true --enable-streaming-ingest true --name "Standard_L8s" \
    --capacity 2 --tier "Standard" --resource-group "kustorptest" 

az kusto cluster wait --created --cluster-name "{myCluster}" --resource-group "{rg}"
```
##### Show #####
```
az kusto cluster show --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### List #####
```
az kusto cluster list --resource-group "kustorptest"
```
##### Update #####
```
az kusto cluster update --cluster-name "kustoclusterrptest4" --type "SystemAssigned" --location "westus" \
    --enable-purge true --enable-streaming-ingest true \
    --key-vault-properties key-name="keyName" key-vault-uri="https://dummy.keyvault.com" key-version="keyVersion" \
    --resource-group "kustorptest" 
```
##### Add-language-extension #####
```
az kusto cluster add-language-extension --name "kustoclusterrptest4" --value language-extension-name="PYTHON" \
    --value language-extension-name="R" --resource-group "kustorptest" 
```
##### Detach-follower-database #####
```
az kusto cluster detach-follower-database --name "kustoclusterrptest4" \
    --attached-database-configuration-name "myAttachedDatabaseConfiguration" \
    --cluster-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.Kusto/clusters/leader4" \
    --resource-group "kustorptest" 
```
##### Diagnose-virtual-network #####
```
az kusto cluster diagnose-virtual-network --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### List-follower-database #####
```
az kusto cluster list-follower-database --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### List-language-extension #####
```
az kusto cluster list-language-extension --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### List-sku #####
```
az kusto cluster list-sku --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### Remove-language-extension #####
```
az kusto cluster remove-language-extension --name "kustoclusterrptest4" --value language-extension-name="PYTHON" \
    --value language-extension-name="R" --resource-group "kustorptest" 
```
##### Start #####
```
az kusto cluster start --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### Stop #####
```
az kusto cluster stop --name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### Delete #####
```
az kusto cluster delete --name "kustoclusterrptest4" --resource-group "kustorptest"
```
#### kusto cluster-principal-assignment ####
##### Create #####
```
az kusto cluster-principal-assignment create --cluster-name "kustoclusterrptest4" \
    --principal-id "87654321-1234-1234-1234-123456789123" --principal-type "App" --role "AllDatabasesAdmin" \
    --tenant-id "12345678-1234-1234-1234-123456789123" --principal-assignment-name "kustoprincipal1" \
    --resource-group "kustorptest" 
```
##### Show #####
```
az kusto cluster-principal-assignment show --cluster-name "kustoclusterrptest4" \
    --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" 
```
##### List #####
```
az kusto cluster-principal-assignment list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### Delete #####
```
az kusto cluster-principal-assignment delete --cluster-name "kustoclusterrptest4" \
    --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" 
```
#### kusto database ####
##### Create #####
```
az kusto database create --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --read-write-database location="westus" soft-delete-period="P1D" --resource-group "kustorptest" 
```
##### Show #####
```
az kusto database show --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --resource-group "kustorptest" 
```
##### List #####
```
az kusto database list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### Update #####
```
az kusto database update --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --parameters "{\\"properties\\":{\\"softDeletePeriod\\":\\"P1D\\"}}" --resource-group "kustorptest" 
```
##### Add-principal #####
```
az kusto database add-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --value name="Some User" type="User" app-id="" email="user@microsoft.com" fqn="aaduser=some_guid" role="Admin" \
    --value name="Kusto" type="Group" app-id="" email="kusto@microsoft.com" fqn="aadgroup=some_guid" role="Viewer" \
    --value name="SomeApp" type="App" app-id="some_guid_app_id" email="" fqn="aadapp=some_guid_app_id" role="Admin" \
    --resource-group "kustorptest" 
```
##### List-principal #####
```
az kusto database list-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --resource-group "kustorptest" 
```
##### Remove-principal #####
```
az kusto database remove-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --value name="Some User" type="User" app-id="" email="user@microsoft.com" fqn="aaduser=some_guid" role="Admin" \
    --value name="Kusto" type="Group" app-id="" email="kusto@microsoft.com" fqn="aadgroup=some_guid" role="Viewer" \
    --value name="SomeApp" type="App" app-id="some_guid_app_id" email="" fqn="aadapp=some_guid_app_id" role="Admin" \
    --resource-group "kustorptest" 
```
##### Delete #####
```
az kusto database delete --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --resource-group "kustorptest" 
```
#### kusto database-principal-assignment ####
##### Create #####
```
az kusto database-principal-assignment create --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
    --principal-id "87654321-1234-1234-1234-123456789123" --principal-type "App" --role "Admin" \
    --tenant-id "12345678-1234-1234-1234-123456789123" --principal-assignment-name "kustoprincipal1" \
    --resource-group "kustorptest" 
```
##### Show #####
```
az kusto database-principal-assignment show --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
    --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" 
```
##### List #####
```
az kusto database-principal-assignment list --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
    --resource-group "kustorptest" 
```
##### Delete #####
```
az kusto database-principal-assignment delete --cluster-name "kustoclusterrptest4" --database-name "Kustodatabase8" \
    --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" 
```
#### kusto attached-database-configuration ####
##### Create #####
```
az kusto attached-database-configuration create --name "attachedDatabaseConfigurations1" \
    --cluster-name "kustoclusterrptest4" --location "westus" \
    --cluster-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.Kusto/Clusters/KustoClusterLeader" \
    --database-name "kustodatabase" --default-principals-modification-kind "Union" --resource-group "kustorptest" 

az kusto attached-database-configuration wait --created --name "{myAttachedDatabaseConfiguration2}" \
    --resource-group "{rg}" 
```
##### Show #####
```
az kusto attached-database-configuration show --name "attachedDatabaseConfigurations1" \
    --cluster-name "kustoclusterrptest4" --resource-group "kustorptest" 
```
##### List #####
```
az kusto attached-database-configuration list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
```
##### Delete #####
```
az kusto attached-database-configuration delete --name "attachedDatabaseConfigurations1" \
    --cluster-name "kustoclusterrptest4" --resource-group "kustorptest" 
```
#### kusto data-connection ####
##### Event-hub create #####
```
az kusto data-connection event-hub create --cluster-name "kustoclusterrptest4" --name "DataConnections8" \
    --database-name "KustoDatabase8" --location "westus" --consumer-group "testConsumerGroup1" \
    --event-hub-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" \
    --resource-group "kustorptest" 
```
##### Show #####
```
az kusto data-connection show --cluster-name "kustoclusterrptest4" --name "DataConnections8" \
    --database-name "KustoDatabase8" --resource-group "kustorptest" 
```
##### List #####
```
az kusto data-connection list --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
    --resource-group "kustorptest" 
```
##### Event-hub update #####
```
az kusto data-connection event-hub update --cluster-name "kustoclusterrptest4" --name "DataConnections8" \
    --database-name "KustoDatabase8" --location "westus" --consumer-group "testConsumerGroup1" \
    --event-hub-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" \
    --resource-group "kustorptest" 
```
##### Event-hub data-connection-validation #####
```
az kusto data-connection event-hub data-connection-validation --cluster-name "kustoclusterrptest4" \
    --database-name "KustoDatabase8" --name "DataConnections8" --consumer-group "testConsumerGroup1" \
    --event-hub-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Microsoft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" \
    --resource-group "kustorptest" 
```
##### Delete #####
```
az kusto data-connection delete --cluster-name "kustoclusterrptest4" --name "kustoeventhubconnection1" \
    --database-name "KustoDatabase8" --resource-group "kustorptest" 
```