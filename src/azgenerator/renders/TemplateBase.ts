/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { CodeModelAz } from '../CodeModelAz';
import * as nunjucks from 'nunjucks';

export abstract class TemplateBase {
    protected model: CodeModelAz;
    protected isDebugMode: boolean;
    public relativePath: string;
    protected tmplPath: string;

    constructor(model: CodeModelAz, isDebugMode: boolean) {
        this.model = model;
        this.isDebugMode = isDebugMode;
        this.relativePath = '';
        this.tmplPath = '';
    }

    public abstract fullGeneration(): string[];

    public abstract incrementalGeneration(base: string): string[];

    public render(): string[] {
        const output = nunjucks.render(this.tmplPath, this.GetRenderData(this.model));
        return output;
    }

    public abstract GetRenderData(model: CodeModelAz): any;
}
