# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------


# pylint: disable=protected-access

# pylint: disable=no-self-use


import argparse
from collections import defaultdict
from knack.util import CLIError


class AddFactoryVstsConfiguration(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)

        namespace.factory_vsts_configuration = action[0]

    def get_action(self, values, option_string=None):
        try:
            value_chunk_list = [values[x: x + 7] for x in range(0, len(values), 7)]
            value_list = []
            for chunk in value_chunk_list:
                (
                    project_name,
                    tenant_id,
                    account_name,
                    repository_name,
                    collaboration_branch,
                    root_folder,
                    last_commit_id,
                ) = chunk
                value_list.append(
                    {
                        'project_name': project_name,
                        'tenant_id': tenant_id,
                        'account_name': account_name,
                        'repository_name': repository_name,
                        'collaboration_branch': collaboration_branch,
                        'root_folder': root_folder,
                        'last_commit_id': last_commit_id,
                    }
                )
            return value_list
        except ValueError:
            raise CLIError('usage error: {} NAME METRIC OPERATION VALUE'.format(option_string))


class AddFactoryGitHubConfiguration(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        namespace.factory_git_hub_configuration = action

    def get_action(self, values, option_string):
        try:
            properties = defaultdict(list)
            for (k, v) in (x.split('=', 1) for x in values):
                properties[k].append(v)
            properties = dict(properties)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]

            if kl == 'host-name':

                d['host_name'] = v[0]

            elif kl == 'account-name':

                d['account_name'] = v[0]

            elif kl == 'repository-name':

                d['repository_name'] = v[0]

            elif kl == 'collaboration-branch':

                d['collaboration_branch'] = v[0]

            elif kl == 'root-folder':

                d['root_folder'] = v[0]

            elif kl == 'last-commit-id':

                d['last_commit_id'] = v[0]

            else:
                raise CLIError(
                    'Unsupported Key {} is provided for parameter factory-git-hub-configuration. All possible keys are:'
                    ' host-name, account-name, repository-name, collaboration-branch, root-folder, last-commit-id'
                    .format(k)
                )

        d['type'] = 'FactoryGitHubConfiguration'

        return d


class AddFakeIdentity(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)

        namespace.fake_identity = action[0]

    def get_action(self, values, option_string=None):
        try:
            value_chunk_list = [values[x: x + 2] for x in range(0, len(values), 2)]
            value_list = []
            for chunk in value_chunk_list:
                name, zones_inside = chunk
                value_list.append(
                    {
                        'name': name,
                        'zones_inside': zones_inside,
                    }
                )
            return value_list
        except ValueError:
            raise CLIError('usage error: {} NAME METRIC OPERATION VALUE'.format(option_string))


class AddReplicaSets(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(AddReplicaSets, self).__call__(parser, namespace, action, option_string)

    def get_action(self, values, option_string):
        try:
            properties = defaultdict(list)
            for (k, v) in (x.split('=', 1) for x in values):
                properties[k].append(v)
            properties = dict(properties)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]

            if kl == 'location':

                d['location'] = v[0]

            elif kl == 'subnet-id':

                d['subnet_id'] = v[0]

            else:
                raise CLIError(
                    'Unsupported Key {} is provided for parameter replica-sets. All possible keys are: location,'
                    ' subnet-id'.format(k)
                )

        return d
