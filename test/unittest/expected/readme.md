# Azure CLI desktopvirtualization Extension #
This is the extension for desktopvirtualization

### How to use ###
Install this extension using the below CLI command
```
az extension add --name desktopvirtualization
```

### Included Features ###
#### desktopvirtualization workspace ####
##### Create #####
```
az desktopvirtualization workspace create --resource-group "resourceGroup1" --location "centralus" \
    --description "des1" --friendly-name "friendly" --tags tag1="value1" tag2="value2" --name "workspace1" 
```
##### Show #####
```
az desktopvirtualization workspace show --resource-group "resourceGroup1" --name "workspace1"
```
##### List #####
```
az desktopvirtualization workspace list --resource-group "resourceGroup1"
```
##### Update #####
```
az desktopvirtualization workspace update --resource-group "resourceGroup1" --description "des1" \
    --friendly-name "friendly" --tags tag1="value1" tag2="value2" --name "workspace1" 
```
##### Delete #####
```
az desktopvirtualization workspace delete --resource-group "resourceGroup1" --name "workspace1"
```
#### desktopvirtualization scaling-plan ####
##### Create #####
```
az desktopvirtualization scaling-plan create --resource-group "resourceGroup1" --location "centralus" \
    --description "des1" --exclusion-tag "value" --friendly-name "friendly" \
    --host-pool-references host-pool-arm-path="/subscriptions/daefabc0-95b4-48b3-b645-8a753a63c4fa/resourceGroups/resourceGroup1/providers/Microsoft.DesktopVirtualization/hostPools/hostPool1" scaling-plan-enabled=true \
    --host-pool-type "Personal" \
    --schedules name="schedule1" days-of-week="Monday" days-of-week="Tuesday" days-of-week="Wednesday" days-of-week="Thursday" days-of-week="Friday" off-peak-load-balancing-algorithm="DepthFirst" off-peak-start-time="2020-11-10T20:00:00.000Z" peak-load-balancing-algorithm="BreadthFirst" peak-start-time="2020-11-10T08:00:00.000Z" ramp-down-capacity-threshold-pct=50 ramp-down-force-logoff-users=true ramp-down-load-balancing-algorithm="DepthFirst" ramp-down-minimum-hosts-pct=20 ramp-down-notification-message="message" ramp-down-start-time="2020-11-10T18:00:00.000Z" ramp-down-wait-time-minutes=30 ramp-up-capacity-threshold-pct=80 ramp-up-load-balancing-algorithm="DepthFirst" ramp-up-minimum-hosts-pct=20 ramp-up-start-time="2020-11-10T06:00:00.000Z" \
    --time-zone "" --tags tag1="value1" tag2="value2" --name "scalingPlan1" 
```
##### Show #####
```
az desktopvirtualization scaling-plan show --resource-group "resourceGroup1" --name "scalingPlan1"
```
##### List #####
```
az desktopvirtualization scaling-plan list --host-pool-name "hostPool1" --resource-group "resourceGroup1"
```
##### Update #####
```
az desktopvirtualization scaling-plan update --resource-group "resourceGroup1" --name "scalingPlan1" \
    --description "des1" --exclusion-tag "value" --friendly-name "friendly" \
    --host-pool-references host-pool-arm-path="/subscriptions/daefabc0-95b4-48b3-b645-8a753a63c4fa/resourceGroups/resourceGroup1/providers/Microsoft.DesktopVirtualization/hostPools/hostPool1" scaling-plan-enabled=true \
    --host-pool-type "Personal" \
    --schedules name="schedule1" days-of-week="Monday" days-of-week="Tuesday" days-of-week="Wednesday" days-of-week="Thursday" days-of-week="Friday" off-peak-load-balancing-algorithm="DepthFirst" off-peak-start-time="2020-11-10T20:00:00.000Z" peak-load-balancing-algorithm="BreadthFirst" peak-start-time="2020-11-10T08:00:00.000Z" ramp-down-capacity-threshold-pct=50 ramp-down-force-logoff-users=true ramp-down-load-balancing-algorithm="DepthFirst" ramp-down-minimum-hosts-pct=20 ramp-down-notification-message="message" ramp-down-start-time="2020-11-10T18:00:00.000Z" ramp-down-wait-time-minutes=30 ramp-up-capacity-threshold-pct=80 ramp-up-load-balancing-algorithm="DepthFirst" ramp-up-minimum-hosts-pct=20 ramp-up-start-time="2020-11-10T06:00:00.000Z" \
    --time-zone "" --tags tag1="value1" tag2="value2" 
```
##### Delete #####
```
az desktopvirtualization scaling-plan delete --resource-group "resourceGroup1" --name "scalingPlan1"
```
#### desktopvirtualization applicationgroup ####
##### Create #####
```
az desktopvirtualization applicationgroup create --location "centralus" --description "des1" \
    --application-group-type "RemoteApp" --friendly-name "friendly" \
    --host-pool-arm-path "/subscriptions/daefabc0-95b4-48b3-b645-8a753a63c4fa/resourceGroups/resourceGroup1/providers/Microsoft.DesktopVirtualization/hostPools/hostPool1" \
    --migration-request migration-path="TenantGroups/{defaultV1TenantGroup.Name}/Tenants/{defaultV1Tenant.Name}/HostPools/{sessionHostPool.Name}" operation="Start" \
    --tags tag1="value1" tag2="value2" --name "applicationGroup1" --resource-group "resourceGroup1" 
```
##### Show #####
```
az desktopvirtualization applicationgroup show --name "applicationGroup1" --resource-group "resourceGroup1"
```
##### List #####
```
az desktopvirtualization applicationgroup list --filter "applicationGroupType eq \'RailApplication\'" \
    --resource-group "resourceGroup1" 
```
##### Update #####
```
az desktopvirtualization applicationgroup update --description "des1" --friendly-name "friendly" \
    --tags tag1="value1" tag2="value2" --name "applicationGroup1" --resource-group "resourceGroup1" 
```
##### Delete #####
```
az desktopvirtualization applicationgroup delete --name "applicationGroup1" --resource-group "resourceGroup1"
```
#### desktopvirtualization hostpool ####
##### Create #####
```
az desktopvirtualization hostpool create --location "centralus" --description "des1" --friendly-name "friendly" \
    --host-pool-type "Pooled" --load-balancer-type "BreadthFirst" --max-session-limit 999999 \
    --migration-request migration-path="TenantGroups/{defaultV1TenantGroup.Name}/Tenants/{defaultV1Tenant.Name}/HostPools/{sessionHostPool.Name}" operation="Start" \
    --personal-desktop-assignment-type "Automatic" --preferred-app-group-type "Desktop" \
    --registration-info expiration-time="2020-10-01T14:01:54.9571247Z" registration-token-operation="Update" \
    --sso-client-id "client" --sso-client-secret-key-vault-path "https://keyvault/secret" \
    --sso-secret-type "SharedKey" --ssoadfs-authority "https://adfs" --start-vm-on-connect false \
    --vm-template "{json:json}" --tags tag1="value1" tag2="value2" --name "hostPool1" \
    --resource-group "resourceGroup1" 
```
##### Show #####
```
az desktopvirtualization hostpool show --name "hostPool1" --resource-group "resourceGroup1"
```
##### List #####
```
az desktopvirtualization hostpool list --resource-group "resourceGroup1"
```
##### Update #####
```
az desktopvirtualization hostpool update --description "des1" --friendly-name "friendly" \
    --load-balancer-type "BreadthFirst" --max-session-limit 999999 --personal-desktop-assignment-type "Automatic" \
    --registration-info expiration-time="2020-10-01T15:01:54.9571247Z" registration-token-operation="Update" \
    --sso-client-id "client" --sso-client-secret-key-vault-path "https://keyvault/secret" \
    --sso-secret-type "SharedKey" --ssoadfs-authority "https://adfs" --start-vm-on-connect false \
    --vm-template "{json:json}" --tags tag1="value1" tag2="value2" --name "hostPool1" \
    --resource-group "resourceGroup1" 
```
##### Retrieve-registration-token #####
```
az desktopvirtualization hostpool retrieve-registration-token --name "hostPool1" --resource-group "resourceGroup1"
```
##### Delete #####
```
az desktopvirtualization hostpool delete --force true --name "hostPool1" --resource-group "resourceGroup1"
```
#### desktopvirtualization msix-package ####
##### Create #####
```
az desktopvirtualization msix-package create --host-pool-name "hostpool1" --display-name "displayname" \
    --image-path "imagepath" --is-active false --is-regular-registration false \
    --last-updated "2008-09-22T14:01:54.9571247Z" \
    --package-applications description="application-desc" app-id="ApplicationId" app-user-model-id="AppUserModelId" friendly-name="friendlyname" icon-image-name="Apptile" raw-icon="VGhpcyBpcyBhIHN0cmluZyB0byBoYXNo" raw-png="VGhpcyBpcyBhIHN0cmluZyB0byBoYXNo" \
    --package-dependencies dependency-name="MsixTest_Dependency_Name" min-version="version" publisher="PublishedName" \
    --package-family-name "MsixPackage_FamilyName" --package-name "MsixPackage_name" \
    --package-relative-path "packagerelativepath" --version "version" --msix-package-full-name "msixpackagefullname" \
    --resource-group "resourceGroup1" 
```
##### Show #####
```
az desktopvirtualization msix-package show --host-pool-name "hostpool1" --msix-package-full-name "packagefullname" \
    --resource-group "resourceGroup1" 
```
##### List #####
```
az desktopvirtualization msix-package list --host-pool-name "hostpool1" --resource-group "resourceGroup1"
```
##### Update #####
```
az desktopvirtualization msix-package update --host-pool-name "hostpool1" --display-name "displayname" \
    --is-active true --is-regular-registration false --msix-package-full-name "msixpackagefullname" \
    --resource-group "resourceGroup1" 
```
##### Delete #####
```
az desktopvirtualization msix-package delete --host-pool-name "hostpool1" --msix-package-full-name "packagefullname" \
    --resource-group "resourceGroup1" 
```
#### desktopvirtualization msix-image ####
##### Expand #####
```
az desktopvirtualization msix-image expand --host-pool-name "hostpool1" --uri "imagepath" \
    --resource-group "resourceGroup1" 
```