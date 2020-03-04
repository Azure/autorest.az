# configuration for az common

``` yaml $(az)

directive:
  - from: swagger-document
    where: $..parameters[?(@.in=='body')]
    transform: >
      $['x-ms-client-flatten'] = true;
    reason: Flatten everything for Azure CLI
  - from: swagger-document
    where: $.definitions.*.[?(@.properties && !@.discriminator)].*
    transform: >
      $['x-ms-client-flatten'] = true;

clicommon:
    naming:
        default:
            singularize:
              - operationGroup
              - operation
    cli-directive:
        - where:
            operation: check-name-availability
          hidden: true
        - where:
            operation: list-operation
          hidden: true
```