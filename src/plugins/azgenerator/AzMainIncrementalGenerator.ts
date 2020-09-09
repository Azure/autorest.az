/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import * as path from 'path';
import { PathConstants } from "../models";
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";
import { GenerateAzureCliActions } from "./templates/generated/CliActions";
import { GenerateAzureCliClientFactory } from "./templates/generated/CliClientFactory";
import { GenerateAzureCliCommands } from "./templates/generated/CliCommands";
import { GenerateAzureCliCustom } from "./templates/generated/CliCustom";
import { GenerateAzureCliHelp } from "./templates/generated/CliHelp";
import { GenerateNamespaceInit } from "./templates/CliNamespaceInit";
import { GenerateAzureCliParams } from "./templates/generated/CliParams";
import { GenerateAzureCliTestPrepare } from "./templates/tests/CliTestPrepare";
import { GenerateAzureCliTestScenario, NeedPreparer } from "./templates/tests/CliTestScenario";
import { GenerateAzureCliValidators } from "./templates/generated/CliValidators";
import { CliTopCustom } from "./templates/topcommon/CliIncreCustom";
import { CliTopHelp } from "./templates/topcommon/CliIncreHelp";
import { CliTopInit } from "./templates/topcommon/CliIncreInit";
import { CliTopMetadata } from "./templates/topext/CliIncreMetadata";
import { CliSetupPy } from "./templates/topext/CliIncreSetupPy";

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
