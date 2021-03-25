# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------
# pylint: disable=too-many-lines

from knack.help_files import helps


helps['kusto'] = '''
    type: group
    short-summary: Manage Kusto
'''

helps['kusto cluster'] = """
    type: group
    short-summary: Manage cluster with kusto
"""

helps['kusto cluster list'] = """
    type: command
    short-summary: "Lists all Kusto clusters within a resource group. And Lists all Kusto clusters within a \
subscription."
    examples:
      - name: KustoClustersListByResourceGroup
        text: |-
               az kusto cluster list --resource-group "kustorptest"
      - name: KustoClustersList
        text: |-
               az kusto cluster list
"""

helps['kusto cluster show'] = """
    type: command
    short-summary: "Gets a Kusto cluster."
    examples:
      - name: KustoClustersGet
        text: |-
               az kusto cluster show --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster create'] = """
    type: command
    short-summary: "Create a Kusto cluster."
    parameters:
      - name: --trusted-external-tenants
        short-summary: "The cluster's external tenants."
        long-summary: |
            Usage: --trusted-external-tenants value=XX

            value: GUID representing an external tenant.

            Multiple actions can be specified by using more than one --trusted-external-tenants argument.
      - name: --optimized-autoscale
        short-summary: "Optimized auto scale definition."
        long-summary: |
            Usage: --optimized-autoscale version=XX is-enabled=XX minimum=XX maximum=XX

            version: Required. The version of the template defined, for instance 1.
            is-enabled: Required. A boolean value that indicate if the optimized autoscale feature is enabled or not.
            minimum: Required. Minimum allowed instances count.
            maximum: Required. Maximum allowed instances count.
      - name: --virtual-network-configuration
        short-summary: "Virtual network definition."
        long-summary: |
            Usage: --virtual-network-configuration subnet-id=XX engine-public-ip-id=XX data-management-public-ip-id=XX

            subnet-id: Required. The subnet resource id.
            engine-public-ip-id: Required. Engine service's public IP address resource id.
            data-management-public-ip-id: Required. Data management's service public IP address resource id.
      - name: --key-vault-properties
        short-summary: "KeyVault properties for the cluster encryption."
        long-summary: |
            Usage: --key-vault-properties key-name=XX key-version=XX key-vault-uri=XX

            key-name: Required. The name of the key vault key.
            key-version: Required. The version of the key vault key.
            key-vault-uri: Required. The Uri of the key vault.
    examples:
      - name: KustoClustersCreateOrUpdate
        text: |-
               az kusto cluster create --cluster-name "kustoclusterrptest4" --type "SystemAssigned" --location \
"westus" --enable-double-encryption false --enable-purge true --enable-streaming-ingest true --name "Standard_L8s" \
--capacity 2 --tier "Standard" --resource-group "kustorptest"
"""

helps['kusto cluster update'] = """
    type: command
    short-summary: "Update a Kusto cluster."
    parameters:
      - name: --trusted-external-tenants
        short-summary: "The cluster's external tenants."
        long-summary: |
            Usage: --trusted-external-tenants value=XX

            value: GUID representing an external tenant.

            Multiple actions can be specified by using more than one --trusted-external-tenants argument.
      - name: --optimized-autoscale
        short-summary: "Optimized auto scale definition."
        long-summary: |
            Usage: --optimized-autoscale version=XX is-enabled=XX minimum=XX maximum=XX

            version: Required. The version of the template defined, for instance 1.
            is-enabled: Required. A boolean value that indicate if the optimized autoscale feature is enabled or not.
            minimum: Required. Minimum allowed instances count.
            maximum: Required. Maximum allowed instances count.
      - name: --virtual-network-configuration
        short-summary: "Virtual network definition."
        long-summary: |
            Usage: --virtual-network-configuration subnet-id=XX engine-public-ip-id=XX data-management-public-ip-id=XX

            subnet-id: Required. The subnet resource id.
            engine-public-ip-id: Required. Engine service's public IP address resource id.
            data-management-public-ip-id: Required. Data management's service public IP address resource id.
      - name: --key-vault-properties
        short-summary: "KeyVault properties for the cluster encryption."
        long-summary: |
            Usage: --key-vault-properties key-name=XX key-version=XX key-vault-uri=XX

            key-name: Required. The name of the key vault key.
            key-version: Required. The version of the key vault key.
            key-vault-uri: Required. The Uri of the key vault.
    examples:
      - name: KustoClustersUpdate
        text: |-
               az kusto cluster update --cluster-name "kustoclusterrptest4" --type "SystemAssigned" --location \
