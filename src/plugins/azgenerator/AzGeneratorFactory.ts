/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzExtensionFullGenerator } from "./AzExtensionFullGenerator";
import { AzGeneratorBase } from "./AzGeneratorBase";
import { CodeModelAz } from "./CodeModelAz";

export class AzGeneratorFactory {
    static async createAzGenerator(model: CodeModelAz, isDebugMode: boolean): Promise<AzGeneratorBase> {
        await model.init();
        model.GenerateTestInit();

        return new AzExtensionFullGenerator(model, isDebugMode);
    }
}