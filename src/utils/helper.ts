/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CodeModel } from '@azure-tools/codemodel';
import { values } from "@azure-tools/linq";
import * as fs from 'fs';
import * as path from 'path';
import * as request from "request-promise-native";
import { isNullOrUndefined } from 'util';
import { ExtensionMode } from "../plugins/models"

export function changeCamelToDash(str: string) {
    str = str.replace(/[A-Z][^A-Z]/g, letter => `-${letter.toLowerCase()}`);
    str = str.replace(/[^A-Z][A-Z]/g, letter => `${letter[0]}-${letter[1].toLowerCase()}`);
    str = str.toLowerCase();
    if (str.startsWith('-')) {
        str = str.substring(1, str.length);
    }
    return str;
}

export function ToSnakeCase(v: string) {
    return v.replace(/([a-z](?=[A-Z]))/g, '$1 ').split(' ').join('_').toLowerCase();
}

export function Capitalize(v: string) {
    return v.charAt(0).toUpperCase() + v.slice(1);
}

export function Uncapitalize(v: string) {
    return v.charAt(0).toLowerCase() + v.slice(1);
}

export function ToCamelCase(v: string) {
    v = v.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
        .reduce((result, word) => result + Capitalize(word.toLowerCase()));
    return v.charAt(0).toLowerCase() + v.slice(1);
}

export function EscapeString(original: string): string {
    if (original == undefined) return "undefined";
    original = original.split('\n').join(" ");
    original = original.split('\'').join("\\\'");
    return original;
}

export function ReadFile(filename: string): string {
    return fs.readFileSync(filename, 'utf8');
}