"westus" --enable-purge true --enable-streaming-ingest true --key-vault-properties key-name="keyName" \
key-vault-uri="https://dummy.keyvault.com" key-version="keyVersion" --resource-group "kustorptest"
"""

helps['kusto cluster delete'] = """
    type: command
    short-summary: "Deletes a Kusto cluster."
    examples:
      - name: KustoClustersDelete
        text: |-
               az kusto cluster delete --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster add-language-extension'] = """
    type: command
    short-summary: "Add a list of language extensions that can run within KQL queries."
    parameters:
      - name: --value
        short-summary: "The list of language extensions."
        long-summary: |
            Usage: --value language-extension-name=XX

            language-extension-name: The language extension name.

            Multiple actions can be specified by using more than one --value argument.
    examples:
      - name: KustoClusterAddLanguageExtensions
        text: |-
               az kusto cluster add-language-extension --name "kustoclusterrptest4" --value \
language-extension-name="PYTHON" --value language-extension-name="R" --resource-group "kustorptest"
"""

helps['kusto cluster detach-follower-database'] = """
    type: command
    short-summary: "Detaches all followers of a database owned by this cluster."
    examples:
      - name: KustoClusterDetachFollowerDatabases
        text: |-
               az kusto cluster detach-follower-database --name "kustoclusterrptest4" --attached-database-configuration\
-name "myAttachedDatabaseConfiguration" --cluster-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/reso\
urceGroups/kustorptest/providers/Microsoft.Kusto/clusters/leader4" --resource-group "kustorptest"
"""

helps['kusto cluster diagnose-virtual-network'] = """
    type: command
    short-summary: "Diagnoses network connectivity status for external resources on which the service is dependent \
on."
    examples:
      - name: KustoClusterDiagnoseVirtualNetwork
        text: |-
               az kusto cluster diagnose-virtual-network --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster list-follower-database'] = """
    type: command
    short-summary: "Returns a list of databases that are owned by this cluster and were followed by another cluster."
    examples:
      - name: KustoClusterListFollowerDatabases
        text: |-
               az kusto cluster list-follower-database --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster list-language-extension'] = """
    type: command
    short-summary: "Returns a list of language extensions that can run within KQL queries."
    examples:
      - name: KustoClusterListLanguageExtensions
        text: |-
               az kusto cluster list-language-extension --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster list-sku'] = """
    type: command
    short-summary: "Returns the SKUs available for the provided resource. And Lists eligible SKUs for Kusto resource \
provider."
    examples:
      - name: KustoClustersListResourceSkus
        text: |-
               az kusto cluster list-sku --name "kustoclusterrptest4" --resource-group "kustorptest"
      - name: KustoClustersListSkus
        text: |-
               az kusto cluster list-sku
"""

helps['kusto cluster remove-language-extension'] = """
    type: command
    short-summary: "Remove a list of language extensions that can run within KQL queries."
    parameters:
      - name: --value
        short-summary: "The list of language extensions."
        long-summary: |
            Usage: --value language-extension-name=XX

            language-extension-name: The language extension name.

            Multiple actions can be specified by using more than one --value argument.
    examples:
      - name: KustoClusterRemoveLanguageExtensions
        text: |-
               az kusto cluster remove-language-extension --name "kustoclusterrptest4" --value \
language-extension-name="PYTHON" --value language-extension-name="R" --resource-group "kustorptest"
"""

helps['kusto cluster start'] = """
    type: command
    short-summary: "Starts a Kusto cluster."
    examples:
      - name: KustoClustersStart
        text: |-
               az kusto cluster start --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster stop'] = """
    type: command
    short-summary: "Stops a Kusto cluster."
    examples:
      - name: KustoClustersStop
        text: |-
               az kusto cluster stop --name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto cluster wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the kusto cluster is met.
    examples:
      - name: Pause executing next line of CLI script until the kusto cluster is successfully created.
        text: |-
               az kusto cluster wait --name "kustoclusterrptest4" --resource-group "kustorptest" --created
      - name: Pause executing next line of CLI script until the kusto cluster is successfully updated.
        text: |-
               az kusto cluster wait --name "kustoclusterrptest4" --resource-group "kustorptest" --updated
      - name: Pause executing next line of CLI script until the kusto cluster is successfully deleted.
        text: |-
               az kusto cluster wait --name "kustoclusterrptest4" --resource-group "kustorptest" --deleted
