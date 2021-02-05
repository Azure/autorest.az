"use strict";
var _a, _b, _c, _d;
exports.__esModule = true;
var CodeModelAz_1 = require("../../CodeModelAz");
var helper_1 = require("../../../utils/helper");
var codegen_1 = require("@azure-tools/codegen");
exports.azOptions = {};
function MethodToOrder(httpMethod) {
    if (httpMethod === 'put')
        return 0;
    else if (httpMethod === 'get')
        return 1;
    else if (httpMethod === 'post')
        return 4;
    else if (httpMethod === 'patch')
        return 5;
    else
        return 3;
}
function GenerateDefaultTestScenario(examples) {
    var testScenario = [];
    // sort to make it examples stable
    examples = examples.sort(function (e1, e2) {
        if (e1.Id === e2.Id)
            return e1.Method > e2.Method ? 1 : -1;
        return e1.Id > e2.Id ? 1 : -1;
    });
    var sorted = examples.sort(function (e1, e2) {
        var isDelete1 = e1.HttpMethod.toLowerCase() === 'delete';
        var isDelete2 = e2.HttpMethod.toLowerCase() === 'delete';
        if (isDelete1 && !isDelete2)
            return 1;
        if (isDelete2 && !isDelete1)
            return -1;
        if (isDelete1 && isDelete2) {
            return e1.ResourceClassName > e2.ResourceClassName ? 1 : -1;
        }
        if (e1.ResourceClassName === e2.ResourceClassName) {
            var n1 = MethodToOrder(e1.HttpMethod);
            var n2 = MethodToOrder(e2.HttpMethod);
            if (n1 === n2)
                return e1.Id > e2.Id ? 1 : -1;
            return n1 > n2 ? 1 : -1;
        }
        else {
            return e1.ResourceClassName > e2.ResourceClassName ? 1 : -1;
        }
    });
    for (var i = 0; i < sorted.length; i++) {
        var example = sorted[i];
        testScenario.push({ name: example.Id });
    }
    return testScenario;
}
exports.GenerateDefaultTestScenario = GenerateDefaultTestScenario;
function GenerateDefaultTestScenarioByDependency(examples, resourcePool, originalScenario) {
    var dependOn = function (exampleA, exampleB) {
        return resourcePool.isDependResource(exampleA.ResourceClassName, exampleB.ResourceClassName);
    };
    var getExample = function (name) {
        for (var _i = 0, examples_1 = examples; _i < examples_1.length; _i++) {
            var example = examples_1[_i];
            if (example.Id === name)
                return example;
        }
        return null;
    };
    originalScenario = originalScenario.sort(function (s1, s2) {
        return s1.name.localeCompare(s2.name);
    });
    originalScenario = helper_1.MergeSort(originalScenario, function (s1, s2) {
        var e1 = getExample(s1.name);
        var e2 = getExample(s2.name);
        if (!e1 || !e2)
            return 0;
        if (dependOn(e1, e2))
            return 1;
        if (dependOn(e2, e1))
            return -1;
        return e1.Id.localeCompare(e2.Id);
    });
    return originalScenario;
}
exports.GenerateDefaultTestScenarioByDependency = GenerateDefaultTestScenarioByDependency;
function PrintTestScenario(testScenario) {
    console.warn('');
    console.warn('BELOW TEST SCENARIO SECTION CAN BE USED IN readme.cli.md');
    console.warn('--------------------------------------------------------');
    console.warn('  test-scenario:');
    for (var i = 0; i < testScenario.length; i++) {
        var step = testScenario[i];
        console.warn('    - name: ' + step.name);
    }
    console.warn('--------------------------------------------------------');
}
exports.PrintTestScenario = PrintTestScenario;
function GroupTestScenario(testScenario, extensionName) {
    if (helper_1.isNullOrUndefined(testScenario))
        return testScenario;
    var ret = {};
    var defaultScenario = 'Scenario';
    function addScenario(groupName, scenarioName, items) {
        var _a;
        if (!Object.prototype.hasOwnProperty.call(ret, groupName))
            ret[groupName] = {};
        if (!Object.prototype.hasOwnProperty.call(ret[groupName], scenarioName))
            ret[groupName][scenarioName] = [];
        (_a = ret[groupName][scenarioName]).push.apply(_a, items);
    }
    if (helper_1.isDict(testScenario)) {
        var keys = Object.getOwnPropertyNames(testScenario);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var item = testScenario[key];
            var splitedName = key.split('_');
            if (splitedName.length > 1) {
                addScenario(splitedName[0], splitedName.slice(1).join('_'), item);
            }
            else {
                addScenario(splitedName[0], defaultScenario, item);
            }
        }
    }
    else if (Array.isArray(testScenario)) {
        for (var ci = 0; ci < testScenario.length; ci++) {
            addScenario(extensionName, defaultScenario, [testScenario[ci]]);
        }
    }
    return ret;
}
exports.GroupTestScenario = GroupTestScenario;
var SUBSCRIPTIONS = 'subscriptions';
var RESOUREGROUP = 'resource-group';
var VIRTUALNETWORK = 'virtual-network';
var STORAGEACCOUNT = 'storage-account';
var SUBNET = 'subnet';
var NETWORKINTERFACE = 'network-interface';
var resourceClassDepends = (_a = {},
    _a[RESOUREGROUP] = [],
    _a[VIRTUALNETWORK] = [RESOUREGROUP],
    _a[SUBNET] = [VIRTUALNETWORK, RESOUREGROUP],
    _a[STORAGEACCOUNT] = [RESOUREGROUP],
    _a[NETWORKINTERFACE] = [VIRTUALNETWORK, RESOUREGROUP],
    _a);
