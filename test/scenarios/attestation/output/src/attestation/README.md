# Azure CLI attestation Extension #
This is the extension for attestation

### How to use ###
Install this extension using the below CLI command
```
az extension add --name attestation
```

### Included Features ###
#### attestation ####
##### Create-provider #####
```
az attestation create-provider --provider-name "myattestationprovider" --resource-group "MyResourceGroup"
```
##### List-operation #####
```
az attestation list-operation
```
#### attestation attestation-provider ####
##### Provider list #####
```
az attestation attestation-provider provider list --resource-group "testrg1"
```
##### Show #####
```
az attestation attestation-provider show --provider-name "myattestationprovider" --resource-group "MyResourceGroup"
```
##### Update #####
```
az attestation attestation-provider update --provider-name "myattestationprovider" --resource-group "MyResourceGroup" \
    --tags Property1="Value1" Property2="Value2" Property3="Value3" 
```
##### Delete #####
```
az attestation attestation-provider delete --provider-name "myattestationprovider" \
    --resource-group "sample-resource-group" 
```