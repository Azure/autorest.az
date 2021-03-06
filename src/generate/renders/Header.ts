/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { GenerationMode } from '../../utils/models';

class FromImport {
    public constructor(from: string, imports: string[]) {
        this.from = from;
        this.imports = imports;
    }

    public from: string;
    public imports: string[];
}

export class HeaderGenerator {
    public constructor() {
        this.disableLineTooLong = false;
        this.disableTooManyLines = false;
        this.disableTooManyLocals = false;
        this.disableTooManyStatements = false;
        this.disableUnusedArgument = false;
        this.disableProtectedAccess = false;
        this.disableWildcardImport = false;
        this.disableUnusedWildcardImport = false;
        this.disableUnusedImport = false;
        this.generationMode = GenerationMode.Full;
        this.fromImports = [];
        this.imports = [];
    }

    public static GetCliGenerationMode(header: string): GenerationMode {
        if (header) {
            if (
                String(header).indexOf(
                    '# Code generated by Microsoft (R) AutoRest Code Generator.',
                ) !== -1
            ) {
                if (String(header).indexOf('# Generation mode: Incremental') !== -1) {
                    return GenerationMode.Incremental;
                }
                return GenerationMode.Full;
            }
            return GenerationMode.Manual;
        }
        return GenerationMode.Full;
    }

    public addFromImport(from: string, imports: string[]): void {
        // TODO: search already-import-history-list by import target
        let found = false;
        for (const fi of this.fromImports) {
            if (
                fi.from === from &&
                fi.imports.length === imports.length &&
                fi.imports.every((value, index) => value === imports[index])
            ) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.fromImports.push(new FromImport(from, imports));
        }
    }

    public addImport(name): void {
        // TODO: search already-import-history-list together with addFromImport
        if (this.imports.indexOf(name) < 0) {
            this.imports.push(name);
        }
    }

    public getLines(): string[] {
        const output: string[] = [];

        if (this.codingUtf8) {
            output.push('# coding=utf-8');
        }

        output.push('# --------------------------------------------------------------------------');
        output.push('# Copyright (c) Microsoft Corporation. All rights reserved.');
        output.push('# Licensed under the MIT License. See License.txt in the project root for');
        output.push('# license information.');
        output.push('#');
        output.push('# Code generated by Microsoft (R) AutoRest Code Generator.');
        output.push('# Changes may cause incorrect behavior and will be lost if the code is');
        output.push('# regenerated.');

        if (this.generationMode === GenerationMode.Full) {
            // output.push("# GenerationMode: Full");
        } else {
            output.push('#');
            output.push('# Generation mode: Incremental');
        }

        output.push('# --------------------------------------------------------------------------');

        // disable required pylint stuff
        if (this.disableLineTooLong) {
            output.push('# pylint: disable=line-too-long');
        }
        if (this.disableTooManyLines) {
            output.push('# pylint: disable=too-many-lines');
        }
        if (this.disableTooManyStatements) {
            output.push('# pylint: disable=too-many-statements');
        }
        if (this.disableTooManyLocals) {
            output.push('# pylint: disable=too-many-locals');
        }
        if (this.disableUnusedArgument) {
            output.push('# pylint: disable=unused-argument');
        }
        if (this.disableProtectedAccess) {
            output.push('# pylint: disable=protected-access');
        }
        if (this.disableWildcardImport) {
            output.push('# pylint: disable=wildcard-import');
        }
        if (this.disableUnusedWildcardImport) {
            output.push('# pylint: disable=unused-wildcard-import');
        }

        if (this.disableUnusedImport) {
            output.push('# pylint: disable=unused-import');
        }

        if (this.imports.length || this.fromImports.length > 0) {
            output.push('');
        }

        if (this.imports.length > 0) {
            this.imports.forEach((element) => {
                output.push('import ' + element);
            });
        }

        if (this.fromImports.length > 0) {
            this.fromImports.forEach((element) => {
                if (element.imports.length > 0) {
                    if (element.imports.length === 1) {
                        output.push('from ' + element.from + ' import ' + element.imports[0]);
                    } else {
                        output.push('from ' + element.from + ' import (');
                        for (let i = 0; i < element.imports.length; i++) {
                            output.push(
                                '    ' +
                                    element.imports[i] +
                                    (i < element.imports.length - 1 ? ',' : ''),
                            );
                        }
                        output.push(')');
                    }
                }
            });
        }

        return output;
    }

    public disableLineTooLong: boolean;
    public disableTooManyLines: boolean;
    public disableTooManyStatements: boolean;
    public disableTooManyLocals: boolean;
    public disableUnusedArgument: boolean;
    public disableProtectedAccess: boolean;
    public disableWildcardImport: boolean;
    public disableUnusedWildcardImport: boolean;
    public disableUnusedImport: boolean;
    public codingUtf8: boolean;
    public generationMode: GenerationMode;
    private fromImports: FromImport[];
    private imports: string[];
}
