/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';

export function changeCamelToDash(str: string) {
    str = str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    if(str.startsWith('-')) {
        str = str.substring(1, str.length);
    }
    return str;
}

export function ToSnakeCase(v: string)
{
    return v.replace(/([a-z](?=[A-Z]))/g, '$1 ').split(' ').join('_').toLowerCase();
}

export function Capitalize(v: string) {
    return v.charAt(0).toUpperCase() + v.slice(1);
}

export function Uncapitalize(v: string) {
    return v.charAt(0).toLowerCase() + v.slice(1);
}

export function ToCamelCase(v: string)
{
    v = v.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
    .reduce((result, word) => result + Capitalize(word.toLowerCase()));
    return v.charAt(0).toLowerCase() + v.slice(1);
}

export function EscapeString(original: string): string
{
    if (original == undefined) return "undefined";
    original = original.split('\n').join(" ");
    original = original.split('\'').join("\\\'");
    return original;
}

export function ReadFile(filename: string): string {
    return fs.readFileSync(filename,'utf8');
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
    return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}


export function ToMultiLine(sentence: string, output: string[] = undefined, maxLength: number = 119): string[] {
    let lastComma = -1;
    let inStr = false;
    let strTag = "";
    let ret = [""];
    let indent = 0;
    let spaceNum = 0;
    while (spaceNum < sentence.length && sentence[spaceNum] == ' ') spaceNum++;
    for (let i = 0; i < sentence.length; i++) {
        ret[ret.length - 1] += sentence[i];
        if (sentence[i] == ',') lastComma = ret[ret.length - 1].length - 1;
        if (inStr) {
            if (sentence[i] == strTag && sentence[i - 1] != '\\') {
                inStr = false;
            }
        }
        else {
            if (sentence[i] == '\'' && sentence[i - 1] != '\\') {
                inStr = true;
                strTag = '\'';
            }
            else if (sentence[i] == '\"' && sentence[i - 1] != '\\') {
                inStr = true;
                strTag = '\"';
            }

            if (indent == 0 && sentence[i] == '(') {
                indent = ret[ret.length - 1].length;
            }
        }
        if (ret[ret.length - 1].length >= maxLength) {
            if (inStr) {
                let lastNormal = ret[ret.length - 1].length - 1;
                while (lastNormal>=0 && sentence[lastNormal] == '\\') lastNormal--;
                if (lastNormal != ret[ret.length - 1].length - 1) {
                    let newLine = ' '.repeat(indent>0?indent:spaceNum) + strTag + ret[ret.length - 1].substr(lastNormal + 1);
                    ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastNormal + 1) + strTag;
                    let currentLength = ret[ret.length - 1].length;
                    if (ret[ret.length - 1][currentLength - 2] == strTag) {   // remove empty string in the end of line
                        ret[ret.length - 1] = ret[ret.length - 1].substr(0, currentLength - 2);
                    }
                    ret.push(newLine)
                    lastComma = -1;
                }
                else {
                    ret[ret.length - 1] += strTag;
                    ret.push(' '.repeat(indent>0?indent:spaceNum) + strTag);
                    lastComma = -1;
                }
            }
            else {
                if (lastComma >= 0) {
                    let newLine = ' '.repeat(indent>0?indent:spaceNum) + ret[ret.length - 1].substr(lastComma + 1).trimLeft();
                    ret[ret.length - 1] = ret[ret.length - 1].substr(0, lastComma + 1);
                    ret.push(newLine);
                    lastComma = -1;
                }
            }
        }
    }
    if (ret[ret.length - 1].trim().length==0)   ret.pop();
    if (output != undefined) {
        for (let line of ret) output.push(line);
    }
    return ret;
}