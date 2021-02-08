import * as assert from 'assert';
import { exec } from 'child_process';
import * as fs from 'fs';
import { slow, suite, test, timeout } from 'mocha-typescript';
import * as path from 'path';
import { CodeGenConstants, CompatibleLevel, GenerateSdk, TargetMode } from '../src/utils/models';
import { copyRecursiveSync, deleteFolderRecursive, isNullOrUndefined } from '../src/utils/helper';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

export enum TestMode {
    ExtDefault = '',
    ExtIncremental = 'ext_Incremental',
    CoreDefault = 'coredefault',
    CoreIncremental = 'core_Incremental',
    ExtFlatten = 'extflatten',
    ExtNoSdk = 'extnosdk',
    ExtDefaultFolder = 'ext_default_folder',
    ExtNoSdkNoFlattenTrack1 = 'extnosdknoflattentrack1',
}

@suite
export class Process {
    private testDimensions: Map<string, Array<TestMode>> = new Map([
        ['attestation', [TestMode.ExtDefault]],
        ['boolean', [TestMode.ExtDefault]],
        ['datafactory', [TestMode.ExtDefault]],
        ['managed-network', [TestMode.ExtDefault]],
        ['mixed-reality', [TestMode.ExtIncremental]],
        [
            'kusto',
            [
                TestMode.CoreDefault,
                TestMode.ExtFlatten,
                TestMode.ExtDefaultFolder,
                TestMode.ExtNoSdkNoFlattenTrack1,
            ],
        ],
        [
            'synapse',
            [
                TestMode.CoreDefault,
                TestMode.ExtFlatten,
                TestMode.ExtDefaultFolder,
                TestMode.ExtNoSdkNoFlattenTrack1,
            ],
        ],
        ['compute', [TestMode.CoreIncremental]],
    ]);

