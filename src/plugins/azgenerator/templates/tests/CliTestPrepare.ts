import * as path from 'path';
import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../../Header';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../../utils/models';
import {
    GenPreparerDependParamName,
    GenPreparerName,
    preparerInfos,
    PreparerInfo,
} from './ScenarioTool';
import { ToJsonString, ToMultiLine } from '../../../../utils/helper';

export class CliTestPrepare extends TemplateBase {
    resourceNames: string[];
    constructor(model: CodeModelAz, isDebugMode: boolean, resourceNames: string[]) {
        super(model, isDebugMode);
        this.resourceNames = resourceNames;
        if (this.model.IsCliCore) {
            this.relativePath = path.join(
                PathConstants.testFolder,
                PathConstants.latestFolder,
                PathConstants.preparersFile,
            );
        } else {
            this.relativePath = path.join(
                model.AzextFolder,
                PathConstants.testFolder,
                PathConstants.latestFolder,
                PathConstants.preparersFile,
            );
        }
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliTestPrepare(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    private AddPreparer(model: CodeModelAz, resourceName: string, output: string[]) {
        const preparerInfo = preparerInfos[resourceName];
        output.push('');
        output.push('');
        output.push(
            `class ${GenPreparerName(
                preparerInfo.className,
            )}(NoTrafficRecordingPreparer, SingleValueReplacer):`,
        );

        const buf: string[] = [];
        buf.push('    def __init__(self,');

        for (let i = 0; i < preparerInfo.dependResources.length; i++) {
            buf.push(
                `                 ${
                    preparerInfos[preparerInfo.className].dependParameters[i]
                }=${ToJsonString(
                    preparerInfos[preparerInfos[preparerInfo.className].dependResources[i]].key,
                )},`,
            );
        }
        buf.push(`                 key=${ToJsonString(preparerInfo.key)},`);
        for (const k in preparerInfo.config.inits) {
            buf.push(`                 ${k}=${ToJsonString(preparerInfo.config.inits[k])},`);
        }
        buf.splice(-1, 1, buf.last.slice(0, -1) + '):');
        output.push(...buf);

        output.push(`        super(${GenPreparerName(preparerInfo.className)}, self).__init__(`);
        output.push('            name_prefix, random_name_length)');
        output.push('        self.cli_ctx = get_dummy_cli()');
        // output.push("        self.parameter_name = parameter_name");
        output.push('        self.key = key');
        for (const param of preparerInfo.dependParameters.concat(
            Object.getOwnPropertyNames(preparerInfo.config.inits),
        )) {
            output.push(`        self.${param} = ${param}`);
        }
        output.push('');
        output.push('    def create_resource(self, name, **_):');
        function genLiveRun(templates: string[]) {
            for (const template of templates) {
                const variables: string[] = [];
                let depends: string[] = template.match(/\{.*?\}/g);
                depends = depends.map((x: string) => {
                    return x.substr(1, x.length - 2).toLowerCase();
                });
                for (const depend of depends) {
                    if (depend == 'name') {
                        variables.push(`name`);
                    } else {
                        for (
                            let i = 0;
                            i < preparerInfos[preparerInfo.className].dependParameters.length;
                            i++
                        ) {
                            if (
                                model
                                    .GetResourcePool()
                                    .isResource(
                                        preparerInfos[preparerInfo.className].dependResources[i],
                                        null,
                                    ) == model.GetResourcePool().isResource(depend, null)
                            ) {
                                variables.push(
                                    `self.test_class_instance.kwargs.get(self.${
                                        preparerInfos[preparerInfo.className].dependParameters[i]
                                    })`,
                                );
                            }
                        }
                    }
                }
                ToMultiLine(`        template = '${template.replace(/\{.*?\}/g, '{}')}'`, output);
                ToMultiLine(`        cmd = template.format(${variables.join(', ')})`, output);
                ToMultiLine(`        self.live_only_execute(self.cli_ctx, cmd)`, output);
            }
        }
        genLiveRun(preparerInfo.config.create);

        output.push('');
        output.push('        self.test_class_instance.kwargs[self.key] = name');
        output.push('        return {self.key: name}');
        output.push('');
        output.push('    def remove_resource(self, name, **_):');
        genLiveRun(preparerInfo.config.delete);
        output.push('');
    }
    private GenerateAzureCliTestPrepare(model: CodeModelAz): string[] {
        const header: HeaderGenerator = new HeaderGenerator();
        const output: string[] = header.getLines();
        output.push('');
        output.push('from azure_devtools.scenario_tests import SingleValueReplacer');
        output.push('from azure.cli.testsdk.preparers import NoTrafficRecordingPreparer');
        output.push('from azure.cli.testsdk.exceptions import CliTestError');
        output.push('from azure.cli.testsdk.reverse_dependency import get_dummy_cli');
        output.push('');
        for (const resourceName of this.resourceNames) {
            this.AddPreparer(model, resourceName, output);
        }
        return output;
    }
}
