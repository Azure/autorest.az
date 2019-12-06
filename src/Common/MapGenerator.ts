/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MapModuleGroup, ModuleOption, ModuleMethod, Module, EnumValue, ModuleOptionPlaceholder, ModuleOptionPath, ModuleOptionBody, ModuleOptionHeader, ModuleMethodKind, ModuleOptionKind } from './ModuleMap';
import { Example } from "../Common/Example";
import { ToSnakeCase, ToCamelCase, NormalizeResourceId, Capitalize, PluralToSingular } from "../Common/Helpers";
import { LogCallback } from "../index";
import { Adjustments } from "./Adjustments";


export class MapGenerator
{
    public constructor (swagger: any,
                        adjustments: Adjustments,
                        cliName: string,
                        examples: Example[],
                        cb: LogCallback,
                        errorCb: LogCallback)
    {
        this._swagger = swagger;
        this._index = 0;
        this._examples = examples;
        this._log = cb
        this._error = errorCb;
        this._adjustments = adjustments;
        this._cliName = cliName;
    }

    public CreateMap(): MapModuleGroup
    {
        this._map = new MapModuleGroup();
        this._map.Modules = [];
        this._map.ServiceName = this._swagger['name'];
        this._map.MgmtClientName = this._swagger['name'];
        this._map.CliName = this._cliName;
        this._map.Namespace = this._swagger['namespace'].toLowerCase();

        for (var idx = 0; idx < this.Operations.length; idx++)
        {
            this._index = idx;
            this.AddModule(false);
        }

        return this._map;
    }

    private get ModuleName(): string
    {
        let multi: string = (this.Operations.length > 1) ? this.Namespace : "";

        multi = multi.split('.').pop();

        let sub: string = this.ModuleOperationNameUpper.toLowerCase();
        if (sub.startsWith(multi)) multi = "";
        let name: string = "azure_rm_" + multi + sub;

        // let's try to be smart here, as all operation names are plural so let's try to make it singular
        if (name.endsWith("ies"))
        {
            name = name.substring(0, name.length - 3) + "y";
        }
        else if (name.toLowerCase().endsWith("xes"))
        {
            name = name.substring(0, name.length - 2);
        }
        else if (name.endsWith('s'))
        {
            name = name.substring(0, name.length - 1);
        }

        return name;
    }

    private get ObjectName(): string
    {
        // XXX - handle following rules
        // Nat --> NAT
        // I P --> IP
        // Sql --> SQL

        let name: string = this.ModuleOperationNameUpper;

        if (name.endsWith("ies"))
        {
            name = name.substring(0, name.length - 3) + "y";
        }
        else if (name.toLowerCase().endsWith("xes"))
        {
            name = name.substring(0, name.length - 2);
        }
        else if (name.endsWith('s'))
        {
            name = name.substring(0, name.length - 1);
        }

        return name;
    }

    private AddModule(isInfo: boolean)
    {
        var module = new Module();
        var allMethods: any[] =  this.GetModuleOperation().methods;
        module.CommandGroup = this.GetCliCommandFromUrl(allMethods[0].url);
        module.ModuleName = this.ModuleName;
        module.ApiVersion =  this._swagger.apiVersion;
        module.Provider = this.GetProviderFromUrl(allMethods[0].url);
        module.Methods = [];

        module.Options = this.CreateTopLevelOptions(allMethods);

        let baseUrl = this.FindCrudBaseUrl();

        for (let m of allMethods)
        {
            this.AddMethod(module.Methods, m, this.ClassifyMethod(m));
        }

        module.Methods = module.Methods.sort((m1,m2) => {
            if (m1.Kind < m2.Kind) return -1;
            else if (m1.Kind > m2.Kind) return 1;
            else if (m1.Kind != ModuleMethodKind.MODULE_METHOD_LIST) return 0;
            else if (m1.Url.length > m2.Url.length) return -1;
            else if (m1.Url.length < m2.Url.length) return 1;
            else return 0;
        })

        // for response use GET response fields
        module.ResponseFields = this.GetResponseFieldsForMethod(this.ModuleGetMethod ? this.ModuleGetMethod : allMethods[0], true, true);
        this.MergeOptions(module.Options, module.ResponseFields, true);

        // do some preprocessing
        for (let rf of module.ResponseFields)
        {
            if (rf.NameSwagger == "id")
            {
                rf.IncludeInResponse = true;
            }
        }


        module.ModuleOperationName = this.ModuleOperationName;
        module.ModuleOperationNameUpper = this.ModuleOperationNameUpper;
        module.ObjectName = this.ObjectName;

        // create all examples for included methods
        let operation = this.Operations[this._index];
        module.Examples = [];
        for (var m of allMethods)
        {
            module.Examples = module.Examples.concat(this.CreateExamples(operation['$id'] , m['$id']));

            if (module.Examples.length == 0)
            {
                this._log("Missing example: " + module.ModuleName + " " + operation['name']['raw'] + " " + m['name']['raw']);
            }
        }

        if (isInfo)
        {
            // update options required parameters
            module.Options.forEach(o => {
                o.Required = true;

                module.Methods.forEach(m => {
                    if (m.Options.indexOf(o.NameSwagger) < 0)
                    {
                        o.Required = false;
                    }
                });
            });
        }

        this._map.Modules.push(module);
    }


