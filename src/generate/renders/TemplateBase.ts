/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { CodeModelAz } from '../CodeModelAz';
import * as nunjucks from 'nunjucks';
import { AzConfiguration, CodeGenConstants } from '../../utils/models';

export abstract class TemplateBase {
    protected model: CodeModelAz;
    protected isDebugMode: boolean;
    public relativePath: string;
    protected tmplPath: string;

    constructor(model: CodeModelAz) {
        this.model = model;
        this.isDebugMode = AzConfiguration.getValue(CodeGenConstants.debug);
        this.relativePath = '';
        this.tmplPath = '';
    }

    public abstract fullGeneration(): string[];

    public abstract incrementalGeneration(base: string): string[];

    public render(): string[] {
        nunjucks.configure({ autoescape: false });
        const output = nunjucks.render(this.tmplPath, this.GetRenderData(this.model));
        return output;
    }

    public abstract GetRenderData(model: CodeModelAz): any;
}
