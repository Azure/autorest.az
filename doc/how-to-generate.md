# How to generate code using autorest.az

There are 3 ways to use autorest.az now, pick one you prefer :)

## Through PR in [Swagger repo](https://github.com/Azure/azure-rest-api-specs)

Autorest.az has been integrated into the [swagger repo](https://github.com/Azure/azure-rest-api-specs), which means it will be triggered automatically to generate the CLI code and extension for you without any extra effort as long as the readme files are ready in the swagger repo/PR. We can help to prepare the init readme files for you as mentioned in [onboarding-guide](onboarding-guide.md), or you can also find example [here](../src/test/scenarios/attestation/configuration). The following is the step by step:

1. Create the PR in Swagger repo.

2. Try az cli extension. 

![try change](images/codegen-in-swagger-pr-try.JPG)

3. Review auto generated Az cli extension code. 

![preview change](images/codegen-in-swagger-pr-review-link.JPG)

![review change](images/codegen-in-swagger-pr-review-code.JPG)

4. Modify and Merge

    a. If nothing need to be changed after review and try, you can merge the swagger PR. After swagger PR is merged, another PR target to [Az cli extension](https://github.com/Azure/azure-cli-extensions) will be created but marked as closed. Following the link in pipeline, find the PR for Az cli extension, reopen it and ask for code review.

    ![preview change](images/codegen-in-swagger-pr-release-link.JPG)

    b. If you want to change Az cli auto generated code, please pull the Az cli extension PR to local, which you reviewed in step 2.

    ![review change](images/codegen-in-swagger-pr-review-code.JPG)

    You can changing the cli code, test and try in local environment with [developing guideline](https://github.com/Azure/azure-cli/blob/dev/doc/configuring_your_machine.md). After completed, please create the Az cli extension PR target to [Az cli extension](https://github.com/Azure/azure-cli-extensions) directly.

More detail can also be found in this [10-minutes video](https://msit.microsoftstream.com/video/71cea3ff-0400-a9f4-01b4-f1ea9e9b130e)

![sample image](images/codegen-in-swagger-pr.png)

## Through Docker

We have pre-prepared docker image for you to use autorest.az easily. (Please make sure [Docker](https://www.docker.com/products) has been installed. :))

1. Start docker:
    * sync 'https://github.com/Azure/azure-cli-extensions.git' to {azure_cli_ext_folder} and 'https://github.com/Azure/azure-rest-api-specs.git' to {swagger_folder}
    * login to Azure Container Registry and start the docker
    ``` bash
    > az acr login --name amecodegen
    > docker run -v {swagger_folder}:/home/swg -v {azure_cli_ext_folder}:/home/azext -it amecodegen.azurecr.io/az:2020.05.24 /bin/bash
    ```

2. Generate the code:
    * Make sure the readme files are ready in the swagger repo. We can help to prepare the init readme files for you as mentioned in [onboarding-guide](onboarding-guide.md), or you can also find example [here](../src/test/scenarios/attestation/configuration).
    * Generate the code:
    ``` bash
    > autorest --az --azure-cli-extension-folder=/home/azext /home/swg/specification/{service_name}/resource-manager/readme.md
    ```

3. Run the generated command
    * Generated commands are ready to use after adding the extension:
    ``` bash
    > azdev extension add {service_name}
    # your command is ready to use now
    ```

4. Run generated test cases and style check
    * run azdev test
    ``` bash
    > azdev test {service_name}
    ```

    * run azdev linter
    ``` bash
    > azdev linter {service_name}
    ```

    * run azdev style
    ``` bash
    > azdev style {service_name}
    ```

## Through autorest command directly in local
1. Make sure your environment is good to run autorest and autorest.python by following [this](https://github.com/Azure/autorest.python/wiki/Generating-with-autorest-for-python-v5.0.0).
2. sync 'https://github.com/Azure/azure-cli-extensions.git' to {azure_cli_ext_folder} and 'https://github.com/Azure/azure-rest-api-specs.git' to {swagger_folder}
3. Generate the code:
    * Make sure the readme files are ready in the swagger repo. We can help to prepare the init readme files for you as mentioned in [onboarding-guide](onboarding-guide.md), or you can also find example [here](../src/test/scenarios/attestation/configuration).
    * Generate the code:
    ``` bash
    > autorest --az --azure-cli-extension-folder={azure_cli_ext_folder}   {swagger_folder}/specification/{service_name}/resource-manager/readme.md
    ```

3. Run the generated command
    * Build az extension from the generated code and load it in az
    ``` bash
    # run this in the folder with generated code: {azure_cli_ext_folder}/src/{service_name}
    > python setup.py sdist bdist_wheel
    > az extension add --source={azure_cli_ext_folder}/src/{service_name}/dist/{generated .whl file}
    # your az command is ready to use :)
    ```
4. Run the generated test
    * Follow the [guidance](https://github.com/Azure/azure-cli/blob/dev/doc/authoring_tests.md) from azure-cli for running test.

5. Run linter and style check
    * Follow the [guidance](https://github.com/Azure/azure-cli/blob/dev/doc/configuring_your_machine.md#running-tests-and-checking-code-style) to run linter and style check.