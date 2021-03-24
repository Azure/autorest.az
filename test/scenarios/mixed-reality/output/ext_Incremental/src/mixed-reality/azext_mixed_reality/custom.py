# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
#
# Generation mode: Incremental
# --------------------------------------------------------------------------

from .generated.custom import *  # noqa: F403
try:
    from .manual.custom import *  # noqa: F403
except ModuleNotFoundError as e:
    if e.name.endswith('manual.custom'):
        pass
    else:
        raise e;



def create_spatial_anchors_account(
        client,
        resource_group_name, spatial_anchors_account_name, location=None, tags=None,
        custom_headers=None, raw=False, **operation_config):
    return client.create(
        resource_group_name, spatial_anchors_account_name, location, tags,
        custom_headers, raw, **operation_config)


def list_spatial_anchors_accounts(
        client,
        resource_group_name=None,
        custom_headers=None, raw=False, **operation_config):
    if resource_group_name:
        return client.list_by_resource_group(resource_group_name, custom_headers, raw, **operation_config)
    return client.list_by_subscription(custom_headers, raw, **operation_config)


def renew_key(
        client,
        resource_group_name, spatial_anchors_account_name, key,
        custom_headers=None, raw=False, **operation_config):
    serial = ['primary', 'secondary'].index(key) + 1
    return client.regenerate_keys(
        resource_group_name, spatial_anchors_account_name, serial,
        custom_headers, raw, **operation_config)
