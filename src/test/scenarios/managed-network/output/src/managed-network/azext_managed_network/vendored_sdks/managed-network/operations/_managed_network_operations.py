# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is regenerated.
# --------------------------------------------------------------------------
from typing import Any, Callable, Dict, Generic, Optional, TypeVar, Union
import warnings

from azure.core.exceptions import map_error
from azure.core.paging import ItemPaged
from azure.core.pipeline import PipelineResponse
from azure.core.pipeline.transport import HttpRequest, HttpResponse
from azure.core.polling import LROPoller, NoPolling, PollingMethod
from azure.mgmt.core.polling.arm_polling import ARMPolling

from .. import models

T = TypeVar('T')
ClsType = Optional[Callable[[PipelineResponse[HttpRequest, HttpResponse], T, Dict[str, Any]], Any]]

class ManagedNetworkOperations(object):
    """ManagedNetworkOperations operations.

    You should not instantiate directly this class, but create a Client instance that will create it for you and attach it as attribute.

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
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetwork"
        """The Get ManagedNetworks operation gets a Managed Network Resource, specified by the resource group and Managed Network name.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :return: ManagedNetwork or the result of cls(response)
        :rtype: ~managed_network_management_client.models.ManagedNetwork
        :raises: ~managed_network_management_client.models.ErrorResponseException:
        """
        cls = kwargs.pop('cls', None )  # type: ClsType["models.ManagedNetwork"]
        error_map = kwargs.pop('error_map', {})
        api_version = "2019-06-01-preview"

        # Construct URL
        url = self.get.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}
        query_parameters['api-version'] = self._serialize.query("api_version", api_version, 'str')

        # Construct headers
        header_parameters = {}
        header_parameters['Accept'] = 'application/json'

        # Construct and send request
        request = self._client.get(url, query_parameters, header_parameters)
        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            raise models.ErrorResponseException.from_response(response, self._deserialize)

        deserialized = self._deserialize('ManagedNetwork', pipeline_response)

        if cls:
          return cls(pipeline_response, deserialized, {})

        return deserialized
    get.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}'}

    def create_or_update(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        location=None,  # type: Optional[str]
        tags=None,  # type: Optional[Dict[str, str]]
        properties=None,  # type: Optional["models.ManagedNetworkProperties"]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetwork"
        """The Put ManagedNetworks operation creates/updates a Managed Network Resource, specified by resource group and Managed Network name.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :param location: The geo-location where the resource lives.
        :type location: str
        :param tags: Resource tags.
        :type tags: dict[str, str]
        :param properties: Properties of Managed Network.
        :type properties: ~managed_network_management_client.models.ManagedNetworkProperties
        :keyword callable cls: A custom type or function that will be passed the direct response
        :return: ManagedNetwork or ManagedNetwork or the result of cls(response)
        :rtype: ~managed_network_management_client.models.ManagedNetwork or ~managed_network_management_client.models.ManagedNetwork
        :raises: ~managed_network_management_client.models.ErrorResponseException:
        """
        cls = kwargs.pop('cls', None )  # type: ClsType["models.ManagedNetwork"]
        error_map = kwargs.pop('error_map', {})

        managed_network = models.ManagedNetwork(location=location, tags=tags, properties=properties)
        api_version = "2019-06-01-preview"

        # Construct URL
        url = self.create_or_update.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}
        query_parameters['api-version'] = self._serialize.query("api_version", api_version, 'str')

        # Construct headers
        header_parameters = {}
        header_parameters['Accept'] = 'application/json'
        header_parameters['Content-Type'] = 'application/json'

        # Construct body
        body_content = self._serialize.body(managed_network, 'ManagedNetwork')

        # Construct and send request
        request = self._client.put(url, query_parameters, header_parameters, body_content)
        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200, 201]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            raise models.ErrorResponseException.from_response(response, self._deserialize)

        deserialized = None
        if response.status_code == 200:
            deserialized = self._deserialize('ManagedNetwork', pipeline_response)

        if response.status_code == 201:
            deserialized = self._deserialize('ManagedNetwork', pipeline_response)

        if cls:
          return cls(pipeline_response, deserialized, {})

        return deserialized
    create_or_update.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}'}

    def _delete_initial(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        **kwargs  # type: Any
    ):
        # type: (...) -> None
        cls = kwargs.pop('cls', None )  # type: ClsType[None]
        error_map = kwargs.pop('error_map', {})
        api_version = "2019-06-01-preview"

        # Construct URL
        url = self._delete_initial.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}
        query_parameters['api-version'] = self._serialize.query("api_version", api_version, 'str')

        # Construct headers
        header_parameters = {}

        # Construct and send request
        request = self._client.delete(url, query_parameters, header_parameters)
        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200, 202, 204]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            raise models.ErrorResponseException.from_response(response, self._deserialize)

        if cls:
          return cls(pipeline_response, None, {})

    _delete_initial.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}'}

    def begin_delete(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        **kwargs  # type: Any
    ):
        # type: (...) -> None
        """The Delete ManagedNetworks operation deletes a Managed Network Resource, specified by the  resource group and Managed Network name.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :keyword polling: True for ARMPolling, False for no polling, or a
         polling object for personal polling strategy
        :paramtype polling: bool or ~azure.core.polling.PollingMethod
        :return: An instance of LROPoller that returns None
        :rtype: ~azure.core.polling.LROPoller[None]

        :raises ~managed_network_management_client.models.ErrorResponseException:
        """
        polling = kwargs.pop('polling', True)  # type: Union[bool, PollingMethod]
        cls = kwargs.pop('cls', None )  # type: ClsType[None]
        raw_result = self._delete_initial(
            resource_group_name=resource_group_name,
            managed_network_name=managed_network_name,
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
    begin_delete.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}'}

    def _update_initial(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        tags=None,  # type: Optional[Dict[str, str]]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetwork"
        cls = kwargs.pop('cls', None )  # type: ClsType["models.ManagedNetwork"]
        error_map = kwargs.pop('error_map', {})

        parameters = models.ManagedNetworkUpdate(tags=tags)
        api_version = "2019-06-01-preview"

        # Construct URL
        url = self._update_initial.metadata['url']
        path_format_arguments = {
            'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
            'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
            'managedNetworkName': self._serialize.url("managed_network_name", managed_network_name, 'str'),
        }
        url = self._client.format_url(url, **path_format_arguments)

        # Construct parameters
        query_parameters = {}
        query_parameters['api-version'] = self._serialize.query("api_version", api_version, 'str')

        # Construct headers
        header_parameters = {}
        header_parameters['Accept'] = 'application/json'
        header_parameters['Content-Type'] = 'application/json'

        # Construct body
        body_content = self._serialize.body(parameters, 'ManagedNetworkUpdate')

        # Construct and send request
        request = self._client.patch(url, query_parameters, header_parameters, body_content)
        pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
        response = pipeline_response.http_response

        if response.status_code not in [200, 201]:
            map_error(status_code=response.status_code, response=response, error_map=error_map)
            raise models.ErrorResponseException.from_response(response, self._deserialize)

        deserialized = None
        if response.status_code == 200:
            deserialized = self._deserialize('ManagedNetwork', pipeline_response)

        if response.status_code == 201:
            deserialized = self._deserialize('ManagedNetwork', pipeline_response)

        if cls:
          return cls(pipeline_response, deserialized, {})

        return deserialized
    _update_initial.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}'}

    def begin_update(
        self,
        resource_group_name,  # type: str
        managed_network_name,  # type: str
        tags=None,  # type: Optional[Dict[str, str]]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetwork"
        """Updates the specified Managed Network resource tags.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param managed_network_name: The name of the Managed Network.
        :type managed_network_name: str
        :param tags: Resource tags.
        :type tags: dict[str, str]
        :keyword callable cls: A custom type or function that will be passed the direct response
        :keyword polling: True for ARMPolling, False for no polling, or a
         polling object for personal polling strategy
        :paramtype polling: bool or ~azure.core.polling.PollingMethod
        :return: An instance of LROPoller that returns ManagedNetwork
        :rtype: ~azure.core.polling.LROPoller[~managed_network_management_client.models.ManagedNetwork]

        :raises ~managed_network_management_client.models.ErrorResponseException:
        """
        polling = kwargs.pop('polling', True)  # type: Union[bool, PollingMethod]
        cls = kwargs.pop('cls', None )  # type: ClsType["models.ManagedNetwork"]
        raw_result = self._update_initial(
            resource_group_name=resource_group_name,
            managed_network_name=managed_network_name,
            tags=tags,
            cls=lambda x,y,z: x,
            **kwargs
        )

        def get_long_running_output(pipeline_response):
            deserialized = self._deserialize('ManagedNetwork', pipeline_response)

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
    begin_update.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks/{managedNetworkName}'}

    def list_by_resource_group(
        self,
        resource_group_name,  # type: str
        top=None,  # type: Optional[int]
        skiptoken=None,  # type: Optional[str]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetworkListResult"
        """The ListByResourceGroup ManagedNetwork operation retrieves all the Managed Network resources in a resource group in a paginated format.

        :param resource_group_name: The name of the resource group.
        :type resource_group_name: str
        :param top: May be used to limit the number of results in a page for list queries.
        :type top: int
        :param skiptoken: Skiptoken is only used if a previous operation returned a partial result. If
         a previous response contains a nextLink element, the value of the nextLink element will include
         a skiptoken parameter that specifies a starting point to use for subsequent calls.
        :type skiptoken: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :return: ManagedNetworkListResult or the result of cls(response)
        :rtype: ~managed_network_management_client.models.ManagedNetworkListResult
        :raises: ~managed_network_management_client.models.ErrorResponseException:
        """
        cls = kwargs.pop('cls', None )  # type: ClsType["models.ManagedNetworkListResult"]
        error_map = kwargs.pop('error_map', {})
        api_version = "2019-06-01-preview"

        def prepare_request(next_link=None):
            if not next_link:
                # Construct URL
                url = self.list_by_resource_group.metadata['url']
                path_format_arguments = {
                    'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
                    'resourceGroupName': self._serialize.url("resource_group_name", resource_group_name, 'str'),
                }
                url = self._client.format_url(url, **path_format_arguments)
            else:
                url = next_link

            # Construct parameters
            query_parameters = {}
            query_parameters['api-version'] = self._serialize.query("api_version", api_version, 'str')
            if top is not None:
                query_parameters['$top'] = self._serialize.query("top", top, 'int', maximum=20, minimum=1)
            if skiptoken is not None:
                query_parameters['$skiptoken'] = self._serialize.query("skiptoken", skiptoken, 'str')

            # Construct headers
            header_parameters = {}
            header_parameters['Accept'] = 'application/json'

            # Construct and send request
            request = self._client.get(url, query_parameters, header_parameters)
            return request

        def extract_data(pipeline_response):
            deserialized = self._deserialize('ManagedNetworkListResult', pipeline_response)
            list_of_elem = deserialized.value
            if cls:
                list_of_elem = cls(list_of_elem)
            return deserialized.next_link, iter(list_of_elem)

        def get_next(next_link=None):
            request = prepare_request(next_link)

            pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
            response = pipeline_response.http_response

            if response.status_code not in [200]:
                map_error(status_code=response.status_code, response=response, error_map=error_map)
                raise models.ErrorResponseException.from_response(response, self._deserialize)

            return pipeline_response

        return ItemPaged(
            get_next, extract_data
        )
    list_by_resource_group.metadata = {'url': '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetwork/managedNetworks'}

    def list_by_subscription(
        self,
        top=None,  # type: Optional[int]
        skiptoken=None,  # type: Optional[str]
        **kwargs  # type: Any
    ):
        # type: (...) -> "models.ManagedNetworkListResult"
        """The ListBySubscription  ManagedNetwork operation retrieves all the Managed Network Resources in the current subscription in a paginated format.

        :param top: May be used to limit the number of results in a page for list queries.
        :type top: int
        :param skiptoken: Skiptoken is only used if a previous operation returned a partial result. If
         a previous response contains a nextLink element, the value of the nextLink element will include
         a skiptoken parameter that specifies a starting point to use for subsequent calls.
        :type skiptoken: str
        :keyword callable cls: A custom type or function that will be passed the direct response
        :return: ManagedNetworkListResult or the result of cls(response)
        :rtype: ~managed_network_management_client.models.ManagedNetworkListResult
        :raises: ~managed_network_management_client.models.ErrorResponseException:
        """
        cls = kwargs.pop('cls', None )  # type: ClsType["models.ManagedNetworkListResult"]
        error_map = kwargs.pop('error_map', {})
        api_version = "2019-06-01-preview"

        def prepare_request(next_link=None):
            if not next_link:
                # Construct URL
                url = self.list_by_subscription.metadata['url']
                path_format_arguments = {
                    'subscriptionId': self._serialize.url("self._config.subscription_id", self._config.subscription_id, 'str'),
                }
                url = self._client.format_url(url, **path_format_arguments)
            else:
                url = next_link

            # Construct parameters
            query_parameters = {}
            query_parameters['api-version'] = self._serialize.query("api_version", api_version, 'str')
            if top is not None:
                query_parameters['$top'] = self._serialize.query("top", top, 'int', maximum=20, minimum=1)
            if skiptoken is not None:
                query_parameters['$skiptoken'] = self._serialize.query("skiptoken", skiptoken, 'str')

            # Construct headers
            header_parameters = {}
            header_parameters['Accept'] = 'application/json'

            # Construct and send request
            request = self._client.get(url, query_parameters, header_parameters)
            return request

        def extract_data(pipeline_response):
            deserialized = self._deserialize('ManagedNetworkListResult', pipeline_response)
            list_of_elem = deserialized.value
            if cls:
                list_of_elem = cls(list_of_elem)
            return deserialized.next_link, iter(list_of_elem)

        def get_next(next_link=None):
            request = prepare_request(next_link)

            pipeline_response = self._client._pipeline.run(request, stream=False, **kwargs)
            response = pipeline_response.http_response

            if response.status_code not in [200]:
                map_error(status_code=response.status_code, response=response, error_map=error_map)
                raise models.ErrorResponseException.from_response(response, self._deserialize)

            return pipeline_response

        return ItemPaged(
            get_next, extract_data
        )
    list_by_subscription.metadata = {'url': '/subscriptions/{subscriptionId}/providers/Microsoft.ManagedNetwork/managedNetworks'}
