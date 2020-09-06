import * as assert from 'assert';
import { exec } from 'child_process';
import * as fs from 'fs';
import { slow, suite, test, timeout } from 'mocha-typescript';
import * as path from 'path';
import { copyRecursiveSync, deleteFolderRecursive } from "../utils/helper";
import { Dictionary } from '@azure-tools/linq';
import { ArgumentConstants, TargetMode, CompatibleLevel } from '../plugins/models';

require('source-map-support').install();

@suite class Process {
    private incrementalTestRPs: string[] = ["mixed-reality"];
    private mainTestRPs: string[] = ["kusto", "synapse"];
    private noNeedTestRPs: string[] = ["testserver"];

    async runAz(directory: string, extraOption: any[]) {
        let cmdOption = [];
        for(let k of extraOption) {
            cmdOption.push("--" + k + "=" + extraOption[k]);
        }
        let cmd = `${__dirname}/../../` + "node_modules/.bin/autorest --version=3.0.6271 --az --use=" + `${__dirname}/../../` + " " + directory + "/configuration/readme.md " + cmdOption.join(" ");
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
        let cmd = "diff -r --strip-trailing-cr " + dir1 + " " + dir2;
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

    getExtDefaultOptions(outputDir) {
        let extraOption: any[] = [{}];
        let key = ArgumentConstants.azureCliExtFolder
        extraOption.push({key: outputDir});
        return extraOption;
    }

    getCoreDefaultOptions(outputDir) {
        let extraOption: any[] = [{}];
        let key = ArgumentConstants.targetMode;
        extraOption.push({key: TargetMode.Core});
        key = ArgumentConstants.azureCliFolder;
        extraOption.push({key: outputDir});
        return extraOption;
    }

    getExtNoFlattenOptions(outputDir: string) {
        let extraOption: any[] = [{}];
        let key = ArgumentConstants.azureCliExtFolder
        extraOption.push({key: outputDir});
        key = ArgumentConstants.sdkNoFlatten;
        extraOption.push({key: true});
        return extraOption;
    }

    getExtNoFlattenTrack1Options(outputDir: string) {
        let extraOption: any[] = [{}];
        let key = ArgumentConstants.azureCliExtFolder
        extraOption.push({key: outputDir});
        key = ArgumentConstants.sdkNoFlatten;
        extraOption.push({key: true});
        key = ArgumentConstants.compatibleLevel;
        extraOption.push({key: CompatibleLevel.Track1});
        return extraOption;   
    }

    @test(slow(600000), timeout(1500000)) async acceptanceSuite() {
        const dir = `${__dirname}/../../src/test/scenarios/`;
        const folders = fs.readdirSync(dir);
        let result = true;
        let msg = "";
        let finalResult = true;
        for (const each of folders) {
            if (this.noNeedTestRPs.indexOf(each) == -1) { // Not run test server now
                console.log(`Processing: ${each}`);

                // Remove tmpoutput
                deleteFolderRecursive(path.join(dir, each, "tmpoutput"));
                fs.mkdirSync(path.join(dir, each, "tmpoutput"));

                if (this.incrementalTestRPs.indexOf(each) > -1) { // Handle for incremental
                    copyRecursiveSync(path.join(dir, each, "basecli", "src"), path.join(dir, each, "tmpoutput", "src"));
                }
                try {
                    let extraOption: any[] = [];
                    let outputDir = "";
                    if (this.mainTestRPs.indexOf(each) > -1) {

                    } else {
                        outputDir = dir + each + "/tmpoutput/sdknoflatten";
                    }
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
                        await this.compare(dir + each + "/output/src/" + each, dir + each + "/tmpoutput/src/" + each).then(res1 => {
                            if (res1 == false) {
                                msg = "The generated files have changed!";
                            }
                            result = res1;
                        }).catch(e => {
                            msg = "The diff has some error";
                            result = e;
                        });
                    }
                } catch (error) {
                    console.log(msg);
                    result = false;
                    break;
                }
                if (!result) {
                    finalResult = false;
                }
                assert.strictEqual(result, true, msg);
            }
        }
        assert.strictEqual(finalResult, true, msg);
    }
}