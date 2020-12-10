import * as path from 'path';
import { CodeModelAz } from '../../CodeModelAz';
import { HeaderGenerator } from '../../Header';
import { TemplateBase } from '../TemplateBase';
import { PathConstants } from '../../../../utils/models';
import { GenPreparerDependParamName, GenPreparerName, preparerInfos, PreparerInfo} from './ScenarioTool'
import { ToJsonString, ToMultiLine } from '../../../../utils/helper';

export class CliTestPrepare extends TemplateBase {
    resourceNames: string[];
    constructor(model: CodeModelAz, isDebugMode: boolean, resourceNames: string[]) {
        super(model, isDebugMode);
        this.resourceNames = resourceNames;
        if (this.model.IsCliCore) {
            this.relativePath = path.join(
                PathConstants.testFolder,
                PathConstants.latestFolder,
                PathConstants.preparersFile,
            );
        } else {
            this.relativePath = path.join(
                model.AzextFolder,
                PathConstants.testFolder,
                PathConstants.latestFolder,
                PathConstants.preparersFile,
            );
        }
    }

    public async fullGeneration(): Promise<string[]> {
        return this.GenerateAzureCliTestPrepare(this.model);
    }

    public async incrementalGeneration(base: string): Promise<string[]> {
        return this.fullGeneration();
    }

