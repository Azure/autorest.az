# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/python": "5.0.0-dev.20200211.1"
  "@autorest/clicommon": "latest"
  #"@autorest/python": "latest"
  

python: true
require: 
  - ./readme.python.md
  - ./readme.cli.md

az_common:
    ## The check-name-availability and list-operation are suppressed in CLI by default,
    # enable_methods:
    #   - check-name-availability
    #   - list-operation
    enable_methods: []

pipeline-model: v3

modelerfour:
    group-parameters: true
    flatten-models: true
    flatten-payloads: true


#payload-flattening-threshold: 4
#recursive-payload-flattening: true

directive:
  - from: swagger-document
    where: $..parameters[?(@.in=='body')]
    transform: >
      $['x-ms-client-flatten'] = true;
    reason: Flatten everything for Azure CLI


pipeline:
    python/m2r:
        input: clicommon/identity
    az/aznamer:
        input: python/namer
        #output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        #output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/clicommon
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az

scope-clicommon: false

scope-az:
    is-object: false
    output-artifact:
        #- source-file-pynamer
        #- source-file-aznamer
        #- source-file-modifiers
        - source-file-extension



no-namespace-folders: true
license-header: MICROSOFT_MIT_NO_VERSION
#clear-output-folder: true
scope-codegen/emitter:
    output-folder: "$(python-sdk-output-folder)"

```
