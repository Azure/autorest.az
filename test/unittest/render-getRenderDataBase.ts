/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import * as path from 'path';
import * as fs from 'fs';
import { CodeModel } from '@azure-tools/codemodel';
import { createTestSession } from '../utils/test-helper';
import * as sourceMapSupport from 'source-map-support';
import { Entry } from '../../src/entry';
import { CodeModelCliImpl } from '../../src/generate/CodeModelAzImpl';
import * as nunjucks from 'nunjucks';

sourceMapSupport.install();

const resources = path.join(`${__dirname}`, '/../../../test/unittest/');

export class RenderDataBase {
    protected model: CodeModelCliImpl;
    async init(extensionName: string, fileName: string): Promise<void> {
        const cfg = {
            az: {
                extensions: extensionName,
            },
        };
        if (!fs.existsSync(path.join(resources, 'input', fileName))) {
            throw Error;
        }
        const session = await createTestSession<CodeModel>(cfg, path.join(resources, 'input'), [
            fileName,
        ]);

        const entry = new Entry(session);
        await entry.init();

        const model = new CodeModelCliImpl(session);
        model.GenerateTestInit();

        this.model = model;
    }

    render(tmplPath: string, data: any) {
        nunjucks.configure({ autoescape: false });
        const result = nunjucks.render(tmplPath, data);
        return result;
    }
}
