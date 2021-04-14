/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import {
    CodeGenConstants,
    AzConfiguration,
    getHiddenOperations,
    groupOperations,
    RPInfo,
    isNullOrUndefined,
    getExtensionName,
} from '../helper';
import * as fs from 'fs';
import { CodeModel } from '@azure-tools/codemodel';

function usePathVariable(p: string, extensionName: string | undefined): string {
    const cliFolder = AzConfiguration.getValue(CodeGenConstants.azureCliFolder);
    const cliExtensionFolder = AzConfiguration.getValue(CodeGenConstants.azureCliExtFolder);
    const azOutputFolder = AzConfiguration.getValue(CodeGenConstants.azOutputFolder);
    if (isNullOrUndefined(extensionName)) {
        if (p.startsWith(cliFolder) && p !== cliFolder) {
            p = `$(azure-cli-folder)${p.slice(cliFolder.length)}`;
        }
    } else {
        if (p.startsWith(cliExtensionFolder) && p !== cliExtensionFolder) {
            p = `$(azure-cli-extension-folder)${p.slice(cliExtensionFolder.length)}`;
        }
    }
    if (p.startsWith(azOutputFolder) && p !== azOutputFolder) {
        p = `$(az-output-folder)${p.slice(azOutputFolder.length)}`;
    }
    p = p.split('\\').join('/');
    return p;
}

function genBasicInfo(output: string[], extensionName: string | undefined): boolean {
    const newConfigs = [];
    let ret = false;

    const azConfig: Record<string, any> = AzConfiguration.getValue(CodeGenConstants.az);
    if (
        isNullOrUndefined(
            AzConfiguration.origin[CodeGenConstants.az]?.[CodeGenConstants.extensions],
        )
    ) {
        newConfigs.push(`  extensions: ${azConfig[CodeGenConstants.extensions]}`);
        ret = true;
    }
    if (
        isNullOrUndefined(AzConfiguration.origin[CodeGenConstants.az]?.[CodeGenConstants.namespace])
    ) {
        newConfigs.push(`  namespace: ${azConfig[CodeGenConstants.namespace]}`);
    }
    if (
        isNullOrUndefined(
            AzConfiguration.origin[CodeGenConstants.az]?.[CodeGenConstants.packageName],
        )
    ) {
        newConfigs.push(`  package-name: ${azConfig[CodeGenConstants.packageName]}`);
    }
    if (ret) {
        newConfigs.push(`  disable-checks: true`);
        newConfigs.push(`  randomize-names: true`);
        newConfigs.push(`  test-unique-resource: true`);
    }
    if (newConfigs.length > 0) {
        newConfigs.unshift('az:');
    }

    if (isNullOrUndefined(AzConfiguration.origin[CodeGenConstants.azOutputFolder])) {
        newConfigs.push(
            `az-output-folder: ${usePathVariable(
                AzConfiguration.getValue(CodeGenConstants.azOutputFolder),
                extensionName,
            )}`,
        );
    }

    if (isNullOrUndefined(AzConfiguration.origin[CodeGenConstants.pythonSdkOutputFolder])) {
        newConfigs.push(
            `python-sdk-output-folder: "${usePathVariable(
                AzConfiguration.getValue(CodeGenConstants.pythonSdkOutputFolder),
                extensionName,
            )}"`,
        );
    }

    if (isNullOrUndefined(AzConfiguration.origin[CodeGenConstants.compatibleLevel])) {
        newConfigs.push(`compatible-level: 'track2'`);
    }

    if (newConfigs.length > 0) {
        if (isNullOrUndefined(extensionName)) {
            newConfigs.unshift('``` yaml $(az) && $(target-mode) == "core"');
        } else {
            newConfigs.unshift('``` yaml $(az) && $(package-' + extensionName + ')');
        }
        newConfigs.unshift('');
        newConfigs.push('```');
    }
    output.push(...newConfigs);
    return ret;
}

function genTagLines(): [string, string] {
    let extension = getExtensionName();
    if (!isNullOrUndefined(extension)) {
        extension = ` for extension ${extension}`;
    } else {
        extension = '';
    }
    const startTagLine = `### -----start of auto generated cli-directive${extension}----- ###`;
    const endTagLine = `### -----end of auto generated cli-directive${extension}----- ###`;
    return [startTagLine, endTagLine];
}

function findGenArea(output: string[], startTagLine: string, endTagLine: string): [number, number] {
    let start = -1,
        end = -1;
    for (let i = 0; i < output.length; i++) {
        if (start < 0 && output[i].indexOf(startTagLine) >= 0) start = i;
        if (start >= 0 && output[i].indexOf(endTagLine) >= 0) {
            end = i;
            break;
        }
    }
    return [start, end];
}

export function GenerateReadmeAz(
    model: CodeModel,
    generateTargets: RPInfo,
    fullPath: string,
): string[] {
    const extensionName = getExtensionName();
    const [startTagLine, endTagLine] = genTagLines();
    const output: string[] = [];

    if (!fs.existsSync(fullPath)) {
        output.push('');
        output.push('');
        output.push('## Azure CLI');
        output.push('');
        output.push('These settings apply only when `--az` is specified on the command line.');
    } else {
        output.push(...fs.readFileSync(fullPath).toString().split('\n'));
    }

    const alreadyExists = !genBasicInfo(output, extensionName);
    const missingOps = getHiddenOperations(model, generateTargets);

    if (missingOps.length > 0) {
        let area = findGenArea(output, startTagLine, endTagLine);
        if (area[1] <= 0) {
            output.push(``);
            output.push(startTagLine);
            if (isNullOrUndefined(extensionName)) {
                output.push('``` yaml $(az) && $(target-mode) == "core"');
            } else {
                output.push('``` yaml $(az) && $(package-' + extensionName + ')');
            }

            output.push(`cli:`);
            output.push(`  cli-directive:`);
            if (!alreadyExists) {
                output.push(`    - where:`);
                output.push(`        group: '*'`);
                output.push(`        op: '*'`);
                output.push(`      hidden: true`);
            }
            output.push('```');
            output.push(endTagLine);
            area = findGenArea(output, startTagLine, endTagLine);
        }
        const grouped = groupOperations(missingOps);
        const newDirective = [];
        for (const groupName in grouped) {
            for (const version in grouped[groupName]) {
                const ops = grouped[groupName][version].map((x) => {
                    return x.operationName;
                });
                newDirective.push('    - where:');
                if (groupName !== '') newDirective.push(`        group: '${groupName}'`);
                newDirective.push(`        op: ${ops.join('|')}`);
                newDirective.push(`        apiVersion: '${version}'`);
                newDirective.push(`      hidden: false`);
            }
        }
        output.splice(area[1] - 1, 0, ...newDirective);
    }

    fs.writeFileSync(fullPath, output.join('\n'));
    return output;
}
