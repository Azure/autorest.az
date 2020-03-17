/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"
import { HeaderGenerator } from "./Header";

export function GenerateAzureCliInit(model: CodeModelAz) : string[] {
    let header: HeaderGenerator = new HeaderGenerator();
    header.addFromImport("azure.cli.core", ["AzCommandsLoader"]);
    header.addFromImport("azext_" + model.Extension_NameUnderscored + ".generated._help", ["helps"]);
    var output: string[] = header.getLines();

    output.push("");
    output.push("");
    output.push("class " + model.Extension_NameClass + "CommandsLoader(AzCommandsLoader):");
    output.push("");
    output.push("    def __init__(self, cli_ctx=None):");
    output.push("        from azure.cli.core.commands import CliCommandType");
    output.push("        from .generated._client_factory import cf_" + model.Extension_NameUnderscored + "");
    output.push("        " + model.Extension_NameUnderscored + "_custom = CliCommandType(");
    output.push("            operations_tmpl='azext_" + model.Extension_NameUnderscored + ".custom#{}',");
    output.push("            client_factory=cf_" + model.Extension_NameUnderscored + ")");
    let pfx = "        super(" + model.Extension_NameClass + "CommandsLoader, self).__init__(";
    output.push(pfx + "cli_ctx=cli_ctx,");
    output.push(" ".repeat(pfx.length) + "custom_command_type=" + model.Extension_NameUnderscored + "_custom)");
    output.push("");
    output.push("    def load_command_table(self, args):");
    output.push("        from azext_" + model.Extension_NameUnderscored + ".generated.commands import load_command_table");
    output.push("        load_command_table(self, args)");
    output.push("        try:");
    output.push("            from azext_" + model.Extension_NameUnderscored + ".manual.commands import load_command_table as load_command_table_manual");
    output.push("            load_command_table_manual(self, args)");
    output.push("        except ImportError:");
    output.push("            pass");
    output.push("        return self.command_table");
    output.push("");
    output.push("    def load_arguments(self, command):");
    output.push("        from azext_" + model.Extension_NameUnderscored + ".generated._params import load_arguments");
    output.push("        load_arguments(self, command)");
    output.push("        try:");
    output.push("            from azext_" + model.Extension_NameUnderscored + ".manual._params import load_arguments as load_arguments_manual");
    output.push("            load_arguments_manual(self, command)");
    output.push("        except ImportError:");
    output.push("            pass");
    output.push("");
    output.push("");
    output.push("COMMAND_LOADER_CLS = " + model.Extension_NameClass + "CommandsLoader");
    output.push("");
 
    return output;
}
