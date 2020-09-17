# Azure CLI Module Creation Report

## EXTENSION
|CLI Extension|Command Groups|
|---------|------------|
|az attestation|[groups](#CommandGroups)

## GROUPS
### <a name="CommandGroups">Command groups in 'az attestation' extension </a>
|CLI Command Group|Group Swagger name|Commands|
|---------|------------|--------|
|az attestation|Operation|[commands](#CommandsInOperation)|
|az attestation attestation-provider|AttestationProviders|[commands](#CommandsInAttestationProviders)|

## COMMANDS
### <a name="CommandsInOperation">Commands in 'az attestation' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az attestation create-provider](#OperationCreate)|Create|[Parameters](#ParametersOperationCreate)|Not Found|
|[az attestation list-operation](#OperationList)|List|[Parameters](#ParametersOperationList)|Not Found|

### <a name="CommandsInAttestationProviders">Commands in 'az attestation attestation-provider' group</a>
|CLI Command|Operation Swagger name|Parameters|Examples|
|---------|------------|--------|-----------|
|[az attestation attestation-provider provider list](#AttestationProvidersListByResourceGroup)|ListByResourceGroup|[Parameters](#ParametersAttestationProvidersListByResourceGroup)|Not Found|
|[az attestation attestation-provider provider list](#AttestationProvidersList)|List|[Parameters](#ParametersAttestationProvidersList)|Not Found|
|[az attestation attestation-provider show](#AttestationProvidersGet)|Get|[Parameters](#ParametersAttestationProvidersGet)|Not Found|
|[az attestation attestation-provider update](#AttestationProvidersUpdate)|Update|[Parameters](#ParametersAttestationProvidersUpdate)|Not Found|
|[az attestation attestation-provider delete](#AttestationProvidersDelete)|Delete|[Parameters](#ParametersAttestationProvidersDelete)|Not Found|


## COMMAND DETAILS

### group 'az attestation'
#### <a name="OperationCreate">Command 'az attestation create-provider'</a>

##### <a name="ParametersOperationCreate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service|provider_name|providerName|
|**--location**|string|The supported Azure location where the attestation service instance should be created.|location|location|
|**--tags**|dictionary|The tags that will be assigned to the attestation service instance.|tags|tags|
|**--attestation-policy**|string|Name of attestation policy.|attestation_policy|attestationPolicy|
|**--policy-signing-certificates-keys**|array|The value of the "keys" parameter is an array of JWK values.  By default, the order of the JWK values within the array does not imply an order of preference among them, although applications of JWK Sets can choose to assign a meaning to the order for their purposes, if desired.|keys|keys|

#### <a name="OperationList">Command 'az attestation list-operation'</a>


### group 'az attestation attestation-provider'
#### <a name="AttestationProvidersListByResourceGroup">Command 'az attestation attestation-provider provider list'</a>

##### <a name="ParametersAttestationProvidersListByResourceGroup">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
#### <a name="AttestationProvidersList">Command 'az attestation attestation-provider provider list'</a>

|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|

#### <a name="AttestationProvidersGet">Command 'az attestation attestation-provider show'</a>

##### <a name="ParametersAttestationProvidersGet">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service instance|provider_name|providerName|

#### <a name="AttestationProvidersUpdate">Command 'az attestation attestation-provider update'</a>

##### <a name="ParametersAttestationProvidersUpdate">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service|provider_name|providerName|
|**--tags**|dictionary|The tags that will be assigned to the attestation service instance.|tags|tags|

#### <a name="AttestationProvidersDelete">Command 'az attestation attestation-provider delete'</a>

##### <a name="ParametersAttestationProvidersDelete">Parameters</a> 
|Option|Type|Description|Path (SDK)|Swagger name|
|------|----|-----------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service|provider_name|providerName|
