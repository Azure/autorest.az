import { SchemaType, Schema } from '@azure-tools/codemodel';
import { values } from '@azure-tools/linq';
import { isNullOrUndefined } from '../../utils/helper';
import { CodeModelCliImpl } from './CodeModelAzImpl';

export interface SchemaModel {
    Schema_MapsTo(Schema);
    Schema_Type(Schema): string;
    Schema_Description(Schema): string;
    Schema_FlattenedFrom(Schema): Schema;
    Schema_IsPositional(Schema): boolean;
}

export class SchemaModelImpl extends CodeModelCliImpl implements SchemaModel {
    public Schema_IsListOfSimple(schema: Schema = this.MethodParameter.schema): boolean {
        // objects that is not base class of polymorphic and satisfy one of the four conditions
        // 1. objects with simple properties
        // 2. or objects with arrays as properties but has simple element type
        // 3. or arrays with simple element types
        // 4. or arrays with object element types but has simple properties
        // 5. or dicts with simple element properties
        // 6. or dicts with arrays as element properties but has simple element type
        if (this.Schema_Type(schema) === SchemaType.Any) {
            return false;
        }
        if (schema?.language?.['cli']?.json === true) {
            return false;
        }
        if (this.Schema_Type(schema) === SchemaType.Array) {
            if (
                schema['elementType'].type === SchemaType.Object ||
                schema['elementType'].type === SchemaType.Dictionary
            ) {
                for (const p of values(schema['elementType']?.properties)) {
                    if (p['readOnly']) {
                        continue;
                    }
                    if (
                        p['schema'].type === SchemaType.Object ||
                        p['schema'].type === SchemaType.Dictionary
                    ) {
                        return false;
                    } else if (p['schema'].type === SchemaType.Array) {
                        if (this.isComplexSchema(p['schema']?.elementType?.type, p['schema'])) {
                            return false;
                        }
                        for (const mp of values(p['schema']?.elementType?.properties)) {
                            if (this.isComplexSchema(mp['schema'].type, mp['schema'])) {
                                return false;
                            }
                        }
                        for (const parent of values(p['schema']?.elementType?.parents?.all)) {
                            for (const pp of values(parent['properties'])) {
                                if (this.isComplexSchema(pp['schema'].type, pp['schema'])) {
                                    return false;
                                }
                            }
                        }
                    } else if (this.isComplexSchema(p['schema'].type, p['schema'])) {
                        return false;
                    }
                }
                return true;
            }
        } else if (this.Schema_Type(schema) === SchemaType.Object) {
            if (
                !isNullOrUndefined(schema['children']) &&
                !isNullOrUndefined(schema['discriminator'])
            ) {
                return false;
            }
            for (const p of values(schema['properties'])) {
                if (p['readOnly']) {
                    continue;
                }
                if (
                    p['schema'].type === SchemaType.Object ||
                    p['schema'].type === SchemaType.Dictionary
                ) {
                    // objects.objects
                    return false;
                } else if (p['schema'].type === SchemaType.Array) {
                    for (const mp of values(p['schema']?.elementType?.properties)) {
                        if (this.isComplexSchema(mp['schema'].type, mp['schema'])) {
                            return false;
                        }
                    }
                    for (const parent of values(p['schema']?.elementType?.parents?.all)) {
                        for (const pp of values(parent['properties'])) {
                            if (this.isComplexSchema(pp['schema'].type, pp['schema'])) {
                                return false;
                            }
                        }
                    }
                } else if (this.isComplexSchema(p['schema'].type, p['schema'])) {
                    // objects.objects
                    return false;
                }
            }
            return true;
        } else if (this.Schema_Type(schema) === SchemaType.Dictionary) {
            if (
                !isNullOrUndefined(schema['children']) &&
                !isNullOrUndefined(schema['discriminator'])
            ) {
                return false;
            }
            const p = schema['elementType'];
            if (p.type === SchemaType.Object || p.type === SchemaType.Dictionary) {
                // dicts.objects or dicts.dictionaries
                return false;
            } else if (p.type === SchemaType.Array) {
                for (const mp of values(p.properties)) {
                    if (mp['readOnly']) {
                        continue;
                    }
                    if (this.isComplexSchema(mp['schema'].type, mp['schema'])) {
                        return false;
                    }
                }
                for (const parent of values(p.schema?.elementType?.parents?.all)) {
                    for (const pp of values(parent['properties'])) {
                        if (pp['readOnly']) {
                            continue;
                        }
                        if (this.isComplexSchema(pp['schema'].type, pp['schema'])) {
                            return false;
                        }
                    }
                }
            } else if (this.isComplexSchema(p.type, p)) {
                // dicts.objects or dicts.dictionaries
                return false;
            }
            return true;
        } else if (this.MethodParameter_Type === SchemaType.Any) {
            return false;
        }
        return false;
    }

    public Schema_IsList(schema: Schema = this.MethodParameter.schema): boolean {
        if (schema.language['cli'].json === true) {
            return true;
        }
        if (this.isComplexSchema(this.Schema_Type(schema), schema)) {
            return true;
        }
        return false;
    }

    public Schema_Description(schema: Schema): string {
        return schema.language['az'].description?.replace(/\r?\n|\r/g, ' ');
    }

    public Schema_FlattenedFrom(schema: Schema): Schema {
        return schema?.language['cli']?.pythonFlattenedFrom;
    }

    public Schema_IsPositional(schema: Schema): boolean {
        return schema?.language?.['cli']?.positional;
    }

    private Schema_IsRequired(param: Parameter): boolean {
        return param?.['targetProperty']?.required;
    }

    public Schema_MapsTo(schema: Schema): string {
        return schema.language['az'].mapsto;
    }

    public Schema_Type(schema: Schema = this.MethodParameter.schema): string {
        if (isNullOrUndefined(schema)) {
            return undefined;
        }
        return schema.type;
    }

}