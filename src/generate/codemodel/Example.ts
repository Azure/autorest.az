import {
    deepCopy,
    getGitStatus,
    isEqualStringArray,
    isGeneratedExampleId,
    isNullOrUndefined,
    MergeSort,
    ToJsonString,
    ToSnakeCase,
} from '../../utils/helper';
import {
    azOptions,
    GenerateDefaultTestScenario,
    GenerateDefaultTestScenarioByDependency,
    PrintTestScenario,
    ResourcePool,
    ObjectStatus,
    GroupTestScenario,
    LoadPreparesConfig,
} from '../renders/tests/ScenarioTool';
import { TestStepExampleFileRestCall } from 'oav/dist/lib/testScenario/testResourceTypes';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { CommandModel } from './Command';
import { CommandGroupModel } from './CommandGroup';
import { ConfigModel } from './Config';
import { ExtensionModel } from './Extension';
import { MethodModel } from './Method';
import { MethodParameterModel } from './MethodParameter';
import { ParameterModel } from './Parameter';
import { AzConfiguration, CodeGenConstants } from '../../utils/models';
import { readFile } from '@azure-tools/async-io';
import * as process from 'process';
import * as path from 'path';
import { Property } from '@azure-tools/codemodel';

export class MethodParam {
    public value: any;
    public isList: boolean;
    public isSimpleListOrArray: boolean;
    public submethodparameters: Property[];
    public inBody: boolean;
    public constructor(value, isList, isSimpleListOrArray, submethodparameters, inBody) {
        this.value = value;
        this.isList = isList;
        this.isSimpleListOrArray = isSimpleListOrArray;
        this.submethodparameters = submethodparameters;
        this.inBody = inBody;
    }
}

export enum KeyValueType {
    No,
    Classic,
    PositionalKey,
    ShorthandSyntax,
    SimpleArray,
}

export class ExampleParam {
    name: string;
    value: any;
    isJson: boolean;
    keyValue: KeyValueType;
    keys: string[];
    defaultName: string;
    methodParam: MethodParam;
    ancestors: string[];
    replacedValue: any;
    rawValue: any;
    public constructor(
        name: string,
        value: any,
        isJson: boolean,
        keyValue: KeyValueType,
        keys: string[],
        defaultName: string,
        methodParam: MethodParam,
        ancestors: string[],
        rawValue: any,
    ) {
        this.name = name;
        this.value = value;
        this.isJson = isJson;
        this.keyValue = keyValue;
        this.keys = keys;
        this.defaultName = defaultName;
        this.methodParam = methodParam;
        this.ancestors = ancestors;
        this.rawValue = rawValue;
    }
}

export class CommandExample {
    // this should be "create", "update", "list", "show", or custom name
    public Method: string;
    public Command: string;
    public Id: string;
    public Title: string;
    public Parameters: ExampleParam[];
    // public MethodName: string;
    public Path: string;
    public ResourceClassName: string;
    public HttpMethod: string; // Get, Post, Put ...
    public MethodResponses: any[];
    public Method_IsLongRun: boolean;
    public MethodParams: MethodParam[];
    public ExampleObj: any;
    public commandStringItems: string[];
    public CommandString: string;
}

export interface ExampleModel {
    GetExamples(includeGenerated: boolean): CommandExample[];
    GetExampleWait(example: CommandExample): string[];
    GetSubscriptionKey(): string;
    GetPreparerEntities(): any[];
    GatherInternalResource();
    FindExampleWaitById(id: string, step?: TestStepExampleFileRestCall): string[][];
    GetExampleItems(example: CommandExample, isTest: boolean, commandParams: any): string[];
    GetExampleChecks(example: CommandExample): string[];

    GetMetaData(): { [key: string]: any };
    GetResourcePool(): ResourcePool;
    FindExampleById(
        id: string,
        commandParams: any,
        examples: any[],
        minimum: boolean,
        step?: TestStepExampleFileRestCall,
    ): string[][];
    GenerateTestInit(): void;
    Example_TestScenario: any;
    Example_DefaultTestScenario: any;
    ExampleAmount: number;
}

