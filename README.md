# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/clicommon": "latest"
  #"@qiaozha/fakesdk": "latest"
  "az": "$(this-folder)"


pipeline-model: v3
clicommon: true
fakesdk123: true
pipeline:
    #az:
    #    input: fakesdk
    #    output-artifact: source-file-fakesdk-inaz
    az/aznamer:
        #plugin: fakenamer
        input: clicommon
        output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            # - az
            - az/aznamer
            - az/modifiers
            - az/azgenerator
        scope: scope-here

scope-here:
    is-object: false
    output-artifact:
        # - source-file-fakesdk-inaz
        - source-file-aznamer
        - source-file-modifiers
        - source-file-extension
```
