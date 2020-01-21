# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/cli.common": "latest"
  #"@autorest/python": "latest"
  "@autorest/python": "/home/qiaozha/code/autorest.python"
  "az": "$(this-folder)"


pipeline-model: v3
clicommon: true
#python: true
pipeline:
    
    az/pynamer:
        plugin: cli.common
        input: python/namer
        output-artifact: source-file-pynamer
    az/aznamer:
        input: az/pynamer
        output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/pynamer
            - az/aznamer
            - az/modifiers
            - az/azgenerator
        scope: scope-here

scope-here:
    is-object: false
    output-artifact:
        #- source-file-pynamer
        - source-file-aznamer
        - source-file-modifiers
        - source-file-extension
```