var resourceLanguages = (_b = {},
    _b[RESOUREGROUP] = ['resource-group', 'resourceGroupName', 'resourceGroups'],
    _b[VIRTUALNETWORK] = ['virtual-network', 'virtualNetworkName', 'virtualNetworks'],
    _b[SUBNET] = ['subnet', 'subnetName', 'subnets'],
    _b[STORAGEACCOUNT] = ['storage-account', 'storageAccountName', 'storageAccounts'],
    _b[NETWORKINTERFACE] = ['network-interface', 'networkInterfaceName', 'networkInterfaces'],
    _b);
var resourceClassKeys = (_c = {},
    _c[RESOUREGROUP] = 'rg',
    _c[VIRTUALNETWORK] = 'vn',
    _c[SUBNET] = 'sn',
    _c[STORAGEACCOUNT] = 'sa',
    _c[NETWORKINTERFACE] = 'nic',
    _c);
function TopoSortResource() {
    var ret = [];
    var resources = Object.keys(resourceClassDepends);
    // let reverse_depends = { };
    var depends = helper_1.deepCopy(resourceClassDepends);
    while (ret.length < Object.keys(resourceClassDepends).length) {
        var decreasing = false;
        for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
            var a = resources_1[_i];
            if (!helper_1.isNullOrUndefined(depends[a]) && depends[a].length === 0) {
                ret.push(a);
                delete depends[a];
                decreasing = true;
                for (var b in depends) {
                    for (var i = 0; i < depends[b].length; i++) {
                        if (depends[b][i] === a) {
                            depends[b].splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        }
        if (!decreasing) {
            // append all remains if there is loop dependency.
            for (var d in depends) {
                ret.push(d);
            }
            break;
        }
    }
    return ret;
}
exports.TopoSortResource = TopoSortResource;
var PreparerInfo = /** @class */ (function () {
    function PreparerInfo(name, className, dependParameters, dependResources) {
        this.name = name;
        this.className = className;
        this.dependParameters = dependParameters;
        this.dependResources = dependResources;
        this.createdObjectNames = [];
    }
    return PreparerInfo;
}());
var preparerInfos = (_d = {},
    _d[RESOUREGROUP] = new PreparerInfo('ResourceGroupPreparer', RESOUREGROUP, [], []),
    _d[VIRTUALNETWORK] = new PreparerInfo('VirtualNetworkPreparer', VIRTUALNETWORK, ['resource_group_key'], [RESOUREGROUP]),
    _d[SUBNET] = new PreparerInfo('VnetSubnetPreparer', SUBNET, ['resource_group_key', 'vnet_key'], [RESOUREGROUP, VIRTUALNETWORK]),
    _d[STORAGEACCOUNT] = new PreparerInfo('StorageAccountPreparer', STORAGEACCOUNT, ['resource_group_parameter_name'], [RESOUREGROUP]),
    _d[NETWORKINTERFACE] = new PreparerInfo('VnetNicPreparer', NETWORKINTERFACE, ['resource_group_key', 'vnet_key'], [RESOUREGROUP, VIRTUALNETWORK]),
    _d);
var PreparerEntity = /** @class */ (function () {
    function PreparerEntity(info, objectName) {
        this.info = info;
        this.objectName = objectName;
        this.dependParameterValues = [];
    }
    return PreparerEntity;
}());
exports.PreparerEntity = PreparerEntity;
var ResourceClass = /** @class */ (function () {
    function ResourceClass(className) {
        this.className = className;
        this.objects = new Map();
    }
    return ResourceClass;
}());
var ObjectStatus;
(function (ObjectStatus) {
    ObjectStatus[ObjectStatus["None"] = 0] = "None";
    ObjectStatus[ObjectStatus["Created"] = 1] = "Created";
    ObjectStatus[ObjectStatus["Deleted"] = 2] = "Deleted";
})(ObjectStatus = exports.ObjectStatus || (exports.ObjectStatus = {}));
var ResourceObject = /** @class */ (function () {
    function ResourceObject(objectName, className) {
        this.objectName = objectName;
        this.className = className;
        this.subResources = new Map();
        this.exampleParams = [];
        this.testStatus = ObjectStatus.None;
    }
    Object.defineProperty(ResourceObject.prototype, "key", {
        get: function () {
            return getResourceKey(this.className, this.objectName);
        },
        enumerable: true,
        configurable: true
    });
    ResourceObject.prototype.placeholder = function (isTest) {
        if (isTest)
            return '{' + this.key + '}';
        return getResourceKey(this.className, this.objectName, true);
    };
    ResourceObject.prototype.addOrUpdateParam = function (exampleParam) {
        // remove all children
        var coveredPath = [exampleParam.ancestors.concat([exampleParam.name])];
        for (var i = 0; i < this.exampleParams.length; i++) {
            var param = this.exampleParams[i];
            if (param.name === exampleParam.name) {
                coveredPath.push(param.ancestors.concat([param.name]));
            }
        }
        for (var i = 0; i < this.exampleParams.length; i++) {
            var param = this.exampleParams[i];
            if (coveredPath.indexOf(param.ancestors) >= 0) {
                this.exampleParams.splice(i);
                i--;
            }
        }
        // replace if already there
        for (var i = 0; i < this.exampleParams.length; i++) {
            var param = this.exampleParams[i];
            if (param.name === exampleParam.name) {
                this.exampleParams[i] = exampleParam;
                return;
            }
        }
        // append to the tail
        this.exampleParams.push(exampleParam);
    };
    ResourceObject.prototype.getCheckers = function (resourcePool, example) {
        var _a, _b;
        function hasComplexArray(obj) {
            if (obj instanceof Array) {
                if (obj.length > 1)
                    return true;
                for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                    var s = obj_1[_i];
                    if (hasComplexArray(s))
                        return true;
                }
            }
            if (helper_1.isDict(obj)) {
                for (var key in obj) {
                    if (hasComplexArray(obj[key]))
                        return true;
                }
            }
            return false;
        }
        function addParam(obj, param, checkPath, ret) {
            if (helper_1.isDict(obj)) {
                if (checkPath.length > 0)
                    checkPath += '.';
                if (param.defaultName in obj &&
                    typeof obj[param.defaultName] === typeof param.rawValue &&
                    JSON.stringify(obj[param.defaultName]).toLowerCase() ===
                        JSON.stringify(param.rawValue).toLowerCase()) {
                    if (hasComplexArray(param.rawValue))
                        return;
                    formatChecker(checkPath +
                        resourcePool.replaceResourceString(param.defaultName, [], [], true), param.rawValue, ret);
                    return true;
                }
            }
            if (obj instanceof Array) {
                if (obj.length > 1)
                    return;
                addParam(obj[0], param, checkPath + '[0]', ret);
            }
            else if (helper_1.isDict(obj)) {
                if (checkPath.length > 0)
                    checkPath += '.';
                var handled = false;
                for (var key in obj) {
                    if (checkPath.length === 0 && key.toLowerCase() === 'properties') {
                        if (addParam(obj[key], param, checkPath, ret)) {
                            handled = true;
                            break;
                        }
                    }
                    else {
                        if (addParam(obj[key], param, checkPath + resourcePool.replaceResourceString(key, [], [], true), ret)) {
                            handled = true;
                            break;
                        }
                    }
                }
                if (!handled) {
                    if (checkPath.length > 0)
                        checkPath = checkPath.slice(0, -1);
                    if ('name' in obj &&
                        checkPath.length === 0 &&
                        param.defaultName.toLowerCase().endsWith('name') &&
                        typeof obj.name === typeof param.rawValue &&
                        JSON.stringify(obj.name).toLowerCase() ===
                            JSON.stringify(param.rawValue).toLowerCase()) {
                        if (hasComplexArray(param.rawValue))
                            return;
                        formatChecker(checkPath + 'name', param.rawValue, ret);
                        return true;
                    }
                }
            }
            return false;
        }
        function formatChecker(checkPath, rawValue, ret) {
            if (typeof rawValue === 'object') {
                if (rawValue instanceof Array) {
                    if (rawValue.length > 1)
                        return;
                    if (rawValue.length === 0) {
                        ret.push("test.check(\"" + checkPath + "\", []),");
                    }
                    else {
                        formatChecker(checkPath + '[0]', rawValue[0], ret);
                    }
                }
                else if (helper_1.isDict(rawValue)) {
                    if (checkPath.length > 0)
                        checkPath += '.';
                    if (Object.keys(rawValue).length === 0) {
                        ret.push("test.check(\"" + checkPath + "\", {}),");
                    }
                    for (var key in rawValue) {
                        formatChecker(checkPath + resourcePool.replaceResourceString(key, [], [], true), rawValue[key], ret);
                    }
                }
            }
            else {
                if (typeof rawValue === 'string') {
                    var replacedValue = resourcePool.replaceResourceString(rawValue, [], [], true);
                    ret.push("test.check(\"" + checkPath + "\", " + helper_1.ToPythonString(replacedValue, typeof replacedValue) + ", case_sensitive=False),");
                }
                else {
                    ret.push("test.check(\"" + checkPath + "\", " + helper_1.ToPythonString(rawValue, typeof rawValue) + "),");
                }
            }
        }
        var ret = [];
        if (['create', 'delete', 'show', 'list', 'update'].indexOf(example.Method) < 0)
            return ret;
        var exampleRespBody = null;
        for (var _i = 0, _c = [200 /*, 201, 204 */]; _i < _c.length; _i++) {
            var statusCode = _c[_i];
            exampleRespBody = (_b = (_a = example.ExampleObj.responses) === null || _a === void 0 ? void 0 : _a[statusCode]) === null || _b === void 0 ? void 0 : _b.body;
            if (!helper_1.isNullOrUndefined(exampleRespBody))
                break;
        }
        if (helper_1.isNullOrUndefined(exampleRespBody))
            return ret;
        for (var _d = 0, _e = this.exampleParams; _d < _e.length; _d++) {
            var param = _e[_d];
            addParam(exampleRespBody, param, '', ret);
        }
        return ret;
    };
    return ResourceObject;
}());
function singlizeLast(word) {
    var eps = new codegen_1.EnglishPluralizationService();
    var ws = helper_1.changeCamelToDash(word).split('-');
    var l = ws.length;
    ws[l - 1] = eps.singularize(ws[l - 1]);
    return ws.join('-');
}
var keyCache = {}; // className+objectname->key
var formalCache = {};
var keySeq = {}; // className ->seq
function getResourceKey(className, objectName, formalName) {
    if (formalName === void 0) { formalName = false; }
    var _a, _b;
    var longKey = (resourceClassKeys[className] || className) + '_' + objectName;
    if (formalName && longKey in formalCache) {
        return formalCache[longKey];
    }
    if (!formalName && longKey in keyCache) {
        return keyCache[longKey];
    }
    if (Object.prototype.hasOwnProperty.call(keySeq, className)) {
        var key = (resourceClassKeys[className] || className) + '_' + keySeq[className];
        keySeq[className] += 1;
        formalCache[longKey] = helper_1.ToCamelCase("my-" + singlizeLast(className) + (keySeq[className] - 1));
        if ((_a = preparerInfos[className]) === null || _a === void 0 ? void 0 : _a.name) {
            // is external resource
            keyCache[longKey] = key;
        }
        else {
            keyCache[longKey] = helper_1.ToCamelCase("my-" + singlizeLast(className) + (keySeq[className] - 1));
        }
    }
    else {
        keySeq[className] = 2;
        formalCache[longKey] = helper_1.ToCamelCase("my-" + singlizeLast(className));
        if ((_b = preparerInfos[className]) === null || _b === void 0 ? void 0 : _b.name) {
            // is external resource
            keyCache[longKey] = resourceClassKeys[className] || className;
        }
        else {
            // is internal resource
            // generally, internal resource objectName is shorter than className
            // keyCache[longKey] = objectName;
            keyCache[longKey] = helper_1.ToCamelCase("my-" + singlizeLast(className));
        }
    }
    return formalName ? formalCache[longKey] : keyCache[longKey];
}
exports.getResourceKey = getResourceKey;
var ResourcePool = /** @class */ (function () {
    function ResourcePool() {
        this.root = new Map();
        this.map = new Map();
        this.useSubscription = false;
        this.replacements = new Map();
    }
    ResourcePool.prototype.prepareResource = function (className, objectName, depends, entitys, preparings) {
        if (className === SUBNET)
            return; // use default subnet, no need to prepare it.
        function inPreparings() {
            for (var _i = 0, preparings_1 = preparings; _i < preparings_1.length; _i++) {
                var _a = preparings_1[_i], pCName = _a[0], pOName = _a[1];
                if (className === pCName && objectName === pOName)
                    return true;
            }
            return false;
        }
        if (inPreparings())
            return;
        for (var _i = 0, entitys_1 = entitys; _i < entitys_1.length; _i++) {
            var e = entitys_1[_i];
            if (e.info.className === className && e.objectName === objectName) {
                return;
            }
        }
        for (var i = depends.length - 1; i >= 0; i--) {
            preparings.push([className, objectName]);
            this.prepareResource(depends[i][0], depends[i][1], depends.slice(0, i), entitys, preparings);
            preparings.pop();
        }
        var entity = new PreparerEntity(preparerInfos[className], objectName);
        for (var _a = 0, _b = entity.info.dependResources; _a < _b.length; _a++) {
            var dependResource = _b[_a];
            var found = false;
            for (var i = depends.length - 1; i >= 0; i--) {
                if (depends[i][0] === dependResource) {
                    found = true;
                    entity.dependParameterValues.push(getResourceKey(depends[i][0], depends[i][1]));
                    break;
                }
            }
            if (found)
                continue;
            // find any depend resource in the ready entitys list
            for (var _c = 0, entitys_2 = entitys; _c < entitys_2.length; _c++) {
                var e = entitys_2[_c];
                if (e.info.className === dependResource) {
                    found = true;
                    entity.dependParameterValues.push(getResourceKey(e.info.className, e.objectName));
                    break;
                }
            }
            if (found)
                continue;
            // if there is no entity for this depend has been exist, create a new of it.
            var defaultName = 'default';
            preparings.push([className, objectName]);
            this.prepareResource(dependResource, defaultName, depends, entitys, preparings);
            preparings.pop();
            entity.dependParameterValues.push(getResourceKey(dependResource, defaultName));
        }
        entitys.push(entity);
    };
    ResourcePool.prototype.prepareInTree = function (resource, entitys, root, depends) {
        if (resource in root) {
            for (var objectName in root[resource].objects) {
                this.prepareResource(resource, objectName, depends, entitys, []);
            }
        }
        for (var rName in root) {
            for (var oName in root[rName].objects) {
                depends.push([rName, oName]);
                this.prepareInTree(resource, entitys, root[rName].objects[oName].subResources, depends);
                depends.pop();
            }
        }
    };
    ResourcePool.prototype.prepareInMap = function (resource, entitys) {
        if (resource in this.map) {
            for (var oName in this.map[resource].objects) {
                this.prepareResource(resource, oName, [], entitys, []);
            }
        }
    };
    ResourcePool.prototype.createPreparerEntities = function () {
        var ret = [];
        for (var _i = 0, _a = TopoSortResource(); _i < _a.length; _i++) {
            var resource = _a[_i];
            this.prepareInTree(resource, ret, this.root, []);
            this.prepareInMap(resource, ret);
        }
        return ret;
    };
    ResourcePool.prototype.removeMapResource = function (className, objectName) {
        if (className in this.map && objectName in this.map[className].objects) {
            this.map[className].objects["delete"](objectName);
        }
    };
    ResourcePool.prototype.addTreeResource = function (className, objectName, parentObject) {
        var resources = parentObject
            ? parentObject.subResources
            : this.root;
        if (!(className in resources)) {
            resources[className] = new ResourceClass(className);
        }
        if (!(objectName in resources[className].objects)) {
            resources[className].objects[objectName] = new ResourceObject(objectName, className);
        }
        this.removeMapResource(className, objectName);
        return resources[className].objects[objectName];
    };
    ResourcePool.prototype.findResource = function (className, objectName, testStatus) {
        if (helper_1.isNullOrUndefined(className) || helper_1.isNullOrUndefined(objectName))
            return null;
        var resourceObject = this.findTreeResource(className, objectName, this.root, testStatus);
        if (resourceObject) {
            return resourceObject;
        }
        if (className in this.map && objectName in this.map[className].objects) {
            if (helper_1.isNullOrUndefined(testStatus) ||
                testStatus === this.map[className].objects[objectName].testStatus) {
                return this.map[className].objects[objectName];
            }
        }
        return undefined;
    };
    ResourcePool.prototype.findAllResource = function (className, exampleParams, testStatus) {
        if (exampleParams === void 0) { exampleParams = null; }
        if (testStatus === void 0) { testStatus = null; }
        var ret = [];
        this.findAllTreeResource(className, this.root, ret);
        if (helper_1.isNullOrUndefined(className)) {
            for (var c in this.map) {
                for (var o in this.map[c].objects) {
                    ret.push(this.map[c].objects[o]);
                }
            }
        }
        else if (className in this.map) {
            for (var key in this.map[className].objects) {
                ret.push(this.map[className].objects[key]);
            }
        }
        return ret.filter(function (resourceObject) {
            for (var _i = 0, exampleParams_1 = exampleParams; _i < exampleParams_1.length; _i++) {
                var critParam = exampleParams_1[_i];
                var found = false;
                for (var _a = 0, _b = resourceObject.exampleParams; _a < _b.length; _a++) {
                    var resourceParam = _b[_a];
                    if (critParam.name === resourceParam.name &&
                        critParam.rawValue === resourceParam.rawValue) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return false;
            }
            return helper_1.isNullOrUndefined(testStatus) || testStatus === resourceObject.testStatus;
        });
    };
    ResourcePool.prototype.findAllTreeResource = function (className, root, ret) {
        if (className in root) {
            for (var key in root[className].objects) {
                ret.push(root[className].objects[key]);
            }
        }
        for (var c in root) {
            if (helper_1.isNullOrUndefined(className)) {
                for (var o in root[c].objects) {
                    ret.push(root[c].objects[o]);
                }
            }
            for (var o in root[c].objects) {
                this.findAllTreeResource(className, root[c].objects[o].subResources, ret);
            }
        }
    };
    ResourcePool.prototype.findTreeResource = function (className, objectName, root, testStatus) {
        if (testStatus === void 0) { testStatus = null; }
        if (className in root &&
            Object.prototype.hasOwnProperty.call(root[className].objects, objectName)) {
            if (helper_1.isNullOrUndefined(testStatus) ||
                testStatus === root[className].objects[objectName].testStatus) {
                return root[className].objects[objectName];
            }
        }
        if (!className) {
            for (var c in root) {
                if (Object.prototype.hasOwnProperty.call(root[c].objects, objectName)) {
                    if (helper_1.isNullOrUndefined(testStatus) ||
                        testStatus === root[c].objects[objectName].testStatus) {
                        return root[c].objects[objectName];
                    }
                }
            }
        }
        for (var c in root) {
            for (var o in root[c].objects) {
                var ret = this.findTreeResource(className, objectName, root[c].objects[o].subResources, testStatus);
                if (ret)
                    return ret;
            }
        }
        return null;
    };
    ResourcePool.prototype.addMapResource = function (className, objectName) {
        var resourceObject = this.findTreeResource(className, objectName, this.root);
        if (resourceObject) {
            return resourceObject;
        }
        if (className in this.map) {
            if (!(objectName in this.map[className].objects)) {
                this.map[className].objects[objectName] = new ResourceObject(objectName, className);
            }
        }
        else {
            this.map[className] = new ResourceClass(className);
            this.map[className].objects[objectName] = new ResourceObject(objectName, className);
        }
        return this.map[className].objects[objectName];
    };
    ResourcePool.prototype.isResource = function (language) {
        if (language.startsWith('--'))
            language = language.substr(2);
        for (var resource in resourceLanguages) {
            for (var _i = 0, _a = resourceLanguages[resource]; _i < _a.length; _i++) {
                var resourceLanguage = _a[_i];
                if (resourceLanguage.toLowerCase() === language.toLowerCase())
                    return resource;
            }
        }
        return null;
    };
    ResourcePool.prototype.formatable = function (str, placeholders) {
        str = str.split('{').join('{{').split('}').join('}}');
        for (var _i = 0, placeholders_1 = placeholders; _i < placeholders_1.length; _i++) {
            var placeholder = placeholders_1[_i];
            str = str.split("{" + placeholder + "}").join(placeholder);
        }
        return str;
    };
    ResourcePool.prototype.isSubParam = function (exampleParam, attr) {
        for (var _i = 0, _a = exampleParam.methodParam.submethodparameters || []; _i < _a.length; _i++) {
            var subparam = _a[_i];
            if (attr.toLowerCase().startsWith(subparam.language['cli'].cliKey.toLowerCase() + '='))
                return true;
        }
        for (var _b = 0, _c = exampleParam.keys; _b < _c.length; _b++) {
            var k = _c[_b];
            if (attr.toLowerCase().startsWith(k.toLowerCase() + '='))
                return true;
        }
        return false;
    };
    ResourcePool.prototype.addEndpointResource = function (endpoint, isJson, keyValue, placeholders, resources, exampleParam, isTest) {
        var _this = this;
        if (isTest === void 0) { isTest = true; }
        if (placeholders === undefined)
            placeholders = [];
        if (isJson) {
            var body = typeof endpoint === 'string' ? JSON.parse(endpoint) : endpoint;
            if (typeof body === 'object') {
                if (body instanceof Array) {
                    body = body.map(function (value) {
                        return _this.addEndpointResource(value, typeof value === 'object', keyValue, placeholders, resources, exampleParam, isTest);
                    });
                }
                else if (helper_1.isDict(body)) {
                    for (var k in body) {
                        body[k] = this.addEndpointResource(body[k], typeof body[k] === 'object', keyValue, placeholders, resources, exampleParam, isTest);
                    }
                }
            }
            else {
                body = this.addEndpointResource(body, false, keyValue, placeholders, resources, exampleParam, isTest);
            }
            if (typeof endpoint === 'string') {
                var ret = JSON.stringify(body)
                    .split(/[\r\n]+/)
                    .join('');
                return isTest ? this.formatable(ret, placeholders) : ret;
            }
            else {
                return body;
            }
        }
        if (typeof endpoint !== 'string')
            return endpoint;
        function parseActionString(rp, endpoint, seperator) {
            if (seperator === void 0) { seperator = ' '; }
            var ret = '';
            var attrs = endpoint.split(seperator);
            for (var i = 1; i < attrs.length; i++) {
                if (!rp.isSubParam(exampleParam, attrs[i])) {
                    attrs[i - 1] += ' ' + attrs[i];
                    attrs.splice(i, 1);
                    i--;
                }
            }
            for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                var attr = attrs_1[_i];
                var kv = attr.split('=');
                if (ret.length > 0)
                    ret += seperator;
                if (kv[1].length >= 2 && kv[1][0] === '"' && kv[1][kv[1].length - 1] === '"') {
                    var v = rp.addEndpointResource(kv[1].substr(1, kv[1].length - 2), isJson, CodeModelAz_1.KeyValueType.No, placeholders, resources, exampleParam, isTest);
                    ret += kv[0] + "=\"" + v + "\"";
                }
                else {
                    var v = rp.addEndpointResource(kv[1], isJson, CodeModelAz_1.KeyValueType.No, placeholders, resources, exampleParam, isTest);
                    ret += kv[0] + "=" + v;
                }
            }
            return ret;
        }
        // if the input is in form of "key1=value2 key2=value2 ...", then analyse the values one by one
        if (keyValue === CodeModelAz_1.KeyValueType.Classic) {
            return parseActionString(this, endpoint);
        }
        else if (keyValue === CodeModelAz_1.KeyValueType.PositionalKey) {
            var ret = '';
            for (var _i = 0, _a = endpoint.split(' '); _i < _a.length; _i++) {
                var item = _a[_i];
                if (ret.length > 0)
                    ret += ' ';
                if (item.length >= 2 && item.startsWith('"') && item.endsWith('"')) {
                    ret += "\"" + this.addEndpointResource(item.slice(1, -1), isJson, CodeModelAz_1.KeyValueType.No, placeholders, resources, exampleParam, isTest) + "\"";
                }
                else {
                    ret += this.addEndpointResource(item, isJson, CodeModelAz_1.KeyValueType.No, placeholders, resources, exampleParam, isTest);
                }
            }
            return ret;
        }
        else if (keyValue === CodeModelAz_1.KeyValueType.ShorthandSyntax) {
            var instanceStrings = endpoint.split(' ');
            var ret = '';
            for (var _b = 0, instanceStrings_1 = instanceStrings; _b < instanceStrings_1.length; _b++) {
                var instanceString = instanceStrings_1[_b];
                if (ret.length > 0)
                    ret += ' ';
                ret += parseActionString(this, instanceString, ',');
            }
            return ret;
        }
        else if (keyValue === CodeModelAz_1.KeyValueType.SimpleArray) {
            var ret = [];
            for (var _c = 0, _d = endpoint.split(' '); _c < _d.length; _c++) {
                var instanceString = _d[_c];
                var p = '';
                if (instanceString.length >= 2 &&
                    instanceString[0] === '"' &&
                    instanceString[instanceString.length - 1] === '"') {
                    p = this.addEndpointResource(instanceString.substr(1, instanceString.length - 2), isJson, CodeModelAz_1.KeyValueType.No, placeholders, resources, exampleParam, isTest);
                    p = "\"" + p + "\"";
                }
                else {
                    p = this.addEndpointResource(instanceString, isJson, CodeModelAz_1.KeyValueType.No, placeholders, resources, exampleParam, isTest);
                }
                ret.push(p);
            }
            return ret.join(' ');
        }
        return this.replaceResourceString(endpoint, placeholders, resources, isTest);
    };
    ResourcePool.prototype.replaceResourceString = function (endpoint, placeholders, resources, isTest) {
        if (isTest === void 0) { isTest = true; }
        var nodes = endpoint.split('/');
        if (nodes.length < 3 || nodes[0].length > 0 || nodes[1].toLowerCase() !== SUBSCRIPTIONS) {
            var ret_1 = this.getPlaceholder(endpoint, isTest, placeholders);
            return isTest ? this.formatable(ret_1, placeholders) : ret_1;
        }
        if (isTest) {
            nodes[2] = "{" + ResourcePool.KEY_SUBSCRIPTIONID + "}";
        }
        if (placeholders.indexOf(nodes[2]) < 0) {
            placeholders.push(nodes[2]);
        }
        this.useSubscription = true;
        var i = 3;
        var resourceObject = null;
        while (i < nodes.length - 1) {
            var resource = this.isResource(nodes[i]);
            if (resource) {
                if (resource === SUBNET) {
                    // since the subnet can't be created with rand name, just use the dfault one.
                    nodes[i + 1] = 'default';
                }
                else {
                    resourceObject = this.addTreeResource(resource, nodes[i + 1], resourceObject);
                    nodes[i + 1] = resourceObject.placeholder(isTest);
                    if (placeholders.indexOf(resourceObject.placeholder(isTest)) < 0) {
                        placeholders.push(resourceObject.placeholder(isTest));
                    }
                    if (resources.indexOf(resource) < 0) {
                        resources.push(resource);
                    }
                }
            }
            else {
                nodes[i + 1] = this.getPlaceholder(nodes[i + 1], isTest);
            }
            i += 2;
        }
        var ret = nodes.join('/');
        return isTest ? this.formatable(ret, placeholders) : ret;
    };
    ResourcePool.prototype.addParamResource = function (paramName, paramValue, isJson, keyValue, isTest) {
        if (isTest === void 0) { isTest = true; }
        if (typeof paramValue !== 'string' || isJson || keyValue !== CodeModelAz_1.KeyValueType.No)
            return paramValue;
        if (paramName.startsWith('--')) {
            paramName = paramName.substr(2);
        }
        var resource = this.isResource(paramName);
        if (!resource) {
            return this.getPlaceholder(paramValue, isTest);
        }
        if (resource === SUBNET) {
            // since the subnet can't be created with rand name, just use the dfault one.
            return 'default';
        }
        var resourceObject = this.addMapResource(resource, paramValue);
        if (resourceObject) {
            return resourceObject.placeholder(isTest);
        }
        else {
            return this.getPlaceholder(paramValue, isTest);
        }
    };
    ResourcePool.prototype.getPlaceholder = function (objectName, isTest, placeholders) {
        if (placeholders === void 0) { placeholders = null; }
        var _a;
        // find in MapResource
        for (var className in this.map) {
            if (!helper_1.isNullOrUndefined(this.map[className].objects) &&
                Object.prototype.hasOwnProperty.call(this.map[className].objects, objectName)) {
                var ret = this.map[className].objects[objectName].placeholder(isTest);
                if (!helper_1.isNullOrUndefined(placeholders)) {
                    if (placeholders.indexOf(ret) < 0) {
                        placeholders.push(ret);
                    }
                }
                return ret;
            }
        }
        // find in TreeResource
        var resourceObject = this.findTreeResource(null, objectName, this.root);
        if (resourceObject) {
            var ret = resourceObject.placeholder(isTest);
            if (!helper_1.isNullOrUndefined(placeholders)) {
                if (placeholders.indexOf(ret) < 0) {
                    placeholders.push(ret);
                }
            }
            return ret;
        }
        var regex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d+Z$/g;
        if (((_a = exports.azOptions) === null || _a === void 0 ? void 0 : _a['replace-datetime']) && regex.test(objectName)) {
            if (!this.replacements.has(objectName)) {
                var date = new Date();
                date.setDate(date.getDate() + 10);
                this.replacements.set(objectName, date.toISOString());
            }
            return this.replacements.get(objectName);
        }
        return objectName;
    };
    ResourcePool.prototype.addResourcesInfo = function (resources) {
        for (var className in resources) {
            resourceClassKeys[className] = className; // TODO: brief key for internal resources
            resourceLanguages[className] = resources[className];
        }
    };
    ResourcePool.prototype.setResourceDepends = function (resourceClassName, dependResources, dependParameters, createdObjectNames) {
        if (!(resourceClassName in resourceClassDepends)) {
            resourceClassDepends[resourceClassName] = helper_1.deepCopy(dependResources);
            preparerInfos[resourceClassName] = new PreparerInfo(null, resourceClassName, dependParameters, dependResources);
        }
        else {
            for (var i = 0; i < dependResources.length; i++) {
                var dependResource = dependResources[i];
                if (resourceClassDepends[resourceClassName].indexOf(dependResource) < 0) {
                    resourceClassDepends[resourceClassName].push(dependResource);
                    preparerInfos[resourceClassName].dependParameters.push(dependParameters[i]);
                    preparerInfos[resourceClassName].dependResources.push(dependResources[i]);
                }
            }
        }
        for (var _i = 0, createdObjectNames_1 = createdObjectNames; _i < createdObjectNames_1.length; _i++) {
            var objectName = createdObjectNames_1[_i];
            if (preparerInfos[resourceClassName].createdObjectNames.indexOf(objectName) < 0) {
                preparerInfos[resourceClassName].createdObjectNames.push(objectName);
            }
        }
    };
    ResourcePool.prototype.isDependResource = function (child, parent) {
        var depends = resourceClassDepends[child];
        return depends && depends.indexOf(parent) >= 0;
    };
    ResourcePool.prototype.getListCheckers = function (example) {
        var ret = [];
        if (example.Method !== 'list')
            return ret;
        var len = this.findAllResource(example.ResourceClassName, example.Parameters, ObjectStatus.Created).length;
        if (len > 0) {
            ret.push("test.check('length(@)', " + len + "),");
        }
        return ret;
    };
    ResourcePool.prototype.clearExampleParams = function () {
        for (var _i = 0, _a = this.findAllResource(null, [], null); _i < _a.length; _i++) {
            var resource = _a[_i];
            resource.exampleParams = [];
        }
    };
    ResourcePool.KEY_SUBSCRIPTIONID = 'subscription_id';
    return ResourcePool;
}());
exports.ResourcePool = ResourcePool;
