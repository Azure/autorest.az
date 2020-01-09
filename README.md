# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/cli.common": "/home/qiaozha/code/autorest.cli.common"
  "@qiaozha/fakesdk": "latest"
  "az": "$(this-folder)"


pipeline-model: v3
clicommon: true
fakesdk123: true
pipeline:
    az:
        input: fakesdk
        output-artifact: source-file-fakesdk-inaz
    az/aznamer:
        #plugin: fakenamer
        input: cli.common
        output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        output-artifact: source-file-modifiers
    az/emitter:
        input:
            - az
            - az/aznamer
            - az/modifiers
        scope: scope-here

scope-here:
    is-object: false
    output-artifact:
        - source-file-fakesdk-inaz
        - source-file-aznamer
        - source-file-modifiers
        
```
