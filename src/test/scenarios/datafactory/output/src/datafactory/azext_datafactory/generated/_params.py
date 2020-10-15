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
# pylint: disable=too-many-statements

from azure.cli.core.commands.parameters import (
    tags_type,
    get_enum_type,
    resource_group_name_type,
    get_location_type
)
from azure.cli.core.commands.validators import (
    get_default_location_from_resource_group,
    validate_file_or_dict
)
from azext_datafactory.action import (
    AddFactoryVstsConfiguration,
    AddFactoryGitHubConfiguration,
    AddFakeIdentity
)


def load_arguments(self, _):

    with self.argument_context('datafactory list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('gen_custom_headers', type=str, help='Test the ability to rename ignoring attributes.')

    with self.argument_context('datafactory show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', options_list=['--name', '-n', '--factory-name'], type=str, help='The factory name.',
                   id_part='name', configured_default='factory')
        c.argument('if_none_match', type=str, help='ETag of the factory entity. Should only be specified for get. If '
                   'the ETag matches the existing entity tag, or if * was provided, then no content will be returned.')

    with self.argument_context('datafactory create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', options_list=['--name', '-n', '--factory-name'], type=str, help='The factory name.',
                   configured_default='factory')
        c.argument('if_match', type=str, help='ETag of the factory entity. Should only be specified for update, for '
                   'which it should match existing entity or can be * for unconditional update.')
        c.argument('location', arg_type=get_location_type(self.cli_ctx),
                   validator=get_default_location_from_resource_group)
        c.argument('tags', tags_type)
        c.argument('factory_vsts_configuration', action=AddFactoryVstsConfiguration, nargs='*', help='Factory\'s VSTS '
                   'repo information.', arg_group='RepoConfiguration')
        c.argument('factory_git_hub_configuration', action=AddFactoryGitHubConfiguration, nargs='*', help='Factory\'s '
                   'GitHub repo information.', arg_group='RepoConfiguration')
        c.argument('fake_identity', action=AddFakeIdentity, nargs='*', help='This is only for az test.')
        c.argument('zones', nargs='*', help='This is only for az test.')

    with self.argument_context('datafactory update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', options_list=['--name', '-n', '--factory-name'], type=str, help='The factory name.',
                   id_part='name', configured_default='factory')
        c.argument('tags', tags_type)

    with self.argument_context('datafactory delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', options_list=['--name', '-n', '--factory-name'], type=str, help='The factory name.',
                   id_part='name', configured_default='factory')

    with self.argument_context('datafactory configure-factory-repo') as c:
        c.argument('location_id', type=str, help='The location identifier.', id_part='name')
        c.argument('factory_resource_id', type=str, help='The factory resource id.')
        c.argument('factory_vsts_configuration', action=AddFactoryVstsConfiguration, nargs='*', help='Factory\'s VSTS '
                   'repo information.', arg_group='RepoConfiguration')
        c.argument('factory_git_hub_configuration', action=AddFactoryGitHubConfiguration, nargs='*', help='Factory\'s '
                   'GitHub repo information.', arg_group='RepoConfiguration')

    with self.argument_context('datafactory get-data-plane-access') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', options_list=['--name', '-n', '--factory-name'], type=str, help='The factory name.',
                   id_part='name', configured_default='factory')
        c.argument('permissions', type=str, help='The string with permissions for Data Plane access. Currently only '
                   '\'r\' is supported which grants read only access.')
        c.argument('access_resource_path', type=str, help='The resource path to get access relative to factory. '
                   'Currently only empty string is supported which corresponds to the factory resource.')
        c.argument('profile_name', type=str, help='The name of the profile. Currently only the default is supported. '
                   'The default value is DefaultProfile.')
        c.argument('start_time', type=str, help='Start time for the token. If not specified the current time will be '
                   'used.')
        c.argument('expire_time', type=str, help='Expiration time for the token. Maximum duration for the token is '
                   'eight hours and by default the token will expire in eight hours.')

    with self.argument_context('datafactory get-git-hub-access-token') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', options_list=['--name', '-n', '--factory-name'], type=str, help='The factory name.',
                   id_part='name', configured_default='factory')
        c.argument('git_hub_access_code', type=str, help='GitHub access code.')
        c.argument('git_hub_client_id', type=str, help='GitHub application client ID.')
        c.argument('git_hub_access_token_base_url', type=str, help='GitHub access token base URL.')

    with self.argument_context('datafactory trigger list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')

    with self.argument_context('datafactory trigger show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')
        c.argument('if_none_match', type=str, help='ETag of the trigger entity. Should only be specified for get. If '
                   'the ETag matches the existing entity tag, or if * was provided, then no content will be returned.')

    with self.argument_context('datafactory trigger create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str,
                   help='The trigger name.')
        c.argument('if_match', type=str, help='ETag of the trigger entity.  Should only be specified for update, for '
                   'which it should match existing entity or can be * for unconditional update.')
        c.argument('properties', type=validate_file_or_dict, help='Properties of the trigger. Expected value: '
                   'json-string/@json-file.')

    with self.argument_context('datafactory trigger update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')
        c.argument('if_match', type=str, help='ETag of the trigger entity.  Should only be specified for update, for '
                   'which it should match existing entity or can be * for unconditional update.')
        c.argument('description', type=str, help='Trigger description.')
        c.argument('annotations', type=validate_file_or_dict, help='List of tags that can be used for describing the '
                   'trigger. Expected value: json-string/@json-file.')
        c.ignore('properties')

    with self.argument_context('datafactory trigger delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')

    with self.argument_context('datafactory trigger get-event-subscription-status') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')

    with self.argument_context('datafactory trigger query-by-factory') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('continuation_token', type=str, help='The continuation token for getting the next page of results. '
                   'Null for first page.')
        c.argument('parent_trigger_name', type=str, help='The name of the parent TumblingWindowTrigger to get the '
                   'child rerun triggers')

    with self.argument_context('datafactory trigger start') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')

    with self.argument_context('datafactory trigger stop') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')

    with self.argument_context('datafactory trigger subscribe-to-event') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')

    with self.argument_context('datafactory trigger unsubscribe-from-event') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')

    with self.argument_context('datafactory trigger wait') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('trigger_name', options_list=['--name', '-n', '--trigger-name'], type=str, help='The trigger name.',
                   id_part='child_name_1')
        c.argument('if_none_match', type=str, help='ETag of the trigger entity. Should only be specified for get. If '
                   'the ETag matches the existing entity tag, or if * was provided, then no content will be returned.')

    with self.argument_context('datafactory integration-runtime list') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')

    with self.argument_context('datafactory integration-runtime show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')
        c.argument('if_none_match', type=str, help='ETag of the integration runtime entity. Should only be specified '
                   'for get. If the ETag matches the existing entity tag, or if * was provided, then no content will '
                   'be returned.')

    with self.argument_context('datafactory integration-runtime linked-integration-runtime create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')
        c.argument('integration_runtime_name', type=str, help='The integration runtime name.')
        c.argument('name', type=str, help='The name of the linked integration runtime.')
        c.argument('subscription_id', type=str, help='The ID of the subscription that the linked integration runtime '
                   'belongs to.')
        c.argument('data_factory_name', type=str, help='The name of the data factory that the linked integration '
                   'runtime belongs to.')
        c.argument('data_factory_location', type=str, help='The location of the data factory that the linked '
                   'integration runtime belongs to.')

    with self.argument_context('datafactory integration-runtime managed create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.')
        c.argument('if_match', type=str, help='ETag of the integration runtime entity. Should only be specified for '
                   'update, for which it should match existing entity or can be * for unconditional update.')
        c.argument('description', type=str, help='Integration runtime description.')
        c.argument('factory_vsts_configuration', action=AddFactoryVstsConfiguration, nargs='*', help='Factory\'s VSTS '
                   'repo information.', arg_group='RepoConfiguration')
        c.argument('factory_git_hub_configuration', action=AddFactoryGitHubConfiguration, nargs='*', help='Factory\'s '
                   'GitHub repo information.', arg_group='RepoConfiguration')
        c.argument('fake_identity', action=AddFakeIdentity, nargs='*', help='This is only for az test.')
        c.argument('zones', nargs='*', help='This is only for az test.')
        c.argument('type_properties_compute_properties', type=validate_file_or_dict, help='The compute resource for '
                   'managed integration runtime. Expected value: json-string/@json-file.')
        c.argument('type_properties_ssis_properties', type=validate_file_or_dict, help='SSIS properties for managed '
                   'integration runtime. Expected value: json-string/@json-file.')

    with self.argument_context('datafactory integration-runtime self-hosted create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.')
        c.argument('if_match', type=str, help='ETag of the integration runtime entity. Should only be specified for '
                   'update, for which it should match existing entity or can be * for unconditional update.')
        c.argument('description', type=str, help='Integration runtime description.')
        c.argument('type_properties_linked_info', type=validate_file_or_dict, help='The base definition of a linked '
                   'integration runtime. Expected value: json-string/@json-file.')

    with self.argument_context('datafactory integration-runtime update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')
        c.argument('auto_update', arg_type=get_enum_type(['On', 'Off', 'fakeValue1', 'fakeValue2', 'fakeValue3', ''
                                                          'fakeValue4', 'fakeValue5', 'fakeValue6']), help='Enables or '
                   'disables the auto-update feature of the self-hosted integration runtime. See '
                   'https://go.microsoft.com/fwlink/?linkid=854189.')
        c.argument('update_delay_offset', type=str, help='The time offset (in hours) in the day, e.g., PT03H is 3 '
                   'hours. The integration runtime auto update will happen on that time.')

    with self.argument_context('datafactory integration-runtime delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime get-connection-info') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime get-monitoring-data') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime get-status') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime list-auth-key') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.')

    with self.argument_context('datafactory integration-runtime regenerate-auth-key') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')
        c.argument('key_name', arg_type=get_enum_type(['authKey1', 'authKey2']), help='The name of the authentication '
                   'key to regenerate.')

    with self.argument_context('datafactory integration-runtime remove-link') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')
        c.argument('linked_factory_name', type=str, help='The data factory name for linked integration runtime.')

    with self.argument_context('datafactory integration-runtime start') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime stop') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime sync-credentials') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime upgrade') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')

    with self.argument_context('datafactory integration-runtime wait') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('factory_name', type=str, help='The factory name.', id_part='name', configured_default='factory')
        c.argument('integration_runtime_name', options_list=['--name', '-n', '--integration-runtime-name'], type=str,
                   help='The integration runtime name.', id_part='child_name_1')
        c.argument('if_none_match', type=str, help='ETag of the integration runtime entity. Should only be specified '
                   'for get. If the ETag matches the existing entity tag, or if * was provided, then no content will '
                   'be returned.')
