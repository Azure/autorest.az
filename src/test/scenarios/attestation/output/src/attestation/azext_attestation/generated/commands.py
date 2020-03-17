# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long

from azure.cli.core.commands import CliCommandType


def load_command_table(self, _):

    from azext_attestation.generated._client_factory import cf_attestation_provider
    attestation_attestation_provider = CliCommandType(
        operations_tmpl='azext_attestation.vendored_sdks.attestation.operations._attestation_provider_operations#AttestationProviderOperations.{}',
        client_factory=cf_attestation_provider)
    with self.command_group('attestation attestation-provider', attestation_attestation_provider, client_factory=cf_attestation_provider) as g:
        g.custom_command('list', 'attestation_attestation_provider_list')
        g.custom_show_command('show', 'attestation_attestation_provider_show')
        g.custom_command('create', 'attestation_attestation_provider_create')
        g.custom_command('update', 'attestation_attestation_provider_update')
        g.custom_command('delete', 'attestation_attestation_provider_delete')
