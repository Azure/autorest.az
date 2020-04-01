## What happend if no configuration provided?
By default, autorest.az can generate scenario test steps automatically by strategy:
- Each example in swagger stand as one step in the generated test;
- Steps for creating resources are always in front of other steps, and deleting are always behind of other kind of operations;
- If one resource is depend on other resources, it will be created after it's dependants. Similar logic applys for the delete operation;
- Dummy setup/cleanup steps are provided, so that you can add code for them manually.

## When do I need a configuration?
In bellow conditions, you may need to do configuration for the scenario test.
- You don't want one or more examples in the swagger make appearance in the test scenario;
- The auto-generated steps order don't meet the requriments.
- You want to add some **fully customized** test steps. 

Notice 1: *Once configurations are provided, autorest.az will not add any other steps or adjust step orders automatically.*

Notice 2: *Even if no configuration is provided, you can still override the auto-generated steps.*

## How to configure?
Test scenario configuration can be done in file readme.cli.md, here is an example for it.
~~~
cli:
  cli-name: attestation
  test-scenario:
    - name: Operations_List
    - name: AttestationProviders_Create
    - name: AttestationProviders_Get
    - function: mytest
    - name: AttestationProviders_List
    - name: AttestationProviders_ListByResourceGroup
    - name: AttestationProviders_Delete
~~~
Two kind of step can be used in the test-scenario, they are:
- function: can be any function name you like. The generated tests will preserve a empty placeholder function for each of this kind of step, expecting the user to add manual testing code in it.
- name: stand for the example name used in swagger. For instance:
~~~
// Here is a clip in attestation swagger file.
        "x-ms-examples": {
          "AttestationProviders_Create": {
            "$ref": "./examples/Create_AttestationProvider.json"
          }
        },
~~~

## What if multiple examples in swagger have duplicated name?
Occasionally several examples have a same example name. Since each test-scenario item represent only one example, you can assign a full example name in this condition. A full example name can be formed as:
~~~
<operationGroup>/<httpMethod>/<ExampleName>
~~~ 
For instance, below is an configuration with full example name for AttestationProviders_Create.
~~~
cli:
  cli-name: attestation
  test-scenario:
    - name: Attestations/Put/AttestationProviders_Create
~~~
Notice: *Uppercase/lowercase is insensitive for the example name.*

## How to customize/override the generated tests
Below is a briefed generated code tree view:
~~~
.
+-- generated ...                           // generated CLI code folder.
+-- manual                                  // customization code folder, be empty initially.
|   +-- __init__.py
+-- tests
|   +-- latest
|   |   +-- ...
|   |   +-- test_attestation_scenario.py    // generated test scenario.
+-- ...
~~~ 
The content of test_attestation_scenario.py here is like:
~~~
# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import os
import unittest

from azure_devtools.scenario_tests import AllowLargeResponse
from azure.cli.testsdk import ScenarioTest
from .. import try_manual
from azure.cli.testsdk import ResourceGroupPreparer


TEST_DIR = os.path.abspath(os.path.join(os.path.abspath(__file__), '..'))


@try_manual
def setup(test):
    pass


# EXAMPLE: Operations_List
@try_manual
def step_operations_list(test):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: AttestationProviders_Create
@try_manual
def step_attestationproviders_create(test):
    test.cmd('az attestation attestation-provider create '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: AttestationProviders_Get
@try_manual
def step_attestationproviders_get(test):
    test.cmd('az attestation attestation-provider show '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


@try_manual
def mytest(test):
    pass


# EXAMPLE: AttestationProviders_List
@try_manual
def step_attestationproviders_list(test):
    test.cmd('az attestation attestation-provider list',
             checks=[])


# EXAMPLE: AttestationProviders_ListByResourceGroup
@try_manual
def step_attestationproviders_listbyresourcegroup(test):
    test.cmd('az attestation attestation-provider list '
             '--resource-group "{rg_2}"',
             checks=[])


# EXAMPLE: AttestationProviders_Delete
@try_manual
def step_attestationproviders_delete(test):
    test.cmd('az attestation attestation-provider delete '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg_3}"',
             checks=[])


@try_manual
def cleanup(test):
    pass


class AttestationManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='cli_test_attestation_MyResourceGroup'[:9], key='rg')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_testrg1'[:9], key='rg_2')
    @ResourceGroupPreparer(name_prefix='cli_test_attestation_sample-resource-group'[:9], key='rg_3')
    def test_attestation(self, resource_group):

        setup(self)
        step_operations_list(self)
        step_attestationproviders_create(self)
        step_attestationproviders_get(self)
        mytest(self)
        step_attestationproviders_list(self)
        step_attestationproviders_listbyresourcegroup(self)
        step_attestationproviders_delete(self)
        cleanup(self)

~~~
All test steps are invoked one by one in the bottom of above sample test scenario. Let's say you want to override test step functions step_attestationproviders_create() and mytest() in this scenario, you can:

1. Create the test program file with exactly the same relative path with the auto-generated one.

2. Write customized test code in manual functions which have the same signature with those in auto-generated file.

Below is the tree view after adding the manual test file:
~~~
.
+-- generated ... 
+-- manual                                          // customization folder
|   +-- __init__.py
|   +-- tests
|   |   +-- _init_.py                               // don't forget to add python init file
|   |   +-- latest
|   |   |   +-- __init__.py                         // don't forget to add python init file
|   |   |   +-- test_attestation_scenario.py        // manual test file
+-- tests
|   +-- latest
|   |   +-- ...
|   |   +-- test_attestation_scenario.py    
+-- ...
~~~ 
The content of the manual test_attestation_scenario.py can be:
~~~
def step_attestationproviders_create(test):
    print("Doing manual attestation create test code")

def mytest(test):
    print("Doing fully customizing test.")
~~~