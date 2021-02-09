#!/usr/bin/env python

# -------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
# --------------------------------------------------------------------------
import os
import sys
if not sys.version_info >= (3, 6, 0):
    raise Exception(
        "Autorest for Python extension requires Python 3.6 at least")

try:
    import pip
except ImportError:
    raise Exception("Your Python installation doesn't have pip available")

try:
    import venv
except ImportError:
    raise Exception("Your Python installation doesn't have venv available")


# Now we have pip and Py >= 3.6, go to work

import subprocess
from pathlib import Path

from venvtools import ExtendedEnvBuilder, python_run

_ROOT_DIR = Path(__file__).parent.parent.parent.parent


def main():
    venv_path = _ROOT_DIR / "venv"
    venv_prexists = venv_path.exists()

    if venv_prexists:
        env_builder = venv.EnvBuilder(with_pip=True)
        venv_context = env_builder.ensure_directories(venv_path)
    else:
        env_builder = ExtendedEnvBuilder(with_pip=True)
        env_builder.create(venv_path)
        venv_context = env_builder.context
    python_run(venv_context, "pip", ["install", "-U", "pip"])
    python_run(venv_context, "pip", ["install", "-r", "src/python/requirements.txt"])


def lint(filename):
    venv_path = _ROOT_DIR / "venv"
    venv_prexists = venv_path.exists()
    if not venv_prexists:
        main()
    env_builder = venv.EnvBuilder(with_pip=True)
    venv_context = env_builder.ensure_directories(venv_path)
    python_run(venv_context, "pip", ["install", "-U", "pip"])
    python_run(venv_context, "pip", ["install", "-r", "src/python/requirements.txt"])
    # black --line-length=120 --experimental-string-processing --skip-string-normalization
    # autopep8 --global-config '.pyproject.toml' --in-place --max-line-length=120 --ignore="E203,E501,W6"
    # autoflake --in-place --expand-star-imports --remove-all-unused-imports --remove-duplicate-keys --remove-unused-variables
    python_run(venv_context, "black", [
               "--line-length=120", "--experimental-string-processing", "--skip-string-normalization", filename])
    python_run(venv_context, "autopep8", [
               "--in-place", '--exclude=".git,__pycache__"', "--max-line-length=120", '--ignore="E203,E501,W6"', filename])
    python_run(venv_context, "autoflake", ["--in-place", "--expand-star-imports",
                                           "--remove-all-unused-imports", "--remove-duplicate-keys", "--remove-unused-variables", filename])


if __name__ == "__main__":
    if len(sys.argv) < 2:
        main()
    elif os.path.exists(sys.argv[1]):
        lint(sys.argv[1])
