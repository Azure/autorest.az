/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import { getLatestPyPiVersion, isNullOrUndefined } from '../../../utils/helper';
import { CodeGenConstants, GenerationMode, PathConstants } from '../../../utils/models';
import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import compareVersions = require('compare-versions');
import * as path from 'path';
import * as nunjucks from 'nunjucks';

export class CliExtSetupPy extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = PathConstants.setupPyFile;
        this.tmplPath = path.join(`${__dirname}`, '../../../../src/templates/setup.py.njx');
    }

    public fullGeneration(): string[] {
        return this.GenerateAzureCliSetupPy(this.model);
    }

    public incrementalGeneration(base: string): string[] {
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

    public GetRenderData(model: CodeModelAz): any {
        const dependencies = [];
        if (!model.SDK_NeedSDK) {
            const packageName = model.GetPythonPackageName();
            const latestVersion = getLatestPyPiVersion(packageName);
            const line = "'" + packageName + '~=' + latestVersion + "'";
            dependencies.push(line);
        }
        let azRelativeOutputFolder = path.resolve(model.azOutputFolder);
        if (!isNullOrUndefined(model.AzureCliFolder)) {
            azRelativeOutputFolder = azRelativeOutputFolder.replace(
                path.join(path.resolve(model.AzureCliFolder), '/'),
                '',
            );
        } else if (!isNullOrUndefined(model.AzureCliExtFolder)) {
            azRelativeOutputFolder = azRelativeOutputFolder.replace(
                path.join(path.resolve(model.AzureCliExtFolder), '/'),
                '',
            );
        }
        const data = {
            model: {
                AzextFolder: model.AzextFolder,
                Extension_Name: model.Extension_Name,
                azRelativeOutputFolder: azRelativeOutputFolder,
                Extension_NameClass: model.Extension_NameClass,
                Extension_NameUnderscored: model.Extension_NameUnderscored,
                dependencies: dependencies,
            },
        };
        return data;
    }
}
