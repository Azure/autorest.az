import { suite, test, slow, timeout } from 'mocha-typescript';
import * as assert from 'assert';
import { readFile, writeFile, readdir, mkdir } from "@azure-tools/async-io";
import { exec } from 'child_process';
import { compare, compareSync, Options, Result } from "dir-compare";




require('source-map-support').install();

@suite class Process {
    async runAz(directory: string) {
        let cmd = `${__dirname}/../../` + "node_modules/.bin/autorest-beta --az --use=" + `${__dirname}/../../` + " " + directory + "/configuration/readme.md --output-folder=" + directory + "/tmpoutput ";
        console.log(cmd);
        return await new Promise((resolve, reject) => { 
            exec(cmd, function(error) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    // Reject if there is an error:
                    return reject(error);
                }
                // Otherwise resolve the promise:
                resolve();
            });
        });
    }


    @test(slow(600000), timeout(1500000)) async acceptanceSuite() {
        const dir = `${__dirname}/../../src/test/scenarios/`;
        const folders = await readdir(dir);
        for (const each of folders) {
            console.log(`Processing: ${each}`);
            await this.runAz(dir + each).then(res => {
                console.log(res);
                const options: Options = { compareContent: true };
                compare(dir + each + "/output", dir + each + "/tmpoutput", options).then(res => {
                    if(res.same !== true) {
                        return false;
                    }
                }).catch(error => {
                    console.error(error);
                    return false;
                });
            }).catch(error => {
                console.error(error);
                return false;
            }); 
        }
    }
}