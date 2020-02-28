# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
from azext_managed_network.generated.custom import *
=======
<<<<<<< HEAD
=======
>>>>>>> updated test
from azext_account.generated.custom import *
>>>>>>> updated test
=======
from azext_managed_network.generated.custom import *
>>>>>>> fix some change folder and name issue
try:
    from azext_managed_network.manual.custom import *
except ImportError:
    pass
