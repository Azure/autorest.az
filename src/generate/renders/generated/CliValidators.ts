/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../Header';

export function GenerateAzureCliValidators(model: CodeModelAz): string[] {
    const header: HeaderGenerator = new HeaderGenerator();
    const output: string[] = header.getLines();

    output.push('');

    return output;
}
