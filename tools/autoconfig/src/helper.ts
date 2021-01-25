/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license output.pushrmation.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as os from 'os';
import { Host, Channel, Session } from '@azure-tools/autorest-extension-base';
import { CodeModel } from '@azure-tools/codemodel';
import { Operation, OperationGroup } from '@autorest/clicommon/node_modules/@azure-tools/codemodel';
import { NodeSelector } from '@autorest/clicommon/dist/src/plugins/modifier/cliDirectiveSelector';
import { CliCommonSchema } from '@autorest/clicommon/dist/src/schema';

export enum CodeGenConstants {
    // some configuration that by calculation
    isCliCore,
    sdkNeeded,
    sdkTrack1,
    azextFolder,
    pythonNamespace,

    // some configuration keys in the top section
    az = 'az',
    cli = 'cli',
    resourceFile = 'resource-file',
    debug = 'debug',
    use = 'use',
    directive = 'directive',
    parents = '__parents',
    azOutputFolder = 'az-output-folder',
    generationMode = 'generation-mode',
    clearOutputFolder = 'clear-output-folder',
    generateSDK = 'generate-sdk',
    targetMode = 'target-mode',
    compatibleLevel = 'compatible-level',
    sdkNoFlatten = 'sdk-no-flatten',
    sdkFlatten = 'sdk-flatten',
    extensionMode = 'extension-mode',
    azureCliFolder = 'azure-cli-folder',
    azureCliExtFolder = 'azure-cli-extension-folder',
    pythonSdkOutputFolder = 'python-sdk-output-folder',
    cliCoreLib = 'cli-core-lib',

    // some configuration keys under az section
    namespace = 'namespace',
    extensions = 'extensions',
    packageName = 'package-name',
    parentExtension = 'parent-extension',
    clientBaseUrlBound = 'client-base-url-bound',
    clientSubscriptionBound = 'client-subscription-bound',
    clientAuthenticationPolicy = 'client-authentication-policy',

    // default constant values
    minCliCoreVersion = '2.15.0',
    cliCodeModelName = 'code-model-cli-v4.yaml',
    m4CodeModelName = 'code-model-v4-no-tags.yaml',
    DEFAULT_CLI_CORE_LIB = 'azure.cli.core',
    AZ_ENTRY_CODE_MODEL_NAME = 'az-entry-code-model.yaml',
}

export function mapToPythonPackage(swaggerName: string): string {
    const map = {};
    if (Object.prototype.hasOwnProperty.call(map, swaggerName)) {
        return map[swaggerName];
    }
    return swaggerName;
}

export function mapToPythonNamespace(swaggerName: string): string {
    const map = {};
    if (Object.prototype.hasOwnProperty.call(map, swaggerName)) {
        return map[swaggerName];
    }
    return swaggerName;
}

export function mapToCliName(swaggerName: string): string {
    const map = {
        compute: 'vm',
    };
    if (Object.prototype.hasOwnProperty.call(map, swaggerName)) {
        return map[swaggerName];
    }
    return swaggerName;
}

export function getRPFolder(parentsOptions: { [key: string]: any }): string {
    for (const k in parentsOptions) {
        const v: string = parentsOptions[k];
        if (
            k.endsWith('.json') &&
            typeof v === 'string' &&
            v.startsWith('file:///') &&
            v.indexOf('specification') > 0
        ) {
            const p = v.indexOf('specification/');
            const l = 'specification/'.length;
            return v.slice(p + l, v.indexOf('/', p + l + 1));
        }
    }
    return undefined;
}

export function getReadmeFolder(parentsOptions: Record<string, any>): string {
    for (const k in parentsOptions) {
        const v: string = parentsOptions[k];
        const resourceManager = 'resource-manager';
        const prefix = os.type().toLowerCase().indexOf('linux') >= 0 ? 'file://' : 'file:///';
        if (
            k.endsWith('.json') &&
            typeof v === 'string' &&
            v.startsWith(prefix) &&
            v.indexOf(resourceManager) > 0
        ) {
            return v.slice(prefix.length, v.indexOf(resourceManager) + resourceManager.length);
        }
    }
    return undefined;
}

export class AzConfiguration {
    private static dict: unknown;

    constructor(config: unknown = null) {
        if (!isNullOrUndefined(config)) {
            AzConfiguration.dict = config;
        } else {
            AzConfiguration.dict = {};
        }
    }

    public static getValue(key: CodeGenConstants) {
        return AzConfiguration.dict[key];
    }

    public static setValue(key: CodeGenConstants, value: unknown): void {
        AzConfiguration.dict[key] = value;
    }
}

