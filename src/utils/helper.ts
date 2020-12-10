/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
import { CodeModel } from '@azure-tools/codemodel';
import { values } from '@azure-tools/linq';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise-native';
import { ExtensionMode } from './models';
import * as child_process from 'child_process';

export function changeCamelToDash(str: string): string {
    str = str.replace(/[A-Z][^A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    str = str.replace(/[^A-Z][A-Z]/g, (letter) => `${letter[0]}-${letter[1].toLowerCase()}`);
    str = str.toLowerCase();
    if (str.startsWith('-')) {
        str = str.substring(1, str.length);
    }
    return str;
}

export function ToSnakeCase(v: string): string {
    return v
        .replace(/([a-z](?=[A-Z]))/g, '$1 ')
        .split(' ')
        .join('_')
        .toLowerCase();
}

export function Capitalize(v: string): string {
    return v.charAt(0).toUpperCase() + v.slice(1);
}

export function Uncapitalize(v: string): string {
    return v.charAt(0).toLowerCase() + v.slice(1);
}

export function ToSentence(v: string): string {
    v = v.replace(/[a-z0-9][A-Z]/g, (letter) => `${letter[0]} ${letter[1]}`);
    return Capitalize(v);
}

export function ToCamelCase(v: string): string {
    v = v
        .toLowerCase()
        .replace(/[^A-Za-z0-9]/g, ' ')
        .split(' ')
        .reduce((result, word) => result + Capitalize(word.toLowerCase()));
    return v.charAt(0).toLowerCase() + v.slice(1);
}

export function EscapeString(original: string): string {
    if (original === undefined) return 'undefined';
    original = original.split('\n').join(' ');
    original = original.split("'").join("\\'");
    return original;
}

export function ReadFile(filename: string): string {
    return fs.readFileSync(filename, 'utf8');
}

export function deepCopy(obj: any): any {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function MergeSort(arr: any[], comparer: (left, right) => number): any[] {
    if (arr.length < 2) {
        return arr;
    }

    const middle: number = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle, arr.length);
    return Merge(MergeSort(left, comparer), MergeSort(right, comparer), comparer);
}

function Merge(left: any[], right: any[], comparer: (left, right) => number): any[] {
    const result = [];
    while (left.length && right.length) {
        if (comparer(left[0], right[0]) <= 0) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    while (left.length) {
        result.push(left.shift());
    }
    while (right.length) {
        result.push(right.shift());
    }
    return result;
}

export function isDict(v: unknown): boolean {
    return (
        typeof v === 'object' &&
        !isNullOrUndefined(v) &&
        !(v instanceof Array) &&
        !(v instanceof Date)
    );
}

export function ToJsonString(_in: unknown): string {
    return JSON.stringify(_in)
        .split(/[\r\n]+/)
        .join('')
        .split('\\')
        .join('\\\\')
        .split("'")
        .join("\\'");
}

export function ToPythonString(value: any, type: string): string {
    let str = value;

    if (!isNullOrUndefined(str)) {
        if (type === 'boolean') {
            if (value) {
                str = 'True';
            } else {
                str = 'False';
            }
        } else {
            str = JSON.stringify(str);
        }
    }

    return str;
}

function isEscaped(str: string, index: number): boolean {
    let slashNum = 0;
    index--;
    while (index >= 0 && str[index] === '\\') {
        slashNum += 1;
        index--;
    }
    return slashNum % 2 === 1;
}

export function ToMultiLine(
    sentence: string,
    output: string[] = undefined,
    maxLength = 119,
    strMode = false,
    useContinuation: boolean = true,
): string[] {
    let lastComma = -1;
    let inStr = false;
    let strTag = '';
    const ret = [''];
    let indent = 0;
    let spaceNum = 0;
    let strStart = -1;
    const inStrTags = Array(maxLength).fill(strMode);
    const isStrTags = Array(maxLength).fill(false);
    const indents = [];
    while (spaceNum < sentence.length && sentence[spaceNum] === ' ') spaceNum++;

    if (strMode) {
        inStr = true;
        strTag = 'impossible';
    }
    if (maxLength < 3) maxLength = 3;
    for (let i = 0; i < sentence.length; i++) {
        if (
            sentence[i] === ' ' &&
            !inStr &&
            ret.length > 1 &&
            ret[ret.length - 1].length === (indent > 0 ? indent : spaceNum)
        )
            continue;
        ret[ret.length - 1] += sentence[i];
        isStrTags[ret[ret.length - 1].length - 1] = false;
        if (inStr) {
            if (sentence[i] === strTag && !isEscaped(sentence, i)) {
                inStr = false;
                isStrTags[ret[ret.length - 1].length - 1] = true;
            }
            inStrTags[ret[ret.length - 1].length - 1] = true;
        } else {
            if (sentence[i] === ',') lastComma = ret[ret.length - 1].length - 1;
            if (sentence[i] === "'" && !isEscaped(sentence, i)) {
                inStr = true;
                strTag = "'";
                strStart = i;
                isStrTags[ret[ret.length - 1].length - 1] = true;
            } else if (sentence[i] === '"' && !isEscaped(sentence, i)) {
                inStr = true;
                strTag = '"';
                strStart = i;
                isStrTags[ret[ret.length - 1].length - 1] = true;
            }

            if (sentence[i] === '(' || sentence[i] === '[') {
                indents.push(indent);
                indent = ret[ret.length - 1].length;
            }
            if (sentence[i] === ')' || sentence[i] === ']') {
                indent = indents.pop();
            }
            inStrTags[ret[ret.length - 1].length - 1] = inStr;
        }

        if (ret[ret.length - 1].length >= maxLength) {
            if (inStr) {
                let lastNormal = ret[ret.length - 1].length - 1;
                const originLastNormal = lastNormal;
                while (lastNormal >= 0 && isEscaped(ret[ret.length - 1], lastNormal + 1))
                    lastNormal--;
                const UnEscapedLastNormal = lastNormal;
                for (let n = 0; n < Math.min(30, maxLength - 1); n++) {
                    if (i - n === strStart) break;
                    if (ret[ret.length - 1][lastNormal] !== ' ') {
                        lastNormal--;
                    } else {
                        break;
                    }
                }
                if (
                    ret[ret.length - 1][lastNormal] !== ' ' &&
                    i - (originLastNormal - lastNormal) !== strStart
                ) {
                    lastNormal = UnEscapedLastNormal;
                }

                if (strMode) {
                    if (lastNormal != ret[ret.length - 1].length - 1) {
                        let newLine = ret[ret.length - 1].substr(lastNormal + 1);
                        ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastNormal + 1);
                        if (useContinuation)    ret[ret.length - 1] += "\\";
                        ret.push(newLine);
                        lastComma = -1;
                    } else {
                        if (i < sentence.length - 1) {
                            if (indents.length==0 && useContinuation) ret[ret.length - 1] += "\\";
                            ret.push('');
                            lastComma = -1;
                        }
                    }
                } else {
                    const CommaPos = lastComma;
                    if (lastNormal !== ret[ret.length - 1].length - 1) {
                        const newLine =
                            ' '.repeat(indent > 0 ? indent : spaceNum) +
                            strTag +
                            ret[ret.length - 1].substr(lastNormal + 1);
                        ret[ret.length - 1] =
                            ret[ret.length - 1].substr(0, lastNormal + 1) + strTag;
                        ret.push(newLine);
                        lastComma = -1;
                    } else {
                        ret[ret.length - 1] += strTag;
                        ret.push(' '.repeat(indent > 0 ? indent : spaceNum) + strTag);
                        lastComma = -1;
                    }

                    // handle special case: space, "" or = in tail
                    if (ret[ret.length-2].length>=2) {
                        let lenLast = ret[ret.length - 2].length;
                        if (isStrTags[lenLast-2]) {
                            if (ret[ret.length-2].slice(0, -2).match(/^ *$/i))
                                ret.splice(ret.length-2, 1);
                            else
                            {
                                ret[ret.length-2] = ret[ret.length-2].slice(0, -2); // remove "" at the tail
                                if (ret[ret.length-2].slice(-1)[0]!="=") {
                                    while (ret[ret.length-2].slice(-1)[0] == " ") {     // remove all spaces before ""
                                        ret[ret.length-2] = ret[ret.length-2].slice(0, -1); 
                                    }
                                } else {
                                    // there is = in the end of line --> create new line from the last comma
                                    const tmp = ret[ret.length - 2].slice(CommaPos + 1).trimLeft();
                                    ret[ret.length - 2] = ret[ret.length - 2].slice(
                                        0,
                                        CommaPos + 1,
                                    );
                                    const startSpaceNum = ret[ret.length - 1].search(/\S|$/);
                                    if (startSpaceNum >= 0) {
                                        ret[ret.length - 1] =
                                            ' '.repeat(startSpaceNum) +
                                            tmp +
                                            ret[ret.length - 1].substr(startSpaceNum);
                                    } else {
                                        ret[ret.length - 1] = tmp + ret[ret.length - 1];
                                    }
                                }
                            }
                        }
                    }

                    // add '\' in end of breaking point if there is no parathesis
                    if (indents.length==0 && useContinuation) {
                        ret[ret.length - 2] += "\\";
                    }
                }
            }
            else {
                let tmpIndents: number[] = deepCopy(indents) as number[];
                //find indent by parathesis before the lastComma
                while (lastComma>=0 && tmpIndents.length>0 && indent>lastComma) {
                    if (tmpIndents.length>1 || lastComma<tmpIndents[0]) {
                        // if it's not the first parathesis indent, or lastComma is in front of the first parathesis indent, then pop();
                        indent = tmpIndents.pop();
                    }
                    else {
                        // if it's the first parathesis indent, and lastComma is behind of it, then keep it.
                        break;
                    }
                }
                if (lastComma>=0) {
                    // if tmpIndents.length ==0 && lastComma>=0, then try to seek for the parathesis before the lastComma
                    let closePara = 0;
                    for (let row=ret.length-1; row>=0 && tmpIndents.length ==0; row--) {
                        for (let seek = lastComma>=0 && row==ret.length-1?lastComma:ret[row].length-1; seek > indent; seek--) {
                            if (inStrTags[seek]) continue;
                            let currentChar = ret[row][seek];
                            if (currentChar == ')' || currentChar == ']') closePara++;
                            if (currentChar == '(' || currentChar == '[') {
                                if (closePara == 0) {
                                    tmpIndents.push(indent);
                                    indent = seek + 1;
                                    break;
                                }
                                else {
                                    closePara--;
                                }
                            }
                        }
                    }
                }
                let newlineAdded = false;
                if (lastComma >= 0 && lastComma>indent) {
                    let prefixSpaces = ret[ret.length - 1].search(/\S|$/);
                    if (indent > 0) prefixSpaces = indent;
                    const newLine =
                        ' '.repeat(prefixSpaces) +
                        ret[ret.length - 1].substr(lastComma + 1).trimLeft();
                    ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastComma + 1);
                    ret.push(newLine);
                    newlineAdded = true;
                    lastComma = -1;
                }
                else if (i < sentence.length - 2) {
                    for (let j=ret[ret.length - 1].length-1; j>indent; j--) {
                        let currentChar = ret[ret.length - 1][j];
                        if (!currentChar.match(/[a-z0-9_\.]/i) && sentence[i+1] != ",") {
                            let prefixSpaces = ret[ret.length - 1].search(/\S|$/);
                            if (indent > 0) prefixSpaces = indent;
                            let newLine = ' '.repeat(prefixSpaces) + ret[ret.length - 1].substr(j + 1).trimLeft();
                            ret[ret.length - 1] = ret[ret.length - 1].substr(0, j + 1);
                            // if (indents.length === 0) {
                            //     ret[ret.length - 1] += '\\'; // fix E502
                            // }
                            ret.push(newLine);
                            newlineAdded = true;
                            lastComma = -1;
                            break;
                        }
                    }
                }

                if (newlineAdded && tmpIndents.length==0 && useContinuation) {
                    ret[ret.length - 2] += "\\";
                }
            }

            let firstCharIdx = 0;
            const newLine = ret[ret.length - 1];
            while (
                firstCharIdx < ret[0].length &&
                ret[0][firstCharIdx] === ' ' &&
                firstCharIdx < newLine.length &&
                newLine[firstCharIdx] === ' '
            )
                firstCharIdx++;
            if (
                firstCharIdx < newLine.length &&
                firstCharIdx < ret[0].length &&
                ret[0][firstCharIdx] === '#'
            ) {
                ret[ret.length - 1] = `${newLine.substr(0, firstCharIdx)}# ${newLine.substr(
                    firstCharIdx,
                )}`;
            }
        }
    }
    if (!inStr && ret[ret.length - 1].trim().length === 0) ret.pop();
    if (output !== undefined) {
        for (const line of ret) output.push(line);
    }
    return ret;
}

export function CmdToMultiLines(cmd: string): string[] {
    const result: string[] = [];

    if (cmd.length < 120) {
        result.push(cmd);
    } else {
        const base = cmd.split(' ');
        const merged: string[] = [];
        let temp = '';
        for (let i = 0; i < base.length; ++i) {
            if (base[i].startsWith('--')) {
                merged.push(temp);
                temp = '';
            }
            temp += base[i] + ' ';
        }
        merged.push(temp);
        temp = '';

        for (let i = 0; i < merged.length; ++i) {
            if (temp.length + merged[i].length > 119) {
                temp += '\\';
                result.push(temp);
                temp = getIndentString(4);
            }
            temp += merged[i];
        }
        result.push(temp);
    }

    return result;
}

export function parseResourceId(mpath: string): Map<string, string> {
    const baseRegex = /\/subscriptions\/(?<subscription>[^/]*)(\/resourceGroups\/(?<resource_group>[^/]*))?(\/providers\/(?<namespace>[^/]*)\/(?<type>[^/]*)\/(?<name>[^/]*)(?<children>.*))?/g;
    const childRegex = /(\/providers\/(?<child_namespace>[^/]*))?\/(?<child_type>[^/]*)\/(?<child_name>[^/]*)/g;
    const mp: RegExpExecArray = baseRegex.exec(mpath);
    const ret: Map<string, string> = new Map<string, string>();
    if (mp) {
        const groups = mp.groups;
        ret.set('subscription', groups.subscription);
        ret.set('resource_group', groups.resource_group);
        ret.set('namespace', groups.namespace);
        ret.set('type', groups.type);
        ret.set('name', groups.name);
        ret.set('children', groups.children);
        let count = 0;
        const childStr: string = groups.children;
        let result = null;
        while (childStr != '') {
            result = childRegex.exec(childStr);
            if (isNullOrUndefined(result)) {
                break;
            }
            count++;
            for (const key of ['child_namespace', 'child_type', 'child_name']) {
                ret.set(key + '_' + count, result.groups[key]);
            }
        }
        ret.set('last_child_num', '' + count);
    }
    return ret;
}

export function findNodeInCodeModel(
    cliM4Path: any,
    codeModel: CodeModel,
    flattenMode = false,
    nodeTobeFound: any = null,
    noMatch = false,
) {
    const nodePaths = cliM4Path.split('$$');
    let curNode: any = codeModel;
    let lastValidNode: any = null;
    for (const np of nodePaths) {
        if (np === '') {
            continue;
        }
        if (isNullOrUndefined(curNode)) {
            break;
        }
        if (np.indexOf('[') > -1 && np.indexOf(']') > -1) {
            const beginIdx = np.indexOf('[');
            const endIdx = np.indexOf(']');
            const curStep = np.substring(0, beginIdx);
            curNode = curNode[curStep];
            if (!isNullOrUndefined(curNode)) {
                lastValidNode = curNode;
            } else {
                break;
            }
            let nextStep = '';
            if (np[beginIdx + 1] === "'" && np[endIdx - 1] === "'") {
                nextStep = np.substring(beginIdx + 2, endIdx - 1);
                let found = false;
                for (const node of values(curNode)) {
                    if (node?.['language']?.cli?.cliKey === nextStep) {
                        curNode = node;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    curNode = null;
                }
            } else {
                nextStep = np.substring(beginIdx + 1, endIdx);
                curNode = curNode[Number(nextStep)];
            }
            if (!isNullOrUndefined(curNode) && curNode.language?.cli?.cliPath === cliM4Path) {
                if (
                    noMatch ||
                    curNode.language.cli?.cliM4Path === cliM4Path ||
                    (!isNullOrUndefined(nodeTobeFound) &&
                        !isNullOrUndefined(curNode.language?.cli?.cliFlattenTrace) &&
                        !isNullOrUndefined(nodeTobeFound.language?.cli?.cliFlattenTrace) &&
                        nodeTobeFound.language.cli.cliFlattenTrace.join(';') ===
                            curNode.language.cli.cliFlattenTrace.join(';'))
                ) {
                    lastValidNode = curNode;
                } else {
                    curNode = null;
                }
            } else if (!isNullOrUndefined(curNode)) {
                lastValidNode = curNode;
            }
        } else {
            lastValidNode = curNode;
            curNode = curNode[np];
        }
    }
    if (!isNullOrUndefined(curNode) && curNode.language?.cli?.cliPath === cliM4Path) {
        if (
            !noMatch &&
            !(
                curNode.language.cli?.cliM4Path === cliM4Path ||
                (!isNullOrUndefined(nodeTobeFound) &&
                    !isNullOrUndefined(curNode.language?.cli?.cliFlattenTrace) &&
                    !isNullOrUndefined(nodeTobeFound.language?.cli?.cliFlattenTrace) &&
                    nodeTobeFound.language.cli.cliFlattenTrace.join(';') ===
                        curNode.language.cli.cliFlattenTrace.join(';'))
            )
        ) {
            curNode = null;
        }
    }

    if (!flattenMode || !isNullOrUndefined(curNode)) {
        return curNode;
    }
    const flattenedNodes = [];
    if (flattenMode && isNullOrUndefined(curNode) && !isNullOrUndefined(lastValidNode)) {
        for (const node of values(lastValidNode)) {
            for (const cliTracePath of values(node?.['language']?.cli?.cliFlattenTrace)) {
                if (cliTracePath === cliM4Path) {
                    flattenedNodes.push(node);
                    break;
                }
            }
        }
    }
    return flattenedNodes;
}

export async function getLatestPyPiVersion(packageName: string) {
    const url = 'https://pypi.org/pypi/' + packageName + '/json';
    const option = {
        uri: url,
    };
    const response = await request.get(option);
    const res = JSON.parse(response);
    const latest = res.urls[1];
    const filename = latest.filename;
    const version = filename.replace(packageName + '-', '').replace('.zip', '');
    return version;
}

export function getIndentString(indent: number): string {
    let indentStr = '';
    for (let i = 0; i < indent; ++i) {
        indentStr += ' ';
    }
    return indentStr;
}

export function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

export function deleteFolderRecursive(target) {
    if (fs.existsSync(target)) {
        fs.readdirSync(target).forEach((file, index) => {
            const curPath = path.join(target, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(target);
    }
}

export function skipCommentLines(base: string[]): number {
    let firstNoneCommentLineIdx = 0;
    for (let i = 0; i < base.length; ++i) {
        if (!base[i].startsWith('#') && firstNoneCommentLineIdx === 0) {
            firstNoneCommentLineIdx = i;
        }
    }
    return firstNoneCommentLineIdx;
}

export function keepHeaderLines(base: string[]): number {
    let futureImportLineIdx = 0;
    for (let i = 0; i < base.length; ++i) {
        if (base[i].indexOf('__future__') !== -1) {
            futureImportLineIdx = i + 1;
        }
    }
    return futureImportLineIdx;
}

export function getExtraModeInfo(mode: string, skipMode: string = null): string {
    if (mode === ExtensionMode.Experimental && mode !== skipMode) {
        return 'is_experimental=True';
    }
    if (mode === ExtensionMode.Preview && mode !== skipMode) {
        return 'is_preview=True';
    }
    return '';
}

// compute edit distance of two strings
// original from https://www.codementor.io/tips/6243778211/javascript-algorithms-levenshtein-s-distance-for-string-conversion
export function calculateLevDistance(src: string, tgt: string) {
    let realCost;

    let srcLength = src.length;
    let tgtLength = tgt.length;
    let tempString;
    let tempLength; // for swapping

    const resultMatrix = [];
    resultMatrix[0] = []; // Multi dimensional

    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
    if (srcLength < tgtLength) {
        tempString = src;
        src = tgt;
        tgt = tempString;
        tempLength = srcLength;
        srcLength = tgtLength;
        tgtLength = tempLength;
    }

    for (let c = 0; c < tgtLength + 1; c++) {
        resultMatrix[0][c] = c;
    }

    for (let i = 1; i < srcLength + 1; i++) {
        resultMatrix[i] = [];
        resultMatrix[i][0] = i;
        for (let j = 1; j < tgtLength + 1; j++) {
            realCost = src.charAt(i - 1) === tgt.charAt(j - 1) ? 0 : 1;
            resultMatrix[i][j] = Math.min(
                resultMatrix[i - 1][j] + 1,
                resultMatrix[i][j - 1] + 1,
                resultMatrix[i - 1][j - 1] + realCost, // same logic as our previous example.
            );
        }
    }

    return resultMatrix[srcLength][tgtLength];
}

export function distancePercentage(src: string, tgt: string) {
    const distance = calculateLevDistance(src, tgt);
    return distance / src.length;
}

export function composeParamString(maxApi: string, minApi: string, resourceType: string) {
    let ret = '';
    let useResourceType = false;
    if (!isNullOrUndefined(maxApi) && maxApi.length > 0) {
        ret += ", max_api='" + maxApi + "'";
    }
    if (!isNullOrUndefined(minApi) && minApi.length > 0) {
        ret += ", min_api='" + minApi + "'";
    }
    if (!isNullOrUndefined(resourceType) && resourceType.length > 0) {
        ret += ', resource_type=' + resourceType;
        useResourceType = true;
    }
    return [ret, useResourceType];
}

export function isEqualStringArray(array1: string[], array2: string[]): boolean {
    if (isNullOrUndefined(array1) && isNullOrUndefined(array2)) return true;
    if (isNullOrUndefined(array1) || isNullOrUndefined(array2)) return false;
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (typeof array1[i] !== 'string' || typeof array2[i] !== 'string') return false;
        if (array1[i].toLowerCase() !== array2[i].toLowerCase()) return false;
    }
    return true;
}

export function getGitStatus(folder: string) {
    try {
        const execSync = child_process.execSync;
        const cmd = `cd ${folder} & git log -50 & echo ********GIT STATUS******** & git status`;
        return execSync(cmd).toString();
    } catch {
        return 'git failed!';
    }
}

export function isNullOrUndefined(obj: any) {
    return obj === null || obj === undefined;
}
