# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------


def cf_datafactory(cli_ctx, *_):
    from azure.cli.core.commands.client_factory import get_mgmt_service_client
    from ..vendored_sdks.datafactory import DataFactoryManagementClient
    return get_mgmt_service_client(cli_ctx, DataFactoryManagementClient)


def cf_factory(cli_ctx, *_):
    return cf_datafactory(cli_ctx).factory
