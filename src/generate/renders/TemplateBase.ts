/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { CodeModelAz } from '../codemodel/CodeModelAz';
import * as nunjucks from 'nunjucks';
import { AzConfiguration, CodeGenConstants } from '../../utils/models';

export abstract class TemplateBase {
    protected model: CodeModelAz;
    protected isDebugMode: boolean;
    public relativePath: string;
    protected tmplPath: string;
    public skip: boolean;

    constructor(model: CodeModelAz) {
        this.model = model;
        this.isDebugMode = AzConfiguration.getValue(CodeGenConstants.debug);
        this.relativePath = '';
        this.tmplPath = '';
        this.skip = false;
    }

    public abstract async fullGeneration(): Promise<string[]>;

    public abstract async incrementalGeneration(base: string): Promise<string[]>;

    public async render(): Promise<string[]> {
        nunjucks.configure({ autoescape: false });
        const output = nunjucks.render(this.tmplPath, await this.GetRenderData(this.model));
        return output;
    }

    public abstract async GetRenderData(model: CodeModelAz): Promise<any>;
}

export class SimpleTemplate extends TemplateBase {
    constructor(model: CodeModelAz, relativePath: string, tmplPath: string) {
        super(model);
        this.relativePath = relativePath;
        this.tmplPath = tmplPath;
    }

    public async fullGeneration(): Promise<string[]> {
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
