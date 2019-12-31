import { AutoRestExtension, Channel } from '@azure-tools/autorest-extension-base';


export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

const extension = new AutoRestExtension();

extension.Add("aznamer", async autoRestApi => {


    try
    {
        // read files offered to this plugin
        const inputFileUris = await autoRestApi.ListInputs();

        const inputFiles: string[] = await Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));

        // read a setting

        const isDebugFlagSet = await autoRestApi.GetValue("debug");
        let azSettings = await autoRestApi.GetValue("az");


        // emit messages

        autoRestApi.Message({
            Channel: Channel.Warning,
            Text: "Hello World az namer ! The `debug` flag is " + (isDebugFlagSet ? "set" : "not set"),
        });

        autoRestApi.Message({
            Channel: Channel.Warning,
            Text: "az namer settings " + JSON.stringify(azSettings)
        });

        autoRestApi.Message({
            Channel: Channel.Information,
            Text: "AutoRest offers the following input files: " + inputFileUris.join(", "),
        });

        // emit a file (all input files concatenated)

        autoRestApi.WriteFile("myfolder/az-namer.txt", inputFiles.join("\n---\n"));
    }
    catch (e)
    {
        Error(e.message + " -- " + JSON.stringify(e.stack));
    }
});

extension.Add("renamer", async autoRestApi => {


    try
    {
        // read files offered to this plugin
        const inputFileUris = await autoRestApi.ListInputs();

        const inputFiles: string[] = await Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));

        // read a setting

        const isDebugFlagSet = await autoRestApi.GetValue("debug");
        let azSettings = await autoRestApi.GetValue("az");


        // emit messages

        autoRestApi.Message({
            Channel: Channel.Warning,
            Text: "Hello World az renamer ! The `debug` flag is " + (isDebugFlagSet ? "set" : "not set"),
        });

        autoRestApi.Message({
            Channel: Channel.Warning,
            Text: "az renamer settings " + JSON.stringify(azSettings)
        });

        autoRestApi.Message({
            Channel: Channel.Information,
            Text: "AutoRest offers the following input files: " + inputFileUris.join(", "),
        });

        // emit a file (all input files concatenated)

        autoRestApi.WriteFile("myfolder/az-renamer.txt", inputFiles.join("\n---\n"));
    }
    catch (e)
    {
        Error(e.message + " -- " + JSON.stringify(e.stack));
    }
});

extension.Add("az", async autoRestApi => {


    try
    {
        // read files offered to this plugin
        const inputFileUris = await autoRestApi.ListInputs();

        const inputFiles: string[] = await Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));

        // read a setting

        const isDebugFlagSet = await autoRestApi.GetValue("debug");
        let azSettings = await autoRestApi.GetValue("az");


        // emit messages

        autoRestApi.Message({
            Channel: Channel.Warning,
            Text: "Hello World az! The `debug` flag is " + (isDebugFlagSet ? "set" : "not set"),
        });

        autoRestApi.Message({
            Channel: Channel.Warning,
            Text: "az settings " + JSON.stringify(azSettings)
        });

        autoRestApi.Message({
            Channel: Channel.Information,
            Text: "AutoRest offers the following input files: " + inputFileUris.join(", "),
        });

        // emit a file (all input files concatenated)

        autoRestApi.WriteFile("myfolder/concataz.txt", inputFiles.join("\n---\n"));
    }
    catch (e)
    {
        Error(e.message + " -- " + JSON.stringify(e.stack));
    }
});

extension.Run();