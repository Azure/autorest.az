import * as path from 'path';
import { SystemType, PathConstants } from '../models';
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
import { CliTestInit } from "./templates/tests/CliTestInit";
import { CliTestPrepare } from "./templates/tests/CliTestPrepare";
import { CliTestScenario } from "./templates/tests/CliTestScenario";
import { deepCopy } from '../../utils/helper';
import { CliTestStep, NeedPreparer } from "./templates/tests/CliTestStep"
import { GenerateMetaFile } from "./templates/CliMeta"
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
                files[path.join(model.azOutputFolder, "generated/_help.py")] = GenerateAzureCliHelp(model, isDebugMode);
                files[path.join(model.azOutputFolder, "tests/latest/__init__.py")] = GenerateNamespaceInit(model);
                if (model.SDK_NeedSDK) {
                    files[path.join(model.azOutputFolder, "vendored_sdks/__init__.py")] = GenerateNamespaceInit(model);
                }
                files[path.join(model.azOutputFolder, "manual/__init__.py")] = GenerateNamespaceInit(model);
                await this.generateFullSingleAndAddtoOutput(new CliTopAction(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliTopCustom(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliTopInit(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliReport(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliMainDocSourceJsonMap(model, isDebugMode));
                let requirementGenerator = new CliMainRequirement(model, isDebugMode);
                for (let sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
                    requirementGenerator.relativePath = path.join(model.AzureCliFolder, "/src/azure-cli/requirements.py3." + sys + ".txt");
                    files[requirementGenerator.relativePath] = await requirementGenerator.fullGeneration();
                }
                await this.generateFullSingleAndAddtoOutput(new CliMainSetupPy(model, isDebugMode));

                await this.generateFullSingleAndAddtoOutput(new CliTestInit(model, isDebugMode));
                await this.generateFullSingleAndAddtoOutput(new CliTestStep(model, isDebugMode), true, true);
                for (let testGroup of model.Extension_TestScenario? Object.getOwnPropertyNames(model.Extension_TestScenario): []) {
                    await this.generateFullSingleAndAddtoOutput(new CliTestScenario(model, isDebugMode, PathConstants.fullTestSceanrioFile(testGroup),model.Extension_TestScenario[testGroup], testGroup), true, true);
                }
                if (NeedPreparer()) {
                    await this.generateFullSingleAndAddtoOutput(new CliTestPrepare(model, isDebugMode));
                }
                GenerateMetaFile(model);
            }
            while (model.SelectNextExtension())
        }
    }
}