"""

helps['kusto cluster-principal-assignment'] = """
    type: group
    short-summary: Manage cluster principal assignment with kusto
"""

helps['kusto cluster-principal-assignment list'] = """
    type: command
    short-summary: "Lists all Kusto cluster principalAssignments."
    examples:
      - name: KustoPrincipalAssignmentsList
        text: |-
               az kusto cluster-principal-assignment list --cluster-name "kustoclusterrptest4" --resource-group \
"kustorptest"
"""

helps['kusto cluster-principal-assignment show'] = """
    type: command
    short-summary: "Gets a Kusto cluster principalAssignment."
    examples:
      - name: KustoClusterPrincipalAssignmentsGet
        text: |-
               az kusto cluster-principal-assignment show --cluster-name "kustoclusterrptest4" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
"""

helps['kusto cluster-principal-assignment create'] = """
    type: command
    short-summary: "Create a Kusto cluster principalAssignment."
    examples:
      - name: KustoClusterPrincipalAssignmentsCreateOrUpdate
        text: |-
               az kusto cluster-principal-assignment create --cluster-name "kustoclusterrptest4" --principal-id \
"87654321-1234-1234-1234-123456789123" --principal-type "App" --role "AllDatabasesAdmin" --tenant-id \
"12345678-1234-1234-1234-123456789123" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
"""

helps['kusto cluster-principal-assignment update'] = """
    type: command
    short-summary: "Update a Kusto cluster principalAssignment."
"""

helps['kusto cluster-principal-assignment delete'] = """
    type: command
    short-summary: "Deletes a Kusto cluster principalAssignment."
    examples:
      - name: KustoClusterPrincipalAssignmentsDelete
        text: |-
               az kusto cluster-principal-assignment delete --cluster-name "kustoclusterrptest4" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
"""

helps['kusto cluster-principal-assignment wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the kusto cluster-principal-assignment is \
met.
    examples:
      - name: Pause executing next line of CLI script until the kusto cluster-principal-assignment is successfully \
created.
        text: |-
               az kusto cluster-principal-assignment wait --cluster-name "kustoclusterrptest4" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" --created
      - name: Pause executing next line of CLI script until the kusto cluster-principal-assignment is successfully \
updated.
        text: |-
               az kusto cluster-principal-assignment wait --cluster-name "kustoclusterrptest4" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" --updated
      - name: Pause executing next line of CLI script until the kusto cluster-principal-assignment is successfully \
deleted.
        text: |-
               az kusto cluster-principal-assignment wait --cluster-name "kustoclusterrptest4" \
--principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" --deleted
"""

helps['kusto database'] = """
    type: group
    short-summary: Manage database with kusto
"""

helps['kusto database list'] = """
    type: command
    short-summary: "Returns the list of databases of the given Kusto cluster."
    examples:
      - name: KustoDatabasesListByCluster
        text: |-
               az kusto database list --cluster-name "kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto database show'] = """
    type: command
    short-summary: "Returns a database."
    examples:
      - name: KustoDatabasesGet
        text: |-
               az kusto database show --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest"
"""

helps['kusto database create'] = """
    type: command
    short-summary: "Create a database."
    parameters:
      - name: --read-write-database
        short-summary: "Class representing a read write database."
        long-summary: |
            Usage: --read-write-database soft-delete-period=XX hot-cache-period=XX location=XX kind=XX

            soft-delete-period: The time the data should be kept before it stops being accessible to queries in \
TimeSpan.
            hot-cache-period: The time the data should be kept in cache for fast queries in TimeSpan.
            location: Resource location.
            kind: Required. Kind of the database
      - name: --read-only-following-database
        short-summary: "Class representing a read only following database."
        long-summary: |
            Usage: --read-only-following-database hot-cache-period=XX location=XX kind=XX

            hot-cache-period: The time the data should be kept in cache for fast queries in TimeSpan.
            location: Resource location.
            kind: Required. Kind of the database
    examples:
      - name: KustoDatabasesCreateOrUpdate
        text: |-
               az kusto database create --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--read-write-database location="westus" soft-delete-period="P1D" --resource-group "kustorptest"
"""

helps['kusto database update'] = """
    type: command
    short-summary: "Updates a database."
    parameters:
      - name: --read-write-database
        short-summary: "Class representing a read write database."
        long-summary: |
            Usage: --read-write-database soft-delete-period=XX hot-cache-period=XX location=XX kind=XX

            soft-delete-period: The time the data should be kept before it stops being accessible to queries in \
