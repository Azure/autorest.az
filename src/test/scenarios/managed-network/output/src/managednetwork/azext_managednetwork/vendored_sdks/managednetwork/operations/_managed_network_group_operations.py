# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is regenerated.
# --------------------------------------------------------------------------
from typing import Any, Callable, Dict, Generic, List, Optional, TypeVar, Union
import warnings

from azure.core.exceptions import HttpResponseError, ResourceExistsError, ResourceNotFoundError, map_error
from azure.core.paging import ItemPaged
from azure.core.pipeline import PipelineResponse
from azure.core.pipeline.transport import HttpRequest, HttpResponse
from azure.core.polling import LROPoller, NoPolling, PollingMethod
from azure.mgmt.core.exceptions import ARMErrorFormat
from azure.mgmt.core.polling.arm_polling import ARMPolling

from .. import models

T = TypeVar('T')
ClsType = Optional[Callable[[PipelineResponse[HttpRequest, HttpResponse], T, Dict[str, Any]], Any]]

class ManagedNetworkGroupOperations(object):
    """ManagedNetworkGroupOperations operations.

    You should not instantiate this class directly. Instead, you should create a Client instance that
    instantiates it for you and attaches it as an attribute.

    :ivar models: Alias to model classes used in this operation group.
    :type models: ~managed_network_management_client.models
    :param client: Client for service requests.
    :param config: Configuration of service client.
    :param serializer: An object model serializer.
    :param deserializer: An object model deserializer.
    """

    models = models

    def __init__(self, client, config, serializer, deserializer):
        self._client = client
        self._serialize = serializer
        self._deserialize = deserializer
        self._config = config

    def get(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        managed_network_group_name,  # type: str
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetworkGroup"
        """The Get ManagedNetworkGroups operation gets a Managed Network Group specified by the resource group, Managed Network name, and group name.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :param managed_network_group_name: The name of the Managed Network Group.
        :type managed_network_group_name: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :return: ManagedNetworkGroup or the result of cls(response)
        :rtype: ~managed_network_management_client.models.ManagedNetworkGroup
        :raises: ~azure.core.exceptions.HttpResponseError
        """
        cls = kwargs.pop('cls', None)  # type: ClsType["models.ManagedNetworkGroup"]
        error_map = kwargs.pop('error_map', {404: ResourceNotFoundError, 409: ResourceExistsError})

        # Construct URL
        url = self.get.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
            'managedNetworkGroupName': self._serialize.url("managed_network_group_name", managed_network_group_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}  # type: Dict[str, Any]
        query_parameters['api-version'] = self._serialize.query("self._config.apiversion", self._config.apiversion, 'str')

        # Construct headers
        header_parameters = {}  # type: Dict[str, Any]
        header_parameters['Accept'] = 'application/json'

        # Construct and send request
        request = self._client.get(url, query_parameters, header_parameters)
        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            error = self._deserialize(models.ErrorResponse, response)
            raise HttpResponseError(response=response, model=error, error_format=ARMErrorFormat)

        deserialized = self._deserialize('ManagedNetworkGroup', pipeline_response)

        if cls:
          return cls(pipeline_response, deserialized, {})

        return deserialized
    get.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}/managedNetworkGroups/{managedNetworkGroupName}'}

    def _create_or_update_initial(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        managed_network_group_name,  # type: str
        location=None,  # type: Optional[str]
        management_groups=None,  # type: Optional[List["ResourceId"]]
        subscriptions=None,  # type: Optional[List["ResourceId"]]
        virtual_networks=None,  # type: Optional[List["ResourceId"]]
        subnets=None,  # type: Optional[List["ResourceId"]]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetworkGroup"
        cls = kwargs.pop('cls', None)  # type: ClsType["models.ManagedNetworkGroup"]
        error_map = kwargs.pop('error_map', {404: ResourceNotFoundError, 409: ResourceExistsError})

        _managed_network_group = models.ManagedNetworkGroup(location=location, management_groups=management_groups, subscriptions=subscriptions, virtual_networks=virtual_networks, subnets=subnets)

        # Construct URL
        url = self._create_or_update_initial.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
            'managedNetworkGroupName': self._serialize.url("managed_network_group_name", managed_network_group_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}  # type: Dict[str, Any]
        query_parameters['api-version'] = self._serialize.query("self._config.apiversion", self._config.apiversion, 'str')

        # Construct headers
        header_parameters = {}  # type: Dict[str, Any]
        header_parameters['Accept'] = 'application/json'
        header_parameters['Content-Type'] = kwargs.pop('content_type', 'application/json')

        # Construct and send request
        body_content_kwargs = {}  # type: Dict[str, Any]
        body_content = self._serialize.body(_managed_network_group, 'ManagedNetworkGroup')
        body_content_kwargs['content'] = body_content
        request = self._client.put(url, query_parameters, header_parameters, **body_content_kwargs)

        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200, 201]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            error = self._deserialize(models.ErrorResponse, response)
            raise HttpResponseError(response=response, model=error, error_format=ARMErrorFormat)

        deserialized = None
        if response.status_code == 200:
            deserialized = self._deserialize('ManagedNetworkGroup', pipeline_response)

        if response.status_code == 201:
            deserialized = self._deserialize('ManagedNetworkGroup', pipeline_response)

        if cls:
          return cls(pipeline_response, deserialized, {})

        return deserialized
    _create_or_update_initial.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}/managedNetworkGroups/{managedNetworkGroupName}'}

    def begin_create_or_update(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        managed_network_group_name,  # type: str
        location=None,  # type: Optional[str]
        management_groups=None,  # type: Optional[List["ResourceId"]]
        subscriptions=None,  # type: Optional[List["ResourceId"]]
        virtual_networks=None,  # type: Optional[List["ResourceId"]]
        subnets=None,  # type: Optional[List["ResourceId"]]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetworkGroup"
        """The Put ManagedNetworkGroups operation creates or updates a Managed Network Group resource.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :param managed_network_group_name: The name of the Managed Network Group.
        :type managed_network_group_name: str
        :param location: The geo-location where the resource lives.
        :type location: str
        :param management_groups: The collection of management groups covered by the Managed Network.
        :type management_groups: list[~managed_network_management_client.models.ResourceId]
        :param subscriptions: The collection of subscriptions covered by the Managed Network.
        :type subscriptions: list[~managed_network_management_client.models.ResourceId]
        :param virtual_networks: The collection of virtual nets covered by the Managed Network.
        :type virtual_networks: list[~managed_network_management_client.models.ResourceId]
        :param subnets: The collection of  subnets covered by the Managed Network.
        :type subnets: list[~managed_network_management_client.models.ResourceId]
        :keyword callable cls: A custom type or function that will be passed the direct response
        :keyword polling: True for ARMPolling, False for no polling, or a
         polling object for personal polling strategy
        :paramtype polling: bool or ~azure.core.polling.PollingMethod
        :return: An instance of LROPoller that returns ManagedNetworkGroup
        :rtype: ~azure.core.polling.LROPoller[~managed_network_management_client.models.ManagedNetworkGroup]

        :raises ~azure.core.exceptions.HttpResponseError:
        """
        polling = kwargs.pop('polling', True)  # type: Union[bool, PollingMethod]
        cls = kwargs.pop('cls', None)  # type: ClsType["models.ManagedNetworkGroup"]
        raw_result = self._create_or_update_initial(
            resource_group_name=resource_group_name,
            managed_network_name=managed_network_name,
            managed_network_group_name=managed_network_group_name,
            location=location,
            management_groups=management_groups,
            subscriptions=subscriptions,
            virtual_networks=virtual_networks,
            subnets=subnets,
            cls=lambda x,y,z: x,
            **kwargs
        )

        def get_long_running_output(pipeline_response):
            deserialized = self._deserialize('ManagedNetworkGroup', pipeline_response)

            if cls:
                return cls(pipeline_response, deserialized, {})
            return deserialized

        lro_delay = kwargs.get(
            'polling_interval',
            self._config.polling_interval
        )
        if polling is True: polling_method = ARMPolling(lro_delay, lro_options={'final-state-via': 'azure-async-operation'},  **kwargs)
        elif polling is False: polling_method = NoPolling()
        else: polling_method = polling
        return LROPoller(self._client, raw_result, get_long_running_output, polling_method)
    begin_create_or_update.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}/managedNetworkGroups/{managedNetworkGroupName}'}

    def _delete_initial(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        managed_network_group_name,  # type: str
        **kwargs  # type: Any
    ):
        # type: (...) -> None
        cls = kwargs.pop('cls', None)  # type: ClsType[None]
        error_map = kwargs.pop('error_map', {404: ResourceNotFoundError, 409: ResourceExistsError})

        # Construct URL
        url = self._delete_initial.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
            'managedNetworkGroupName': self._serialize.url("managed_network_group_name", managed_network_group_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}  # type: Dict[str, Any]
        query_parameters['api-version'] = self._serialize.query("self._config.apiversion", self._config.apiversion, 'str')

        # Construct headers
        header_parameters = {}  # type: Dict[str, Any]

        # Construct and send request
        request = self._client.delete(url, query_parameters, header_parameters)
        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200, 202, 204]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            error = self._deserialize(models.ErrorResponse, response)
            raise HttpResponseError(response=response, model=error, error_format=ARMErrorFormat)

        if cls:
          return cls(pipeline_response, None, {})

    _delete_initial.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}/managedNetworkGroups/{managedNetworkGroupName}'}

    def begin_delete(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        managed_network_group_name,  # type: str
        **kwargs  # type: Any
    ):
        # type: (...) -> None
        """The Delete ManagedNetworkGroups operation deletes a Managed Network Group specified by the resource group, Managed Network name, and group name.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :param managed_network_group_name: The name of the Managed Network Group.
        :type managed_network_group_name: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :keyword polling: True for ARMPolling, False for no polling, or a
         polling object for personal polling strategy
        :paramtype polling: bool or ~azure.core.polling.PollingMethod
        :return: An instance of LROPoller that returns None
        :rtype: ~azure.core.polling.LROPoller[None]

        :raises ~azure.core.exceptions.HttpResponseError:
        """
        polling = kwargs.pop('polling', True)  # type: Union[bool, PollingMethod]
        cls = kwargs.pop('cls', None)  # type: ClsType[None]
        raw_result = self._delete_initial(
            resource_group_name=resource_group_name,
            managed_network_name=managed_network_name,
            managed_network_group_name=managed_network_group_name,
            cls=lambda x,y,z: x,
            **kwargs
        )

        def get_long_running_output(pipeline_response):
            if cls:
                return cls(pipeline_response, None, {})

        lro_delay = kwargs.get(
            'polling_interval',
            self._config.polling_interval
        )
        if polling is True: polling_method = ARMPolling(lro_delay, lro_options={'final-state-via': 'azure-async-operation'},  **kwargs)
        elif polling is False: polling_method = NoPolling()
        else: polling_method = polling
        return LROPoller(self._client, raw_result, get_long_running_output, polling_method)
    begin_delete.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}/managedNetworkGroups/{managedNetworkGroupName}'}

    def list_by_managed_network(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        top=None,  # type: Optional[int]
        skiptoken=None,  # type: Optional[str]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetworkGroupListResult"
        """The ListByManagedNetwork ManagedNetworkGroup operation retrieves all the Managed Network Groups in a specified Managed Networks in a paginated format.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :param top: May be used to limit the number of results in a page for list queries.
        :type top: int
        :param skiptoken: Skiptoken is only used if a previous operation returned a partial result. If
     a previous response contains a nextLink element, the value of the nextLink element will include
     a skiptoken parameter that specifies a starting point to use for subsequent calls.
        :type skiptoken: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :return: ManagedNetworkGroupListResult or the result of cls(response)
        :rtype: ~managed_network_management_client.models.ManagedNetworkGroupListResult
        :raises: ~azure.core.exceptions.HttpResponseError
        """
        cls = kwargs.pop('cls', None)  # type: ClsType["models.ManagedNetworkGroupListResult"]
        error_map = kwargs.pop('error_map', {404: ResourceNotFoundError, 409: ResourceExistsError})

        def prepare_request(next_link=None):
            if not next_link:
                # Construct URL
                url = self.list_by_managed_network.metadata['url']
                path_format_arguments = {
                    'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
                    'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
                    'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
                }
                url = self._client.format_url(url, **path_format_arguments)
            else:
                url = next_link

            # Construct parameters
            query_parameters = {}  # type: Dict[str, Any]
            query_parameters['api-version'] = self._serialize.query("self._config.apiversion", self._config.apiversion, 'str')
            if top is not None:
                query_parameters['$top'] = self._serialize.query("top", top, 'int', maximum=20, minimum=1)
            if skiptoken is not None:
                query_parameters['$skiptoken'] = self._serialize.query("skiptoken", skiptoken, 'str')

            # Construct headers
            header_parameters = {}  # type: Dict[str, Any]
            header_parameters['Accept'] = 'application/json'

            # Construct and send request
            request = self._client.get(url, query_parameters, header_parameters)
            return request

        def extract_data(pipeline_response):
            deserialized = self._deserialize('ManagedNetworkGroupListResult', pipeline_response)
            list_of_elem = deserialized.value
            if cls:
                list_of_elem = cls(list_of_elem)
            return deserialized.next_link or None, iter(list_of_elem)

        def get_next(next_link=None):
            request = prepare_request(next_link)

            pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
            response = pipeline_response.http_response

            if response.status_code not in [200]:
                error = self._deserialize(models.ErrorResponse, response)
                map_error(status_code=response.status_code, response=response, error_map=error_map)
                raise HttpResponseError(response=response, model=error, error_format=ARMErrorFormat)

            return pipeline_response

        return ItemPaged(
            get_next, extract_data
        )
    list_by_managed_network.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}/managedNetworkGroups'}