    private FindCrudBaseUrl(): string
    {
        var allMethods: any[] =  this.GetModuleOperation().methods;
        let baseUrl: string = "";

        // find base CRUD URL it will be used to classify get methods
        for (let mi in allMethods)
        {
            let m = allMethods[mi];
            if (m.httpMethod == 'put' || m.httpMethod == 'patch' || m.httpMethod == 'delete')
            {
                baseUrl = m.url;
                break;
            }
        }

        return baseUrl;
    }

    private ClassifyMethod(m: any): ModuleMethodKind
    {
        let baseUrl: string = this.FindCrudBaseUrl();
        let kind: ModuleMethodKind = ModuleMethodKind.MODULE_METHOD_OTHER;
        if (m.url == baseUrl)
        {
            switch (m.httpMethod)
            {
            case 'put':  kind = ModuleMethodKind.MODULE_METHOD_CREATE; break;
            case 'patch': kind = ModuleMethodKind.MODULE_METHOD_UPDATE; break;
            case 'delete': kind = ModuleMethodKind.MODULE_METHOD_DELETE; break;
            case 'get': kind = ModuleMethodKind.MODULE_METHOD_GET; break;
            }
        }
        else if (baseUrl.startsWith(m.url) ||
                 baseUrl.replace("/resourceGroups/{resourceGroupName}", "").startsWith(m.url))
        {
            if (m.httpMethod == 'get')
            {
                kind = ModuleMethodKind.MODULE_METHOD_LIST;
            }
        }
        else
        {
            if (m.httpMethod == 'post')
            {
                kind = ModuleMethodKind.MODULE_METHOD_ACTION;
            }
            else if (m.httpMethod == 'get')
            {
                kind = ModuleMethodKind.MODULE_METHOD_GET_OTHER;
            }
        }

        return kind;
    }

    private AddMethod(methods: ModuleMethod[], rawMethod: any, kind: ModuleMethodKind)
    {
        var method = new ModuleMethod();
        method.Name = rawMethod.name.raw;
        method.Options = this.GetMethodOptionNames(rawMethod.name.raw, false);
        method.RequiredOptions = this.GetMethodOptionNames(rawMethod.name.raw);
        method.Url = NormalizeResourceId(rawMethod.url);
        method.HttpMethod = rawMethod.httpMethod.toLowerCase();
        method.IsAsync = (rawMethod['extensions'] != undefined && rawMethod['extensions']['x-ms-long-running-operation'] != undefined) ? rawMethod['extensions']['x-ms-long-running-operation'] : false;
        method.Documentation = rawMethod['description'];
        method.Kind = kind;

        methods.push(method);
    }

    private CreateExamples(operationId: string, methodId: string)
    {

        this._log("================================= OPERATION: " + operationId + "/" + methodId);
        let examplesList: Example[] = [];

        for (let i in this._examples)
        {
            let example = this._examples[i];

            if (this._examples[i].OperationId == operationId && this._examples[i].MethodId == methodId)
            {
                this._log("--- ADDING: " + this._examples[i].OperationName + " / " + this._examples[i].MethodName + " / " + this._examples[i].Id);
                examplesList.push(this._examples[i]);
            }
        }
        return examplesList;
    }

