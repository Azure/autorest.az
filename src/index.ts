import { AutoRestExtension, Channel } from '@azure-tools/autorest-extension-base';


export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

const extension = new AutoRestExtension();

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
            Text: "Hello World! The `debug` flag is " + (isDebugFlagSet ? "set" : "not set"),
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

        autoRestApi.WriteFile("myfolder/concat.txt", inputFiles.join("\n---\n"));
    }
    catch (e)
    {
        Error(e.message + " -- " + JSON.stringify(e.stack));
    }
});

extension.Run();