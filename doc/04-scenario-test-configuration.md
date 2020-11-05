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

### Basic test-scenario
In basic test-scenario, all test examples are composed in one testcase.
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

### Mutli-testcase scenario
You can config multiple testcases in the test-scenario with below format:
~~~
cli:
  cli-name: managednetwork
  test-scenario:
    ManagedNetworks_scenario1:
      - name: ManagementNetworkGroupsPut
      - name: ManagementNetworkGroupsDelete
    ManagedNetworks_scenario2:
      - name: ManagedNetworksListByResourceGroup
      - name: ManagedNetworksListBySubscription
      - name: ManagementNetworkGroupsGet
    ManagedNetworks_scenario3:
      - name: ManagedNetworkPeeringPoliciesPut
      - name: ManagedNetworkPeeringPoliciesGet
      - name: ManagedNetworkPeeringPoliciesListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesDelete
    ScopeAssignments:
      - name: ScopeAssignmentsPut
      - name: ScopeAssignmentsGet
      - name: ScopeAssignmentsList
      - name: ScopeAssignmentsDelete
~~~
In above sample, four testcases are configured, and they will be generated in two test files:
- test_ManagedNetworks_scenario.py: three testcases will be generated in it: ManagedNetworks_scenario1, ManagedNetworks_scenario2, ManagedNetworks_scenario3.
- test_ScopeAssignments_scenario.py: one testcase generated in it: ScopeAssignments.

Note: the part before the underscore('_') in the testcase name will be used to descibe in which test file the case will be generated.


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
### Examples:
#### Only want to override the generated test step
let's say in your generated test you have step_pipelines_create like this  
```
# EXAMPLE: Pipelines_Create
@try_manual
def step_pipelines_create(test, rg):
    test.cmd('az datafactory pipeline create '
             '--factory-name "{myFactoryName}" '
             '--pipeline "{{\\"activities\\":[{{\\"name\\":\\"ExampleForeachActivity\\",\\"type\\":\\"ForEach\\",\\"typ'
             'eProperties\\":{{\\"activities\\":[{{\\"name\\":\\"ExampleCopyActivity\\",\\"type\\":\\"Copy\\",\\"inputs'
             '\\":[{{\\"type\\":\\"DatasetReference\\",\\"parameters\\":{{\\"MyFileName\\":\\"examplecontainer.csv\\",'
             '\\"MyFolderPath\\":\\"examplecontainer\\"}},\\"referenceName\\":\\"myDataset\\"}}],\\"outputs\\":[{{\\"ty'
             'pe\\":\\"DatasetReference\\",\\"parameters\\":{{\\"MyFileName\\":{{\\"type\\":\\"Expression\\",\\"value\\'
             '":\\"@item()\\"}},\\"MyFolderPath\\":\\"examplecontainer\\"}},\\"referenceName\\":\\"myDataset\\"}}],\\"t'
             'ypeProperties\\":{{\\"dataIntegrationUnits\\":32,\\"sink\\":{{\\"type\\":\\"BlobSink\\"}},\\"source\\":{{'
             '\\"type\\":\\"BlobSource\\"}}}}}}],\\"isSequential\\":true,\\"items\\":{{\\"type\\":\\"Expression\\",\\"v'
             'alue\\":\\"@pipeline().parameters.OutputBlobNameList\\"}}}}}}],\\"parameters\\":{{\\"JobId\\":{{\\"type\\'
             '":\\"String\\"}},\\"OutputBlobNameList\\":{{\\"type\\":\\"Array\\"}}}},\\"variables\\":{{\\"TestVariableA'
             'rray\\":{{\\"type\\":\\"Array\\"}}}},\\"runDimensions\\":{{\\"JobId\\":{{\\"type\\":\\"Expression\\",\\"v'
             'alue\\":\\"@pipeline().parameters.JobId\\"}}}}}}" '
             '--name "{myPipeline}" '
             '--resource-group "{rg}"',
             checks=[
                 test.check('name', "{myPipeline}")
             ])
```
And you want to override this step with a different implementation or a different pipeline definition etc. 
Then in your `manual/tests/latest/test_datafactory_scenario.py` file, you can have the same function definition like this. 
```
def step_pipelines_create(test, rg):
    test.cmd('az datafactory pipeline create '
             '--factory-name "{myFactoryName}" '
             '--pipeline "{{\\"activities\\":[{{\\"name\\":\\"Wait1\\",'
             '\\"type\\":\\"Wait\\",\\"dependsOn\\":[],\\"userProperties'
             '\\":[],\\"typeProperties\\":{{\\"waitTimeInSeconds\\":5'
             '}}}}],\\"annotations\\":[]}}" '
             '--name "{myPipeline}" '
             '--resource-group "{rg}" ',
             checks=[
                 test.check('name', "{myPipeline}"),
                 test.check('activities[0].type', "Wait")
             ])
```
In this case, when the `call_scenario` function calls `g.step_pipelines_create` in generated `tests/latest/test_datafactory_scenario.py`. it will actually call the function defined in your manual folder.

