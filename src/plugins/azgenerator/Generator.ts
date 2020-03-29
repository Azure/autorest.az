/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GenerateAzureCliCommands } from "./TemplateAzureCliCommands"
import { GenerateAzureCliCustom } from "./TemplateAzureCliCustom"
import { GenerateAzureCliHelp } from "./TemplateAzureCliHelp"
import { GenerateAzureCliParams} from "./TemplateAzureCliParams"
import { GenerateAzureCliClientFactory } from "./TemplateAzureCliClientFactory"
import { GenerateAzureCliTestScenario } from "./TemplateAzureCliTestScenario"
import { GenerateAzureCliTestPrepare } from "./TemplateAzureCliTestPrepare"
import { GenerateAzureCliReport } from "./TemplateAzureCliReport"
import { GenerateAzureCliInit } from "./TemplateAzureCliInit"
import { GenerateAzureCliAzextMetadata } from "./TemplateAzureCliAzextMetadata"
import { GenerateAzureCliValidators } from "./TemplateAzureCliValidators"
import { GenerateAzureCliHistory } from "./TemplateAzureCliHistory"
import { GenerateAzureCliReadme } from "./TemplateAzureCliReadme"
import { GenerateAzureCliSetupCfg } from "./TemplateAzureCliSetupCfg"
import { GenerateAzureCliSetupPy } from "./TemplateAzureCliSetupPy"
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./TemplateAzureCliActions"
import { GenerateTopLevelImport } from "./TemplateAzureCliTopLevelImport"
import { GenerateNamespaceInit } from "./TemplateAzureCliNamespaceInit"

export async function GenerateAll(model: CodeModelAz,
    generateReport: any) {
    let files: any = {};

    await model.init();

    if (model.SelectFirstExtension())
    {
        do
        {
            let pathTop = "src/" + model.Extension_Name + "/";
            let path = "src/" + model.Extension_Name + "/azext_" + model.Extension_Name.replace("-", "_") + "/";
            files[path + "generated/_params.py"] = GenerateAzureCliParams(model);
            files[path + "generated/commands.py"] = GenerateAzureCliCommands(model);
            files[path + "generated/custom.py"] = GenerateAzureCliCustom(model);
            files[path + "generated/_client_factory.py"] = GenerateAzureCliClientFactory(model);
            files[path + "generated/_validators.py"] = GenerateAzureCliValidators(model);
            files[path + "generated/action.py"] = GenerateAzureCliActions(model);
            files[path + "generated/_help.py"] = GenerateAzureCliHelp(model);
            files[path + "generated/__init__.py"] = GenerateNamespaceInit(model);  
            files[path + "tests/__init__.py"] = GenerateNamespaceInit(model);
            files[path + "tests/latest/test_" + model.Extension_Name + "_scenario.py"] = GenerateAzureCliTestScenario(model);   
            files[path + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(model);
            files[path + "tests/latest/__init__.py"] = GenerateNamespaceInit(model);  
            files[path + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(model);
            files[path + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(model);  
            files[path + "manual/__init__.py"] = GenerateNamespaceInit(model);  
            files[path + "action.py"] = GenerateTopLevelImport(model, "action");  
            files[path + "custom.py"] = GenerateTopLevelImport(model, "custom");  
            files[path + "__init__.py"] = GenerateAzureCliInit(model);
            files[pathTop + "HISTORY.rst"] = GenerateAzureCliHistory(model);
            files[pathTop + "README.rst"] = GenerateAzureCliReadme(model);
            files[pathTop + "setup.cfg"] = GenerateAzureCliSetupCfg(model);
            files[pathTop + "setup.py"] = GenerateAzureCliSetupPy(model);  

            if (generateReport)
            {
                files[pathTop + "report.md"] = GenerateAzureCliReport(model);
            }
        }
        while (model.SelectNextExtension())
    }
    return files;
}
