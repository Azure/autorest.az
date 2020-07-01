# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------
# pylint: disable=too-many-lines


def testserver_bool_get_false(client):
    return client.get_false()


def testserver_bool_get_invalid(client):
    return client.get_invalid()


def testserver_bool_get_null(client):
    return client.get_null()


def testserver_bool_get_true(client):
    return client.get_true()


def testserver_bool_put_false(client):
    return client.put_false()


def testserver_bool_put_true(client):
    return client.put_true()
