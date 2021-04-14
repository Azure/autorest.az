import * as path from 'path';
import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../utils/models';
import { GenPreparerName, preparerInfos } from './ScenarioTool';
import { ToJsonString } from '../../../utils/helper';

class FuncData {
    constructor(public cmdTemplate: string, public cmdFormats: string[]) {}
}
export class PreparerData {
    public initParamPairs: [string, string][];
    public attributes: string[];
    public createFunc: FuncData;
    public removeFunc: FuncData;

    constructor(public className: string) {
        this.initParamPairs = [];
        this.attributes = [];
        this.createFunc = new FuncData(undefined, []);
        this.removeFunc = new FuncData(undefined, []);
    }
}

export class CliTestPrepare extends TemplateBase {
    resourceNames: string[];
    constructor(model: CodeModelAz, resourceNames: string[]) {
        super(model);
        const { configHandler } = model.GetHandler();
        this.resourceNames = resourceNames;
        this.relativePath = path.join(
            configHandler.AzextFolder,
            PathConstants.testFolder,
            PathConstants.latestFolder,
            PathConstants.preparersFile,
        );
        this.tmplPath = path.join(
            PathConstants.templateRootFolder,
            PathConstants.testFolder,
            PathConstants.latestFolder,
            PathConstants.preparersFile + PathConstants.njxFileExtension,
        );
    }

    public async fullGeneration(): Promise<string[]> {
        // this.GenerateAzureCliTestPrepare(this.model);
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public async GetRenderData(model: CodeModelAz): Promise<any> {
        const data = {
            preparers: [],
        };
        for (const resourceName of this.resourceNames) {
            data.preparers.push(this.CreatePreparer(model, resourceName));
        }
        return data;
    }

    private CreatePreparer(model: CodeModelAz, resourceName: string) {
        const preparerInfo = preparerInfos[resourceName];
        const preparerData = new PreparerData(GenPreparerName(preparerInfo.className));
        for (let i = 0; i < preparerInfo.dependResources.length; i++) {
            preparerData.initParamPairs.push([
                preparerInfos[preparerInfo.className].dependParameters[i],
                ToJsonString(
                    preparerInfos[preparerInfos[preparerInfo.className].dependResources[i]].key,
                ),
            ]);
        }
        preparerData.initParamPairs.push(['key', ToJsonString(preparerInfo.key)]);
        for (const k in preparerInfo.config.inits) {
            preparerData.initParamPairs.push([k, ToJsonString(preparerInfo.config.inits[k])]);
        }

        for (const param of preparerInfo.dependParameters.concat(
            Object.getOwnPropertyNames(preparerInfo.config.inits),
        )) {
            preparerData.attributes.push(param);
        }

        function genLiveRun(templates: string[], funcData: FuncData) {
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
                                    ) === model.GetResourcePool().isResource(depend, null)
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
                funcData.cmdTemplate = template.replace(/\{.*?\}/g, '{}');
                funcData.cmdFormats = variables;
            }
        }
        genLiveRun(preparerInfo.config.create, preparerData.createFunc);
        genLiveRun(preparerInfo.config.delete, preparerData.removeFunc);
        return preparerData;
    }
}
