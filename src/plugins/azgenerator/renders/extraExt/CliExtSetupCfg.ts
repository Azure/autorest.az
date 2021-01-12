/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import * as path from 'path';
import * as nunjucks from 'nunjucks';

export function GenerateAzureCliSetupCfg(model: CodeModelAz): string[] {
    const tmplPath = path.join(`${__dirname}`, '../../../../templates/setup.cfg.njx');
    const output = nunjucks.render(tmplPath, {});
    return output;
}
