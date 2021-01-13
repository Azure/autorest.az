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


def test_server_bool_put_false(client):
    return client.put_false()


def test_server_bool_put_true(client):
    return client.put_true()


def test_server_bool_show_false(client):
    return client.get_false()


def test_server_bool_show_invalid(client):
    return client.get_invalid()


def test_server_bool_show_null(client):
    return client.get_null()


def test_server_bool_show_true(client):
    return client.get_true()