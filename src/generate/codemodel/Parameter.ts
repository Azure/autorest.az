import { Channel } from '@autorest/extension-base';
import { Parameter, SchemaType } from '@azure-tools/codemodel';
import { isNullOrUndefined } from '../../utils/helper';
import { EXCLUDED_PARAMS } from '../../utils/models';
import { CodeModelCliImpl } from './CodeModelAzImpl';

export interface ParameterModel {
    Parameter_Type(Parameter): string;
    Parameter_IsList(Parameter): boolean;
    Parameter_IsListOfSimple(Parameter): boolean;
    Parameter_IsPolyOfSimple(Parameter?): boolean;
    Parameter_SetAzNameMapsTo(string, Parameter): void;
    Parameter_InGlobal(Parameter): boolean;
    Parameter_IsHidden(Parameter): boolean;
    Parameter_IsFlattened(Parameter): boolean;
    Parameter_IsCliFlattened(Parameter): boolean;
    Parameter_MapsTo(Parameter): string;
    Parameter_SubMapsTo(subMethodName, Parameter): string;
    Parameter_Name(Parameter?): string;
    Parameter_NameAz(Parameter): string;
    Parameter_CliKey(Parameter): string;
    Parameter_NamePython(Parameter): string;
    Parameter_Description(Parameter): string;
    Parameter_DefaultValue(Parameter): any | undefined;
    Parameter_DefaultConfigKey(Parameter): string | undefined;
    Parameter_IsPositional(Parameter): boolean;
    Parameter_IsShorthandSyntax(Parameter): boolean;
    Parameter_PositionalKeys(param: Parameter, subMethodParams: Parameter[]): string[];
    Parameter_IsSimpleArray(param: Parameter): boolean;
    Parameter_IsRequired(param: Parameter): boolean;
    Parameter_IsRequiredOrCLIRequired(param: Parameter): boolean;
}

