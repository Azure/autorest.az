import { CLIClientFactory } from './ClientFactoryType';
import { CLICommandGroup } from './CommandGroupType';
import { CLICommand } from './CommandType';
import { CLIArgumentType } from './ArgumentType';

export class CLIModule {
    clientFactory: CLIClientFactory;
    commandGroups: CLICommandGroup[];
    commands: CLICommand[];
    parameters: CLIArgumentType[];
}