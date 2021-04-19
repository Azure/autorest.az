import { Operation, Parameter } from '@azure-tools/codemodel';
import { isNullOrUndefined } from '../../utils/helper';
import { CommandExample } from './Example';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { CommandGroupModel } from './CommandGroup';

export interface MethodModel {
    Method: Operation;
    Method_IsFirst: boolean;
    Method_IsLast: boolean;
    Method_Name: string;
    Method_NameAz: string;
    Method_NameCli: string;
    Method_Help: string;
    Method_CliKey: string;
    Method_MaxApi: string;
    Method_MinApi: string;
    Method_ResourceType: string | undefined;
    Method_BodyParameterName: string;
    Method_IsLongRun: boolean;
    Method_GetOriginalOperation: any;
    Method_GetSplitOriginalOperation: any;
    Method_GenericSetterParameter(Operation): Parameter;
    Method_NeedGeneric: boolean;
    Method_Mode: string;
    Method_AzExamples: CommandExample[];
    Method_HttpMethod: string;
    Method_Path: string;
    // Method_Features: [string, string];
    // Method_Imports: [string, string[]];
}

export class MethodModelImpl implements MethodModel {
    private commandGroupHandler: CommandGroupModel;
    constructor(public baseHandler: CodeModelCliImpl) {
        const { commandGroupHandler } = baseHandler.GetHandler();
        this.commandGroupHandler = commandGroupHandler;
    }

    public get Method(): Operation {
        if (
            this.baseHandler.currentMethodIndex < 0 ||
            this.baseHandler.currentMethodIndex >=
                this.commandGroupHandler.CommandGroup.operations.length
        ) {
            return undefined;
        }
        return this.commandGroupHandler.CommandGroup.operations[
            this.baseHandler.currentMethodIndex
        ];
    }

    public get Method_IsFirst(): boolean {
        if (this.baseHandler.currentMethodIndex === this.baseHandler.preMethodIndex) {
            return true;
        } else {
            return false;
        }
    }

    public get Method_IsLast(): boolean {
        if (this.baseHandler.currentMethodIndex === this.baseHandler.currentOperationIndex) {
            return true;
        } else {
            let curIndex = this.baseHandler.currentMethodIndex + 1;
            let hasNext = false;
            while (curIndex <= this.baseHandler.currentOperationIndex) {
                if (
                    !this.baseHandler.Operation_IsHidden(
                        this.commandGroupHandler.CommandGroup.operations[curIndex],
                    )
                ) {
                    hasNext = true;
                    break;
                }
                curIndex++;
            }
            return !hasNext;
        }
    }

    public get Method_IsLongRun(): boolean {
        return !!this.Method.extensions?.['x-ms-long-running-operation'];
    }

    public get Method_Name(): string {
        return this.Method.language.python.name;
    }

    public get Method_NameAz(): string {
        return this.Method.language['az'].name;
    }

    public get Method_NameCli(): string {
        return this.Method.language['cli'].name;
    }

    public get Method_CliKey(): string {
        return this.Method.language['cli']?.cliKey;
    }

    public get Method_MaxApi(): string {
        return this.Method.language['cli']?.['max-api'];
    }

    public get Method_MinApi(): string {
        return this.Method.language['cli']?.['min-api'];
    }

    public get Method_ResourceType(): string | undefined {
        return this.baseHandler.formResourceType(this.Method.language['cli']?.['resource-type']);
    }

    public get Method_BodyParameterName(): string {
        return null;
    }

    public get Method_Path(): string {
        return this.Method.requests[0].protocol?.http?.path;
    }

    public get Method_Help(): string {
        return this.Method.language['az'].description.replace(/\n/g, ' ').replace(/"/g, '\\\\"');
    }

    public get Method_HttpMethod(): string {
        const ret = this.Method.requests[0].protocol?.http?.method || 'unknown';
        return ret.toLowerCase();
    }

    public Method_GenericSetterParameter(op: Operation = this.Method): Parameter {
        if (isNullOrUndefined(op)) {
            return null;
        }
        return op['genericSetterParam'];
    }

    public get Method_NeedGeneric(): boolean {
        if (
            this.Method.language['az'].isSplitUpdate &&
            this.commandGroupHandler.CommandGroup_HasShowCommand &&
            !isNullOrUndefined(this.Method_GenericSetterParameter(this.Method_GetOriginalOperation))
        ) {
            return true;
        }
        return false;
    }

    public Get_Method_Name(language = 'az'): string {
        return this.Method.language[language].name;
    }

    public get Method_GetOriginalOperation(): any {
        const polyOriginal = this.Method.extensions?.['cli-poly-as-resource-original-operation'];
        if (
            !isNullOrUndefined(polyOriginal) &&
            !isNullOrUndefined(polyOriginal.extensions?.['cli-split-operation-original-operation'])
        ) {
            const splitOriginal =
                polyOriginal.extensions?.['cli-split-operation-original-operation'];
            return splitOriginal;
        }
        const splittedOriginal = this.Method.extensions?.['cli-split-operation-original-operation'];
        if (!isNullOrUndefined(splittedOriginal)) {
            return splittedOriginal;
        }
        return polyOriginal;
    }

    public get Method_GetSplitOriginalOperation(): any {
        return this.Method.extensions?.['cli-split-operation-original-operation'];
    }

    public get Method_Mode(): string {
        return this.Method?.language?.['cli']?.extensionMode;
    }

    public get Method_AzExamples(): CommandExample[] {
        return this.Method?.['az-examples'];
    }

    public set Method_AzExamples(examples: CommandExample[]) {
        if (isNullOrUndefined(this.Method_AzExamples) || this.Method_AzExamples.length === 0) {
            this.Method['az-examples'] = examples;
        }
    }
}
