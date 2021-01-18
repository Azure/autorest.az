import { CLIClientFactory } from './ClientFactoryType';
import { CustomResourceType, ResourceType } from './ProfileType';
import { CLITransformer } from './TransformerType';

export class CLICommandGroup {
    private commandGroupName: string;
    private customFuncName: string;
    private operationTmpl: string;
    private clientFactory: CLIClientFactory;
    private resourceType: ResourceType | CustomResourceType;
    private tableTransformer: CLITransformer;
    private transform: CLITransformer;
    private extraProperties: [];
}
