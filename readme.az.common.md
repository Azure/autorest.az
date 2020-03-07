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
```