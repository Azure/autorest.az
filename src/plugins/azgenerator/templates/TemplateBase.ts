/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CodeModelAz } from "../CodeModelAz";

export abstract class TemplateBase {
    protected model: CodeModelAz;
    protected isDebugMode: boolean;
    public relativePath: string;

    constructor(model: CodeModelAz, isDebugMode: boolean) {
        this.model = model;
        this.isDebugMode = isDebugMode;
        this.relativePath = "";
    }

    public abstract fullGeneration(): string[];

    public abstract incrementalGeneration(base: string): string[];

}