export class ExampleModelImpl implements ExampleModel {
    private commandGroupHandler: CommandGroupModel;
    private methodHandler: MethodModel;
    private methodParameterHandler: MethodParameterModel;
    private parameterHandler: ParameterModel;
    private commandHandler: CommandModel;
    private configHandler: ConfigModel;
    private extensionHandler: ExtensionModel;
    protected resourcePool: ResourcePool;
    _testScenario: any;
    _configuredScenario: boolean;
    _defaultTestScenario: any[];
    protected _useOptions: string[];
    protected _parentOptions: any;
    constructor(public baseHandler: CodeModelCliImpl) {
        const {
            commandGroupHandler,
            commandHandler,
            methodHandler,
            methodParameterHandler,
            parameterHandler,
            configHandler,
            extensionHandler,
        } = baseHandler.GetHandler();
        this.commandGroupHandler = commandGroupHandler;
        this.methodHandler = methodHandler;
        this.methodParameterHandler = methodParameterHandler;
        this.parameterHandler = parameterHandler;
        this.configHandler = configHandler;
        this.extensionHandler = extensionHandler;
        this.commandHandler = commandHandler;
        Object.assign(azOptions, this.baseHandler.options);
        this.resourcePool = new ResourcePool();
        this._parentOptions = AzConfiguration.getValue(CodeGenConstants.parents);
        this._useOptions = AzConfiguration.getValue(CodeGenConstants.use);
        LoadPreparesConfig(this.baseHandler.options[CodeGenConstants.preparers]);
    }
    public get Examples(): unknown {
        const extensions = this.baseHandler.methodHandler.Method.extensions;
        return extensions && 'x-ms-examples' in extensions ? extensions['x-ms-examples'] : {};
    }

    public get ExampleAmount(): number {
        return Object.keys(this.Examples).length;
    }

    public GetResourcePool(): ResourcePool {
        return this.resourcePool;
    }

    public get ConfiguredScenario(): boolean {
        // judge test-scenario whether have value
        return this._configuredScenario;
    }

    public get Example_TestScenario(): any {
        return this._testScenario;
    }

    public get Example_DefaultTestScenario(): any {
        return this._defaultTestScenario;
    }

    public async GetMetaData(): Promise<{ [key: string]: any }> {
        function getSwaggerFolder(parentsOptions: { [key: string]: any }) {
            for (const k in parentsOptions) {
                const v: string = parentsOptions[k];
                if (
                    k.endsWith('.json') &&
                    typeof v === 'string' &&
                    v.startsWith('file:///') &&
                    v.indexOf('specification') > 0
                ) {
                    const p = v.indexOf('specification');
                    if (process.platform.toLowerCase().startsWith('win')) {
                        return v.slice('file:///'.length, p - 1);
                    }
                    return v.slice('file:///'.length - 1, p - 1);
                }
            }
            return undefined;
        }
        const ret = {};
        ret['--use'] = this._useOptions;

        const swaggerFolder = getSwaggerFolder(this._parentOptions);
        if (swaggerFolder) {
            ret['swagger git status'] = getGitStatus(swaggerFolder).split('\n');
        }

        const azpkg = path.join(__dirname, '..', '..', '..', '..', 'package.json');
        const pjson = JSON.parse(await readFile(azpkg));
        ret['package info'] = `${pjson.name} ${pjson.version}`;
        return ret;
    }

