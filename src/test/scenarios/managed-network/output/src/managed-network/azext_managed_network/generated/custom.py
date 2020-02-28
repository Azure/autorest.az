# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=line-too-long
# pylint: disable=too-many-statements
# pylint: disable=too-many-lines
# pylint: disable=too-many-locals
# pylint: disable=unused-argument


def managed_network_managed_networks_list(cmd, client,
                                          resource_group_name=None,
                                          top=None,
                                          skiptoken=None):
    if resource_group_name is not None:
        return client.list_by_resource_group(resource_group_name=resource_group_name, top=top, skiptoken=skiptoken)
    return client.list_by_subscription(top=top, skiptoken=skiptoken)


def managed_network_managed_networks_show(cmd, client,
                                          resource_group_name,
                                          managed_network_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name)


def managed_network_managed_networks_create(cmd, client,
                                            resource_group_name,
                                            managed_network_name,
                                            location=None,
                                            tags=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                            managed_network_management_groups=None,
                                            managed_network_subscriptions=None,
                                            managed_network_virtual_networks=None,
                                            managed_network_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, location=location, tags=tags, management_groups=managed_network_management_groups, subscriptions=managed_network_subscriptions, virtual_networks=managed_network_virtual_networks, subnets=managed_network_subnets)
=======
                                            scope_management_groups=None,
                                            scope_subscriptions=None,
                                            scope_virtual_networks=None,
                                            scope_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, location=location, tags=tags, management_groups=scope_management_groups, subscriptions=scope_subscriptions, virtual_networks=scope_virtual_networks, subnets=scope_subnets)
>>>>>>> updated test
=======
=======
>>>>>>> fix some change folder and name issue
                                            management_groups=None,
                                            subscriptions=None,
                                            virtual_networks=None,
                                            subnets=None):
    managed_network = {}
    managed_network['location'] = location  # string
    managed_network['tags'] = tags
    managed_network['management_groups'] = None if management_groups is None else management_groups
    managed_network['subscriptions'] = None if subscriptions is None else subscriptions
    managed_network['virtual_networks'] = None if virtual_networks is None else virtual_networks
    managed_network['subnets'] = None if subnets is None else subnets
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, location=location, tags=tags, management_groups=management_groups, subscriptions=subscriptions, virtual_networks=virtual_networks, subnets=subnets)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
=======
>>>>>>> updated test
                                            managed_network_management_groups=None,
                                            managed_network_subscriptions=None,
                                            managed_network_virtual_networks=None,
                                            managed_network_subnets=None):
    managed_network = {}
    managed_network['location'] = location  # string
    managed_network['tags'] = tags
    managed_network['management_groups'] = None if managed_network_management_groups is None else managed_network_management_groups
    managed_network['subscriptions'] = None if managed_network_subscriptions is None else managed_network_subscriptions
    managed_network['virtual_networks'] = None if managed_network_virtual_networks is None else managed_network_virtual_networks
    managed_network['subnets'] = None if managed_network_subnets is None else managed_network_subnets
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, location=location, tags=tags, management_groups=managed_network_management_groups, subscriptions=managed_network_subscriptions, virtual_networks=managed_network_virtual_networks, subnets=managed_network_subnets)
<<<<<<< HEAD
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
>>>>>>> updated test


def managed_network_managed_networks_update(cmd, client,
                                            resource_group_name,
                                            managed_network_name,
                                            tags=None):
    return client.update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, tags=tags)


def managed_network_managed_networks_delete(cmd, client,
                                            resource_group_name,
                                            managed_network_name):
    return client.delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name)


def managed_network_scope_assignments_list(cmd, client,
                                           scope):
    return client.list(scope=scope)


def managed_network_scope_assignments_show(cmd, client,
                                           scope,
                                           scope_assignment_name):
    return client.get(scope=scope, scope_assignment_name=scope_assignment_name)


def managed_network_scope_assignments_create(cmd, client,
                                             scope,
                                             scope_assignment_name,
                                             location=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                             parameters_assigned_managed_network=None):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)
=======
=======
>>>>>>> fix some change folder and name issue
                                             assigned_managed_network=None):
    parameters = {}
    parameters['location'] = location  # string
    parameters['assigned_managed_network'] = assigned_managed_network  # string
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=assigned_managed_network)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
                                             parameters_assigned_managed_network=None):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
                                             parameters_assigned_managed_network=None):
    parameters = {}
    parameters['location'] = location  # string
    parameters['assigned_managed_network'] = parameters_assigned_managed_network  # string
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)
>>>>>>> updated test


def managed_network_scope_assignments_update(cmd, client,
                                             scope,
                                             scope_assignment_name,
                                             location=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                             parameters_assigned_managed_network=None):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)
