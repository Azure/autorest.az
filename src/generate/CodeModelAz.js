"use strict";
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */
exports.__esModule = true;
var MethodParam = /** @class */ (function () {
    function MethodParam(value, isList, isSimpleListOrArray, submethodparameters, inBody) {
        this.value = value;
        this.isList = isList;
        this.isSimpleListOrArray = isSimpleListOrArray;
        this.submethodparameters = submethodparameters;
        this.inBody = inBody;
    }
    return MethodParam;
}());
exports.MethodParam = MethodParam;
var KeyValueType;
(function (KeyValueType) {
    KeyValueType[KeyValueType["No"] = 0] = "No";
    KeyValueType[KeyValueType["Classic"] = 1] = "Classic";
    KeyValueType[KeyValueType["PositionalKey"] = 2] = "PositionalKey";
    KeyValueType[KeyValueType["ShorthandSyntax"] = 3] = "ShorthandSyntax";
    KeyValueType[KeyValueType["SimpleArray"] = 4] = "SimpleArray";
})(KeyValueType = exports.KeyValueType || (exports.KeyValueType = {}));
var ExampleParam = /** @class */ (function () {
    function ExampleParam(name, value, isJson, keyValue, keys, defaultName, methodParam, ancestors, rawValue) {
        this.name = name;
        this.value = value;
        this.isJson = isJson;
        this.keyValue = keyValue;
        this.keys = keys;
        this.defaultName = defaultName;
        this.methodParam = methodParam;
        this.ancestors = ancestors;
        this.rawValue = rawValue;
    }
    return ExampleParam;
}());
exports.ExampleParam = ExampleParam;
var CommandExample = /** @class */ (function () {
    function CommandExample() {
    }
    return CommandExample;
}());
exports.CommandExample = CommandExample;
