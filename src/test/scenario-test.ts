import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from "@azure-tools/async-io";
import { exec } from 'child_process';




require('source-map-support').install();

@suite class Process {
    async runAz(directory: string, each: string) {
        let cmd = `${__dirname}/../../` + "node_modules/.bin/autorest --version=3.0.6271 --az --use=" + `${__dirname}/../../` + " " + directory + "/configuration/readme.md --azure-cli-extension-folder=" + directory + "/tmpoutput/";
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


    @test(slow(600000), timeout(1500000)) async acceptanceSuite() {
        const dir = `${__dirname}/../../src/test/scenarios/`;
        const folders = await readdir(dir);
        let result = true;
        let msg = "";
        let finalResult = true;
        for (const each of folders) {
            if (true) {
                console.log(`Processing: ${each}`);
                try {
                    await this.runAz(dir + each, each).then(res => {
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