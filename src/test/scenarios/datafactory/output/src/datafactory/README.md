# Azure CLI datafactory Extension #
This is the extension for datafactory

### How to use ###
Install this extension using the below CLI command
```
az extension add --name datafactory
```

### Included Features ###
#### datafactory ####
##### Create #####
```
az datafactory create --location "East US" --zones "earth" --zones "moon" --name "myFactory" \
    --resource-group "myResourceGroup" 
```
##### Show #####
```
az datafactory show --name "myFactory" --resource-group "myResourceGroup"
```
##### List #####
```
az datafactory list --resource-group "myResourceGroup"
```
##### Update #####
```
az datafactory update --name "myFactory" --tags exampleTag="exampleValue" --resource-group "myResourceGroup"
```
##### Configure-factory-repo #####
```
az datafactory configure-factory-repo \
    --factory-resource-id "/subscriptions/12345678-1234-1234-1234-12345678abc/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myFactory" \
    --factory-vsts-configuration account-name="ADF" collaboration-branch="master" last-commit-id="" project-name="project" repository-name="repo" root-folder="/" tenant-id="" \
    --location-id "East US" 
```
##### Get-data-plane-access #####
```
az datafactory get-data-plane-access --name "myFactory" --access-resource-path "" \
    --expire-time "2018-11-10T09:46:20.2659347Z" --permissions "r" --profile-name "DefaultProfile" \
    --start-time "2018-11-10T02:46:20.2659347Z" --resource-group "myResourceGroup" 
```
##### Get-git-hub-access-token #####
```
az datafactory get-git-hub-access-token --name "myFactory" --git-hub-access-code "some" \
    --git-hub-access-token-base-url "some" --git-hub-client-id "some" --resource-group "myResourceGroup" 
```
##### Delete #####
```
az datafactory delete --name "myFactory" --resource-group "myResourceGroup"
```
#### datafactory trigger ####
##### Create #####
```
az datafactory trigger create --factory-name "myFactory" --resource-group "myResourceGroup" \
    --properties "{\\"type\\":\\"ScheduleTrigger\\",\\"pipelines\\":[{\\"parameters\\":{\\"OutputBlobNameList\\":[\\"exampleoutput.csv\\"]},\\"pipelineReference\\":{\\"type\\":\\"PipelineReference\\",\\"referenceName\\":\\"examplePipeline\\"}}],\\"typeProperties\\":{\\"recurrence\\":{\\"endTime\\":\\"2018-06-16T00:55:13.8441801Z\\",\\"frequency\\":\\"Minute\\",\\"interval\\":4,\\"startTime\\":\\"2018-06-16T00:39:13.8441801Z\\",\\"timeZone\\":\\"UTC\\"}}}" \
    --name "myTrigger" 
```
##### Update #####
```
az datafactory trigger update --factory-name "myFactory" --resource-group "myResourceGroup" \
    --description "Example description" --name "myTrigger" 
```
##### List #####
```
az datafactory trigger list --factory-name "myFactory" --resource-group "myResourceGroup"
```
##### Show #####
```
az datafactory trigger show --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### Get-event-subscription-status #####
```
az datafactory trigger get-event-subscription-status --factory-name "myFactory" --resource-group "myResourceGroup" \
    --name "myTrigger" 
```
##### Query-by-factory #####
```
az datafactory trigger query-by-factory --factory-name "myFactory" --parent-trigger-name "myTrigger" \
    --resource-group "myResourceGroup" 
```
##### Start #####
```
az datafactory trigger start --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### Stop #####
```
az datafactory trigger stop --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
##### Subscribe-to-event #####
```
az datafactory trigger subscribe-to-event --factory-name "myFactory" --resource-group "myResourceGroup" \
    --name "myTrigger" 
```
##### Unsubscribe-from-event #####
```
az datafactory trigger unsubscribe-from-event --factory-name "myFactory" --resource-group "myResourceGroup" \
    --name "myTrigger" 
```
##### Delete #####
```
az datafactory trigger delete --factory-name "myFactory" --resource-group "myResourceGroup" --name "myTrigger"
```
#### datafactory integration-runtime ####
##### Self-hosted create #####
```
az datafactory integration-runtime self-hosted create --factory-name "myFactory" \
    --description "A selfhosted integration runtime" --name "myIntegrationRuntime" --resource-group "myResourceGroup" 
```
##### Show #####
```
az datafactory integration-runtime show --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### Linked-integration-runtime create #####
```
az datafactory integration-runtime linked-integration-runtime create --name "bfa92911-9fb6-4fbe-8f23-beae87bc1c83" \
    --data-factory-location "West US" --data-factory-name "e9955d6d-56ea-4be3-841c-52a12c1a9981" \
    --subscription-id "061774c7-4b5a-4159-a55b-365581830283" --factory-name "myFactory" \
    --integration-runtime-name "myIntegrationRuntime" --resource-group "myResourceGroup" \
    --subscription-id "12345678-1234-1234-1234-12345678abc" 
```
##### List #####
```
az datafactory integration-runtime list --factory-name "myFactory" --resource-group "myResourceGroup"
```
##### Update #####
```
az datafactory integration-runtime update --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" --auto-update "Off" --update-delay-offset "\\"PT3H\\"" 
```
##### Get-connection-info #####
```
az datafactory integration-runtime get-connection-info --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### Get-monitoring-data #####
```
az datafactory integration-runtime get-monitoring-data --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### Get-status #####
```
az datafactory integration-runtime get-status --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### List-auth-key #####
```
az datafactory integration-runtime list-auth-key --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### Regenerate-auth-key #####
```
az datafactory integration-runtime regenerate-auth-key --factory-name "myFactory" --name "myIntegrationRuntime" \
    --key-name "authKey2" --resource-group "myResourceGroup" 
```
##### Remove-link #####
```
az datafactory integration-runtime remove-link --factory-name "myFactory" --name "myIntegrationRuntime" \
    --linked-factory-name "exampleFactoryName-linked" --resource-group "myResourceGroup" 
```
##### Start #####
```
az datafactory integration-runtime start --factory-name "myFactory" --name "myIntegrationRuntime2" \
    --resource-group "myResourceGroup" 
```
##### Stop #####
```
az datafactory integration-runtime stop --factory-name "myFactory" --name "myIntegrationRuntime2" \
    --resource-group "myResourceGroup" 
```
##### Sync-credentials #####
```
az datafactory integration-runtime sync-credentials --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### Upgrade #####
```
az datafactory integration-runtime upgrade --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```
##### Delete #####
```
az datafactory integration-runtime delete --factory-name "myFactory" --name "myIntegrationRuntime" \
    --resource-group "myResourceGroup" 
```