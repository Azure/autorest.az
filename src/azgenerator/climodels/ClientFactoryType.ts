import { ResourceType, CustomResourceType } from './ProfileType';

export class CLIClientFactory {
    // CLI ClientFactory type
    private cliContext: string;
    private resourceType: ResourceType | CustomResourceType;
    private subscriptionId: string;
    private apiVersion: string;
    private extraProperties: [];
}
