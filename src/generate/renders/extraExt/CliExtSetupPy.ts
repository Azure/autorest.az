/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import { getLatestPyPiVersion, isNullOrUndefined } from '../../../utils/helper';
import { CodeGenConstants, GenerationMode, PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import compareVersions = require('compare-versions');
import * as path from 'path';

export class CliExtSetupPy extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = PathConstants.setupPyFile;
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.setupPyFile + PathConstants.njkFileExtension,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliSetupPy(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length === 0) {
            return null;
        } else {
            const existingMode: GenerationMode = HeaderGenerator.GetCliGenerationMode(base);
            if (existingMode === GenerationMode.Full) {
                throw new Error(
                    'GenerationMode Error: Should not set Incremental mode on existing Full generation RP.',
                );
            } else {
                const rst = compareVersions(CodeGenConstants.minCliCoreVersion, '2.3.1');
                if (rst === 0 || rst === 1) {
                    const baseSplit: string[] = base.split(EOL);
                    const headerGenerator: HeaderGenerator = new HeaderGenerator();
                    headerGenerator.generationMode = GenerationMode.Incremental;
                    const output: string[] = headerGenerator.getLines();

                    let firstNoneCommentLineIdx = -1;
                    let skipcomment = 2;
                    for (let i = 0; i < baseSplit.length; ++i) {
                        if (baseSplit[i].startsWith('# ----')) {
                            skipcomment--;
                            if (skipcomment === 0) {
                                firstNoneCommentLineIdx = i;
                                break;
                            }
                        }
                    }
                    if (firstNoneCommentLineIdx !== -1) {
                        for (
                            let i: number = firstNoneCommentLineIdx + 1;
                            i < baseSplit.length;
                            ++i
                        ) {
                            if (
                                !(
                                    baseSplit[i].indexOf("'Programming Language :: Python :: 2',") >
                                        -1 ||
                                    baseSplit[i].indexOf(
                                        "'Programming Language :: Python :: 2.7',",
                                    ) > -1
                                )
                            ) {
                                output.push(baseSplit[i]);
                            }
                        }
                    }
                    return output;
                }
            }
        }
    }

    private GenerateAzureCliSetupPy(model: CodeModelAz) {
        return this.render();
    }

    public async GetRenderData(model: CodeModelAz): Promise<any> {
        const { extensionHandler, configHandler } = this.model.GetHandler();
        const dependencies = [];
        if (!configHandler.SDK_NeedSDK) {
            const packageName = configHandler.GetPythonPackageName();
            const latestVersion = await getLatestPyPiVersion(packageName);
            const line = packageName + '~=' + latestVersion;
            dependencies.push(line);
        }
        let azRelativeOutputFolder = path.resolve(configHandler.azOutputFolder);
        if (!isNullOrUndefined(configHandler.AzureCliFolder)) {
            azRelativeOutputFolder = azRelativeOutputFolder.replace(
                path.join(path.resolve(configHandler.AzureCliFolder), '/'),
                '',
            );
        } else if (!isNullOrUndefined(configHandler.AzureCliExtFolder)) {
            azRelativeOutputFolder = azRelativeOutputFolder.replace(
                path.join(path.resolve(configHandler.AzureCliExtFolder), '/'),
                '',
            );
        }
        const data = {
            model: {
                AzextFolder: configHandler.AzextFolder,
                Extension_Name: extensionHandler.Extension_Name,
                azRelativeOutputFolder: azRelativeOutputFolder.replace(/\\/g, '/'),
                Extension_NameClass: extensionHandler.Extension_NameClass,
                Extension_NameUnderscored: extensionHandler.Extension_NameUnderscored,
                dependencies: dependencies,
            },
        };
        return data;
    }
}
