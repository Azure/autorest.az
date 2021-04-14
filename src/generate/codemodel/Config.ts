import { isNullOrUndefined } from '../../utils/helper';
import { AzConfiguration, CodeGenConstants, GenerationMode } from '../../utils/models';
import { CodeModelCliImpl } from './CodeModelAzImpl';

export interface ConfigModel {
    CliGenerationMode: GenerationMode;
    AzextFolder: string;
    CliCoreLib: string;
    IsCliCore: boolean;
    minCliCoreVersion: string;
    SDK_NeedSDK: boolean;
    SDK_IsTrack1: boolean;
    SDK_NoFlatten: boolean;
    AzureCliFolder: string;
    AzureCliExtFolder: string;
    azOutputFolder: string;
    ConfiguredScenario: boolean;
    ResourceType: string | undefined;
    GetPythonNamespace(): string;
    GetPythonPackageName(): string;
}

export class ConfigModelImpl extends CodeModelCliImpl implements ConfigModel {
    public get CliGenerationMode(): GenerationMode {
        return AzConfiguration.getValue(CodeGenConstants.generationMode);
    }

    public get CliCoreLib(): string {
        if (isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.cliCoreLib))) {
            return CodeGenConstants.DEFAULT_CLI_CORE_LIB;
        }
        return AzConfiguration.getValue(CodeGenConstants.cliCoreLib);
    }

    public get AzureCliFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azureCliFolder);
    }

    public get AzureCliExtFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azureCliExtFolder);
    }

    public get AzextFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azextFolder);
    }

    public get azOutputFolder(): string {
        return AzConfiguration.getValue(CodeGenConstants.azOutputFolder);
    }

    public get IsCliCore() {
        return AzConfiguration.getValue(CodeGenConstants.isCliCore);
    }

    public get minCliCoreVersion(): string {
        return CodeGenConstants.minCliCoreVersion;
    }

    public get SDK_NeedSDK() {
        return AzConfiguration.getValue(CodeGenConstants.sdkNeeded);
    }

    public get SDK_IsTrack1() {
        return AzConfiguration.getValue(CodeGenConstants.sdkTrack1);
    }

    public get SDK_NoFlatten() {
        return AzConfiguration.getValue(CodeGenConstants.sdkNoFlatten);
    }

    public get ConfiguredScenario(): boolean {
        // judge test-scenario whether have value
        return this._configuredScenario;
    }

    public get ResourceType(): string | undefined {
        return this.formResourceType(this.options?.['resource-type']);
    }

    public get GenChecks(): boolean {
        const disableChecks = this.options?.['disable-checks'];
        if (disableChecks) return false;
        return true;
    }

    public get GetTestUniqueResource(): boolean {
        const ret = this.options?.[CodeGenConstants.testUniqueResource];
        if (ret) return true;
        return false;
    }

    public get GenMinTest(): boolean {
        const genMinTest = this.options?.['gen-min-test'];
        if (genMinTest) return true;
        return false;
    }

    public GetPythonNamespace(): string {
        return AzConfiguration.getValue(CodeGenConstants.pythonNamespace);
    }

    public GetPythonPackageName(): string {
        return this.options['package-name'];
    }
}
