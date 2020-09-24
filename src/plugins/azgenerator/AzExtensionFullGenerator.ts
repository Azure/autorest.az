/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { CliReport } from "./templates/CliReport";
import { CliTopAction } from "./templates/CliTopAction";
import { CliTopCustom } from "./templates/CliTopCustom";
import { CliTopInit } from "./templates/CliTopInit";
import { GenerateAzureCliHistory } from "./templates/extraExt/CliExtHistory";
import { CliTopMetadata } from "./templates/extraExt/CliExtMetadata";
import { CliExtReadme } from "./templates/extraExt/CliExtReadme";
import { GenerateAzureCliSetupCfg } from "./templates/extraExt/CliExtSetupCfg";
import { CliExtSetupPy } from "./templates/extraExt/CliExtSetupPy";
import { GenerateAzureCliActions } from "./templates/generated/CliActions";
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory";
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands";
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom";
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp";
import { GenerateAzureCliParams } from "./templates/generated/CliParams";
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators";
import { GenerateAzureCliTestInit } from "./templates/tests/CliTestInit";
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario";

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
        if (NeedPreparer()) {
            this.files[this.azDirectory + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(this.model);
        };
        this.files[this.azDirectory + "tests/latest/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.azDirectory + "generated/_help.py"] = GenerateAzureCliHelp(this.model, this.isDebugMode);


        this.files[this.azDirectory + "manual/__init__.py"] = GenerateNamespaceInit(this.model);

        if (this.model.SDK_NeedSDK) {
            this.files[this.azDirectory + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(this.model);
        }

        this.files[this.azDirectory + "action.py"] = await new CliTopAction(this.model, this.isDebugMode).fullGeneration();
        this.files[this.azDirectory + "custom.py"] = await new CliTopCustom(this.model, this.isDebugMode).fullGeneration();
        this.files[this.azDirectory + "__init__.py"] = await new CliTopInit(this.model, this.isDebugMode).fullGeneration();
        this.files[this.azDirectory + "azext_metadata.json"] = await new CliTopMetadata(this.model, this.isDebugMode).fullGeneration();
        this.files["report.md"] = await new CliReport(this.model, this.isDebugMode).fullGeneration();
        this.files["HISTORY.rst"] = GenerateAzureCliHistory(this.model);

        await this.generateFullSingleAndAddtoOutput(new CliExtReadme(this.model, this.isDebugMode), false);
        this.files["setup.cfg"] = GenerateAzureCliSetupCfg(this.model);
        await this.generateFullSingleAndAddtoOutput(new CliExtSetupPy(this.model, this.isDebugMode));
        
    }
}