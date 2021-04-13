import { isNullOrUndefined, ToSentence } from '../../utils/helper';
import { AzConfiguration, CodeGenConstants } from '../../utils/models';
import { CodeModelCliImpl } from './CodeModelAzImpl';

export interface ExtensionModel {
    Extension_Name: string;
    Extension_Parent: string;
    Extension_Description: string;
    Extension_NameUnderscored: string;
    Extension_NameClass: string;
    Extension_TestScenario: any;
    Extension_DefaultTestScenario: any;
    Extension_ClientSubscriptionBound: boolean;
    Extension_ClientBaseUrlBound: boolean;
    Extension_ClientAuthenticationPolicy: string;
    Extension_Mode: string;
}

export class ExtensionModelImpl extends CodeModelCliImpl implements ExtensionModel {
    public get Extension_Name(): string {
        return this.extensionName;
    }

    public get Extension_Parent(): string {
        return this.parentExtension;
    }

    public get Extension_Description(): string {
        if (!isNullOrUndefined(AzConfiguration.getValue(CodeGenConstants.extensionDescription))) {
            return 'Manage ' + AzConfiguration.getValue(CodeGenConstants.extensionDescription);
        }
        return (
            'Manage ' +
            ToSentence(this.Extension_NameClass.replace(/ManagementClient|Client/gi, ''))
        );
    }

    public get Extension_Mode(): string {
        let extensionMode = AzConfiguration.getValue(CodeGenConstants.extensionMode);
        this.codeModel.operationGroups.forEach((operationGroup) => {
            if (
                operationGroup.language['az'].command === this.Extension_Name &&
                !isNullOrUndefined(operationGroup.language?.['cli']?.extensionMode)
            ) {
                extensionMode = operationGroup.language?.['cli']?.extensionMode;
            }
        });
        return extensionMode;
    }

    public get Extension_NameUnderscored(): string {
        return this.Extension_Name.replace(/-/g, '_');
    }

    public get Extension_NameClass(): string {
        return this.codeModel.info['pascal_case_title'];
    }

    public get Extension_TestScenario(): any {
        return this._testScenario;
    }

    public get Extension_DefaultTestScenario(): any {
        return this._defaultTestScenario;
    }

    public get Extension_ClientSubscriptionBound(): boolean {
        return this._clientSubscriptionBound;
    }

    public get Extension_ClientBaseUrlBound(): boolean {
        return this._clientBaseUrlBound;
    }

    public get Extension_ClientAuthenticationPolicy(): string {
        return this._clientAuthenticationPolicy;
    }
}
