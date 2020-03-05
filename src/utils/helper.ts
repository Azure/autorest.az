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