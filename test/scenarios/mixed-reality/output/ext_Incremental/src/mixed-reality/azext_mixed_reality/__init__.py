# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
#
# Generation mode: Incremental
# --------------------------------------------------------------------------


from azure.cli.core import AzCommandsLoader
import azext_mixed_reality._help  # pylint: disable=unused-import


class MixedRealityCommandsLoader(AzCommandsLoader):

    def __init__(self, cli_ctx=None):
        from azure.cli.core.commands import CliCommandType
        custom_command_type = CliCommandType(operations_tmpl='azext_mixed_reality.custom#{}')
        super(MixedRealityCommandsLoader, self).__init__(cli_ctx=cli_ctx, custom_command_type=custom_command_type)  # pylint: disable=line-too-long

    def load_command_table(self, args):
        from .commands import load_command_table
        load_command_table(self, args)
        try:
            from .generated.commands import load_command_table as load_command_table_generated
            load_command_table_generated(self, args)
            from .manual.commands import load_command_table as load_command_table_manual
            load_command_table_manual(self, args)
        except ImportError as e:
            if e.name.endswith('manual.commands'):
                pass
            else:
                raise e
        return self.command_table

    def load_arguments(self, command):
        from ._params import load_arguments
        load_arguments(self, command)
        try:
            from .generated._params import load_arguments as load_arguments_generated
            load_arguments_generated(self, command)
            from .manual._params import load_arguments as load_arguments_manual
            load_arguments_manual(self, command)
        except ImportError as e:
            if e.name.endswith('manual._params'):
                pass
            else:
                raise e


COMMAND_LOADER_CLS = MixedRealityCommandsLoader
