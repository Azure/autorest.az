/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { GenerationMode } from '../../utils/models';
import { AzCoreFullGenerator } from './CoreFull';
import { AzCoreIncrementalGenerator } from './CoreIncre';
import { AzExtensionFullGenerator } from './ExtensionFull';
import { AzExtensionIncrementalGenerator } from './ExtensionIncre';
import { GeneratorBase } from './Base';
import { CodeModelCliImpl } from '../CodeModelAzImpl';

export class AzGeneratorFactory {
    static createAzGenerator(model: CodeModelCliImpl): GeneratorBase {
        if (model.CliGenerationMode === GenerationMode.Full) {
            if (model.IsCliCore) {
                return new AzCoreFullGenerator(model);
            } else {
                return new AzExtensionFullGenerator(model);
            }
        } else {
            if (model.IsCliCore) {
                return new AzCoreIncrementalGenerator(model);
            } else {
                return new AzExtensionIncrementalGenerator(model);
            }
        }
    }
}
