/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import { PathConstants } from '../../utils/models';
import { GeneratorBase } from './Base';
import { CodeModelAz } from '../CodeModelAz';
import { GenerateNamespaceInit } from '../renders/CliNamespaceInit';
import { CliTopAction } from '../renders/CliTopAction';
import { CliTopCustom } from '../renders/CliTopCustom';
import { CliReport } from '../renders/CliReport';
import { CliTopInit } from '../renders/CliTopInit';
import { CliTopMetadata } from '../renders/extraExt/CliExtMetadata';
import { CliExtSetupPy } from '../renders/extraExt/CliExtSetupPy';
import { GenerateAzureCliActions } from '../renders/generated/CliActions';
import { GenerateAzureCliClientFactory } from '../renders/generated/CliClientFactory';
import { GenerateAzureCliCommands } from '../renders/generated/CliCommands';
import { GenerateAzureCliCustom } from '../renders/generated/CliCustom';
import { GenerateAzureCliHelp } from '../renders/generated/CliHelp';
import { GenerateAzureCliParams } from '../renders/generated/CliParams';
import { GenerateAzureCliValidators } from '../renders/generated/CliValidators';
import { CliTestInit } from '../renders/tests/CliTestInit';
import { CliTestPrepare } from '../renders/tests/CliTestPrepare';
import { CliTestScenario } from '../renders/tests/CliTestScenario';
import { CliTestStep, NeedPreparer } from '../renders/tests/CliTestStep';
import { GenerateMetaFile } from '../renders/CliMeta';
import { GenerateAzureCliSetupCfg } from '../renders/extraExt/CliExtSetupCfg';
import { GenerateAzureCliHistory } from '../renders/extraExt/CliExtHistory';
import { CliExtReadme } from '../renders/extraExt/CliExtReadme';

export class AzExtensionFullGenerator extends GeneratorBase {
    constructor(model: CodeModelAz, isDebugMode: boolean) {
        super(model, isDebugMode);
        this.azDirectory = model.AzextFolder;
    }

    public async generateAll(): Promise<void> {
        this.files[path.join(this.azDirectory, 'generated/_params.py')] = GenerateAzureCliParams(
            this.model,
            this.isDebugMode,
        );
        this.files[path.join(this.azDirectory, 'generated/commands.py')] = GenerateAzureCliCommands(
            this.model,
        );
        this.files[path.join(this.azDirectory, 'generated/custom.py')] = GenerateAzureCliCustom(
            this.model,
        );
        this.files[
            path.join(this.azDirectory, 'generated/_client_factory.py')
        ] = GenerateAzureCliClientFactory(this.model);
        this.files[
            path.join(this.azDirectory, 'generated/_validators.py')
        ] = GenerateAzureCliValidators(this.model);
        this.files[path.join(this.azDirectory, 'generated/action.py')] = GenerateAzureCliActions(
            this.model,
        );
        this.files[path.join(this.azDirectory, 'generated/__init__.py')] = GenerateNamespaceInit(
            this.model,
        );
        this.files[path.join(this.azDirectory, 'tests/latest/__init__.py')] = GenerateNamespaceInit(
            this.model,
        );

        this.files[path.join(this.azDirectory, 'generated/_help.py')] = GenerateAzureCliHelp(
            this.model,
            this.isDebugMode,
        );

        this.files[path.join(this.azDirectory, 'manual/__init__.py')] = GenerateNamespaceInit(
            this.model,
        );

        if (this.model.SDK_NeedSDK) {
            this.files[
                path.join(this.azDirectory, 'vendored_sdks/__init__.py')
            ] = GenerateNamespaceInit(this.model);
        }

        await this.generateFullSingleAndAddtoOutput(new CliTopAction(this.model, this.isDebugMode));
        await this.generateFullSingleAndAddtoOutput(new CliTopCustom(this.model, this.isDebugMode));
        await this.generateFullSingleAndAddtoOutput(new CliTopInit(this.model, this.isDebugMode));
        await this.generateFullSingleAndAddtoOutput(
            new CliTopMetadata(this.model, this.isDebugMode),
        );
        await this.generateFullSingleAndAddtoOutput(new CliReport(this.model, this.isDebugMode));
        this.files['HISTORY.rst'] = GenerateAzureCliHistory(this.model);
        await this.generateFullSingleAndAddtoOutput(
            new CliExtReadme(this.model, this.isDebugMode),
            false,
        );
        this.files['setup.cfg'] = GenerateAzureCliSetupCfg(this.model);
        await this.generateFullSingleAndAddtoOutput(
            new CliExtSetupPy(this.model, this.isDebugMode),
        );

        await this.generateFullSingleAndAddtoOutput(new CliTestInit(this.model, this.isDebugMode));
        await this.generateFullSingleAndAddtoOutput(
            new CliTestStep(this.model, this.isDebugMode),
            true,
            true,
        );
        for (const testGroup of this.model.Extension_TestScenario
            ? Object.getOwnPropertyNames(this.model.Extension_TestScenario)
            : []) {
            await this.generateFullSingleAndAddtoOutput(
                new CliTestScenario(
                    this.model,
                    this.isDebugMode,
                    PathConstants.fullTestSceanrioFile(testGroup),
                    this.model.Extension_TestScenario[testGroup],
                    testGroup,
                ),
                true,
                true,
            );
        }
        if (NeedPreparer()) {
            await this.generateFullSingleAndAddtoOutput(
                new CliTestPrepare(this.model, this.isDebugMode),
            );
        }
        GenerateMetaFile(this.model);
    }
}
