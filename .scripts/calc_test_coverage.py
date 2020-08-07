#!/bin/python
import os
import time
import subprocess
import datetime as dt
from urllib import parse

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


# get db info
HostName = os.environ.get("DB_HOST_NAME")
LoginName = os.environ.get("DB_LOGIN_NAME")
Password = parse.quote_plus(os.environ.get("DB_PASSWORD"))  # encode special chars
DBName = os.environ.get("DB_NAME")
# DEV_PREFIX = "D:/dev/"
DEV_PREFIX = os.environ.get("DEV_PREFIX")
AZ_PREFIX = DEV_PREFIX + "autorest.az"
AZ_CLI_EXT_PREFIX = DEV_PREFIX + "azure-cli-extensions"
AWAGGER_PREFIX = DEV_PREFIX + "azure-rest-api-specs"


Base = declarative_base()

# Models
class TblAztestBatch(Base):
    __tablename__ = "tbl_aztest_batch"

    id = Column(Integer, primary_key=True)
    batch_name = Column(String, nullable=True)
    start_dt = Column(DateTime, default=dt.datetime.utcnow)
    end_dt = Column(DateTime, default=dt.datetime.utcnow)

class TblRp(Base):
    __tablename__ = "tbl_rp"

    id = Column(Integer, primary_key=True)
    rp_name = Column(String)

class TblAztestStep(Base):
    __tablename__ = "tbl_aztest_step"

    id = Column(Integer, primary_key=True)
    aztest_batch_id = Column(Integer, ForeignKey(TblAztestBatch.id))
    rp_id = Column(Integer, ForeignKey(TblRp.id))
    testcase_name = Column(String)
    step_name = Column(String)
    result = Column(Integer, default=1)
    error_message = Column(String, default="")
    error_stack = Column(String, default="")
    error_normalized = Column(String, default="")
    start_dt = Column(DateTime, default=dt.datetime.utcnow)
    end_dt = Column(DateTime, default=dt.datetime.utcnow)

# Client
class DBClient:

    def __init__(self):
        # pyodbc
        odbc_connect = parse.quote_plus('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+HostName+';DATABASE='+DBName+';UID='+LoginName+';PWD='+ Password)
        self._engine = create_engine('mssql+pyodbc:///?odbc_connect={}'.format(odbc_connect))
        self._session_maker = sessionmaker(bind=self._engine)

    def __enter__(self):
        self._session = self._session_maker()
        return self._session

    def __exit__(self, *args, **kwargs):
        self._session.close()

def test(client):
    rs = client.execute("select * from tbl_aztest_batch")
    print(rs.fetchone())

def calcCoverage(client, testcase_name, test_path, repo, tbl_batch, debug=False):
    if not os.path.exists(test_path):
        return

    if not debug:
        tbl_rp = client.query(TblRp).filter(TblRp.rp_name==repo).first()
        if not tbl_rp:
            # create rp
            tbl_rp = TblRp(rp_name=repo)
            client.add(tbl_rp)
            tbl_rp = client.query(TblRp).filter(TblRp.rp_name==repo).first()

    steps = None
    coverage = None
    with open(test_path, 'r') as f:
        text = f.readlines()
        steps = text[1:-1]
        coverage = text[-1]

    for step in steps:
        scenario = step.split('|')[1:-1]
        if len(scenario) != 7:
            continue
        step_name, result, error_message, error_stack, error_normalized, start_dt, end_dt = scenario
        start_dt = dt.datetime.strptime(start_dt, "%Y-%m-%d %H:%M:%S.%f")
        end_dt = dt.datetime.strptime(end_dt, "%Y-%m-%d %H:%M:%S.%f")
        result = True if result == "successed" else False

        if debug:
            # debug
            # print(step_name, result)
            print(scenario)
        else:
            # add step
            tbl_az_step = TblAztestStep(
                aztest_batch_id=tbl_batch.id,
                rp_id=tbl_rp.id,
                testcase_name=testcase_name,
                step_name=step_name,
                result=result,
                error_message=error_message,
                error_stack=error_stack,
                error_normalized=error_normalized,
                start_dt=start_dt,
                end_dt=end_dt
            )
            client.add(tbl_az_step)

    # commit
    client.commit()

def runTask(args):
    try:
        if os.name == 'nt':
            output = subprocess.check_output(args, stderr=subprocess.STDOUT, shell=True, universal_newlines=True)
        else: 
            output = subprocess.check_output(args, stderr=subprocess.STDOUT, universal_newlines=True)
    except subprocess.CalledProcessError as exc:
        print("Status : FAIL", exc.returncode)
        raise AssertionError(exc.output)
    else:
        print("Output: \n{}\n".format(output))

# Collection
def repoColletor(debug=False, enable_batch=False, run_codegen=False, is_live=False):
    az_cli_ext_prefix = AZ_CLI_EXT_PREFIX + "/src"
    use_az = "--use=" + AZ_PREFIX
    use_az_cli_folder = "--azure-cli-extension-folder=" + AZ_CLI_EXT_PREFIX

    repos = list()

    # run codegen (the rp names in specification are different from cli_extension )
    if run_codegen:
        for rp in os.listdir(AWAGGER_PREFIX + '/specification/'):
            if rp == 'testserver':
                swagger_arg_str = AZ_PREFIX + '/src/test/scenarios/testserver/configuration/readme.md'
            else:
                swagger_arg_str = AWAGGER_PREFIX + '/specification/'+ rp + '/resource-manager/readme.md'

            cmd_codegen = ['autorest', '--version=3.0.6271', '--az', use_az, use_az_cli_folder, swagger_arg_str]
            print(" ".join(cmd_codegen))
            try:
                runTask(cmd_codegen)
            except:
                continue

    for rp in os.listdir(az_cli_ext_prefix):
        if os.path.isdir(os.path.join(az_cli_ext_prefix, rp)):
            repos.append(rp)

            # run codegen (only available for kusto now.)
            if run_codegen:
                # add extension
                cmd_add_ext = ['azdev', 'extension', 'add', rp]
                print(" ".join(cmd_add_ext))
                try:
                    runTask(" ".join(cmd_add_ext))
                except:
                    continue

                # az test
                cmd_az_test = ['azdev', 'test', rp, "--discover"]
                if is_live:
                    cmd_az_test += ['--live']
                print(" ".join(cmd_az_test))
                try:
                    runTask(cmd_az_test)
                except:
                    continue

    with DBClient() as client:
        print("Uploading data..")
        if enable_batch:
            # unable now
            pass

        if not debug and repos:
            # create batch
            tbl_batch = TblAztestBatch(batch_name="")
            client.add(tbl_batch)
            client.commit()
            tbl_batch = client.query(TblAztestBatch).order_by(TblAztestBatch.start_dt.desc()).first()
        else:
            tbl_batch = None

        for repo in repos:
            c_name = "test_{}_scenario_coverage.md".format(repo)
            c_path = os.path.join(az_cli_ext_prefix, repo, "azext_" + repo, "tests", "latest", c_name)

            calcCoverage(client, c_name, c_path, repo, tbl_batch, debug=debug)
        print("Completed.")

def main():
    # When debug is True, it won't upload test data to database.
    debug = os.environ.get("CALC_COVERAGE_DEBUG", True)
    repoColletor(debug=debug, run_codegen=False)


if __name__ == "__main__":
    main()
