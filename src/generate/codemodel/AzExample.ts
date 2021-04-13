import { CommandExample } from "./CodeModelAz";
import { CodeModelCliImpl } from "./CodeModelAzImpl";

export interface AzExample {
    AzExample: CommandExample;
    AzExample_CommandString: string;
    AzExample_CommandStringItems: string[];
}

export class AzExampleImpl extends CodeModelCliImpl implements AzExample {
    public get AzExample(): CommandExample {
        if (
            this.currentAzExampleIndex < 0 ||
            this.currentAzExampleIndex >= this.Method_AzExamples.length
        ) {
            return undefined;
        }
        return this.Method_AzExamples[this.currentAzExampleIndex];
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