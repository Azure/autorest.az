import { EnglishPluralizationService } from '@azure-tools/codegen';
import { OperationGroup } from '@azure-tools/codemodel';
import { changeCamelToDash, isNullOrUndefined } from '../../utils/helper';
import { ExtensionMode } from '../../utils/models';
import { CodeModelCliImpl } from './CodeModelAzImpl';

export interface CommandGroupModel {
    CommandGroup: OperationGroup;
    CommandGroup_Name: string;
    CommandGroup_Help: string;
    CommandGroup_DefaultName: string;
    CommandGroup_Key: string;
    CommandGroup_HasShowCommand: boolean;
    CommandGroup_HasCommand: boolean;
    CommandGroup_CliKey: string;
    CommandGroup_MaxApi: string;
    CommandGroup_MinApi: string;
    CommandGroup_ResourceType: string | undefined;
    CommandGroup_Mode: string;
    CommandGroup_ClientFactoryName(group?: OperationGroup): string;
    CommandGroup_OperationTmplName: string;
    CommandGroup_CustomCommandTypeName(group?: OperationGroup): string;
    CommandGroup_Referenced: boolean;
    // CommandGroup_Features: [string, string];
    // CommandGroup_Imports: [string, string[]];
}

export class CommandGroupModelImpl extends CodeModelCliImpl implements CommandGroupModel {
    public get CommandGroup(): OperationGroup {
        if (
            this.currentOperationGroupIndex < 0 ||
            this.currentOperationGroupIndex >= this.codeModel.operationGroups.length
        ) {
            return undefined;
        }
        return this.codeModel.operationGroups[this.currentOperationGroupIndex];
    }

    public get CommandGroup_Name(): string {
        return this.CommandGroup.language['az'].command;
    }

    public get CommandGroup_Help(): string {
        const groupDescription = this.CommandGroup.language['az']?.['description'];
        if (!isNullOrUndefined(groupDescription) && groupDescription !== '') {
            return groupDescription;
        }
        const extensionPart = this.extensionHandler.Extension_Name.replace(/-/g, ' ');
        const groupPart = changeCamelToDash(this.CommandGroup.language['az']?.name)?.replace(
            /-/g,
            ' ',
        );
        if (groupPart === '') {
            return '';
        }
        if (extensionPart !== groupPart) {
            return 'Manage ' + groupPart + ' with ' + extensionPart;
        } else {
            return 'Manage ' + groupPart;
        }
    }

    public get CommandGroup_Key(): string {
        return this.CommandGroup.$key || this.CommandGroup_Name;
    }

    public get CommandGroup_HasShowCommand(): boolean {
        return this.CommandGroup.language['az'].hasShowCommand;
    }

    public get CommandGroup_HasCommand(): boolean {
        return this.SelectFirstCommand();
    }

    public get CommandGroup_Referenced(): boolean {
        return this.CommandGroup.language['az']['referenced'];
    }

    public get CommandGroup_DefaultName(): string {
        const eps = new EnglishPluralizationService();
        return eps.singularize(this.CommandGroup.language['cli'].cliKey);
    }

    public get CommandGroup_MaxApi(): string {
        return this.CommandGroup.language['cli']?.['max-api'];
    }

    public get CommandGroup_MinApi(): string {
        return this.CommandGroup.language['cli']?.['min-api'];
    }

    public get CommandGroup_ResourceType(): string | undefined {
        return this.formResourceType(this.CommandGroup.language['cli']?.['resource-type']);
    }

    public get CommandGroup_CliKey(): string {
        return this.CommandGroup.language['cli']?.cliKey;
    }

    public get CommandGroup_Mode(): string {
        if (isNullOrUndefined(this.CommandGroup?.language?.['cli']?.extensionMode)) {
            if (
                this.configHandler.IsCliCore &&
                this.extensionHandler.Extension_Mode === ExtensionMode.Stable
            ) {
                return ExtensionMode.Experimental;
            }
            return this.extensionHandler.Extension_Mode;
        }
        return this.CommandGroup?.language?.['cli']?.extensionMode;
    }

    public CommandGroup_ClientFactoryName(group: OperationGroup = this.CommandGroup): string {
        const cfName: string =
            'cf_' +
            (this.GetModuleOperationName(group) !== ''
                ? this.GetModuleOperationName(group)
                : this.extensionHandler.Extension_NameUnderscored + '_cl');
        return cfName;
    }

    public get CommandGroup_OperationTmplName(): string {
        const operationTmpl =
            this.configHandler.GetPythonNamespace() +
            '.operations._' +
            this.GetModuleOperationNamePython() +
            '_operations#' +
            this.GetModuleOperationNamePythonUpper() +
            '.{}';
        return operationTmpl;
    }

    public CommandGroup_CustomCommandTypeName(group: OperationGroup = this.CommandGroup): string {
        const customName =
            this.extensionHandler.Extension_NameUnderscored +
            '_' +
            this.GetModuleOperationName(group);
        return customName;
    }
}
