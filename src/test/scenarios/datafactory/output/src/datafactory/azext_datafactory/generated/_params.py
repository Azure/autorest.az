# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements

from knack.arguments import CLIArgumentType
from azure.cli.core.commands.parameters import (
    tags_type,
    resource_group_name_type,
    get_location_type
)
from azext_datafactory.action import (
    AddIdentity,
    AddFactoryVstsConfiguration,
    AddFactoryGitHubConfiguration
)


def load_arguments(self, _):

    with self.argument_context('datafactory factory list') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')

    with self.argument_context('datafactory factory show') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')
        c.argument('factory_name', help='The factory name.')
        c.argument('if_none_match', help='ETag of the factory entity. Should only be specified for get. If the ETag mat'
                   'ches the existing entity tag, or if * was provided, then no content will be returned.')

    with self.argument_context('datafactory factory create') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')
        c.argument('factory_name', help='The factory name.')
        c.argument('if_match', help='ETag of the factory entity. Should only be specified for update, for which it shou'
                   'ld match existing entity or can be * for unconditional update.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The resource location.')
        c.argument('tags', tags_type, help='The resource tags.')
        c.argument('identity', action=AddIdentity, nargs='+', help='Managed service identity of the factory.')
        c.argument('factory_vsts_configuration', action=AddFactoryVstsConfiguration, nargs='+', help='Factory\'s VSTS r'
                   'epo information.', arg_group='RepoConfiguration')
        c.argument('factory_git_hub_configuration', action=AddFactoryGitHubConfiguration, nargs='+', help='Factory\'s G'
                   'itHub repo information.', arg_group='RepoConfiguration')

    with self.argument_context('datafactory factory update') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')
        c.argument('factory_name', help='The factory name.')
        c.argument('tags', tags_type, help='The resource tags.')
        c.argument('identity', action=AddIdentity, nargs='+', help='Managed service identity of the factory.')

    with self.argument_context('datafactory factory delete') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')
        c.argument('factory_name', help='The factory name.')

    with self.argument_context('datafactory factory configure-factory-repo') as c:
        c.argument('location_id', help='The location identifier.')
        c.argument('factory_resource_id', help='The factory resource id.')
        c.argument('factory_vsts_configuration', action=AddFactoryVstsConfiguration, nargs='+', help='Factory\'s VSTS r'
                   'epo information.', arg_group='RepoConfiguration')
        c.argument('factory_git_hub_configuration', action=AddFactoryGitHubConfiguration, nargs='+', help='Factory\'s G'
                   'itHub repo information.', arg_group='RepoConfiguration')

    with self.argument_context('datafactory factory get-data-plane-access') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')
        c.argument('factory_name', help='The factory name.')
        c.argument('permissions', help='The string with permissions for Data Plane access. Currently only \'r\' is supp'
                   'orted which grants read only access.')
        c.argument('access_resource_path', help='The resource path to get access relative to factory. Currently only em'
                   'pty string is supported which corresponds to the factory resource.')
        c.argument('profile_name', help='The name of the profile. Currently only the default is supported. The default '
                   'value is DefaultProfile.')
        c.argument('start_time', help='Start time for the token. If not specified the current time will be used.')
        c.argument('expire_time', help='Expiration time for the token. Maximum duration for the token is eight hours an'
                   'd by default the token will expire in eight hours.')

    with self.argument_context('datafactory factory get-git-hub-access-token') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The resource group name.')
        c.argument('factory_name', help='The factory name.')
        c.argument('git_hub_access_code', help='GitHub access code.')
        c.argument('git_hub_client_id', help='GitHub application client ID.')
        c.argument('git_hub_access_token_base_url', help='GitHub access token base URL.')
