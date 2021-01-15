import { MethodParam, ExampleParam, CommandExample, KeyValueType } from '../climodels/ExampleType';

import {
    deepCopy,
    MergeSort,
    ToJsonString,
    ToSnakeCase,
    isEqualStringArray,
    isNullOrUndefined,
} from '../../utils/helper';


import {
    azOptions,
    GenerateDefaultTestScenario,
    GenerateDefaultTestScenarioByDependency,
    PrintTestScenario,
    ResourcePool,
    ObjectStatus,
    GroupTestScenario,
} from '../renders/tests/ScenarioTool';
import { AzConfiguration, CodeGenConstants, getAZConfiguration } from '../../utils/models';

export class ExampleModel {
    resourcePool: ResourcePool;
    private _testScenario: any;
    private _defaultTestScenario: any[];
    private _configuredScenario: boolean;

    public constructor() {
        this.resourcePool = new ResourcePool();
        Object.assign(azOptions, AzConfiguration.getValue(CodeGenConstants.az));
    }

    public GetResourcePool(): ResourcePool {
        return this.resourcePool;
    }

    public get Extension_TestScenario(): any {
        return this._testScenario;
    }

    public get Extension_DefaultTestScenario(): any {
        return this._defaultTestScenario;
    }

    public get ConfiguredScenario(): boolean {
        // judge test-scenario whether have value
        return this._configuredScenario;
    }

    public GenerateTestInit(): void {
        if (this.codeModel['test-scenario']) {
            // if ('examples' in this.codeModel['test-scenario']) {
            //     //new style of example configuration
            //     this._testScenario = this.codeModel['test-scenario']['examples'];
            // }
            // else {
            //     //old style of example configuration
            //     this._testScenario = this.codeModel['test-scenario']
            // }
            this._testScenario = GroupTestScenario(
                this.codeModel['test-scenario'],
                this.Extension_NameUnderscored,
            );
            this._configuredScenario = true;
        } else {
            this._testScenario = undefined;
            this._configuredScenario = false;
        }
    }

    public get RandomizeNames(): boolean {
        const randomizeNames = getAZConfiguration(CodeGenConstants.RANDOMIZE_NAMES_CONFIG_KEY);
        if (randomizeNames) return true;
        return false;
    }

    public get FormalizeNames(): boolean {
        const formalizeNames = getAZConfiguration(CodeGenConstants.FORMALIZE_NAMES_CONFIG_KEY);
        if (formalizeNames) return true;
        return false;
    }

    public get GenChecks(): boolean {
        const disableChecks = getAZConfiguration(CodeGenConstants.DISABLE_CHECKS_CONFIG_KEY);
        if (disableChecks) return false;
        return true;
    }

    public get GenMinTest(): boolean {
        const genMinTest = getAZConfiguration(CodeGenConstants.GEN_MIN_TEST_CONFIG_KEY);
        if (genMinTest) return true;
        return false;
    }

    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersList(): MethodParam[] {
        const methodParamList: MethodParam[] = [];

        if (this.SelectFirstMethodParameter()) {
            do {
                if (
                    (this.MethodParameter.implementation === 'Method' ||
                        this.MethodParameter['polyBaseParam']) &&
                    !this.MethodParameter_IsFlattened &&
                    this.MethodParameter?.schema?.type !== 'constant'
                ) {
                    let submethodparameters = null;
                    if (this.EnterSubMethodParameters()) {
                        submethodparameters = this.submethodparameters;
                        this.ExitSubMethodParameters();
                    }
                    methodParamList.push(
                        new MethodParam(
                            this.MethodParameter,
                            this.Parameter_IsList(this.MethodParameter),
                            this.MethodParameter_IsListOfSimple ||
                                this.MethodParameter_IsSimpleArray,
                            submethodparameters,
                            this.currentParameterIndex >= this.Method.parameters.length,
                        ),
                    );
                }
            } while (this.SelectNextMethodParameter());
        }
        return methodParamList;
    }

    public GetExampleParameters(exampleObj): ExampleParam[] {
        const parameters: ExampleParam[] = [];
        const methodParamList: MethodParam[] = this.GetMethodParametersList();
        Object.entries(exampleObj.parameters).forEach(([paramName, paramValue]) => {
            this.FlattenExampleParameter(methodParamList, parameters, paramName, paramValue, []);
        });
        return parameters;
    }

    private isDiscriminator(param: any): boolean {
        return this.Command_GetOriginalOperation && param?.targetProperty?.isDiscriminator
            ? true
            : false;
    }

