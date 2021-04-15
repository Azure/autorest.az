import { Channel } from '@autorest/extension-base';
import { Parameter, ParameterLocation, SchemaType } from '@azure-tools/codemodel';
import { isNullOrUndefined } from '../../utils/helper';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { CommandGroupModel } from './CommandGroup';
import { MethodModel } from './Method';
import { ParameterModel } from './Parameter';
import { SchemaModel } from './Schema';

export interface MethodParameterModel {
    MethodParameter_Name: string;
    MethodParameter_NameAz: string;
    MethodParameter_ActionName: string;
    MethodParameter_CliKey: string;
    MethodParameter_MaxApi: string;
    MethodParameter_MinApi: string;
    MethodParameter_ResourceType: string | undefined;
    MethodParameter_IsArray: boolean;
    MethodParameter_NamePython: string;
    MethodParameter_MapsTo: string;
    MethodParameter_Description: string;
    MethodParameter_Type: string;
    MethodParameter_IsList: boolean;
    MethodParameter_IsSimpleArray: boolean;
    MethodParameter_IsListOfSimple: boolean;
    MethodParameter_IsPolyOfSimple: boolean;
    MethodParameter_IsDiscriminator: boolean;
    MethodParameter_IdPart: string;
    MethodParameter_ArgGroup: string;
    // MethodParameter_Features: [string, string];
    // MethodParameter_Imports: [string, string[]];
    MethodParameter: Parameter;
    SubMethodParameter: Parameter;

    MethodParameter_In: string;
    MethodParameter_IsHidden: boolean;
    MethodParameter_IsRequired: boolean;
    MethodParameter_IsFlattened: boolean;
    MethodParameter_IsCliFlattened: boolean;
    MethodParameter_RequiredByMethod: boolean;
    MethodParameter_EnumValues: string[];
    MethodParameter_DefaultValue: any | undefined;
    MethodParameter_DefaultConfigKey: string | undefined;
    MethodParameter_Mode: string;
    MethodParameter_IsPositional: boolean;
    MethodParameter_IsShorthandSyntax: boolean;
    MethodParameter_PositionalKeys: string[];
}

export class MethodParameterModelImpl implements MethodParameterModel {
    private commandGroupHandler: CommandGroupModel;
    private methodHandler: MethodModel;
    private parameterHandler: ParameterModel;
    private schemaHandler: SchemaModel;
    constructor(public baseHandler: CodeModelCliImpl) {
        const { commandGroupHandler, methodHandler, parameterHandler } = baseHandler.GetHandler();
        this.commandGroupHandler = commandGroupHandler;
        this.methodHandler = methodHandler;
        this.parameterHandler = parameterHandler;
    }
    public get MethodParameter(): Parameter {
        return this.baseHandler.MethodParameters[this.baseHandler.currentParameterIndex];
    }

    public get MethodParameter_ActionName() {
        const schema = this.MethodParameter.schema;
        if (this.baseHandler.paramActionNameReference.has(schema)) {
            return this.baseHandler.paramActionNameReference.get(schema);
        }
        return undefined;
    }

    public get MethodParameter_Name(): string {
        return this.parameterHandler.Parameter_Name(this.MethodParameter);
    }

    public get MethodParameter_NameAz(): string {
        return this.parameterHandler.Parameter_NameAz(this.MethodParameter);
    }

    public get MethodParameter_CliKey(): string {
        return this.parameterHandler.Parameter_CliKey(this.MethodParameter);
    }

    public get MethodParameter_MaxApi(): string {
        return this.MethodParameter.language['cli']?.['max-api'];
    }

    public get MethodParameter_MinApi(): string {
        return this.MethodParameter.language['cli']?.['min-api'];
    }

    public get MethodParameter_ResourceType(): string | undefined {
        return this.baseHandler.formResourceType(
            this.MethodParameter.language['cli']?.['resource-type'],
        );
    }

