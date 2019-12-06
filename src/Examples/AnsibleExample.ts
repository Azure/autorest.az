/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Example } from "../Common/Example"
import { ExamplePostProcessor, ExampleType } from "../Common/ExamplePostProcessor";
import { MapModuleGroup, ModuleOption, ModuleMethod, Module } from "../Common/ModuleMap"
import * as yaml from "node-yaml";

export function GenerateExampleAnsibleRrm(model: Example, module: Module) : string[] {
    var output: string[] = [];
    var references = model.References;
    var moduleName = module.ModuleName;
    
    if (references.length > 0)
    {
        for (var ref of references)
        {
            if (!ref.startsWith("# ref##"))
            {
                output.push("- import_playbook: " + ref + ".yml");
            }
            else
            {
                output.push(ref);
            }      
        }
        output.push("");
        output.push("");
    }

    // XXX - why it's needed?
    var ignore: string[] = [];
    ignore.push("api-version");

    var parts: string[] = model.Url.split("/");
    var isLongRunning: boolean = model.IsExampleLongRunning();
    //template.push("# " + JSON.stringify(this._name));
    //template.push("# " + JSON.stringify(this._example));
    output.push("- hosts: localhost");
    output.push("  roles:");
    output.push("    - ../modules");
    output.push("  vars_files:");
    output.push("    - _vars.yml");
    output.push("  vars:");

    // add vars
    var vars = model.Variables;
    for (var v of vars)
    {
        output.push("    " + v.name + ": " + v.value);
    }

    output.push("  tasks:");
    output.push("");

///////////////////////////////////

    let pp = new ExamplePostProcessor(module);
    let processedExample = pp.ProcessExample(model, ExampleType.Ansible, true);

    var lines: string[] = yaml.dump([processedExample]).split(/\r?\n/);

    for (let l of lines)
    {
        output.push("    " + l);
    }

//////////////////////////////////

    if (model.Method == "get")
    {
        output.push("      register: output");
        output.push("    - debug:");
        output.push("        var: output");
    }
    return output;
}
