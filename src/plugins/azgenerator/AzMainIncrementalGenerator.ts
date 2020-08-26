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

export class AzMainIncrementalGenerator extends AzGeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = "azext_" + this.model.Extension_NameUnderscored;
    }

    public async generateAll(): Promise<void> {
        // generated folder

        // test folder

        // manual folder

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

        // update sdk version in requirements and setuppy

        // update sharedpy for multuple api
    }
}
