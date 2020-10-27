import * as assert from 'assert';
import { exec } from 'child_process';
import * as fs from 'fs';
import { slow, suite, test, timeout } from 'mocha-typescript';
import * as path from 'path';
import { ArgumentConstants, CompatibleLevel, GenerateSdk, TargetMode } from '../plugins/models';
import { copyRecursiveSync, deleteFolderRecursive } from "../utils/helper";

require('source-map-support').install();

enum TestMode {
    ExtDefault = "",
    ExtIncremental = "ext_Incremental",
    CoreDefault = "coredefault",
    CoreIncremental = "core_Incremental",
    Ext_NoFlatten = "extnoflatten",
    Ext_NoSdk = "extnosdk",
    Ext_NoSdk_NoFlatten_Track1 = "extnosdknoflattentrack1"
}

@suite class Process {
    private testDimensions: Map<string, Array<TestMode>> = new Map([
        ["attestation", [TestMode.ExtDefault]],
        ["boolean", [TestMode.ExtDefault]],
        ["datafactory", [TestMode.ExtDefault]],
        ["managed-network", [TestMode.ExtDefault]],
        ["mixed-reality", [TestMode.ExtIncremental]],
        ["kusto", [TestMode.CoreDefault, TestMode.Ext_NoFlatten, TestMode.Ext_NoSdk, TestMode.Ext_NoSdk_NoFlatten_Track1]],
        ["synapse", [TestMode.CoreDefault, TestMode.Ext_NoFlatten, TestMode.Ext_NoSdk, TestMode.Ext_NoSdk_NoFlatten_Track1]],
        ["compute", [TestMode.CoreIncremental]]
    ]);

    async runAz(directory: string, extraOption: {}) {
        let cmdOption = [];
        for (let k in extraOption) {
            cmdOption.push("--" + k + "=" + extraOption[k]);
        }
        let cmd = `${__dirname}/../../` + "node_modules/.bin/autorest --version=3.0.6320 --az --use=" + `${__dirname}/../../` + " " + directory + "/configuration/readme.md " + cmdOption.join(" ");
        console.log(cmd);
        return await new Promise<boolean>((resolve, reject) => {
            exec(cmd, function (error) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    // Reject if there is an error:
                    return reject(false);
                }
                // Otherwise resolve the promise:
                return resolve(true);
            });
        });
    }

    async compare(dir1: string, dir2: string) {
        let cmd = "diff -r --exclude=gen.zip --strip-trailing-cr " + dir1 + " " + dir2;
        console.log(cmd);
        return await new Promise<boolean>((resolve, reject) => {
            exec(cmd, function (error, stdout) {
                if (error !== null) {
                    console.log('exec error: ' + error + ", " + stdout);
                    // Reject if there is an error:
                    return reject(false);
                }
                // Otherwise resolve the promise:
                return resolve(true);
            });
        });
    }

    getOptions(testMode: string, outputDir: string) {
        let extraOption: {} = {};
        if (testMode == TestMode.ExtDefault || testMode == TestMode.ExtIncremental) {
            let key = ArgumentConstants.azureCliExtFolder
            extraOption[key] = outputDir;
            return extraOption;
        } else if (testMode == TestMode.CoreDefault || testMode == TestMode.CoreIncremental) {
            let key = ArgumentConstants.targetMode;
            extraOption[key] = TargetMode.Core;
            key = ArgumentConstants.azureCliFolder;
            extraOption[key] = outputDir;
            return extraOption;
        } else if (testMode == TestMode.Ext_NoFlatten) {
            let key = ArgumentConstants.azureCliExtFolder
            extraOption[key] = outputDir;
            key = ArgumentConstants.sdkNoFlatten;
            extraOption[key] = true;
            return extraOption;
        } else if (testMode == TestMode.Ext_NoSdk) {
            let key = ArgumentConstants.azureCliExtFolder
            extraOption[key] = outputDir;
            key = ArgumentConstants.sdkNoFlatten;
            extraOption[key] = true;
            key = ArgumentConstants.generateSDK;
            extraOption[key] = GenerateSdk.No;
            return extraOption;
        } else if (testMode == TestMode.Ext_NoSdk_NoFlatten_Track1) {
            let key = ArgumentConstants.azureCliExtFolder
            extraOption[key] = outputDir;
            key = ArgumentConstants.sdkNoFlatten;
            extraOption[key] = true;
            key = ArgumentConstants.generateSDK;
            extraOption[key] = GenerateSdk.No;
            key = ArgumentConstants.compatibleLevel;
            extraOption[key] = CompatibleLevel.Track1;
            return extraOption;
        }
        return extraOption;
    }

    async runSingleTest(dir: string, each: string, extraOption: {}, testMode: string) {
        let result = true;
        let msg = "";
        await this.runAz(dir + each, extraOption).then(res => {
            if (res == false) {
                msg = "Run autorest not successfully!";
            }
            result = res;
        }).catch(err => {
            msg = "Run autorest failed!";
            result = err;
        });
        if (result) {
            await this.compare(dir + each + "/output/" + testMode, dir + each + "/tmpoutput/" + testMode).then(res1 => {
                if (res1 == false) {
                    msg = "The generated files have changed!";
                }
                result = res1;
            }).catch(e => {
                msg = "The diff has some error";
                result = e;
            });
        }
        return result;
    }

    @test(slow(600000), timeout(1500000)) async acceptanceSuite() {
        const dir = `${__dirname}/../../src/test/scenarios/`;
        const folders = fs.readdirSync(dir);
        let msg = "";
        let finalResult = true;
        for (const rp of folders) {
            let result = true;
            console.log("Start Processing: " + rp);

            // Remove tmpoutput
            deleteFolderRecursive(path.join(dir, rp, "tmpoutput"));
            fs.mkdirSync(path.join(dir, rp, "tmpoutput"));

            try {
                const dimensions: Array<TestMode> = this.testDimensions.get(rp);
                if (dimensions != null) {
                    for (const dimension of dimensions) {
                        let outputDir = "";
                        if (dimension == TestMode.CoreDefault || dimension == TestMode.ExtIncremental || dimension == TestMode.CoreIncremental) {
                            copyRecursiveSync(path.join(dir, rp, "basecli"), path.join(dir, rp, "tmpoutput", dimension));
                        }
                        outputDir = path.join(dir, rp, "tmpoutput", dimension);
                        let extraOption = this.getOptions(dimension, outputDir);
                        result = await this.runSingleTest(dir, rp, extraOption, dimension);
                    }
                }
                else {
                    console.log(rp + " is not configure, pass here");
                }
            }
            catch (error) {
                console.log(msg);
                result = false;
                break;
            }
            if (!result) {
                finalResult = false;
            }
            //assert.strictEqual(result, true, msg);
        }
        assert.strictEqual(finalResult, true, msg);
    }
}