import { AutoRestExtension, Channel, Host } from "@azure-tools/autorest-extension-base";
import { processRequest as aznamer } from './plugins/aznamer';
import { processRequest as modifiers } from './plugins/modifiers';
import { processRequest as generator } from './plugins/azgenerator/azgenerator';

export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

const extension = new AutoRestExtension();

async function initializePlugins(pluginHost: AutoRestExtension) {
    pluginHost.Add("aznamer", aznamer);
    pluginHost.Add("modifiers", modifiers);
    pluginHost.Add("azgenerator", generator);
}

initializePlugins(extension);
extension.Run();