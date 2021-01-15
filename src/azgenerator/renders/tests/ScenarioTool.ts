import { CommandExample, ExampleParam, KeyValueType } from '../../climodels/ExampleType';
import {
    deepCopy,
    isDict,
    ToCamelCase,
    ToPythonString,
    changeCamelToDash,
    MergeSort,
    isNullOrUndefined,
} from '../../../utils/helper';
import { EnglishPluralizationService } from '@azure-tools/codegen';

export const azOptions = {};

function MethodToOrder(httpMethod: string): number {
    if (httpMethod === 'put') return 0;
    else if (httpMethod === 'get') return 1;
    else if (httpMethod === 'post') return 4;
    else if (httpMethod === 'patch') return 5;
    else return 3;
}

export function GenerateDefaultTestScenario(examples: CommandExample[]): any[] {
    const testScenario = [];

    // sort to make it examples stable
    examples = examples.sort((e1, e2) => {
        if (e1.Id === e2.Id) return e1.Method > e2.Method ? 1 : -1;
        return e1.Id > e2.Id ? 1 : -1;
    });

    const sorted: CommandExample[] = examples.sort((e1, e2) => {
        const isDelete1 = e1.HttpMethod.toLowerCase() === 'delete';
        const isDelete2 = e2.HttpMethod.toLowerCase() === 'delete';
        if (isDelete1 && !isDelete2) return 1;
        if (isDelete2 && !isDelete1) return -1;
        if (isDelete1 && isDelete2) {
            return e1.ResourceClassName > e2.ResourceClassName ? 1 : -1;
        }

        if (e1.ResourceClassName === e2.ResourceClassName) {
            const n1 = MethodToOrder(e1.HttpMethod);
            const n2 = MethodToOrder(e2.HttpMethod);
            if (n1 === n2) return e1.Id > e2.Id ? 1 : -1;
            return n1 > n2 ? 1 : -1;
        } else {
            return e1.ResourceClassName > e2.ResourceClassName ? 1 : -1;
        }
    });

    for (let i = 0; i < sorted.length; i++) {
        const example: CommandExample = sorted[i];
        testScenario.push({ name: example.Id });
    }
    return testScenario;
}

export function GenerateDefaultTestScenarioByDependency(
    examples: CommandExample[],
    resourcePool: ResourcePool,
    originalScenario: any[],
): any[] {
    const dependOn = (exampleA: CommandExample, exampleB: CommandExample): boolean => {
        return resourcePool.isDependResource(
            exampleA.ResourceClassName,
            exampleB.ResourceClassName,
        );
    };
    const getExample = (name) => {
        for (const example of examples) {
            if (example.Id === name) return example;
        }
        return null;
    };

    originalScenario = originalScenario.sort((s1, s2) => {
        return s1.name.localeCompare(s2.name);
    });

    originalScenario = MergeSort(originalScenario, (s1, s2) => {
        const e1 = getExample(s1.name);
        const e2 = getExample(s2.name);
        if (!e1 || !e2) return 0;
        if (dependOn(e1, e2)) return 1;
        if (dependOn(e2, e1)) return -1;
        return e1.Id.localeCompare(e2.Id);
    });

    return originalScenario;
}

export function PrintTestScenario(testScenario: any[]) {
    console.warn('');
    console.warn('BELOW TEST SCENARIO SECTION CAN BE USED IN readme.cli.md');
    console.warn('--------------------------------------------------------');
    console.warn('  test-scenario:');

    for (let i = 0; i < testScenario.length; i++) {
        const step: any = testScenario[i];
        console.warn('    - name: ' + step.name);
    }
    console.warn('--------------------------------------------------------');
}

export function GroupTestScenario(testScenario: any, extensionName: string) {
    if (isNullOrUndefined(testScenario)) return testScenario;

    const ret = {};
    const defaultScenario = 'Scenario';

    function addScenario(groupName: string, scenarioName: string, items: any[]) {
        if (!Object.prototype.hasOwnProperty.call(ret, groupName)) ret[groupName] = {};
        if (!Object.prototype.hasOwnProperty.call(ret[groupName], scenarioName))
            ret[groupName][scenarioName] = [];
        ret[groupName][scenarioName].push(...items);
    }

    if (isDict(testScenario)) {
        const keys = Object.getOwnPropertyNames(testScenario);
        for (const key of keys) {
            const item = testScenario[key];
            const splitedName = key.split('_');
            if (splitedName.length > 1) {
                addScenario(splitedName[0], splitedName.slice(1).join('_'), item);
            } else {
                addScenario(splitedName[0], defaultScenario, item);
            }
        }
    } else if (Array.isArray(testScenario)) {
        for (let ci = 0; ci < testScenario.length; ci++) {
            addScenario(extensionName, defaultScenario, [testScenario[ci]]);
        }
    }

    return ret;
}

