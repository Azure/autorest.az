/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MapModuleGroup, ModuleOption, ModuleMethod, Module, EnumValue, ModuleOptionKind } from "../Common/ModuleMap"
import { LogCallback } from "../index"
import { Adjustments } from "../Common/Adjustments";
import { ToSnakeCase, Capitalize, Uncapitalize, ToGoCase } from "../Common/Helpers";

export class MapFlattenerObsolete
{
    public constructor (map: MapModuleGroup,
                        flatten: Adjustments,
                        flattenAll: boolean,
                        optionOverride: any,
                        cmdOverride: any,
                        log: LogCallback)
    {
        this._map = map;
        this._flatten = flatten;
        this._flattenAll = flattenAll;
        this._optionOverride = optionOverride;
        this._cmdOverride = cmdOverride;
        this._log = log;
    }

    public Transform(): void
    {
        for (let module of this._map.Modules)
        {
            for (let regex in this._cmdOverride)
            {
                let regexp = new RegExp(regex);

                if (module.CommandGroup.match(regexp))
                {
                    module.CommandGroup = this._cmdOverride[regex].replace("*", this._map.CliName);
                }
            }

            // process top level options, right now it will rename xxx_name -> name
            this.ProcessTopLevelOptions(module.Options);

            // here we perform flattening of the option according to current rules
            module.Options = this.FlattenOptions(module.Options, "/");

            // apply options override as a final step
            this.ApplyOptionOverride(module.Options);
        }
    }

    private ProcessTopLevelOptions(options: ModuleOption[]): void
    {
        for (let i = options.length - 1; i >= 0; i--)
        {
            let option = options[i];

            // OPTIONS ARE NOT SORTED CORRECTLY
            // SO THERE'S option.NameAnsible != "resource_group_name" hack here
            if (option.Kind == ModuleOptionKind.MODULE_OPTION_PATH && option.NameAnsible != "resource_group_name" && option.NameAnsible.endsWith('_name'))
            {
                option.NameAnsible = "name";
                option.NameTerraform = "name";
                break;
            }
            else
            {
            }

            // if the option is already part of the resource URL and doesn't end with name, don't rename
            //if (option.IdPortion != null && option.IdPortion != "")
            //    break;
        }

        for (let option of options)
        {
            if (option.NameAnsible == "resource_group_name")
            {
                option.NameAnsible = "resource_group";
                option.NameGoSdk = "ResourceGroup";
                option.NameTerraform = "resourceGroup";
            }

            if (option.Type != "dict")
                option.Updatable = false;
        }
    }

