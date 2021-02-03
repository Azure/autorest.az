# Autorest.Az
[1. Introduction](#Introduction)  
[2. How does Azure CLI Code Generator Work](#How-does-Azure-CLI-Code-Generator-Work)  
&nbsp;  [2.1. Different Generation Options](#Different-Generation-Options)  
[3. How to use Azure CLI Code Generator](#How-to-use-CLI-Code-Generator)  
&nbsp;  [3.1. Preparing Environment](#Preparing-Environment)  
&nbsp;  [3.2. Authoring Readme Files](#Authoring-Readme-Files)  
&nbsp;  [3.3. Generate Azure CLI Code](#Generate-Azure-CLI-Code)  
&nbsp;  [3.4. Build the Generated Code](#Build-the-Generated-Code)  
&nbsp;  [3.5. Execute the Generated Azure CLI Commands](#Execute-the-Generated-Azure-CLI-Commands)  
&nbsp;  &nbsp;  [a. Checks](#Checks)  
&nbsp;  &nbsp;  [b. Live Tests](#Live-Tests)  
[4. Advanced Features](#Advanced-Features)  
&nbsp;  [4.1. Folder Customization](#Folder-Customization)  
&nbsp;  [4.2. CLI User Interface Customization](#CLI-User-Interface-Customization)  
&nbsp;  &nbsp;  [a. Add Parent Extension](#Add-Parent-Extension)  
&nbsp;  &nbsp;  [b. Set Extension/Command Groups/Commands/Parameters Mode](#Set-Extension/Command-Groups/Commands/Parameters-Mode)   
&nbsp;  &nbsp;  [c. Set min-api/max-api in Command Groups/Commands/Parameters](#Set-min-api/max-api-in-Command-Groups/Commands/Parameters)  
&nbsp;  &nbsp;  [d. Move Command Groups/Command Layer](#Move-Command-Groups/Command-Layer)  
&nbsp;  &nbsp;  [e. Rename/Hide Command Groups/Commands/Parameters](#Rename/Hide-Command-Groups/Commands/Parameters)   
&nbsp;  &nbsp;  [f. Client Factory Customization](#Client-Factory-Customization)  
&nbsp;  &nbsp;  [g. Parameter Specific Customization](#Parameter-Specific-Customization)  
&nbsp;  &nbsp;  &nbsp;  [i. flatten a parameter](#flatten-a-parameter)  
&nbsp;  &nbsp;  &nbsp;  [ii. set a parameter as required](#set-a-parameter-as-required)  
&nbsp;  &nbsp;  &nbsp;  [iii. set default value for a parameter](#set-default-value-for-a-parameter)  
&nbsp;  &nbsp;  &nbsp;  [iv. add alias for a parameter](#add-alias-for-a-parameter)  
&nbsp;  &nbsp;  &nbsp;  [v. how an action parameter is handled](#how-an-action-parameter-is-handled)  
&nbsp;  &nbsp;  &nbsp;  [vi. set an action as positional argument](#set-an-action-as-positional-argument)  
&nbsp;  &nbsp;  &nbsp;  [vii. set an action as AWS shorthand syntax](#set-an-action-as-AWS-shorthand-syntax)  
&nbsp;  [4.3. SDK Customization](#SDK-Customization)  
&nbsp;  &nbsp;  [a. Flattened SDK and un-Flattened SDK](#Flattened-SDK-and-un-Flattened-SDK)  
&nbsp;  &nbsp;  [b. Track1 SDK and Track2 SDK](#Track1-SDK-and-Track2-SDK)  
&nbsp;  [4.4. Manual Override](#Manual-Override)  
&nbsp;  [4.5. Test Customization](#Test-Customization)  
&nbsp;  [4.6. Special Parameter Type](#Special-Parameter-Type)  
&nbsp;  [4.7. Incremental Code Generation](#Incremental-Code-Generation)  
[5. Contributing](#Contributing)  
[6. Autorest Pipeline Configuration](#Autorest-Pipeline-Configuration)



# Introduction

Azure CLI Code Generator provides the feature of Azure CLI module generation in Azure CLI extensions repository and Azure CLI main repository. In this document, we will first introduce how Azure CLI Code Generator works including the basic usage as well as some advanced features. Then, we will describe how to debug the code generator. Finally, we will show the Autorest Pipeline definitions. 

Azure CLI Code Generator is mainly for Azure CLI developers and people who are interested in generating Azure CLI by themselves.

# How does Azure CLI Code Generator Work
Azure CLI Code Generator is an [Autorest](https://github.com/Azure/autorest) extension which generates functional Azure CLI code for Azure services by using Swagger specifications defined in [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) or [azure-rest-api-specs-pr](https://github.com/Azure/azure-rest-api-specs-pr) repos. It uses Autorest V3 to handle the configuration interpretation, pipeline resolving, pipeline scheduling and uses [Autorest.Modelerfour](https://github.com/Azure/autorest.modelerfour) as a basic code model. 

Besides the Autorest.Modelerfour, Autorest.Az has two more Autorest extensions dependencies, the [Autorest.Clicommon](https://github.com/Azure/autorest.clicommon) and [Autorest.Python](https://github.com/Azure/autorest.python), the Autorest.Clicommon is responsiblefor handling the user defined CLI directives such as operations splitting, polymorphism, renaming, hiding etc. and marking them properly in the code model. The Autorest.Python is integrated into Autorest.Az for the Rest APIs calls. Azure CLI does not do the Rest call directly. It either call the vendored SDKs from Azure CLI Extensions or call the public released SDK from Azure CLI main repo modules.

Both the Autorest.Clicommon and Autorest.Python take the code model generated by Autorest.Modelerfour as input. Normally Autorest.Python will not flatten the code model because in Python, complex objects are naturally supported. However,in Azure CLI, there is a requirement that object nesting level could not be deeper than two, otherwise it would be difficult to express the complex objects without using a bunch of delimiters. Therefore, in Autorest.Clicommon, the code model will be flattened and in Autorest.az, different code models from Autorest.Python and Autorest.Clicommon will be merged together.    

After the code model has been updated and merged, AutoRest.az will render the code model into template and finally generate the Azure CLI code.   


## Different Generation Options
**Autorest Options**
1. *--use*  
This *--use* option is to specify the download location of the package. For Azure CLI code generation, by default, we will use the [latest publish Autorest.az in npmjs](https://www.npmjs.com/package/@autorest/az). Private releases are available in [github releases](https://github.com/Azure/autorest.az/releases) for users who want to try out some preview features. For example:  `--use=https://github.com/Azure/autorest.az/releases/download/1.6.2-b.20201211.1/autorest-az-1.6.2.tgz` 
1. *--debug*  
This *--debug* option will show more information while generating the code. It is very helpful for user to trouble shooting the wrong configuration in readme.az.md file which would cause no code is generated in the target folder. 
1. *--interactive*  
This *--interactive* option will help users to understand how the Autorest Pipeline is scheduled during runtime.  
 
**Autorest.Az Specific Options**
1. *--az.debugger*  
The *--exname.debugger* option is provided by Autorest for developers to debug the Autorest extension and `exname` is the extension name. After you start autorest.az with *--az.debugger*, you could then attach the VSCode to the autorest process for step by step debugging.
1. *--sdk-no-flatten*  
CLI code generator supports to generate the flattened SDK or the un-flattened SDK. Users can specify *--sdk-no-flatten* to generate the un-flattened SDK. The current publish released autorest.az (version 1.6.2) will still generate the flattened SDK in Azure CLI extensions generation. But in our latest private release, we have change the default behavior into un-flattened SDKs for both Azure CLI extensions and Azure CLI main repo modules generation.
1. *--sdk-flatten*  
This *--sdk-flatten* option is still in private releases. It will only take effect when no *--sdk-no-flatten* is specified. It's useful for those RPs that was onboard with previous CLI code generator when users don't want to introduce the SDK breaking changes.
1. --generate-sdk  
This *--generate-sdk* has two available value "yes" or "no". By default the value is "yes" for Azure CLI extensions generation, and "no" for Azure CLI main repo modules.
1. --compatible-level  
This *--generate-sdk* has two available value "track1" or "track2". By default the value is "track2" for Azure CLI extensions generation, and "track1" for Azure CLI main repo modules.
1. --target-mode  
This *--target-mode* option is a convenience option for users who working on Azure CLI main repo modules. By default Autorest.az will generate code targeting azure-cli-extensions repo. Setting `--target-mode=core` if you want to generate azure-cli repo command modules. It basically equals to `--sdk-no-flatten --generate-sdk=no --compatible-level=track1`.

Other command line options can be found in the [generate with different options doc](https://github.com/Azure/autorest.az/blob/master/doc/how-to-generate-with-different-options.md)


# How to Use Azure CLI Code Generator

Azure CLI code generator is integrated into the pull request of [Azure rest api specs repo](https://github.com/Azure/azure-rest-api-specs) and users could also try it locally. The guidance on how to generate Azure CLI code in rest api specs PR pipeline can be found in [rest api specs documentation](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/code-gen/configure-cli.md). In this section, we will focus on the guidance on how to generate Azure CLI code locally.  

More detailed information can be found in the [how to generate doc](https://github.com/Azure/autorest.az/blob/master/doc/how-to-generate.md)

## Prepare Environment

1. Install the last version of Node.js   
   Please follow the [link](https://nodejs.org/en/download/) to download the latest version of Node.js.
   * Hint: to install NodeJS. You could install a NodeJS globally or use nvm (for linux) or nvm-windows (for windows). It will also help to install NodeJS package management command line tool, npm.
1. Install Python3 and prepare virtual environment
   ### Please follow the [link](https://www.python.org/downloads/) to download Python3.
   ### Run the following commands to prepare the virtual environment.
   
```
python -m venv env
source ./env/bin/activate // or .\env\Scripts\Activate.ps1 in windows
pip install azure-cli // This is must to have if for simple try out
pip install azdev // this is optional if for simple try out. 
```
1. Install Autorest  
Please run this command: `npm install -g autorest@latest` 

1. Download Azure CLI and Azure rest API spec repositories (Optional):

* Users need to prepare the swagger and download:  
    * [azure-cli-extensions](https://github.com/Azure/azure-cli-extensions) repo if targeting at Azure CLI extensions development. Or the generated code needs some manual customization after trying out. If users only want to try out the generated CLI extensions, please build the wheel artifact by invoking `python setup.py sdist bdist_wheel` in the `{root}/azure-cli-extensions/src/{serviceName}` folder. 
    * [azure-cli](https://github.com/Azure/azure-cli) repo if targeting at Azure CLI main repo modules development.   
    * [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) repo if you are working on public rest api specs.  
    * [azure-rest-api-specs-pr](https://github.com/Azure/azure-rest-api-specs-pr) repo if you are working on private rest api specs.  

    The azure-rest-api-specs and azure-rest-api-specs-pr repo are optional for Service Team whose swagger and readme files hasn't checked in yet.

## Authoring Readme Files
Since the Autorest.Az depends on Autorest.Clicommon and Autorest.Python, readme files including readme.az.md, readme.cli.md and readme.python.md should be prepared before Azure CLI code generation.

Users can refer to [this document](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/code-gen/configure-cli.md) for more details. 

## Generate Azure CLI Code
1. Sample command for authoring Azure CLI extensions:  
`autorest --az --use=@autorest/az@latest <path-to-the-swagger-readme.md> --sdk-no-flatten --azure-cli-extension-folder=<path-to-the-azure-cli-extension-repo>`

1. Sample command for authoring Azure CLI main modules:  
`autorest --az --use=https://github.com/Azure/autorest.az/releases/download/1.6.2-b.20201211.1/autorest-az-1.6.2.tgz <path-to-the-swagger-readme.md> --compatible-level=track2 --azure-cli-folder=<path-to-the-azure-cli-repo>`

See [different combination of generation options](https://github.com/Azure/autorest.az/blob/master/doc/how-to-generate-with-different-options.md#most-useful-command-options-combination) for more useful scenarios.

## Build the Generated Code
If you want to do a simple try, please go to the az-output-folder that you specified in your readme.az.md, build the wheel file and add the generated file into Azure CLI.
```
cd <az-output-folder>  
python setup.py sdist bdist_wheel 
az extension add --source=<path-to-the-wheel-file>
``` 

If it's for Azure CLI extensions development, you need to setup the azdev development environment and add the extension.
```
azdev setup -r ./<path of azure-cli-extensions repository> -c ./<path of azure-cli repository>
// You only need to specify the local path of the repository you plan to work on. 
azdev extension add <extension-name> // for Azure CLI extensions
// The step of adding extension is required for developing Azure CLI main repo modules 
```
## Execute the Generated Azure CLI Commands

### Run `az <extension-name> -h` to view all the commands and parameters. 
Here the `<extension-name>` is the main resource command group name.    
You can also find a **report.md** in generated azext_{extensionName} folder, which contains an overview of all the generated command groups, commands and parameters.   

### Checks
You can run code style check and linter check if you would like to onboard this generated Azure CLI code and publish it to your customers.
```
azdev style <extension-name>
azdev linter <extension-name>
``` 

### Live Tests 
You can also run the live test against the service backend server. 
```
azdev test <extension-name> --live --discover 
```

After all steps completed successfully and the generated module is ready to release, you can commit the generated code and create a PR in azure-cli-extension repo or in azure-cli repo for review.  If there's contain behaviour that's not good enough and you need to customize, you can refer to our **Advanced Features**

# Advanced Features

In this section, we will introduce the advanced features and how to leverage those features to generate Azure CLI code.  

Autorest.az use directive for customization:   
1. the autorest directive. For example:
``` 
directive:
  - where:
      command: datafactory factory create
    set:
      command: datafactory create
```
1. the cli directive. For example:
```
cli:
  cli-directive:
    - where:
        group: Factories
        param: factoryName
      alias:
        - name
        - n
```
**The supported usage for autorest directive is to update the command groups and commands layer e.g. remove subgroups or add subgroups.** 

Like SQL language, you can use **where clause** to specify groups/operations/parameters/schemas that need to be modified, and **set clause or directive action clause** to specify what kind of change to make. Unlike SQL that mainly operates on data, the directive operates on the code model. See details on [cli directive doc](https://github.com/Azure/autorest.clicommon/blob/master/doc/cli-directive.md)

* Note: the name conventions in **where clause** are always using swagger name format. The name conventions in **set clause** should use snake case. Please refer to [this document](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-find-swagger-name-used-by-directive) for more details if you have trouble finding the name in **where clause** 

## Folder Customization
A typical readme.az.md configuration would look like this 
```
az:
    extensions: {extensionName}
    namespace: azure.mgmt.{extensionName}
    package-name: azure-mgmt-{extensionName}
$(azure-cli-extension-folder)/src/{extensionName}
python-sdk-output-folder: "$(az-output-folder)/azext_{extensionName}/vendored_sdks/{extensionName}"
```
Where all the place holder for {extensionName} should be the same. 

But users are allowed to specify different value for every place holder for different scenarios, for example, in the case of storage-preview extension. 
```
az:
    extensions: storage
    namespace: azure.mgmt.storage
    package-name: azure-mgmt-storage
az-output-folder: $(azure-cli-extension-folder)/src/storage-preview
python-sdk-output-folder: "$(az-output-folder)/azext_storage_preview/vendored_sdks/azure_mgmt_storage/v2019_06_01"
```
we want the extension name to be `storage` but we want the code in `src/storage-preview` folder, and since `storage-preview` extension has both data plane sdks and mgmt plane sdks, and the sdks contains multiple api versions, so we should use different sdk path for `storage`.

## Azure CLI User Interface Customization
### **Add Parent Extension**   
For the resource provider of ApplicationInsights, it's actually a sub module of Monitor. which means we should design the Azure CLI user interface like `az monitor app-insight` instead of `az app-insight`. To solve this problem, we could update the directive to use the parent extension `monitor` for `app-insight`.

```
az:
  extensions: app-insight
  parent-extension: monitor
```

### **Set Extension/Command Groups/Commands/Parameters Mode**   
In Azure CLI, we allow user to set different mode like is_preview or is_experimental for different kinds of layers including extension/command groups/commands/parameters. We can configure it in readme.az.md so the generated code can work in different mode.  
see [how to configure is_preview/is_experimental in different levels](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-support-configuring-is_previewis_experimental-in-different-levels) for more details.

### **Set min-api/max-api in Command Groups/Commands/Parameters**  
In Azure CLI, we allow user to set the min or max api versions for command group, command and parameter. Below is a sample configuration in readme.az.md to generate code with min or max api versions.  

```
cli:
  cli-directive:
    - where:
        group: groupCondition
        op: opCondition
        param: paramCondition
      min-api: 2019-01-01
      max-api: 2020-12-01
```
* Note: Both the min-api and max-api are optional and the conditions group, op and param are optional as well.   

### **Move Command Groups/Command Layer**  
Before we talk about move command groups and command layer. we will first introduce what command group name and command name come from.  

In Azure rest APIs, the operationId are usually with the format of **A_B** where **A** is resource name in the format of plural and **B** is the action name you want to perform on that resource for example create, update, get, start, stop, delete etc.   

Azure CLI code generator would assume **A** as group name, **B** as the command name and the CLI command of operationId **A_B** would be like `az <extension-name> A B`.  
    
In Azure CLI it's quite common that we want to move the same functional command into the same command group. For example:   
```
directive:
    ## remove a sub group share
    - where:
          group: datashare share
      set:
          group: datashare

    ## add a sub group consumer
    - where:
          group: datashare trigger
      set:
          group: datashare consumer trigger

    ## change the group and name of a command
    - where:
          command: datafactory integration-runtime create-linked-integration-runtime
      set:
          command: datafactory integration-runtime linked-integration-runtime create


```
See [how to add or remove subgroups](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-addremove-subgroup) for more details.   

### **Rename/Hide Command Groups/Commands/Parameters**  
We provide the ability to rename or hide command groups, commands and parameters. For example:
```
cli:
  cli-directive:
    ## rename a parameter 
    - where:
        group: groupCondition
        op: opCondition
        param: paramCondition
      name: new_op_name

    ## hide an operation
    - where:
        group: groupCondition
        op: opCondition
      hide: true    
```
* Note: if a parameter has the flattened schema prefix in the name, then we can't rename it in this way, because in Autorest.Clicommon it doesn't have the flattened schema prefix. We can only add alias for this parameter in such case.


### **Client Factory Customization**
By default, the client factory should not expose the subscriptionId, baseUrl parameters to customer as well as authentication policy but we provide customization for these scenarios.
1. Subscription bound 
1. Base Url Bound
1. Authentication Policy
For example: 
```
az:
  extensions: bool
  parent-extension: test-server
  package-name: azure-mgmt-boolean
  namespace: azure.mgmt.boolean
  # client factory customization for subscription bound
  client-subscription-bound: false
  # client factory customization for base url bound
  client-base-url-bound: false
  # authentication policy customization
  client-authentication-policy: SansIOHTTPPolicy
az-output-folder: $(azure-cli-extension-folder)/src/boolean
python-sdk-output-folder: "$(az-output-folder)/azext_boolean/vendored_sdks/boolean"
```
The generated _client_factory.py would take effect like:  
```
def cf_bool_cl(cli_ctx, *_):
    from azure.cli.core.commands.client_factory import get_mgmt_service_client
    from azext_boolean.vendored_sdks.boolean import AutoRestTestService
    from azure.core.pipeline.policies import SansIOHTTPPolicy
    return get_mgmt_service_client(cli_ctx,
                                   AutoRestTestService,
                                   subscription_bound=False,
                                   base_url_bound=False,
                                   authentication_policy=SansIOHTTPPolicy())
```


### **Parameter Specific Customization**  
There are some customization that we provide only applicable for parameter layer.  
#### flatten a parameter  
let's say we have a parameter A which type is an object and it has three properties a, b, c, and we want the a, b, c to be the command line parameters directly. In such case, we need to flatten the parameter. An example would be like:    
```
cli:
    cli-directive:
      - where:
            group: Triggers
            op: CreateOrUpdate#Update
            param: properties
        cli-flatten: true
```
#### set a parameter as required  
See [how to mark a parameter as required](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-mark-a-parameter-as-required) for more details.   
**According to Autorest.Modelerfour, the current required logic of a parameter is that parameter has to be required in all layers in its swagger definition.** 
#### set default value for a parameter
Users can use the following directive to set a default value for a parameter
```
cli:
    cli-directive:
      - where:
            group: Factories
            parameter: identityType
        default-value: SystemAssigned
```
This is useful when Azure CLI wants to do some special handling for parameters like SKU tier as it doesn't want customer to pass SKU tier directly. Use customization to provide a default value and hide it. 
#### add alias for a parameter  
It's quite common that in Azure CLI a parameter can have one or more aliases.
```
cli:
    cli-directive:
      - where:
            group: Factories
            parameter: factoryName
        alias:
            - name
            - n
```  
#### how an action parameter is handled  
An action parameter means a simple object that is not base class of polymorphic and satisfy one of the six conditions
1. objects with simple properties 
1. or objects with arrays as properties but has simple element type 
1. or arrays with simple element types
1. or arrays with object element types but has simple properties
1. or dicts with simple element properties
1. or dicts with arrays as element properties but has simple element type  

By default we will use the key value format to handle the action. in the case of object A has three properties a, b, c and a, b, c are all simple type. if we use action to express it. it will be like `--A a=a1 b=b1 c=c1` to express an object instance `{a1, b1, c1}`.
#### set an action as positional argument  
see [how to set an action argument as postional](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-set-an-action-argument-as-positional-argument) for more details   
#### set an action as AWS shorthand syntax  
see [how to set an action argument as aws shorthand syntax](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-set-an-action-argument-as-aws-shorthand-syntax) for more details.  
   
## SDK Customization
We also provide some SDK layer customization options. See [how to generate with different options](https://github.com/Azure/autorest.az/blob/master/doc/how-to-generate-with-different-options.md) for more details. 
### Flattened SDK and un-Flattened SDK
The previous version of Autorest.Az code generator can only support the flattened SDK(before 1.6.0 release), and after we have supported the Azure CLI main repo modules(since 1.6.0 release). We are using flattened SDK by default for generating Azure CLI extensions and using un-flattened SDK by default for generating Azure CLI main repo modules.(current 1.6.1 release)  
Current in our private releases we have changed the default generated SDK to un-flattened way as well. which should be public release very soon.
Users can use `--sdk-no-flatten` to specific an un-flattened SDK and `--sdk-flatten` to generate a flattened SDK. If users use both `--sdk-no-flatten` and `--sdk-flatten` we will still generate the un-flattened SDK.

### Track1 SDK and Track2 SDK
In the current Azure CLI main repo, most of the modules are still using track1 publish released SDKs. However, in Azure CLI extension repos, the track2 SDK are used as vendored SDK for code generation. 

This means, by default, we will use track1 mode for Azure CLI main repo modules generation and track2 mode for Azure CLI extensions generation.

Users can use `compatible-level=track1` or `compatible-level=track2` to specific which kind of SDK you want. 

## Manual Override 
In some scenarios, we might find the generated code doesn't work for us and there's no way to use customization to meet our requirements. Though we are trying to reduce the manual override work, we can't rule out the possibility of generated code won't work in some complex scenaros.  

Therefore, we provide the manual override ability for users to do manual override. See [manual customization](https://github.com/Azure/autorest.az/blob/master/doc/03-manual-customizations.md) for more details.   
## Test Customization
By default the Autorest.Az can generate all the tests from examples in the order of CURD and it can resolve the resource dependencies within one RP, it also support users to define test scenarios by yourselves. 
See [test configuration](https://github.com/Azure/autorest.az/blob/master/doc/04-scenario-test-configuration.md) for more details



## Special Parameter Type
To be done ...
1. Identity
1. Nested Resource
1. SKU

## Incremental Code Generation
The basic idea of current incremental code generation is to hide those operations you don't need. see above sections to find out how to set command groups/commands as hidden. 

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.



# Autorest pipeline configuration

This configuration is for Autorest Pipeline definition.

See documentation [here](doc/00-onboarding-guide.md)

``` yaml

python:
    reason: 'make sure python flag exists to load config in python.md'
azure-arm: true

output-folder: $(az-output-folder)
debug-output-folder: $(az-output-folder)/_az_debug

use-extension:
  "@autorest/python": "5.4.0"
  "@autorest/clicommon": "0.6.0"
  #"@autorest/python": "latest"

require:
  - ./readme.python.md
  - ./readme.cli.md
  - $(this-folder)/readme.az.common.md

pipeline-model: v3

scope-clicommon:
    output-folder: $(debug-output-folder)

scope-az:
    is-object: false
    output-artifact:
        #- source-file-az-hider
        #- source-file-pynamer
        #- source-file-aznamer
        #- source-file-modifiers
        #- source-file-merger
        - source-file-extension
    output-folder: $(az-output-folder)

cli:
    reason: 'make sure cli flag exists to load config in cli.md'
    naming:
        default:
            parameter: 'snake'
            property: 'snake'
            operation: 'snake'
            operationGroup:  'pascal'
            choice:  'pascal'
            choiceValue:  'snake'
            constant:  'snake'
            type:  'pascal'

modelerfour:
    lenient-model-deduplication: true
    group-parameters: true
    flatten-models: true
    flatten-payloads: true
    # keep-unused-flattened-models: true
```

``` yaml $(sdk-flatten) && !$(sdk-no-flatten)
#payload-flattening-threshold: 4
#recursive-payload-flattening: true

pipeline:
    python/m2r:
        input: clicommon/identity
    az/azentry:
        input: python/namer
    az/hider:
        input: az/azentry
        #output-artifact: source-file-az-hider
    python/codegen:
        input: az/hider
    az/merger:
        input: az/azentry
        #output-artifact: source-file-merger
    az/aznamer:
        input: az/merger
        #output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        #output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/hider
            #- az/clicommon
            #- az/merger
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az
    az/azlinter:
        input:
            - az/emitter
```

``` yaml !$(sdk-flatten) || $(sdk-no-flatten)

#payload-flattening-threshold: 4
#recursive-payload-flattening: true

cli:
    naming:
        m4:
            parameter: 'snake'
            property: 'snake'
            operation: 'snake'
            operationGroup:  'snake'
            choice:  'pascal'
            choiceValue:  'pascal'
            constant:  'snake'
            type:  'snake'

pipeline:
    python/m2r:
        input: clicommon/cli-m4namer
    az/azentry:
        input: clicommon/identity
    az/renamer:
        input: az/azentry
    az/merger:
        input:
            - az/renamer
            - python/namer
        #output-artifact: source-file-merger
    az/aznamer:
        input: az/merger
        #output-artifact: source-file-aznamer
    az/modifiers:
        input: az/aznamer
        #output-artifact: source-file-modifiers
    az/azgenerator:
        input: az/modifiers
        output-artifact: source-file-extension
    az/emitter:
        input:
            #- az/hider
            #- az/clicommon
            #- az/merger
            #- az/aznamer
            #- az/modifiers
            - az/azgenerator
        scope: scope-az
    az/azlinter:
        input:
            - az/emitter
```