=======
=======
>>>>>>> fix some change folder and name issue
                                             assigned_managed_network=None):
    parameters = {}
    parameters['location'] = location  # string
    parameters['assigned_managed_network'] = assigned_managed_network  # string
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=assigned_managed_network)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
                                             parameters_assigned_managed_network=None):
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
                                             parameters_assigned_managed_network=None):
    parameters = {}
    parameters['location'] = location  # string
    parameters['assigned_managed_network'] = parameters_assigned_managed_network  # string
    return client.create_or_update(scope=scope, scope_assignment_name=scope_assignment_name, location=location, assigned_managed_network=parameters_assigned_managed_network)
>>>>>>> updated test


def managed_network_scope_assignments_delete(cmd, client,
                                             scope,
                                             scope_assignment_name):
    return client.delete(scope=scope, scope_assignment_name=scope_assignment_name)


def managed_network_managed_network_groups_list(cmd, client,
                                                resource_group_name,
                                                managed_network_name,
                                                top=None,
                                                skiptoken=None):
    return client.list_by_managed_network(resource_group_name=resource_group_name, managed_network_name=managed_network_name, top=top, skiptoken=skiptoken)


def managed_network_managed_network_groups_show(cmd, client,
                                                resource_group_name,
                                                managed_network_name,
                                                managed_network_group_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name)


def managed_network_managed_network_groups_create(cmd, client,
                                                  resource_group_name,
                                                  managed_network_name,
                                                  managed_network_group_name,
                                                  location=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                                  managed_network_group_management_groups=None,
                                                  managed_network_group_subscriptions=None,
                                                  managed_network_group_virtual_networks=None,
                                                  managed_network_group_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=managed_network_group_management_groups, subscriptions=managed_network_group_subscriptions, virtual_networks=managed_network_group_virtual_networks, subnets=managed_network_group_subnets)
=======
=======
>>>>>>> fix some change folder and name issue
                                                  management_groups=None,
                                                  subscriptions=None,
                                                  virtual_networks=None,
                                                  subnets=None):
    managed_network_group = {}
    managed_network_group['location'] = location  # string
    managed_network_group['management_groups'] = None if management_groups is None else management_groups
    managed_network_group['subscriptions'] = None if subscriptions is None else subscriptions
    managed_network_group['virtual_networks'] = None if virtual_networks is None else virtual_networks
    managed_network_group['subnets'] = None if subnets is None else subnets
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=management_groups, subscriptions=subscriptions, virtual_networks=virtual_networks, subnets=subnets)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
=======
>>>>>>> updated test
                                                  managed_network_group_management_groups=None,
                                                  managed_network_group_subscriptions=None,
                                                  managed_network_group_virtual_networks=None,
                                                  managed_network_group_subnets=None):
    managed_network_group = {}
    managed_network_group['location'] = location  # string
    managed_network_group['management_groups'] = None if managed_network_group_management_groups is None else managed_network_group_management_groups
    managed_network_group['subscriptions'] = None if managed_network_group_subscriptions is None else managed_network_group_subscriptions
    managed_network_group['virtual_networks'] = None if managed_network_group_virtual_networks is None else managed_network_group_virtual_networks
    managed_network_group['subnets'] = None if managed_network_group_subnets is None else managed_network_group_subnets
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=managed_network_group_management_groups, subscriptions=managed_network_group_subscriptions, virtual_networks=managed_network_group_virtual_networks, subnets=managed_network_group_subnets)
<<<<<<< HEAD
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
>>>>>>> updated test


def managed_network_managed_network_groups_update(cmd, client,
                                                  resource_group_name,
                                                  managed_network_name,
                                                  managed_network_group_name,
                                                  location=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                                  managed_network_group_management_groups=None,
                                                  managed_network_group_subscriptions=None,
                                                  managed_network_group_virtual_networks=None,
                                                  managed_network_group_subnets=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=managed_network_group_management_groups, subscriptions=managed_network_group_subscriptions, virtual_networks=managed_network_group_virtual_networks, subnets=managed_network_group_subnets)
