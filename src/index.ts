import { AutoRestExtension, Channel } from '@azure-tools/autorest-extension-base';
import * as yaml from "node-yaml";

// Generic
import { MapGenerator } from "./Common/MapGenerator"
import { MapFlattener } from "./Common/MapFlattener"
import { MapFlattenerObsolete } from "./Common/MapFlattenerObsolete"
import { ExampleProcessor } from "./Common/ExampleProcessor"; 
import { Example } from "./Common/Example";

// Generators
import { GenerateExamples } from "./Examples/Generator";

import { Adjustments } from "./Common/Adjustments"; 
import { MapModuleGroup } from "./Common/ModuleMap";

export type LogCallback = (message: string) => void;
export type FileCallback = (path: string, rows: string[]) => void;

const extension = new AutoRestExtension();

export enum ArtifactType
{
    ArtifactTypeAzureAzModule,
    ArtifactTypeAzureAzExtension,
    ArtifactTypeExamplesAzureCliRest,
    ArtifactTypeExamplesPythonRest,
    ArtifactTypeExamplesPythonSdk,
    ArtifactTypeExamplesAnsibleRest,
    ArtifactTypeExamplesAnsibleModule
}

extension.Add("az", async autoRestApi => {

    let log = await autoRestApi.GetValue("log");

    function Info(s: string)
    {
        if (log)
        {
            autoRestApi.Message({
                Channel: Channel.Information,
                Text: s
            });
        }
    }

    function Error(s: string)
    {
        autoRestApi.Message({
            Channel: Channel.Error,
            Text: s
        });
    }

    function WriteFile(path: string, rows: string[])
    {
        autoRestApi.WriteFile(path, rows.join('\r\n'));
    }

    try
    {
        // read files offered to this plugin
        const inputFileUris = await autoRestApi.ListInputs();

        const inputFiles: string[] = await Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));

        let artifactType: ArtifactType;
        let writeIntermediate: boolean = false;

        // namespace is the only obligatory option
        // we will derive default "package-name" and "root-name" from it
        const namespace = await autoRestApi.GetValue("namespace");

        if (!namespace)
        {
            Error("\"namespace\" is not defined, please add readme.az.md file to the specification.");
            return;
        }

        // package name and group name can be guessed from namespace
        let packageName = await autoRestApi.GetValue("package-name") || namespace.replace(/\./g, '-');
        let cliName = await autoRestApi.GetValue("group-name") || await autoRestApi.GetValue("cli-name") || packageName.split('-').pop();

        // this will be obsolete
        let adjustments = await autoRestApi.GetValue("adjustments");

        let cliCommandOverrides = await autoRestApi.GetValue("cmd-override");
        let optionOverrides = await autoRestApi.GetValue("option-override");

        let testScenario: any[] = await autoRestApi.GetValue("test-setup") || await autoRestApi.GetValue("test-scenario");

        /* THIS IS TO BE OBSOLETED ---------------------------*/
        if (adjustments == null) adjustments = {};
        let adjustmentsObject = new Adjustments(adjustments);
        /*----------------------------------------------------*/
        let flattenAll = await autoRestApi.GetValue("flatten-all");
        let tag = await autoRestApi.GetValue("tag");
        Info(tag);
        let generateReport = await autoRestApi.GetValue("report");

        // Handle generation type parameter
        if (await autoRestApi.GetValue("az"))
        {
            Info("GENERATION: --az");
            artifactType = (await autoRestApi.GetValue("extension")) ? ArtifactType.ArtifactTypeAzureAzExtension : ArtifactType.ArtifactTypeAzureAzModule;
        }

        for (let iff of inputFiles)
        {
            //-------------------------------------------------------------------------------------------------------------------------
            //
            // PARSE INPUT MODEL
            //
            //-------------------------------------------------------------------------------------------------------------------------
            let swagger = JSON.parse(iff);

            //-------------------------------------------------------------------------------------------------------------------------
            //
            // PROCESS EXAMPLES
            //
            //-------------------------------------------------------------------------------------------------------------------------
            let exampleProcessor = new ExampleProcessor(swagger, testScenario);
            let examples: Example[] = exampleProcessor.GetExamples();

            //-------------------------------------------------------------------------------------------------------------------------
            //
            // GENERATE RAW MAP
            //
            //-------------------------------------------------------------------------------------------------------------------------
            let mapGenerator = new MapGenerator(swagger, adjustmentsObject, cliName, examples, function(msg: string) {
                if (log == "map")
                {
                    Info(msg);
                }
            }, Error);
          
            let map: MapModuleGroup = null;
            try
            {
                map = mapGenerator.CreateMap();
            }
            catch (e)
            {
                Error("ERROR " + e.stack);
            }

            if (writeIntermediate)
            {
              autoRestApi.WriteFile("intermediate/" + cliName + "-map-unflattened.yml", yaml.dump(map));
            }

            //-------------------------------------------------------------------------------------------------------------------------
            //
            // MAP FLATTENING AND TRANSFORMATIONS
            //
            //-------------------------------------------------------------------------------------------------------------------------
            let mapFlattener = flattenAll ? 
                              new MapFlattener(map, optionOverrides, cliCommandOverrides, function(msg: string) {
                                  if (log == "flattener")
                                    Info(msg);
                                }) :
                                new MapFlattenerObsolete(map, adjustmentsObject, flattenAll, optionOverrides, cliCommandOverrides, function(msg: string) {
                                  if (log == "flattener")
                                    Info(msg);
                                });

            mapFlattener.Transform();

            //-------------------------------------------------------------------------------------------------------------------------
            //
            // UPDATE TEST DESCRIPTIONS USING TEST SETUP
            //
            //-------------------------------------------------------------------------------------------------------------------------
            if (testScenario)
            {
                testScenario.forEach(element => {
                    if (element['title'] != undefined)
                    {
                        map.Modules.forEach(m => {
                            m.Examples.forEach(e => {
                                if (e.Id == element['name'])
                                {
                                    e.Title = element['title'];
                                }
                            })
                        });
                    }
                });
            }

            //-------------------------------------------------------------------------------------------------------------------------
            //
            // WRITE INTERMEDIATE FILE IF --intermediate OPTION WAS SPECIFIED
            //
            //-------------------------------------------------------------------------------------------------------------------------
            if (writeIntermediate)
            {
                autoRestApi.WriteFile("intermediate/" + cliName + "-input.yml", yaml.dump(swagger));
            }
        
            if (map != null)
            {
                if (writeIntermediate)
                {
                    autoRestApi.WriteFile("intermediate/" + cliName + "-map-pre.yml", yaml.dump(map));
                }

                //-------------------------------------------------------------------------------------------------------------------------
                //
                // REST EXAMPLES
                //
                //-------------------------------------------------------------------------------------------------------------------------

                if (artifactType == ArtifactType.ArtifactTypeExamplesAnsibleRest ||
                    artifactType == ArtifactType.ArtifactTypeExamplesPythonRest ||
                    artifactType == ArtifactType.ArtifactTypeExamplesPythonSdk ||
                    artifactType == ArtifactType.ArtifactTypeExamplesAzureCliRest)
                {
                    GenerateExamples(artifactType, examples, map.Namespace, map.MgmtClientName, WriteFile, Info);
                }
                //-------------------------------------------------------------------------------------------------------------------------
                //
                // INTERMEDIATE MAP
                //
                //-------------------------------------------------------------------------------------------------------------------------
                if (writeIntermediate)
                {
                  // write map after everything is done
                  autoRestApi.WriteFile("intermediate/" + cliName + "-map.yml", yaml.dump(map));
                }
            }
        }
    }
    catch (e)
    {
        Error(e.message + " -- " + JSON.stringify(e.stack));
    }
});

extension.Run();