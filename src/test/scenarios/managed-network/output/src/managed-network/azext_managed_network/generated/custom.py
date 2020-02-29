# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-statements
# pylint: disable=too-many-lines
# pylint: disable=too-many-locals
# pylint: disable=unused-argument


def managed_network_managednetwork_list(cmd, client,
                                        resourcegroupname=None,
                                        top=None,
                                        skiptoken=None):
    if resourcegroupname is not None:
        return client.listbyresourcegroup(resourcegroupname=resourcegroupname, top=top, skiptoken=skiptoken)
    return client.listbysubscription(top=top, skiptoken=skiptoken)


def managed_network_managednetwork_show(cmd, client,
                                        resourcegroupname,
                                        managednetworkname):
    return client.get(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname)


def managed_network_managednetwork_create(cmd, client,
                                          resourcegroupname,
                                          managednetworkname,
                                          location=None,
                                          tags=None,
                                          managed_network_managementgroups=None,
                                          managed_network_subscriptions=None,
                                          managed_network_virtualnetworks=None,
                                          managed_network_subnets=None):
    return client.createorupdate(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, location=location, tags=tags, managementgroups=managed_network_managementgroups, subscriptions=managed_network_subscriptions, virtualnetworks=managed_network_virtualnetworks, subnets=managed_network_subnets)


def managed_network_managednetwork_update(cmd, client,
                                          resourcegroupname,
                                          managednetworkname,
                                          tags=None):
    return client.update(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, tags=tags)


def managed_network_managednetwork_delete(cmd, client,
                                          resourcegroupname,
                                          managednetworkname):
    return client.delete(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname)


def managed_network_scopeassignment_list(cmd, client,
                                         scope):
    return client.list(scope=scope)


def managed_network_scopeassignment_show(cmd, client,
                                         scope,
                                         scopeassignmentname):
    return client.get(scope=scope, scopeassignmentname=scopeassignmentname)


def managed_network_scopeassignment_create(cmd, client,
                                           scope,
                                           scopeassignmentname,
                                           location=None,
                                           parameters_assignedmanagednetwork=None):
    return client.createorupdate(scope=scope, scopeassignmentname=scopeassignmentname, location=location, assignedmanagednetwork=parameters_assignedmanagednetwork)


def managed_network_scopeassignment_update(cmd, client,
                                           scope,
                                           scopeassignmentname,
                                           location=None,
                                           parameters_assignedmanagednetwork=None):
    return client.createorupdate(scope=scope, scopeassignmentname=scopeassignmentname, location=location, assignedmanagednetwork=parameters_assignedmanagednetwork)


def managed_network_scopeassignment_delete(cmd, client,
                                           scope,
                                           scopeassignmentname):
    return client.delete(scope=scope, scopeassignmentname=scopeassignmentname)


def managed_network_managednetworkgroup_list(cmd, client,
                                             resourcegroupname,
                                             managednetworkname,
                                             top=None,
                                             skiptoken=None):
    return client.listbymanagednetwork(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, top=top, skiptoken=skiptoken)


def managed_network_managednetworkgroup_show(cmd, client,
                                             resourcegroupname,
                                             managednetworkname,
                                             managednetworkgroupname):
    return client.get(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkgroupname=managednetworkgroupname)


def managed_network_managednetworkgroup_create(cmd, client,
                                               resourcegroupname,
                                               managednetworkname,
                                               managednetworkgroupname,
                                               location=None,
                                               managed_network_group_managementgroups=None,
                                               managed_network_group_subscriptions=None,
                                               managed_network_group_virtualnetworks=None,
                                               managed_network_group_subnets=None):
    return client.createorupdate(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkgroupname=managednetworkgroupname, location=location, managementgroups=managed_network_group_managementgroups, subscriptions=managed_network_group_subscriptions, virtualnetworks=managed_network_group_virtualnetworks, subnets=managed_network_group_subnets)


def managed_network_managednetworkgroup_update(cmd, client,
                                               resourcegroupname,
                                               managednetworkname,
                                               managednetworkgroupname,
                                               location=None,
                                               managed_network_group_managementgroups=None,
                                               managed_network_group_subscriptions=None,
                                               managed_network_group_virtualnetworks=None,
                                               managed_network_group_subnets=None):
    return client.createorupdate(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkgroupname=managednetworkgroupname, location=location, managementgroups=managed_network_group_managementgroups, subscriptions=managed_network_group_subscriptions, virtualnetworks=managed_network_group_virtualnetworks, subnets=managed_network_group_subnets)


def managed_network_managednetworkgroup_delete(cmd, client,
                                               resourcegroupname,
                                               managednetworkname,
                                               managednetworkgroupname):
    return client.delete(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkgroupname=managednetworkgroupname)


def managed_network_managednetworkpeeringpolicy_list(cmd, client,
                                                     resourcegroupname,
                                                     managednetworkname,
                                                     top=None,
                                                     skiptoken=None):
    return client.listbymanagednetwork(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, top=top, skiptoken=skiptoken)


def managed_network_managednetworkpeeringpolicy_show(cmd, client,
                                                     resourcegroupname,
                                                     managednetworkname,
                                                     managednetworkpeeringpolicyname):
    return client.get(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkpeeringpolicyname=managednetworkpeeringpolicyname)


def managed_network_managednetworkpeeringpolicy_create(cmd, client,
                                                       resourcegroupname,
                                                       managednetworkname,
                                                       managednetworkpeeringpolicyname,
                                                       location=None,
                                                       managed_network_policy_properties=None):
    return client.createorupdate(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkpeeringpolicyname=managednetworkpeeringpolicyname, location=location, properties=managed_network_policy_properties)


def managed_network_managednetworkpeeringpolicy_update(cmd, client,
                                                       resourcegroupname,
                                                       managednetworkname,
                                                       managednetworkpeeringpolicyname,
                                                       location=None,
                                                       managed_network_policy_properties=None):
    return client.createorupdate(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkpeeringpolicyname=managednetworkpeeringpolicyname, location=location, properties=managed_network_policy_properties)


def managed_network_managednetworkpeeringpolicy_delete(cmd, client,
                                                       resourcegroupname,
                                                       managednetworkname,
                                                       managednetworkpeeringpolicyname):
    return client.delete(resourcegroupname=resourcegroupname, managednetworkname=managednetworkname, managednetworkpeeringpolicyname=managednetworkpeeringpolicyname)


def managed_network_operation_list(cmd, client):
    return client.list()
