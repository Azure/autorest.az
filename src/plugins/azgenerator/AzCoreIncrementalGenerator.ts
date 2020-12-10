/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as fs from 'fs';
import * as path from 'path';
import { PathConstants, SystemType } from '../../utils/models';
import { AzGeneratorBase } from './AzGeneratorBase';
import { CodeModelAz } from './CodeModelAz';
import { GenerateNamespaceInit } from './templates/CliNamespaceInit';
import { CliReport } from './templates/CliReport';
import { CliTopAction } from './templates/CliTopAction';
import { CliTopCustom } from './templates/CliTopCustom';
import { CliTopHelp } from './templates/CliTopHelp';
import { CliTopInit } from './templates/CliTopInit';
import { CliMainRequirement } from './templates/extraMain/CliMainRequirement';
import { CliMainSetupPy } from './templates/extraMain/CliMainSetupPy';
import { GenerateAzureCliActions } from './templates/generated/CliActions';
import { GenerateAzureCliClientFactory } from './templates/generated/CliClientFactory';
import { GenerateAzureCliCommands } from './templates/generated/CliCommands';
import { GenerateAzureCliCustom } from './templates/generated/CliCustom';
import { GenerateAzureCliHelp } from './templates/generated/CliHelp';
import { GenerateAzureCliParams } from './templates/generated/CliParams';
import { GenerateAzureCliValidators } from './templates/generated/CliValidators';
import { CliTestInit } from './templates/tests/CliTestInit';
import { CliTestPrepare } from './templates/tests/CliTestPrepare';
import { CliTestScenario } from './templates/tests/CliTestScenario';
import { CliTestStep, NeedPreparers } from './templates/tests/CliTestStep';
import { GenerateMetaFile } from './templates/CliMeta';

export class AzCoreIncrementalGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = '';
    }

    public async generateAll(): Promise<void> {
        // generated and test folder
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.paramsFile)
        ] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[
            path.join(PathConstants.generatedFolder, PathConstants.commandsFile)
        ] = GenerateAzureCliCommands(this.model);
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
            path.join(PathConstants.generatedFolder, PathConstants.actionFile)
        ] = GenerateAzureCliActions(this.model);
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

        // Add Import and run method from generated folder (Init)
        await this.generateIncrementalSingleAndAddtoOutput(
            new CliTopInit(this.model, this.isDebugMode),
        );

        // Add Import from generated folder (Custom)
        await this.generateIncrementalSingleAndAddtoOutput(
            new CliTopCustom(this.model, this.isDebugMode),
        );

        // Add Import from generated folder (Help)
        await this.generateIncrementalSingleAndAddtoOutput(
            new CliTopHelp(this.model, this.isDebugMode),
        );

        // Add Import from generated folder (Report)
        await this.generateIncrementalSingleAndAddtoOutput(
            new CliReport(this.model, this.isDebugMode),
        );

        // Add Import from generated folder (Action)
        const cliTopActionGenerator = new CliTopAction(this.model, this.isDebugMode);
        let cliTopActionBase = '';
        const relativePathOldVersion = cliTopActionGenerator.relativePath.replace(
            PathConstants.actionFile,
            PathConstants.actionFileOldVersion,
        );
        if (fs.existsSync(path.join(this.model.azOutputFolder, relativePathOldVersion))) {
            cliTopActionBase = fs
                .readFileSync(path.join(this.model.azOutputFolder, relativePathOldVersion))
                .toString();
            cliTopActionGenerator.relativePath = relativePathOldVersion;
        } else if (
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
        await this.generateIncrementalSingleAndAddtoOutput(
            new CliMainSetupPy(this.model, this.isDebugMode),
        );

        const cliRequirement = new CliMainRequirement(this.model, this.isDebugMode);
        for (const sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
            cliRequirement.relativePath = path.join(
                this.model.AzureCliFolder,
                '/src/azure-cli/requirements.py3.' + sys + '.txt',
            );
            this.files[cliRequirement.relativePath] = await cliRequirement.incrementalGeneration(
                null,
            );
        }

        await this.generateIncrementalSingleAndAddtoOutput(
            new CliTestInit(this.model, this.isDebugMode),
        );
        await this.generateFullSingleAndAddtoOutput(
            new CliTestStep(this.model, this.isDebugMode),
            true,
            true,
        );
        for (const testGroup of this.model.Extension_TestScenario
            ? Object.getOwnPropertyNames(this.model.Extension_TestScenario)
            : []) {
            await this.generateIncrementalSingleAndAddtoOutput(
                new CliTestScenario(
                    this.model,
                    this.isDebugMode,
                    PathConstants.incTestScenarioFile(testGroup),
                    this.model.Extension_TestScenario[testGroup],
                    testGroup,
                ),
                true,
            );
        }
        let needPreparers = NeedPreparers();
        if (needPreparers.size>0) {
            await this.generateIncrementalSingleAndAddtoOutput(new CliTestPrepare(this.model, this.isDebugMode, [...needPreparers]));
        }
        GenerateMetaFile(this.model);
    }
}
