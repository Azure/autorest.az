/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./TemplateAzureCliActions";
import { GenerateAzureCliClientFactory } from "./TemplateAzureCliClientFactory";
import { GenerateAzureCliCommands } from "./TemplateAzureCliCommands";
import { GenerateAzureCliCustom } from "./TemplateAzureCliCustom";
import { GenerateAzureCliHelp } from "./TemplateAzureCliHelp";
import { GenerateNamespaceInit } from "./TemplateAzureCliNamespaceInit";
import { GenerateAzureCliParams } from "./TemplateAzureCliParams";
import { GenerateAzureCliTestPrepare } from "./TemplateAzureCliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./TemplateAzureCliTestScenario";
import { GenerateAzureCliValidators } from "./TemplateAzureCliValidators";

export class AzExtensionIncrementalGenerator extends AzGeneratorBase {

    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.path = "azext_" + this.model.Extension_NameUnderscored + "/";
    }

    public generateAll(): void {
        this.files[this.path + "generated/_params.py"] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[this.path + "generated/commands.py"] = GenerateAzureCliCommands(this.model);
        this.files[this.path + "generated/custom.py"] = GenerateAzureCliCustom(this.model);
        this.files[this.path + "generated/_client_factory.py"] = GenerateAzureCliClientFactory(this.model);
        this.files[this.path + "generated/_validators.py"] = GenerateAzureCliValidators(this.model);
        this.files[this.path + "generated/action.py"] = GenerateAzureCliActions(this.model);
        this.files[this.path + "generated/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.path + "tests/latest/test_" + this.model.Extension_NameUnderscored + "_scenario.py"] = GenerateAzureCliTestScenario(this.model);
        if (NeedPreparer()) {
            this.files[this.path + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(this.model);
        };

        this.files[this.path + "generated/_help.py"] = GenerateAzureCliHelp(this.model, this.isDebugMode);


        this.files[this.path + "manual/__init__.py"] = GenerateNamespaceInit(this.model);


        this.files[this.path + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(this.model);

        // Add Import and run method from generated folder (Init)
        // Add Import from generated folder (Custom)
        // Add Import from generated folder (Help)
        // Update version in HISTORY.rst
        // Update version in setup.py
    }
}
