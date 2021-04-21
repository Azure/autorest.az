import * as path from 'path';
import { SystemType, PathConstants, AzConfiguration, CodeGenConstants } from '../../utils/models';
import { thoughtAsTrue } from '../../utils/helper';
import { GeneratorBase } from './Base';
import { CodeModelAz } from '../codemodel/CodeModelAz';
import { GenerateNamespaceInit } from '../renders/CliNamespaceInit';
import { CliReport } from '../renders/CliReport';
import { CliTopAction } from '../renders/CliTopAction';
import { CliTopCustom } from '../renders/CliTopCustom';
import { CliTopHelp } from '../renders/CliTopHelp';
import { CliTopInit } from '../renders/CliTopInit';
import { CliMainDocSourceJsonMap } from '../renders/extraMain/CliMainDocSourceJsonMap';
import { CliMainRequirement } from '../renders/extraMain/CliMainRequirement';
import { CliMainSetupPy } from '../renders/extraMain/CliMainSetupPy';
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
import { CliActions } from '../renders/generated/CliActions';

export class AzCoreFullGenerator extends GeneratorBase {
    constructor(model: CodeModelAz) {
        super(model);
    }

    private getParam() {
        return { model: this.model, isDebugMode: this.isDebugMode, files: this.files };
    }

    public async generateAll() {
        const { model, isDebugMode, files } = this.getParam();
        const { extensionHandler, configHandler, exampleHandler } = model.GetHandler();
        if (model.SelectFirstExtension()) {
            do {
                files[
                    path.join(configHandler.azOutputFolder, 'generated/_params.py')
                ] = GenerateAzureCliParams(model, isDebugMode);
                files[
                    path.join(configHandler.azOutputFolder, 'generated/custom.py')
                ] = GenerateAzureCliCustom(model);
                files[
                    path.join(configHandler.azOutputFolder, 'generated/_client_factory.py')
                ] = GenerateAzureCliClientFactory(model);
                files[
                    path.join(configHandler.azOutputFolder, 'generated/_validators.py')
                ] = GenerateAzureCliValidators(model);
                files[
                    path.join(configHandler.azOutputFolder, 'generated/__init__.py')
                ] = GenerateNamespaceInit(model);
                files[
                    path.join(configHandler.azOutputFolder, 'generated/_help.py')
                ] = GenerateAzureCliHelp(model, isDebugMode);
                files[
                    path.join(configHandler.azOutputFolder, 'tests/latest/__init__.py')
                ] = GenerateNamespaceInit(model);
                if (configHandler.SDK_NeedSDK) {
                    files[
                        path.join(configHandler.azOutputFolder, 'vendored_sdks/__init__.py')
                    ] = GenerateNamespaceInit(model);
                }
                files[
                    path.join(configHandler.azOutputFolder, 'manual/__init__.py')
                ] = GenerateNamespaceInit(model);
                await this.generateFullSingleAndAddtoOutput(new CliActions(model));
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
                        configHandler.AzureCliFolder,
                        '/src/azure-cli/requirements.py3.' + sys + '.txt',
                    );
                    files[
                        requirementGenerator.relativePath
                    ] = await requirementGenerator.fullGeneration();
                }
                await this.generateFullSingleAndAddtoOutput(new CliMainSetupPy(model));

                await this.generateFullSingleAndAddtoOutput(new CliTestInit(model));
                await this.generateFullSingleAndAddtoOutput(new CliTestStep(model), true, true);
                for (const testGroup of exampleHandler.Example_TestScenario
                    ? Object.getOwnPropertyNames(exampleHandler.Example_TestScenario)
                    : []) {
                    await this.generateFullSingleAndAddtoOutput(
                        new CliTestScenario(
                            model,
                            PathConstants.fullTestSceanrioFile(testGroup),
                            exampleHandler.Example_TestScenario[testGroup],
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
                exampleHandler
                    .GetResourcePool()
                    .generateArmTemplate(
                        files,
                        path.join(
                            configHandler.azOutputFolder,
                            PathConstants.testFolder,
                            PathConstants.latestFolder,
                        ),
                    );
                GenerateMetaFile(model);
                if (
                    thoughtAsTrue(AzConfiguration.getValue(CodeGenConstants.genCmdletTest, false))
                ) {
                    for (const boolVal of [false, true]) {
                        await this.generateFullSingleAndAddtoOutput(
                            new CliCmdletTest(this.model, boolVal),
                            true,
                            true,
                        );
                    }
                    await this.generateFullSingleAndAddtoOutput(
                        new SimpleTemplate(
                            this.model,
                            path.join(
                                configHandler.AzextFolder,
                                PathConstants.testFolder,
                                PathConstants.cmdletFolder,
                                PathConstants.conftestFile,
                            ),
                            path.join(
                                PathConstants.templateRootFolder,
                                PathConstants.testFolder,
                                PathConstants.cmdletFolder,
                                PathConstants.conftestFile + PathConstants.njxFileExtension,
                            ),
                        ),
                    );
                }
            } while (model.SelectNextExtension());
        }
    }
}
