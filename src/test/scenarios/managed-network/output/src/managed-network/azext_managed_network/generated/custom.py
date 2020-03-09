# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-statements
# pylint: disable=too-many-lines
# pylint: disable=too-many-locals
# pylint: disable=unused-argument
import json


def managed_network_managed_network_list(cmd, client,
                                         resource_group_name=None,
                                         top=None,
                                         skiptoken=None):
    if resource_group_name is not None:
        return client.list_by_resource_group(resource_group_name=resource_group_name, top=top, skiptoken=skiptoken)
    return client.list_by_subscription(top=top, skiptoken=skiptoken)


def managed_network_managed_network_show(cmd, client,
                                         resource_group_name,
                                         managed_network_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name)


def managed_network_managed_network_create(cmd, client,
                                           resource_group_name,
                                           managed_network_name,
                                           managed_network):
    managed_network = json.loads(managed_network) if isinstance(managed_network, str) else managed_network
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network=managed_network)


def managed_network_managed_network_update(cmd, client,
                                           resource_group_name,
                                           managed_network_name,
                                           parameters):
    return client.begin_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, parameters=parameters)


def managed_network_managed_network_delete(cmd, client,
                                           resource_group_name,
                                           managed_network_name):
    return client.begin_delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name)


def managed_network_scope_assignment_list(cmd, client,
                                          scope):
    return client.list(scope=scope)


def managed_network_scope_assignment_show(cmd, client,
                                          scope,
                                          scope_assignment_name):
    return client.get(scope=scope, scope_assignment_name=scope_assignment_name)


def managed_network_scope_assignment_create(cmd, client,
                                            scope,
                                            scope_assignment_name,
                                            parameters):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, parameters=parameters)


def managed_network_scope_assignment_update(cmd, client,
                                            scope,
                                            scope_assignment_name,
                                            parameters):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, parameters=parameters)


def managed_network_scope_assignment_delete(cmd, client,
                                            scope,
                                            scope_assignment_name):
    return client.delete(scope=scope, scope_assignment_name=scope_assignment_name)


def managed_network_managed_network_group_list(cmd, client,
                                               resource_group_name,
                                               managed_network_name,
                                               top=None,
                                               skiptoken=None):
    return client.list_by_managed_network(resource_group_name=resource_group_name, managed_network_name=managed_network_name, top=top, skiptoken=skiptoken)


def managed_network_managed_network_group_show(cmd, client,
                                               resource_group_name,
                                               managed_network_name,
                                               managed_network_group_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name)


def managed_network_managed_network_group_create(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 managed_network_group_name,
                                                 managed_network_group):
    return client.begin_create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, managed_network_group=managed_network_group)


def managed_network_managed_network_group_update(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 managed_network_group_name,
                                                 managed_network_group):
    return client.begin_create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, managed_network_group=managed_network_group)


def managed_network_managed_network_group_delete(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 managed_network_group_name):
    return client.begin_delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name)


def managed_network_managed_network_peering_policy_list(cmd, client,
                                                        resource_group_name,
                                                        managed_network_name,
                                                        top=None,
                                                        skiptoken=None):
    return client.list_by_managed_network(resource_group_name=resource_group_name, managed_network_name=managed_network_name, top=top, skiptoken=skiptoken)


def managed_network_managed_network_peering_policy_show(cmd, client,
                                                        resource_group_name,
                                                        managed_network_name,
                                                        managed_network_peering_policy_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name)


def managed_network_managed_network_peering_policy_create(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          managed_network_peering_policy_name,
                                                          managed_network_policy):
    managed_network_policy = json.loads(managed_network_policy) if isinstance(managed_network_policy, str) else managed_network_policy
    return client.begin_create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, managed_network_policy=managed_network_policy)


def managed_network_managed_network_peering_policy_update(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          managed_network_peering_policy_name,
                                                          managed_network_policy):
    managed_network_policy = json.loads(managed_network_policy) if isinstance(managed_network_policy, str) else managed_network_policy
    return client.begin_create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, managed_network_policy=managed_network_policy)


def managed_network_managed_network_peering_policy_delete(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          managed_network_peering_policy_name):
    return client.begin_delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name)