#### add your own test step
Suppose that you need to add more test steps because lacking of specific test examples are not covered etc.
you can add a new test function `step_triggers_tumble_create` like this 
``` 
def step_triggers_tumble_create(test, rg):
    test.cmd('az datafactory trigger create '
             '--resource-group "{rg}" '
             '--properties "{{\\"description\\":\\"trumblingwindowtrigger'
             '\\",\\"annotations\\":[],\\"pipeline\\":{{\\"pipelineReference'
             '\\":{{\\"referenceName\\":\\"{myPipeline}\\",\\"type\\":'
             '\\"PipelineReference\\"}}}},\\"type\\":\\"TumblingWindowTrigger'
             '\\",\\"typeProperties\\":{{\\"frequency\\":\\"Minute\\",'
             '\\"interval\\":5,\\"startTime\\":\\"{myStartTime}\\",'
             '\\"endTime\\":\\"{myEndTime}\\",\\"delay\\":\\"00:00:00\\",'
             '\\"maxConcurrency\\":50,\\"retryPolicy\\":{{\\"intervalInSeconds'
             '\\":30}},\\"dependsOn\\":[]}}}}" '
             '--factory-name "{myFactoryName}" '
             '--name "{myTrigger}"',
             checks=[
                 test.check('name', "{myTrigger}"),
                 test.check('properties.type', "TumblingWindowTrigger"),
                 test.check('properties.pipeline.pipelineReference.referenceName',
                            "{myPipeline}")
             ])
```
In this case, you will also need to override the `call_scenario` definition so that your self-defined test steps can be called.
like this.
```
def call_scenario(test, rg):
    from ....tests.latest import test_datafactory_scenario as g
    g.setup(test, rg)
    g.step_factories_createorupdate(test, rg)
    step_triggers_tumble_create(test, rg) # your self-defined test step.
    g.step_factories_delete(test, rg)
    g.cleanup(test, rg)
```
Please note that there's no pointer before calling you self-defined steps.

#### add your own call scenarios.
let's say, the swagger examples provided only consider one type of resource, but this resource has another type which is fairly important, and to create this resource you probably need to create a lot of dependent resources. In this case, you probably need to define your own call scenario.
You will need to prepare your own test steps. Then you will have to define your own call_scenario functions
```
def call_triggerrun_scenario(test, rg):
    from ....tests.latest import test_datafactory_scenario as g
    import time
    g.setup(test, rg)
    g.step_factories_createorupdate(test, rg)
    step_pipelines_wait_create(test, rg)
    createrun_res = g.step_pipelines_createrun(test, rg)
    time.sleep(5)
    test.kwargs.update({'myRunId': createrun_res.get('runId')})
    g.step_pipelineruns_get(test, rg)
    g.step_activityruns_querybypipelinerun(test, rg)
    createrun_res = g.step_pipelines_createrun(test, rg)
    test.kwargs.update({'myRunId': createrun_res.get('runId')})
    g.step_pipelineruns_cancel(test, rg)
    step_triggers_tumble_create(test, rg)
    g.step_triggers_start(test, rg)
    g.step_triggers_get(test, rg)
    maxRound = 2
    while True:
        triggerrun_res = g.step_triggerruns_querybyfactory(test, rg)
        if len(triggerrun_res['value']) > 0 and triggerrun_res['value'][0]['status'] == 'Succeeded':
            test.kwargs.update({'myRunId': triggerrun_res['value'][0]['triggerRunId']})
            break
        else:
            if maxRound > 0:
                maxRound -= 1
                print("waiting round: " + str(5 - maxRound))
                time.sleep(300)
            else:
                break
    if maxRound > 0:
        g.step_triggerruns_rerun(test, rg)
    g.step_triggerruns_querybyfactory(test, rg)
    g.step_triggers_stop(test, rg)
    g.step_triggers_delete(test, rg)
    g.step_pipelines_delete(test, rg)
    g.step_factories_delete(test, rg)
```
In this example, it shows how to get one command's result as another command's input `test.kwargs.update({'myRunId': createrun_res.get('runId')})`  
And it also shows an example of how you should write your scenario if you need to wait some certain time-consuming resource ready until you can test next step.  
Still you need to override the `call_scenario` function in the generated test. If you still want the original `call_scenario` to be called, you can put them in another function let's say `call_main_scenario`, and call it in your override `call_scenario`
```
def call_scenario(test, rg):
    call_main_scenario(test, rg)
    call_triggerrun_scenario(test, rg)

```
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

## How to randomize resource names
Since some RP don't support randomized name resource name well, resource names will not be randomized by default. If you want to enable it, please add randomize-names configuration like below in readme.az.md
~~~
az:
  ...
  randomize-names: true
~~~
## How to write readme.cli.md foramt
As shown below, Testcases with the same keyword are grouped together, and it is desirable that each group contain only testCases with that group name
~~~
## CLI

These settings don't need to apply `--cli` on the command line.

``` yaml $(cli)
cli:
  cli-name: managednetwork
  test-scenario:
    - ManagedNetworks:
      - name: ManagedNetworksPut
      - name: ManagementNetworkGroupsPut
      - name: ManagedNetworkPeeringPoliciesPut
      - name: ManagedNetworksGet
      - name: ManagedNetworksListByResourceGroup
      - name: ManagedNetworksListBySubscription
      - name: ManagedNetworksDelete
      - name: ManagementNetworkGroupsGet
      - name: ManagedNetworksGroupsListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesGet
      - name: ManagedNetworkPeeringPoliciesListByManagedNetwork
      - name: ManagedNetworkPeeringPoliciesDelete
      - name: ManagementNetworkGroupsDelete
    - ScopeAssignments:
      - name: ScopeAssignmentsPut
      - name: ScopeAssignmentsGet
      - name: ScopeAssignmentsList
      - name: ScopeAssignmentsDelete
```
~~~