    async runAz(directory: string, extraOption: any) {
        const cmdOption = [];
        for (const k in extraOption) {
            cmdOption.push('--' + k + '=' + extraOption[k]);
        }
        let cmd =
            path.join(`${__dirname}`, '/../' + 'node_modules/.bin/autorest') +
            ' --version=3.0.6320 --az --use=' +
            path.join(`${__dirname}`, '/../') +
            ' ' +
            directory +
            '/configuration/readme.md ' +
            cmdOption.join(' ');
        cmd = cmd
            .split(' ')
            .map((item) => {
                if (item.endsWith('\\')) {
                    item = item.substr(0, item.length - 1);
                    return item;
                }
                return item;
            })
            .join(' ');
        console.log(cmd);
        return await new Promise<boolean>((resolve, reject) => {
            exec(cmd, function (error) {
                if (!isNullOrUndefined(error)) {
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
        const cmd = 'diff -r --exclude=gen.zip --strip-trailing-cr ' + dir1 + ' ' + dir2;
        console.log(cmd);
        return await new Promise<boolean>((resolve, reject) => {
            exec(cmd, function (error, stdout) {
                if (!isNullOrUndefined(error)) {
                    console.log('exec error: ' + error + ', ' + stdout);
                    // Reject if there is an error:
                    return reject(false);
                }
                // Otherwise resolve the promise:
                return resolve(true);
            });
        });
    }

    getOptions(testMode: string, outputDir: string) {
        const extraOption: any = {};
        if (
            testMode === TestMode.ExtDefault ||
            testMode === TestMode.ExtIncremental ||
            testMode === TestMode.ExtDefaultFolder
        ) {
            const key = CodeGenConstants.azureCliExtFolder;
            extraOption[key] = outputDir;
            return extraOption;
        } else if (testMode === TestMode.CoreDefault || testMode === TestMode.CoreIncremental) {
            let key = CodeGenConstants.targetMode;
            extraOption[key] = TargetMode.Core;
            key = CodeGenConstants.azureCliFolder;
            extraOption[key] = outputDir;
            return extraOption;
        } else if (testMode === TestMode.ExtFlatten) {
            let key = CodeGenConstants.azureCliExtFolder;
            extraOption[key] = outputDir;
            key = CodeGenConstants.sdkFlatten;
            extraOption[key] = true;
            return extraOption;
        } else if (testMode === TestMode.ExtNoSdk) {
            let key = CodeGenConstants.azureCliExtFolder;
            extraOption[key] = outputDir;
            key = CodeGenConstants.sdkNoFlatten;
            extraOption[key] = true;
            key = CodeGenConstants.generateSDK;
            extraOption[key] = GenerateSdk.No;
            return extraOption;
        } else if (testMode === TestMode.ExtNoSdkNoFlattenTrack1) {
            let key = CodeGenConstants.azureCliExtFolder;
            extraOption[key] = outputDir;
            key = CodeGenConstants.sdkNoFlatten;
            extraOption[key] = true;
            key = CodeGenConstants.generateSDK;
            extraOption[key] = GenerateSdk.No;
            key = CodeGenConstants.compatibleLevel;
            extraOption[key] = CompatibleLevel.Track1;
            return extraOption;
        }
        return extraOption;
    }

    async runSingleTest(dir: string, each: string, extraOption: any, testMode: string) {
        let result = true;
        let msg = '';
        await this.runAz(dir + each, extraOption)
            .then((res) => {
                if (res === false) {
                    msg = 'Run autorest not successfully!';
                }
                result = res;
            })
            .catch((err) => {
                msg = 'Run autorest failed!';
                result = err;
            });
        if (result) {
            await this.compare(
                dir + each + '/output/' + testMode,
                dir + each + '/tmpoutput/' + testMode,
            )
                .then((res1) => {
                    if (res1 === false) {
                        msg = 'The generated files have changed!';
                    }
                    result = res1;
                })
                .catch((e) => {
                    msg = 'The diff has some error';
                    result = e;
                });
        }
        return result;
    }

    @test(slow(600000), timeout(1500000)) async acceptanceSuite() {
        const dir = path.join(`${__dirname}`, '/../test/scenarios/');
        const folders = fs.readdirSync(dir);
        const msg = '';
        let finalResult = true;
        const parallelTest = process.env.parallelTest?.toLowerCase() === 'true';
        const allTests: Promise<boolean>[] = [];
        for (const rp of folders) {
            let result = true;
            console.log('Start Processing: ' + rp);

            // Remove tmpoutput
            deleteFolderRecursive(path.join(dir, rp, 'tmpoutput'));
            fs.mkdirSync(path.join(dir, rp, 'tmpoutput'));

            try {
                const dimensions: Array<TestMode> = this.testDimensions.get(rp);
                if (dimensions != null) {
                    for (const dimension of dimensions) {
                        let outputDir = '';
                        if (
                            dimension === TestMode.CoreDefault ||
                            dimension === TestMode.ExtIncremental ||
                            dimension === TestMode.CoreIncremental
                        ) {
                            copyRecursiveSync(
                                path.join(dir, rp, 'basecli'),
                                path.join(dir, rp, 'tmpoutput', dimension),
                            );
                        }
                        outputDir = path.join(dir, rp, 'tmpoutput', dimension);
                        const extraOption = this.getOptions(dimension, outputDir);
                        const test = this.runSingleTest(dir, rp, extraOption, dimension);
                        if (!parallelTest) {
                            result = await test;
                        } else {
                            allTests.push(test);
                        }
                    }
                } else {
                    console.log(rp + ' is not configure, pass here');
                }
            } catch (error) {
                console.log(msg);
                result = false;
                break;
            }
            if (!result) {
                finalResult = false;
            }
            // assert.strictEqual(result, true, msg);
        }
        if (parallelTest) {
            finalResult = (await Promise.all(allTests)).every((x) => x);
        }
        assert.strictEqual(finalResult, true, msg);
    }
}