export class ParameterModelImpl extends CodeModelCliImpl implements ParameterModel {
    public Parameter_IsHidden(parameter: Parameter): boolean {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'hidden')) {
            // Handle complex
            let shouldHidden;
            let defaultValue;
            let hasDefault = false;
            if (this.EnterSubMethodParameters(parameter)) {
                shouldHidden = true;
                defaultValue = '{';
                if (this.SelectFirstMethodParameter()) {
                    do {
                        if (
                            this.Parameter_Type(this.SubMethodParameter) !== SchemaType.Constant &&
                            this.SubMethodParameter['readOnly'] !== true
                        ) {
                            shouldHidden = false;
                            break;
                        } else if (
                            this.Parameter_Type(this.SubMethodParameter) === SchemaType.Constant
                        ) {
                            defaultValue =
                                defaultValue +
                                '"' +
                                this.Parameter_NameAz(this.SubMethodParameter) +
                                '": "' +
                                this.Parameter_DefaultValue(this.SubMethodParameter) +
                                '"';
                            hasDefault = true;
                        }
                    } while (this.SelectNextMethodParameter());
                }
                if (
                    shouldHidden === true &&
                    (hasDefault || this.schemaHandler.Schema_IsRequired(parameter))
                ) {
                    defaultValue = defaultValue + '}';
                } else {
                    defaultValue = undefined;
                }
                this.ExitSubMethodParameters();
            }

            // Handle simple parameter
            if (parameter?.language?.['cli']?.removed || parameter?.language?.['cli']?.hidden) {
                if (
                    this.Parameter_DefaultValue(parameter) === undefined &&
                    parameter.required === true
                ) {
                    parameter.language['az'].hidden = false;
                    this.session.message({
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

    public Parameter_DefaultValue(parameter: Parameter): string | undefined {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'default-value')) {
            if (
                Object.prototype.hasOwnProperty.call(parameter?.language?.['cli'], 'default-value')
            ) {
                parameter.language['az']['default-value'] =
                    parameter.language['cli']['default-value'];
            } else if (parameter.schema.type === SchemaType.Constant) {
                parameter.language['az']['default-value'] = parameter.schema?.['value']?.value;
            } else {
                parameter.language['az']['default-value'] = parameter.schema.defaultValue;
            }
        }

        return parameter.language['az']['default-value'];
    }

    public Parameter_DefaultConfigKey(parameter: Parameter): string | undefined {
        if (!Object.prototype.hasOwnProperty.call(parameter.language['az'], 'default-config-key')) {
            if (
                Object.prototype.hasOwnProperty.call(
                    parameter?.language?.['cli'],
                    'default-config-key',
                )
            ) {
                parameter.language['az']['default-config-key'] =
                    parameter.language['cli']['default-config-key'];
            }
        }
        return parameter.language['az']['default-config-key'];
    }

    public Parameter_Description(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): string {
        return param.language['az'].description?.replace(/\r?\n|\r/g, ' ');
    }

    public Parameter_InGlobal(parameter: Parameter): boolean {
        if (this.codeModel.globalParameters.indexOf(parameter) > -1) {
            return true;
        }
        return false;
    }

    public Parameter_Name(param: Parameter = this.methodParameterHandler.MethodParameter): string {
        return param.language['az'].name.replace(/-/g, '_');
    }

    public Parameter_NameAz(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): string {
        return param.language['az'].name;
    }

    public Parameter_CliKey(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): string {
        return param.language['cli']?.cliKey;
    }

    public Parameter_NamePython(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): string {
        if (
            this.configHandler.SDK_IsTrack1 &&
            !isNullOrUndefined(param.language['cli']?.track1_name)
        ) {
            return param.language['cli']?.track1_name;
        }
        return param.language?.python?.name;
    }

    public Parameter_IsPositional(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        if (param?.schema && this.schemaHandler.Schema_IsPositional(param.schema)) {
            return true;
        }
        return !!param?.language?.['cli']?.positional;
    }

    public Parameter_IsRequired(param: Parameter): boolean {
        return param?.required;
    }

    public Parameter_IsRequiredOrCLIRequired(param: Parameter): boolean {
        return this.Parameter_IsRequired(param) || param?.language?.['cli']?.required;
    }

    public Parameter_SetAzNameMapsTo(
        newName: string,
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): void {
        if (!isNullOrUndefined(param['nameBaseParam'])) {
            param['nameBaseParam'].subParams[
                this.methodHandler.Method.language['cli'].name
            ] = newName;
        }
        param.language['az'].mapsto = newName;
    }

    public Parameter_MapsTo(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): string {
        if (EXCLUDED_PARAMS.indexOf(param.language['az'].mapsto) > -1) {
            param.language['az'].mapsto = 'gen_' + param.language['az'].mapsto;
        }
        return param.language['az'].mapsto;
    }

    public Parameter_SubMapsTo(
        subMethodName: string,
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ) {
        if (!isNullOrUndefined(param?.['subParams']?.[subMethodName])) {
            return param['subParams'][subMethodName];
        }
        return this.Parameter_MapsTo(param);
    }

    public Parameter_Type(param: Parameter = this.methodParameterHandler.MethodParameter): string {
        return this.schemaHandler.Schema_Type(param?.schema);
    }

    public Parameter_IsFlattened(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        return !!param.flattened;
    }

    public Parameter_IsShorthandSyntax(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        return !!param.language['cli']?.shorthandSyntax;
    }

    public Parameter_IsCliFlattened(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        if (
            param?.language?.['cli']?.['cli-flattened'] &&
            !param.language['cli']['cli-m4-flattened']
        ) {
            if (param['nameBaseParam']?.language?.['cli']?.['cli-m4-flattened']) {
                return false;
            }
            return true;
        }
        return false;
    }

    public Parameter_IsListOfSimple(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        // objects that is not base class of polymorphic and satisfy one of the four conditions
        // 1. objects with simple properties
        // 2. or objects with arrays as properties but has simple element type
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        // 5. or dicts with simple element properties
        // 6. or dicts with arrays as element properties but has simple element type
        if (this.Parameter_Type(param) === SchemaType.Any) {
            return false;
        }
        if (this.Parameter_IsFlattened(param)) {
            return false;
        }
        if (param.language['cli'].json === true) {
            return false;
        }
        return this.schemaHandler.Schema_IsListOfSimple(param.schema);
    }

    public Parameter_IsList(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        if (this.Parameter_IsFlattened(param)) {
            return false;
        }

        if (this.isComplexSchema(this.Parameter_Type(param), param)) {
            return true;
        }
        return false;
    }

    public Parameter_PositionalKeys(param: Parameter, subMethodParams: Parameter[]): string[] {
        let keys = [];
        if (!(this.Parameter_IsList(param) && this.Parameter_IsListOfSimple(param))) {
            return null;
        }
        if (
            !isNullOrUndefined(param.language?.['az']?.positionalKeys) &&
            Array.isArray(param.language?.['az']?.positionalKeys)
        ) {
            keys = param.language?.['az']?.positionalKeys;
        }

        if (
            keys.length === 0 &&
            !isNullOrUndefined(param.schema.language?.['cli']?.positionalKeys) &&
            Array.isArray(param.schema.language?.['cli']?.positionalKeys)
        ) {
            keys = param.schema.language?.['cli']?.positionalKeys;
        }

        const allPossibleKeys = [];
        const requiredKeys = [];
        for (const subMethodParam of subMethodParams) {
            if (subMethodParam['readOnly']) {
                continue;
            }
            if (subMethodParam.schema?.type === SchemaType.Constant) {
                continue;
            }
            allPossibleKeys.push(this.Parameter_NamePython(subMethodParam));
            if (subMethodParam.required || subMethodParam.language?.['cli'].required) {
                if (!this.Parameter_IsHidden(subMethodParam)) {
                    requiredKeys.push(this.Parameter_NamePython(subMethodParam));
                }
            }
        }

        const coveredResult = keys.every((val) => allPossibleKeys.includes(val));
        const requiredCovered = requiredKeys.every((val) => keys.includes(val));

        if (keys.length > 0) {
            if (coveredResult && requiredCovered) {
                return keys;
            } else {
                let text = '';
                if (!coveredResult) {
                    text +=
                        'The defined positional keys for ' +
                        this.Parameter_CliKey(param) +
                        ' contains invalid keys. All possible keys are: ' +
                        allPossibleKeys.join(', ') +
                        ' \n';
                }
                if (!requiredCovered) {
                    text +=
                        'The defined positional keys for ' +
                        this.Parameter_CliKey(param) +
                        " doesn't contain all required keys. All required keys are: " +
                        requiredKeys.join(', ') +
                        ' \n';
                }
                this.session.message({ Channel: Channel.Fatal, Text: text });
                return null;
            }
        }

        return allPossibleKeys;
    }

    public Parameter_IsPolyOfSimple(
        param: Parameter = this.methodParameterHandler.MethodParameter,
    ): boolean {
        if (!isNullOrUndefined(param['isPolyOfSimple'])) {
            return param['isPolyOfSimple'];
        }
        if (
            param?.schema?.type === SchemaType.Object &&
            !isNullOrUndefined(param.schema['children']) &&
            !isNullOrUndefined(param.schema['discriminator'])
        ) {
            let isSimplePoly = true;
            for (const child of param.schema['children'].all) {
                if (
                    this.schemaHandler.Schema_IsList(child) &&
                    this.schemaHandler.Schema_IsListOfSimple(child)
                ) {
                    continue;
                }
                isSimplePoly = false;
                break;
            }
            if (isSimplePoly) {
                param['isPolyOfSimple'] = true;
            } else {
                param['isPolyOfSimple'] = false;
            }
            return isSimplePoly;
        }
        return false;
    }

    public Parameter_IsSimpleArray(param: Parameter): boolean {
        if (this.Parameter_Type(param) === SchemaType.Array) {
            const elementType = param.schema['elementType'].type;
            if (!this.isComplexSchema(elementType, param.schema)) {
                return true;
            }
        }
        return false;
    }
}
