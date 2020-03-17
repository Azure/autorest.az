# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is regenerated.
# --------------------------------------------------------------------------

from typing import Any, Optional

from azure.mgmt.core import ARMPipelineClient
from msrest import Deserializer, Serializer

from ._configuration import ManagedNetworkManagementClientConfiguration
from .operations import ManagedNetworkOperations
from .operations import ScopeAssignmentOperations
from .operations import ManagedNetworkGroupOperations
from .operations import ManagedNetworkPeeringPolicyOperations
from .operations import OperationOperations
from . import models


class ManagedNetworkManagementClient(object):
    """The Microsoft Azure Managed Network management API provides a RESTful set of web services that interact with Microsoft Azure Networks service to programmatically view, control, change, and monitor your entire Azure network centrally and with ease.

    :ivar managed_network: ManagedNetworkOperations operations
    :vartype managed_network: managed_network_management_client.operations.ManagedNetworkOperations
    :ivar scope_assignment: ScopeAssignmentOperations operations
    :vartype scope_assignment: managed_network_management_client.operations.ScopeAssignmentOperations
    :ivar managed_network_group: ManagedNetworkGroupOperations operations
    :vartype managed_network_group: managed_network_management_client.operations.ManagedNetworkGroupOperations
    :ivar managed_network_peering_policy: ManagedNetworkPeeringPolicyOperations operations
    :vartype managed_network_peering_policy: managed_network_management_client.operations.ManagedNetworkPeeringPolicyOperations
    :ivar operation: OperationOperations operations
    :vartype operation: managed_network_management_client.operations.OperationOperations
    :param credential: Credential needed for the client to connect to Azure.
    :type credential: azure.core.credentials.TokenCredential
    :param subscriptionid: Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
    :type subscriptionid: str
    :param str base_url: Service URL
    """

    def __init__(
        self,
        credential,  # type: "TokenCredential"
        subscriptionid,  # type: str
        base_url=None,  # type: Optional[str]
        **kwargs  # type: Any
    ):
        # type: (...) -> None
        if not base_url:
            base_url = 'https://management.azure.com'
        self._config = ManagedNetworkManagementClientConfiguration(credential, subscriptionid, **kwargs)
        self._client = ARMPipelineClient(base_url=base_url, config=self._config, **kwargs)

        client_models = {k: v for k, v in models.__dict__.items() if isinstance(v, type)}
        self._serialize = Serializer(client_models)
        self._deserialize = Deserializer(client_models)

        self.managed_network = ManagedNetworkOperations(
            self._client, self._config, self._serialize, self._deserialize)
        self.scope_assignment = ScopeAssignmentOperations(
            self._client, self._config, self._serialize, self._deserialize)
        self.managed_network_group = ManagedNetworkGroupOperations(
            self._client, self._config, self._serialize, self._deserialize)
        self.managed_network_peering_policy = ManagedNetworkPeeringPolicyOperations(
            self._client, self._config, self._serialize, self._deserialize)
        self.operation = OperationOperations(
            self._client, self._config, self._serialize, self._deserialize)

    def close(self):
        # type: () -> None
        self._client.close()

    def __enter__(self):
        # type: () -> ManagedNetworkManagementClient
        self._client.__enter__()
        return self

    def __exit__(self, *exc_details):
        # type: (Any) -> None
        self._client.__exit__(*exc_details)
