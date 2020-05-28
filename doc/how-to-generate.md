# How to generate code using autorest.az

There are 3 ways to use autorest.az now, pick one you prefer :)

## Through PR in [Swagger repo](https://github.com/Azure/azure-rest-api-specs)

Autorest.az has been integrated into the [swagger repo](https://github.com/Azure/azure-rest-api-specs), which means it will be triggered automatically to generate the CLI code and extension for you without any extra effort as long as the readme files are ready in the swagger repo/PR. We can help to prepare the init readme files for you as mentioned in [onboarding-guide](onboarding-guide.md), or you can also find example [here](../src/test/scenarios/attestation/configuration).

More detail can also be found in this [10-minutes video](https://msit.microsoftstream.com/video/71cea3ff-0400-a9f4-01b4-f1ea9e9b130e)

![sample image](images/codegen-in-swagger-pr.png)

## Through our pre-prepared docker

We have pre-prepared docker image for you to use autorest.az easily. Following is the details and please make sure [Docker](https://www.docker.com/products) has been installed. :)

1. Start docker:
    * sync 'https://github.com/Azure/azure-cli-extensions.git' to {azure_cli_ext_folder} and 'https://github.com/Azure/azure-rest-api-specs.git' to {swagger_folder}
    * login to Azure Container Registry and start the docker
    ``` bash
    > az acr login --name amecodegen
    > docker run -v {swagger_folder}:/home/swg -v {azure_cli_ext_folder}:/home/azext -v -it amecodegen.azurecr.io/az:2020.05.24 /bin/bash
    ```

2. Generate the code in docker:
    * Make sure the readme files are ready in the swagger repo. We can help to prepare the init readme files for you as mentioned in [onboarding-guide](onboarding-guide.md), or you can also find example [here](../src/test/scenarios/attestation/configuration).
    * Generate the code:
    ``` bash
    > autorest --az --azure-cli-extension-folder=/home/azext /home/swg/specification/{service_name}/resource-manager/readme.md
    ```

3. Run the generated command
    * generate commands are ready to use after add the extension:
    ``` bash
    > azdev extension add {service_name}
    ```

4. [Run the generated test]
    * run azdev test
    ``` bash
    > azdev test {service_name}
    ```

## Through autorest command directly in local
1. Make sure your environment is good to run autorest and autorest.python by following [this](https://github.com/Azure/autorest.python/wiki/Generating-with-autorest-for-python-v5.0.0).
2. sync 'https://github.com/Azure/azure-cli-extensions.git' to {azure_cli_ext_folder} and 'https://github.com/Azure/azure-rest-api-specs.git' to {swagger_folder}
3. Generate the code in docker:
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



