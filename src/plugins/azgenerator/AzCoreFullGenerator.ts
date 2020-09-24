import * as path from 'path';
import { PathConstants, SystemType } from '../models';
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { CliReport } from "./templates/CliReport";
import { CliTopAction } from "./templates/CliTopAction";
import { CliTopCustom } from "./templates/CliTopCustom";
import { CliTopInit } from "./templates/CliTopInit";
import { CliMainDocSourceJsonMap } from "./templates/extraMain/CliMainDocSourceJsonMap";
import { CliMainRequirement } from './templates/extraMain/CliMainRequirement';
import { CliMainSetupPy } from "./templates/extraMain/CliMainSetupPy";
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
                files[path.join(model.azOutputFolder, "action.py")] = await new CliTopAction(model, isDebugMode).fullGeneration();
                files[path.join(model.azOutputFolder, "custom.py")] = await new CliTopCustom(model, isDebugMode).fullGeneration();
                files[path.join(model.azOutputFolder, "__init__.py")] = await new CliTopInit(model, isDebugMode).fullGeneration();
                files[path.join(model.azOutputFolder, "report.md")] = await new CliReport(model, isDebugMode).fullGeneration();
                let docSourceMapGenerator = new CliMainDocSourceJsonMap(model, isDebugMode);
                let docSourceJsonMapPath = path.join(model.AzureCliFolder, PathConstants.docSourceJsonFile);
                files[docSourceJsonMapPath] = await docSourceMapGenerator.fullGeneration();
                let requirementGenerator = new CliMainRequirement(model, isDebugMode);
                for(let sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
                    requirementGenerator.relativePath = path.join(model.AzureCliFolder, "/src/azure-cli/requirements.py3." + sys + ".txt");
                    files[requirementGenerator.relativePath] = await requirementGenerator.fullGeneration();
                }
                let setupGenerator = new CliMainSetupPy(model, isDebugMode);
                let setUpPath = path.join(model.AzureCliFolder, PathConstants.mainSetupPyFile);
                files[setUpPath] = await setupGenerator.fullGeneration();
            }
            while (model.SelectNextExtension())
        }
    }
}