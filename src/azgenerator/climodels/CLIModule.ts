import { CLIClientFactory } from './ClientFactoryType';
import { CLICommandGroup } from './CommandGroupType';
import { CLICommand } from './CommandType';
import { CLIArgumentType } from './ArgumentType';
import { Template } from '../../utils/models';
import { AzGeneratorBase } from '../AzGeneratorBase';
import { AzGeneratorFactory } from '../AzGeneratorFactory';

export class CLIModule {
    clientFactory: CLIClientFactory;
    commandGroups: CLICommandGroup[];
    commands: CLICommand[];
    parameters: CLIArgumentType[];
    templates: Template[];

    public render() {
        //let generator AzGeneratorFactory.createAzGenerator();
    }
}