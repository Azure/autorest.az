## Azure CLI

These settings apply only when `--az` is specified on the command line.

``` yaml $(az)
az:
  extensions: mixed-reality
  package-name: azure-mgmt-mixedreality
  namespace: azure.mgmt.mixedreality
az-output-folder: $(azure-cli-extension-folder)/src/mixed-reality
python-sdk-output-folder: "$(az-output-folder)/azext_mixed_reality/vendored_sdks/mixedreality"

directive:
    - where:
          group: mixed-reality spatial-anchor-account
      set:
          group: spatial-anchors-account
    - where:
          group: mixed-reality remote-rendering-account
      set:
          group: remote-rendering-account

cli:
    cli-directive:
        - where:
              group: "*"
              op: "*"
          hidden: true
        - where:
              group: RemoteRenderingAccounts
              op: "*"
          hidden: false
        - where:
              group: SpatialAnchorsAccounts
              op: RegenerateKeys
          hidden: false