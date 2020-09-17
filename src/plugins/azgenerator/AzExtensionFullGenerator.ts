/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./templates/generated/CliActions";
import { GenerateAzureCliAzextMetadata } from "./templates/topext/CliFullMetadata";
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory";
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands";
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom";
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp";
import { GenerateAzureCliHistory } from "./templates/topext/CliHistory";
import { GenerateAzureCliInit } from "./templates/topcommon/CliFullInit";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { GenerateAzureCliParams } from "./templates/generated/CliParams";
import { GenerateAzureCliReadme } from "./templates/topext/CliReadme";
import { GenerateAzureCliReport } from "./templates/topcommon/CliReport";
import { GenerateAzureCliSetupCfg } from "./templates/topext/CliFullSetupCfg";
import { GenerateAzureCliSetupPy } from "./templates/topext/CliFullSetupPy";
import { GenerateAzureCliTestInit } from "./templates/tests/CliTestInit";
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario";
import { GenerateTopLevelImport } from "./templates/topcommon/CliTopLevelImport";
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators";
import { inplaceGen } from "../../utils/inplace"


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
        let testFile = "tests/latest/test_" + this.model.Extension_NameUnderscored + "_scenario.py";
        this.files[this.azDirectory + testFile] = inplaceGen(this.model.OutputFolder, this.azDirectory, testFile, GenerateAzureCliTestScenario(this.model));

        if (NeedPreparer()) {
            this.files[this.azDirectory + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(this.model);
        };
        this.files[this.azDirectory + "tests/latest/__init__.py"] = GenerateNamespaceInit(this.model);

        this.files[this.azDirectory + "generated/_help.py"] = GenerateAzureCliHelp(this.model, this.isDebugMode);


        this.files[this.azDirectory + "manual/__init__.py"] = GenerateNamespaceInit(this.model);

        if (this.model.SDK_NeedSDK) {
            this.files[this.azDirectory + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(this.model);
        }

        this.files[this.azDirectory + "action.py"] = GenerateTopLevelImport(this.model, "action");
        this.files[this.azDirectory + "custom.py"] = GenerateTopLevelImport(this.model, "custom");
        this.files[this.azDirectory + "__init__.py"] = GenerateAzureCliInit(this.model);
        this.files[this.azDirectory + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(this.model);

        this.files["report.md"] = GenerateAzureCliReport(this.model);
        this.files["HISTORY.rst"] = GenerateAzureCliHistory(this.model);
        this.files["README.md"] = GenerateAzureCliReadme(this.model);
        this.files["setup.cfg"] = GenerateAzureCliSetupCfg(this.model);
        this.files["setup.py"] = await GenerateAzureCliSetupPy(this.model);
    }
}
