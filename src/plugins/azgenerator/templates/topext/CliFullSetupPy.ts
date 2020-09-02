/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "../../CodeModelAz"

export function GenerateAzureCliSetupPy(model: CodeModelAz) : string[] {
    var output: string[] = [];

    output.push("#!/usr/bin/env python");
    output.push("");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("# Copyright (c) Microsoft Corporation. All rights reserved.");
    output.push("# Licensed under the MIT License. See License.txt in the project root for license information.");
    output.push("# --------------------------------------------------------------------------------------------");
    output.push("");
    output.push("");
    output.push("from codecs import open");
    output.push("from setuptools import setup, find_packages");
    output.push("");
    output.push("# HISTORY.rst entry.");
    output.push("VERSION = '0.1.0'");
    output.push("try:");
    output.push("    from azext_" + model.Extension_NameUnderscored + ".manual.version import VERSION");
    output.push("except ImportError:");
    output.push("    pass");
    output.push("")
    output.push("# The full list of classifiers is available at");
    output.push("# https://pypi.python.org/pypi?%3Aaction=list_classifiers");
    output.push("CLASSIFIERS = [");
    output.push("    'Development Status :: 4 - Beta',");
    output.push("    'Intended Audience :: Developers',");
    output.push("    'Intended Audience :: System Administrators',");
    output.push("    'Programming Language :: Python',");
    output.push("    'Programming Language :: Python :: 3',");
    output.push("    'Programming Language :: Python :: 3.6',");
    output.push("    'Programming Language :: Python :: 3.7',");
    output.push("    'Programming Language :: Python :: 3.8',");
    output.push("    'License :: OSI Approved :: MIT License',");
    output.push("]");
    output.push("");
    output.push("DEPENDENCIES = []");
    output.push("try:");
    output.push("    from .manual.dependency import DEPENDENCIES");
    output.push("except ImportError:");
    output.push("    pass");
    output.push("");
    output.push("with open('README.md', 'r', encoding='utf-8') as f:");
    output.push("    README = f.read()");
    output.push("with open('HISTORY.rst', 'r', encoding='utf-8') as f:");
    output.push("    HISTORY = f.read()");
    output.push("");
    output.push("setup(");
    output.push("    name='" + model.Extension_NameUnderscored + "',");
    output.push("    version=VERSION,");
    output.push("    description='Microsoft Azure Command-Line Tools " + model.Extension_NameClass + " Extension',");
    output.push("    author='Microsoft Corporation',");
    output.push("    author_email='azpycli@microsoft.com',");
    output.push("    url='https://github.com/Azure/azure-cli-extensions/tree/master/src/" + model.Extension_Name + "',");
    output.push("    long_description=README + '\\n\\n' + HISTORY,");
    output.push("    license='MIT',");
    output.push("    classifiers=CLASSIFIERS,");
    output.push("    packages=find_packages(),");
    output.push("    install_requires=DEPENDENCIES,");
    output.push("    package_data={'azext_" + model.Extension_NameUnderscored + "': ['azext_metadata.json']},");
    output.push(")");
    output.push("");

    return output;
}
