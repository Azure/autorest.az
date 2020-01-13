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

export function GenerateAll(modelCli: CodeModelAz,
    testScenario: any,
    generateReport: any,
    cliName: any): any
{
    let files: any = {};
    let pathTop = "src/" + cliName + "/";
    let path = "src/" + cliName + "/azext_" + cliName.replace("-", "_") + "/";

    files[path + "_help.py"] = GenerateAzureCliHelp(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "_params.py"] = GenerateAzureCliParams(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "commands.py"] = GenerateAzureCliCommands(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "custom.py"] = GenerateAzureCliCustom(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "_client_factory.py"] = GenerateAzureCliClientFactory(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "tests/latest/test_" + cliName + "_scenario.py"] = GenerateAzureCliTestScenario(modelCli, testScenario);   
    modelCli.SelectFirstExtension();
    files[path + "__init__.py"] = GenerateAzureCliInit(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "azext_metadata.json"] = GenerateAzureCliAzextMetadata(modelCli);
    modelCli.SelectFirstExtension();
    files[path + "_validators.py"] = GenerateAzureCliValidators(modelCli);

    files[pathTop + "HISTORY.rst"] = GenerateAzureCliHistory(modelCli);
    files[pathTop + "README.rst"] = GenerateAzureCliReadme(modelCli);
    files[pathTop + "setup.cfg"] = GenerateAzureCliSetupCfg(modelCli);
    files[pathTop + "setup.py"] = GenerateAzureCliSetupPy(modelCli);  

    if (generateReport)
    {
        modelCli.SelectFirstExtension();
        files[pathTop + "report.md"] = GenerateAzureCliReport(modelCli);
    }

    return files;
}
