
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
          group: user-user
      set:
          group: user
    - where:
          command: create-user
      set:
          command: create
    - where:
          command: get-user
      set:
          command: get
    - where:
          command: list-user
      set:
          command: list
    - where:
          command: update-user
      set:
          command: update

modelerfour:
    lenient-model-deduplication: true
    group-parameters: true
    flatten-models: true
    flatten-payloads: true
```
  