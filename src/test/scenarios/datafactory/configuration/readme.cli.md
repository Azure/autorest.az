## CLI

These settings don't need to apply `--cli` on the command line.

``` yaml $(cli)
cli:
  cli-name: datafactory
  test-scenario:
    - name: /Factories/put/Factories_CreateOrUpdate
    - name: /Factories/get/Factories_Get
    - name: /Factories/get/Factories_List
    - name: /Factories/get/Factories_ListByResourceGroup
    - name: /Factories/post/Factories_ConfigureFactoryRepo
    - name: /Factories/post/Factories_GetDataPlaneAccess
    - name: /Factories/post/Factories_GetGitHubAccessToken
    - name: /Factories/patch/Factories_Update
    - name: /IntegrationRuntimes/put/IntegrationRuntimes_Create
    - name: /IntegrationRuntimes/put/IntegrationRuntimes_Create
    - name: /IntegrationRuntimes/get/IntegrationRuntimes_Get
    - name: /IntegrationRuntimes/get/IntegrationRuntimes_ListByFactory
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_CreateLinkedIntegrationRuntime
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_GetConnectionInfo
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_GetMonitoringData
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_GetStatus
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_ListAuthKeys
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_RegenerateAuthKey
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_RemoveLinks
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_Start
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_Stop
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_SyncCredentials
    - name: /IntegrationRuntimes/post/IntegrationRuntimes_Upgrade
    - name: /IntegrationRuntimes/patch/IntegrationRuntimes_Update
    - name: /Triggers/put/Triggers_Create
    - name: /Triggers/put/Triggers_Update
    - name: /Triggers/get/Triggers_Get
    - name: /Triggers/get/Triggers_ListByFactory
    - name: /Triggers/post/Triggers_GetEventSubscriptionStatus
    - name: /Triggers/post/Triggers_QueryByFactory
    - name: /Triggers/post/Triggers_Start
    - name: /Triggers/post/Triggers_Stop
    - name: /Triggers/post/Triggers_SubscribeToEvents
    - name: /Triggers/post/Triggers_UnsubscribeFromEvents
    - name: /IntegrationRuntimes/delete/IntegrationRuntimes_Delete
    - name: /Triggers/delete/Triggers_Delete
    - name: /Factories/delete/Factories_Delete
```
