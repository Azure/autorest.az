# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------
# pylint: disable=too-many-statements
# pylint: disable=too-many-locals

from azure.cli.core.commands import CliCommandType


def load_command_table(self, _):

    from azext_testserver.generated._client_factory import cf_bool
    testserver_bool = CliCommandType(
        operations_tmpl='azext_testserver.vendored_sdks.testserver.operations._bool_operations#BoolOperations.{}',
        client_factory=cf_bool)
    with self.command_group('testserver bool', testserver_bool, client_factory=cf_bool, is_experimental=True) as g:
        g.custom_command('get-false', 'testserver_bool_get_false')
        g.custom_command('get-invalid', 'testserver_bool_get_invalid')
        g.custom_command('get-null', 'testserver_bool_get_null')
        g.custom_command('get-true', 'testserver_bool_get_true')
        g.custom_command('put-false', 'testserver_bool_put_false')
        g.custom_command('put-true', 'testserver_bool_put_true')
