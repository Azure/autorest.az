/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { EOL } from 'os';
import * as path from 'path';
import {
    getIndentString,
    skipCommentLines,
    ToMultiLine,
    composeParamString,
    isNullOrUndefined,
} from '../../utils/helper';
import { GenerationMode, PathConstants } from '../../utils/models';
import { CodeModelAz } from '../codemodel/CodeModelAz';
import { HeaderGenerator } from './Header';
import { TemplateBase } from './TemplateBase';

export class CliTopInit extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
        const { configHandler } = model.GetHandler();
        this.relativePath = path.join(configHandler.AzextFolder, PathConstants.initFile);
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliInit(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        if (isNullOrUndefined(base) || base.length === 0) {
            // No base version
            return await this.fullGeneration();
        } else {
            const existingMode: GenerationMode = HeaderGenerator.GetCliGenerationMode(base);
            if (existingMode === GenerationMode.Full) {
                throw new Error(
                    'GenerationMode Error: Should not set Incremental mode on existing Full generation RP.',
                );
            } else if (existingMode === GenerationMode.Incremental) {
                // No need more incremental change
                return base.split(EOL);
            } else {
                // Change base on the manual
                const headerGenerator: HeaderGenerator = new HeaderGenerator();
                headerGenerator.generationMode = GenerationMode.Incremental;
                let output: string[] = headerGenerator.getLines();

                // Pass start comment
                const baseSplit: string[] = base.split(EOL);
                const skipLineIdx = skipCommentLines(baseSplit);

                if (skipLineIdx !== -1) {
                    output = output.concat(baseSplit.slice(skipLineIdx));
                }

                let loadtableIndex = -1;
                let loadargIndex = -1;
                for (let i = 0; i < output.length; ++i) {
                    if (output[i].indexOf('load_command_table') !== -1) {
                        loadtableIndex = i;
                    }
                    if (output[i].indexOf('load_arguments') !== -1) {
                        loadargIndex = i;
                    }
                }

                if (loadargIndex !== -1) {
                    const indent: number = output[loadargIndex].indexOf('l');
                    const insertLines: string[] = this.loadGeneratedArguments(indent);
                    output.splice(loadargIndex + 1, 0, ...insertLines);
                }

                if (loadtableIndex !== -1) {
                    const indent: number = output[loadtableIndex].indexOf('l');
                    const insertLines: string[] = this.loadGeneratedCommands(indent);
                    output.splice(loadtableIndex + 1, 0, ...insertLines);
                }

                return output;
            }
        }
    }

    private loadGeneratedArguments(indent: number): string[] {
        const output: string[] = [];
        const indentStr: string = getIndentString(indent);

        output.push(indentStr + 'try:');
        output.push(
            indentStr +
                '    from .generated._params import load_arguments as load_arguments_generated',
        );
        output.push(indentStr + '    load_arguments_generated(self, command)');
        output.push(
            indentStr + '    from .manual._params import load_arguments as load_arguments_manual',
        );
        output.push(indentStr + '    load_arguments_manual(self, command)');
        output.push(indentStr + 'except ImportError as e:');
        output.push(indentStr + "    if e.name.endswith('manual._params'):");
        output.push(indentStr + '        pass');
        output.push(indentStr + '    else:');
        output.push(indentStr + '        raise e');
        return output;
    }

    private loadGeneratedCommands(indent: number): string[] {
        const output: string[] = [];
        const indentStr: string = getIndentString(indent);

        output.push(indentStr + 'try:');
        output.push(
            indentStr +
                '    from .generated.commands import load_command_table as load_command_table_generated',
        );
        output.push(indentStr + '    load_command_table_generated(self, args)');
        output.push(
            indentStr +
                '    from .manual.commands import load_command_table as load_command_table_manual',
        );
        output.push(indentStr + '    load_command_table_manual(self, args)');
        output.push(indentStr + 'except ImportError as e:');
        output.push(indentStr + "    if e.name.endswith('manual.commands'):");
        output.push(indentStr + '        pass');
        output.push(indentStr + '    else:');
        output.push(indentStr + '        raise e');
        output.push('');
        return output;
    }

    private GenerateAzureCliInit(model: CodeModelAz): string[] {
        const { configHandler, extensionHandler } = model.GetHandler();
        const header: HeaderGenerator = new HeaderGenerator();
        header.addFromImport(configHandler.CliCoreLib, ['AzCommandsLoader']);
        if (configHandler.ResourceType) {
            header.addFromImport('azure.cli.core.profiles', ['ResourceType']);
        }
        const output: string[] = header.getLines();
        let importPath = configHandler.AzextFolder;
        if (!configHandler.IsCliCore) {
            output.push(
                'from ' +
                    importPath +
                    '.generated._help import helps  # pylint: disable=unused-import',
            );
            output.push('try:');
            output.push(
                '    from ' +
                    importPath +
                    '.manual._help import helps  # pylint: disable=reimported',
            );
            output.push('except ImportError as e:');
            output.push("    if e.name.endswith('manual._help'):");
            output.push('        pass');
            output.push('    else:');
            output.push('        raise e');
            output.push('');
        } else {
            importPath = '';
        }

        output.push('');
        output.push('');
        output.push(
            'class ' + extensionHandler.Extension_NameClass + 'CommandsLoader(AzCommandsLoader):',
        );
        output.push('');
        output.push('    def __init__(self, cli_ctx=None):');
        output.push('        from ' + configHandler.CliCoreLib + '.commands import CliCommandType');
        output.push(
            '        from ' +
                importPath +
                '.generated._client_factory import cf_' +
                extensionHandler.Extension_NameUnderscored +
                '_cl',
        );
        output.push(
            '        ' + extensionHandler.Extension_NameUnderscored + '_custom = CliCommandType(',
        );
        if (configHandler.IsCliCore) {
            output.push(
                "            operations_tmpl='azure.cli.command_modules." +
                    extensionHandler.Extension_NameUnderscored +
                    ".custom#{}',",
            );
        } else {
            output.push(
                "            operations_tmpl='" + configHandler.AzextFolder + ".custom#{}',",
            );
        }
        output.push(
            '            client_factory=cf_' + extensionHandler.Extension_NameUnderscored + '_cl)',
        );
        output.push(
            `        parent = super(${extensionHandler.Extension_NameClass}CommandsLoader, self)`,
        );
        ToMultiLine(
            `        parent.__init__(cli_ctx=cli_ctx, custom_command_type=${
                extensionHandler.Extension_NameUnderscored
            }_custom${composeParamString(undefined, undefined, configHandler.ResourceType)[0]})`,
            output,
        );
        output.push('');
        output.push('    def load_command_table(self, args):');
        output.push('        from ' + importPath + '.generated.commands import load_command_table');
        output.push('        load_command_table(self, args)');
        output.push('        try:');
        output.push(
            '            from ' +
                importPath +
                '.manual.commands import load_command_table as load_command_table_manual',
        );
        output.push('            load_command_table_manual(self, args)');
        output.push('        except ImportError as e:');
        output.push("            if e.name.endswith('manual.commands'):");
        output.push('                pass');
        output.push('            else:');
        output.push('                raise e');
        output.push('        return self.command_table');
        output.push('');
        output.push('    def load_arguments(self, command):');
        output.push('        from ' + importPath + '.generated._params import load_arguments');
        output.push('        load_arguments(self, command)');
        output.push('        try:');
        output.push(
            '            from ' +
                importPath +
                '.manual._params import load_arguments as load_arguments_manual',
        );
        output.push('            load_arguments_manual(self, command)');
        output.push('        except ImportError as e:');
        output.push("            if e.name.endswith('manual._params'):");
        output.push('                pass');
        output.push('            else:');
        output.push('                raise e');
        output.push('');
        output.push('');
        output.push(
            'COMMAND_LOADER_CLS = ' + extensionHandler.Extension_NameClass + 'CommandsLoader',
        );
        output.push('');

        return output;
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
