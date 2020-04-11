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

    from azext_datafactory.generated._client_factory import cf_factory
    datafactory_factory = CliCommandType(
        operations_tmpl='azext_datafactory.vendored_sdks.datafactory.operations._factory_operations#FactoryOperations.{'
        '}',
        client_factory=cf_factory)
    with self.command_group('datafactory', datafactory_factory, client_factory=cf_factory) as g:
        g.custom_command('list', 'datafactory_list')
        g.custom_show_command('show', 'datafactory_show')
        g.custom_command('create', 'datafactory_create')
        g.custom_command('update', 'datafactory_update')
        g.custom_command('delete', 'datafactory_delete')
        g.custom_command('configure-factory-repo', 'datafactory_configure_factory_repo')
        g.custom_command('get-data-plane-access', 'datafactory_get_data_plane_access')
        g.custom_command('get-git-hub-access-token', 'datafactory_get_git_hub_access_token')
