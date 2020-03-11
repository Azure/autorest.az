# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is regenerated.
# --------------------------------------------------------------------------

from typing import Any, Optional

from azure.mgmt.core import AsyncARMPipelineClient
from msrest import Deserializer, Serializer

from ._configuration_async import ManagedNetworkManagementClientConfiguration
from .operations_async import ManagedNetworkOperations
from .operations_async import ScopeAssignmentOperations
from .operations_async import ManagedNetworkGroupOperations
from .operations_async import ManagedNetworkPeeringPolicyOperations
from .operations_async import OperationOperations
from .. import models


class ManagedNetworkManagementClient(object):
    """The Microsoft Azure Managed Network management API provides a RESTful set of web services that interact with Microsoft Azure Networks service to programmatically view, control, change, and monitor your entire Azure network centrally and with ease.

    :ivar managed_network: ManagedNetworkOperations operations
    :vartype managed_network: managed_network_management_client.aio.operations_async.ManagedNetworkOperations
    :ivar scope_assignment: ScopeAssignmentOperations operations
    :vartype scope_assignment: managed_network_management_client.aio.operations_async.ScopeAssignmentOperations
    :ivar managed_network_group: ManagedNetworkGroupOperations operations
    :vartype managed_network_group: managed_network_management_client.aio.operations_async.ManagedNetworkGroupOperations
    :ivar managed_network_peering_policy: ManagedNetworkPeeringPolicyOperations operations
    :vartype managed_network_peering_policy: managed_network_management_client.aio.operations_async.ManagedNetworkPeeringPolicyOperations
    :ivar operation: OperationOperations operations
    :vartype operation: managed_network_management_client.aio.operations_async.OperationOperations
    :param credential: Credential needed for the client to connect to Azure.
    :type credential: azure.core.credentials.TokenCredential
    :param subscription_id: Gets subscription credentials which uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
    :type subscription_id: str
    :param str base_url: Service URL
    """

    def __init__(
        self,
        credential: "TokenCredential",
        subscription_id: str,
        base_url: Optional[str] = None,
        **kwargs: Any
    ) -> None:
        if not base_url:
            base_url = 'https://management.azure.com'
        self._config = ManagedNetworkManagementClientConfiguration(credential, subscription_id, **kwargs)
        self._client = AsyncARMPipelineClient(base_url=base_url, config=self._config, **kwargs)

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

    async def close(self) -> None:
        await self._client.close()

    async def __aenter__(self) -> "ManagedNetworkManagementClient":
        await self._client.__aenter__()
        return self

    async def __aexit__(self, *exc_details) -> None:
        await self._client.__aexit__(*exc_details)
