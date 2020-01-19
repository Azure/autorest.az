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
import { GenerateAzureCliReport } from "./TemplateAzureCliReport"
import { GenerateAzureCliInit } from "./TemplateAzureCliInit"
import { GenerateAzureCliAzextMetadata } from "./TemplateAzureCliAzextMetadata"
import { GenerateAzureCliValidators } from "./TemplateAzureCliValidators"
import { GenerateAzureCliHistory } from "./TemplateAzureCliHistory"
import { GenerateAzureCliReadme } from "./TemplateAzureCliReadme"
import { GenerateAzureCliSetupCfg } from "./TemplateAzureCliSetupCfg"
import { GenerateAzureCliSetupPy } from "./TemplateAzureCliSetupPy"
import { CodeModelAz } from "./CodeModelAz";
import { Session, startSession, Host, Channel } from '@azure-tools/autorest-extension-base';

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
            files[path + "_help.py"] = GenerateAzureCliHelp(model);
            files[path + "_params.py"] = GenerateAzureCliParams(model);
            files[path + "commands.py"] = GenerateAzureCliCommands(model);
            files[path + "custom.py"] = GenerateAzureCliCustom(model);
            files[path + "_client_factory.py"] = GenerateAzureCliClientFactory(model);
            files[path + "tests/latest/test_" + model.Extension_Name + "_scenario.py"] = GenerateAzureCliTestScenario(model);   
            files[path + "__init__.py"] = GenerateAzureCliInit(model);
            files[path + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(model);
            files[path + "_validators.py"] = GenerateAzureCliValidators(model);

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
