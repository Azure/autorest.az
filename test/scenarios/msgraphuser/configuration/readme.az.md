
# CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: users_v1_0
  package-name: azure-mgmt-users
  namespace: azure.mgmt.users
  client-subscription-bound: false
  client-base-url-bound: false

az-output-folder: $(azure-cli-extension-folder)/users_v1_0
python-sdk-output-folder: "$(az-output-folder)/azext_users_v1_0/vendored_sdks/users"
cli-core-lib: msgraph.cli.core

directive:
    - where:
          group: users_v1_0
      set:
          group: users
    - where:
          group: users user-user
      set:
          group: users user
    - where:
          command: users user create-user
      set:
          command: users user create
    - where:
          command: users user update-user
      set:
          command: users user update
    - where:
          command: users user show-user
      set:
          command: users user show
    - where:
          command: users user list-user
      set:
          command: users user list
    - where:
          command: users user delete-user
      set:
          command: users user delete

modelerfour:
    lenient-model-deduplication: true
    group-parameters: true
    flatten-models: true
    flatten-payloads: true
```
  