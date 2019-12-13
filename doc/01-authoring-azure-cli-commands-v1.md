# Manually Generating Azure CLI Commands using AutoRest CLI PoC

This document describes generation of Azure CLI Commands using **autorest.cli** PoC.
It also describes changes that will occur in near future.

### Prepare Your Environment

Install AutoRest tools, or alternatively you can use Docker container.

You will need to clone following directories locally.

    git clone https://github.com/Azure/azure-rest-api-specs
    git clone https://github.com/Azure/azure-cli-extensions.git
    git clone https://github.com/Azure/azure-sdk-for-python.git

For simplicity let's assume they are cloned under **c:\dev** directory on Windows machine.

If you want to use the container:

    docker run -it --rm -v c:\dev:/_ mcr.microsoft.com/azure-cli/tools

### Prepare Minimal **readme.cli.md** File

Minimal file must exist in 

    ## CLI

    These settings apply only when `--cli` is specified on the command line.

    ``` yaml $(cli)
    cli:
      namespace: azure.mgmt.healthcareapis
      flatten-all: true
    ```

> NOTE: In the future there will be two files **readme.cli.md** and **readme.az.md**. All setting specific to Azure CLI will be placed in **readme.az.md** file.

> NOTE: Option **flatten-all** will become default and obsolete in the future. During PoC period just include it in all your **readme.cli.md** files.

### Generate Extension

To generate extension use following command:

    autorest --cli --use-extension="{'@autorest/cli':'latest'}" --output-folder=/_/azure-cli-extensions /_/azure-rest-api-specs/specification/frontdoor/resource-manager/readme.md

> NOTE: When next version is available, instead of **--cli** option **--az** option will be used to generate Azure CLI command modules.

> NOTE: Adding option **--use-extension="{'@autorest/cli':'latest'}"** will be not necessary in the future.

### Integration Test

When generating your extension **autorest.cli** will attempt to create default intergration test. You may see output as follows:

    WARNING:
    WARNING: NO TEST SCENARIO PROVIDED - DEFAULT WILL BE USED
    WARNING: ADD FOLLOWING SECTION TO readme.cli.md FILE TO MODIFY IT
    WARNING: --------------------------------------------------------
    WARNING:   test-scenario:
    WARNING:     - name: PutActionRule
    WARNING:     - name: Create or update a Smart Detector alert rule
    WARNING:     - name: Get a Smart Detector alert rule
    WARNING:     - name: GetActionRuleById
    WARNING:     - name: List alert rules
    WARNING:     - name: GetActionRulesResourceGroupWide
    WARNING:     - name: Resolve
    WARNING:     - name: Get
    WARNING:     - name: Resolve
    WARNING:     - name: List Smart Detector alert rules
    WARNING:     - name: GetById
    WARNING:     - name: Summary
    WARNING:     - name: List
    WARNING:     - name: GetActionRulesSubscriptionWide
    WARNING:     - name: ListAlerts
    WARNING:     - name: MonService
    WARNING:     - name: Patch alert rules
    WARNING:     - name: PatchActionRule
    WARNING:     - name: changestate
    WARNING:     - name: Resolve
    WARNING:     - name: Delete a Smart Detector alert rule
    WARNING:     - name: DeleteActionRule
    WARNING: --------------------------------------------------------

There are some rules used:
- all create methods are on the top
- followed by update methods
- followed by methods performing actions
- then all get/list examples are appended
- finally all delete examples
- in addition method URL length is used to determine dependencies

Despite that effort generated test scenario may be not correct. It may need some additional work:
- fixing examples in swagger
- changing sequence of tests
- disabling some of the examples
- adding prerequisites

It is advised to resolve all the test issues before actually generating the extension itself.

You can generate generic integration test by running

    autorest --cli --swagger-integration-test --use-extension="{'@autorest/cli':'latest'}" --output-folder=/_/azure-cli-extensions /_/azure-rest-api-specs/specification/frontdoor/resource-manager/readme.md

Test generated in such way can be run as follows:

Firstly, install **azdev**

    pip install azdev

then setup your test environment:

    azdev setup -c pypi

Login:

    az login

You need to add test manually (this will change later when tools are improved):

    vi ~/.azdev/env_config/env/test_index/latest.json

and add:

    {
      "mytest": "/_/test_..... your test name.......py"
    }

Then you can run the test:

    azdev test mytest



Alternatively you can generate Python SDK integration by running:

    autorest --cli --python-integration-test --use-extension="{'@autorest/cli':'latest'}" --output-folder=/_/azure-cli-extensions /_/azure-rest-api-specs/specification/frontdoor/resource-manager/readme.md

