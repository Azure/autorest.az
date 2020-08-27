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
from azure.cli.core.commands.validators import get_default_location_from_resource_group


def load_arguments(self, _):

    with self.argument_context('spatial-anchors-account regenerate-key') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.', id_part='name')
        c.argument('serial', arg_type=get_enum_type(['1', '2']), help='serial of key to be regenerated')

    with self.argument_context('remote-rendering-account list') as c:
        c.argument('resource_group_name', resource_group_name_type)

    with self.argument_context('remote-rendering-account show') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.', id_part='name')

    with self.argument_context('remote-rendering-account create') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.')
        c.argument('tags', tags_type)
        c.argument('location', arg_type=get_location_type(self.cli_ctx),
                   validator=get_default_location_from_resource_group)

    with self.argument_context('remote-rendering-account update') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.', id_part='name')
        c.argument('tags', tags_type)
        c.argument('location', arg_type=get_location_type(self.cli_ctx),
                   validator=get_default_location_from_resource_group)

    with self.argument_context('remote-rendering-account delete') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.', id_part='name')

    with self.argument_context('remote-rendering-account list-key') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.')

    with self.argument_context('remote-rendering-account regenerate-key') as c:
        c.argument('resource_group_name', resource_group_name_type)
        c.argument('account_name', type=str, help='Name of an Mixed Reality Account.', id_part='name')
        c.argument('serial', arg_type=get_enum_type(['1', '2']), help='serial of key to be regenerated')
