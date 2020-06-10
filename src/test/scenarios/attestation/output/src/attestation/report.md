# Azure CLI Module Creation Report

### attestation attestation-provider delete

delete a attestation attestation-provider.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|attestation attestation-provider|AttestationProviders|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|Delete|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service|Delete|provider_name|providerName|

### attestation attestation-provider provider list

provider list a attestation attestation-provider.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|attestation attestation-provider|AttestationProviders|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|ListByResourceGroup|resource_group_name|resourceGroupName|

### attestation attestation-provider show

show a attestation attestation-provider.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|attestation attestation-provider|AttestationProviders|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|Get|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service instance|Get|provider_name|providerName|

### attestation attestation-provider update

update a attestation attestation-provider.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|attestation attestation-provider|AttestationProviders|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|Update|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service|Update|provider_name|providerName|
|**--tags**|dictionary|The tags that will be assigned to the attestation service instance.|Update|tags|tags|

### attestation create-provider

create-provider a attestation.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|attestation|Operation|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
|**--resource-group-name**|string|The name of the resource group. The name is case insensitive.|Create|resource_group_name|resourceGroupName|
|**--provider-name**|string|Name of the attestation service|Create|provider_name|providerName|
|**--location**|string|The supported Azure location where the attestation service instance should be created.|Create|location|location|
|**--tags**|dictionary|The tags that will be assigned to the attestation service instance.|Create|tags|tags|
|**--attestation-policy**|string|Name of attestation policy.|Create|attestation_policy|attestationPolicy|
|**--policy-signing-certificates-keys**|array|The value of the "keys" parameter is an array of JWK values.  By default, the order of the JWK values within the array does not imply an order of preference among them, although applications of JWK Sets can choose to assign a meaning to the order for their purposes, if desired.|Create|keys|keys|

### attestation list-operation

list-operation a attestation.

#### Command group
|Name (az)|Swagger name|
|---------|------------|
|attestation|Operation|

#### Parameters
|Option|Type|Description|Command swagger name|Path (SDK)|Swagger name|
|------|----|-----------|--------------------|----------|------------|
