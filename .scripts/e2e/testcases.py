import subprocess
import os

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    BOLD = '\033[1m'
    BLACK = '\033[30m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'
    WHITE = '\033[37m'
    UNDERLINE = '\033[4m'
    ENDC = '\033[0m'

def test_rp_e2e(rp, az, swagger, cliext, azpack):
    print("");
    logStep ("Start test rp: %s" % rp);
    cliext_arg_str = '--azure-cli-extension-folder=' + cliext;
    
    if azpack:
        az_arg_str = '--use=' + azpack;
    else:
        az_arg_str = '--use=' + az;

    if (rp == 'testserver'):
        swagger_arg_str = az + '/src/test/scenarios/testserver/configuration/readme.md';
    else:
        swagger_arg_str = swagger + '/specification/'+ rp + '/resource-manager/readme.md';

    logInfo ("Az: " + az_arg_str);
    logInfo ("Swagger: " + swagger_arg_str);
    logInfo ("Cliext: " + cliext_arg_str);

    logStep ("Start code generation: %s" % rp);
    runTask(['autorest', '--version=3.0.6271', '--az', az_arg_str, cliext_arg_str, swagger_arg_str, '--clear-output-folder', '--sdk-flatten']);

    logStep ("Azdev extension add %s" % rp);
    runTask(['azdev', 'extension', 'add', rp]);

    logStep ("Azdev extension list");
    runTask(['azdev', 'extension', 'list', '--query', '[?install==\'Installed\'].{Name:name,Path:path}', '-o', 'table']);

    logStep ("Azdev linter: %s" % rp);
    runTask(['azdev', 'linter', rp]);

    logStep ("Azdev test: %s" % rp);
    runTask(['azdev', 'test', rp, '--discover', '--live']);

def runTask(args):
    try:
        if os.name == 'nt':
            output = subprocess.check_output(args, stderr=subprocess.STDOUT, shell=True, universal_newlines=True)
        else: 
            output = subprocess.check_output(args, stderr=subprocess.STDOUT, universal_newlines=True)
    except subprocess.CalledProcessError as exc:
        #print("Status : FAIL", exc.returncode, exc.output)
        print("Status : FAIL", exc.returncode);
        raise AssertionError(exc.output)
    else:
        print("Output: \n{}\n".format(output))

def logInfo(msg):
    if os.name == 'nt':
        print("[LOG INFORMATIOM]: %s" %msg);
    else:
        print(f"{bcolors.GREEN}[LOG INFORMATIOM]: %s {bcolors.ENDC}" % msg);

def logStep(msg):
    if os.name == 'nt':
        print("[LOG STEP]: %s" %msg);
    else:
        print(f"{bcolors.BLUE}[LOG STEP]: %s {bcolors.ENDC}" % msg);