# How to author readme files with multi extensions for CLI CodeGen

For multiple Resource Provider in one single swagger folder. it's better to use multi-package mode. And the cli readme will also be different from single extension. 

## Step 1. Change the readme.md to multi-package mode.

If the readme.md is already in multi-package mode. This step can be skipped. Otherwise we need to change the tag name etc. Take migrate for example.

you need to have separate yaml block to define the default tag for each package. Here we have `package-migrate` and `package-offazure` and  
in `package-migrate` the default tag is `package-migrate-2019-10`, in `package-offazure` the default tag is `package-offazure-2020-01` in each tag, we can define the input files for each package.
    
    ``` yaml $(package-migrate)
    tag: package-migrate-2019-10
    ```
    
    ``` yaml $(package-offazure)
    tag: package-offazure-2020-01
    ```
    
    These are the global settings for the API.
    
    ### Tag: package-migrate-2018-02
    
    These settings apply only when `--tag=package-migrate-2018-02` is specified on the command line.
    
    ``` yaml $(tag) == 'package-migrate-2018-02'
    input-file:
    - Microsoft.Migrate/stable/2018-02-02/migrate.json
    ```
    
    ### Tag: package-migrate-2019-10
    
    These settings apply only when `--tag=package-migrate-2019-10` is specified on the command line.
    
    ``` yaml $(tag) == 'package-migrate-2019-10'
    input-file:
    - Microsoft.Migrate/stable/2019-10-01/migrate.json
    ```
    
    ### Tag: package-offazure-2020-01
    
    These settings apply only when `--tag=package-offazure-2020-01` is specified on the command line.
    
    ``` yaml $(tag) == 'package-offazure-2020-01'
    input-file:
    - Microsoft.OffAzure/stable/2020-01-01/migrate.json
    ```


## Step 2. Prepare readme.az.md

Now you need to change or create the readme.az.md in a batch mode. which will generate multi-extension for us. An example of migrate would be like this.

    ## AZ
    
    These settings apply only when `--az` is specified on the command line.
    ``` yaml $(az)
    batch:
        - package-migrate: true
        - package-offazure: true
    ```
    
    ``` yaml $(az) && $(package-migrate)
    az:
      extensions: migrate
      namespace: azure.mgmt.migrate
      package-name: azure-mgmt-migrate
    az-output-folder: $(azure-cli-extension-folder)/src/migrate
    python-sdk-output-folder: "$(az-output-folder)/azext_migrate/vendored_sdks/migrate"
    ```
    
    ``` yaml $(az) && $(package-offazure)
    az:
      extensions: offazure
      namespace: azure.mgmt.offazure
      package-name: azure-mgmt-offazure
    az-output-folder: $(azure-cli-extension-folder)/src/offazure
    python-sdk-output-folder: "$(az-output-folder)/azext_offazure/vendored_sdks/offazure"
    ```
First we need to include all the packages in the batch section. Then we can specify the different extension, namespace, az-output-folder in each package's own definition

## Step 3. Prepare readme.cli.md

Create readme.cli.md in the same folder of readme.md with following content. No modification needed.

    ``` yaml
    # add any configuration here for all CLI languages
    # refer to the faq.md for more details
    ```

## Step 4. Prepare readme.python.md

You need to change your readme.python.md into multi-package or batch mode as well.

    ## Python
    
    ``` yaml $(python)
    python:
      azure-arm: true
      license-header: MICROSOFT_MIT_NO_VERSION
      payload-flattening-threshold: 2
      clear-output-folder: true
    batch:
      - package-migrate: true
      - package-offazure: true
    ```
    
    ``` yaml $(python) && $(package-migrate)
    python:
      package-version: 0.1.0
      namespace: azure.mgmt.migrate
      package-name: azure-mgmt-migrate
      basic-setup-py: true
      output-folder: $(python-sdks-folder)/migrate/azure-mgmt-migrate
    ```
    
    ``` yaml $(python) && $(package-offazure)
    python:
      package-version: 0.1.0
      namespace: azure.mgmt.offazure
      package-name: azure-mgmt-offazure
      basic-setup-py: true
      output-folder: $(python-sdks-folder)/offazure/azure-mgmt-offazure
    ```
In readme.python.md you also need to include all the package tags in batch section. then in each individual package definition, you can define their own package namespace, package-name, output-folder etc.


## Ready to generate code
All readme files should be ready now. You can refer to [here](how-to-generate.md) to generate your CLI code now if you want. 

Feel free to reach to us at amecodegen@microsoft.com if you hit any issues or questions.
