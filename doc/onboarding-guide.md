# Onboarding process for using Azure Cli Codegen (autorest.az)

## Step 1. Init the process

Send mail to amecodegen@microsoft.com when your swagger is ready, then we will

1. Do a quick validation on your swagger and prepare initial readme files for you
2. Have one person assigned for your service to follow up with your for any questions and support needed

## Step 2. Generate code and give it a try

1. There are 3 ways to generate code now, you can pick the one you prefer. Details can be found at [here](how-to-generate.md)
2. Try the generated command to see whether it meets your need. Further customization is supported if needed. Detail can be found at [FAQ](faq.md).

## Step 3. Run Test
1. Test will also be generated based on the examples in swagger. Run these test and make sure all of them can pass. (Refer to [here](how-to-generate.md#through-our-pre-prepared-docker) for how to run test). Customization is also supported for test if needed. Detail can be found at [here](04-scenario-test-configuration.md)
2. Add more test if the generated test is not enough. Detail can be found at [here](https://github.com/Azure/azure-cli/blob/dev/doc/authoring_tests.md)

## Step 4. Onboarding to azure-cli
1. Follow [azure-cli guidance](https://github.com/Azure/azure-cli/blob/dev/doc/onboarding_guide.md) to onboard to azure-cli
> ** we are improving the process here with Azure CLI team now

## Step Next. CLI is ready when swagger is ready
1. After your service has onboarded using autorest.az, you can start reviewing your CLI code/command along with swagger PR which means the Azure CLI support can be ready very soon for your new features/changes. More detail can be found in this [10-minutes video](https://msit.microsoftstream.com/video/71cea3ff-0400-a9f4-01b4-f1ea9e9b130e)
> ** we are working on the process here with Azure CLI and swagger team now