const SUBSCRIPTIONS = 'subscriptions';
const RESOUREGROUP = 'resource-group';
const VIRTUALNETWORK = 'virtual-network';
const STORAGEACCOUNT = 'storage-account';
const SUBNET = 'subnet';
const NETWORKINTERFACE = 'network-interface';

const resourceClassDepends = {
    [RESOUREGROUP]: [],
    [VIRTUALNETWORK]: [RESOUREGROUP],
    [SUBNET]: [VIRTUALNETWORK, RESOUREGROUP],
    [STORAGEACCOUNT]: [RESOUREGROUP],
    [NETWORKINTERFACE]: [VIRTUALNETWORK, RESOUREGROUP],
};

const resourceLanguages = {
    [RESOUREGROUP]: ['resource-group', 'resourceGroupName', 'resourceGroups'],
    [VIRTUALNETWORK]: ['virtual-network', 'virtualNetworkName', 'virtualNetworks'],
    [SUBNET]: ['subnet', 'subnetName', 'subnets'],
    [STORAGEACCOUNT]: ['storage-account', 'storageAccountName', 'storageAccounts'],
    [NETWORKINTERFACE]: ['network-interface', 'networkInterfaceName', 'networkInterfaces'],
};

const resourceClassKeys = {
    [RESOUREGROUP]: 'rg',
    [VIRTUALNETWORK]: 'vn',
    [SUBNET]: 'sn',
    [STORAGEACCOUNT]: 'sa',
    [NETWORKINTERFACE]: 'nic',
};

