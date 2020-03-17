# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-lines

import json


def managed_network_managed_network_list(cmd, client,
                                         resource_group_name=None,
                                         top=None,
                                         skiptoken=None):
    if resource_group_name is not None:
        return client.listbyresourcegroup(resourcegroupname=resource_group_name, top=top, skiptoken=skiptoken)
    return client.listbysubscription(top=top, skiptoken=skiptoken)


def managed_network_managed_network_show(cmd, client,
                                         resource_group_name,
                                         managed_network_name):
    return client.get(resourcegroupname=resource_group_name, managednetworkname=managed_network_name)


def managed_network_managed_network_create(cmd, client,
                                           resource_group_name,
                                           managed_network_name,
                                           location,
                                           tags=None,
                                           properties=None):
    properties = json.loads(properties) if isinstance(properties, str) else properties
    return client.createorupdate(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, location=location, tags=tags, properties=properties)


def managed_network_managed_network_update(cmd, client,
                                           resource_group_name,
                                           managed_network_name,
                                           tags=None):
    return client.begin_update(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, tags=tags)


def managed_network_managed_network_delete(cmd, client,
                                           resource_group_name,
                                           managed_network_name):
    return client.begin_delete(resourcegroupname=resource_group_name, managednetworkname=managed_network_name)


def managed_network_scope_assignment_list(cmd, client,
                                          scope):
    return client.list(scope=scope)


def managed_network_scope_assignment_show(cmd, client,
                                          scope,
                                          scope_assignment_name):
    return client.get(scope=scope, scopeassignmentname=scope_assignment_name)


def managed_network_scope_assignment_create(cmd, client,
                                            scope,
                                            scope_assignment_name,
                                            location,
                                            properties_assigned_managed_network=None):
    return client.createorupdate(scope=scope, scopeassignmentname=scope_assignment_name, location=location, assignedmanagednetwork=properties_assigned_managed_network)


def managed_network_scope_assignment_update(cmd, client,
                                            scope,
                                            scope_assignment_name,
                                            location,
                                            properties_assigned_managed_network=None):
    return client.createorupdate(scope=scope, scopeassignmentname=scope_assignment_name, location=location, assignedmanagednetwork=properties_assigned_managed_network)


def managed_network_scope_assignment_delete(cmd, client,
                                            scope,
                                            scope_assignment_name):
    return client.delete(scope=scope, scopeassignmentname=scope_assignment_name)


def managed_network_managed_network_group_list(cmd, client,
                                               resource_group_name,
                                               managed_network_name,
                                               top=None,
                                               skiptoken=None):
    return client.listbymanagednetwork(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, top=top, skiptoken=skiptoken)


def managed_network_managed_network_group_show(cmd, client,
                                               resource_group_name,
                                               managed_network_name,
                                               group_name):
    return client.get(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkgroupname=group_name)


def managed_network_managed_network_group_create(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 group_name,
                                                 location,
                                                 properties_management_groups=None,
                                                 properties_subscriptions=None,
                                                 properties_virtual_networks=None,
                                                 properties_subnets=None):
    properties_management_groups = json.loads(properties_management_groups) if isinstance(properties_management_groups, str) else properties_management_groups
    return client.begin_createorupdate(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkgroupname=group_name, location=location, managementgroups=properties_management_groups, subscriptions=properties_subscriptions, virtualnetworks=properties_virtual_networks, subnets=properties_subnets)


def managed_network_managed_network_group_update(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 group_name,
                                                 location,
                                                 properties_management_groups=None,
                                                 properties_subscriptions=None,
                                                 properties_virtual_networks=None,
                                                 properties_subnets=None):
    properties_management_groups = json.loads(properties_management_groups) if isinstance(properties_management_groups, str) else properties_management_groups
    return client.begin_createorupdate(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkgroupname=group_name, location=location, managementgroups=properties_management_groups, subscriptions=properties_subscriptions, virtualnetworks=properties_virtual_networks, subnets=properties_subnets)


def managed_network_managed_network_group_delete(cmd, client,
                                                 resource_group_name,
                                                 managed_network_name,
                                                 group_name):
    return client.begin_delete(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkgroupname=group_name)


def managed_network_managed_network_peering_policy_list(cmd, client,
                                                        resource_group_name,
                                                        managed_network_name,
                                                        top=None,
                                                        skiptoken=None):
    return client.listbymanagednetwork(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, top=top, skiptoken=skiptoken)


def managed_network_managed_network_peering_policy_show(cmd, client,
                                                        resource_group_name,
                                                        managed_network_name,
                                                        policy_name):
    return client.get(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkpeeringpolicyname=policy_name)


def managed_network_managed_network_peering_policy_create(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          policy_name,
                                                          location,
                                                          properties=None):
    properties = json.loads(properties) if isinstance(properties, str) else properties
    return client.begin_createorupdate(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkpeeringpolicyname=policy_name, location=location, properties=properties)


def managed_network_managed_network_peering_policy_update(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          policy_name,
                                                          location,
                                                          properties=None):
    properties = json.loads(properties) if isinstance(properties, str) else properties
    return client.begin_createorupdate(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkpeeringpolicyname=policy_name, location=location, properties=properties)


def managed_network_managed_network_peering_policy_delete(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          policy_name):
    return client.begin_delete(resourcegroupname=resource_group_name, managednetworkname=managed_network_name, managednetworkpeeringpolicyname=policy_name)
