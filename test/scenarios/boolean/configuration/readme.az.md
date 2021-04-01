## CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: bool
  parent-extension: test-server
  package-name: azure-mgmt-boolean
  namespace: azure.mgmt.boolean
  client-subscription-bound: false
  client-base-url-bound: false
  client-authentication-policy: SansIOHTTPPolicy
az-output-folder: $(azure-cli-extension-folder)/src/boolean
python-sdk-output-folder: "$(az-output-folder)/azext_boolean/vendored_sdks/boolean"
extension-description: Bool Services in Test Server 
```