    private FlattenOptions(options: ModuleOption[], path: string): ModuleOption[]
    {
        for (let i = options.length - 1; i >= 0; i--)
        {
            let option = options[i];
            let suboptions = option.SubOptions;

            if (suboptions != null)
            {
                let optionPath = (((path != "/") ? path : "") + "/" + option.NameSwagger).toLowerCase();
                //if (this._debug) this._log("flattener: checking path - " + optionPath);
                suboptions = this.FlattenOptions(suboptions, ((path != "/") ? path : "") + "/" + option.NameSwagger);

                let flatten: any = this._flatten.GetFlatten(optionPath);

                if (flatten == "" && this._flattenAll)
                {
                    if (!(option.IsList && option.SubOptions.length > 1))
                    {
                        flatten = "*/*";
                    }
                }

                if (flatten != "")
                {
                    // all the suboptions of current option will be attached at the end
                    this._log("flattener: found path - " + optionPath);

                    if (flatten == "hide")
                    {
                        // just completely remove this option....
                        options = [].concat(options.slice(0, i), options.slice(i + 1));
                    }
                    else if (flatten == "*/*")
                    {
                        for (let suboption of suboptions)
                        {
                            let dispositionRest: string = option.DispositionRest.replace("*", option.NameSwagger); // + "/" + suboption.DispositionRest.replace("*", suboption.NameSwagger);
                            let dispositionSdk: string = option.DispositionSdk.replace("*", option.NamePythonSdk); // + "/" + suboption.DispositionSdk.replace("*", suboption.NamePythonSdk);
                            
                            if (path == "/")
                            {
                                dispositionRest += option.NameSwagger;

                                if (option.NamePythonSdk != "properties")
                                {
                                    dispositionSdk += option.NamePythonSdk;
                                }
                                else
                                {
                                    dispositionSdk = "";
                                }
                            }

                            dispositionRest += "/" + suboption.DispositionRest;
                            dispositionSdk +=  "/" + suboption.DispositionSdk;
                            
                            //if (path == "/")
                            //{
                            //    dispositionRest = "/properties/" + dispositionRest;
                            //    dispositionSdk = "/" + dispositionSdk;
                            //}
                            //else
                            //{
                            //    dispositionRest = "properties/" + dispositionRest;
                            //}
                            suboption.DispositionRest = dispositionRest;
                            suboption.DispositionSdk = dispositionSdk;

                            if (path != "/")
                            {
                                suboption.NameAnsible = option.NameAnsible + "_" + suboption.NameAnsible;
                                suboption.NameTerraform = option.NameTerraform + suboption.NameAnsible;
                            }

                            // this happens only when parent is list of dictionaries containing single element
                            // so the element becomes a list itself
                            // we also inherit documentation from parent as it's usually more relevant
                            if (option.IsList)
                            {
                                suboption.IsList = option.IsList;
                                suboption.Documentation = option.Documentation;
                            }
                        }
    
                        options = options.slice(0, i + 1).concat(suboptions, options.slice(i + 1));
                        options[i].SubOptions = [];
                        options[i].Hidden = true;
                    }
                    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    // Everything below is going to be obsolete
                    //
                    //
                    else
                    {
                        for (let suboption of suboptions)
                        {
                            let dispositionRest = suboption.DispositionRest;
                            let dispositionSdk = suboption.DispositionSdk;

                            if (flatten == "/*")
                            {
                                dispositionRest = option.NameSwagger + "/" + dispositionRest;
                                dispositionSdk = option.NamePythonSdk + "/" + dispositionSdk;
                            }
                            else if (flatten.endsWith("/"))
                            {
                                let dispositionParts = dispositionRest.split('/');
                                if (dispositionParts[0] == '*') dispositionParts[0] = suboption.NameSwagger;
                                dispositionRest = dispositionParts.join('/');

                                dispositionParts = dispositionSdk.split('/');
                                if (dispositionParts[0] == '*') dispositionParts[0] = suboption.NamePythonSdk;
                                dispositionSdk = dispositionParts.join('/');

                                let newName: string = flatten.split("/")[0];

                                dispositionRest = (option.DispositionRest == "/" ? "/" : "") + option.NameSwagger + "/" + dispositionRest;
                                dispositionSdk = (option.DispositionSdk == "/" ? "/" : "") + option.NamePythonSdk + "/" + dispositionSdk;

                                

                                newName = newName.replace("*", Capitalize(suboption.NameSwagger));

                                suboption.NameAnsible = ToSnakeCase(newName);
                                suboption.NameSwagger = Uncapitalize(newName);
                                //suboption.NameGoSdk = newName;
                                //suboption.NamePythonSdk = option.NamePythonSdk;
                                suboption.NameTerraform = Uncapitalize(newName);
                            }
                            else if (flatten == "*/")
                            {
                                let dispositionParts = dispositionRest.split('/');
                                if (dispositionParts[0] == '*') dispositionParts[0] = suboption.NameSwagger;
                                dispositionRest = dispositionParts.join('/');

                                dispositionParts = dispositionSdk.split('/');
                                if (dispositionParts[0] == '*') dispositionParts[0] = suboption.NamePythonSdk;
                                dispositionSdk = dispositionParts.join('/');

                                dispositionRest = option.NameSwagger + "/" + dispositionRest;
                                dispositionSdk = option.NamePythonSdk + "/" + dispositionSdk;

                                suboption.NameAnsible = option.NameAnsible;
                                suboption.NameSwagger = option.NameSwagger;
                                suboption.NameGoSdk = option.NameGoSdk;
                                suboption.NamePythonSdk = option.NamePythonSdk;
                                suboption.NameTerraform = option.NameTerraform;
                            }
                            suboption.DispositionRest = dispositionRest;
                            suboption.DispositionSdk = dispositionSdk;
                        }

                        options = [].concat(options.slice(0, i + 1), suboptions, options.slice(i + 1));
                        options[i].SubOptions = [];
                        options[i].Hidden = true;
                        //this._log("REMOVING AT " + i + " FROM " + option.NameSwagger);
                    }
                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                }
                else if (option.NameSwagger == "properties")
                {
                    this._log("flattener: detected 'properties'");
                    // XXX - this si a hack for current implementation
                    for (let suboption of suboptions)
                    {
                        let dispositionRest = suboption.DispositionRest;
                        let dispositionSdk = suboption.DispositionSdk;
                        if (path == "/")
                        {
                            dispositionRest = "/properties/" + dispositionRest;
                            dispositionSdk = "/" + dispositionSdk;
                        }
                        else
                        {
                            dispositionRest = "properties/" + dispositionRest;
                        }
                        suboption.DispositionRest = dispositionRest;
                        suboption.DispositionSdk = dispositionSdk;
                    }

                    options = options.slice(0, i + 1).concat(suboptions, options.slice(i + 1));
                    options[i].SubOptions = [];
                    options[i].Hidden = true;
                }
                else
                {
                    option.SubOptions = suboptions;
                }
            }
        }

        return options;
    }

    private ApplyOptionOverride(options: ModuleOption[])
    {
        if (this._optionOverride == null)
            return;

        options.forEach(option => {
            this.ApplyOptionOverrideToSingleOption(option);

            if (option.SubOptions != null) this.ApplyOptionOverride(option.SubOptions);
        });
    }

    private ApplyOptionOverrideToSingleOption(option: ModuleOption)
    {
        for (let k in this._optionOverride)
        {
            let regexp = new RegExp(k);

            if (!option.NameAnsible.match(regexp))
                continue;
            
            let override: any = this._optionOverride[k];

            let name = override['name'];
            let readonly = override['readonly'];
            let doc = override['doc'];
            let docReplace = override['doc-replace'];
            if (name != undefined)
            {
                option.NameAnsible = name;
                option.NameTerraform = ToGoCase(name);
            }

            if (readonly != undefined)
            {
                option.IncludeInArgSpec = !readonly;
            }

            if (doc != undefined)
            {
                option.Documentation = doc;
            }

            if (docReplace != undefined)
            {
                for (let rex in docReplace)
                {
                    let regexp = new RegExp(rex);
                    option.Documentation = option.Documentation.replace(regexp, docReplace[rex]);
                }
            }
        }
    }

    private _map: MapModuleGroup = null;
    private _flatten: Adjustments;
    private _flattenAll: boolean;
    private _log: LogCallback;
    private _optionOverride: any;
    private _cmdOverride: any;
}
