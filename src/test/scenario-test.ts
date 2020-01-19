import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from '@azure-tools/async-io';
import { deserialize, serialize, fail } from '@azure-tools/codegen';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { createTestSession, createPassThruSession } from './utils/test-helper';
import { AzNamer } from '../plugins/aznamer';
import { Modifiers } from '../plugins/modifiers';
import { exec } from 'child_process';



require('source-map-support').install();


@suite class Process {
    async clicommon(directory: string) {
        let cmd = "autorest-beta --cli.common --input-file=../../src/test/configuration/ --output-folder=../../src/test/scenarios/" + directory + " --output-file=modeler.yaml";
        exec(cmd);
    }

    @test async acceptanceSuite() {
        const folders = await readdir(`${__dirname}/../../src/test/scenarios/`);
        for (const each of folders) {
            if ([
                'body-formdata',
                'body-formdata-urlencoded',
            ].indexOf(each) > -1) {
                console.log(`Skipping: ${each}`);
                continue;
            }
            /*if ('body-complex' !== each) {
              console.log(`Skipping: ${each}`);
              continue;
            }*/
            console.log(`Processing: ${each}`);
            
            const cfg = {
                modelerfour: { 'flatten-models': true, 'flatten-payloads': true },
                'payload-flattening-threshold': 2
            }
    
            await mkdir(`${__dirname}/../../src/test/scenarios/${each}`);
            await this.clicommon(each);
            let yaml = `${__dirname}/../../src/test/scenarios/${each}/modeler.yaml`;
    
            const extensionName = "attestation";
            const aznamer = new AzNamer(await createPassThruSession(cfg, yaml, 'code-model-v4'));
            const model = await aznamer.process(extensionName);
            const aznameryaml = serialize(model, codeModelSchema);
            await (writeFile(`${__dirname}/../../src/test/scenarios/${each}/aznamer.yaml`, aznameryaml));

            const modifiers = new Modifiers(await createPassThruSession(cfg, aznameryaml, 'code-model-v4'));
            const modified = await modifiers.process();
            const modifieryaml = serialize(modified, codeModelSchema);
            await (writeFile(`${__dirname}/../../src/test/scenarios/${each}/modifier.yaml`, modifieryaml));
    
        }
    }
}

@suite class Hello {
    @test world() {
        console.log("test success");
    }
}