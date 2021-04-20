import * as assert from 'assert';
import { exec } from 'child_process';
import * as fs from 'fs';
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
    CoreTrack2 = 'coretrack2',
}

describe('ScenarioTest', () => {
    const testDimensions: Map<string, Array<TestMode>> = new Map([
        // ['attestation', [TestMode.ExtDefault]],
        // ['boolean', [TestMode.ExtDefault]],
        // ['datafactory', [TestMode.ExtDefault]],
        // ['managed-network', [TestMode.ExtDefault]],
        // ['msgraphuser', [TestMode.ExtDefault]],
        // ['mixed-reality', [TestMode.ExtIncremental]],
        [
            'kusto',
            [
                TestMode.CoreDefault,
                TestMode.CoreTrack2,
                TestMode.ExtDefaultFolder,
                TestMode.ExtNoSdkNoFlattenTrack1,
            ],
        ],
        // [
        //     'synapse',
        //     [
        //         TestMode.CoreDefault,
        //         TestMode.ExtFlatten,
        //         TestMode.ExtDefaultFolder,
        //         TestMode.ExtNoSdkNoFlattenTrack1,
        //     ],
        // ],
        // ['compute', [TestMode.CoreIncremental]],
    ]);

    async function runAz(directory: string, extraOption: any) {
        const cmdOption = [];
        for (const k in extraOption) {
            cmdOption.push('--' + k + '=' + extraOption[k]);
        }
        let cmd =
            path.join(`${__dirname}`, '/../' + 'node_modules/.bin/autorest') +
            ' --version=3.0.6336 --az --use=' +
            path.join(`${__dirname}`, '/../') +
            ' ' +
            path.join(directory, 'configuration/readme.md') +
            ' ' +
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

    async function compare(dir1: string, dir2: string) {
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

    function getOptions(testMode: string, outputDir: string) {
        const extraOption: any = {};
        const key1 = CodeGenConstants.scenarioTestOnly;
        extraOption[key1] = true;
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
        } else if (testMode === TestMode.CoreTrack2) {
            let key = CodeGenConstants.targetMode;
            extraOption[key] = TargetMode.Core;
            key = CodeGenConstants.azureCliFolder;
            extraOption[key] = outputDir;
            key = CodeGenConstants.compatibleLevel;
            extraOption[key] = CompatibleLevel.Track2;
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

    async function runSingleTest(dir: string, each: string, extraOption: any, testMode: string) {
        let result = true;
        let msg = '';
        await runAz(dir + each, extraOption)
            .then((res) => {
                if (res === false) {
                    msg = 'Run autorest not successfully!';
                }
                result = res;
            })
            .catch((err) => {
                msg = 'Run autorest failed!';
                result = false;
            });
        if (result) {
            await compare(
                path.join(dir, each, 'output', testMode),
                path.join(dir, each, 'tmpoutput', testMode),
            )
                .then((res1) => {
                    if (res1 === false) {
                        msg = 'The generated files have changed!';
                    }
                    result = res1;
                })
                .catch((e) => {
                    msg = 'The diff has some error';
                    result = false;
                });
        }
        return result;
    }

    it('acceptanceSuite', async () => {
        jest.setTimeout(1500000);
        const dir = path.join(`${__dirname}`, '/../test/scenarios/');
        const folders = fs.readdirSync(dir);
        const msg = '';
        let finalResult = true;
        const allTests: boolean[] = [];
        for (const rp of folders) {
            let result = true;
            console.log('Start Processing: ' + rp);

            // Remove tmpoutput
            deleteFolderRecursive(path.join(dir, rp, 'tmpoutput'));
            fs.mkdirSync(path.join(dir, rp, 'tmpoutput'));

            try {
                const dimensions: Array<TestMode> = testDimensions.get(rp);
                if (dimensions != null) {
                    for (const dimension of dimensions) {
                        let outputDir = '';
                        if (
                            dimension === TestMode.CoreDefault ||
                            dimension === TestMode.ExtIncremental ||
                            dimension === TestMode.CoreIncremental ||
                            dimension === TestMode.CoreTrack2
                        ) {
                            copyRecursiveSync(
                                path.join(dir, rp, 'basecli'),
                                path.join(dir, rp, 'tmpoutput', dimension),
                            );
                        }
                        outputDir = path.join(dir, rp, 'tmpoutput', dimension);
                        const extraOption = getOptions(dimension, outputDir);
                        const test = await runSingleTest(dir, rp, extraOption, dimension);
                        allTests.push(test);
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
        finalResult = (await Promise.all(allTests)).every((x) => x);
        assert.strictEqual(finalResult, true, msg);
    });
});
