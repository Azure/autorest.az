/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../../CodeModelAz"
import { HeaderGenerator } from "../../Header";

export function GenerateTopLevelImport(model: CodeModelAz, name: string) : string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    header.disableWildcardImport = true;
    header.disableUnusedWildcardImport = true;
    var output: string[] = header.getLines();

    output.push("");
    output.push("from .generated." + name + " import *  # noqa: F403");
    output.push("try:");
    output.push("    from .manual." + name + " import *  # noqa: F403");
    output.push("except ImportError:");
    output.push("    pass");
    output.push("");
    return output;
}