    private _namespace: string = "";
    public get Namespace(): string
    {
        if (this._namespace != "")
            return this._namespace;

        return this._swagger.namespace;
    }

    public set Namespace(v: string) 
    {
        v = v.split(".").pop();
        this._namespace = v;
    }

    public get ModuleOperationName(): string
    {
        return ToSnakeCase(this.GetModuleOperation().name.raw);
    }

    public get ModuleOperationNameUpper(): string
    {
        return this.GetModuleOperation().name.raw;
    }

    public get Operations(): any[]
    {
        return this._swagger.operations;
    }

    public get Name(): string
    {
        return this._swagger.name;
    }


    public GetModuleOperation(): any
    {
        return this.Operations[this._index];
    }

    public get ModuleCreateOrUpdateMethod(): any
    {
        return this.ModuleFindMethod("CreateOrUpdate");
    }

    public get ModuleCreateMethod(): any
    {
        let method: any = this.ModuleFindMethod("Create");

        if (method == null)
        {
            method = this.ModuleFindMethod("CreateSubscriptionInEnrollmentAccount");
        }

        return method;
    }

    public get ModuleUpdateMethod(): any
    {
        return this.ModuleFindMethod("Update");
    }

    private Type_EnumValues(type: any): EnumValue[]
    {
        type = this.Type_Get(type);

        if (type['$type'] != "EnumType")
            return [];

        let list: EnumValue[] = [];
        type.values.forEach(element => {
            let e: EnumValue = new EnumValue();
            e.Key = element['name'];
            e.Value = (element['value'] != undefined) ? element['value'] : element['name'];
            e.Description = element['description'];
            list.push(e);
        });
        return list;
    }

    private Type_Get(type: any): any
    {
        let newType = null;
        
        do
        {
            if (type['$ref'] != undefined)
            {
                newType = this.FindModelTypeByRef(type['$ref']);
            }
            else if (type['$type'] == "SequenceType")
            {
                newType = type['elementType'];
            }
            else
            {
                newType = null; 
            }

            if (newType != null)
            {
                type = newType;
            }
        }
        while (newType != null);

        return type;
    }

    private Type_IsList(type: any): boolean
    {
        let newType = null;
        
        do
        {
            if (type['$ref'] != undefined)
            {
                newType = this.FindModelTypeByRef(type['$ref']);
            }
            else if (type['$type'] == "SequenceType")
            {
                return true;
            }
            else
            {
                newType = null; 
            }

            if (newType != null)
            {
                type = newType;
            }
        }
        while (newType != null);

        return false;
    }

    private Type_Name(type: any): string
    {
        type = this.Type_Get(type);

        if (type['serializedName'] != undefined)
        {
            return type['serializedName'];
        }
        else if (type['name'] != undefined && type['name']['raw'] != undefined)
        {
            return type['name']['raw'];
        }
        else
        {
            return JSON.stringify(type);
        }
    }

    private Type_MappedType(type: any): string
    {
        type = this.Type_Get(type);

        if (type['$type'] == "PrimaryType")
        {
            switch (type['knownPrimaryType'])
            {
                case 'string':
                    return 'str';
                case 'int':
                    return 'number';
                case 'boolean':
                    return 'boolean';
                case 'long':
                    return 'number';
                case 'dateTime':
                    return 'datetime';
                case 'double':
                    return 'number';
                default:
                    return 'unknown-primary[' + type['knownPrimaryType'] + ']';
            }
        }
        else if (type['$type'] == "EnumType")
        {
            return this.Type_MappedType(type['underlyingType']);
        }
        else if (type['$type'] == "CompositeType")
        {
            return "dict";
        }
        else
        {
            return 'unknown[' + type['$type'] + " " + JSON.stringify(type) + ']';
        }
    }

    private Type_number_format(type: any): string
    {
        type = this.Type_Get(type);
        if (type['$type'] == "PrimaryType") {
            switch(type['knownPrimaryType']) {
                case 'int':
                case 'long':
                case 'double':
                    return type['format'];
                default:
                    return "";
            }
        }
    }


