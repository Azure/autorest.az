/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license logCbrmation.
 *--------------------------------------------------------------------------------------------*/

import { Example } from "../Common/Example";
import { ArtifactType, LogCallback, FileCallback } from "..";
import { GenerateExampleAnsibleRest} from "./AnsibleExampleRest";
import { GenerateExamplePythonRest } from "./TemplateExamplePythonRest";
import { GenerateExamplePythonSdk } from "./TemplateExamplePythonSdk";
import { GenerateExampleAzureCLI } from "./TemplateExampleAzureCLI";

export function GenerateExamples(artifactType: ArtifactType,
                                 examples: Example[],
                                 namespace: string,
                                 mgmtClientName: string,
                                 fileCb: FileCallback,
                                 logCb: LogCallback)
{
    for (var i = 0; i < examples.length; i++)
    {
        var example: Example = examples[i];
        var filename = example.Filename;

        //-------------------------------------------------------------------------------------------------------------------------
        //
        // ANSIBLE REST EXAMPLES
        //
        //-------------------------------------------------------------------------------------------------------------------------
        if (artifactType == ArtifactType.ArtifactTypeExamplesAnsibleRest)
        {
            let p = "intermediate/examples_rest/" + filename + ".yml";
            fileCb(p, GenerateExampleAnsibleRest(example));
            logCb("EXAMPLE: " + p);
        }

        //-------------------------------------------------------------------------------------------------------------------------
        //
        // PYTHON REST EXAMPLES
        //
        //-------------------------------------------------------------------------------------------------------------------------
        if (artifactType == ArtifactType.ArtifactTypeExamplesPythonRest)
        {
            let p = filename + ".py";
            fileCb(p, GenerateExamplePythonRest(example));
            logCb("EXAMPLE: " + p);
        }

        //-------------------------------------------------------------------------------------------------------------------------
        //
        // PYTHON SDK EXAMPLES
        //
        //-------------------------------------------------------------------------------------------------------------------------
        if (artifactType == ArtifactType.ArtifactTypeExamplesPythonSdk)
        {
            let p = filename + ".py";
            fileCb(p, GenerateExamplePythonSdk(namespace, mgmtClientName, example));
            logCb("EXAMPLE: " + p);
        }

        //-------------------------------------------------------------------------------------------------------------------------
        //
        // AZURE CLI REST EXAMPLES
        //
        //-------------------------------------------------------------------------------------------------------------------------
        if (artifactType == ArtifactType.ArtifactTypeExamplesAzureCliRest)
        {
            let code = GenerateExampleAzureCLI(example);
            if (code != null)
            {
                let p = filename + ".sh";
                fileCb(p, code);
                logCb("EXAMPLE: " + p);
            }
            else
            {
                logCb("EXAMPLE CODE WAS NULL: " + filename);
            }
        }
    }
}
