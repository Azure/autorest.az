import * as path from 'path';
import { SystemType, PathConstants } from '../../utils/models';
import { GeneratorBase } from './Base';
import { CodeModelAz } from '../CodeModelAz';
import { GenerateNamespaceInit } from '../renders/CliNamespaceInit';
import { CliReport } from '../renders/CliReport';
import { CliTopAction } from '../renders/CliTopAction';
import { CliTopCustom } from '../renders/CliTopCustom';
import { CliTopHelp } from '../renders/CliTopHelp';
import { CliTopInit } from '../renders/CliTopInit';
import { CliMainDocSourceJsonMap } from '../renders/extraMain/CliMainDocSourceJsonMap';
import { CliMainRequirement } from '../renders/extraMain/CliMainRequirement';
import { CliMainSetupPy } from '../renders/extraMain/CliMainSetupPy';
import { GenerateAzureCliActions } from '../renders/generated/CliActions';
import { GenerateAzureCliClientFactory } from '../renders/generated/CliClientFactory';
import { CliCommands } from '../renders/generated/CliCommands';
import { GenerateAzureCliCustom } from '../renders/generated/CliCustom';
import { GenerateAzureCliHelp } from '../renders/generated/CliHelp';
import { GenerateAzureCliParams } from '../renders/generated/CliParams';
import { GenerateAzureCliValidators } from '../renders/generated/CliValidators';
import { CliTestInit } from '../renders/tests/CliTestInit';
import { CliTestPrepare } from '../renders/tests/CliTestPrepare';
import { CliTestScenario } from '../renders/tests/CliTestScenario';
import { CliTestStep, NeedPreparers } from '../renders/tests/CliTestStep';
import { GenerateMetaFile } from '../renders/CliMeta';
import { CliCmdletTest } from '../renders/tests/CliTestCmdlet';
import { SimpleTemplate } from '../renders/TemplateBase';
export class AzCoreFullGenerator extends GeneratorBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.azDirectory = model.AzureCliFolder;
    }

    private getParam() {
        return { model: this.model, isDebugMode: this.isDebugMode, files: this.files };
    }

    public async generateAll() {
        const { model, isDebugMode, files } = this.getParam();
        if (model.SelectFirstExtension()) {
            do {
                files[
                    path.join(model.azOutputFolder, 'generated/_params.py')
                ] = GenerateAzureCliParams(model, isDebugMode);
                files[
                    path.join(model.azOutputFolder, 'generated/custom.py')
                ] = GenerateAzureCliCustom(model);
                files[
                    path.join(model.azOutputFolder, 'generated/_client_factory.py')
                ] = GenerateAzureCliClientFactory(model);
                files[
                    path.join(model.azOutputFolder, 'generated/_validators.py')
                ] = GenerateAzureCliValidators(model);
                files[
                    path.join(model.azOutputFolder, 'generated/action.py')
                ] = GenerateAzureCliActions(model);
                files[
                    path.join(model.azOutputFolder, 'generated/__init__.py')
                ] = GenerateNamespaceInit(model);
                files[path.join(model.azOutputFolder, 'generated/_help.py')] = GenerateAzureCliHelp(
                    model,
                    isDebugMode,
                );
                files[
                    path.join(model.azOutputFolder, 'tests/latest/__init__.py')
                ] = GenerateNamespaceInit(model);
                if (model.SDK_NeedSDK) {
                    files[
                        path.join(model.azOutputFolder, 'vendored_sdks/__init__.py')
                    ] = GenerateNamespaceInit(model);
                }
                files[
                    path.join(model.azOutputFolder, 'manual/__init__.py')
                ] = GenerateNamespaceInit(model);
                await this.generateFullSingleAndAddtoOutput(new CliCommands(model));
                await this.generateFullSingleAndAddtoOutput(new CliTopAction(model));
                await this.generateFullSingleAndAddtoOutput(new CliTopCustom(model));
                await this.generateFullSingleAndAddtoOutput(new CliTopHelp(model));
                await this.generateFullSingleAndAddtoOutput(new CliTopInit(model));
                await this.generateFullSingleAndAddtoOutput(new CliReport(model));
                await this.generateFullSingleAndAddtoOutput(new CliMainDocSourceJsonMap(model));
                const requirementGenerator = new CliMainRequirement(model);
                for (const sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
                    requirementGenerator.relativePath = path.join(
                        model.AzureCliFolder,
                        '/src/azure-cli/requirements.py3.' + sys + '.txt',
                    );
                    files[
                        requirementGenerator.relativePath
                    ] = await requirementGenerator.fullGeneration();
                }
                await this.generateFullSingleAndAddtoOutput(new CliMainSetupPy(model));

                await this.generateFullSingleAndAddtoOutput(new CliTestInit(model));
                await this.generateFullSingleAndAddtoOutput(new CliTestStep(model), true, true);
                for (const testGroup of model.Extension_TestScenario
                    ? Object.getOwnPropertyNames(model.Extension_TestScenario)
                    : []) {
                    await this.generateFullSingleAndAddtoOutput(
                        new CliTestScenario(
                            model,
                            PathConstants.fullTestSceanrioFile(testGroup),
                            model.Extension_TestScenario[testGroup],
                            testGroup,
                        ),
                        true,
                        true,
                    );
                }
                const needPreparers = NeedPreparers();
                if (needPreparers.size > 0) {
                    await this.generateFullSingleAndAddtoOutput(
                        new CliTestPrepare(model, [...needPreparers]),
                        true,
                        true,
                    );
                }
                model
                    .GetResourcePool()
                    .generateArmTemplate(
                        files,
                        path.join(
                            model.azOutputFolder,
                            PathConstants.testFolder,
                            PathConstants.latestFolder,
                        ),
                    );
                GenerateMetaFile(model);
                await this.generateFullSingleAndAddtoOutput(
                    new CliCmdletTest(this.model, false),
                    true,
                    true,
                );
                await this.generateFullSingleAndAddtoOutput(
                    new CliCmdletTest(this.model, true),
                    true,
                    true,
                );
                await this.generateFullSingleAndAddtoOutput(
                    new SimpleTemplate(
                        this.model,
                        path.join(
                            model.AzextFolder,
                            PathConstants.testFolder,
                            PathConstants.cmdletFolder,
                            PathConstants.conftestFile,
                        ),
                        path.join(
                            PathConstants.templateRootFolder,
                            PathConstants.testFolder,
                            PathConstants.cmdletFolder,
                            PathConstants.conftestFile + '.njx',
                        ),
                    ),
                );
            } while (model.SelectNextExtension());
        }
    }
}
