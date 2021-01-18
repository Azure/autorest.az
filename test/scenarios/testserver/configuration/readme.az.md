## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: testserver
  package-name: azure-mgmt-testserver
  namespace: azure.mgmt.testserver
  client-subscription-bound: false
  client-base-url-bound: false
  client-authentication-policy: SansIOHTTPPolicy
az-output-folder: $(azure-cli-extension-folder)/src/testserver
python-sdk-output-folder: "$(az-output-folder)/azext_testserver/vendored_sdks/testserver"
sdk-flatten: true
  
#cli:
#    cli-directive:
#      directive on operationGroup
#       - select: 'operationGroup'
#         where:
#             operationGroup: 'operations'
#         hidden: true
#       - where:
#             parameter: location
#         required: true

```
