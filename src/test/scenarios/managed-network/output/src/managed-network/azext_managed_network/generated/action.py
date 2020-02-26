import argparse
from knack.util import CLIError


# pylint: disable=protected-access


class AddManagedNetwork(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddManagementGroups(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddSubscriptions(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddVirtualNetworks(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddSubnets(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddParameters(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddParameters(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddManagedNetworkGroup(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddManagementGroups(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddSubscriptions(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddVirtualNetworks(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddSubnets(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddManagedNetworkPolicy(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddSpokes(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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


class AddMesh(argparse._AppendAction):
    def __call__(self, parser, namespace, values, option_string=None):
        action = self.get_action(values, option_string)
        super(ImageBuilderAddCustomize, self).__call__(parser, namespace, action, option_string)

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