import { AutoRestExtension, Channel, Host } from "@azure-tools/autorest-extension-base";
import { processRequest as hider } from './plugins/hider';
import { processRequest as aznamer } from './plugins/aznamer';
import { processRequest as modifiers } from './plugins/modifiers';
import { processRequest as merger } from './plugins/merger';
import { processRequest as generator } from './plugins/azgenerator/azgenerator';

export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

export async function initializePlugins(pluginHost: AutoRestExtension) {
    pluginHost.Add('hider', hider);
    pluginHost.Add("aznamer", aznamer);
    pluginHost.Add("modifiers", modifiers);
    pluginHost.Add('merger', merger);
    pluginHost.Add("azgenerator", generator);
}

export async function az() {
    const extension = new AutoRestExtension();
    await initializePlugins(extension);
    extension.Run();
}

az();