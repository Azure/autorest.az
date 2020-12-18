
# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.



# Introduction

This project is for Azure CLI Code Generator. We support to generate as both cli extensions and cli main repo modules. In this README file, we will briefly introduce how the Azure CLI Code Generator works. Secondly, we will introduce how to use the CLI code generator and what kinds of advanced features of CLI code generator do we support. Then, we will introduce how to debug the CLI Code Generator. Finally, we will end this document with Autorest Pipeline definitions.  

# Assumption

This document is mainly for Azure CLI developers and people who are interested in generating Azure CLI by themselves.  
# How Does the CLI Code Generator Work.
The Azure Code Generator is basically a [Autorest](https://github.com/Azure/autorest) extension which takes swagger in [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) or [azure-rest-api-specs-pr](https://github.com/Azure/azure-rest-api-specs-pr) repos as input and output functional Azure CLI code. It uses Autorest V3 to handle the configuration interpretation, pipeline resolving, pipeline scheduling and uses [Autorest.Modelerfour](https://github.com/Azure/autorest.modelerfour) as a basic code model. 

Besides the Autorest.Modelerfour, Autorest.Az has two more Autorest extensions dependencies, the [Autorest.Clicommon](https://github.com/Azure/autorest.clicommon) and [Autorest.Python](https://github.com/Azure/autorest.python), the Autorest.Clicommon mainly handles the user defined cli directives such as split operations, handle polymorphism, rename, hide etc. and properly mark it in the code model, the Autorest.Python is integrated by Autorest.Az as the Azure CLI modules don't call the rest api directly, instead, it either call the vendored SDKs in the case of Azure CLI Extensions or call the public released SDK in the case of Azure CLI main repo modules.


Both the Autorest.Clicommon and Autorest.Python take Autorest.Modelerfour as input, Normally autorest.python will not flatten the code model because the Python Language naturally support complex object, they don't need to flatten the parameter but for command line tools like Azure CLI, the parameter layer must not deeper than 2, otherwise it's hard to express the complex object without using a bunch of delimiters. Therefore, autorest.clicommon will flatten the code model. Autorest az will merge the two code model from autorest.python and autorest.clicommon.    

After autorest.az has done some CLI specific logic, it will render the code model into code template finally output the generated code.   


# How to use the CLI Code Generator

Users can use autorest.az to generate the Azure CLI code both in rest api specs PR pipeline and in their local environment. Guidance for generate the Azure CLI code in rest api specs PR pipeline can be found in [rest api specs documentation](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/code-gen/configure-cli.md). Here we only focus on the guidance to generate the CLI code in local.  

More detailed generation guidance can be found in the [how to generate doc](https://github.com/Azure/autorest.az/blob/master/doc/how-to-generate.md)

## Preparing Environment
In order to generate the Azure CLI, we need 
1. Nodejs v10+  
better to be v12+
2. Python3  
we need a Python venv  
```
python -m venv env
source ./env/bin/activate // or .\env\Scripts\Activate.ps1 in windows
pip install azure-cli // This is must to have if for simple try out
pip install azdev // this is optional if for simple try out. 
```
3. Autorest  
it can be installed by running `npm install -g autorest@latest` 
4. Repos (Optional)  
if users only want to try out the generated CLI extensions, they can also build the wheel artifact by themselves with `python setup.py sdist bdist_wheel` in the azure-cli-extensions/src/{serviceName} folder.  
* Users need to prepare their swagger and prepare  
[azure-cli-extensions](https://github.com/Azure/azure-cli-extensions) repo if targeting at Azure CLI extensions development. Or the generated code needs some manual customization after trying out.   
[azure-cli](https://github.com/Azure/azure-cli) repo if targeting at Azure CLI main repo modules development.   


## Authoring readme files
Because the Autorest.Az depends on Autorest.Clicommon and Autorest.Python, it needs three readme files the readme.az.md, readme.cli.md and readme.python.md to be ready before we use it.

Users can refer to [this document](https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/code-gen/configure-cli.md) for more details. 

## Generating the code
1. A simple command for authoring Azure CLI extensions would be  
`autorest --az --use=@autorest/az@latest <path-to-the-swagger-readme.md> --azure-cli-extension-folder=<path-to-the-azure-cli-extension-repo>`

2. A simple command for authoring Azure CLI main modules would be  
`autorest --az --use=@autorest/az@latest <path-to-the-swagger-readme.md> --azure-cli-folder=<path-to-the-azure-cli-repo>`

The `--use=@autorest/az@latest` will use the latest `@autorest/az` public releases, private releases can be found in [github releases](https://github.com/Azure/autorest.az/releases) if users want to try out some private releases for preview some new features and fixes.  

Other command line options can be found in the [generate with different options doc](https://github.com/Azure/autorest.az/blob/master/doc/how-to-generate-with-different-options.md)


## Building the code
If it's try out mode, 
``` 
cd <az-output-folder> // the az-output-folder you have specified in your readme.az.md 
python setup.py sdist bdist_wheel // you will find a wheel file in your local dist folder
az extension add <path-to-the-wheel-file>
``` 
If it's for azure-cli-extensions development, you need  
```
azdev setup -r ./azure-cli-extensions -c ./azure-cli 
// where the ./azure-cli-extensions is the path to azure-cli-extensions repo and ./azure-cli is the path to azure-cli repo, you don't need to specify them both if you are not working on both of them
azdev extension add <extension-name> // for Azure CLI extensions
// extension add step is needed for developing Azure CLI main repo modules 
```
## Play with Azure CLI
Now you can run `az <extension-name> -h` to see all the commands and parameters. You can also find a report.md in generated azext_{extensionName} folder, which contains an overview of all the generated command groups, commands and parameters.   
### Checks
You can run code style check and linter check if you would like to onboard this generated Azure CLI code and publish it to your customers.
```
azdev style <extension-name>
azdev linter <extension-name>
``` 
### Live tests 
You can also run the live test against the service backend server. 
```
azdev test <extension-name> --live --discover 
```

If you found the everything goes well so far and you want to start the onboard process, you can commit the generated Azure CLI code and file a PR in azure-cli-extension repo or in azure-cli repo.  If you found there's something you think that's not good enough and you need to customize, you can refer to our **Advanced Features**

# Advanced Features

In this section, we will introduce what kinds of advanced features do we support and how users can use the advanced features.  

Before we start, The Autorest.az is using directive for customization, which kind of like SQL language, except SQL Language operates on data but directive operates on code model. 
## Folder customization

## Manual override customization

## CLI user interface customization
### extension rename
### move command groups/command layer
### rename/hide command groups, commands, parameters
## Test customization

## Parameter customization

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
  "@autorest/clicommon": "0.5.9"
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
    az/hider:
        input: python/namer
        #output-artifact: source-file-az-hider
    python/codegen:
        input: az/hider
    az/merger:
        input: python/namer
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
    az/renamer:
        input: clicommon/identity
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
```