export async function genDefaultConfiguration(
    session: Session<CodeModel>,
): Promise<Record<string, any>> {
    const config = await session.getValue('');

    // set az default values
    const parentsSetting = config[CodeGenConstants.parents] || {};
    if (!Object.prototype.hasOwnProperty.call(config, CodeGenConstants.az))
        config[CodeGenConstants.az] = {};
    const azSettings = config[CodeGenConstants.az];
    const swaggerName = getRPFolder(parentsSetting);
    if (!Object.prototype.hasOwnProperty.call(azSettings, CodeGenConstants.extensions))
        azSettings[CodeGenConstants.extensions] = mapToCliName(swaggerName);
    if (!Object.prototype.hasOwnProperty.call(azSettings, CodeGenConstants.packageName))
        azSettings[CodeGenConstants.packageName] = 'azure-mgmt-' + mapToPythonPackage(swaggerName);
    if (!Object.prototype.hasOwnProperty.call(azSettings, CodeGenConstants.namespace))
        azSettings[CodeGenConstants.namespace] = 'azure.mgmt.' + mapToPythonNamespace(swaggerName);

    // set azure-cli default value
    if (isNullOrUndefined(config[CodeGenConstants.azureCliFolder])) {
        config[CodeGenConstants.azureCliFolder] = path.join(
            getReadmeFolder(config[CodeGenConstants.parents]),
            '..',
            '..',
            '..',
            '..',
            'azure-cli',
        );
    }

    // set az-output-folder default value
    if (isNullOrUndefined(config[CodeGenConstants.azOutputFolder])) {
        config[CodeGenConstants.azOutputFolder] = path.join(
            config[CodeGenConstants.azureCliFolder],
            'src',
            'azure-cli',
            'azure',
            'cli',
            'command_modules',
            mapToCliName(getRPFolder(parentsSetting)),
        );
    }

    // set python-sdk-output-folder default value
    if (isNullOrUndefined(config[CodeGenConstants.pythonSdkOutputFolder])) {
        const cliName = mapToCliName(getRPFolder(parentsSetting));
        config[CodeGenConstants.pythonSdkOutputFolder] = path.join(
            config[CodeGenConstants.azOutputFolder],
            'az_' + cliName,
            'vendored_sdks',
            cliName,
        );
    }
    return config;
}

function Info(host: Host, s: string) {
    host.Message({
        Channel: Channel.Information,
        Text: s,
    });
}

export function Error(host: Host, s: string): void {
    host.Message({
        Channel: Channel.Error,
        Text: s,
    });
}

export function Warning(host: Host, s: string): void {
    host.Message({
        Channel: Channel.Warning,
        Text: s,
    });
}

export function WriteFile(host: Host, path: string, rows: string[]): void {
    host.WriteFile(path, rows.join('\n'));
}

export function isNullOrUndefined(obj: any) {
    return obj === null || obj === undefined;
}

export class OperationInfo {
    operationId: string;
    version: string;
    jsonfileName: string;

    constructor(obj) {
        this.operationId = obj.operationId;
        this.version = obj.version;
        this.jsonfileName = obj.jsonfileName;
    }

    public get groupName(): string {
        return this.operationId.split('_')[0];
    }

    public get operationName(): string {
        return this.operationId.split('_')[1];
    }
}

export class ResourceInfo {
    Resource: string;
    operations: OperationInfo[] = [];

    constructor(obj) {
        this.Resource = obj.Resource;
        this.operations = [];
        for (let i = 0; i < (obj.operations || []).length; i++) {
            this.operations.push(new OperationInfo(obj.operations[i]));
        }
    }
}

export class RPInfo {
    RPName: string;
    resources: ResourceInfo[];
    status: string;

    constructor(obj) {
        this.RPName = obj.RPName;
        this.status = obj.status;
        this.resources = [];
        for (let i = 0; i < (obj.resources || []).length; i++) {
            this.resources.push(new ResourceInfo(obj.resources[i]));
        }
    }
}

class CliDirective {
    public selector: NodeSelector;

    constructor(public directive: CliCommonSchema.CliDirective.Directive) {
        this.selector = new NodeSelector(this.directive);
    }
}

export function getHiddenOperations(model: CodeModel, rpInfo: RPInfo): OperationInfo[] {
    const ret: OperationInfo[] = [];
    for (const recourseInfo of rpInfo.resources)
        for (const operationInfo of recourseInfo.operations) {
            if (isHiddenOperation(operationInfo)) ret.push(operationInfo);
        }
    return ret;
}

export function groupOperations(
    operations: OperationInfo[],
): Record<string, Record<string, OperationInfo[]>> {
    const ret: Record<string, Record<string, OperationInfo[]>> = {};
    for (const operation of operations) {
        if (Object.prototype.hasOwnProperty.call(ret, operation.groupName)) {
            const group = ret[operation.groupName];
            if (Object.prototype.hasOwnProperty.call(group, operation.version)) {
                group[operation.version].push(operation);
            } else {
                group[operation.version] = [operation];
            }
        } else {
            const group = {};
            group[operation.version] = [operation];
            ret[operation.groupName] = group;
        }
    }
    return ret;
}

export function isHiddenOperation(operationInfo: OperationInfo): boolean {
    const cliOption = AzConfiguration.getValue(CodeGenConstants.cli);

    let ret = false;
    let groupName = operationInfo.groupName;
    let operationName = operationInfo.operationName;
    for (const directive of cliOption?.['cli-directive'] || []) {
        const cliDirective = new CliDirective(directive);
        if (
            cliDirective.selector.match({
                operationGroupCliKey: groupName,
                operationCliKey: operationName,
                parent: undefined,
                target: new Operation('fake', 'fake description'),
                targetIndex: -1,
                apiVersions: [operationInfo.version],
            })
        ) {
            if (Object.prototype.hasOwnProperty.call(directive, 'hidden')) {
                ret = directive.hidden;
            }
            if (Object.prototype.hasOwnProperty.call(directive, 'name')) {
                operationName = directive.name;
            }
        }

        if (
            cliDirective.selector.match({
                operationGroupCliKey: groupName,
                parent: undefined,
                target: new OperationGroup('fake'),
                targetIndex: -1,
            })
        ) {
            if (Object.prototype.hasOwnProperty.call(directive, 'hidden')) {
                ret = directive.hidden;
            }
            if (Object.prototype.hasOwnProperty.call(directive, 'name')) {
                groupName = directive.name;
            }
        }
    }
    return ret;
}
