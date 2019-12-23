# configuration

See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/cli.common": "latest"
  "az": "$(this-folder)"

pipeline-model: v3
clicommon: true
pipeline:
    az:
        input: cli.common
        output-artifact: source-file-cli

    az/emitter:
        input: az
        scope: scope-here

scope-here:
    is-object: false
    output-artifact:
        - source-file-cli
```