    private GetResponseFieldsForMethod(rawMethod: any, alwaysInclude: boolean, isInfo: boolean):  ModuleOption[]
    {
        if (rawMethod['returnType']['body'] == undefined)
        {
            this._log("NO RETURN TYPE: " + JSON.stringify(rawMethod['returnType']['body']));
            return [];
        }
        let ref: string = rawMethod['returnType']['body']['$ref'];
        let model = this.FindModelTypeByRef(ref);

        if (isInfo)
        {
            return this.GetModelOptions(model, 0, null, "", "", true, true, true, isInfo);
        }
        else
        {
            return this.GetModelOptions(model, 0, null, "", "", true, false, true, isInfo);
        }

    }

    private CreateTopLevelOptions(methods: any[]): ModuleOption[]
    {
        var options: any = {};

        for (var m of methods)
        {
            if (m.parameters)
            {
                for (var p of m.parameters)
                {
                    if (p.name.raw != "subscriptionId" &&
                        p.name.raw != "api-version" &&
                        (p.name.raw.indexOf('$') == -1) &&
                        (p.name.raw.indexOf('-') == -1))
                    {
                        let type: string = this.Type_MappedType(p.modelType);

                        if (type != "dict")
                        {
                            if (p.location == "header") {
                                options[p.name.raw] = new ModuleOptionHeader(p.name.raw, type, p.isRequired);
                            }
                            else
                            {
                                options[p.name.raw] = new ModuleOptionPath(p.name.raw, type, p.isRequired);
                            }
                            
                            options[p.name.raw].Documentation = this.ProcessDocumentation(p.documentation.raw);

                            options[p.name.raw].IsList = this.Type_IsList(p.modelType);
                            options[p.name.raw].NoLog = (p.name.raw.indexOf("password") >= 0);
                            options[p.name.raw].format = this.Type_number_format(p.modelType);
            
                            if (p.location == "path")
                            {
                                let splittedId: string[] = m.url.split("/{" + p.name.raw + '}');

                                if (splittedId.length == 2)
                                {
                                    options[p.name.raw].IdPortion = splittedId[0].split('/').pop();
                                }
                                else
                                {
                                    this._log("ERROR: COULDN'T EXTRACT ID PORTION");
                                    splittedId.forEach(element => {
                                        this._log(" ... part: " + element);
                                    });
                                    this._log(" ... {" + p.name.raw + "}");
                                    this._log(" ... " + m.url);
                                }
                            }
                            
                            if (p.IsRequired) options[p.Name].RequiredCount++;
                        }
                        else    
                        {
                            var bodyPlaceholder = new ModuleOptionPlaceholder(p.name.raw, type, p.IsRequired);
                                                
                            let ref = p.modelType['$ref'];
                                let submodel = this.FindModelTypeByRef(ref);
                            
                            bodyPlaceholder.IsList = this.Type_IsList(p.modelType);
                            bodyPlaceholder.TypeNameGo = this.TrimPackageName(this.Type_Name(submodel), this.Namespace.split('.').pop());
                            bodyPlaceholder.TypeNameGo = Capitalize(bodyPlaceholder.TypeNameGo);

                            let suboptions = this.GetModelOptions(submodel, 0, null, "", "", false, true, false, false);
                            bodyPlaceholder.Documentation = this.ProcessDocumentation(p.documentation.raw);
                            bodyPlaceholder.format = this.Type_number_format(p.modelType);

    
                            this._log("---------- " + p.documentation.raw)

                            options[p.name.raw] = bodyPlaceholder;
                            this._log("---------- NUMBER OF SUBOPTIONS " + suboptions.length);

                            // these suboptions should all go to the body
                            suboptions.forEach(element => {
                                this._log("---------- ADDING FLATTENED " + element.NameAnsible);
                                // XXX - just fixing it
                                element.DispositionSdk = "/"; //suboption.NameAlt;
                                element.DispositionRest = "/";
                                options[element.NameAnsible] = element;
                            });
                        }
                    }
                }
            }
        }

        var arr: ModuleOption[] = [];

        for (var key in options) {
            var value = options[key];
            arr.push(value);
        }

        return arr;
    }

