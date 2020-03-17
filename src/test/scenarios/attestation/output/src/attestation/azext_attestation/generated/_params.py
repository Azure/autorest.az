# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-lines
# pylint: disable=too-many-statements

from knack.arguments import CLIArgumentType
from azure.cli.core.commands.parameters import (
    tags_type,
    resource_group_name_type,
    get_location_type
)


def load_arguments(self, _):

    with self.argument_context('attestation attestation-provider list') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group. The name is case insensitive.')

    with self.argument_context('attestation attestation-provider show') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group. The name is case insensitive.')
        c.argument('provider_name', help='Name of the attestation service instance')

    with self.argument_context('attestation attestation-provider create') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group. The name is case insensitive.')
        c.argument('provider_name', help='Name of the attestation service')
        c.argument('location', arg_type=get_location_type(self.cli_ctx), help='The supported Azure location where the attestation service instance should be created.')
        c.argument('tags', tags_type, help='The tags that will be assigned to the attestation service instance.')
        c.argument('properties', arg_type=CLIArgumentType(options_list=['--properties'], help='Properties of the attestation service instance'))

    with self.argument_context('attestation attestation-provider update') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group. The name is case insensitive.')
        c.argument('provider_name', help='Name of the attestation service')
        c.argument('tags', tags_type, help='The tags that will be assigned to the attestation service instance.')

    with self.argument_context('attestation attestation-provider delete') as c:
        c.argument('resource_group_name', resource_group_name_type, help='The name of the resource group. The name is case insensitive.')
        c.argument('provider_name', help='Name of the attestation service')
