import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./templates/generated/CliActions"
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory"
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands"
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom"
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp"
import { GenerateAzureCliInit } from "./templates/topcommon/CliFullInit"
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit"
import { GenerateAzureCliParams } from "./templates/generated/CliParams"
import { GenerateAzureCliReport } from "./templates/topcommon/CliReport"
import { GenerateAzureCliTestInit } from "./templates/tests/CliTestInit"
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare"
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario"
import { GenerateTopLevelImport } from "./templates/topcommon/CliTopLevelImport"
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators"
import { GenerateDocSourceJsonMap } from "./templates/topmain/CliDocSourceJsonMap"
import { GenerateRequirementTxt } from './templates/topmain/CliRequirement';
import { GenerateAzureCliMainSetUp } from "./templates/topmain/CliMainSetUp"
import * as path from 'path';

export class AzCoreFullGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
    }

    private getParam() {
        return {model: this.model, isDebugMode: this.isDebugMode, files: this.files};
    }

    public async generateAll() {
        let {model, isDebugMode, files} = this.getParam();
        if (model.SelectFirstExtension()) {
            do {
                files[path.join("generated/_params.py")] = GenerateAzureCliParams(model, isDebugMode);
                files[path.join("generated/commands.py")] = GenerateAzureCliCommands(model);
                files[path + "generated/custom.py"] = GenerateAzureCliCustom(model);
                files[path + "generated/_client_factory.py"] = GenerateAzureCliClientFactory(model);
                files[path + "generated/_validators.py"] = GenerateAzureCliValidators(model);
                files[path + "generated/action.py"] = GenerateAzureCliActions(model);
                files[path + "generated/__init__.py"] = GenerateNamespaceInit(model);
                files[path + "tests/__init__.py"] = GenerateAzureCliTestInit(model);
                model.GenerateTestInit();
                files[path + "tests/latest/test_" + model.Extension_NameUnderscored + "_scenario.py"] = GenerateAzureCliTestScenario(model);
                if (NeedPreparer()) files[path + "tests/latest/preparers.py"] = GenerateAzureCliTestPrepare(model);
                files[path + "generated/_help.py"] = GenerateAzureCliHelp(model, isDebugMode);
                files[path + "tests/latest/__init__.py"] = GenerateNamespaceInit(model);
                
                if(model.SDK_NeedSDK) {
                    files[path + "vendored_sdks/__init__.py"] = GenerateNamespaceInit(model);  
                }
                files[path + "manual/__init__.py"] = GenerateNamespaceInit(model);  
                files[path + "action.py"] = GenerateTopLevelImport(model, "action");  
                files[path + "custom.py"] = GenerateTopLevelImport(model, "custom");  
                files[path + "__init__.py"] = GenerateAzureCliInit(model);
    
                files[path + "report.md"] = GenerateAzureCliReport(model);
                let docSourceJsonMapPath = model.AzureCliFolder + "/doc/sphinx/azhelpgen/doc_source_map.json";
                files[docSourceJsonMapPath] = GenerateDocSourceJsonMap(model, docSourceJsonMapPath);
                for(let sys of ['Darwin', 'Linux', 'windows']) {
                    let requireFilePath= model.AzureCliFolder + "/src/azure-cli/requirements.py3." + sys + ".txt";
                    files[requireFilePath] = await GenerateRequirementTxt(model, requireFilePath);
                }
                let setUpPath = model.AzureCliFolder + "src/azure-cli/setup.py"
                files[setUpPath] = await GenerateAzureCliMainSetUp(model, setUpPath);
            }
            while (model.SelectNextExtension())
        }
        return files;
    }
}