TimeSpan.
            hot-cache-period: The time the data should be kept in cache for fast queries in TimeSpan.
            location: Resource location.
            kind: Required. Kind of the database
      - name: --read-only-following-database
        short-summary: "Class representing a read only following database."
        long-summary: |
            Usage: --read-only-following-database hot-cache-period=XX location=XX kind=XX

            hot-cache-period: The time the data should be kept in cache for fast queries in TimeSpan.
            location: Resource location.
            kind: Required. Kind of the database
    examples:
      - name: KustoDatabasesUpdate
        text: |-
               az kusto database update --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--parameters "{\\"properties\\":{\\"softDeletePeriod\\":\\"P1D\\"}}" --resource-group "kustorptest"
"""

helps['kusto database delete'] = """
    type: command
    short-summary: "Deletes the database with the given name."
    examples:
      - name: KustoDatabasesDelete
        text: |-
               az kusto database delete --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest"
"""

helps['kusto database add-principal'] = """
    type: command
    short-summary: "Add Database principals permissions."
    parameters:
      - name: --value
        short-summary: "The list of Kusto database principals."
        long-summary: |
            Usage: --value role=XX name=XX type=XX fqn=XX email=XX app-id=XX

            role: Required. Database principal role.
            name: Required. Database principal name.
            type: Required. Database principal type.
            fqn: Database principal fully qualified name.
            email: Database principal email if exists.
            app-id: Application id - relevant only for application principal type.

            Multiple actions can be specified by using more than one --value argument.
    examples:
      - name: KustoDatabaseAddPrincipals
        text: |-
               az kusto database add-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--value name="Some User" type="User" app-id="" email="user@microsoft.com" fqn="aaduser=some_guid" role="Admin" --value \
name="Kusto" type="Group" app-id="" email="kusto@microsoft.com" fqn="aadgroup=some_guid" role="Viewer" --value \
name="SomeApp" type="App" app-id="some_guid_app_id" email="" fqn="aadapp=some_guid_app_id" role="Admin" \
--resource-group "kustorptest"
"""

helps['kusto database list-principal'] = """
    type: command
    short-summary: "Returns a list of database principals of the given Kusto cluster and database."
    examples:
      - name: KustoDatabaseListPrincipals
        text: |-
               az kusto database list-principal --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest"
"""

helps['kusto database remove-principal'] = """
    type: command
    short-summary: "Remove Database principals permissions."
    parameters:
      - name: --value
        short-summary: "The list of Kusto database principals."
        long-summary: |
            Usage: --value role=XX name=XX type=XX fqn=XX email=XX app-id=XX

            role: Required. Database principal role.
            name: Required. Database principal name.
            type: Required. Database principal type.
            fqn: Database principal fully qualified name.
            email: Database principal email if exists.
            app-id: Application id - relevant only for application principal type.

            Multiple actions can be specified by using more than one --value argument.
    examples:
      - name: KustoDatabaseRemovePrincipals
        text: |-
               az kusto database remove-principal --cluster-name "kustoclusterrptest4" --database-name \
"KustoDatabase8" --value name="Some User" type="User" app-id="" email="user@microsoft.com" fqn="aaduser=some_guid" \
role="Admin" --value name="Kusto" type="Group" app-id="" email="kusto@microsoft.com" fqn="aadgroup=some_guid" \
role="Viewer" --value name="SomeApp" type="App" app-id="some_guid_app_id" email="" fqn="aadapp=some_guid_app_id" \
role="Admin" --resource-group "kustorptest"
"""

helps['kusto database wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the kusto database is met.
    examples:
      - name: Pause executing next line of CLI script until the kusto database is successfully created.
        text: |-
               az kusto database wait --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest" --created
      - name: Pause executing next line of CLI script until the kusto database is successfully updated.
        text: |-
               az kusto database wait --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest" --updated
      - name: Pause executing next line of CLI script until the kusto database is successfully deleted.
        text: |-
               az kusto database wait --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest" --deleted
"""

helps['kusto database-principal-assignment'] = """
    type: group
    short-summary: Manage database principal assignment with kusto
"""

helps['kusto database-principal-assignment list'] = """
    type: command
    short-summary: "Lists all Kusto cluster database principalAssignments."
    examples:
      - name: KustoPrincipalAssignmentsList
        text: |-
               az kusto database-principal-assignment list --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --resource-group "kustorptest"
"""

