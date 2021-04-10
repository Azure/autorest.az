
# CLI

These settings don't need to apply `--cli` on the command line.

``` yaml $(cli)
cli:
  cli-name: users

  flatten:
    # enable flattening
    cli-flatten-set-enabled: true
    # flatten payloads
    cli-flatten-payload: true
    # max properties allowed for flattening. Don't flatten if properties exceed set count.
    # Using 256 so that most of the payloads get flattened, payloads with more than 256 properties
    # won't be flattened
    cli-flatten-payload-max-prop: 256
    # max depth of flatten
    cli-flatten-payload-max-level: 1
    cli-flatten-payload-max-complexity: 0.5
    cli-flatten-payload-max-array-object-prop-count: 8
```
    