import { isGeneratedExampleId, ToMultiLine } from '../../utils/helper';
import { CodeGenConstants } from '../../utils/models';
import { CommandExample } from './CodeModelAz';
import { CodeModelCliImpl } from './CodeModelAzImpl';
import { MethodModel } from './Method';

export interface AzExampleModel {
    AzExample: CommandExample;
    AzExample_CommandString: string;
    AzExample_CommandStringItems: string[];
}

export class AzExampleModelImpl implements AzExampleModel {
    private methodHandler: MethodModel;
    constructor(public baseHandler: CodeModelCliImpl) {
        const { methodHandler } = baseHandler.GetHandler();
        this.methodHandler = methodHandler;
    }
    public get AzExample(): CommandExample {
        if (
            this.baseHandler.currentAzExampleIndex < 0 ||
            this.baseHandler.currentAzExampleIndex >= this.methodHandler.Method_AzExamples.length
        ) {
            return undefined;
        }
        return this.methodHandler.Method_AzExamples[this.baseHandler.currentAzExampleIndex];
    }

    public get AzExample_CommandString(): string {
        return this.AzExample.CommandString;
    }

    public get AzExample_Id(): string {
        return this.AzExample.Id;
    }

    public get AzExample_HttpMethod(): string {
        return this.AzExample.HttpMethod;
    }

    public get AzExample_CommandStringItems(): string[] {
        const items = [];
        ToMultiLine(
            this.AzExample_CommandString,
            items,
            CodeGenConstants.PYLINT_MAX_CODE_LENGTH,
            true,
        );
        return items;
    }

    public get AzExample_RawCommandStringItems(): string[] {
        return this.AzExample.commandStringItems;
    }

    public get AzExample_IsGenerated(): boolean {
        return isGeneratedExampleId(this.AzExample?.Id);
    }
}
