# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
from azext_managed_network.generated.commands import *
=======
<<<<<<< HEAD
=======
>>>>>>> updated test
from azext_account.generated.commands import *
>>>>>>> updated test
=======
from azext_managed_network.generated.commands import *
>>>>>>> fix some change folder and name issue
try:
    from azext_managed_network.manual.commands import *
except ImportError:
    pass
