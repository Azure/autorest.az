# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
# pylint: disable=protected-access

import argparse
from knack.util import CLIError


class AddIdentity(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        namespace.identity = action

    def get_action(self, values, option_string):  # pylint: disable=no-self-use
        try:
            properties = dict(x.split('=', 1) for x in values)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]
        return d


class AddFactoryVstsConfiguration(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        namespace.factory_vsts_configuration = action

    def get_action(self, values, option_string):  # pylint: disable=no-self-use
        try:
            properties = dict(x.split('=', 1) for x in values)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]
            if kl == 'project-name':
                d['project_name'] = v
            elif kl == 'tenant-id':
                d['tenant_id'] = v
            elif kl == 'type':
                d['type'] = v
            elif kl == 'account-name':
                d['account_name'] = v
            elif kl == 'repository-name':
                d['repository_name'] = v
            elif kl == 'collaboration-branch':
                d['collaboration_branch'] = v
            elif kl == 'root-folder':
                d['root_folder'] = v
            elif kl == 'last-commit-id':
                d['last_commit_id'] = v
        return d


class AddFactoryGitHubConfiguration(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        namespace.factory_git_hub_configuration = action

    def get_action(self, values, option_string):  # pylint: disable=no-self-use
        try:
            properties = dict(x.split('=', 1) for x in values)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]
            if kl == 'host-name':
                d['host_name'] = v
            elif kl == 'type':
                d['type'] = v
            elif kl == 'account-name':
                d['account_name'] = v
            elif kl == 'repository-name':
                d['repository_name'] = v
            elif kl == 'collaboration-branch':
                d['collaboration_branch'] = v
            elif kl == 'root-folder':
                d['root_folder'] = v
            elif kl == 'last-commit-id':
                d['last_commit_id'] = v
        return d
