# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

from azext_managed_network.generated.custom import *
try:
    from azext_managed_network.manual.custom import *
except ImportError:
    pass
