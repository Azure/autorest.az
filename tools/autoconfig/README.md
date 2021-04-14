# Autorest AutoConfig

Generate *.md config files in Azure REST API specification:

https://github.com/Azure/azure-rest-api-specs

## How to Generate Python Test

    autorest --use=autorest-autoconfig@latest /azure-rest-api-specs/specification/storageimportexport/resource-manager/readme.md  --resource-file=./samples/sampleResource.json

``` yaml

az:
  autoconfig: true

try-require:
  - ./readme.python.md
  - ./readme.cli.md
  - ./readme.az.md

use-extension:
  "@autorest/modelerfour": 4.15.421

pipeline:
    autoconfig:
        input: swagger-document/loader-swagger
        output-artifact: source-file
    autoconfig/emitter:
        input: autoconfig
        scope: scope-autoconfig/emitter

modelerfour:
    lenient-model-deduplication: true
    group-parameters: true
    flatten-models: true
    flatten-payloads: true

scope-autoconfig/emitter:
  input-artifact: source-file
  output-uri-expr: $key

output-artifact:
- source-file
```