=======
=======
>>>>>>> fix some change folder and name issue
                                                  management_groups=None,
                                                  subscriptions=None,
                                                  virtual_networks=None,
                                                  subnets=None):
    managed_network_group = {}
    managed_network_group['location'] = location  # string
    managed_network_group['management_groups'] = None if management_groups is None else management_groups
    managed_network_group['subscriptions'] = None if subscriptions is None else subscriptions
    managed_network_group['virtual_networks'] = None if virtual_networks is None else virtual_networks
    managed_network_group['subnets'] = None if subnets is None else subnets
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=management_groups, subscriptions=subscriptions, virtual_networks=virtual_networks, subnets=subnets)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
=======
>>>>>>> updated test
                                                  managed_network_group_management_groups=None,
                                                  managed_network_group_subscriptions=None,
                                                  managed_network_group_virtual_networks=None,
                                                  managed_network_group_subnets=None):
    managed_network_group = {}
    managed_network_group['location'] = location  # string
    managed_network_group['management_groups'] = None if managed_network_group_management_groups is None else managed_network_group_management_groups
    managed_network_group['subscriptions'] = None if managed_network_group_subscriptions is None else managed_network_group_subscriptions
    managed_network_group['virtual_networks'] = None if managed_network_group_virtual_networks is None else managed_network_group_virtual_networks
    managed_network_group['subnets'] = None if managed_network_group_subnets is None else managed_network_group_subnets
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name, location=location, management_groups=managed_network_group_management_groups, subscriptions=managed_network_group_subscriptions, virtual_networks=managed_network_group_virtual_networks, subnets=managed_network_group_subnets)
<<<<<<< HEAD
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
>>>>>>> updated test


def managed_network_managed_network_groups_delete(cmd, client,
                                                  resource_group_name,
                                                  managed_network_name,
                                                  managed_network_group_name):
    return client.delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_group_name=managed_network_group_name)


def managed_network_managed_network_peering_policies_list(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          top=None,
                                                          skiptoken=None):
    return client.list_by_managed_network(resource_group_name=resource_group_name, managed_network_name=managed_network_name, top=top, skiptoken=skiptoken)


def managed_network_managed_network_peering_policies_show(cmd, client,
                                                          resource_group_name,
                                                          managed_network_name,
                                                          managed_network_peering_policy_name):
    return client.get(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name)


def managed_network_managed_network_peering_policies_create(cmd, client,
                                                            resource_group_name,
                                                            managed_network_name,
                                                            managed_network_peering_policy_name,
                                                            location=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                                            managed_network_policy_properties=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)
=======
=======
>>>>>>> fix some change folder and name issue
                                                            id=None,
                                                            properties_spokes=None,
                                                            properties_mesh=None):
    managed_network_policy = {}
    managed_network_policy['location'] = location  # string
    managed_network_policy.setdefault('properties', {})['type'] = properties_type  # choice
    managed_network_policy['id'] = id  # string
    managed_network_policy.setdefault('properties', {})['spokes'] = None if properties_spokes is None else properties_spokes
    managed_network_policy.setdefault('properties', {})['mesh'] = None if properties_mesh is None else properties_mesh
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, type=properties_type, id=id, spokes=properties_spokes, mesh=properties_mesh)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
                                                            managed_network_policy_properties=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
                                                            managed_network_policy_properties=None):
    managed_network_policy = {}
    managed_network_policy['location'] = location  # string
    managed_network_policy['properties'] = None if managed_network_policy_properties is None else managed_network_policy_properties
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)
>>>>>>> updated test


def managed_network_managed_network_peering_policies_update(cmd, client,
                                                            resource_group_name,
                                                            managed_network_name,
                                                            managed_network_peering_policy_name,
                                                            location=None,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                                            managed_network_policy_properties=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)
=======
=======
>>>>>>> fix some change folder and name issue
                                                            id=None,
                                                            properties_spokes=None,
                                                            properties_mesh=None):
    managed_network_policy = {}
    managed_network_policy['location'] = location  # string
    managed_network_policy.setdefault('properties', {})['type'] = properties_type  # choice
    managed_network_policy['id'] = id  # string
    managed_network_policy.setdefault('properties', {})['spokes'] = None if properties_spokes is None else properties_spokes
    managed_network_policy.setdefault('properties', {})['mesh'] = None if properties_mesh is None else properties_mesh
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, type=properties_type, id=id, spokes=properties_spokes, mesh=properties_mesh)
<<<<<<< HEAD
>>>>>>> updated test
=======
=======
                                                            managed_network_policy_properties=None):
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)
>>>>>>> fix some change folder and name issue
>>>>>>> fix some change folder and name issue
=======
                                                            managed_network_policy_properties=None):
    managed_network_policy = {}
    managed_network_policy['location'] = location  # string
    managed_network_policy['properties'] = None if managed_network_policy_properties is None else managed_network_policy_properties
    return client.create_or_update(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name, location=location, properties=managed_network_policy_properties)
>>>>>>> updated test


def managed_network_managed_network_peering_policies_delete(cmd, client,
                                                            resource_group_name,
                                                            managed_network_name,
                                                            managed_network_peering_policy_name):
    return client.delete(resource_group_name=resource_group_name, managed_network_name=managed_network_name, managed_network_peering_policy_name=managed_network_peering_policy_name)


def managed_network_operations_list(cmd, client):
    return client.list()
