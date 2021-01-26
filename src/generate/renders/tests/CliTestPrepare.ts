import * as path from 'path';
import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../Header';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../utils/models';

export class CliTestPrepare extends TemplateBase {
    constructor(model: CodeModelAz) {
        super(model);
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
        this.tmplPath = path.join(PathConstants.templateRootFolder, 'tests/latest/prepares.py.njx');
    }

    public async fullGeneration(): Promise<string[]> {
        return await this.render();
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return await this.fullGeneration();
    }

    public async GetRenderData(model: CodeModelAz): Promise<string[]> {
        const output: string[] = [];
        return output;
    }
}
