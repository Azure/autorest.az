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

@try_manual
def setup(test, rg, rg_2, rg_3):
    pass


# EXAMPLE: Operations_List
@try_manual
def step_operations_list(test, rg, rg_2, rg_3):
    # EXAMPLE NOT FOUND!
    pass


# EXAMPLE: AttestationProviders_Create
@try_manual
def step_attestationproviders_create(test, rg, rg_2, rg_3):
    test.cmd('az attestation attestation-provider create '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


# EXAMPLE: AttestationProviders_Get
@try_manual
def step_attestationproviders_get(test, rg, rg_2, rg_3):
    test.cmd('az attestation attestation-provider show '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg}"',
             checks=[])


@try_manual
def mytest(test, rg, rg_2, rg_3):
    pass


# EXAMPLE: AttestationProviders_List
@try_manual
def step_attestationproviders_list(test, rg, rg_2, rg_3):
    test.cmd('az attestation attestation-provider list',
             checks=[])


# EXAMPLE: AttestationProviders_ListByResourceGroup
@try_manual
def step_attestationproviders_listbyresourcegroup(test, rg, rg_2, rg_3):
    test.cmd('az attestation attestation-provider list '
             '--resource-group "{rg_2}"',
             checks=[])


# EXAMPLE: AttestationProviders_Delete
@try_manual
def step_attestationproviders_delete(test, rg, rg_2, rg_3):
    test.cmd('az attestation attestation-provider delete '
             '--provider-name "myattestationprovider" '
             '--resource-group "{rg_3}"',
             checks=[])


@try_manual
def cleanup(test, rg, rg_2, rg_3):
    pass


@try_manual
def call_scenario(self, rg, rg_2, rg_3):
    setup(test, rg, rg_2, rg_3)
    step_operations_list(test, rg, rg_2, rg_3)
    step_attestationproviders_create(test, rg, rg_2, rg_3)
    step_attestationproviders_get(test, rg, rg_2, rg_3)
    mytest(test, rg, rg_2, rg_3)
    step_attestationproviders_list(test, rg, rg_2, rg_3)
    step_attestationproviders_listbyresourcegroup(test, rg, rg_2, rg_3)
    step_attestationproviders_delete(test, rg, rg_2, rg_3)
    cleanup(test, rg, rg_2, rg_3)


@try_manual
class AttestationManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestattestation_MyResourceGroup'[:7], key='rg', parameter_name='rg')
    @ResourceGroupPreparer(name_prefix='clitestattestation_testrg1'[:7], key='rg_2', parameter_name='rg_2')
    @ResourceGroupPreparer(name_prefix='clitestattestation_sample-resource-group'[:7], key='rg_3', parameter_name='rg_3'
                           '')
    def test_attestation(self, rg, rg_2, rg_3):

        call_scenario(test, rg, rg_2, rg_3)

~~~
### Customize step functions
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
def step_attestationproviders_create(test, rg, rg_2, rg_3):
    print("Doing manual attestation create test code")

def mytest(test, rg, rg_2, rg_3):
    print("Doing fully customizing test.")
~~~
### Customize TestClass or Customize Resource Preparers
If you need to customize the test class(such as use a new resource preparer), you can also override the test class in file manual/tests/latest/test_xxxx_scenario.py. Below is an example to write an preparer and use it manually.
~~~
from azure.cli.testsdk import ScenarioTest
from azure.cli.testsdk import ResourceGroupPreparer
from azure.cli.testsdk.preparers import NoTrafficRecordingPreparer
from azure_devtools.scenario_tests import SingleValueReplacer
from azure.cli.testsdk.reverse_dependency import get_dummy_cli


class xxPreparer(NoTrafficRecordingPreparer, SingleValueReplacer):  # sample for customized preparer
    def __init__(self, **kargs):
        super(xxPreparer, self).__init__('xx', 10)
        self.cli_ctx = get_dummy_cli()
        self.parameter_name = 'xx'
        self.key = 'xx'

    def create_resource(self, name, **kwargs):
        print("Will create resource of xx")

    def remove_resource(self, name, **kwargs):
        print("Will remove resource of xx")


class AttestationManagementClientScenarioTest(ScenarioTest):

    @ResourceGroupPreparer(name_prefix='clitestattestation_MyResourceGroup'[:7], key='rg', parameter_name='rg')
    @ResourceGroupPreparer(name_prefix='clitestattestation_testrg1'[:7], key='rg_2', parameter_name='rg_2')
    @ResourceGroupPreparer(name_prefix='clitestattestation_sample-resource-group'[:7], key='rg_3', parameter_name='rg_3'
                           '')
    @xxPreparer()                                                           # sample to use customized preparer
    def test_attestation(self, rg, rg_2, rg_3):
        from ....tests.latest import test_attestation_scenario as g         # sample to call generated code
        g.call_scenario(self, rg, rg_2, rg_3)
~~~
Of course it's suggested to envelop the xxPreparer into seperate python module in elsewhere.