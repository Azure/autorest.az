# The process to use Azure Cli Codegen (autorest.az) for your azure CLI extension

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

## Step 4. File PR to [azure cli extension repo](https://github.com/Azure/azure-cli-extensions) for review