    private AddPreparer(model: CodeModelAz, resourceName: string, output: string[]) {
        const preparerInfo = preparerInfos[resourceName];
        output.push("");
        output.push("");
        output.push(`class ${GenPreparerName(preparerInfo.className)}(NoTrafficRecordingPreparer, SingleValueReplacer):`);

        let buf: string[] = [];
        buf.push("    def __init__(self,");
        
        for (let i=0; i<preparerInfo.dependResources.length; i++) {
            buf.push(`                 ${preparerInfos[preparerInfo.className].dependParameters[i]}=${ToJsonString(preparerInfos[preparerInfos[preparerInfo.className].dependResources[i]].key)},`);
        }
        buf.push(`                 key=${ToJsonString(preparerInfo.key)},`);
        for (let k in preparerInfo.config.inits) {
            buf.push(`                 ${k}=${ToJsonString(preparerInfo.config.inits[k])},`);
        }
        buf.splice(-1,1, buf.last.slice(0, -1)+"):");
        output.push(...buf);

        // output.push("                 parameter_name='virtual_network',");
        // output.push("                 resource_group_name=None,");
        // output.push("                 resource_group_key=KEY_RESOURCE_GROUP,");
        // output.push("                 dev_setting_name='AZURE_CLI_TEST_DEV_VIRTUAL_NETWORK_NAME',");
        // output.push("                 random_name_length=24, key=KEY_VIRTUAL_NETWORK):");
        // output.push("        if ' ' in name_prefix:");
        // output.push("            raise CliTestError(");
        // output.push("                'Error: Space character in name prefix \\'%s\\'' % name_prefix)");
        output.push(`        super(${GenPreparerName(preparerInfo.className)}, self).__init__(`);
        output.push("            name_prefix, random_name_length)");
        output.push("        self.cli_ctx = get_dummy_cli()");
        // output.push("        self.parameter_name = parameter_name");
        output.push("        self.key = key");
        for (let param of preparerInfo.dependParameters.concat(Object.getOwnPropertyNames(preparerInfo.config.inits))) {
            output.push(`        self.${param} = ${param}`);
        }
        // output.push("        self.resource_group_name = resource_group_name");
        // output.push("        self.resource_group_key = resource_group_key");
        // output.push("        self.dev_setting_name = os.environ.get(dev_setting_name, None)");
        output.push("");
        output.push("    def create_resource(self, name, **_):");
        // output.push("        if self.dev_setting_name:");
        // output.push("            return {self.parameter_name: self.dev_setting_name, }");
        // output.push("");
        // output.push("        if not self.resource_group_name:");
        // output.push("            self.resource_group_name = self.test_class_instance.kwargs.get(");
        // output.push("                self.resource_group_key)");
        // output.push("            if not self.resource_group_name:");
        // output.push("                raise CliTestError(\"Error: No resource group configured!\")");
        // output.push("");
        // output.push("        tags = {'product': 'azurecli', 'cause': 'automation',");
        // output.push("                'date': datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}");
        // output.push("        if 'ENV_JOB_NAME' in os.environ:");
        // output.push("            tags['job'] = os.environ['ENV_JOB_NAME']");
        // output.push("        tags = ' '.join(['{}={}'.format(key, value)");
        // output.push("                         for key, value in tags.items()])");
        function genLiveRun(templates: string[]) {
            for (let template of templates) {
                let variables: string[] = [];
                let depends: string[] = template.match(/\{.*?\}/g);
                depends = depends.map((x: string)=>{
                    return x.substr(1, x.length-2).toLowerCase();
                });
                for (let depend of depends) {
                    if (depend == "name") {
                        variables.push(`name`);
                    }
                    else {
                        for (let i=0; i<preparerInfos[preparerInfo.class_name].depend_parameters.length; i++) {
                            if (model.GetResourcePool().isResource(preparerInfos[preparerInfo.class_name].depend_resources[i], null)==model.GetResourcePool().isResource(depend, null)) {
                                variables.push(`self.test_class_instance.kwargs.get(self.${preparerInfos[preparerInfo.class_name].depend_parameters[i]})`);
                            }
                        }  
                    }
                }
                ToMultiLine(`        template = '${template.replace(/\{.*?\}/g, '{}')}'`, output);
                ToMultiLine(`        self.live_only_execute(self.cli_ctx, template.format(${variables.join(", ")}))`, output);
            }
        }
        genLiveRun(preparerInfo.config.create);
        
        // output.push("        template = 'az network vnet create --resource-group {} --name {} --subnet-name default --tag ' + tags");
        // output.push("        self.live_only_execute(self.cli_ctx, template.format(");
        // output.push("            self.resource_group_name, name))");
        output.push("");
        output.push("        self.test_class_instance.kwargs[self.key] = name");
        output.push("        return {self.key: name}");
        output.push("");
        output.push("    def remove_resource(self, name, **_):");
        genLiveRun(preparerInfo.config.delete);
        // output.push("        if not self.dev_setting_name:");
        // output.push("            self.live_only_execute(");
        // output.push("                self.cli_ctx,");
        // output.push("                'az network vnet delete --name {} --resource-group {}'.format(name, self.resource_group_name))");
        output.push("");
        // output.push("");
        // output.push("class VnetSubnetPreparer(NoTrafficRecordingPreparer, SingleValueReplacer):");
        // output.push("    def __init__(self, name_prefix='clitest.vn',");
        // output.push("                 parameter_name='subnet',");
        // output.push("                 resource_group_key=KEY_RESOURCE_GROUP,");
        // output.push("                 vnet_key=KEY_VIRTUAL_NETWORK,");
        // output.push("                 address_prefixes=\"11.0.0.0/24\",");
        // output.push("                 dev_setting_name='AZURE_CLI_TEST_DEV_VNET_SUBNET_NAME',");
        // output.push("                 key=KEY_VNET_SUBNET):");
        // output.push("        if ' ' in name_prefix:");
        // output.push("            raise CliTestError(");
        // output.push("                'Error: Space character in name prefix \\'%s\\'' % name_prefix)");
        // output.push("        super(VnetSubnetPreparer, self).__init__(name_prefix, 15)");
        // output.push("        self.cli_ctx = get_dummy_cli()");
        // output.push("        self.parameter_name = parameter_name");
        // output.push("        self.key = key");
        // output.push("        self.resource_group = [resource_group_key, None]");
        // output.push("        self.vnet = [vnet_key, None]");
        // output.push("        self.address_prefixes = address_prefixes");
        // output.push("        self.dev_setting_name = os.environ.get(dev_setting_name, None)");
        // output.push("");
        // output.push("    def create_resource(self, name, **_):");
        // output.push("        if self.dev_setting_name:");
        // output.push("            return {self.parameter_name: self.dev_setting_name, }");
        // output.push("");
        // output.push("        if not self.resource_group[1]:");
        // output.push("            self.resource_group[1] = self.test_class_instance.kwargs.get(");
        // output.push("                self.resource_group[0])");
        // output.push("            if not self.resource_group[1]:");
        // output.push("                raise CliTestError(\"Error: No resource group configured!\")");
        // output.push("        if not self.vnet[1]:");
        // output.push("            self.vnet[1] = self.test_class_instance.kwargs.get(self.vnet[0])");
        // output.push("            if not self.vnet[1]:");
        // output.push("                raise CliTestError(\"Error: No vnet configured!\")");
        // output.push("");
        // // output.push("        # tags = {'product': 'azurecli', 'cause': 'automation',");
        // // output.push("        #         'date': datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}");
        // // output.push("        # if 'ENV_JOB_NAME' in os.environ:");
        // // output.push("        #     tags['job'] = os.environ['ENV_JOB_NAME']");
        // // output.push("        # tags = ' '.join(['{}={}'.format(key, value)");
        // // output.push("        #                  for key, value in tags.items()])");
        // // output.push("        template = \"az network vnet subnet create --resource-group {} \" \\");
        // // output.push("            \"--vnet-name {} --name {} --address-prefixes {}\"");
        // // output.push("        self.live_only_execute(self.cli_ctx, template.format(");
        // // output.push("            self.resource_group_name, self.vnet_name, name,");
        // // output.push("            self.address_prefixes))");
        // // output.push("");
        // output.push("        self.test_class_instance.kwargs[self.key] = 'default'");
        // output.push("        return {self.parameter_name: name}");
        // output.push("");
        // output.push("    def remove_resource(self, name, **_):");
        // output.push("        pass");
        // // output.push("        # delete vnet if test is being recorded and if the vnet is not a dev rg");
        // // output.push("        if not self.dev_setting_name:");
        // // output.push("            self.live_only_execute(self.cli_ctx, \"az network vnet subnet\"");
        // // output.push("                                   \"delete --name {} --resource-group {} \"");
        // // output.push("                                   \"--vnet-name {}\".format(");
        // // output.push("                                       name, self.resource_group_name,");
        // // output.push("                                       self.vnet_name))");
        // output.push("");
        // output.push("");
        // output.push("class VnetNicPreparer(NoTrafficRecordingPreparer, SingleValueReplacer):");
        // output.push("    def __init__(self, name_prefix='clitest.nic',");
        // output.push("                 parameter_name='subnet',");
        // output.push("                 resource_group_key=KEY_RESOURCE_GROUP,");
        // output.push("                 vnet_key=KEY_VIRTUAL_NETWORK,");
        // output.push("                 dev_setting_name='AZURE_CLI_TEST_DEV_VNET_NIC_NAME',");
        // output.push("                 key=KEY_VNET_NIC):");
        // output.push("        if ' ' in name_prefix:");
        // output.push("            raise CliTestError(");
        // output.push("                'Error: Space character in name prefix \\'%s\\'' % name_prefix)");
        // output.push("        super(VnetNicPreparer, self).__init__(name_prefix, 15)");
        // output.push("        self.cli_ctx = get_dummy_cli()");
        // output.push("        self.parameter_name = parameter_name");
        // output.push("        self.key = key");
        // output.push("        self.resource_group = [resource_group_key, None]");
        // output.push("        self.vnet = [vnet_key, None]");
        // output.push("        self.dev_setting_name = os.environ.get(dev_setting_name, None)");
        // output.push("");
        // output.push("    def create_resource(self, name, **_):");
        // output.push("        if self.dev_setting_name:");
        // output.push("            return {self.parameter_name: self.dev_setting_name, }");
        // output.push("");
        // output.push("        if not self.resource_group[1]:");
        // output.push("            self.resource_group[1] = self.test_class_instance.kwargs.get(");
        // output.push("                self.resource_group[0])");
        // output.push("            if not self.resource_group[1]:");
        // output.push("                raise CliTestError(\"Error: No resource group configured!\")");
        // output.push("        if not self.vnet[1]:");
        // output.push("            self.vnet[1] = self.test_class_instance.kwargs.get(self.vnet[0])");
        // output.push("            if not self.vnet[1]:");
        // output.push("                raise CliTestError(\"Error: No vnet configured!\")");
        // output.push("");
        // output.push("        template = 'az network nic create --resource-group {} --name {} --vnet-name {} --subnet default '");
        // output.push("        self.live_only_execute(self.cli_ctx, template.format(");
        // output.push("            self.resource_group[1], name, self.vnet[1]))");
        // output.push("");
        // output.push("        self.test_class_instance.kwargs[self.key] = name");
        // output.push("        return {self.parameter_name: name}");
        // output.push("");
        // output.push("    def remove_resource(self, name, **_):");
        // output.push("        if not self.dev_setting_name:");
        // output.push("            self.live_only_execute(");
        // output.push("                self.cli_ctx,");
        // output.push("                'az network nic delete --name {} --resource-group {}'.format(name, self.resource_group[1]))");
        // output.push("");
    }
    private GenerateAzureCliTestPrepare(model: CodeModelAz): string[] {
        let header: HeaderGenerator = new HeaderGenerator();
        var output: string[] = header.getLines();
        output.push("");
        // output.push("import os");
        // output.push("from datetime import datetime");
        output.push("from azure_devtools.scenario_tests import SingleValueReplacer");
        output.push("from azure.cli.testsdk.preparers import NoTrafficRecordingPreparer");
        output.push("from azure.cli.testsdk.exceptions import CliTestError");
        output.push("from azure.cli.testsdk.reverse_dependency import get_dummy_cli");
        // output.push("");
        // output.push("");
        // output.push("KEY_RESOURCE_GROUP = 'rg'");
        // output.push("KEY_VIRTUAL_NETWORK = 'vnet'");
        // output.push("KEY_VNET_SUBNET = 'subnet'");
        // output.push("KEY_VNET_NIC = 'nic'");
        output.push("");
        for (const resourceName of this.resourceNames) {
            this.AddPreparer(model, resourceName, output);
        }
        return output;
    }
}
