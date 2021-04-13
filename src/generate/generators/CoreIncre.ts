/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as fs from 'fs';
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
import { CliExtSetupPy } from '../renders/extraExt/CliExtSetupPy';
import { CliCmdletTest } from '../renders/tests/CliTestCmdlet';
import { SimpleTemplate } from '../renders/TemplateBase';
import { CliActions } from '../renders/generated/CliActions';

export class AzCoreIncrementalGenerator extends GeneratorBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.azDirectory = '';
    }

    public getTemplateRenderData() {
        this.templates.push([
            path.join(PathConstants.generatedFolder, PathConstants.paramsFile),
            new CliExtSetupPy(this.model),
        ]);
    }

    public async generateAll(): Promise<void> {
        // generated and test folder
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.paramsFile)
        ] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.customFile)
        ] = GenerateAzureCliCustom(this.model);
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.clientFactoryFile)
        ] = GenerateAzureCliClientFactory(this.model);
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.validatorsFile)
        ] = GenerateAzureCliValidators(this.model);
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.initFile)
        ] = GenerateNamespaceInit(this.model);
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.helpFile)
        ] = GenerateAzureCliHelp(this.model, this.isDebugMode);

        // manual folder
        this.files[
            path.join(PathConstants.manualFolder, PathConstants.initFile)
        ] = GenerateNamespaceInit(this.model);

        // vendor sdk folder
        if (this.model.SDK_NeedSDK) {
            this.files[
                path.join(PathConstants.vendoredskdsFolder, PathConstants.initFile)
            ] = GenerateNamespaceInit(this.model);
        }

        await this.generateIncrementalSingleAndAddtoOutput(new CliActions(this.model));
        await this.generateIncrementalSingleAndAddtoOutput(new CliCommands(this.model));
        // Add Import and run method from generated folder (Init)
        await this.generateIncrementalSingleAndAddtoOutput(new CliTopInit(this.model));

        // Add Import from generated folder (Custom)
        await this.generateIncrementalSingleAndAddtoOutput(new CliTopCustom(this.model));

        // Add Import from generated folder (Help)
        await this.generateIncrementalSingleAndAddtoOutput(new CliTopHelp(this.model));

        // Add Import from generated folder (Report)
        await this.generateIncrementalSingleAndAddtoOutput(new CliReport(this.model));

        // Add Import from generated folder (Action)
        const cliTopActionGenerator = new CliTopAction(this.model);
        let cliTopActionBase = '';
        if (
            fs.existsSync(path.join(this.model.azOutputFolder, cliTopActionGenerator.relativePath))
        ) {
            cliTopActionBase = fs
                .readFileSync(
                    path.join(this.model.azOutputFolder, cliTopActionGenerator.relativePath),
                )
                .toString();
        }
        this.files[
            cliTopActionGenerator.relativePath
        ] = await cliTopActionGenerator.incrementalGeneration(cliTopActionBase);

        // update sdk version in requirements and setuppy
        await this.generateIncrementalSingleAndAddtoOutput(new CliMainSetupPy(this.model));

        const cliRequirement = new CliMainRequirement(this.model);
        for (const sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
            cliRequirement.relativePath = path.join(
                this.model.AzureCliFolder,
                '/src/azure-cli/requirements.py3.' + sys + '.txt',
            );
            this.files[cliRequirement.relativePath] = await cliRequirement.incrementalGeneration(
                null,
            );
        }

        await this.generateIncrementalSingleAndAddtoOutput(new CliTestInit(this.model));
        await this.generateIncrementalSingleAndAddtoOutput(new CliTestStep(this.model), true);
        for (const testGroup of this.model.Extension_TestScenario
            ? Object.getOwnPropertyNames(this.model.Extension_TestScenario)
            : []) {
            await this.generateIncrementalSingleAndAddtoOutput(
                new CliTestScenario(
                    this.model,
                    PathConstants.incTestScenarioFile(testGroup),
                    this.model.Extension_TestScenario[testGroup],
                    testGroup,
                ),
                true,
            );
        }
        const needPreparers = NeedPreparers();
        if (needPreparers.size > 0) {
            await this.generateIncrementalSingleAndAddtoOutput(
                new CliTestPrepare(this.model, [...needPreparers]),
                true,
            );
        }
        this.model
            .GetResourcePool()
            .generateArmTemplate(
                this.files,
                path.join(
                    this.model.azOutputFolder,
                    PathConstants.testFolder,
                    PathConstants.latestFolder,
                ),
            );
        GenerateMetaFile(this.model);
        if (thoughtAsTrue(AzConfiguration.getValue(CodeGenConstants.genCmdletTest, false))) {
            for (const boolVal of [false, true]) {
                await this.generateIncrementalSingleAndAddtoOutput(
                    new CliCmdletTest(this.model, boolVal),
                    true,
                );
            }
            await this.generateIncrementalSingleAndAddtoOutput(
                new SimpleTemplate(
                    this.model,
                    path.join(
                        this.model.AzextFolder,
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
    }
}