    public GenerateTestInit(): void {
        if (this.GetResourcePool().hasTestResourceScenario) {
            this._testScenario = GroupTestScenario(
                this.GetResourcePool().generateTestScenario(),
                this.extensionHandler.Extension_NameUnderscored,
            );
            this._configuredScenario = true;
        } else if (this.baseHandler.codeModel['test-scenario']) {
            this._testScenario = GroupTestScenario(
                this.baseHandler.codeModel['test-scenario'],
                this.extensionHandler.Extension_NameUnderscored,
            );
            this._configuredScenario = true;
        } else {
            this._testScenario = undefined;
            this._configuredScenario = false;
        }
        this.GatherInternalResource();
        this.GetAllExamples();
    }
    /**
     * Gets method parameters dict
     * @returns method parameters dict : key is parameter name, value is the parameter schema
     */
    public GetMethodParametersList(): MethodParam[] {
        const methodParamList: MethodParam[] = [];

        if (this.baseHandler.SelectFirstMethodParameter()) {
            do {
                if (
                    (this.methodParameterHandler.MethodParameter.implementation === 'Method' ||
                        this.methodParameterHandler.MethodParameter['polyBaseParam']) &&
                    !this.methodParameterHandler.MethodParameter_IsFlattened &&
                    this.methodParameterHandler.MethodParameter?.schema?.type !== 'constant'
                ) {
                    let submethodparameters = null;
                    if (this.baseHandler.EnterSubMethodParameters()) {
                        submethodparameters = this.baseHandler.submethodparameters;
                        this.baseHandler.ExitSubMethodParameters();
                    }
                    methodParamList.push(
                        new MethodParam(
                            this.methodParameterHandler.MethodParameter,
                            this.parameterHandler.Parameter_IsList(
                                this.methodParameterHandler.MethodParameter,
                            ),
                            this.methodParameterHandler.MethodParameter_IsListOfSimple ||
                                this.methodParameterHandler.MethodParameter_IsSimpleArray,
                            submethodparameters,
                            this.baseHandler.currentParameterIndex >=
                                this.methodHandler.Method.parameters.length,
                        ),
                    );
                }
            } while (this.baseHandler.SelectNextMethodParameter());
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
        return this.commandHandler.Command_GetOriginalOperation &&
            param?.targetProperty?.isDiscriminator
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
        let name: string = this.parameterHandler.Parameter_MapsTo(methodParam.value);
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
            name = this.parameterHandler.Parameter_MapsTo(polySubParam.value);
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
                                cliName = model.parameterHandler.Parameter_NameAz(
                                    submethodProperty,
                                );
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
                    if (this.parameterHandler.Parameter_IsShorthandSyntax(realParam.value)) {
                        for (let i = 0; i < value.length; i++) {
                            let instanceString: string;
                            [instanceString, keys] = toActionString(
                                this.baseHandler,
                                value[i],
                                ',',
                                keys,
                            );
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
                    } else if (this.parameterHandler.Parameter_IsSimpleArray(realParam.value)) {
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
                    if (this.parameterHandler.Parameter_IsPositional(realParam.value)) {
                        keys = this.parameterHandler.Parameter_PositionalKeys(
                            realParam.value,
                            realParam.submethodparameters,
                        );
                        for (const k of keys) {
                            ret += ' ';
                            FIND_PARAM: for (const param of [polySubParam, methodParam]) {
                                if (param?.submethodparameters) {
                                    for (const subMethodParam of param.submethodparameters) {
                                        if (
                                            this.parameterHandler.Parameter_NamePython(
                                                subMethodParam,
                                            ) === k
                                        ) {
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
                        [ret, keys] = toActionString(this.baseHandler, value);
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
                    methodParam.value.schema.discriminator?.property?.language?.cli?.cliKey;
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

    public ConvertToCliParameters(
        exampleParams: ExampleParam[],
        commandGroup: string,
    ): ExampleParam[] {
        const ret: ExampleParam[] = [];
        for (const param of exampleParams) {
            // Object.entries(exampleParams).forEach(() => {
            let paramName = ToSnakeCase(param.name);
            if (paramName.endsWith('_name')) {
                if (paramName === 'resource_group_name') {
                    paramName = 'resource_group';
                }
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
            const cliKey = model.methodHandler.Method.language['cli'].cliKey;
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
        const originalOperation = this.methodHandler.Method_GetOriginalOperation();
        if (!isNullOrUndefined(originalOperation)) {
            if (this.baseHandler.SelectFirstMethodParameter()) {
                do {
                    if (
                        !isNullOrUndefined(
                            this.methodParameterHandler.MethodParameter.extensions?.[
                                'cli-poly-as-resource-base-schema'
                            ],
                        )
                    ) {
                        const originalSchema = this.methodParameterHandler.MethodParameter
                            .extensions?.['cli-poly-as-resource-base-schema'];
                        const keyToMatch = (originalSchema as any).discriminator.property.language
                            .default.name; // type
                        if (!matchPolyClass(example, keyToMatch, valueToMatch)) {
                            return false;
                        }
                    }
                } while (this.baseHandler.SelectNextMethodParameter());
            }
        }
        return true;
    }

    public GetExamples(includeGenerated: boolean): CommandExample[] {
        if (
            !isNullOrUndefined(this.methodHandler.Method_AzExamples) &&
            this.methodHandler.Method_AzExamples.length > 0 &&
            includeGenerated
        ) {
            return this.methodHandler.Method_AzExamples;
        }
        const examples: CommandExample[] = [];
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([id, exampleObj]) => {
                if (includeGenerated || !isGeneratedExampleId(id)) {
                    const example = this.CreateCommandExample(id, exampleObj);
                    if (!isNullOrUndefined(example)) {
                        examples.push(example);
                        if (this.commandHandler.Command_MethodName === 'show') {
                            this.commandGroupHandler.CommandGroup_ShowExample = example;
                        }
                    }
                }
            });
        }
        if (includeGenerated) this.methodHandler.Method_AzExamples = examples;
        return examples;
    }

    public GetExampleById(id: string, exampleObj: any): CommandExample {
        let ret: CommandExample = undefined;
        if (this.Examples) {
            Object.entries(this.Examples).forEach(([_id, _exampleObj]) => {
                if (!isNullOrUndefined(ret)) return;
                if (!isNullOrUndefined(id) && id.toLowerCase() !== _id.toLowerCase()) return;
                if (!isNullOrUndefined(exampleObj)) _exampleObj = exampleObj;
                const example = this.CreateCommandExample(_id, _exampleObj);
                if (!isNullOrUndefined(example)) ret = example;
            });
        }
        return ret;
    }

    public CreateCommandExample(id: string, exampleObj: any): CommandExample {
        function forUpdate(model: CodeModelCliImpl, exampleName: string): boolean {
            const { exampleHandler } = model.GetHandler();
            const lowercase: string = exampleName.toLowerCase();
            return (
                lowercase.endsWith('_update') ||
                (exampleHandler.ExampleAmount > 1 &&
                    lowercase.indexOf('update') >= 0 &&
                    lowercase.indexOf('create') < 0)
            );
        }

        const example = new CommandExample();
        example.Method = this.commandHandler.Command_MethodName;
        example.Command = this.commandHandler.Command_Name;
        example.Id = `/${this.commandGroupHandler.CommandGroup_Key}/${this.methodHandler.Method_HttpMethod}/${id}`;
        example.Title = exampleObj.title || id;
        example.Path = this.methodHandler.Method_Path;
        example.HttpMethod = this.methodHandler.Method_HttpMethod;
        example.ResourceClassName = this.commandGroupHandler.CommandGroup_Key;
        const params = this.GetExampleParameters(exampleObj);
        example.Parameters = this.ConvertToCliParameters(
            params,
            this.commandGroupHandler.CommandGroup_Key,
        );
        example.MethodResponses = this.methodHandler.Method.responses || [];
        example.Method_IsLongRun = !!this.methodHandler.Method.extensions?.[
            'x-ms-long-running-operation'
        ];
        example.ExampleObj = exampleObj;
        if (this.methodHandler.Method_GetSplitOriginalOperation) {
            // filter example by name for generic createorupdate
            if (
                this.commandHandler.Command_MethodName.toLowerCase() === 'update' &&
                !forUpdate(this.baseHandler, id)
            ) {
                return;
            }
            if (
                this.commandHandler.Command_MethodName.toLowerCase() !== 'update' &&
                forUpdate(this.baseHandler, id)
            ) {
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
            example.commandStringItems = this.GetExampleItems(example, false, undefined);
            example.CommandString = example.commandStringItems.join(' ');
            return example;
        }
        return undefined;
    }

    public GetExampleChecks(example: CommandExample): string[] {
        const ret: string[] = [];
        if (!this.configHandler.GenChecks) return ret;
        let resourceObjectName = undefined;
        for (const param of example.Parameters) {
            if (
                example.ResourceClassName &&
                this.resourcePool.isResource(param.defaultName, param.rawValue) ===
                    example.ResourceClassName
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
        parameters.push('az ' + this.commandHandler.Command_Name);

        let hasRG = false;
        let resourceObjectName;
        for (const param of example.Parameters) {
            if (
                minimum &&
                !this.parameterHandler.Parameter_IsRequiredOrCLIRequired(param.methodParam.value)
            )
                continue;
            let paramValue = param.value;
            if (isTest || this.configHandler.FormalizeNames) {
                let replacedValue = this.resourcePool.addParamResource(
                    param.defaultName,
                    paramValue,
                    param.isJson,
                    param.keyValue,
                    isTest,
                );
                if (replacedValue === paramValue) {
                    replacedValue = this.resourcePool.addEndpointResource(
                        paramValue,
                        param.isJson,
                        param.keyValue,
                        [],
                        [],
                        param,
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
                this.resourcePool.isResource(param.defaultName, param.rawValue) ===
                    example.ResourceClassName
            ) {
                resourceObjectName = param.value;
            }
        }

        if (
            isTest &&
            !hasRG &&
            commandParams &&
            commandParams[this.commandHandler.Command_Name] &&
            commandParams[this.commandHandler.Command_Name].has('resourceGroupName')
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
                            !this.parameterHandler.Parameter_IsRequiredOrCLIRequired(
                                param.methodParam.value,
                            )
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
            const showExample = this.commandGroupHandler.CommandGroup_ShowExample;
            if (isNullOrUndefined(showExample)) return [];
            let words = showExample.Command.split(' ');
            words = words.slice(0, words.length - 1);
            words.push('wait');
            parameters.push(`az ${words.join(' ')} --created`);
            for (const param of example.Parameters) {
                const paramKey = param.methodParam.value.language?.['cli']?.cliKey;
                if (
                    showExample.Parameters.some((showParam) => {
                        return (
                            showParam.methodParam.value.language?.['cli']?.cliKey ==
                                param.methodParam.value.language?.['cli']?.cliKey &&
                            showParam.methodParam.value.language?.['default']?.cliKey ==
                                param.methodParam.value.language?.['default']?.cliKey
                        );
                    })
                ) {
                    let paramValue = param.value;
                    let replacedValue = this.resourcePool.addParamResource(
                        param.defaultName,
                        paramValue,
                        param.isJson,
                        param.keyValue,
                    );
                    if (replacedValue === paramValue) {
                        replacedValue = this.resourcePool.addEndpointResource(
                            paramValue,
                            param.isJson,
                            param.keyValue,
                            [],
                            [],
                            param,
                        );
                    }
                    paramValue = replacedValue;
                    let slp = paramValue;
                    if (param.keyValue === KeyValueType.No) {
                        slp = ToJsonString(slp);
                    }
                    parameters.push(param.name + ' ' + slp);
                }
                if (
                    this.resourcePool.isResource(paramKey, param.rawValue) ===
                    example.ResourceClassName
                )
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
        step: TestStepExampleFileRestCall = undefined,
    ): string[][] {
        const ret: string[][] = [];
        this.GetAllExamples(
            id,
            (example) => {
                examples.push(example);
                ret.push(this.GetExampleItems(example, true, commandParams, minimum));
            },
            step?.exampleTemplate,
        );
        return ret;
    }

    public FindExampleWaitById(
        id: string,
        step: TestStepExampleFileRestCall = undefined,
    ): string[][] {
        const ret: string[][] = [];
        this.GetAllExamples(
            id,
            (example) => {
                const waitCmd = this.GetExampleWait(example);
                if (waitCmd.length > 0) ret.push(waitCmd);
            },
            step?.exampleTemplate,
        );
        return ret;
    }

    public GatherInternalResource() {
        const internalResources = {}; // resource_key --> list of resource languages
        this.baseHandler.GetAllMethods(null, () => {
            if (!(this.commandGroupHandler.CommandGroup_Key in internalResources)) {
                internalResources[this.commandGroupHandler.CommandGroup_Key] = [
                    this.commandGroupHandler.CommandGroup_Key,
                ];
            }
            // let commands = this.CommandGroup_Name.split(" ");
            // let resourceName = commands[commands.length - 1] + "-name";
            const resourceName = this.commandGroupHandler.CommandGroup_DefaultName + 'Name';
            if (
                internalResources[this.commandGroupHandler.CommandGroup_Key].indexOf(resourceName) <
                0
            ) {
                internalResources[this.commandGroupHandler.CommandGroup_Key].push(resourceName);
            }
        });
        this.resourcePool.addResourcesInfo(internalResources);

        // find dependency relationships of internalResources
        this.baseHandler.GetAllMethods(null, () => {
            const dependResources = [];
            const dependParameters = [];

            const examples = this.GetExamples(false);
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
                            onResource !== this.commandGroupHandler.CommandGroup_Key &&
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
            const isCreateMehod = this.methodHandler.Method_HttpMethod === 'put';
            if (this.baseHandler.SelectFirstMethodParameter()) {
                do {
                    if (
                        this.methodParameterHandler.MethodParameter.implementation === 'Method' &&
                        !this.methodParameterHandler.MethodParameter_IsFlattened &&
                        this.methodParameterHandler.MethodParameter?.schema?.type !== 'constant'
                    ) {
                        const paramName = this.methodParameterHandler.MethodParameter.language[
                            'cli'
                        ].cliKey;
                        const onResource = this.resourcePool.isResource(paramName, undefined);
                        for (const example of examples) {
                            for (const param of example.Parameters) {
                                if (
                                    onResource &&
                                    onResource !== this.commandGroupHandler.CommandGroup_Key &&
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
                                    onResource === this.commandGroupHandler.CommandGroup_Key &&
                                    createdObjectNames.indexOf(param.value) < 0
                                ) {
                                    createdObjectNames.push(param.value);
                                }
                            }
                        }
                    }
                } while (this.baseHandler.SelectNextMethodParameter());
            }

            this.resourcePool.setResourceDepends(
                this.commandGroupHandler.CommandGroup_Key,
                dependResources,
                dependParameters,
                createdObjectNames,
            );
        });

        if (isNullOrUndefined(this._defaultTestScenario)) {
            const allExamples = this.GetAllExamples();
            this._defaultTestScenario = GenerateDefaultTestScenario(allExamples);
            this._defaultTestScenario = GenerateDefaultTestScenarioByDependency(
                allExamples,
                this.resourcePool,
                this._defaultTestScenario,
            );
            this.SortExamplesByDependency();
            PrintTestScenario(this._defaultTestScenario);
        }

        if (!this._configuredScenario && isNullOrUndefined(this._testScenario)) {
            this._testScenario = GroupTestScenario(
                this._defaultTestScenario,
                this.extensionHandler.Extension_NameUnderscored,
            );
        }

        const commandParams = {};
        this.baseHandler.GetAllMethods(null, () => {
            if (!commandParams[this.commandHandler.Command_Name])
                commandParams[this.commandHandler.Command_Name] = new Set();
            if (this.baseHandler.SelectFirstMethodParameter()) {
                do {
                    if (
                        (this.methodParameterHandler.MethodParameter.implementation === 'Method' ||
                            (this.methodParameterHandler.MethodParameter as any).polyBaseParam) &&
                        !this.methodParameterHandler.MethodParameter_IsFlattened &&
                        this.methodParameterHandler.MethodParameter?.schema?.type !== 'constant'
                    ) {
                        commandParams[this.commandHandler.Command_Name].add(
                            this.methodParameterHandler.MethodParameter.language['cli'].cliKey,
                        );
                    }
                } while (this.baseHandler.SelectNextMethodParameter());
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

    public GetAllExamples(
        id?: string,
        callback?: (example) => void,
        exampleTemplate?: any,
    ): CommandExample[] {
        const ret: CommandExample[] = [];
        let found = false;
        this.baseHandler.GetAllMethods(null, () => {
            if (found) return;
            let examples: CommandExample[];
            if (!isNullOrUndefined(exampleTemplate)) {
                const example = this.GetExampleById(id, exampleTemplate);
                if (isNullOrUndefined(example)) return;
                examples = [example];
            } else {
                examples = this.GetExamples(true);
            }
            for (const example of examples) {
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