    private AddExampleParameter(
        methodParam: MethodParam,
        exampleParam: ExampleParam[],
        value: any,
        polySubParam: MethodParam,
        ancestors: string[],
        rawValue: any,
    ): boolean {
        if (isNullOrUndefined(methodParam)) return false;
        let isList: boolean = methodParam.isList;
        let isSimpleListOrArray: boolean = methodParam.isSimpleListOrArray;
        let defaultName: string = methodParam.value.language['cli'].cliKey;
        let name: string = this.Parameter_MapsTo(methodParam.value);
        if (
            !isNullOrUndefined(methodParam.value.language?.['az']?.alias) &&
            Array.isArray(methodParam.value.language['az'].alias) &&
            methodParam.value.language['az'].alias.length > 0
        ) {
            name = methodParam.value.language['az'].alias[0];
        }
        let realParam = methodParam;
        if (polySubParam) {
            isList = polySubParam.isList;
            isSimpleListOrArray = polySubParam.isSimpleListOrArray;
            defaultName = polySubParam.value.language['cli'].cliKey;
            name = this.Parameter_MapsTo(polySubParam.value);
            if (
                !isNullOrUndefined(polySubParam.value.language?.['az']?.alias) &&
                Array.isArray(polySubParam.value.language['az'].alias) &&
                polySubParam.value.language['az'].alias.length > 0
            ) {
                name = polySubParam.value.language['az'].alias[0];
            }
            realParam = polySubParam;
        }

        function toActionString(
            model: CodeModelCliImpl,
            dict,
            seperator = ' ',
            initKeys = undefined,
        ): [string, string[]] {
            let ret = '';
            let keys: string[] = [];
            if (!isNullOrUndefined(initKeys)) {
                keys = initKeys;
            }
            for (const k in dict) {
                let cliName = null;
                for (const param of [methodParam, polySubParam]) {
                    if (param?.submethodparameters) {
                        for (const submethodProperty of param.submethodparameters) {
                            if (
                                submethodProperty.language['cli'].cliKey.toLowerCase() ===
                                k.toLowerCase()
                            ) {
                                cliName = model.Parameter_NameAz(submethodProperty);
                            }
                        }
                    }
                }
                if (!cliName) {
                    // If no submethodparameters, keep all KEYs as the origin name
                    // This is for type of schema.Dictionary
                    cliName = k;
                }
                if (dict[k] instanceof Array) {
                    for (const v of dict[k]) {
                        if (ret.length > 0) {
                            ret += seperator;
                        }
                        ret += `${cliName}=${ToJsonString(v)}`;
                    }
                } else {
                    if (ret.length > 0) {
                        ret += seperator;
                    }
                    const v = ToJsonString(dict[k]);
                    // if (v.startsWith("\"")) {
                    //     v = v.substr(1, v.length-2);
                    // }
                    ret += `${cliName}=${v}`;
                }
                if (!keys.includes(cliName)) keys.push(cliName);
            }
            return [ret, keys];
        }

        let handled = false;
        if (isList) {
            if (isSimpleListOrArray) {
                let keys = [];
                let ret = '';
                if (value instanceof Array) {
                    // spread list
                    handled = true;
                    if (this.Parameter_IsShorthandSyntax(realParam.value)) {
                        for (let i = 0; i < value.length; i++) {
                            let instanceString: string;
                            [instanceString, keys] = toActionString(this, value[i], ',', keys);
                            instanceString = instanceString.trim();
                            if (ret.length > 0 && instanceString.length > 0) ret += ' ';
                            ret += instanceString;
                        }
                        exampleParam.push(
                            new ExampleParam(
                                name,
                                ret,
                                false,
                                KeyValueType.ShorthandSyntax,
                                keys,
                                defaultName,
                                realParam,
                                ancestors,
                                value,
                            ),
                        );
                    } else if (this.Parameter_IsSimpleArray(realParam.value)) {
                        if (value.length > 0) {
                            // use value only when it's lenght > 0
                            for (let i = 0; i < value.length; i++) {
                                ret += ToJsonString(value[i]) + ' ';
                            }
                            ret = ret.trim();
                            exampleParam.push(
                                new ExampleParam(
                                    name,
                                    ret,
                                    false,
                                    KeyValueType.SimpleArray,
                                    [],
                                    defaultName,
                                    realParam,
                                    ancestors,
                                    value,
                                ),
                            );
                        }
                    } else {
                        for (let i = 0; i < value.length; i++) {
                            this.AddExampleParameter(
                                methodParam,
                                exampleParam,
                                value[i],
                                polySubParam,
                                ancestors,
                                rawValue[i],
                            );
                        }
                    }
                } else if (typeof rawValue === 'object') {
                    // KEY=VALUE form
                    handled = true;
                    if (this.Parameter_IsPositional(realParam.value)) {
                        keys = this.Parameter_PositionalKeys(
                            realParam.value,
                            realParam.submethodparameters,
                        );
                        for (const k of keys) {
                            ret += ' ';
                            FIND_PARAM: for (const param of [polySubParam, methodParam]) {
                                if (param?.submethodparameters) {
                                    for (const subMethodParam of param.submethodparameters) {
                                        if (this.Parameter_NamePython(subMethodParam) === k) {
                                            ret += ToJsonString(
                                                rawValue[subMethodParam.language['cli'].cliKey],
                                            );
                                            break FIND_PARAM;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ret = ret.trim();
                    if (ret.trim().length > 0) {
                        exampleParam.push(
                            new ExampleParam(
                                name,
                                ret,
                                false,
                                KeyValueType.PositionalKey,
                                keys,
                                defaultName,
                                realParam,
                                ancestors,
                                value,
                            ),
                        );
                    } else {
                        /// /////////
                        [ret, keys] = toActionString(this, value);
                        if (ret.length > 0) {
                            exampleParam.push(
                                new ExampleParam(
                                    name,
                                    ret,
                                    false,
                                    KeyValueType.Classic,
                                    keys,
                                    defaultName,
                                    realParam,
                                    ancestors,
                                    value,
                                ),
                            );
                        }
                    }
                }
            }
            if (!handled) {
                if (typeof value === 'string') {
                    exampleParam.push(
                        new ExampleParam(
                            name,
                            value,
                            false,
                            KeyValueType.No,
                            [],
                            defaultName,
                            realParam,
                            ancestors,
                            value,
                        ),
                    );
                } else {
                    // JSON form
                    exampleParam.push(
                        new ExampleParam(
                            name,
                            JSON.stringify(value)
                                .split(/[\r\n]+/)
                                .join(''),
                            true,
                            KeyValueType.No,
                            [],
                            defaultName,
                            realParam,
                            ancestors,
                            value,
                        ),
                    );
                }
            }
        } else if (typeof value !== 'object') {
            exampleParam.push(
                new ExampleParam(
                    name,
                    value,
                    false,
                    KeyValueType.No,
                    [],
                    defaultName,
                    realParam,
                    ancestors,
                    value,
                ),
            );
        } else {
            // ignore object values if not isList.
            return false;
        }
        return true;
    }

    private FlattenProperty(paramSchema: any, exampleValue: any) {
        if (paramSchema?.type === 'array' && exampleValue instanceof Array) {
            return exampleValue.map((x) => this.FlattenProperty(paramSchema?.elementType, x));
        }
        if (
            ['object', 'dictionary'].indexOf(paramSchema?.type) >= 0 &&
            paramSchema?.properties &&
            typeof exampleValue === 'object' &&
            !(exampleValue instanceof Array)
        ) {
            const ret = deepCopy(exampleValue);
            for (const subProperty of paramSchema?.properties) {
                if (subProperty.flattenedNames && subProperty.flattenedNames.length > 0) {
                    let subValue = exampleValue;
                    let i = 0;
                    for (; i < subProperty.flattenedNames.length; i++) {
                        if (isNullOrUndefined(subValue)) break;
                        const k = subProperty.flattenedNames[i];
                        const v = subValue[k];
                        if (v === undefined) break;
                        subValue = v;
                    }
                    if (i === subProperty.flattenedNames.length) {
                        ret[subProperty?.language['cli'].cliKey] = subValue;
                    }
                }
            }
            for (const subProperty of paramSchema?.properties) {
                if (subProperty.flattenedNames && subProperty.flattenedNames.length > 0) {
                    delete ret[subProperty.flattenedNames[0]];
                }
            }
            for (const subProperty of paramSchema?.properties) {
                const k = subProperty?.language['cli'].cliKey;
                if (exampleValue && exampleValue[k]) {
                    exampleValue[k] = this.FlattenProperty(subProperty, exampleValue[k]);
                }
            }
            return ret;
        }
        return deepCopy(exampleValue);
    }

    private checkPathToProperty(methodParam: MethodParam, ancestors: string[]): boolean {
        return (
            ancestors.length > 0 &&
            isEqualStringArray(
                methodParam.value.pathToProperty.map((x) => x?.language?.['az']?.name),
                ancestors.slice(1),
            )
        );
    }

    private checkFlattenedNames(methodParam: MethodParam, ancestors: string[]): boolean {
        const flattenedNames = methodParam.value.targetProperty.flattenedNames;
        return (
            !isNullOrUndefined(flattenedNames) &&
            flattenedNames.length === ancestors.length &&
            isEqualStringArray(
                methodParam.value.targetProperty.flattenedNames.slice(0, -1),
                ancestors.slice(1),
            )
        );
    }

    private matchMethodParam(
        methodParamList: MethodParam[],
        paramName: string,
        ancestors: string[],
    ): MethodParam[] {
        const ret: MethodParam[] = [];
        if (!paramName) return ret;
        for (const methodParam of methodParamList) {
            let serializedName = methodParam.value.targetProperty?.serializedName;
            if (!serializedName) serializedName = methodParam.value.language['cli'].cliKey;
            // let methodParam_key = methodParam.value.language['cli'].cliKey;
            if (serializedName.toLowerCase() === paramName.toLowerCase()) {
                if (
                    !('pathToProperty' in methodParam.value) ||
                    this.checkPathToProperty(methodParam, ancestors) ||
                    this.checkFlattenedNames(methodParam, ancestors)
                ) {
                    ret.push(methodParam);
                }
            }
        }
        return ret;
    }

    public FlattenExampleParameter(
        methodParamList: MethodParam[],
        exampleParam: ExampleParam[],
        name: string,
        value: any,
        ancestors: string[],
    ) {
        for (const methodParam of this.matchMethodParam(methodParamList, name, ancestors)) {
            let polySubParam: MethodParam = null;
            let netValue =
                typeof value === 'object' && !isNullOrUndefined(value) ? deepCopy(value) : value;
            let rawValue = deepCopy(netValue);
            if (methodParam.value['isPolyOfSimple']) {
                const keyToMatch =
                    methodParam.value.schema.discriminator?.property?.language?.default?.name;
                if (keyToMatch) {
                    for (const methodParam of methodParamList) {
                        const polySubParamObj = methodParam.value;
                        if (polySubParamObj.schema.extensions) {
                            const valueToMatch =
                                polySubParamObj.schema.extensions['x-ms-discriminator-value'];
                            if (netValue[keyToMatch] === valueToMatch) {
                                polySubParam = methodParam;
                                delete netValue[keyToMatch];
                                break;
                            }
                        }
                    }
                }
            }
            if (polySubParam) {
                netValue = this.FlattenProperty(polySubParam.value?.schema, netValue);
                rawValue = this.FlattenProperty(polySubParam.value?.schema, rawValue);
            } else {
                netValue = this.FlattenProperty(methodParam.value?.schema, netValue);
                rawValue = this.FlattenProperty(methodParam.value?.schema, rawValue);
            }
            if (
                'pathToProperty' in methodParam.value &&
                ancestors.length - methodParam.value.pathToProperty.length === 1
            ) {
                // if the method parameter has 'pathToProperty', check the path with example parameter full path.
                if (this.checkPathToProperty(methodParam, ancestors)) {
                    // exampleParam.set(name, value);
                    this.AddExampleParameter(
                        methodParam,
                        exampleParam,
                        netValue,
                        polySubParam,
                        ancestors,
                        rawValue,
                    );
                    return;
                }
            } else if (
                'targetProperty' in methodParam.value &&
                'flattenedNames' in methodParam.value.targetProperty &&
                ancestors.length - methodParam.value.targetProperty.flattenedNames.length === 0 &&
                ancestors.length > 0
            ) {
                // if the method parameter has 'flattenedNames', check the names (except the last name) with example parameter full path.
                if (this.checkFlattenedNames(methodParam, ancestors)) {
                    // exampleParam.set(name, value);
                    this.AddExampleParameter(
                        methodParam,
                        exampleParam,
                        netValue,
                        polySubParam,
                        ancestors,
                        rawValue,
                    );
                    return;
                }
            } else if (ancestors.length === 0) {
                // exampleParam.set(name, value);
                if (
                    this.AddExampleParameter(
                        methodParam,
                        exampleParam,
                        netValue,
                        polySubParam,
                        ancestors,
                        rawValue,
                    )
                )
                    return;
            }
        }

        if (!isNullOrUndefined(value) && typeof value === 'object') {
            for (const subName in value) {
                this.FlattenExampleParameter(
                    methodParamList,
                    exampleParam,
                    subName,
                    value[subName],
                    ancestors.concat(name),
                );
            }
        }
    }

    public ConvertToCliParameters(exampleParams: ExampleParam[]): ExampleParam[] {
        const ret: ExampleParam[] = [];
        for (const param of exampleParams) {
            // Object.entries(exampleParams).forEach(() => {
            let paramName = ToSnakeCase(param.name);
            if (paramName.endsWith('_name')) {
                if (paramName === 'resource_group_name') {
                    paramName = 'resource_group';
                }
                // else {
                //     paramName = "name";
                // }
            }
            paramName = paramName.split('_').join('-');
            ret.push(
                new ExampleParam(
                    '--' + paramName,
                    param.value,
                    param.isJson,
                    param.keyValue,
                    param.keys,
                    param.defaultName,
                    param.methodParam,
                    param.ancestors,
                    param.rawValue,
                ),
            );
        }
        return ret;
    }

    private filterExampleByPoly(exampleObj: any, example: CommandExample): boolean {
        function getPolyClass(model): string {
            const cliKey = model.Method.language['cli'].cliKey;
            if (cliKey) {
                const names = cliKey.split('#');
                if (names && names.length > 1) {
                    return names[names.length - 1];
                }
            }
            return '';
        }
        const valueToMatch = getPolyClass(this);
        if (!valueToMatch) return true;

        function matchPolyClass(example: CommandExample, keyToMatch: string, valueToMatch: string) {
            for (const param of example.Parameters) {
                if (
                    (('--' + keyToMatch).toLowerCase() === param.name.toLowerCase() ||
                        ('--' + keyToMatch + '-').toLowerCase() === param.name.toLowerCase()) &&
                    typeof param.value === 'string'
                ) {
                    return valueToMatch.toLowerCase() === param.value.toLowerCase();
                }
            }
            return true;
        }

        // check polymophism here
        const originalOperation = this.Method_GetOriginalOperation;
        if (!isNullOrUndefined(originalOperation)) {
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (
                        !isNullOrUndefined(
                            this.MethodParameter.extensions?.['cli-poly-as-resource-base-schema'],
                        )
                    ) {
                        const originalSchema = this.MethodParameter.extensions?.[
                            'cli-poly-as-resource-base-schema'
                        ];
                        const keyToMatch = (originalSchema as any).discriminator.property.language
                            .default.name; // type
                        if (!matchPolyClass(example, keyToMatch, valueToMatch)) {
                            return false;
                        }
                    }
                } while (this.SelectNextMethodParameter());
            }
        }
        return true;
    }

    public GetExamples(): CommandExample[] {
        function forUpdate(model: CodeModelCliImpl, exampleName: string): boolean {
            const lowercase: string = exampleName.toLowerCase();
            return (
                lowercase.endsWith('_update') ||
                (model.ExampleAmount > 1 &&
                    lowercase.indexOf('update') >= 0 &&
                    lowercase.indexOf('create') < 0)
            );
        }

        const examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, exampleObj]) => {
                const example = new CommandExample();
                example.Method = this.Command_MethodName;
                example.Id = `/${this.CommandGroup_Key}/${this.Method_HttpMethod}/${id}`;
                example.Title = exampleObj.title || id;
                example.Path = this.Method_Path;
                example.HttpMethod = this.Method_HttpMethod;
                example.ResourceClassName = this.CommandGroup_Key;
                const params = this.GetExampleParameters(exampleObj);
                example.Parameters = this.ConvertToCliParameters(params);
                example.MethodResponses = this.Method.responses || [];
                example.Method_IsLongRun = !!this.Method.extensions?.[
                    'x-ms-long-running-operation'
                ];
                example.ExampleObj = exampleObj;
                if (this.Method_GetSplitOriginalOperation) {
                    // filter example by name for generic createorupdate
                    if (
                        this.Command_MethodName.toLowerCase() === 'update' &&
                        !forUpdate(this, id)
                    ) {
                        return;
                    }
                    if (this.Command_MethodName.toLowerCase() !== 'update' && forUpdate(this, id)) {
                        return;
                    }
                }
                if (this.filterExampleByPoly(exampleObj, example)) {
                    for (let i = 0; i < example.Parameters.length; i++) {
                        if (this.isDiscriminator(example.Parameters[i].methodParam.value)) {
                            example.Parameters.splice(i, 1);
                            i--;
                        }
                    }
                    examples.push(example);
                }
                example.CommandString = this.GetExampleItems(example, false, undefined).join(' ');
                example.WaitCommandString = this.GetExampleWait(example).join(' ');
            });
        }
        return examples;
    }

