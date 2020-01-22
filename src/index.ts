import { AutoRestExtension, Channel, Host } from '@azure-tools/autorest-extension-base';
import { processRequest as aznamer } from './plugins/aznamer';
import { processRequest as modifiers } from './plugins/modifiers';
import { processRequest as generator } from './plugins/azgenerator/azgenerator';
import { ALPN_ENABLED } from 'constants';

export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

const extension = new AutoRestExtension();

// [ZIM] for now disabled until it actually works
extension.Add("azclicommon", async autoRestApi => {


    try
    {
        // read files offered to this plugin
        const inputFileUris = await autoRestApi.ListInputs();

        const inputFiles: string[] = await Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));

        // read a setting

        const isDebugFlagSet = await autoRestApi.GetValue("debug");
        let azSettings = await autoRestApi.GetValue("az");
        let extensions = azSettings['extensions'];


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

        autoRestApi.WriteFile("code-model-pynamer.yaml", inputFiles.join("\n---\n"));
    }
    catch (e)
    {
        Error(e.message + " -- " + JSON.stringify(e.stack));
    }
});


async function initializePlugins(pluginHost: AutoRestExtension) {
    pluginHost.Add("aznamer", aznamer);
    pluginHost.Add("modifiers", modifiers);
    pluginHost.Add("azgenerator", generator);
}

initializePlugins(extension);
extension.Run();