/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import * as path from 'path';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../utils/models';

export class CliExtSetupCfg extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        this.relativePath = PathConstants.setupCfgFile;
        this.tmplPath = path.join(`${__dirname}`, '../../../../src/templates/setup.cfg.njx');
    }

    public fullGeneration(): string[] {
        return this.render();
    }

    public incrementalGeneration(base: string): string[] {
        return this.fullGeneration();
    }

    public GetRenderData(model: CodeModelAz): unknown {
        return {};
    }
}