export function deepCopy(obj: Object): Object {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function MergeSort(arr: any[], comparer: (left, right) => number): any[] {
    if (arr.length < 2)
        return arr;

    let middle: number = Math.floor(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle, arr.length);
    return Merge(MergeSort(left, comparer), MergeSort(right, comparer), comparer);
}

function Merge(left: any[], right: any[], comparer: (left, right) => number): any[] {
    var result = [];
    while (left.length && right.length) {
        if (comparer(left[0], right[0]) <= 0) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    while (left.length)
        result.push(left.shift());
    while (right.length)
        result.push(right.shift());
    return result;
}

export function isDict(v) {
    return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
}

export function ToJsonString(_in: any): string {
    return JSON.stringify(_in).split(/[\r\n]+/).join("").split("\\").join("\\\\").split("'").join("\\'")
}

export function ToPythonString(value: any, type: string): string {
    let str = value;

    if (!isNullOrUndefined(str)) {
        if (type == 'boolean') {
            if (Boolean(value)) {
                str = "True";
            }
            else {
                str = "False";
            }
        }
        else {
            str = JSON.stringify(str)
        }
    }

    return str;
}

function isEscaped(str: string, index: number): boolean {
    let slashNum = 0;
    index--;
    while (index >= 0 && str[index] == '\\') {
        slashNum += 1;
        index--;
    }
    return slashNum % 2 == 1;
}

export function ToMultiLine(sentence: string, output: string[] = undefined, maxLength: number = 119, strMode: boolean = false): string[] {
    let lastComma = -1;
    let inStr = false;
    let strTag = "";
    let ret = [""];
    let indent = 0;
    let spaceNum = 0;
    let strStart = -1;
    let inStrTags = Array(maxLength).fill(strMode);
    let isStrTags = Array(maxLength).fill(false);
    let indents = [];
    while (spaceNum < sentence.length && sentence[spaceNum] == ' ') spaceNum++;

    if (strMode) {
        inStr = true;
        strTag = 'impossible';
    }
    if (maxLength < 3) maxLength = 3;
    for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] == ' ' && !inStr && ret.length > 1 && ret[ret.length - 1].length == (indent > 0 ? indent : spaceNum)) continue;
        ret[ret.length - 1] += sentence[i];
        isStrTags[ret[ret.length - 1].length-1] = false;
        if (inStr) {
            if (sentence[i] == strTag && !isEscaped(sentence, i)) {
                inStr = false;
                isStrTags[ret[ret.length - 1].length-1] = true;
            }
            inStrTags[ret[ret.length - 1].length-1] = true;
        }
        else {
            if (sentence[i] == ',') lastComma = ret[ret.length - 1].length - 1;
            if (sentence[i] == '\'' && !isEscaped(sentence, i)) {
                inStr = true;
                strTag = '\'';
                strStart = i;
                isStrTags[ret[ret.length - 1].length-1] = true;
            }
            else if (sentence[i] == '\"' && !isEscaped(sentence, i)) {
                inStr = true;
                strTag = '\"';
                strStart = i;
                isStrTags[ret[ret.length - 1].length-1] = true;
            }

            if (sentence[i] == '(' || sentence[i] == '[') {
                indents.push(indent);
                indent = ret[ret.length - 1].length;
            }
            if (sentence[i] == ')' || sentence[i] == ']') {
                indent = indents.pop();
            }
            inStrTags[ret[ret.length - 1].length-1] = inStr;
        }
        
        if (ret[ret.length - 1].length >= maxLength) {
            if (inStr) {
                let lastNormal = ret[ret.length - 1].length - 1;
                let originLastNormal = lastNormal;
                while (lastNormal >= 0 && isEscaped(ret[ret.length - 1], lastNormal + 1)) lastNormal--;
                let UnEscapedLastNormal = lastNormal;
                for (let n = 0; n < Math.min(30, maxLength - 1); n++) {
                    if (i - n == strStart) break;
                    if (ret[ret.length - 1][lastNormal] != ' ') {
                        lastNormal--;
                    }
                    else {
                        break;
                    }
                }
                if (ret[ret.length - 1][lastNormal] != ' ' && i - (originLastNormal - lastNormal) != strStart) {
                    lastNormal = UnEscapedLastNormal;
                }

                if (strMode) {
                    if (lastNormal != ret[ret.length - 1].length - 1) {
                        let newLine = ret[ret.length - 1].substr(lastNormal + 1);
                        ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastNormal + 1) + "\\";
                        ret.push(newLine);
                        lastComma = -1;
                    }
                    else {
                        if (i < sentence.length - 1) {
                            ret[ret.length - 1] += "\\";
                            ret.push('');
                            lastComma = -1;
                        }
                    }
                }
                else {
                    let CommaPos = lastComma;
                    if (lastNormal != ret[ret.length - 1].length - 1) {
                        let newLine = ' '.repeat(indent > 0 ? indent : spaceNum) + strTag + ret[ret.length - 1].substr(lastNormal + 1);
                        ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastNormal + 1) + strTag;
                        ret.push(newLine);
                        lastComma = -1;
                    }
                    else {
                        ret[ret.length - 1] += strTag;
                        ret.push(' '.repeat(indent > 0 ? indent : spaceNum) + strTag);
                        lastComma = -1;
                    }

                    if (ret[ret.length-2].length>=2) {
                        let lenLast = ret[ret.length - 2].length;
                        // if (lenLast >= 4 && ret[ret.length - 2][lenLast - 2] == ' ' && ret[ret.length - 2][lenLast - 3] == strTag && (ret[ret.length - 2][lenLast - 4] != "\\")) {   // remove empty string in the end of line
                        //     ret[ret.length - 1] = ret[ret.length - 1].substr(0, lenLast - 2);
                        // }
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
                                }
                                else {
                                    // there is = in the end of line --> create new line from the last comma
                                    let tmp = ret[ret.length-2].slice(CommaPos+1).trimLeft();
                                    ret[ret.length-2] = ret[ret.length-2].slice(0, CommaPos+1);
                                    let startSpaceNum = ret[ret.length-1].search(/\S|$/);
                                    if (startSpaceNum>=0) {
                                        ret[ret.length-1] = ' '.repeat(startSpaceNum) + tmp + ret[ret.length-1].substr(startSpaceNum);
                                    }
                                    else {
                                        ret[ret.length-1] = tmp + ret[ret.length-1];
                                    }
                                }
                            }
                            
                        }
                    }
                }
            }
            else {
                if (lastComma >= 0) {
                    //find indent by parathesis before the lastComma
                    let close_para = 0;
                    for (let i = lastComma; i > indent; i--) {
                        if (inStrTags[i]) continue;
                        let currentChar = ret[ret.length - 1][i];
                        if (currentChar == ')' || currentChar == ']') close_para++;
                        if (currentChar == '(' || currentChar == '[') {
                            if (close_para == 0) {
                                indents.push(indent);
                                indent = i + 1;
                                break;
                            }
                            else {
                                close_para--;
                            }
                        }
                    }

                    let prefixSpaces = ret[ret.length - 1].search(/\S|$/);
                    if (indent > 0) prefixSpaces = indent;
                    let newLine = ' '.repeat(prefixSpaces) + ret[ret.length - 1].substr(lastComma + 1).trimLeft();
                    ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastComma + 1);
                    ret.push(newLine);
                    lastComma = -1;
                }
                else if (i < sentence.length - 2) {
                    for (let j=ret[ret.length - 1].length-1; j>indent; j--) {
                        let currentChar = ret[ret.length - 1][j];
                        if (!currentChar.match(/[a-z0-9_]/i) && sentence[i+1] != ",") {
                            let newLine = ' '.repeat(ret[ret.length - 1].search(/\S|$/)) + ret[ret.length - 1].substr(j + 1).trimLeft();
                            ret[ret.length - 1] = ret[ret.length - 1].substr(0, j + 1);
                            if (indents.length==0) {
                                ret[ret.length - 1] += "\\";    // fix E502
                            }
                            ret.push(newLine);
                            lastComma = -1;
                            break;
                        }
                    }
                }
            }

            let firstCharIdx = 0;
            let newLine = ret[ret.length - 1];
            while (firstCharIdx < ret[0].length && ret[0][firstCharIdx] == ' ' && firstCharIdx < newLine.length && newLine[firstCharIdx] == ' ') firstCharIdx++;
            if (firstCharIdx < newLine.length && firstCharIdx < ret[0].length && ret[0][firstCharIdx] == '#') {
                ret[ret.length - 1] = `${newLine.substr(0, firstCharIdx)}# ${newLine.substr(firstCharIdx)}`;
            }
        }
    }
    if (!inStr && ret[ret.length - 1].trim().length == 0) ret.pop();
    if (output != undefined) {
        for (let line of ret) output.push(line);
    }
    return ret;
}

