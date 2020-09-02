/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { GenerateAzureCliActions } from "./templates/generated/CliActions"
import { GenerateAzureCliAzextMetadata } from "./templates/topext/CliFullMetadata"
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory"
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands"
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom"
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp"
import { GenerateAzureCliHistory } from "./templates/topext/CliHistory"
import { GenerateAzureCliInit } from "./templates/topcommon/CliFullInit"
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit"
import { GenerateAzureCliParams } from "./templates/generated/CliParams"
import { GenerateAzureCliReadme } from "./templates/topext/CliReadme"
import { GenerateAzureCliReport } from "./templates/topcommon/CliReport"
import { GenerateAzureCliSetupCfg } from "./templates/topext/CliFullSetupCfg"
import { GenerateAzureCliSetupPy } from "./templates/topext/CliFullSetupPy"
import { GenerateAzureCliTestInit } from "./templates/tests/CliTestInit"
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare"
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario"
import { GenerateTopLevelImport } from "./templates/topcommon/CliTopLevelImport"
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators"
import { GenerateDocSourceJsonMap } from "./templates/topmain/CliDocSourceJsonMap"
import { GenerateRequirementTxt } from './templates/topmain/CliRequirement';
import { GenerateAzureCliMainSetUp } from "./templates/topmain/CliMainSetUp"

// [Deprecating] Try to depreacate this method. Move logic to AzGeneratorBase and AzExtensionFullGenerator class
export async function GenerateAll(model: CodeModelAz,
    generateReport: any, debug: boolean) {
    let files: any = {};

    await model.init();

    if (model.SelectFirstExtension()) {
        do {
            let pathTop = "";
            let path = "azext_" + model.Extension_NameUnderscored + "/";
            if (model.IsCliCore) {
                path = "";
            }
            
            files[path + "generated/_params.py"] = GenerateAzureCliParams(model, debug);
            files[path + "generated/commands.py"] = GenerateAzureCliCommands(model);
            files[path + "generated/custom.py"] = GenerateAzureCliCustom(model);
            files[path + "generated/_client_factory.py"] = GenerateAzureCliClientFactory(model);
            files[path + "generated/_validators.py"] = GenerateAzureCliValidators(model);
            files[path + "generated/action.py"] = GenerateAzureCliActions(model);
            files[path + "generated/__init__.py"] = GenerateNamespaceInit(model);
            files[path + "tests/__init__.py"] = GenerateAzureCliTestInit(model);
            model.GenerateTestInit();
            files[path + "tests/latest/test_" + model.Extension_NameUnderscored + "_scenario.py"] = GenerateAzureCliTestScenario(model);
            if (NeedPreparer()) files[path + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(model);
            files[path + "generated/_help.py"] = GenerateAzureCliHelp(model, debug);
            files[path + "tests/latest/__init__.py"] = GenerateNamespaceInit(model);
            if (!model.IsCliCore) {
                files[path + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(model);
                files[pathTop + "HISTORY.rst"] = GenerateAzureCliHistory(model);
                files[pathTop + "README.md"] = GenerateAzureCliReadme(model);
                files[pathTop + "setup.cfg"] = GenerateAzureCliSetupCfg(model);
                files[pathTop + "setup.py"] = GenerateAzureCliSetupPy(model);  
            } 
            
            if(!model.IsCliCore || model.SDK_NeedSDK) {
                files[path + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(model);  
            }
            files[path + "manual/__init__.py"] = GenerateNamespaceInit(model);  
            files[path + "action.py"] = GenerateTopLevelImport(model, "action");  
            files[path + "custom.py"] = GenerateTopLevelImport(model, "custom");  
            files[path + "__init__.py"] = GenerateAzureCliInit(model);


            if (generateReport) {
                files[pathTop + "report.md"] = GenerateAzureCliReport(model);
            }
            
            if (model.IsCliCore) {
                let docSourceJsonMapPath = model.AzureCliFolder + "/doc/sphinx/azhelpgen/doc_source_map.json";
                files[docSourceJsonMapPath] = GenerateDocSourceJsonMap(model, docSourceJsonMapPath);

                for(let sys of ['Darwin', 'Linux', 'windows']) {
                    let requireFilePath= model.AzureCliFolder + "/src/azure-cli/requirements.py3." + sys + ".txt";
                    files[requireFilePath] = await GenerateRequirementTxt(model, requireFilePath);
                }
                let setUpPath = model.AzureCliFolder + "src/azure-cli/setup.py"
                files[setUpPath] = await GenerateAzureCliMainSetUp(model, setUpPath);
            }
        }
        while (model.SelectNextExtension())
    }
    return files;
}