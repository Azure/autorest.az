/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import * as path from 'path';
import { PathConstants } from "../models";
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./TemplateAzureCliActions";
import { GenerateAzureCliClientFactory } from "./TemplateAzureCliClientFactory";
import { GenerateAzureCliCommands } from "./TemplateAzureCliCommands";
import { GenerateAzureCliCustom } from "./TemplateAzureCliCustom";
import { GenerateAzureCliHelp } from "./TemplateAzureCliHelp";
import { GenerateNamespaceInit } from "./TemplateAzureCliNamespaceInit";
import { GenerateAzureCliParams } from "./TemplateAzureCliParams";
import { GenerateAzureCliTestPrepare } from "./TemplateAzureCliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./TemplateAzureCliTestScenario";
import { GenerateAzureCliValidators } from "./TemplateAzureCliValidators";
import { CliTopCustom } from "./templates/CliTopCustom";
import { CliTopHelp } from "./templates/CliTopHelp";
import { CliTopInit } from "./templates/CliTopInit";
import { CliTopMetadata } from "./templates/CliTopMetadata";
import { CliSetupPy } from "./templates/CliSetupPy";

export class AzExtensionIncrementalGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = "azext_" + this.model.Extension_NameUnderscored;
    }

    public async generateAll(): Promise<void> {
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.paramsFile)] = GenerateAzureCliParams(this.model, this.isDebugMode);
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.commandsFile)] = GenerateAzureCliCommands(this.model);
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.customFile)] = GenerateAzureCliCustom(this.model);
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.clientFactoryFile)] = GenerateAzureCliClientFactory(this.model);
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.validatorsFile)] = GenerateAzureCliValidators(this.model);
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.actionFile)] = GenerateAzureCliActions(this.model);
        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.initFile)] = GenerateNamespaceInit(this.model);

        this.files[path.join(this.azDirectory, PathConstants.testFolder, PathConstants.latestFolder, "test_" + this.model.Extension_NameUnderscored + "_scenario_incrementalGenerated.py")] = GenerateAzureCliTestScenario(this.model);
        if (NeedPreparer()) {
            this.files[path.join(this.azDirectory, PathConstants.testFolder, PathConstants.latestFolder, PathConstants.preparersFile)] = GenerateAzureCliTestPrepare(this.model);
        };

        this.files[path.join(this.azDirectory, PathConstants.generatedFolder, PathConstants.helpFile)] = GenerateAzureCliHelp(this.model, this.isDebugMode);


        this.files[path.join(this.azDirectory, PathConstants.manualFolder, PathConstants.initFile)] = GenerateNamespaceInit(this.model);


        this.files[path.join(this.azDirectory, PathConstants.vendoredskdsFolder, PathConstants.initFile)] = GenerateNamespaceInit(this.model);

        // Add Import and run method from generated folder (Init)
        const cliTopInitGenerator = new CliTopInit(this.model, this.isDebugMode);
        const cliTopInitBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopInitGenerator.relativePath)).toString();
        this.files[cliTopInitGenerator.relativePath] = cliTopInitGenerator.incrementalGeneration(cliTopInitBase);

        // Add Import from generated folder (Custom)
        const cliTopCustomGenerator = new CliTopCustom(this.model, this.isDebugMode);
        const cliTopCustomBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopCustomGenerator.relativePath)).toString();
        this.files[cliTopCustomGenerator.relativePath] = cliTopCustomGenerator.incrementalGeneration(cliTopCustomBase);

        // Add Import from generated folder (Help)
        const cliTopHelpGenerator = new CliTopHelp(this.model, this.isDebugMode);
        const cliTopHelpBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopHelpGenerator.relativePath)).toString();
        this.files[cliTopHelpGenerator.relativePath] = cliTopHelpGenerator.incrementalGeneration(cliTopHelpBase);

        // Upgrade version of azext_metadata
        const cliTopMetadataGenerator = new CliTopMetadata(this.model, this.isDebugMode);
        const cliTopMetadataBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliTopMetadataGenerator.relativePath)).toString();
        this.files[cliTopMetadataGenerator.relativePath] = cliTopMetadataGenerator.incrementalGeneration(cliTopMetadataBase);

        const cliSetupPyGenerator = new CliSetupPy(this.model, this.isDebugMode);
        const cliSetupPyBase = fs.readFileSync(path.join(this.model.CliOutputFolder, cliSetupPyGenerator.relativePath)).toString();
        this.files[cliSetupPyGenerator.relativePath] = cliSetupPyGenerator.incrementalGeneration(cliSetupPyBase);

    }
}
