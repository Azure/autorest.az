/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import * as assert from 'assert';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { readFile } from '@azure-tools/async-io';
sourceMapSupport.install();

describe('renderSetupCFG', () => {
    it('renderSetupCFGTest', async () => {
        const tmplPath = path.join(`${__dirname}`, '../../src/templates/report.md.njx');
        nunjucks.configure({ autoescape: false });
        const result = nunjucks.render(tmplPath, {
            hasExtension: true,
            Extensions: [
                {
                    name: 'offazure',
                    hasCommandGroup: true,
                    CommandGroups: [
                        {
                            name: 'offazure hyperv cluster',
                            cliKey: 'HyperVCluster',
                            hasCommand: true,
                            Commands: [
                                {
                                    name: 'offazure hyperv cluster cluster list',
                                    hasMethod: true,
                                    Methods: [
                                        {
                                            cliKey: 'GetAllClustersInSite',
                                            hasMethodParameter: true,
                                            MethodParameters: [
                                                {
                                                    mapsTo: 'subscription-id',
                                                    type: 'string',
                                                    description:
                                                        'The ID of the target subscription.',
                                                    name: 'subscription_id',
                                                    cliKey: 'subscriptionId',
                                                },
                                                {
                                                    mapsTo: 'resource-group-name',
                                                    type: 'string',
                                                    description:
                                                        'The name of the resource group. The name is case insensitive.',
                                                    name: 'resource_group_name',
                                                    cliKey: 'resourceGroupName',
                                                },
                                                {
                                                    mapsTo: 'site-name',
                                                    type: 'string',
                                                    description: 'Site name.',
                                                    name: 'site_name',
                                                    cliKey: 'siteName',
                                                },
                                                {
                                                    mapsTo: 'filter',
                                                    type: 'string',
                                                    description: '',
                                                    name: 'filter',
                                                    cliKey: '$filter',
                                                },
                                            ],
                                            hasAzExample: true,
                                            AzExamples: [
                                                {
                                                    commandStringItems: [
                                                        'az offazure hyperv cluster cluster list --resource-group "ipsahoo-RI-121119" --site-name "hyperv121319c813site" ',
                                                        '--subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'offazure hyperv cluster cluster show',
                                    hasMethod: true,
                                    Methods: [
                                        {
                                            cliKey: 'GetCluster',
                                            hasMethodParameter: true,
                                            MethodParameters: [
                                                {
                                                    mapsTo: 'subscription-id',
                                                    type: 'string',
                                                    description:
                                                        'The ID of the target subscription.',
                                                    name: 'subscription_id',
                                                    cliKey: 'subscriptionId',
                                                },
                                                {
                                                    mapsTo: 'resource-group-name',
                                                    type: 'string',
                                                    description:
                                                        'The name of the resource group. The name is case insensitive.',
                                                    name: 'resource_group_name',
                                                    cliKey: 'resourceGroupName',
                                                },
                                                {
                                                    mapsTo: 'site-name',
                                                    type: 'string',
                                                    description: 'Site name.',
                                                    name: 'site_name',
                                                    cliKey: 'siteName',
                                                },
                                                {
                                                    mapsTo: 'name',
                                                    type: 'string',
                                                    description: 'Cluster ARM name.',
                                                    name: 'cluster_name',
                                                    cliKey: 'clusterName',
                                                },
                                            ],
                                            hasAzExample: true,
                                            AzExamples: [
                                                {
                                                    commandStringItems: [
                                                        'az offazure hyperv cluster show --name "hypgqlclusrs1-ntdev-corp-micros-11e77b27-67cc-5e46-a5d8-0ff3dc2ef179" ',
                                                        '--resource-group "ipsahoo-RI-121119" --site-name "hyperv121319c813site" --subscription-id ',
                                                        '"4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'offazure hyperv host',
                            cliKey: 'HyperVHost',
                            hasCommand: true,
                            Commands: [
                                {
                                    name: 'offazure hyperv host put-host',
                                    hasMethod: true,
                                    Methods: [
                                        {
                                            cliKey: 'PutHost',
                                            hasMethodParameter: true,
                                            MethodParameters: [
                                                {
                                                    mapsTo: 'subscription-id',
                                                    type: 'string',
                                                    description:
                                                        'The ID of the target subscription.',
                                                    name: 'subscription_id',
                                                    cliKey: 'subscriptionId',
                                                },
                                                {
                                                    mapsTo: 'resource-group-name',
                                                    type: 'string',
                                                    description:
                                                        'The name of the resource group. The name is case insensitive.',
                                                    name: 'resource_group_name',
                                                    cliKey: 'resourceGroupName',
                                                },
                                                {
                                                    mapsTo: 'site-name',
                                                    type: 'string',
                                                    description: 'Site name.',
                                                    name: 'site_name',
                                                    cliKey: 'siteName',
                                                },
                                                {
                                                    mapsTo: 'host-name',
                                                    type: 'string',
                                                    description: 'Host ARM name.',
                                                    name: 'host_name',
                                                    cliKey: 'hostName',
                                                },
                                                {
                                                    mapsTo: 'name',
                                                    type: 'string',
                                                    description: 'Name of the host.',
                                                    name: 'name',
                                                    cliKey: 'name',
                                                },
                                                {
                                                    mapsTo: 'fqdn',
                                                    type: 'string',
                                                    description:
                                                        'FQDN/IPAddress of the Hyper-V host.',
                                                    name: 'fqdn',
                                                    cliKey: 'fqdn',
                                                },
                                                {
                                                    mapsTo: 'run-as-account-id',
                                                    type: 'string',
                                                    description:
                                                        'Run as account ID of the Hyper-V host.',
                                                    name: 'run_as_account_id',
                                                    cliKey: 'runAsAccountId',
                                                },
                                            ],
                                            hasAzExample: true,
                                            AzExamples: [
                                                {
                                                    commandStringItems: [
                                                        'az offazure hyperv host put-host --fqdn "10.10.10.20" --run-as-account-id "Account1" --host-name "Host1" ',
                                                        '--resource-group "pajindTest" --site-name "appliance1e39site" --subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'offazure hyperv host show-all-host-in-site',
                                    hasMethod: true,
                                    Methods: [
                                        {
                                            cliKey: 'GetAllHostsInSite',
                                            hasMethodParameter: true,
                                            MethodParameters: [
                                                {
                                                    mapsTo: 'subscription-id',
                                                    type: 'string',
                                                    description:
                                                        'The ID of the target subscription.',
                                                    name: 'subscription_id',
                                                    cliKey: 'subscriptionId',
                                                },
                                                {
                                                    mapsTo: 'resource-group-name',
                                                    type: 'string',
                                                    description:
                                                        'The name of the resource group. The name is case insensitive.',
                                                    name: 'resource_group_name',
                                                    cliKey: 'resourceGroupName',
                                                },
                                                {
                                                    mapsTo: 'site-name',
                                                    type: 'string',
                                                    description: 'Site name.',
                                                    name: 'site_name',
                                                    cliKey: 'siteName',
                                                },
                                                {
                                                    mapsTo: 'filter',
                                                    type: 'string',
                                                    description: '',
                                                    name: 'filter',
                                                    cliKey: '$filter',
                                                },
                                            ],
                                            hasAzExample: true,
                                            AzExamples: [
                                                {
                                                    commandStringItems: [
                                                        'az offazure hyperv host show-all-host-in-site --resource-group "pajindTest" --site-name "appliance1e39site" ',
                                                        '--subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'offazure hyperv host show-host',
                                    hasMethod: true,
                                    Methods: [
                                        {
                                            cliKey: 'GetHost',
                                            hasMethodParameter: true,
                                            MethodParameters: [
                                                {
                                                    mapsTo: 'subscription-id',
                                                    type: 'string',
                                                    description:
                                                        'The ID of the target subscription.',
                                                    name: 'subscription_id',
                                                    cliKey: 'subscriptionId',
                                                },
                                                {
                                                    mapsTo: 'resource-group-name',
                                                    type: 'string',
                                                    description:
                                                        'The name of the resource group. The name is case insensitive.',
                                                    name: 'resource_group_name',
                                                    cliKey: 'resourceGroupName',
                                                },
                                                {
                                                    mapsTo: 'site-name',
                                                    type: 'string',
                                                    description: 'Site name.',
                                                    name: 'site_name',
                                                    cliKey: 'siteName',
                                                },
                                                {
                                                    mapsTo: 'host-name',
                                                    type: 'string',
                                                    description: 'Host ARM name.',
                                                    name: 'host_name',
                                                    cliKey: 'hostName',
                                                },
                                            ],
                                            hasAzExample: true,
                                            AzExamples: [
                                                {
                                                    commandStringItems: [
                                                        'az offazure hyperv host show-host --host-name "bcdr-ewlab-46-ntdev-corp-micros-e4638031-3b19-5642-926d-385da60cfb8a" ',
                                                        '--resource-group "pajindTest" --site-name "appliance1e39site" --subscription-id "4bd2aa0f-2bd2-4d67-91a8-5a4533d58600"',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        const expectedFile = path.join(`${__dirname}`, '../../test/unittest/expected/report.md');
        const expected = await readFile(expectedFile);
        assert.deepStrictEqual(result, expected, 'render logic 1 in setup.py is incorrect');
    });
});