export function TopoSortResource() {
    const ret = [];
    const resources = Object.keys(resourceClassDepends);
    // let reverse_depends = { };
    const depends = deepCopy(resourceClassDepends);
    while (ret.length < Object.keys(resourceClassDepends).length) {
        let decreasing = false;
        for (const a of resources) {
            if (!isNullOrUndefined(depends[a]) && depends[a].length === 0) {
                ret.push(a);
                delete depends[a];
                decreasing = true;
                for (const b in depends) {
                    for (let i = 0; i < depends[b].length; i++) {
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
            for (const d in depends) {
                ret.push(d);
            }
            break;
        }
    }
    return ret;
}

class PreparerInfo {
    name: string;
    className: string;
    dependParameters: string[];
    dependResources: string[];
    public createdObjectNames: string[];
    public constructor(
        name: string,
        className: string,
        dependParameters: string[],
        dependResources: string[],
    ) {
        this.name = name;
        this.className = className;
        this.dependParameters = dependParameters;
        this.dependResources = dependResources;
        this.createdObjectNames = [];
    }
}
const preparerInfos = {
    [RESOUREGROUP]: new PreparerInfo('ResourceGroupPreparer', RESOUREGROUP, [], []),
    [VIRTUALNETWORK]: new PreparerInfo(
        'VirtualNetworkPreparer',
        VIRTUALNETWORK,
        ['resource_group_key'],
        [RESOUREGROUP],
    ),
    [SUBNET]: new PreparerInfo(
        'VnetSubnetPreparer',
        SUBNET,
        ['resource_group_key', 'vnet_key'],
        [RESOUREGROUP, VIRTUALNETWORK],
    ),
    [STORAGEACCOUNT]: new PreparerInfo(
        'StorageAccountPreparer',
        STORAGEACCOUNT,
        ['resource_group_parameter_name'],
        [RESOUREGROUP],
    ),
    [NETWORKINTERFACE]: new PreparerInfo(
        'VnetNicPreparer',
        NETWORKINTERFACE,
        ['resource_group_key', 'vnet_key'],
        [RESOUREGROUP, VIRTUALNETWORK],
    ),
};

export class PreparerEntity {
    info: PreparerInfo;
    objectName: string;
    dependParameterValues: string[];
    public constructor(info: PreparerInfo, objectName: string) {
        this.info = info;
        this.objectName = objectName;
        this.dependParameterValues = [];
    }
}

class ResourceClass {
    className: string;
    objects: Map<string, ResourceObject>; // objectName --> resourceObject

    public constructor(className: string) {
        this.className = className;
        this.objects = new Map<string, ResourceObject>();
    }
}

export enum ObjectStatus {
    None,
    Created,
    Deleted,
}
class ResourceObject {
    objectName: string;
    className: string;
    // key: string;
    subResources: Map<string, ResourceClass>; // className --> resource_class
    exampleParams: ExampleParam[];
    testStatus: ObjectStatus;

    public constructor(objectName: string, className: string) {
        this.objectName = objectName;
        this.className = className;
        this.subResources = new Map<string, ResourceClass>();
        this.exampleParams = [];
        this.testStatus = ObjectStatus.None;
    }

    public get key(): string {
        return getResourceKey(this.className, this.objectName);
    }

    public placeholder(isTest: boolean): string {
        if (isTest) return '{' + this.key + '}';
        return getResourceKey(this.className, this.objectName, true);
    }

    public addOrUpdateParam(exampleParam: ExampleParam) {
        // remove all children
        const coveredPath = [exampleParam.ancestors.concat([exampleParam.name])];
        for (let i = 0; i < this.exampleParams.length; i++) {
            const param = this.exampleParams[i];
            if (param.name === exampleParam.name) {
                coveredPath.push(param.ancestors.concat([param.name]));
            }
        }
        for (let i = 0; i < this.exampleParams.length; i++) {
            const param = this.exampleParams[i];
            if (coveredPath.indexOf(param.ancestors) >= 0) {
                this.exampleParams.splice(i);
                i--;
            }
        }

        // replace if already there
        for (let i = 0; i < this.exampleParams.length; i++) {
            const param = this.exampleParams[i];
            if (param.name === exampleParam.name) {
                this.exampleParams[i] = exampleParam;
                return;
            }
        }

        // append to the tail
        this.exampleParams.push(exampleParam);
    }

    public getCheckers(resourcePool: ResourcePool, example: CommandExample): string[] {
        function hasComplexArray(obj: any): boolean {
            if (obj instanceof Array) {
                if (obj.length > 1) return true;
                for (const s of obj) {
                    if (hasComplexArray(s)) return true;
                }
            }
            if (isDict(obj)) {
                for (const key in obj) {
                    if (hasComplexArray(obj[key])) return true;
                }
            }
            return false;
        }

        function addParam(
            obj: any,
            param: ExampleParam,
            checkPath: string,
            ret: string[],
        ): boolean {
            if (isDict(obj)) {
                if (checkPath.length > 0) checkPath += '.';
                if (
                    param.defaultName in obj &&
                    typeof obj[param.defaultName] === typeof param.rawValue &&
                    JSON.stringify(obj[param.defaultName]).toLowerCase() ===
                        JSON.stringify(param.rawValue).toLowerCase()
                ) {
                    if (hasComplexArray(param.rawValue)) return;
                    formatChecker(
                        checkPath +
                            resourcePool.replaceResourceString(param.defaultName, [], [], true),
                        param.rawValue,
                        ret,
                    );
                    return true;
                }
            }
            if (obj instanceof Array) {
                if (obj.length > 1) return;
                addParam(obj[0], param, checkPath + '[0]', ret);
            } else if (isDict(obj)) {
                if (checkPath.length > 0) checkPath += '.';
                let handled = false;
                for (const key in obj) {
                    if (checkPath.length === 0 && key.toLowerCase() === 'properties') {
                        if (addParam(obj[key], param, checkPath, ret)) {
                            handled = true;
                            break;
                        }
                    } else {
                        if (
                            addParam(
                                obj[key],
                                param,
                                checkPath + resourcePool.replaceResourceString(key, [], [], true),
                                ret,
                            )
                        ) {
                            handled = true;
                            break;
                        }
                    }
                }
                if (!handled) {
                    if (checkPath.length > 0) checkPath = checkPath.slice(0, -1);
                    if (
                        'name' in obj &&
                        checkPath.length === 0 &&
                        param.defaultName.toLowerCase().endsWith('name') &&
                        typeof obj.name === typeof param.rawValue &&
                        JSON.stringify(obj.name).toLowerCase() ===
                            JSON.stringify(param.rawValue).toLowerCase()
                    ) {
                        if (hasComplexArray(param.rawValue)) return;
                        formatChecker(checkPath + 'name', param.rawValue, ret);
                        return true;
                    }
                }
            }
            return false;
        }

        function formatChecker(checkPath: string, rawValue: any, ret: string[]) {
            if (typeof rawValue === 'object') {
                if (rawValue instanceof Array) {
                    if (rawValue.length > 1) return;
                    if (rawValue.length === 0) {
                        ret.push(`test.check("${checkPath}", []),`);
                    } else {
                        formatChecker(checkPath + '[0]', rawValue[0], ret);
                    }
                } else if (isDict(rawValue)) {
                    if (checkPath.length > 0) checkPath += '.';
                    if (Object.keys(rawValue).length === 0) {
                        ret.push(`test.check("${checkPath}", {}),`);
                    }
                    for (const key in rawValue) {
                        formatChecker(
                            checkPath + resourcePool.replaceResourceString(key, [], [], true),
                            rawValue[key],
                            ret,
                        );
                    }
                }
            } else {
                if (typeof rawValue === 'string') {
                    const replacedValue = resourcePool.replaceResourceString(
                        rawValue,
                        [],
                        [],
                        true,
                    );
                    ret.push(
                        `test.check("${checkPath}", ${ToPythonString(
                            replacedValue,
                            typeof replacedValue,
                        )}, case_sensitive=False),`,
                    );
                } else {
                    ret.push(
                        `test.check("${checkPath}", ${ToPythonString(rawValue, typeof rawValue)}),`,
                    );
                }
            }
        }

        const ret: string[] = [];
        if (['create', 'delete', 'show', 'list', 'update'].indexOf(example.Method) < 0) return ret;
        let exampleRespBody = null;
        for (const statusCode of [200 /*, 201, 204 */]) {
            exampleRespBody = example.ExampleObj.responses?.[statusCode]?.body;
            if (!isNullOrUndefined(exampleRespBody)) break;
        }
        if (isNullOrUndefined(exampleRespBody)) return ret;

        for (const param of this.exampleParams) {
            addParam(exampleRespBody, param, '', ret);
        }

        return ret;
    }
}

function singlizeLast(word: string) {
    const eps = new EnglishPluralizationService();
    const ws = changeCamelToDash(word).split('-');
    const l = ws.length;
    ws[l - 1] = eps.singularize(ws[l - 1]);
    return ws.join('-');
}

const keyCache = {}; // className+objectname->key
const formalCache = {};
const keySeq = {}; // className ->seq
export function getResourceKey(className: string, objectName: string, formalName = false): string {
    const longKey = (resourceClassKeys[className] || className) + '_' + objectName;
    if (formalName && longKey in formalCache) {
        return formalCache[longKey];
    }
    if (!formalName && longKey in keyCache) {
        return keyCache[longKey];
    }

    if (Object.prototype.hasOwnProperty.call(keySeq, className)) {
        const key = (resourceClassKeys[className] || className) + '_' + keySeq[className];
        keySeq[className] += 1;
        formalCache[longKey] = ToCamelCase(`my-${singlizeLast(className)}${keySeq[className] - 1}`);
        if (preparerInfos[className]?.name) {
            // is external resource
            keyCache[longKey] = key;
        } else {
            keyCache[longKey] = ToCamelCase(
                `my-${singlizeLast(className)}${keySeq[className] - 1}`,
            );
        }
    } else {
        keySeq[className] = 2;
        formalCache[longKey] = ToCamelCase(`my-${singlizeLast(className)}`);
        if (preparerInfos[className]?.name) {
            // is external resource
            keyCache[longKey] = resourceClassKeys[className] || className;
        } else {
            // is internal resource
            // generally, internal resource objectName is shorter than className
            // keyCache[longKey] = objectName;
            keyCache[longKey] = ToCamelCase(`my-${singlizeLast(className)}`);
        }
    }

    return formalName ? formalCache[longKey] : keyCache[longKey];
}

export class ResourcePool {
    // resources: Map<string, Map<string, resourceObject[]>>; // resource_class-->resource_name-->resourceObject
    root: Map<string, ResourceClass>; // resourceClassName --> resource_class
    map: Map<string, ResourceClass>;
    useSubscription: boolean;
    static KEY_SUBSCRIPTIONID = 'subscription_id';
    replacements: Map<string, string>;

    public constructor() {
        this.root = new Map<string, ResourceClass>();
        this.map = new Map<string, ResourceClass>();
        this.useSubscription = false;
        this.replacements = new Map<string, string>();
    }

    private prepareResource(
        className: string,
        objectName: string,
        depends: string[][],
        entitys: PreparerEntity[],
        preparings: string[][],
    ) {
        if (className === SUBNET) return; // use default subnet, no need to prepare it.

        function inPreparings(): boolean {
            for (const [pCName, pOName] of preparings) {
                if (className === pCName && objectName === pOName) return true;
            }
            return false;
        }
        if (inPreparings()) return;

        for (const e of entitys) {
            if (e.info.className === className && e.objectName === objectName) {
                return;
            }
        }

        for (let i = depends.length - 1; i >= 0; i--) {
            preparings.push([className, objectName]);
            this.prepareResource(
                depends[i][0],
                depends[i][1],
                depends.slice(0, i),
                entitys,
                preparings,
            );
            preparings.pop();
        }

        const entity = new PreparerEntity(preparerInfos[className], objectName);
        for (const dependResource of entity.info.dependResources) {
            let found = false;
            for (let i = depends.length - 1; i >= 0; i--) {
                if (depends[i][0] === dependResource) {
                    found = true;
                    entity.dependParameterValues.push(getResourceKey(depends[i][0], depends[i][1]));
                    break;
                }
            }
            if (found) continue;

            // find any depend resource in the ready entitys list
            for (const e of entitys) {
                if (e.info.className === dependResource) {
                    found = true;
                    entity.dependParameterValues.push(
                        getResourceKey(e.info.className, e.objectName),
                    );
                    break;
                }
            }

            if (found) continue;

            // if there is no entity for this depend has been exist, create a new of it.
            const defaultName = 'default';
            preparings.push([className, objectName]);
            this.prepareResource(dependResource, defaultName, depends, entitys, preparings);
            preparings.pop();
            entity.dependParameterValues.push(getResourceKey(dependResource, defaultName));
        }
        entitys.push(entity);
    }

    private prepareInTree(
        resource: string,
        entitys: PreparerEntity[],
        root: Map<string, ResourceClass>,
        depends: string[][],
    ) {
        if (resource in root) {
            for (const objectName in root[resource].objects) {
                this.prepareResource(resource, objectName, depends, entitys, []);
            }
        }
        for (const rName in root) {
            for (const oName in root[rName].objects) {
                depends.push([rName, oName]);
                this.prepareInTree(
                    resource,
                    entitys,
                    root[rName].objects[oName].subResources,
                    depends,
                );
                depends.pop();
            }
        }
    }

    private prepareInMap(resource, entitys: PreparerEntity[]) {
        if (resource in this.map) {
            for (const oName in this.map[resource].objects) {
                this.prepareResource(resource, oName, [], entitys, []);
            }
        }
    }

    public createPreparerEntities(): PreparerEntity[] {
        const ret: PreparerEntity[] = [];
        for (const resource of TopoSortResource()) {
            this.prepareInTree(resource, ret, this.root, []);
            this.prepareInMap(resource, ret);
        }
        return ret;
    }

    private removeMapResource(className: string, objectName: string) {
        if (className in this.map && objectName in this.map[className].objects) {
            this.map[className].objects.delete(objectName);
        }
    }

    public addTreeResource(
        className: string,
        objectName: string,
        parentObject: ResourceObject,
    ): ResourceObject {
        const resources: Map<string, ResourceClass> = parentObject
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
    }

    public findResource(
        className: string,
        objectName: string,
        testStatus: ObjectStatus,
    ): ResourceObject | undefined {
        if (isNullOrUndefined(className) || isNullOrUndefined(objectName)) return null;

        const resourceObject = this.findTreeResource(className, objectName, this.root, testStatus);
        if (resourceObject) {
            return resourceObject;
        }

        if (className in this.map && objectName in this.map[className].objects) {
            if (
                isNullOrUndefined(testStatus) ||
                testStatus === this.map[className].objects[objectName].testStatus
            ) {
                return this.map[className].objects[objectName];
            }
        }

        return undefined;
    }

    public findAllResource(
        className: string,
        exampleParams: ExampleParam[] = null,
        testStatus: ObjectStatus = null,
    ): ResourceObject[] {
        const ret: ResourceObject[] = [];

        this.findAllTreeResource(className, this.root, ret);

        if (isNullOrUndefined(className)) {
            for (const c in this.map) {
                for (const o in this.map[c].objects) {
                    ret.push(this.map[c].objects[o]);
                }
            }
        } else if (className in this.map) {
            for (const key in this.map[className].objects) {
                ret.push(this.map[className].objects[key]);
            }
        }

        return ret.filter((resourceObject) => {
            for (const critParam of exampleParams) {
                let found = false;
                for (const resourceParam of resourceObject.exampleParams) {
                    if (
                        critParam.name === resourceParam.name &&
                        critParam.rawValue === resourceParam.rawValue
                    ) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false;
            }
            return isNullOrUndefined(testStatus) || testStatus === resourceObject.testStatus;
        });
    }

    public findAllTreeResource(
        className: string,
        root: Map<string, ResourceClass>,
        ret: ResourceObject[],
    ) {
        if (className in root) {
            for (const key in root[className].objects) {
                ret.push(root[className].objects[key]);
            }
        }

        for (const c in root) {
            if (isNullOrUndefined(className)) {
                for (const o in root[c].objects) {
                    ret.push(root[c].objects[o]);
                }
            }
            for (const o in root[c].objects) {
                this.findAllTreeResource(className, root[c].objects[o].subResources, ret);
            }
        }
    }

    public findTreeResource(
        className: string,
        objectName: string,
        root: Map<string, ResourceClass>,
        testStatus: ObjectStatus = null,
    ): ResourceObject {
        if (
            className in root &&
            Object.prototype.hasOwnProperty.call(root[className].objects, objectName)
        ) {
            if (
                isNullOrUndefined(testStatus) ||
                testStatus === root[className].objects[objectName].testStatus
            ) {
                return root[className].objects[objectName];
            }
        }
        if (!className) {
            for (const c in root) {
                if (Object.prototype.hasOwnProperty.call(root[c].objects, objectName)) {
                    if (
                        isNullOrUndefined(testStatus) ||
                        testStatus === root[c].objects[objectName].testStatus
                    ) {
                        return root[c].objects[objectName];
                    }
                }
            }
        }
        for (const c in root) {
            for (const o in root[c].objects) {
                const ret = this.findTreeResource(
                    className,
                    objectName,
                    root[c].objects[o].subResources,
                    testStatus,
                );
                if (ret) return ret;
            }
        }
        return null;
    }

    public addMapResource(className: string, objectName: string): ResourceObject {
        const resourceObject = this.findTreeResource(className, objectName, this.root);
        if (resourceObject) {
            return resourceObject;
        }

        if (className in this.map) {
            if (!(objectName in this.map[className].objects)) {
                this.map[className].objects[objectName] = new ResourceObject(objectName, className);
            }
        } else {
            this.map[className] = new ResourceClass(className);
            this.map[className].objects[objectName] = new ResourceObject(objectName, className);
        }
        return this.map[className].objects[objectName];
    }

    public isResource(language: string): string | null {
        if (language.startsWith('--')) language = language.substr(2);
        for (const resource in resourceLanguages) {
            for (const resourceLanguage of resourceLanguages[resource]) {
                if (resourceLanguage.toLowerCase() === language.toLowerCase()) return resource;
            }
        }
        return null;
    }

    private formatable(str: string, placeholders: string[]) {
        str = str.split('{').join('{{').split('}').join('}}');
        for (const placeholder of placeholders) {
            str = str.split(`{${placeholder}}`).join(placeholder);
        }
        return str;
    }

    private isSubParam(exampleParam: ExampleParam, attr: string): boolean {
        for (const subparam of exampleParam.methodParam.submethodparameters || []) {
            if (attr.toLowerCase().startsWith(subparam.language['cli'].cliKey.toLowerCase() + '='))
                return true;
        }
        for (const k of exampleParam.keys) {
            if (attr.toLowerCase().startsWith(k.toLowerCase() + '=')) return true;
        }
        return false;
    }

    public addEndpointResource(
        endpoint: any,
        isJson: boolean,
        keyValue: KeyValueType,
        placeholders: string[],
        resources: string[],
        exampleParam: ExampleParam,
        isTest = true,
    ): any {
        if (placeholders === undefined) placeholders = [];
        if (isJson) {
            let body = typeof endpoint === 'string' ? JSON.parse(endpoint) : endpoint;
            if (typeof body === 'object') {
                if (body instanceof Array) {
                    body = body.map((value) => {
                        return this.addEndpointResource(
                            value,
                            typeof value === 'object',
                            keyValue,
                            placeholders,
                            resources,
                            exampleParam,
                            isTest,
                        );
                    });
                } else if (isDict(body)) {
                    for (const k in body) {
                        body[k] = this.addEndpointResource(
                            body[k],
                            typeof body[k] === 'object',
                            keyValue,
                            placeholders,
                            resources,
                            exampleParam,
                            isTest,
                        );
                    }
                }
            } else {
                body = this.addEndpointResource(
                    body,
                    false,
                    keyValue,
                    placeholders,
                    resources,
                    exampleParam,
                    isTest,
                );
            }

            if (typeof endpoint === 'string') {
                const ret = JSON.stringify(body)
                    .split(/[\r\n]+/)
                    .join('');
                return isTest ? this.formatable(ret, placeholders) : ret;
            } else {
                return body;
            }
        }

        if (typeof endpoint !== 'string') return endpoint;

        function parseActionString(rp: ResourcePool, endpoint, seperator = ' '): string {
            let ret = '';
            const attrs = endpoint.split(seperator);
            for (let i = 1; i < attrs.length; i++) {
                if (!rp.isSubParam(exampleParam, attrs[i])) {
                    attrs[i - 1] += ' ' + attrs[i];
                    attrs.splice(i, 1);
                    i--;
                }
            }
            for (const attr of attrs) {
                const kv = attr.split('=');
                if (ret.length > 0) ret += seperator;
                if (kv[1].length >= 2 && kv[1][0] === '"' && kv[1][kv[1].length - 1] === '"') {
                    const v = rp.addEndpointResource(
                        kv[1].substr(1, kv[1].length - 2),
                        isJson,
                        KeyValueType.No,
                        placeholders,
                        resources,
                        exampleParam,
                        isTest,
                    );
                    ret += `${kv[0]}="${v}"`;
                } else {
                    const v = rp.addEndpointResource(
                        kv[1],
                        isJson,
                        KeyValueType.No,
                        placeholders,
                        resources,
                        exampleParam,
                        isTest,
                    );
                    ret += `${kv[0]}=${v}`;
                }
            }
            return ret;
        }

        // if the input is in form of "key1=value2 key2=value2 ...", then analyse the values one by one
        if (keyValue === KeyValueType.Classic) {
            return parseActionString(this, endpoint);
        } else if (keyValue === KeyValueType.PositionalKey) {
            let ret = '';
            for (const item of endpoint.split(' ')) {
                if (ret.length > 0) ret += ' ';
                if (item.length >= 2 && item.startsWith('"') && item.endsWith('"')) {
                    ret += `"${this.addEndpointResource(
                        item.slice(1, -1),
                        isJson,
                        KeyValueType.No,
                        placeholders,
                        resources,
                        exampleParam,
                        isTest,
                    )}"`;
                } else {
                    ret += this.addEndpointResource(
                        item,
                        isJson,
                        KeyValueType.No,
                        placeholders,
                        resources,
                        exampleParam,
                        isTest,
                    );
                }
            }
            return ret;
        } else if (keyValue === KeyValueType.ShorthandSyntax) {
            const instanceStrings = endpoint.split(' ');
            let ret = '';
            for (const instanceString of instanceStrings) {
                if (ret.length > 0) ret += ' ';
                ret += parseActionString(this, instanceString, ',');
            }
            return ret;
        } else if (keyValue === KeyValueType.SimpleArray) {
            const ret = [];
            for (const instanceString of endpoint.split(' ')) {
                let p = '';
                if (
                    instanceString.length >= 2 &&
                    instanceString[0] === '"' &&
                    instanceString[instanceString.length - 1] === '"'
                ) {
                    p = this.addEndpointResource(
                        instanceString.substr(1, instanceString.length - 2),
                        isJson,
                        KeyValueType.No,
                        placeholders,
                        resources,
                        exampleParam,
                        isTest,
                    );
                    p = `"${p}"`;
                } else {
                    p = this.addEndpointResource(
                        instanceString,
                        isJson,
                        KeyValueType.No,
                        placeholders,
                        resources,
                        exampleParam,
                        isTest,
                    );
                }
                ret.push(p);
            }
            return ret.join(' ');
        }
        return this.replaceResourceString(endpoint, placeholders, resources, isTest);
    }

    public replaceResourceString(
        endpoint: string,
        placeholders: string[],
        resources: string[],
        isTest = true,
    ): any {
        const nodes = endpoint.split('/');
        if (nodes.length < 3 || nodes[0].length > 0 || nodes[1].toLowerCase() !== SUBSCRIPTIONS) {
            const ret = this.getPlaceholder(endpoint, isTest, placeholders);
            return isTest ? this.formatable(ret, placeholders) : ret;
        }
        if (isTest) {
            nodes[2] = `{${ResourcePool.KEY_SUBSCRIPTIONID}}`;
        }
        if (placeholders.indexOf(nodes[2]) < 0) {
            placeholders.push(nodes[2]);
        }
        this.useSubscription = true;
        let i = 3;
        let resourceObject: ResourceObject = null;
        while (i < nodes.length - 1) {
            const resource = this.isResource(nodes[i]);
            if (resource) {
                if (resource === SUBNET) {
                    // since the subnet can't be created with rand name, just use the dfault one.
                    nodes[i + 1] = 'default';
                } else {
                    resourceObject = this.addTreeResource(resource, nodes[i + 1], resourceObject);
                    nodes[i + 1] = resourceObject.placeholder(isTest);
                    if (placeholders.indexOf(resourceObject.placeholder(isTest)) < 0) {
                        placeholders.push(resourceObject.placeholder(isTest));
                    }
                    if (resources.indexOf(resource) < 0) {
                        resources.push(resource);
                    }
                }
            } else {
                nodes[i + 1] = this.getPlaceholder(nodes[i + 1], isTest);
            }
            i += 2;
        }
        const ret = nodes.join('/');
        return isTest ? this.formatable(ret, placeholders) : ret;
    }

    public addParamResource(
        paramName: string,
        paramValue: string,
        isJson: boolean,
        keyValue: KeyValueType,
        isTest = true,
    ): string {
        if (typeof paramValue !== 'string' || isJson || keyValue !== KeyValueType.No)
            return paramValue;

        if (paramName.startsWith('--')) {
            paramName = paramName.substr(2);
        }
        const resource = this.isResource(paramName);
        if (!resource) {
            return this.getPlaceholder(paramValue, isTest);
        }
        if (resource === SUBNET) {
            // since the subnet can't be created with rand name, just use the dfault one.
            return 'default';
        }
        const resourceObject = this.addMapResource(resource, paramValue);
        if (resourceObject) {
            return resourceObject.placeholder(isTest);
        } else {
            return this.getPlaceholder(paramValue, isTest);
        }
    }

    public getPlaceholder(
        objectName: string,
        isTest: boolean,
        placeholders: string[] = null,
    ): string {
        // find in MapResource
        for (const className in this.map) {
            if (
                !isNullOrUndefined(this.map[className].objects) &&
                Object.prototype.hasOwnProperty.call(this.map[className].objects, objectName)
            ) {
                const ret = this.map[className].objects[objectName].placeholder(isTest);
                if (!isNullOrUndefined(placeholders)) {
                    if (placeholders.indexOf(ret) < 0) {
                        placeholders.push(ret);
                    }
                }
                return ret;
            }
        }

        // find in TreeResource
        const resourceObject = this.findTreeResource(null, objectName, this.root);
        if (resourceObject) {
            const ret = resourceObject.placeholder(isTest);
            if (!isNullOrUndefined(placeholders)) {
                if (placeholders.indexOf(ret) < 0) {
                    placeholders.push(ret);
                }
            }
            return ret;
        }

        const regex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d+Z$/g;
        if (azOptions?.['replace-datetime'] && regex.test(objectName)) {
            if (!this.replacements.has(objectName)) {
                const date = new Date();
                date.setDate(date.getDate() + 10);
                this.replacements.set(objectName, date.toISOString());
            }
            return this.replacements.get(objectName);
        }
        return objectName;
    }

    public addResourcesInfo(resources: any) {
        for (const className in resources) {
            resourceClassKeys[className] = className; // TODO: brief key for internal resources
            resourceLanguages[className] = resources[className];
        }
    }

    public setResourceDepends(
        resourceClassName: string,
        dependResources: string[],
        dependParameters: string[],
        createdObjectNames: string[],
    ) {
        if (!(resourceClassName in resourceClassDepends)) {
            resourceClassDepends[resourceClassName] = deepCopy(dependResources);
            preparerInfos[resourceClassName] = new PreparerInfo(
                null,
                resourceClassName,
                dependParameters,
                dependResources,
            );
        } else {
            for (let i = 0; i < dependResources.length; i++) {
                const dependResource = dependResources[i];
                if (resourceClassDepends[resourceClassName].indexOf(dependResource) < 0) {
                    resourceClassDepends[resourceClassName].push(dependResource);
                    preparerInfos[resourceClassName].dependParameters.push(dependParameters[i]);
                    preparerInfos[resourceClassName].dependResources.push(dependResources[i]);
                }
            }
        }

        for (const objectName of createdObjectNames) {
            if (preparerInfos[resourceClassName].createdObjectNames.indexOf(objectName) < 0) {
                preparerInfos[resourceClassName].createdObjectNames.push(objectName);
            }
        }
    }

    public isDependResource(child: string, parent: string) {
        const depends = resourceClassDepends[child];
        return depends && depends.indexOf(parent) >= 0;
    }

    public getListCheckers(example: CommandExample): string[] {
        const ret = [];
        if (example.Method !== 'list') return ret;
        const len = this.findAllResource(
            example.ResourceClassName,
            example.Parameters,
            ObjectStatus.Created,
        ).length;
        if (len > 0) {
            ret.push(`test.check('length(@)', ${len}),`);
        }
        return ret;
    }

    public clearExampleParams() {
        for (const resource of this.findAllResource(null, [], null)) {
            resource.exampleParams = [];
        }
    }
}
