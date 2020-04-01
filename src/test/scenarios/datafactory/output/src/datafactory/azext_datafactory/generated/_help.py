# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=too-many-lines

from knack.help_files import helps


helps['datafactory factory'] = """
    type: group
    short-summary: datafactory factory
"""

helps['datafactory factory list'] = """
    type: command
    short-summary: Lists factories under the specified subscription.
    examples:
      - name: Factories_ListByResourceGroup
        text: |-
               az datafactory factory list --resource-group "exampleResourceGroup"
"""

helps['datafactory factory show'] = """
    type: command
    short-summary: Gets a factory.
    examples:
      - name: Factories_Get
        text: |-
               az datafactory factory show --factory-name "exampleFactoryName" --resource-group "exampleResourceGroup"
"""

helps['datafactory factory create'] = """
    type: command
    short-summary: Creates or updates a factory.
    examples:
      - name: Factories_CreateOrUpdate
        text: |-
               az datafactory factory create --location "East US" --factory-name "exampleFactoryName" --resource-group \
"exampleResourceGroup"
"""

helps['datafactory factory update'] = """
    type: command
    short-summary: Updates a factory.
    examples:
      - name: Factories_Update
        text: |-
               az datafactory factory update --factory-name "exampleFactoryName" --tags exampleTag=exampleValue --resou\
rce-group "exampleResourceGroup"
"""

helps['datafactory factory delete'] = """
    type: command
    short-summary: Deletes a factory.
    examples:
      - name: Factories_Delete
        text: |-
               az datafactory factory delete --factory-name "exampleFactoryName" --resource-group "exampleResourceGroup\
"
"""

helps['datafactory factory configure-factory-repo'] = """
    type: command
    short-summary: Updates a factory's repo information.
    examples:
      - name: Factories_ConfigureFactoryRepo
        text: |-
               az datafactory factory configure-factory-repo --factory-resource-id "/subscriptions/12345678-1234-1234-1\
234-12345678abc/resourceGroups/exampleResourceGroup/providers/Microsoft.DataFactory/factories/exampleFactoryName" --rep\
o-configuration "{\\"type\\":\\"FactoryVSTSConfiguration\\",\\"accountName\\":\\"ADF\\",\\"collaborationBranch\\":\\"ma\
ster\\",\\"lastCommitId\\":\\"\\",\\"projectName\\":\\"project\\",\\"repositoryName\\":\\"repo\\",\\"rootFolder\\":\\"/\
\\",\\"tenantId\\":\\"\\"}" --location-id "East US"
"""

helps['datafactory factory get-data-plane-access'] = """
    type: command
    short-summary: Get Data Plane access.
    examples:
      - name: Factories_GetDataPlaneAccess
        text: |-
               az datafactory factory get-data-plane-access --factory-name "exampleFactoryName" --access-resource-path \
"" --expire-time "2018-11-10T09:46:20.2659347Z" --permissions "r" --profile-name "DefaultProfile" --start-time "2018-11\
-10T02:46:20.2659347Z" --resource-group "exampleResourceGroup"
"""

helps['datafactory factory get-git-hub-access-token'] = """
    type: command
    short-summary: Get GitHub Access Token.
    examples:
      - name: Factories_GetGitHubAccessToken
        text: |-
               az datafactory factory get-git-hub-access-token --factory-name "exampleFactoryName" --git-hub-access-cod\
e "some" --git-hub-access-token-base-url "some" --git-hub-client-id "some" --resource-group "exampleResourceGroup"
"""
