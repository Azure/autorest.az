# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/modelerfour": "~4.1.60"
  "az": "$(this-folder)"

pipeline-model: v3

pipeline:
    modelerfour:
        input: openapi-document/multi-api/identity
    az/generate:
        plugin: az
        input: modelerfour
        output-artifact: source-file-cli

    az/emitter:
        input: generate
        scope: scope-here

scope-here:
    is-object: false
    output-artifact:
        - source-file-cli
```
