/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

export function GenerateTopLevelImport(model: CodeModelAz, name: string) : string[] {
    var output: string[] = [];

    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("");
    output.push("# pylint: disable=wildcard-import");
    output.push("# pylint: disable=unused-wildcard-import");
    output.push("");
    output.push("from azext_"+ model.Extension_NameUnderscored +".generated." + name + " import *  # noqa: F403");
    output.push("try:");
    output.push("    from azext_" + model.Extension_NameUnderscored + ".manual." + name + " import *  # noqa: F403");
    output.push("except ImportError:");
    output.push("    pass");
    output.push("");
    return output;
}