and then follow Python SDK integration test instructions.

### Add Local Copy of Python SDK

In your extension folder create a subfolder called **vendored_sdks** and copy appropriate subfolder from Python SDK.

For instance using **healthcareapis** as an example, your folder structure should look as follows:

    azure-cli-extensions
      src
        healthcareapis
          azext_healthcareapis
            vendored_sdks
              ------- HEALTHCARE APIS SDK ------
              healthcareapis
                models
                operations
                __init__.py
                _configuration.py
                _healthcareapis_managemenet_client.py
                version.py

> NOTE: Appropriate SDK will be generated automatically in the future while generating extension.

## Running The Extension

To install the extension run:

    azdev extension add <your-extension-name>

Then you can verify that extension was installed correctly by running:

    az <your-extension-name> --help

and proceed with:

    az login

and testing all the examples.

## Running Integration Test

Start with:

    az login

then

    azdev test --live --discover <extension-name>

## Publishing Extension

To publish an extension (assuming you did **az login** already):

azdev extension publish <extension-name> --storage-account <storage-account-name> --update-index --storage-container <storage-container-name> --storage-subscription <subscription-id>

After doing that, following things will happen:
- package will be built
- package will be pushed to storage account
- **index.json** file will be updated

At this point you can commit and push the change to **index.json**.

>NOTE 1: Extension won't be published until PR is merged into master branch

>NOTE 2: When running **azdev extension publish** old entry won't be removed so it may be necessary to remove it manually

>NOTE 3: Adding extension to index triggers some additional sanity checks and there may be additional errors to fix, so it advised to add extension to index as soon as possible.

## Next Steps

### Changing Extension / Top Command Group Name

If extension name generated by default is not desired, just add following line to **readme.cli.md**:

  cli:
    ...
    group-name: my-extension-name
    ...

### Modelling Command Groups

Command names can be changed by adding **cmd-override** section like this:

    cmd-override:
      "^network-experiment-profile$": "* profile"
      "^network-experiment-profile preconfigured-endpoint$": "* profile preconfigured-endpoint"
      "^network-experiment-profile experiment$": "* test"

You can assign command names to method URLS.

>NOTE: In the future this approach will be obsolete, it will be possible to use either generic directives in **autorest.cli.md** or rename option groups in **autorest.az.md** using Azure CLI specific directives.

### Disabling Command Groups

To disable command / command group that is not desired just assign **"-"** to the URL:

    cmd-override:
      "^.*frontdoor.*$": "-"

### Renaming Parameters

To rename parameter names, which may be too long after flattening, use **option-override**:

    option-override:
      "scope_management_groups_id":
        name: scope_management_groups
      "scope_subscriptions_id":
        name: scope_subscriptions


>NOTE: In the future this will be done as a part of flattening/generic renaming in **readme.cli.md** or custom directives in **readme.az.md**.

### Adjusting Documentation

Documentation of any option can be changed as follows:

    option-override:
      "endpoint_a_name":
        doc: The name of the control endpoint

or global string replace can be done on all options matching regular expressions:

    option-override:
      "^.*$":
        doc-replace:
          "network experiment": "internet analyzer"

>NOTE: In the future this will be done as a part of flattening/generic renaming in **readme.cli.md** or custom directives in **readme.az.md**.

### Disabling Parameters

To disable parameter just set it to **readonly**:

    option-override:
      "resource_state":
        readonly: true
      "etag":
        readonly: true

>NOTE: In the future this will be done as a part of flattening/generic renaming in **readme.cli.md** or custom directives in **readme.az.md**.

### Marking Options Non-Updatable

To disable parameter just set it to **readonly**:

    option-override:
      "example_parameter":
        updatable: false

>NOTE: In the future this will be done as a part of flattening/generic renaming in **readme.cli.md** or custom directives in **readme.az.md**.

### Fixing Example Description / Name

Initially example names won't look very good, just like below **ManagedNetworksPut** is not a very good name/description:

    Examples
        ManagedNetworksPut
            az managednetwork create --resource-group "myResourceGroup" --name "myManagedNetwork" \
            --location "eastus"

In order to change this name, find name location in swagger specification:

        "x-ms-examples": {
          "ManagedNetworksPut": {
            "$ref": "./examples/ManagedNetwork/ManagedNetworksPut.json"
          }
        }

and change it to be more descriptive:

        "x-ms-examples": {
          "Create Managed Network": {
            "$ref": "./examples/ManagedNetwork/ManagedNetworksPut.json"
          }
        }

>NOTE: In the future this will be done as a part of flattening/generic renaming in **readme.cli.md** or custom directives in **readme.az.md**.
