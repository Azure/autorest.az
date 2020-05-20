# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is regenerated.
# --------------------------------------------------------------------------

from typing import TYPE_CHECKING

from azure.mgmt.core import ARMPipelineClient
from msrest import Deserializer, Serializer

if TYPE_CHECKING:
    # pylint: disable=unused-import,ungrouped-imports
    from typing import Any, Optional

from ._configuration import DFAZManagementClientConfiguration
from .operations import FactoryOperations
from .operations import TriggerOperations
from .operations import IntegrationRuntimeOperations
from . import models


class DFAZManagementClient(object):
    """The DFAZ Client.

    :ivar factory: FactoryOperations operations
    :vartype factory: azure.mgmt.datafactory.operations.FactoryOperations
    :ivar trigger: TriggerOperations operations
    :vartype trigger: azure.mgmt.datafactory.operations.TriggerOperations
    :ivar integration_runtime: IntegrationRuntimeOperations operations
    :vartype integration_runtime: azure.mgmt.datafactory.operations.IntegrationRuntimeOperations
    :param credential: Credential needed for the client to connect to Azure.
    :type credential: ~azure.core.credentials.TokenCredential
    :param subscription_id: The subscription identifier.
    :type subscription_id: str
    :param str base_url: Service URL
    :keyword int polling_interval: Default waiting time between two polls for LRO operations if no Retry-After header is present.
    """

    def __init__(
        self,
        credential,  # type: "TokenCredential"
        subscription_id,  # type: str
        base_url=None,  # type: Optional[str]
        **kwargs  # type: Any
    ):
        # type: (...) -> None
        if not base_url:
            base_url = 'https://management.azure.com'
        self._config = DFAZManagementClientConfiguration(credential, subscription_id, **kwargs)
        self._client = ARMPipelineClient(base_url=base_url, config=self._config, **kwargs)

        client_models = {k: v for k, v in models.__dict__.items() if isinstance(v, type)}
        self._serialize = Serializer(client_models)
        self._deserialize = Deserializer(client_models)

        self.factory = FactoryOperations(
            self._client, self._config, self._serialize, self._deserialize)
        self.trigger = TriggerOperations(
            self._client, self._config, self._serialize, self._deserialize)
        self.integration_runtime = IntegrationRuntimeOperations(
            self._client, self._config, self._serialize, self._deserialize)

    def close(self):
        # type: () -> None
        self._client.close()

    def __enter__(self):
        # type: () -> DFAZManagementClient
        self._client.__enter__()
        return self

    def __exit__(self, *exc_details):
        # type: (Any) -> None
        self._client.__exit__(*exc_details)
