/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./TemplateAzureCliActions";
import { GenerateAzureCliAzextMetadata } from "./TemplateAzureCliAzextMetadata";
import { GenerateAzureCliClientFactory } from "./TemplateAzureCliClientFactory";
import { GenerateAzureCliCommands } from "./TemplateAzureCliCommands";
import { GenerateAzureCliCustom } from "./TemplateAzureCliCustom";
import { GenerateAzureCliHelp } from "./TemplateAzureCliHelp";
import { GenerateAzureCliHistory } from "./TemplateAzureCliHistory";
import { GenerateAzureCliInit } from "./TemplateAzureCliInit";
import { GenerateNamespaceInit } from "./TemplateAzureCliNamespaceInit";
import { GenerateAzureCliParams } from "./TemplateAzureCliParams";
import { GenerateAzureCliReadme } from "./TemplateAzureCliReadme";
import { GenerateAzureCliReport } from "./TemplateAzureCliReport";
import { GenerateAzureCliSetupCfg } from "./TemplateAzureCliSetupCfg";
import { GenerateAzureCliSetupPy } from "./TemplateAzureCliSetupPy";
import { GenerateAzureCliTestInit } from "./TemplateAzureCliTestInit";
import { GenerateAzureCliTestPrepare } from "./TemplateAzureCliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./TemplateAzureCliTestScenario";
import { GenerateTopLevelImport } from "./TemplateAzureCliTopLevelImport";
import { GenerateAzureCliValidators } from "./TemplateAzureCliValidators";


export class AzExtensionFullGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.path = "azext_" + this.model.Extension_NameUnderscored + "/";
    }


    public async generateAll() {

        this.files[this.path + "generated/_params.py"] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[this.path + "generated/commands.py"] = GenerateAzureCliCommands(this.model);
        this.files[this.path + "generated/custom.py"] = GenerateAzureCliCustom(this.model);
        this.files[this.path + "generated/_client_factory.py"] = GenerateAzureCliClientFactory(this.model);
        this.files[this.path + "generated/_validators.py"] = GenerateAzureCliValidators(this.model);
        this.files[this.path + "generated/action.py"] = GenerateAzureCliActions(this.model);
        this.files[this.path + "generated/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.path + "tests/__init__.py"] = GenerateAzureCliTestInit(this.model);
        this.files[this.path + "tests/latest/test_" + this.model.Extension_NameUnderscored + "_scenario.py"] = GenerateAzureCliTestScenario(this.model);
        if (NeedPreparer()) {
            this.files[this.path + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(this.model);
        };
        this.files[this.path + "tests/latest/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.path + "generated/_help.py"] = GenerateAzureCliHelp(this.model, this.isDebugMode);


        this.files[this.path + "manual/__init__.py"] = GenerateNamespaceInit(this.model);


        this.files[this.path + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.path + "action.py"] = GenerateTopLevelImport(this.model, "action");
        this.files[this.path + "custom.py"] = GenerateTopLevelImport(this.model, "custom");
        this.files[this.path + "__init__.py"] = GenerateAzureCliInit(this.model);
        this.files[this.path + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(this.model);

        this.files["report.md"] = GenerateAzureCliReport(this.model);
        this.files["HISTORY.rst"] = GenerateAzureCliHistory(this.model);
        this.files["README.md"] = GenerateAzureCliReadme(this.model);
        this.files["setup.cfg"] = GenerateAzureCliSetupCfg(this.model);
        this.files["setup.py"] = GenerateAzureCliSetupPy(this.model);
    }
}
