# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------


def cf_managednetwork(cli_ctx, *_):
    from azure.cli.core.commands.client_factory import get_mgmt_service_client
    from ..vendored_sdks.managednetwork import ManagedNetworkManagementClient
    return get_mgmt_service_client(cli_ctx, ManagedNetworkManagementClient)


def cf_mn(cli_ctx, *_):
    return cf_managednetwork(cli_ctx).managed_network


def cf_scope_assignment(cli_ctx, *_):
    return cf_managednetwork(cli_ctx).scope_assignment


def cf_managed_network_group(cli_ctx, *_):
    return cf_managednetwork(cli_ctx).managed_network_group


def cf_managed_network_peering_policy(cli_ctx, *_):
    return cf_managednetwork(cli_ctx).managed_network_peering_policy
