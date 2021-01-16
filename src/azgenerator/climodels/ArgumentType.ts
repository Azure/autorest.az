import { CLIActionType } from './ActionType';
import { CLIValidatorType } from './ValidatorType';
import { CLICompleterType } from './CompleterType';
import { CLICommand } from './CommandType';

enum LocalContextAction {
    SET = 1,
    GET = 2,
}

class LocalContextAttribute {
    private name: string;
    private actions: LocalContextAction[];
    private scopes: string;
}

export class CLIArgumentType {
    private name: string;
    private optionsList: string[];
    private help: string;
    private idPart: string;
    private action: CLIActionType;
    private argGroup: string;
    private argType: string;
    private type: string;
    private isPreview: boolean;
    private isExperimental: boolean;
    private minApi: string;
    private maxApi: string;
    private default: string | number;
    private validator: CLIValidatorType;
    private nargs: string;
    private required: boolean;
    private completer: CLICompleterType;
    private localContextAttribute: LocalContextAttribute;
    private configuredDefault: string;
    private overrides: string;
    private commands: CLICommand[];
}
