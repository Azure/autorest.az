# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------


def cf_managed_network(cli_ctx, *_):
    from azure.cli.core.commands.client_factory import get_mgmt_service_client
    from ..vendored_sdks.managednetwork import ManagedNetworkManagementClient
    return get_mgmt_service_client(cli_ctx, ManagedNetworkManagementClient)


def cf_managednetwork(cli_ctx, *_):
    return cf_managed_network(cli_ctx).managednetwork


def cf_scopeassignment(cli_ctx, *_):
    return cf_managed_network(cli_ctx).scopeassignment


def cf_managednetworkgroup(cli_ctx, *_):
    return cf_managed_network(cli_ctx).managednetworkgroup


def cf_managednetworkpeeringpolicy(cli_ctx, *_):
    return cf_managed_network(cli_ctx).managednetworkpeeringpolicy


def cf_operation(cli_ctx, *_):
    return cf_managed_network(cli_ctx).operation
