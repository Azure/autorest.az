# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/python": "5.0.0-dev.20200211.1"
  "@autorest/clicommon": "c:/git/autorest.clicommon"
  

python: true
require: 
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
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az

scope-clicommon: false

scope-az:
    is-object: false
    output-artifact:
        #- source-file-aznamer
        #- source-file-modifiers
        - source-file-extension



no-namespace-folders: true
#clear-output-folder: true
scope-codegen/emitter:
    output-folder: "$(python-sdk-output-folder)"

```