    public get MethodParameter_IdPart(): string {
        return this.MethodParameter.language['az'].id_part;
    }

    public get MethodParameter_IsArray(): boolean {
        if (!isNullOrUndefined(this.baseHandler.submethodparameters)) {
            return (
                this.baseHandler.submethodparameters[this.baseHandler.currentSubOptionIndex].schema
                    ?.type === SchemaType.Array
            );
        } else {
            return this.MethodParameter.schema?.type === SchemaType.Array;
        }
    }

    public get MethodParameter_NamePython(): string {
        return this.parameterHandler.Parameter_NamePython(this.MethodParameter);
    }

    public get MethodParameter_MapsTo(): string {
        return this.parameterHandler.Parameter_MapsTo(this.MethodParameter);
    }
    public get MethodParameter_Description(): string {
        return this.parameterHandler.Parameter_Description(this.MethodParameter);
    }

    public get MethodParameter_Type(): string {
        return this.parameterHandler.Parameter_Type(this.MethodParameter);
    }

    public get MethodParameter_IsList(): boolean {
        return this.parameterHandler.Parameter_IsList(this.MethodParameter);
    }

    public get MethodParameter_ArgGroup(): string {
        return this.MethodParameter.language['az']?.arg_group;
    }

    public get MethodParameter_Mode() {
        if (isNullOrUndefined(this.MethodParameter?.language?.['cli']?.extensionMode)) {
            return this.methodHandler.Method_Mode;
        }
        return this.MethodParameter?.language?.['cli']?.extensionMode;
    }

    public get MethodParameter_IsPositional(): boolean {
        return this.parameterHandler.Parameter_IsPositional(this.MethodParameter);
    }

    public get MethodParameter_IsShorthandSyntax(): boolean {
        return this.parameterHandler.Parameter_IsShorthandSyntax(this.MethodParameter);
    }

    public get MethodParameter_IsListOfSimple(): boolean {
        return this.parameterHandler.Parameter_IsListOfSimple(this.MethodParameter);
    }

    public get MethodParameter_IsPolyOfSimple(): boolean {
        return this.parameterHandler.Parameter_IsPolyOfSimple(this.MethodParameter);
    }

    public get MethodParameter_IsDiscriminator(): boolean {
        return (
            this.methodHandler.Method_GetOriginalOperation &&
            this.MethodParameter['targetProperty'] &&
            this.MethodParameter['targetProperty']['isDiscriminator']
        );
    }

    public get SubMethodParameter(): Parameter {
        if (!isNullOrUndefined(this.baseHandler.submethodparameters)) {
            return this.baseHandler.submethodparameters[this.baseHandler.currentSubOptionIndex];
        }
        return null;
    }

    public get MethodParameter_EnumValues(): string[] {
        const mtype = this.MethodParameter.schema.type;
        if (mtype === SchemaType.Choice || mtype === SchemaType.SealedChoice) {
            const enumArray = [];
            const schema = this.MethodParameter.schema;
            for (const item of schema['choices']) {
                enumArray.push(item.value);
            }
            return enumArray;
        } else {
            return [];
        }
    }

    public get MethodParameter_In(): string {
        const protocol = this.MethodParameter.protocol;
        return protocol !== undefined &&
            protocol.http !== undefined &&
            protocol.http.in !== undefined
            ? protocol.http.in
            : ParameterLocation.Body;
    }

    public get MethodParameter_IsHidden(): boolean {
        return this.Parameter_IsHidden(this.MethodParameter);
    }

