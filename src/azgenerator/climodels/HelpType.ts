class ParameterEntryType {
    private name: string[];
    private type: string;
    private shortSummary: string;
    private longSummary: string;
    private populatorCommands: string[];
    private extraProperties: [];
}

class ExampleEntryType {
    private name: string;
    private text: string;
    private unsupportedProfiles: string;
    private supportedProfiles: string;
    private crefted: boolean;
}

export class CLIHelpType {
    private entryKey: string;
    private entryType: string;
    private shortSummary: string;
    private longSummary: string;
    private parameterEntries: ParameterEntryType[];
    private exampleEntries: ExampleEntryType[];
    private extraProperties: string[];
}