    public GetExampleChecks(example: CommandExample): string[] {
        const ret: string[] = [];
        if (!this.GenChecks) return ret;
        let resourceObjectName;
        for (const param of example.Parameters) {
            if (
                example.ResourceClassName &&
                this.resourcePool.isResource(param.defaultName) === example.ResourceClassName
            ) {
                resourceObjectName = param.value;
            }
        }

        const resourceObject = this.resourcePool.findResource(
            example.ResourceClassName,
            resourceObjectName,
            ObjectStatus.Created,
        );
        if (resourceObject) {
            ret.push(...resourceObject.getCheckers(this.resourcePool, example));
        }
        ret.push(...this.resourcePool.getListCheckers(example));
        return ret;
    }

    public GetExampleItems(
        example: CommandExample,
        isTest: boolean,
        commandParams: any,
        minimum = false,
    ): string[] {
        const parameters: string[] = [];
        parameters.push('az ' + this.Command_Name);

        let hasRG = false;
        let resourceObjectName;
        for (const param of example.Parameters) {
            if (minimum && !this.Parameter_IsRequiredOrCLIRequired(param.methodParam.value))
                continue;
            let paramValue = param.value;
            if (isTest || this.FormalizeNames) {
                let replacedValue = this.resourcePool.addEndpointResource(
                    paramValue,
                    param.isJson,
                    param.keyValue,
                    [],
                    [],
                    param,
                    isTest,
                );
                if (replacedValue === paramValue) {
                    replacedValue = this.resourcePool.addParamResource(
                        param.defaultName,
                        paramValue,
                        param.isJson,
                        param.keyValue,
                        isTest,
                    );
                }
                paramValue = replacedValue;
                param.replacedValue = replacedValue;
            }
            let slp = paramValue;
            if (param.keyValue === KeyValueType.No) {
                slp = ToJsonString(slp);
            }
            parameters.push(param.name + ' ' + slp);

            if (['--resource-group', '-g'].indexOf(param.name) >= 0) {
                hasRG = true;
            }

            if (
                example.ResourceClassName &&
                this.resourcePool.isResource(param.defaultName) === example.ResourceClassName
            ) {
                resourceObjectName = param.value;
            }
        }

        if (
            isTest &&
            !hasRG &&
            commandParams &&
            commandParams[this.Command_Name] &&
            commandParams[this.Command_Name].has('resourceGroupName')
        ) {
            parameters.push('-g ""');
        }

        if (isTest) {
            const resourceObject = this.resourcePool.findResource(
                example.ResourceClassName,
                resourceObjectName,
                undefined,
            );
            if (resourceObject) {
                const httpMethod = example.HttpMethod.toLowerCase();
                if (['put', 'post', 'patch'].indexOf(httpMethod) >= 0) {
                    if (httpMethod === 'post') {
                        resourceObject.exampleParams = [];
                    }
                    for (const param of example.Parameters) {
                        if (
                            minimum &&
                            !this.Parameter_IsRequiredOrCLIRequired(param.methodParam.value)
                        )
                            continue;
                        resourceObject.addOrUpdateParam(param);
                    }
                    resourceObject.testStatus = ObjectStatus.Created;
                }
                if (httpMethod === 'delete') {
                    resourceObject.testStatus = ObjectStatus.Deleted;
                }
            }
        }

        return parameters;
    }