    public Parameter_IsHidden(parameter: Parameter): boolean {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'hidden')) {
            // Handle complex
            let shouldHidden;
            let defaultValue;
            let hasDefault = false;
            if (this.baseHandler.EnterSubMethodParameters(parameter)) {
                shouldHidden = true;
                defaultValue = '{';
                if (this.baseHandler.SelectFirstMethodParameter()) {
                    do {
                        if (
                            this.parameterHandler.Parameter_Type(this.SubMethodParameter) !==
                                SchemaType.Constant &&
                            this.SubMethodParameter['readOnly'] !== true
                        ) {
                            shouldHidden = false;
                            break;
                        } else if (
                            this.parameterHandler.Parameter_Type(this.SubMethodParameter) ===
                            SchemaType.Constant
                        ) {
                            defaultValue =
                                defaultValue +
                                '"' +
                                this.parameterHandler.Parameter_NameAz(this.SubMethodParameter) +
                                '": "' +
                                this.parameterHandler.Parameter_DefaultValue(
                                    this.SubMethodParameter,
                                ) +
                                '"';
                            hasDefault = true;
                        }
                    } while (this.baseHandler.SelectNextMethodParameter());
                }
                if (
                    shouldHidden === true &&
                    (hasDefault || this.parameterHandler.Parameter_IsRequired(parameter))
                ) {
                    defaultValue = defaultValue + '}';
                } else {
                    defaultValue = undefined;
                }
                this.baseHandler.ExitSubMethodParameters();
            }

            // Handle simple parameter
            if (parameter?.language?.['cli']?.removed || parameter?.language?.['cli']?.hidden) {
                if (
                    this.parameterHandler.Parameter_DefaultValue(parameter) === undefined &&
                    parameter.required === true
                ) {
                    parameter.language['az'].hidden = false;
                    this.baseHandler.session.message({
                        Channel: Channel.Warning,
                        Text:
                            'OperationGroup ' +
                            this.commandGroupHandler.CommandGroup.language['az'].name +
                            ' operation ' +
                            this.methodHandler.Method_Name +
                            ' parameter ' +
                            parameter.language['az'].name +
                            ' should not be hidden while it is required without default value',
                    });
                } else {
                    parameter.language['az'].hidden = true;
                }
            } else {
                parameter.language['az'].hidden = parameter['hidden'] ?? shouldHidden ?? false;
                if (
                    !Object.prototype.hasOwnProperty.call(
                        parameter.language['az'],
                        'default-value',
                    ) &&
                    defaultValue !== undefined
                ) {
                    parameter.language['az']['default-value'] = defaultValue;
                }
            }
        }

        return parameter.language['az'].hidden;
    }

    public get MethodParameter_DefaultValue(): string | undefined {
        return this.parameterHandler.Parameter_DefaultValue(this.MethodParameter);
    }

    public get MethodParameter_DefaultConfigKey(): string | undefined {
        return this.parameterHandler.Parameter_DefaultConfigKey(this.MethodParameter);
    }

    public get MethodParameter_IsRequired(): boolean {
        return this.parameterHandler.Parameter_IsRequired(this.MethodParameter);
    }

    public get MethodParameter_IsFlattened(): boolean {
        return this.parameterHandler.Parameter_IsFlattened(this.MethodParameter);
    }

    public get MethodParameter_IsCliFlattened(): boolean {
        return this.parameterHandler.Parameter_IsCliFlattened(this.MethodParameter);
    }

    public get MethodParameter_RequiredByMethod(): boolean {
        return this.MethodParameter['RequiredByMethod'];
    }

    public get MethodParameter_IsSimpleArray(): boolean {
        return this.parameterHandler.Parameter_IsSimpleArray(this.MethodParameter);
    }

    public get MethodParameter_PositionalKeys(): string[] {
        const subMethodParams: Parameter[] = [];
        if (this.baseHandler.EnterSubMethodParameters()) {
            if (this.baseHandler.SelectFirstMethodParameter(true)) {
                do {
                    subMethodParams.push(this.SubMethodParameter);
                } while (this.baseHandler.SelectNextMethodParameter(true));
            }
            this.baseHandler.ExitSubMethodParameters();
        }
        return this.parameterHandler.Parameter_PositionalKeys(
            this.baseHandler.methodParameterHandler.MethodParameter,
            subMethodParams,
        );
    }
}
