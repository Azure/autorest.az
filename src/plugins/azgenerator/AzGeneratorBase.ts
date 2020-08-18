/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CodeModelAz } from "./CodeModelAz";


export abstract class AzGeneratorBase {
    model: CodeModelAz;
    files: any = {};
    path: string;
    isDebugMode: boolean;

    constructor(model: CodeModelAz, isDebugMode: boolean) {
        this.model = model;
        this.path = "";
        this.isDebugMode = isDebugMode;
    }

    public abstract async generateAll()
}