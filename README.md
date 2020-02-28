# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/clicommon": "latest"
  #"@autorest/python": "latest"
  "@autorest/python": "5.0.0-dev.20200211.1"

python: true
cli: true
try-require:
  - ./readme.python.md
  - ./readme.cli.md
  
pipeline-model: v3

modelerfour:
    group-parameters: true
    flatten-models: true
    flatten-payloads: true


#payload-flattening-threshold: 4
#recursive-payload-flattening: true

pipeline:
    az/clicommon:
        input: python/namer
        #output-artifact: source-file-pynamer
    az/aznamer:
        input: az/clicommon
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
#clear-output-folder: true
scope-codegen/emitter:
    output-folder: "$(python-sdk-output-folder)"

```