    private GetModelOptions(model: any,
                            level: number,
                            sampleValue: any,
                            pathSwagger: string,
                            pathPython: string,
                            includeReadOnly: boolean,
                            includeReadWrite: boolean,
                            isResponse: boolean,
                            isInfo: boolean): ModuleOption[]
    {
        var options: ModuleOption[] = [];
        if (model != null)
        {
            // include options from base model if one exists
            if (model['baseModelType'] != undefined)
            {
                let baseModel = this.Type_Get(model['baseModelType']);
                options = this.GetModelOptions(baseModel, level, sampleValue, pathSwagger, pathPython, includeReadOnly, includeReadWrite, isResponse, isInfo);
            }

            if (model.properties)
            {
                for (var attr of model.properties)
                {
                    let flatten: boolean = false;

                    if (attr['x-ms-client-flatten'])
                    {
                        flatten = true;
                    }

                    this._log("MAP PROCESSING ATTR: " + pathSwagger + "/" + attr.name.raw)
        
                    if (this._adjustments.IsPathIncludedInResponse(pathSwagger + "/" + attr.name.raw))
                        this._log("INCLUDED IN RESPONSE");
                    if (this._adjustments.IsPathExcludedFromResponse(pathSwagger + "/" + attr.name.raw))
                        this._log("EXCLUDED FROM RESPONSE");
            
                    let includeOverride: boolean = false;
                    let excludeOverride: boolean = false;

                    // check if path wa explicitly excluded
                    if (isResponse)
                    {
                        if (isInfo)
                        {
                            if (this._adjustments.IsPathExcludedFromInfoResponse(pathSwagger + "/" + attr.name.raw))
                            {
                                excludeOverride = true;
                                this._log("INFO EXCLUDE OVERRIDE")
                            }
                            if (this._adjustments.IsPathIncludedInInfoResponse(pathSwagger + "/" + attr.name.raw))
                            {
                                includeOverride = true;
                                this._log("INFO INCLUDE OVERRIDE")
                            }
                        }
                        else
                        {
                            if (this._adjustments.IsPathExcludedFromResponse(pathSwagger + "/" + attr.name.raw))
                            {
                                excludeOverride = true;
                                this._log("RESPONSE EXCLUDE OVERRIDE")
                            }
                            if (this._adjustments.IsPathIncludedInResponse(pathSwagger + "/" + attr.name.raw))
                            {
                                includeOverride = true;
                                this._log("RESPONSE INCLUDE OVERRIDE")
                            }
                        }
                    }
                    else
                    {
                        if (this._adjustments.IsPathExcludedFromRequest(pathSwagger + "/" + attr.name.raw))
                        {
                            excludeOverride = true;
                            this._log("REQUEST EXCLUDE OVERRIDE")
                        }
                        if (this._adjustments.IsPathIncludedInRequest(pathSwagger + "/" + attr.name.raw))
                        {
                            includeOverride = true;
                            this._log("REQUEST INCLUDE OVERRIDE")
                        }
                    }

                    if (excludeOverride)
                        continue;

                    if (!includeOverride)
                    {
                        if (!includeReadOnly)
                        {
                            if (attr['isReadOnly'])
                                continue;

                            if (attr.name.raw == "provisioningState")
                                continue;
                        }

                        if (!includeReadWrite)
                        {
                            if (!attr['isReadOnly'])
                                continue;
                        }
                    }

                    if (attr.name != "tags" &&
                        !attr.name.raw.startsWith('$') &&
                        (attr.name.raw.indexOf('-') == -1))
                    {
                        let attrName: string = attr.name.raw;

                        let subSampleValue: any = null;
                        let sampleValueObject: any = sampleValue;

                        if (sampleValueObject != null)
                        {
                            for (var ppi in sampleValueObject.Properties())
                            {
                                let pp = sampleValueObject.Properties()[ppi];
                                //look += " " + pp.Name; 
                                if (pp.Name == attrName)
                                {
                                    subSampleValue = pp.Value;
                                }
                            }
                        }

                        let type = this.Type_Get(attr.modelType);
                        let typeName: string = this.Type_MappedType(attr.modelType);

                        var option = new ModuleOptionBody(attrName, typeName, attr.isRequired);
                        option.Documentation = this.ProcessDocumentation(attr.documentation.raw);
                        option.NoLog = (attr.name.raw.indexOf("password") >= 0);
                        option.IsList =  this.Type_IsList(attr.modelType);
                        option.TypeNameGo = this.TrimPackageName(this.Type_Name(attr.modelType), this.Namespace.split('.').pop());
                        option.TypeNameGo = Capitalize(option.TypeNameGo);
                        option.format = this.Type_number_format(attr.modelType);
                        option.EnumValues = this.Type_EnumValues(attr.modelType);

                        option.PathSwagger = pathSwagger + "/" + attrName
                        option.PathPython = pathPython + ((attrName != "properties") ?  ("/" + attrName) : "");
                        option.PathGo = option.PathSwagger;

                        option.SubOptions = this.GetModelOptions(type, level + 1, subSampleValue, option.PathSwagger, option.PathPython, includeReadOnly, includeReadWrite, isResponse, isInfo);
                        options.push(option);
                    }
                }
            }
        }

        return options;
    }

