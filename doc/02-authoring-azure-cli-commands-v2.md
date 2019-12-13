# Manually Generating Azure CLI Commands using AutoRest AZ

>NOTE: **autorest.az** is currently under development and tooling is not functional yet.

This document describes generation of Azure CLI Commands using **autorest.az**.

### Prepare Your Environment

Install AutoRest tools, or alternatively you can use Docker container.

You will need to clone following directories locally.

    git clone https://github.com/Azure/azure-rest-api-specs
    git clone https://github.com/Azure/azure-cli-extensions.git

For simplicity let's assume they are cloned under **c:\dev** directory on Windows machine.

If you want to use the container:

    docker run -it --rm -v c:\dev:/_ mcr.microsoft.com/azure-cli/tools

### Prepare Minimal **readme.az.md** File

Minimal file must exist in 

    ## CLI

    These settings apply only when `--cli` is specified on the command line.

    ``` yaml $(cli)
    cli:
      namespace: azure.mgmt.healthcareapis
    ```

### Generate Extension

To generate extension use following command:

    autorest --az --output-folder=/_/azure-cli-extensions /_/azure-rest-api-specs/specification/frontdoor/resource-manager/readme.md

### Integration Test

When generating your extension **autorest.cli** will attempt to create default integration test. You may see output as follows:

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

TBD

### Modelling Command Groups

TBD

### Disabling Command Groups

TBD

### Renaming Parameters

TBD

### Adjusting Documentation

TBD

### Disabling Parameters

TBD

### Marking Options Non-Updatable

TBD

### Fixing Example Description / Name

TBD