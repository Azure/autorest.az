import { Operation, OperationGroup, Parameter } from '@azure-tools/codemodel';
import { isNullOrUndefined } from '../../utils/helper';
import { CliCommandType } from '../../utils/models';
import { CodeModelCliImpl } from './CodeModelAzImpl';

export interface CommandModel {
    Command: Operation;
    Command_Name: string;
    Command_MethodName: string;
    Command_FunctionName: string;
    Command_GetOriginalOperation: any;
    Command_OriginalCommandGroup: OperationGroup;
    Command_ClientFactoryName: string;
    Command_NeedGeneric: boolean;
    Command_MaxApi: string;
    Command_MinApi: string;
    Command_ResourceType: string | undefined;
    Command_GenericSetterParameter(Operation): Parameter;

    Command_Help: string;
    Command_IsLongRun: boolean;
    Command_SubGroupName: string;
    Command_Mode: string;
    Command_Type: string;
    Command_GenericSetterArgName: string;
    // Command_Features: [string, string];
    // Command_Imports: [string, string[]];
}

export class CommandModelImpl extends CodeModelCliImpl implements CommandModel {
    public get Command(): Operation {
        if (
            this.currentOperationIndex < 0 ||
            this.currentOperationIndex >= this.commandGroupHandler.CommandGroup.operations.length
        ) {
            return undefined;
        }
        return this.commandGroupHandler.CommandGroup.operations[this.currentOperationIndex];
    }

    public get Command_FunctionName(): string {
        return this.Command_Name.replace(/( |-)/g, '_');
    }

    public get Command_Name(): string {
        return this.Command.language['az'].command;
    }

    public get Command_MethodName(): string {
        return this.Command.language['az'].name;
    }

    public Command_GenericSetterParameter(op: Operation = this.Command): Parameter {
        if (isNullOrUndefined(op)) {
            return null;
        }
        return op['genericSetterParam'];
    }

    public get Command_Help(): string {
        return this.Command.language['az'].description.replace(/\n/g, ' ').replace(/"/g, '\\\\"');
    }

    public get Command_GetOriginalOperation(): any {
        const polyOriginal = this.Command.extensions?.['cli-poly-as-resource-original-operation'];
        if (
            !isNullOrUndefined(polyOriginal) &&
            !isNullOrUndefined(polyOriginal.extensions?.['cli-split-operation-original-operation'])
        ) {
            const splitOriginal =
                polyOriginal.extensions?.['cli-split-operation-original-operation'];
            return splitOriginal;
        }
        const splittedOriginal = this.Command.extensions?.[
            'cli-split-operation-original-operation'
        ];
        if (!isNullOrUndefined(splittedOriginal)) {
            return splittedOriginal;
        }
        return polyOriginal;
    }

    public get Command_OriginalCommandGroup(): OperationGroup {
        if (!isNullOrUndefined(this.Command.language?.['az']?.['originalOperationGroup'])) {
            return this.Command.language?.['az']?.['originalOperationGroup'];
        }
        return undefined;
    }

    public get Command_ClientFactoryName(): string {
        if (!isNullOrUndefined(this.Command_OriginalCommandGroup)) {
            return this.commandGroupHandler.CommandGroup_ClientFactoryName(
                this.commandHandler.Command_OriginalCommandGroup,
            );
        }
        return undefined;
    }

    public get Command_NeedGeneric(): boolean {
        if (
            this.Command.language['az'].isSplitUpdate &&
            this.commandGroupHandler.CommandGroup_HasShowCommand &&
            !isNullOrUndefined(
                this.Command_GenericSetterParameter(this.Command_GetOriginalOperation),
            )
        ) {
            return true;
        }
        return false;
    }

    public get Command_IsLongRun(): boolean {
        return !!this.Command.extensions?.['x-ms-long-running-operation'];
    }

    public get Command_SubGroupName(): string {
        const subCommandGroupName = this.Command.language['az'].subCommandGroup;
        return isNullOrUndefined(subCommandGroupName) ? '' : subCommandGroupName;
    }

    public get Command_Mode(): string {
        if (isNullOrUndefined(this.Command?.language?.['cli']?.extensionMode)) {
            return this.commandGroupHandler.CommandGroup_Mode;
        }
        return this.Command?.language?.['cli']?.extensionMode;
    }

    public get Command_Type(): string {
        if (this.Command_MethodName === 'show') {
            return CliCommandType.CUSTOM_SHOW_COMMAND;
        } else if (this.Command_NeedGeneric) {
            if (!isNullOrUndefined(this.Command_GenericSetterArgName)) {
                return CliCommandType.GENERIC_UPDATE_COMMAND;
            }
        }
        return CliCommandType.CUSTOM_COMMAND;
    }

    public get Command_GenericSetterArgName(): string {
        const genericParam = this.Command_GenericSetterParameter(this.Command_GetOriginalOperation);
        if (isNullOrUndefined(genericParam)) {
            return undefined;
        }
        return this.parameterHandler.Parameter_NamePython(genericParam);
    }

    public get Command_MaxApi(): string {
        return this.Command.language['cli']?.['max-api'];
    }

    public get Command_MinApi(): string {
        return this.Command.language['cli']?.['min-api'];
    }

    public get Command_ResourceType(): string | undefined {
        return this.formResourceType(this.Command.language['cli']?.['resource-type']);
    }
}
