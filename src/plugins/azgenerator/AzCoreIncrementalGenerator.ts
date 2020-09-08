/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import * as path from 'path';
import { PathConstants } from "../models";
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { GenerateAzureCliActions } from "./templates/generated/CliActions";
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory";
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands";
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom";
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp";
import { GenerateAzureCliParams } from "./templates/generated/CliParams";
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators";
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario";
import { CliTopCustom } from "./templates/topcommon/CliIncreCustom";
import { CliTopHelp } from "./templates/topcommon/CliIncreHelp";
import { CliTopInit } from "./templates/topcommon/CliIncreInit";
import { CliMainSetUp } from './templates/topmain/CliMainSetUp';
import { CliRequirement } from './templates/topmain/CliRequirement';

export class AzCoreIncrementalGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = "";
    }

    public async generateAll(): Promise<void> {
        // generated and test folder
        this.files[path.join(PathConstants.generatedFolder, PathConstants.paramsFile)] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[path.join(PathConstants.generatedFolder, PathConstants.commandsFile)] = GenerateAzureCliCommands(this.model);
        this.files[path.join(PathConstants.generatedFolder, PathConstants.customFile)] = GenerateAzureCliCustom(this.model);
        this.files[path.join(PathConstants.generatedFolder, PathConstants.clientFactoryFile)] = GenerateAzureCliClientFactory(this.model);
        this.files[path.join(PathConstants.generatedFolder, PathConstants.validatorsFile)] = GenerateAzureCliValidators(this.model);
        this.files[path.join(PathConstants.generatedFolder, PathConstants.actionFile)] = GenerateAzureCliActions(this.model);
        this.files[path.join(PathConstants.generatedFolder, PathConstants.initFile)] = GenerateNamespaceInit(this.model);

        this.files[path.join(PathConstants.testFolder, PathConstants.latestFolder, PathConstants.incTestScenarioFile(this.model.Extension_NameUnderscored))] = GenerateAzureCliTestScenario(this.model);
        if (NeedPreparer()) {
            this.files[path.join(PathConstants.testFolder, PathConstants.latestFolder, PathConstants.incPreparersFile)] = GenerateAzureCliTestPrepare(this.model);
        }
        this.files[path.join(PathConstants.generatedFolder, PathConstants.helpFile)] = GenerateAzureCliHelp(this.model, this.isDebugMode);

        // manual folder
        this.files[path.join(PathConstants.manualFolder, PathConstants.initFile)] = GenerateNamespaceInit(this.model);

        // vendor sdk folder
        if (this.model.SDK_NeedSDK) {
            this.files[path.join(PathConstants.vendoredskdsFolder, PathConstants.initFile)] = GenerateNamespaceInit(this.model);
        }

        // Add Import and run method from generated folder (Init)
        const cliTopInitGenerator = new CliTopInit(this.model, this.isDebugMode);
        const cliTopInitBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopInitGenerator.relativePath)).toString();
        this.files[cliTopInitGenerator.relativePath] = await cliTopInitGenerator.incrementalGeneration(cliTopInitBase);

        // Add Import from generated folder (Custom)
        const cliTopCustomGenerator = new CliTopCustom(this.model, this.isDebugMode);
        const cliTopCustomBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopCustomGenerator.relativePath)).toString();
        this.files[cliTopCustomGenerator.relativePath] = await cliTopCustomGenerator.incrementalGeneration(cliTopCustomBase);

        // Add Import from generated folder (Help)
        const cliTopHelpGenerator = new CliTopHelp(this.model, this.isDebugMode);
        const cliTopHelpBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopHelpGenerator.relativePath)).toString();
        this.files[cliTopHelpGenerator.relativePath] = await cliTopHelpGenerator.incrementalGeneration(cliTopHelpBase);

        // update sdk version in requirements and setuppy
        const cliMainSetup = new CliMainSetUp(this.model, this.isDebugMode);
        this.files[cliMainSetup.relativePath] = await cliMainSetup.incrementalGeneration(null);

        const cliRequirement = new CliRequirement(this.model, this.isDebugMode);
        this.files[cliRequirement.relativePath] = await cliRequirement.incrementalGeneration(null);

        // update sharedpy for multuple api
    }
}
