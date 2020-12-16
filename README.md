
# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Introduction

This project is for Azure CLI Code Generator. We support to generate as both cli extensions and cli main repo modules. In this section, we will briefly introduce how to use CLI code generator and what's the advanced features of CLI Code generator.

## Authoring readme configurations

## 

# configuration

See documentation [here](doc/00-onboarding-guide.md)

``` yaml

python:
    reason: 'make sure python flag exists to load config in python.md'
azure-arm: true

output-folder: $(az-output-folder)
debug-output-folder: $(az-output-folder)/_az_debug

use-extension:
  "@autorest/python": "5.4.0"
  "@autorest/clicommon": "0.5.8"
  #"@autorest/python": "latest"

require:
  - ./readme.python.md
  - ./readme.cli.md
  - $(this-folder)/readme.az.common.md

pipeline-model: v3

scope-clicommon:
    output-folder: $(debug-output-folder)

scope-az:
    is-object: false
    output-artifact:
        #- source-file-az-hider
        #- source-file-pynamer
        #- source-file-aznamer
        #- source-file-modifiers
        #- source-file-merger
        - source-file-extension
    output-folder: $(az-output-folder)

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

modelerfour:
    lenient-model-deduplication: true
    group-parameters: true
    flatten-models: true
    flatten-payloads: true
    # keep-unused-flattened-models: true
```

``` yaml $(sdk-flatten) && !$(sdk-no-flatten)
#payload-flattening-threshold: 4
#recursive-payload-flattening: true

pipeline:
    python/m2r:
        input: clicommon/identity
    az/hider:
        input: python/namer
        #output-artifact: source-file-az-hider
    python/codegen:
        input: az/hider
    az/merger:
        input: python/namer
        #output-artifact: source-file-merger
    az/aznamer:
        input: az/merger
        #output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        #output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/hider
            #- az/clicommon
            #- az/merger
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az
```

``` yaml !$(sdk-flatten) || $(sdk-no-flatten)

#payload-flattening-threshold: 4
#recursive-payload-flattening: true

cli:
    naming:
        m4:
            parameter: 'snake'
            property: 'snake'
            operation: 'snake'
            operationGroup:  'snake'
            choice:  'pascal'
            choiceValue:  'pascal'
            constant:  'snake'
            type:  'snake'

pipeline:
    python/m2r:
        input: clicommon/cli-m4namer
    az/renamer:
        input: clicommon/identity
    az/merger:
        input:
            - az/renamer
            - python/namer
        #output-artifact: source-file-merger
    az/aznamer:
        input: az/merger
        #output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        #output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/hider
            #- az/clicommon
            #- az/merger
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az
```