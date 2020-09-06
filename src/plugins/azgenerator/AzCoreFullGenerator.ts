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
import { SystemType, PathConstants } from '../models';

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
                files[path.join(model.azOutputFolder, "generated/_params.py")] = GenerateAzureCliParams(model, isDebugMode);
                files[path.join(model.azOutputFolder, "generated/commands.py")] = GenerateAzureCliCommands(model);
                files[path.join(model.azOutputFolder, "generated/custom.py")] = GenerateAzureCliCustom(model);
                files[path.join(model.azOutputFolder, "generated/_client_factory.py")] = GenerateAzureCliClientFactory(model);
                files[path.join(model.azOutputFolder, "generated/_validators.py")] = GenerateAzureCliValidators(model);
                files[path.join(model.azOutputFolder, "generated/action.py")] = GenerateAzureCliActions(model);
                files[path.join(model.azOutputFolder, "generated/__init__.py")] = GenerateNamespaceInit(model);
                files[path.join(model.azOutputFolder, "tests/__init__.py")] = GenerateAzureCliTestInit(model);
                model.GenerateTestInit();
                files[path.join(model.azOutputFolder, "tests/latest/test_" + model.Extension_NameUnderscored + "_scenario.py")] = GenerateAzureCliTestScenario(model);
                if (NeedPreparer()) files[path.join(model.azOutputFolder, "tests/latest/preparers.py")] = GenerateAzureCliTestPrepare(model);
                files[path.join(model.azOutputFolder, "generated/_help.py")] = GenerateAzureCliHelp(model, isDebugMode);
                files[path.join(model.azOutputFolder, "tests/latest/__init__.py")] = GenerateNamespaceInit(model);
                
                if(model.SDK_NeedSDK) {
                    files[path.join(model.azOutputFolder, "vendored_sdks/__init__.py")] = GenerateNamespaceInit(model);  
                }
                files[path.join(model.azOutputFolder, "manual/__init__.py")] = GenerateNamespaceInit(model);  
                files[path.join(model.azOutputFolder, "action.py")] = GenerateTopLevelImport(model, "action");  
                files[path.join(model.azOutputFolder, "custom.py")] = GenerateTopLevelImport(model, "custom");  
                files[path.join(model.azOutputFolder, "__init__.py")] = GenerateAzureCliInit(model);
    
                files[path.join(model.azOutputFolder, "report.md")] = GenerateAzureCliReport(model);
                let docSourceMapGenerator = new CliDocSourceJsonMap(model, isDebugMode);
                let docSourceJsonMapPath = path.join(model.AzureCliFolder, PathConstants.docSourceJsonFile);
                files[docSourceJsonMapPath] = await docSourceMapGenerator.fullGeneration();
                let requirementGenerator = new CliRequirement(model, isDebugMode);
                for(let sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
                    requirementGenerator.relativePath = path.join(model.AzureCliFolder, "/src/azure-cli/requirements.py3." + sys + ".txt");
                    files[requirementGenerator.relativePath] = await requirementGenerator.fullGeneration();
                }
                let setupGenerator = new CliMainSetUp(model, isDebugMode);
                let setUpPath = path.join(model.AzureCliFolder, PathConstants.mainSetUpPyFile);
                files[setUpPath] = await setupGenerator.fullGeneration();
            }
            while (model.SelectNextExtension())
        }
    }
}