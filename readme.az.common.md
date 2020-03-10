# configuration for az common

``` yaml $(az)

add-credential: true

cli:
    naming:
        default:
            singularize:
              - operationGroup
              - operation    
    flatten:
        cli-flatten-set-enabled: true
        cli-flatten-all: true
    cli-directive:
        - where:
            operation: check_name_availability
          hidden: true
        - where:
            operationGroup: operations
            operation: list
          hidden: true

```