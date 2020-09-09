/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GenerationMode } from "../models";
import { AzExtensionFullGenerator } from "./AzExtensionFullGenerator";
import { AzCoreFullGenerator } from "./AzCoreFullGenerator";
import { AzExtensionIncrementalGenerator } from "./AzExtensionIncrementalGenerator";
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelCliImpl } from "./CodeModelAzImpl";

export class AzGeneratorFactory {
    static async createAzGenerator(model: CodeModelCliImpl, isDebugMode: boolean): Promise<AzGeneratorBase> {
        await model.init();
        model.GenerateTestInit();

        if (model.CliGenerationMode == GenerationMode.Full) {
            if (model.IsCliCore) {
                return new AzCoreFullGenerator(model, isDebugMode);
            }
            return new AzExtensionFullGenerator(model, isDebugMode);
        }
        else {
            return new AzExtensionIncrementalGenerator(model, isDebugMode);
        }
    }
}