/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import * as path from 'path';
import { PathConstants, SystemType } from "../models";
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { CliTopAction } from "./templates/CliTopAction";
import { CliTopCustom } from "./templates/CliTopCustom";
import { CliTopHelp } from "./templates/CliTopHelp";
import { CliTopInit } from "./templates/CliTopInit";
import { CliMainRequirement } from './templates/extraMain/CliMainRequirement';
import { CliMainSetupPy } from './templates/extraMain/CliMainSetupPy';
import { GenerateAzureCliActions } from "./templates/generated/CliActions";
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory";
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands";
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom";
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp";
import { GenerateAzureCliParams } from "./templates/generated/CliParams";
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators";
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario";

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
        let cliTopInitBase: string = "";
        if (fs.existsSync(path.join(this.model.CliOutputFolder, cliTopInitGenerator.relativePath))) {
            cliTopInitBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopInitGenerator.relativePath)).toString();
        }
        this.files[cliTopInitGenerator.relativePath] = await cliTopInitGenerator.incrementalGeneration(cliTopInitBase);

        // Add Import from generated folder (Custom)
        const cliTopCustomGenerator = new CliTopCustom(this.model, this.isDebugMode);
        let cliTopCustomBase: string = "";
        if (fs.existsSync(path.join(this.model.CliOutputFolder, cliTopCustomGenerator.relativePath))) {
            cliTopCustomBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopCustomGenerator.relativePath)).toString();
        }
        this.files[cliTopCustomGenerator.relativePath] = await cliTopCustomGenerator.incrementalGeneration(cliTopCustomBase);

        // Add Import from generated folder (Help)
        const cliTopHelpGenerator = new CliTopHelp(this.model, this.isDebugMode);
        let cliTopHelpBase: string = "";
        if (fs.existsSync(path.join(this.model.CliOutputFolder, cliTopHelpGenerator.relativePath))) {
            cliTopHelpBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopHelpGenerator.relativePath)).toString();
        }
        this.files[cliTopHelpGenerator.relativePath] = await cliTopHelpGenerator.incrementalGeneration(cliTopHelpBase);

        // Add Import from generated folder (Action)
        const cliTopActionGenerator = new CliTopAction(this.model, this.isDebugMode);
        let cliTopActionBase: string = "";
        const relativePathOldVersion = cliTopActionGenerator.relativePath.replace(PathConstants.actionFile, PathConstants.actionFileOldVersion);
        if (fs.existsSync(path.join(this.model.CliOutputFolder, relativePathOldVersion))) {
            cliTopActionBase = fs.readFileSync(path.join(this.model.CliOutputFolder, relativePathOldVersion)).toString();
            cliTopActionGenerator.relativePath = relativePathOldVersion
        }
        else if (fs.existsSync(path.join(this.model.CliOutputFolder, cliTopActionGenerator.relativePath))) {
            cliTopActionBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopActionGenerator.relativePath)).toString();
        }
        this.files[cliTopActionGenerator.relativePath] = await cliTopActionGenerator.incrementalGeneration(cliTopActionBase);

        // update sdk version in requirements and setuppy
        const cliMainSetup = new CliMainSetupPy(this.model, this.isDebugMode);
        this.files[cliMainSetup.relativePath] = await cliMainSetup.incrementalGeneration(null);

        const cliRequirement = new CliMainRequirement(this.model, this.isDebugMode);
        for (let sys of [SystemType.Darwin, SystemType.Linux, SystemType.windows]) {
            cliRequirement.relativePath = path.join(this.model.AzureCliFolder, "/src/azure-cli/requirements.py3." + sys + ".txt");
            this.files[cliRequirement.relativePath] = await cliRequirement.incrementalGeneration(null);
        }
    }
}
