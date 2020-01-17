/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeModelAz } from "./CodeModelAz"

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
    output.push("try:");
    output.push("    from azure_bdist_wheel import cmdclass");
    output.push("except ImportError:");
    output.push("    from distutils import log as logger");
    output.push("    logger.warn(\"Wheel is not available, disabling bdist_wheel hook\")");
    output.push("");
    output.push("# TODO: Confirm this is the right version number you want and it matches your");
    output.push("# HISTORY.rst entry.");
    output.push("VERSION = '0.1.0'");
    output.push("")
    output.push("# The full list of classifiers is available at");
    output.push("# https://pypi.python.org/pypi?%3Aaction=list_classifiers");
    output.push("CLASSIFIERS = [");
    output.push("    'Development Status :: 4 - Beta',");
    output.push("    'Intended Audience :: Developers',");
    output.push("    'Intended Audience :: System Administrators',");
    output.push("    'Programming Language :: Python',");
    output.push("    'Programming Language :: Python :: 2',");
    output.push("    'Programming Language :: Python :: 2.7',");
    output.push("    'Programming Language :: Python :: 3',");
    output.push("    'Programming Language :: Python :: 3.4',");
    output.push("    'Programming Language :: Python :: 3.5',");
    output.push("    'Programming Language :: Python :: 3.6',");
    output.push("    'License :: OSI Approved :: MIT License',");
    output.push("]");
    output.push("");
    output.push("# TODO: Add any additional SDK dependencies here");
    output.push("DEPENDENCIES = []");
    output.push("");
    output.push("with open('README.rst', 'r', encoding='utf-8') as f:");
    output.push("    README = f.read()");
    output.push("with open('HISTORY.rst', 'r', encoding='utf-8') as f:");
    output.push("    HISTORY = f.read()");
    output.push("");
    output.push("setup(");
    output.push("    name='" + model.Extension_NameUnderscored + "',");
    output.push("    version=VERSION,");
    output.push("    description='Microsoft Azure Command-Line Tools " + model.Extension_NameClass + " Extension',");
    output.push("    # TODO: Update author and email, if applicable");
    output.push("    author='Microsoft Corporation',");
    output.push("    author_email='azpycli@microsoft.com',");
    output.push("    # TODO: consider pointing directly to your source code instead of the generic repo");
    output.push("    url='https://github.com/Azure/azure-cli-extensions',");
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
