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
import { CliDocSourceJsonMap } from "./templates/topmain/CliDocSourceJsonMap"
import { CliRequirement } from './templates/topmain/CliRequirement';
import { CliMainSetUp } from "./templates/topmain/CliMainSetUp";
import * as path from 'path';
import { SystemType } from '../models';

export class AzCoreFullGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = model.AzureCliFolder;
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
                let docSourceMapGenerator = new CliDocSourceJsonMap(model, isDebugMode);
                let docSourceJsonMapPath = model.AzureCliFolder + "/doc/sphinx/azhelpgen/doc_source_map.json";
                files[docSourceJsonMapPath] = await docSourceMapGenerator.fullGeneration();
                let requirementGenerator = new CliRequirement(model, isDebugMode);
                for(let sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
                    let requireFilePath= model.AzureCliFolder + "/src/azure-cli/requirements.py3." + sys + ".txt";
                    files[requireFilePath] = await requirementGenerator.fullGeneration();
                }
                let setupGenerator = new CliMainSetUp(model, isDebugMode);
                let setUpPath = model.AzureCliFolder + "src/azure-cli/setup.py"
                files[setUpPath] = await setupGenerator.fullGeneration();
            }
            while (model.SelectNextExtension())
        }
    }
}