/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import * as nunjucks from 'nunjucks';
import * as path from 'path';

export function GenerateAzureCliHistory(model: CodeModelAz): string[] {
    const tmplPath = path.join(`${__dirname}`, '../../../../templates/HISTORY.rst.njx');
    const output = nunjucks.render(tmplPath, {});
    return output;
}
