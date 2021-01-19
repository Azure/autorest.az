/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as fs from 'fs';
import * as path from 'path';
import { PathConstants, SystemType } from '../utils/models';
import { AzGeneratorBase } from './AzGeneratorBase';
import { CodeModelAz } from './CodeModelAz';
import { GenerateNamespaceInit } from './renders/CliNamespaceInit';
import { CliReport } from './renders/CliReport';
import { CliTopAction } from './renders/CliTopAction';
import { CliTopCustom } from './renders/CliTopCustom';
import { CliTopHelp } from './renders/CliTopHelp';
import { CliTopInit } from './renders/CliTopInit';
import { CliMainRequirement } from './renders/extraMain/CliMainRequirement';
import { CliMainSetupPy } from './renders/extraMain/CliMainSetupPy';
import { GenerateAzureCliActions } from './renders/generated/CliActions';
import { GenerateAzureCliClientFactory } from './renders/generated/CliClientFactory';
import { GenerateAzureCliCommands } from './renders/generated/CliCommands';
import { GenerateAzureCliCustom } from './renders/generated/CliCustom';
import { GenerateAzureCliHelp } from './renders/generated/CliHelp';
import { GenerateAzureCliParams } from './renders/generated/CliParams';
import { GenerateAzureCliValidators } from './renders/generated/CliValidators';
import { CliTestInit } from './renders/tests/CliTestInit';
import { CliTestPrepare } from './renders/tests/CliTestPrepare';
import { CliTestScenario } from './renders/tests/CliTestScenario';
import { CliTestStep, NeedPreparer } from './renders/tests/CliTestStep';
import { GenerateMetaFile } from './renders/CliMeta';

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

        await this.generateIncrementalSingleAndAddtoOutput(
            new CliTestInit(this.model, this.isDebugMode),
        );
        await this.generateFullSingleAndAddtoOutput(new CliTestStep(this.model), true, true);
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
        if (NeedPreparer()) {
            await this.generateIncrementalSingleAndAddtoOutput(new CliTestPrepare(this.model));
        }
        GenerateMetaFile(this.model);
    }
}
