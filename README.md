# configuration

See documentation [here](doc/00-overview.md)

``` yaml

clear-output-folder: false
python:
    clear-output-folder: false
    reason: 'make sure python flag exists to load config in python.md'
debug-output-folder: $(output-folder)/_az_debug
az-output-folder: $(output-folder)

use-extension:
  "@autorest/python": "5.0.0-dev.20200314.1"
  "@autorest/clicommon": "/Users/zhangqiaoqiao/work/code/autorest.cli.common"
  #"@autorest/python": "latest"
  
cli:
    reason: 'make sure cli flag exists to load config in cli.md'
    naming:
        default:
            parameter: 'snake'
            property: 'snake'
            operation: 'snake'
            operationGroup:  'pascal'
            choice:  'pascal'
            choiceValue:  'snake'
            constant:  'snake'
            type:  'pascal'

require:
  - ./readme.python.md
  - ./readme.cli.md
  - $(this-folder)/readme.az.common.md

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
            #- az/clicommon
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az

scope-az:
    is-object: false
    output-artifact:
        #- source-file-pynamer
        #- source-file-aznamer
        #- source-file-modifiers
        - source-file-extension
    output-folder: $(az-output-folder)

scope-clicommon:
    output-folder: $(debug-output-folder)
```