    private GetMethodOptionNames(methodName: string, required: boolean = true): string[]
    {
        var options: string[] = [];
        var method = this.ModuleFindMethod(methodName);

        this._log(" MODULE: " + this.ModuleName + ", METHOD: " + methodName);
        this._log( " ... " + method.url);

        // first just take option names from URL, as they need to be in that exact sequence
        // and in the swagger definition they may be not
        let parts: string[] = method.url.split("/");
        let position = 0;
        parts.forEach(element => {
            if (element.startsWith('{'))
            {
                let name: string = element.substr(1, element.length - 2);
                if (name != "subscriptionId")
                {
                    options.push(name);
                }
            }
        });


        if (method != null)
        {
            if (method.parameters)
            {
                for (var p of method.parameters)
                {
                    // path parameters are already added in first loop
                    if (p.location == "path")
                        continue;

                    if (p.name.raw != "subscriptionId" && p.name.raw != "api-version" && !p.name.raw.startsWith('$') && p.name.raw != "If-Match" && (p.isRequired == true || !required))
                    {
                        this._log(" ... parameter: " + p.name.raw + " - INCLUDED");
                        options.push(p.name.raw);
                    }
                    else
                    {
                        this._log(" ... parameter: " + p.name.raw + " - EXCLUDED");
                    }
                }
            }
        }

        return options;
    }

    private ModuleFindMethod(name: string): any
    {
        for (let m of this.GetModuleOperation().methods)
        {
            if (m.name.raw == name)
                return m;
        }

        return null;
    }

    public get ModuleGetMethod(): any
    {
        return this.ModuleFindMethod("Get");
    }

    public get ModuleDeleteMethod(): any
    {
        return this.ModuleFindMethod("Delete");
    }

    private FindModelTypeByRef(id: string): any
    {
        let model = this._modelCache[id];

        if (model != undefined)
            return model;

        for (var m of this._swagger.modelTypes)
        {
            m = this.ScanModelTypeByRef(id, m);

            if (m != undefined)
                return m;
        }

        for (var m of this._swagger.enumTypes)
        {
            m = this.ScanModelTypeByRef(id, m);

            if (m != undefined)
                return m;
        }
        return null;
    }

    private ScanModelTypeByRef(id: string, m: any): any
    {
        // add to the dictionary, so no need to scan later
        this._modelCache[m['$id']] = m;

        // is it current model?
        if (m['$id'] == id)
            return m;

        // does it contain baseModelType?
        if (m['baseModelType'] != undefined)
        {
            let found = this.ScanModelTypeByRef(id, m['baseModelType']);
            if (found != undefined)
                return found;
        }

        // does it contain baseModelType?
        if (m['elementType'] != undefined)
        {
            let found = this.ScanModelTypeByRef(id, m['elementType']);
            if (found != undefined)
                return found;
        }

        // does it have properties?
        if (m['properties'] != undefined)
        {
            for (let property of m['properties'])
            {
                let found = this.ScanModelTypeByRef(id, property['modelType']);
                if (found != undefined)
                    return found;
            }
        }

        return undefined;
    }

