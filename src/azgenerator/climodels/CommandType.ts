import { CLIClientFactory } from './ClientFactoryType';
import { CustomResourceType, ResourceType } from './ProfileType';
import { CLITransformer } from './TransformerType';
import { CLIExceptionHandler } from './ExceptionHandlerType';
import { CLIArgumentType } from './ArgumentType';

enum CommandType {
    Show,
    GenericUpdate,
    Custom,
}

export class CLICommandType {
    private commandName: string;
    private commandType: CommandType;
    private customFuncName: string;
    private operationTmpl: string;
    private clientFactory: CLIClientFactory;
    private resourceType: ResourceType | CustomResourceType;
    private tableTransformer: CLITransformer;
    private transform: CLITransformer;
    private getterName: string;
    private setterName: string;
    private getterType: string;
    private setterType: string;
    private confirmation: boolean;
    private customCommandType: CLICommandType;
    private supportNoWait: boolean;
    private exceptionHandler: CLIExceptionHandler;
    private docSourceString: string;
    private supportsLocalCache: string;
    private deprecateInfo: string;
    private extraProperties: [];
    private parameters: CLIArgumentType[];
}
