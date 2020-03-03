# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-statements
# pylint: disable=too-many-lines
# pylint: disable=too-many-locals
# pylint: disable=unused-argument


def managed_network_managed_network_list(cmd, client,
                                         top=None,
                                         skiptoken=None):
    return client.list_by_subscription(top=top, skiptoken=skiptoken)


def managed_network_managed_network_show(cmd, client,
                                         resource_group_name,
                                         managed_network_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name)


def managed_network_managed_network_create(cmd, client,
                                           resource_group_name,
                                           managed_network_name,
                                           location,
                                           tags=None,
                                           managed_network_management_groups=None,
                                           managed_network_subscriptions=None,
                                           managed_network_virtual_networks=None,
                                           managed_network_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, location=location, tags=tags, management_groups=managed_network_management_groups, subscriptions=managed_network_subscriptions, virtual_networks=managed_network_virtual_networks, subnets=managed_network_subnets)


def managed_network_managed_network_update(cmd, client,
                                           resource_group_name,
                                           managed_network_name,
                                           tags=None):
    return client.update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, tags=tags)


def managed_network_managed_network_delete(cmd, client,
                                           resource_group_name,
                                           managed_network_name):
    return client.delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name)


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
                                            location,
                                            parameters_assigned_managed_network=None):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)


def managed_network_scope_assignment_update(cmd, client,
                                            scope,
                                            scope_assignment_name,
                                            location,
                                            parameters_assigned_managed_network=None):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)


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
                                                 location,
                                                 managed_network_group_management_groups=None,
                                                 managed_network_group_subscriptions=None,
                                                 managed_network_group_virtual_networks=None,
                                                 managed_network_group_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=managed_network_group_management_groups, subscriptions=managed_network_group_subscriptions, virtual_networks=managed_network_group_virtual_networks, subnets=managed_network_group_subnets)


def managed_network_managed_network_group_update(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 managed_network_group_name,
                                                 location,
                                                 managed_network_group_management_groups=None,
                                                 managed_network_group_subscriptions=None,
                                                 managed_network_group_virtual_networks=None,
                                                 managed_network_group_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=managed_network_group_management_groups, subscriptions=managed_network_group_subscriptions, virtual_networks=managed_network_group_virtual_networks, subnets=managed_network_group_subnets)


def managed_network_managed_network_group_delete(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 managed_network_group_name):
    return client.delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name)


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
                                                          location,
                                                          managed_network_policy_properties=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)


def managed_network_managed_network_peering_policy_update(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          managed_network_peering_policy_name,
                                                          location,
                                                          managed_network_policy_properties=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)


def managed_network_managed_network_peering_policy_delete(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          managed_network_peering_policy_name):
    return client.delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name)