    public GetExampleWait(example: CommandExample): string[] {
        const parameters: string[] = [];
        let foundResource = false;
        if (
            example.HttpMethod.toLowerCase() === 'put' &&
            example.Method_IsLongRun &&
            example.MethodResponses.length > 0 &&
            (example.MethodResponses[0].schema?.properties || []).find((property) => {
                return property?.language?.['cli']?.cliKey === 'provisioningState';
            })
        ) {
            let words = this.Command_Name.split(' ');
            words = words.slice(0, words.length - 1);
            words.push('wait');
            parameters.push(`az ${words.join(' ')} --created`);
            for (const param of example.Parameters) {
                const paramKey = param.methodParam.value.language?.['cli']?.cliKey;
                if (
                    paramKey === 'resourceGroupName' ||
                    this.resourcePool.isResource(paramKey) === example.ResourceClassName
                ) {
                    let paramValue = param.value;
                    let replacedValue = this.resourcePool.addEndpointResource(
                        paramValue,
                        param.isJson,
                        param.keyValue,
                        [],
                        [],
                        param,
                    );
                    if (replacedValue === paramValue) {
                        replacedValue = this.resourcePool.addParamResource(
                            param.defaultName,
                            paramValue,
                            param.isJson,
                            param.keyValue,
                        );
                    }
                    paramValue = replacedValue;
                    let slp = paramValue;
                    if (param.keyValue === KeyValueType.No) {
                        slp = ToJsonString(slp);
                    }
                    parameters.push(param.name + ' ' + slp);
                }
                if (this.resourcePool.isResource(paramKey) === example.ResourceClassName)
                    foundResource = true;
            }
        }
        return foundResource ? parameters : [];
    }

