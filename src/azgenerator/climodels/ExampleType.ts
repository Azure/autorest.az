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
    public CommandString: string;
    public WaitCommandString: string;
}
