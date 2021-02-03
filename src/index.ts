import { AutoRestExtension } from '@azure-tools/autorest-extension-base';
import { processRequest as hider } from './hider';
import { processRequest as renamer } from './renamer';
import { processRequest as aznamer } from './aznamer';
import { processRequest as modifiers } from './modifiers';
import { processRequest as merger } from './merger';
import { processRequest as generator } from './generate/azgenerator';
import { processRequest as entry } from './entry';
import { processRequest as azlinter } from './azlinter';

export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

export async function initializePlugins(pluginHost: AutoRestExtension) {
    pluginHost.Add('azentry', entry);
    pluginHost.Add('hider', hider);
    pluginHost.Add('renamer', renamer);
    pluginHost.Add('aznamer', aznamer);
    pluginHost.Add('modifiers', modifiers);
    pluginHost.Add('merger', merger);
    pluginHost.Add('azgenerator', generator);
    pluginHost.Add('azlinter', azlinter);
}

export async function az() {
    const extension = new AutoRestExtension();
    await initializePlugins(extension);
    extension.Run();
}

az();