    public GetPreparerEntities(): any[] {
        return this.resourcePool.createPreparerEntities();
    }

    public GetSubscriptionKey(): string {
        if (this.resourcePool.useSubscription) {
            return ResourcePool.KEY_SUBSCRIPTIONID;
        } else {
            return null;
        }
    }

    public FindExampleById(
        id: string,
        commandParams: any,
        examples: CommandExample[],
        minimum = false,
    ): string[][] {
        const ret: string[][] = [];
        this.GetAllExamples(id, (example) => {
            examples.push(example);
            ret.push(this.GetExampleItems(example, true, commandParams, minimum));
        });
        return ret;
    }

    public FindExampleWaitById(id: string): string[][] {
        const ret: string[][] = [];
        this.GetAllExamples(id, (example) => {
            const waitCmd = this.GetExampleWait(example);
            if (waitCmd.length > 0) ret.push(waitCmd);
        });
        return ret;
    }

    public GatherInternalResource() {
        const internalResources = {}; // resource_key --> list of resource languages
        this.GetAllMethods(null, () => {
            if (!(this.CommandGroup_Key in internalResources)) {
                internalResources[this.CommandGroup_Key] = [this.CommandGroup_Key];
            }
            // let commands = this.CommandGroup_Name.split(" ");
            // let resourceName = commands[commands.length - 1] + "-name";
            const resourceName = this.CommandGroup_DefaultName + 'Name';
            if (internalResources[this.CommandGroup_Key].indexOf(resourceName) < 0) {
                internalResources[this.CommandGroup_Key].push(resourceName);
            }
        });
        this.resourcePool.addResourcesInfo(internalResources);

        // find dependency relationships of internalResources
        this.GetAllMethods(null, () => {
            const dependResources = [];
            const dependParameters = [];

            const examples = this.GetExamples();
            // recognize depends by endpoint in examples
            for (const example of examples) {
                for (const param of example.Parameters) {
                    const resources = [];
                    this.resourcePool.addEndpointResource(
                        param.value,
                        param.isJson,
                        param.keyValue,
                        [],
                        resources,
                        param,
                    );
                    for (const onResource of resources) {
                        if (
                            onResource !== this.CommandGroup_Key &&
                            dependResources.indexOf(onResource) < 0
                        ) {
                            dependResources.push(onResource);
                            dependParameters.push(param.name);
                        }
                    }
                    this.resourcePool.addParamResource(
                        param.defaultName,
                        param.value,
                        param.isJson,
                        param.keyValue,
                    );
                }
            }

            // recognize depends by parameter name'
            const createdObjectNames = [];
            const isCreateMehod = this.Method_HttpMethod === 'put';
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (
                        this.MethodParameter.implementation === 'Method' &&
                        !this.MethodParameter_IsFlattened &&
                        this.MethodParameter?.schema?.type !== 'constant'
                    ) {
                        const paramName = this.MethodParameter.language['cli'].cliKey;
                        const onResource = this.resourcePool.isResource(paramName);
                        for (const example of examples) {
                            for (const param of example.Parameters) {
                                if (
                                    onResource &&
                                    onResource !== this.CommandGroup_Key &&
                                    dependResources.indexOf(onResource) < 0
                                ) {
                                    // the resource is a dependency only when it's a parameter in an example.
                                    if (
                                        paramName === param.defaultName &&
                                        dependResources.indexOf(onResource) < 0
                                    ) {
                                        dependResources.push(onResource);
                                        dependParameters.push(paramName);
                                    }
                                }
                                if (
                                    isCreateMehod &&
                                    onResource &&
                                    onResource === this.CommandGroup_Key &&
                                    createdObjectNames.indexOf(param.value) < 0
                                ) {
                                    createdObjectNames.push(param.value);
                                }
                            }
                        }
                    }
                } while (this.SelectNextMethodParameter());
            }

            this.resourcePool.setResourceDepends(
                this.CommandGroup_Key,
                dependResources,
                dependParameters,
                createdObjectNames,
            );
        });

        if (isNullOrUndefined(this._defaultTestScenario)) {
            this._defaultTestScenario = GenerateDefaultTestScenario(this.GetAllExamples());
            this._defaultTestScenario = GenerateDefaultTestScenarioByDependency(
                this.GetAllExamples(),
                this.resourcePool,
                this._defaultTestScenario,
            );
            this.SortExamplesByDependency();
            PrintTestScenario(this._defaultTestScenario);
        }

        if (!this._configuredScenario && isNullOrUndefined(this._testScenario)) {
            this._testScenario = GroupTestScenario(
                this._defaultTestScenario,
                this.Extension_NameUnderscored,
            );
        }

        const commandParams = {};
        this.GetAllMethods(null, () => {
            if (!commandParams[this.Command_Name]) commandParams[this.Command_Name] = new Set();
            if (this.SelectFirstMethodParameter()) {
                do {
                    if (
                        (this.MethodParameter.implementation === 'Method' ||
                            (this.MethodParameter as any).polyBaseParam) &&
                        !this.MethodParameter_IsFlattened &&
                        this.MethodParameter?.schema?.type !== 'constant'
                    ) {
                        commandParams[this.Command_Name].add(
                            this.MethodParameter.language['cli'].cliKey,
                        );
                    }
                } while (this.SelectNextMethodParameter());
            }
        });
        return commandParams;
    }

    public SortExamplesByDependency() {
        const dependOn = (exampleA: CommandExample, exampleB: CommandExample): boolean => {
            // TODO: check dependency by object
            return this.resourcePool.isDependResource(
                exampleA.ResourceClassName,
                exampleB.ResourceClassName,
            );
        };

        const isCreate = (example: CommandExample): boolean => {
            return example.HttpMethod === 'put';
        };

        const isDelete = (example: CommandExample): boolean => {
            return example.HttpMethod === 'delete';
        };

        // stable sort
        const compare = (examplesA: CommandExample, examplesB: CommandExample): number => {
            if (!examplesA || !examplesB) return 0;

            if (examplesA.ResourceClassName === examplesB.ResourceClassName) {
                if (isCreate(examplesB) && !isCreate(examplesA)) {
                    return 1;
                } else if (isDelete(examplesB) && !isDelete(examplesA)) {
                    return -1;
                } else if (isCreate(examplesA) && !isCreate(examplesB)) {
                    return -1;
                } else if (isDelete(examplesA) && !isDelete(examplesB)) {
                    return 1;
                } else {
                    return examplesA.Id.localeCompare(examplesB.Id);
                }
            } else if (dependOn(examplesA, examplesB)) {
                if (isCreate(examplesB)) {
                    return 1;
                } else if (isDelete(examplesB)) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (dependOn(examplesB, examplesA)) {
                if (isCreate(examplesA)) {
                    return -1;
                } else if (isDelete(examplesA)) {
                    return 1;
                } else {
                    return -1;
                }
            }
            return examplesA.Id.localeCompare(examplesB.Id);
        };

        const scenarioExamples: Map<string, CommandExample> = new Map<string, CommandExample>();
        const commandExamples = this.GetAllExamples();
        for (let i = 0; i < this._defaultTestScenario.length; i++) {
            for (const commandExample of commandExamples) {
                if (this.matchExample(commandExample, this._defaultTestScenario[i].name)) {
                    scenarioExamples.set(this._defaultTestScenario[i].name, commandExample);
                    break;
                }
            }
        }

        this._defaultTestScenario = MergeSort(this._defaultTestScenario, (exampleA, exampleB) => {
            return compare(
                scenarioExamples.get(exampleA.name),
                scenarioExamples.get(exampleB.name),
            );
        });
    }

    private matchExample(example: CommandExample, id: string) {
        if (!id) return false;
        return (
            example.Id.toLowerCase() === id.toLowerCase() ||
            example.Id.toLowerCase().endsWith(`/${id.toLowerCase()}`)
        );
    }

    public GetAllExamples(id?: string, callback?: (example) => void): CommandExample[] {
        const ret: CommandExample[] = [];
        let found = false;
        this.GetAllMethods(null, () => {
            if (found) return;
            for (const example of this.GetExamples()) {
                if (id && !this.matchExample(example, id)) continue;
                if (callback) {
                    callback(example);
                }
                if (ret.indexOf(example) > -1) {
                    continue;
                }
                ret.push(example);
                if (id) {
                    found = true;
                }
            }
        });
        return ret;
    }
}