helps['kusto database-principal-assignment show'] = """
    type: command
    short-summary: "Gets a Kusto cluster database principalAssignment."
    examples:
      - name: KustoDatabasePrincipalAssignmentsGet
        text: |-
               az kusto database-principal-assignment show --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
"""

helps['kusto database-principal-assignment create'] = """
    type: command
    short-summary: "Creates a Kusto cluster database principalAssignment."
    examples:
      - name: KustoDatabasePrincipalAssignmentsCreateOrUpdate
        text: |-
               az kusto database-principal-assignment create --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --principal-id "87654321-1234-1234-1234-123456789123" --principal-type "App" --role "Admin" \
--tenant-id "12345678-1234-1234-1234-123456789123" --principal-assignment-name "kustoprincipal1" --resource-group \
"kustorptest"
"""

helps['kusto database-principal-assignment update'] = """
    type: command
    short-summary: "Update a Kusto cluster database principalAssignment."
"""

helps['kusto database-principal-assignment delete'] = """
    type: command
    short-summary: "Deletes a Kusto principalAssignment."
    examples:
      - name: KustoDatabasePrincipalAssignmentsDelete
        text: |-
               az kusto database-principal-assignment delete --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest"
"""

helps['kusto database-principal-assignment wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the kusto database-principal-assignment is \
met.
    examples:
      - name: Pause executing next line of CLI script until the kusto database-principal-assignment is successfully \
created.
        text: |-
               az kusto database-principal-assignment wait --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" --created
      - name: Pause executing next line of CLI script until the kusto database-principal-assignment is successfully \
updated.
        text: |-
               az kusto database-principal-assignment wait --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" --updated
      - name: Pause executing next line of CLI script until the kusto database-principal-assignment is successfully \
deleted.
        text: |-
               az kusto database-principal-assignment wait --cluster-name "kustoclusterrptest4" --database-name \
"Kustodatabase8" --principal-assignment-name "kustoprincipal1" --resource-group "kustorptest" --deleted
"""

helps['kusto attached-database-configuration'] = """
    type: group
    short-summary: Manage attached database configuration with kusto
"""

helps['kusto attached-database-configuration list'] = """
    type: command
    short-summary: "Returns the list of attached database configurations of the given Kusto cluster."
    examples:
      - name: KustoAttachedDatabaseConfigurationsListByCluster
        text: |-
               az kusto attached-database-configuration list --cluster-name "kustoclusterrptest4" --resource-group \
"kustorptest"
"""

helps['kusto attached-database-configuration show'] = """
    type: command
    short-summary: "Returns an attached database configuration."
    examples:
      - name: AttachedDatabaseConfigurationsGet
        text: |-
               az kusto attached-database-configuration show --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto attached-database-configuration create'] = """
    type: command
    short-summary: "Create an attached database configuration."
    examples:
      - name: AttachedDatabaseConfigurationsCreateOrUpdate
        text: |-
               az kusto attached-database-configuration create --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --location "westus" --cluster-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/re\
sourceGroups/kustorptest/providers/Microsoft.Kusto/Clusters/KustoClusterLeader" --database-name "kustodatabase" \
--default-principals-modification-kind "Union" --resource-group "kustorptest"
"""

helps['kusto attached-database-configuration update'] = """
    type: command
    short-summary: "Update an attached database configuration."
"""

helps['kusto attached-database-configuration delete'] = """
    type: command
    short-summary: "Deletes the attached database configuration with the given name."
    examples:
      - name: AttachedDatabaseConfigurationsDelete
        text: |-
               az kusto attached-database-configuration delete --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest"
"""

helps['kusto attached-database-configuration wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the kusto attached-database-configuration is \
met.
    examples:
      - name: Pause executing next line of CLI script until the kusto attached-database-configuration is successfully \
created.
        text: |-
               az kusto attached-database-configuration wait --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest" --created
      - name: Pause executing next line of CLI script until the kusto attached-database-configuration is successfully \
updated.
        text: |-
               az kusto attached-database-configuration wait --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest" --updated
      - name: Pause executing next line of CLI script until the kusto attached-database-configuration is successfully \
deleted.
        text: |-
               az kusto attached-database-configuration wait --name "attachedDatabaseConfigurations1" --cluster-name \
"kustoclusterrptest4" --resource-group "kustorptest" --deleted
"""

helps['kusto data-connection'] = """
    type: group
    short-summary: Manage data connection with kusto
"""

helps['kusto data-connection list'] = """
    type: command
    short-summary: "Returns the list of data connections of the given Kusto database."
    examples:
      - name: KustoDatabasesListByCluster
        text: |-
               az kusto data-connection list --cluster-name "kustoclusterrptest4" --database-name "KustoDatabase8" \
--resource-group "kustorptest"
"""

helps['kusto data-connection show'] = """
    type: command
    short-summary: "Returns a data connection."
    examples:
      - name: KustoDataConnectionsGet
        text: |-
               az kusto data-connection show --cluster-name "kustoclusterrptest4" --name "DataConnections8" \
--database-name "KustoDatabase8" --resource-group "kustorptest"
"""

helps['kusto data-connection event-grid'] = """
    type: group
    short-summary: Manage data connection with kusto sub group event-grid
"""

helps['kusto data-connection event-grid create'] = """
    type: command
    short-summary: "Create a data connection."
"""

helps['kusto data-connection event-hub'] = """
    type: group
    short-summary: Manage data connection with kusto sub group event-hub
"""

helps['kusto data-connection event-hub create'] = """
    type: command
    short-summary: "Create a data connection."
    examples:
      - name: KustoDataConnectionsCreateOrUpdate
        text: |-
               az kusto data-connection event-hub create --cluster-name "kustoclusterrptest4" --name \
"DataConnections8" --database-name "KustoDatabase8" --location "westus" --consumer-group "testConsumerGroup1" \
--event-hub-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Micro\
soft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" --resource-group "kustorptest"
"""

helps['kusto data-connection iot-hub'] = """
    type: group
    short-summary: Manage data connection with kusto sub group iot-hub
"""

helps['kusto data-connection iot-hub create'] = """
    type: command
    short-summary: "Create a data connection."
"""

helps['kusto data-connection event-grid update'] = """
    type: command
    short-summary: "Updates a data connection."
"""

helps['kusto data-connection event-hub update'] = """
    type: command
    short-summary: "Updates a data connection."
    examples:
      - name: KustoDataConnectionsUpdate
        text: |-
               az kusto data-connection event-hub update --cluster-name "kustoclusterrptest4" --name \
"DataConnections8" --database-name "KustoDatabase8" --location "westus" --consumer-group "testConsumerGroup1" \
--event-hub-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Micro\
soft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" --resource-group "kustorptest"
"""

helps['kusto data-connection iot-hub update'] = """
    type: command
    short-summary: "Updates a data connection."
"""

helps['kusto data-connection delete'] = """
    type: command
    short-summary: "Deletes the data connection with the given name."
    examples:
      - name: KustoDataConnectionsDelete
        text: |-
               az kusto data-connection delete --cluster-name "kustoclusterrptest4" --name "kustoeventhubconnection1" \
--database-name "KustoDatabase8" --resource-group "kustorptest"
"""

helps['kusto data-connection event-grid data-connection-validation'] = """
    type: command
    short-summary: "Checks that the data connection parameters are valid."
"""

helps['kusto data-connection event-hub data-connection-validation'] = """
    type: command
    short-summary: "Checks that the data connection parameters are valid."
    examples:
      - name: KustoDataConnectionValidation
        text: |-
               az kusto data-connection event-hub data-connection-validation --cluster-name "kustoclusterrptest4" \
--database-name "KustoDatabase8" --name "DataConnections8" --consumer-group "testConsumerGroup1" \
--event-hub-resource-id "/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorptest/providers/Micro\
soft.EventHub/namespaces/eventhubTestns1/eventhubs/eventhubTest1" --resource-group "kustorptest"
"""

helps['kusto data-connection iot-hub data-connection-validation'] = """
    type: command
    short-summary: "Checks that the data connection parameters are valid."
"""

helps['kusto data-connection wait'] = """
    type: command
    short-summary: Place the CLI in a waiting state until a condition of the kusto data-connection is met.
    examples:
      - name: Pause executing next line of CLI script until the kusto data-connection is successfully created.
        text: |-
               az kusto data-connection wait --cluster-name "kustoclusterrptest4" --name "DataConnections8" \
--database-name "KustoDatabase8" --resource-group "kustorptest" --created
      - name: Pause executing next line of CLI script until the kusto data-connection is successfully deleted.
        text: |-
               az kusto data-connection wait --cluster-name "kustoclusterrptest4" --name "DataConnections8" \
--database-name "KustoDatabase8" --resource-group "kustorptest" --deleted
"""
