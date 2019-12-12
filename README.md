See documentation [here](doc/00-overview.md)

``` yaml
use-extension:
  "@autorest/modelerfour": "~4.1.60" # keep in sync with package.json's dev dependency in order to have meaningful tests

pipeline-model: v3

pipeline:
    # "Shake the tree" and normalize the model
    modelerfour:
        input: openapi-document/identity
    az/generate:
        plugin: cli
        input: modelerfour
        output-artifact: source-file-cli


scope-here:
    is-object: false
    output-artifact:
        - source-file-cli
```

``` yaml
use-extension:
  "az": "$(this-folder)"
```