export function CmdToMultiLines(cmd: string): string[] {
    let result: string[] = [];

    if (cmd.length < 120) {
        result.push(cmd);
    }
    else {
        const base = cmd.split(" ");
        let merged: string[] = [];
        let temp: string = "";
        for (let i = 0; i < base.length; ++i) {
            if (base[i].startsWith("--")) {
                merged.push(temp);
                temp = "";
            }
            temp += base[i] + " ";
        }
        merged.push(temp);
        temp = "";

        for (let i = 0; i < merged.length; ++i) {
            if (temp.length + merged[i].length > 119) {
                temp += "\\";
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
    let baseRegex: RegExp = /\/subscriptions\/(?<subscription>[^\/]*)(\/resourceGroups\/(?<resource_group>[^\/]*))?(\/providers\/(?<namespace>[^\/]*)\/(?<type>[^\/]*)\/(?<name>[^\/]*)(?<children>.*))?/g;
    let childRegex: RegExp = /(\/providers\/(?<child_namespace>[^\/]*))?\/(?<child_type>[^\/]*)\/(?<child_name>[^\/]*)/g;
    let mp: RegExpExecArray = baseRegex.exec(mpath);
    let ret: Map<string, string> = new Map<string, string>();
    if (mp) {
        let groups = mp.groups;
        ret.set('subscription', groups['subscription']);
        ret.set('resource_group', groups['resource_group']);
        ret.set('namespace', groups['namespace']);
        ret.set('type', groups['type']);
        ret.set('name', groups['name']);
        ret.set('children', groups['children']);
        let children: RegExpExecArray = null;
        let count = 0;
        let childStr: string = groups["children"];
        let result = null;
        while (result = childRegex.exec(childStr)) {
            count++;
            for (let key of ['child_namespace', 'child_type', 'child_name']) {
                ret.set(key + "_" + count, result["groups"][key]);
            }
        }
        ret.set("last_child_num", "" + count);
    }
    return ret;
}

export function findNodeInCodeModel(cliM4Path: any, codeModel: CodeModel, flattenMode: boolean = false, nodeTobeFound: any = null, noMatch: boolean = false) {
    let nodePaths = cliM4Path.split('$$');
    let curNode: any = codeModel;
    let lastValidNode: any = null;
    for (let np of nodePaths) {
        if (np == "") {
            continue;
        }
        if (isNullOrUndefined(curNode)) {
            break;
        }
        if (np.indexOf('[') > -1 && np.indexOf(']') > -1) {
            let beginIdx = np.indexOf('[')
            let endIdx = np.indexOf(']');
            let curStep = np.substring(0, beginIdx);
            curNode = curNode[curStep];
            if (!isNullOrUndefined(curNode)) {
                lastValidNode = curNode
            } else {
                break;
            }
            let nextStep = "";
            if (np[beginIdx + 1] == "'" && np[endIdx - 1] == "'") {
                nextStep = np.substring(beginIdx + 2, endIdx - 1);
                let found = false;
                for (let node of values(curNode)) {
                    if (node?.['language']?.['cli']?.['cliKey'] == nextStep) {
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
            if (!isNullOrUndefined(curNode) && curNode.language?.['cli']?.['cliPath'] == cliM4Path) {
                if (noMatch || curNode.language['cli']?.['cliM4Path'] == cliM4Path || (!isNullOrUndefined (nodeTobeFound) && !isNullOrUndefined(curNode.language?.['cli']?.['cliFlattenTrace']) && !isNullOrUndefined(nodeTobeFound.language?.['cli']?.['cliFlattenTrace']) && nodeTobeFound.language['cli']['cliFlattenTrace'].join(";") == curNode.language['cli']['cliFlattenTrace'].join(";"))) {
                    lastValidNode = curNode;
                } else {
                    curNode = null;
                }
            } else if(!isNullOrUndefined(curNode)) {
                lastValidNode = curNode;
            }
        } else {
            lastValidNode = curNode;
            curNode = curNode[np];
        }
    }
    if (!isNullOrUndefined(curNode) && curNode.language?.['cli']?.['cliPath'] == cliM4Path) {
        if (!noMatch && (!(curNode.language['cli']?.['cliM4Path'] == cliM4Path || (!isNullOrUndefined (nodeTobeFound) && !isNullOrUndefined(curNode.language?.['cli']?.['cliFlattenTrace']) && !isNullOrUndefined(nodeTobeFound.language?.['cli']?.['cliFlattenTrace']) && nodeTobeFound.language['cli']['cliFlattenTrace'].join(";") == curNode.language['cli']['cliFlattenTrace'].join(";"))))) {
            curNode = null;
        }
    }

    if (!flattenMode || !isNullOrUndefined(curNode)) {
        return curNode;
    }
    let flattenedNodes = [];
    if (flattenMode && isNullOrUndefined(curNode) && !isNullOrUndefined(lastValidNode)) {
        for (let node of values(lastValidNode)) {
            for (let cliTracePath of values(node?.['language']?.['cli']?.['cliFlattenTrace'])) {
                if (cliTracePath == cliM4Path) {
                    flattenedNodes.push(node);
                    break;
                }
            }
        }
    }
    return flattenedNodes;
}

export async function getLatestPyPiVersion(packageName: string) {
    let url = "https://pypi.org/pypi/" + packageName + "/json";
    let option = {
        uri: url
    }
    let response = await request.get(option);
    let res = JSON.parse(response);
    let latest = res['urls'][1];
    let filename = latest['filename'];
    let version = filename.replace(packageName + "-", "").replace(".zip", "");
    return version;
}

export function getIndentString(indent: number): string {
    let indentStr: string = "";
    for (let i: number = 0; i < indent; ++i) {
        indentStr += " ";
    }
    return indentStr;
}

export function copyRecursiveSync(src, dest) {
    let exists = fs.existsSync(src);
    let stats = exists && fs.statSync(src);
    let isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

export function deleteFolderRecursive(target) {
    if (fs.existsSync(target)) {
        fs.readdirSync(target).forEach((file, index) => {
            let curPath = path.join(target, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(target);
    }
};

export function skipCommentLines(base: string[]): number {
    let firstNoneCommentLineIdx: number = 0;
    for (let i: number = 0; i < base.length; ++i) {
        if (!base[i].startsWith("#") && firstNoneCommentLineIdx == 0) {
            firstNoneCommentLineIdx = i;
        }
    }
    return firstNoneCommentLineIdx;
}

export function keepHeaderLines(base: string[]): number {
    let futureImportLineIdx: number = 0;
    for (let i: number = 0; i < base.length; ++i) {
        if (base[i].indexOf("__future__") != -1) {
            futureImportLineIdx = i + 1;
        }
    }
    return futureImportLineIdx;
}

export function getExtraModeInfo(mode: string, skipMode: string = null): string {
    if (mode == ExtensionMode.Experimental && mode != skipMode) {
        return "is_experimental=True";
    } 
    if (mode == ExtensionMode.Preview && mode != skipMode) {
        return "is_preview=True";
    }
    return "";
}


// compute edit distance of two strings
// original from https://www.codementor.io/tips/6243778211/javascript-algorithms-levenshtein-s-distance-for-string-conversion
export function calculateLevDistance(src: string, tgt: string) {
    var realCost;
    
    var srcLength = src.length,
        tgtLength = tgt.length,
        tempString, tempLength; // for swapping
    
    var resultMatrix = new Array();
        resultMatrix[0] = new Array(); // Multi dimensional
    
    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
    if (srcLength < tgtLength) {
        tempString = src; src = tgt; tgt = tempString;
        tempLength = srcLength; srcLength = tgtLength; tgtLength = tempLength;
    }
    
    for (var c = 0; c < tgtLength+1; c++) {
        resultMatrix[0][c] = c;
    }
    
    for (var i = 1; i < srcLength+1; i++) {
        resultMatrix[i] = new Array();
        resultMatrix[i][0] = i;
        for (var j = 1; j < tgtLength+1; j++) {
            realCost = (src.charAt(i-1) == tgt.charAt(j-1))? 0: 1;
            resultMatrix[i][j] = Math.min(
                resultMatrix[i-1][j]+1,
                resultMatrix[i][j-1]+1,
                resultMatrix[i-1][j-1] + realCost // same logic as our previous example.
            ); 
        }
    }
    
    return resultMatrix[srcLength][tgtLength];
}

export function distancePercentage(src: string, tgt: string) {
    let distance = calculateLevDistance(src, tgt);
    return distance/src.length;
}

export function composeParamString(maxApi: string, minApi: string, resourceType: string) {
    let ret = "";
    let useResourceType = false;
    if(!isNullOrUndefined(maxApi) && maxApi.length>0) {
        ret += ", max_api='" + maxApi + "'";
    }
    if(!isNullOrUndefined(minApi) && minApi.length>0) {
        ret += ", min_api='" + minApi + "'";
    }
    if(!isNullOrUndefined(resourceType) && resourceType.length>0) {
        ret += ", resource_type=" + resourceType;
        useResourceType = true;
    }
    return [ret, useResourceType];
}

export function isEqualStringArray(array1: string[], array2: string[]): boolean {
    if (isNullOrUndefined(array1) && isNullOrUndefined(array2)) return true;
    if (isNullOrUndefined(array1) || isNullOrUndefined(array2)) return false;
    if (array1.length != array2.length) return false;
    for (let i=0; i<array1.length; i++) {
        if (typeof array1[i] !== 'string' || typeof array2[i] !== 'string') return false;
        if (array1[i].toLowerCase() != array2[i].toLowerCase()) return false;
    }
    return true;
}