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
            operation: check_name_availability
          hidden: true
        - where:
            operationGroup: operations
            operation: list
          hidden: true
    flatten:
        cli-flatten-set-enabled: true
        cli-flatten-payload: true
        cli-flatten-schema: false
        cli-flatten-all-overwrite-swagger: false
```