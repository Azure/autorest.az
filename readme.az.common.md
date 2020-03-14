# configuration for az common

``` yaml $(az)

add-credential: true

cli:
    naming:
        default:
            singularize:
              - operationGroup
              - operation
    cli-directive:
        - where:
            operation: CheckNameAvailability
          hidden: true
        - where:
            operationGroup: Operations
            operation: List
          hidden: true
    flatten:
        cli-flatten-set-enabled: true
        cli-flatten-payload: true
        cli-flatten-schema: false
        cli-flatten-all-overwrite-swagger: false
```