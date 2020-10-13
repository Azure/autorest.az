import * as path from 'path';
import { SystemType } from '../models';
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { GenerateAzureCliReport } from "./templates/CliReport";
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
import { deepCopy } from '../../utils/helper';

export class AzCoreFullGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = model.AzureCliFolder;
    }

    private getParam() {
        return { model: this.model, isDebugMode: this.isDebugMode, files: this.files };
    }

    public async generateAll() {
        let { model, isDebugMode, files } = this.getParam();
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
                //files[path.join(model.azOutputFolder, "tests/latest/test_" + model.Extension_NameUnderscored + "_scenario.py")] = GenerateAzureCliTestScenario(model);
                let config: any = deepCopy(model.Extension_TestScenario);
                let boolValue: boolean = model.ConfiguredScenario
                if(boolValue){
                    for (var ci = 0; ci < config.length; ci++) {
                        for(let [key,val] of Object.entries(config[ci])){
                            var keyName = key;
                            var value = val;
                        }
                        if(keyName == "name" || config.length == 0){
                            files[path.join(model.azOutputFolder, "tests/latest/test_" + model.Extension_NameUnderscored + "_scenario.py")] = GenerateAzureCliTestScenario(model,config);
                            break
                        }else{
                            files[path.join(model.azOutputFolder, "tests/latest/test_" + keyName + "_scenario.py")] = GenerateAzureCliTestScenario(model,value);
                        }
                    }
                }else{
                    files[path.join(model.azOutputFolder, "tests/latest/test_" + model.Extension_NameUnderscored + "_scenario.py")] = GenerateAzureCliTestScenario(model,config);
                }         
                if (NeedPreparer()) {
                    files[path.join(model.azOutputFolder, "tests/latest/preparers.py")] = GenerateAzureCliTestPrepare(model);
                }
                files[path.join(model.azOutputFolder, "generated/_help.py")] = GenerateAzureCliHelp(model, isDebugMode);
                files[path.join(model.azOutputFolder, "tests/latest/__init__.py")] = GenerateNamespaceInit(model);
                if (model.SDK_NeedSDK) {
                    files[path.join(model.azOutputFolder, "vendored_sdks/__init__.py")] = GenerateNamespaceInit(model);
                }
                files[path.join(model.azOutputFolder, "manual/__init__.py")] = GenerateNamespaceInit(model);
                await this.generateFullSingleAndAddtoOutput(new CliTopAction(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliTopCustom(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliTopInit(model, isDebugMode));
                files[path.join(model.azOutputFolder, "report.md")] = GenerateAzureCliReport(model);
                await this.generateFullSingleAndAddtoOutput(new CliMainDocSourceJsonMap(model, isDebugMode));
                let requirementGenerator = new CliMainRequirement(model, isDebugMode);
                for (let sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
                    requirementGenerator.relativePath = path.join(model.AzureCliFolder, "/src/azure-cli/requirements.py3." + sys + ".txt");
                    files[requirementGenerator.relativePath] = await requirementGenerator.fullGeneration();
                }
                await this.generateFullSingleAndAddtoOutput(new CliMainSetupPy(model, isDebugMode));
            }
            while (model.SelectNextExtension())
        }
    }
}