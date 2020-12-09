# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------


from .. import try_manual


# EXAMPLE: /VirtualMachines/post/Assess patch state of a virtual machine.
@try_manual
def step_virtual_machine_assess_patch(test, rg, checks=None):
    if checks is None:
        checks = []
    test.cmd('az vm virtual-machine assess-patch '
             '--resource-group "{rg}" '
             '--vm-name "myVMName"',
             checks=checks)


@try_manual
def step_virtual_machine_assess_patch_min(test, rg, checks=None):
    return step_virtual_machine_assess_patch(test, rg, checks)

