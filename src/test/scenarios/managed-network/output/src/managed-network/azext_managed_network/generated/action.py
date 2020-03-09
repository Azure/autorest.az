# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

import argparse
from knack.util import CLIError


# pylint: disable=protected-access


class AddParameters(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(AddParameters, self).__call__(parser, namespace, action, option_string)

    def get_action(self, values, option_string):  # pylint: disable=no-self-use
        try:
            properties = dict(x.split('=', 1) for x in values)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]
            if kl == 'tags':
                d['tags'] = v
        return d


class AddManagedNetworkGroup(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(AddManagedNetworkGroup, self).__call__(parser, namespace, action, option_string)

    def get_action(self, values, option_string):  # pylint: disable=no-self-use
        try:
            properties = dict(x.split('=', 1) for x in values)
        except ValueError:
            raise CLIError('usage error: {} [KEY=VALUE ...]'.format(option_string))
        d = {}
        for k in properties:
            kl = k.lower()
            v = properties[k]
            if kl == 'kind':
                d['kind'] = v
            elif kl == 'provisioning_state':
                d['provisioning_state'] = v
            elif kl == 'etag':
                d['etag'] = v
            elif kl == 'management_groups':
                d['management_groups'] = v
            elif kl == 'subscriptions':
                d['subscriptions'] = v
            elif kl == 'virtual_networks':
                d['virtual_networks'] = v
            elif kl == 'subnets':
                d['subnets'] = v
        return d
