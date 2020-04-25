# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------

from azure.cli.core.commands import CliCommandType


def load_command_table(self, _):

    from azext_attestation.generated._client_factory import cf_operation
    attestation_operation = CliCommandType(
        operations_tmpl='azext_attestation.vendored_sdks.attestation.operations._operation_operations#OperationOperatio'
        'ns.{}',
        client_factory=cf_operation)
    with self.command_group('attestation', attestation_operation, client_factory=cf_operation) as g:
        g.custom_command('list-operation', 'attestation_list_operation')

    from azext_attestation.generated._client_factory import cf_attestation_provider
    attestation_attestation_provider = CliCommandType(
        operations_tmpl='azext_attestation.vendored_sdks.attestation.operations._attestation_provider_operations#Attest'
        'ationProviderOperations.{}',
        client_factory=cf_attestation_provider)
    with self.command_group('attestation attestation-provider', attestation_attestation_provider,
                            client_factory=cf_attestation_provider, is_experimental=True) as g:
        g.custom_show_command('show', 'attestation_attestation_provider_show')
        g.custom_command('create', 'attestation_attestation_provider_create')
        g.custom_command('update', 'attestation_attestation_provider_update')
        g.custom_command('delete', 'attestation_attestation_provider_delete')
        g.custom_command('list-attestation', 'attestation_attestation_provider_list_attestation')
