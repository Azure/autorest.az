# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/clicommon": "latest"
  #"@autorest/python": "latest"
  "@autorest/python": "https://github.com/Azure/autorest.python/releases/download/v5.0.0_20200116/autorest-python-5.0.0-20200116.tgz"
  "az": "$(this-folder)"


pipeline-model: v3

pipeline:
    az/pynamer:
        plugin: clicommon
        input: python/namer
        #output-artifact: source-file-pynamer
    az/aznamer:
        input: az/pynamer
        #output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        #output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/pynamer
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-here

scope-here:
    is-object: false
    output-artifact:
        #- source-file-pynamer
        #- source-file-aznamer
        #- source-file-modifiers
        - source-file-extension

```
