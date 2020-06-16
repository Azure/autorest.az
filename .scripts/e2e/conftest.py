import pathlib

def pytest_addoption(parser):
    parser.addoption("--rp", action="store", default="defaultRP")
    parser.addoption("--az", action="store", default="defaultAZ")
    parser.addoption("--swagger", action="store", default="defaultSwagger")
    parser.addoption("--cliext", action="store", default="defaultCliextf")
    parser.addoption("--all", action="store_true", help="run all combinations")

def pytest_generate_tests(metafunc):
    rp_name = metafunc.config.option.rp;
    az_path = metafunc.config.option.az;
    swagger_path = metafunc.config.option.swagger;
    cliext_path = metafunc.config.option.cliext;
    if 'rp' in metafunc.fixturenames:
        if metafunc.config.getoption("all"):
            path = pathlib.Path(__file__).parent.absolute().joinpath("rp_list");
            rp_file = open(str(path), "r");
            rp_list = rp_file.read().splitlines();
            print("Test PRs: %s" % rp_list);
            metafunc.parametrize("rp", rp_list)
        elif rp_name is not None:
            print("Test single RP: " + rp_name);
            metafunc.parametrize("rp", [rp_name])
        else:
            raise Exception("Sorry, no correct input")
    if 'az' in metafunc.fixturenames:
        if az_path is not None:
            print("Az: " + az_path);
            metafunc.parametrize("az", [az_path])
    if 'swagger' in metafunc.fixturenames:
        if swagger_path is not None:
            print("Swagger: " + swagger_path);
            metafunc.parametrize("swagger", [swagger_path])
    if 'cliext' in metafunc.fixturenames:
        if cliext_path is not None:
            print("Cliext: " + cliext_path);
            metafunc.parametrize("cliext", [cliext_path])