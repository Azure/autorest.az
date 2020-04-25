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


helps['attestation'] = """
    type: group
    short-summary: attestation
"""

helps['attestation list-operation'] = """
    type: command
    short-summary: Lists all of the available Azure attestation operations.
    examples:
      - name: Operations_List
        text: |-
               az attestation list-operation
"""

helps['attestation attestation-provider'] = """
    type: group
    short-summary: attestation attestation-provider
"""

helps['attestation attestation-provider show'] = """
    type: command
    short-summary: Get the status of Attestation Provider.
    examples:
      - name: AttestationProviders_Get
        text: |-
               az attestation attestation-provider show --provider-name "myattestationprovider" --resource-group "MyRes\
ourceGroup"
"""

helps['attestation attestation-provider create'] = """
    type: command
    short-summary: Creates or updates the Attestation Provider.
    examples:
      - name: AttestationProviders_Create
        text: |-
               az attestation attestation-provider create --provider-name "myattestationprovider" --resource-group "MyR\
esourceGroup"
"""

helps['attestation attestation-provider update'] = """
    type: command
    short-summary: Updates the Attestation Provider.
    examples:
      - name: AttestationProviders_Update
        text: |-
               az attestation attestation-provider update --provider-name "myattestationprovider" --resource-group "MyR\
esourceGroup" --tags Property1="Value1" Property2="Value2" Property3="Value3"
"""

helps['attestation attestation-provider delete'] = """
    type: command
    short-summary: Delete Attestation Service.
    examples:
      - name: AttestationProviders_Delete
        text: |-
               az attestation attestation-provider delete --provider-name "myattestationprovider" --resource-group "sam\
ple-resource-group"
"""

helps['attestation attestation-provider list-attestation'] = """
    type: command
    short-summary: Returns a list of attestation providers in a subscription.
    examples:
      - name: AttestationProviders_ListByResourceGroup
        text: |-
               az attestation attestation-provider list-attestation --resource-group "testrg1"
"""