    private ProcessDocumentation(s: string): string
    {
        if (s == null) s = "";

        let lines: string[] = s.split(/[\r\n]+/);
        return lines.join("<br>");
        /* XXXX - fix this
        char[] a = s.ToCharArray();
        int l = a.length;
        for (var i = 0; i < l; i++)
        {
            switch (a[i])
            {
                case (char)8216:
                case (char)8217:
                    a[i] = '\'';
                    break;
                case (char)8220:
                case (char)8221:
                    a[i] = '"';
                    break;
            }
        }

        return new string(a);
        */ 
    }


    private GetProviderFromUrl(url: string): string
    {
        var parts: string[] = url.split("/");
        var idx: number = 0;

        while (idx < parts.length)
        {
            if (parts[idx].toLowerCase() == "providers")
            {
                if (idx + 1 < parts.length)
                    return parts[idx + 1];
            }
            idx++;
        }
        return "";
    }

    public TrimPackageName(value: string, packageName: string): string
    {
        // check if the package name straddles a casing boundary, if it
        // does then don't trim the name.  e.g. if value == "SubscriptionState"
        // and packageName == "subscriptions" it would be incorrect to remove
        // the package name from the value.

        let straddle: boolean = value.length > packageName.length && (value[packageName.length].toLowerCase() === value[packageName.length]);

        var originalLen = value.length;

        if (!straddle)
        {
            if (value.toLowerCase().startsWith(packageName.toLowerCase()))
            {
                value = value.substr(packageName.length);
            }
        }

        return value;
    }

    private MergeOptions(main: ModuleOption[], other: ModuleOption[], readOnly: boolean)
    {
        for (let oi: number = 0; oi < other.length; oi++)
        {
            let mo: ModuleOption = null;
            let oo: ModuleOption = other[oi];
            
            for (let mi: number = 0; mi < main.length; mi++)
            {
                if (oo.NameSwagger == main[mi].NameSwagger && oo.Kind == main[mi].Kind)
                {
                    mo = main[mi];
                    break;
                }
            }

            if (mo != null)
            {
                if (mo.SubOptions != null)
                {
                    this.MergeOptions(mo.SubOptions, oo.SubOptions, readOnly)
                }

                if (readOnly)
                {
                    mo.IncludeInResponse = true;
                }
                continue;
            }

            this._log("ADDING READONLY OPTION - ONLY IN RESPONSE: " + oo.NameSwagger);
            // if we are merging read options, new option should be included in response
            if (readOnly)
            {
                this.SetInArgaAndInResponseFlag(oo, readOnly);
            }
            main.push(oo);
        }
    }

    private SetInArgaAndInResponseFlag(option: ModuleOption, readOnly: boolean)
    {
        if (readOnly) {
            option.IncludeInResponse = true;
            option.IncludeInArgSpec = false;
        }
        if (option.SubOptions != null)
        {
            for (let oi : number = 0; oi < option.SubOptions.length; oi++)
            {
                this.SetInArgaAndInResponseFlag(option.SubOptions[oi], readOnly);
            }
        }
    }

    private GetCliCommandFromUrl(url: string): string
    {
        // use URL of any method to create CLI command path
        let command = "";
        let urlParts: string[] = url.split('/');
        let partIdx = 0;

        while (partIdx < urlParts.length)
        {
            let part: string = urlParts[partIdx];
            
            if (command == "")
            {
                if (part == "subscriptions" || urlParts[partIdx] == "resourceGroups")
                {
                    partIdx += 2;
                    continue;
                }
            }
            
            if (urlParts[partIdx] == "providers")
            {
                partIdx += 2;
                continue;
            }

            if (part == "" || part.startsWith("{"))
            {
                partIdx++;
                continue;
            }

            if (command != "")
            {
                command += " ";
                command += PluralToSingular(ToSnakeCase(part).split("_").join("-"));
            }
            else
            {
                // don't override first part with CLI Name, for instance "service" -> "apimgmt"
                command += PluralToSingular(ToSnakeCase(part).split("_").join("-"));
            }

            partIdx++;
        }

        return command;
    }

    private _map: MapModuleGroup = null;
    private _swagger: any = null;
    private _adjustments: Adjustments;
    private _cliName: string = null;
    private _index: number;
    private _examples: Example[];
    private _log: LogCallback;
    private _error: LogCallback;
    private _modelCache: any = {};
}
