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
import { createTarget } from "../../utils/inplace"
import {join} from "path"

export class AzExtensionFullGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = "azext_" + this.model.Extension_NameUnderscored + "/";
    }

    public async generateAll(): Promise<void> {
        this.files[this.azDirectory + "generated/_params.py"] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[this.azDirectory + "generated/commands.py"] = GenerateAzureCliCommands(this.model);
        this.files[this.azDirectory + "generated/custom.py"] = GenerateAzureCliCustom(this.model);
        this.files[this.azDirectory + "generated/_client_factory.py"] = GenerateAzureCliClientFactory(this.model);
        this.files[this.azDirectory + "generated/_validators.py"] = GenerateAzureCliValidators(this.model);
        this.files[this.azDirectory + "generated/action.py"] = GenerateAzureCliActions(this.model);
        this.files[this.azDirectory + "generated/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.azDirectory + "tests/__init__.py"] = GenerateAzureCliTestInit(this.model);
        this.files[this.azDirectory + "tests/latest/test_" + this.model.Extension_NameUnderscored + "_scenario.py"] = GenerateAzureCliTestScenario(this.model);
        
        let testFile = this.azDirectory + "tests/latest/test_" + this.model.Extension_NameUnderscored + "_scenario.py";
        let testGenFile = testFile+".gen";
        let originA = createTarget(join(this.model.OutputFolder, testGenFile));
        let customizedA = createTarget(join(this.model.OutputFolder, testFile));
        this.files[testGenFile] = GenerateAzureCliTestScenario(this.model);
        let target = createTarget(this.files[testGenFile]);
        target.merge(originA, customizedA);
        this.files[testFile] = target.getContent();

        if (NeedPreparer()) {
            this.files[this.azDirectory + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(this.model);
        };
        this.files[this.azDirectory + "tests/latest/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.azDirectory + "generated/_help.py"] = GenerateAzureCliHelp(this.model, this.isDebugMode);


        this.files[this.azDirectory + "manual/__init__.py"] = GenerateNamespaceInit(this.model);


        this.files[this.azDirectory + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.azDirectory + "action.py"] = GenerateTopLevelImport(this.model, "action");
        this.files[this.azDirectory + "custom.py"] = GenerateTopLevelImport(this.model, "custom");
        this.files[this.azDirectory + "__init__.py"] = GenerateAzureCliInit(this.model);
        this.files[this.azDirectory + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(this.model);

        this.files["report.md"] = GenerateAzureCliReport(this.model);
        this.files["HISTORY.rst"] = GenerateAzureCliHistory(this.model);
        this.files["README.md"] = GenerateAzureCliReadme(this.model);
        this.files["setup.cfg"] = GenerateAzureCliSetupCfg(this.model);
        this.files["setup.py"] = GenerateAzureCliSetupPy(this.model);
    }
}
