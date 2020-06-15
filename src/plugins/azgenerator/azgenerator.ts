import { Host, startSession } from '@azure-tools/autorest-extension-base';
import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { EOL } from "os";
import { CodeModelCliImpl } from "./CodeModelAzImpl";
import { GenerateAll } from "./Generator";


export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;
    //host.Message({Channel:Channel.Warning, Text:"in azgenerator processRequest"});
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        let model = new CodeModelCliImpl(session);
        let files: any = await GenerateAll(model, true, debug);
        if (model.SelectFirstExtension()) {
            do {
                let path = "azext_" + model.Extension_Name.replace("-", "_") + "/";
                session.protectFiles(path + "manual");
                session.protectFiles(path + "tests/latest/recordings")
            } while (model.SelectNextExtension());
        }

        // Remove the README.md from the write file list if it is exists
        let notGeneratedFileifExist: Array<string> = ["README.md"];
        for (let entry of notGeneratedFileifExist) {
            let exist = await host.ReadFile(entry);
            if (exist) {
                delete files[entry];
            }
        }

        for (let f in files) {
            host.WriteFile(f, files[f].join(EOL));
        }
    } catch (E) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}