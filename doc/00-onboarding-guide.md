# Onboarding Process for Using Azure Cli Code-gen (autorest.az)

Thanks for selecting Azure Cli Code-gen as approach to onboarding Azure Cli for your RP. If you want add a new feature to existing PR or onboard a new RP, then this document will provide the guideline for your on-boarding process.

## Step 1. Send request to AME team in Github
AME team use github issue as a centralized entry point to trigger the process for new RP onboarding or add feature in existing RP. Please go to [Azure-Cli](https://github.com/Azure/azure-cli) to create a new github issue and following the onboarding template first. 
With the selection result in template, a contact person will be assigned to provide help during the whole process. 
if you select Azure cli Code-gen as the approach, you will be re-direct back to this document later.
> ** we are improving the process here with Azure CLI team soon 

## Step 2. Quick Validation
If it is your first time to use Azure Cli code-gen, please prepare initial readme files for your RP [Preparing Readme](how-to-author-readme-file.md). Then, discuss with the contact person. He/She will: 
1. Do a quick validation on your swagger.
2. Follow up with you for any questions and support needed during the service onboarding.

## Step 3. Generate code and give it a try
1. There are 3 ways to generate code now, you can pick the one you prefer. Details can be found at [Generating Guide](how-to-generate.md)
2. Try the generated command to see whether it meets your need. Further customization is supported if needed. Detail can be found at [FAQ](faq.md).

## Step 4. Run Test and Style check
1. Test will also be generated based on the examples in swagger. Run these tests and make sure all of them can pass. (Refer to [here](how-to-generate.md#through-our-pre-prepared-docker) for how to run test). Customization is also supported for test if needed. Detail can be found at [here](04-scenario-test-configuration.md)
2. Add more test if the generated test is not enough. Detail can be found at [here](https://github.com/Azure/azure-cli/blob/dev/doc/authoring_tests.md)
3. Run linter and style check for the code generated and make sure all of them can pass. (Refer to [here](how-to-generate.md#through-our-pre-prepared-docker) for how to run linter and style check)

## Step 5. Add test recordings and code owners
1. After you have made sure `azdev test --live --discover <extension-name>` run successfully, you can see there're test recordings (*.yaml files) in your az-output-folder. You need to submit those test recordings as they are needed in CI tests. 
2. Add the codeowner for your CLI extension here https://github.com/Azure/azure-cli-extensions/blob/master/.github/CODEOWNERS

## Step 6. Code review with Cli team
1. Discusses with your contact person to ask for code review of the Az Cli code.
2. Follow [azure-cli guide](https://github.com/Azure/azure-cli/blob/dev/doc/onboarding_guide.md) to onboard to azure-cli
> ** we are improving the process here with Azure CLI team soon
