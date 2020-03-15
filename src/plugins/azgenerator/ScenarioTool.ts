
import * as path from "path"
import { CommandExample } from "./CodeModelAz";
import { deepCopy, isDict } from "../../utils/helper"

function MethodToOrder(method: string): number {
    if (method == 'create') return 0;
    else if (method == 'show') return 1;
    else if (method == 'list') return 2;
    else if (method == 'delete') return 4;
    else return 3;
}

export function GenerateDefaultTestScenario(
    examples: CommandExample[]): any[] {
    console.warn("");
    console.warn("NO TEST SCENARIO PROVIDED - DEFAULT WILL BE USED");
    console.warn("ADD FOLLOWING SECTION TO readme.cli.md FILE TO MODIFY IT");
    console.warn("--------------------------------------------------------");
    console.warn("  test-scenario:");

    let testScenario = [];

    let sorted: CommandExample[] = examples.sort((e1, e2) => {
        let n1 = MethodToOrder(e1.Method);
        let n2 = MethodToOrder(e2.Method);
        if (n1 == n2) {
            if (e1.Method == "create") return (e1.Path.length > e2.Path.length) ? 1 : -1;
            else return (e1.Path.length > e2.Path.length) ? -1 : 1;
        }
        return (n1 > n2) ? 1 : -1;
    })

    for (var i = 0; i < sorted.length; i++) {
        var example: CommandExample = examples[i];
        console.warn("    - name: " + example.Id);
        testScenario.push({ name: example.Id })
    }
    console.warn("--------------------------------------------------------");
    return testScenario;
}



const SUBSCRIPTIONS = "subscriptions";
const RESOUREGROUP = "resource-group";
const VIRTUALNETWORK = "virtual-network";
const SUBNET = "subnet";

let resourceClassDepends = {
    [RESOUREGROUP]: [],
    [VIRTUALNETWORK]: [RESOUREGROUP,],
    [SUBNET]: [VIRTUALNETWORK, RESOUREGROUP],
}

let resourceLanguages = {
    [RESOUREGROUP]: ['resource-group', 'resourceGroupName', 'resourceGroups'],
    [VIRTUALNETWORK]: ['virtual-network', 'virtualNetworkName', 'virtualNetworks'],
    [SUBNET]: ['subnet', 'subnetName', 'subnets'],
}

let resourceClassKeys = {
    [RESOUREGROUP]: 'rg',
    [VIRTUALNETWORK]: 'vn',
    [SUBNET]: 'sn',
}

export function TopoSortResource() {
    let ret = [];
    let resources = Object.keys(resourceClassDepends);
    //let reverse_depends = { };
    let depends = deepCopy(resourceClassDepends);
    while (ret.length < Object.keys(resourceClassDepends).length) {
        let decreasing = false;
        for (let a of resources) {
            if (a in depends && depends[a].length == 0) {
                ret.push(a);
                delete depends[a];
                decreasing = true;
                for (let b in depends) {
                    for (let i = 0; i < depends[b].length; i++) {
                        if (depends[b][i] == a) {
                            depends[b].splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        }
        if (!decreasing) {
            // append all remains if there is loop dependency.
            for (let d in depends) {
                ret.push(d);
            }
            break;
        }
    }
    return ret;
}

class PreparerInfo {
    name: string;
    class_name: string
    depend_parameters: string[];
    depend_resources: string[];
    public constructor(name: string, class_name: string, depend_parameters: string[], depend_resources: string[]) {
        this.name = name;
        this.class_name = class_name
        this.depend_parameters = depend_parameters;
        this.depend_resources = depend_resources;
    }
}
const preparerInfos = {
    [RESOUREGROUP]: new PreparerInfo('ResourceGroupPreparer', RESOUREGROUP, [], []),
    [VIRTUALNETWORK]: new PreparerInfo('VirtualNetworkPreparer', VIRTUALNETWORK, ['resource_group_key'], [RESOUREGROUP]),
    [SUBNET]: new PreparerInfo('VnetSubnetPreparer', SUBNET, ['resource_group_key', 'vnet_key'], [RESOUREGROUP, VIRTUALNETWORK]),
}

export class PreparerEntity {
    info: PreparerInfo;
    object_name: string;
    depend_parameter_values: string[];
    public constructor(info: PreparerInfo, object_name: string) {
        this.info = info;
        this.object_name = object_name;
        this.depend_parameter_values = [];
    }
}

class ResourceClass {
    class_name: string;
    objects: Map<string, ResourceObject>;  // object_name --> resource_object

    public constructor(class_name: string) {
        this.class_name = class_name;
        this.objects = new Map<string, ResourceObject>();
    }

}
class ResourceObject {
    object_name: string;
    class_name: string;
    // key: string;
    sub_resources: Map<string, ResourceClass>; //class_name --> resource_class

    public constructor(object_name: string, class_name: string) {
        this.object_name = object_name;
        this.class_name = class_name;
        this.sub_resources = new Map<string, ResourceClass>();
    }

    public get key(): string {
        return getResourceKey(this.class_name, this.object_name);
    }

    public get placeholder(): string {
        return '{' + this.key + '}';
    }
}

let keyCache = {}  //class_name+objectname->key
let keySeq = {}    // class_name ->seq
export function getResourceKey(class_name: string, object_name: string): string {
    let longKey = (resourceClassKeys[class_name] || class_name) + '_' + object_name;
    if (longKey in keyCache) {
        return keyCache[longKey];
    }
    if (class_name in keySeq) {
        let key = (resourceClassKeys[class_name] || class_name) + '_' + keySeq[class_name];
        keySeq[class_name] += 1;
        keyCache[longKey] = key;
    }
    else {
        keySeq[class_name] = 2;
        if (preparerInfos[class_name]?.name) {  // is external resource
            keyCache[longKey] = resourceClassKeys[class_name] || class_name;
        }
        else {                              // is internal resource
            // generally, internal resource object_name is shorter than class_name
            keyCache[longKey] = object_name;
        }

    }
    return keyCache[longKey];
}

export class ResourcePool {
    //resources: Map<string, Map<string, resource_object[]>>; // resource_class-->resource_name-->resource_object
    root: Map<string, ResourceClass>;    //resource_class_name --> resource_class
    map: Map<string, ResourceClass>;
    use_subscription: boolean;
    static KEY_SUBSCRIPTIONID = "subscription_id";

    public constructor() {
        this.root = new Map<string, ResourceClass>();
        this.map = new Map<string, ResourceClass>();
        this.use_subscription = false;
    }

    private prepareResource(class_name: string, object_name: string, depends: string[][], entitys: PreparerEntity[]) {
        if (class_name == SUBNET)  return ; // use default subnet, no need to prepare it.

        for (let e of entitys) {
            if (e.info.class_name == class_name && e.object_name == object_name) {
                return;
            }
        }
        for (let i = depends.length - 1; i >= 0; i--) {
            this.prepareResource(depends[i][0], depends[i][1], depends.slice(0, i), entitys);
        }

        let entity = new PreparerEntity(preparerInfos[class_name], object_name);
        for (let depend_resource of entity.info.depend_resources) {
            let found = false;
            for (let i = depends.length - 1; i >= 0; i--) {
                if (depends[i][0] == depend_resource) {
                    found = true;
                    entity.depend_parameter_values.push(getResourceKey(depends[i][0], depends[i][1]));
                    break;
                }
            }
            if (found) continue;

            // find any depend resource in the ready entitys list
            for (let e of entitys) {
                if (e.info.class_name == depend_resource) {
                    found = true;
                    entity.depend_parameter_values.push(getResourceKey(e.info.class_name, e.object_name));
                    break;
                }
            }

            if (found) continue;

            //if there is no entity for this depend has been exist, create a new of it.
            const default_name = 'default';
            this.prepareResource(depend_resource, default_name, [], entitys);
            entity.depend_parameter_values.push(getResourceKey(depend_resource, default_name));
        }
        entitys.push(entity);
    }

    private prepareInTree(resource: string, entitys: PreparerEntity[], root: Map<string, ResourceClass>, depends: string[][]) {
        if (resource in root) {
            for (let object_name in root[resource].objects) {
                this.prepareResource(resource, object_name, depends, entitys);
            }
        }
        for (let r_name in root) {
            for (let o_name in root[r_name].objects) {
                depends.push([r_name, o_name]);
                this.prepareInTree(resource, entitys, root[r_name].objects[o_name].sub_resources, depends);
                depends.pop();
            }
        }
    }

    private prepareInMap(resource, entitys: PreparerEntity[]) {
        if (resource in this.map) {
            for (let o_name in this.map[resource].objects) {
                this.prepareResource(resource, o_name, [], entitys);
            }
        }
    }

    public createPreparerEntities(): PreparerEntity[] {
        let ret: PreparerEntity[] = [];
        for (let resource of TopoSortResource()) {
            this.prepareInTree(resource, ret, this.root, []);
            this.prepareInMap(resource, ret);
        }
        return ret;
    }

    private removeMapResource(class_name: string, object_name: string) {
        if (class_name in this.map && object_name in this.map[class_name].objects) {
            this.map[class_name].objects.delete(object_name);
        }
    }

    public addTreeResource(class_name: string, object_name: string, parent_object: ResourceObject): ResourceObject {
        let resources: Map<string, ResourceClass> = parent_object ? parent_object.sub_resources : this.root;

        if (!(class_name in resources)) {
            resources[class_name] = new ResourceClass(class_name);
        }

        if (!(object_name in resources[class_name].objects)) {
            resources[class_name].objects[object_name] = new ResourceObject(object_name, class_name);
        }

        this.removeMapResource(class_name, object_name);
        return resources[class_name].objects[object_name];
    }

    public findTreeResource(class_name: string, object_name: string, root: Map<string, ResourceClass>): ResourceObject {
        if (class_name in root && object_name in root[class_name].objects) {
            return root[class_name].objects[object_name];
        }
        for (let c in root) {
            for (let o in root[c].objects) {
                let ret = this.findTreeResource(class_name, object_name, root[c].objects[o].sub_resources);
                if (ret) return ret;
            }
        }
        return null;
    }

    public addMapResource(class_name: string, object_name: string): ResourceObject {
        let resource_object = this.findTreeResource(class_name, object_name, this.root);
        if (resource_object) {
            return resource_object;
        }

        if (class_name in this.map) {
            if (!(object_name in this.map[class_name].objects)) {
                this.map[class_name].objects[object_name] = new ResourceObject(object_name, class_name)
            }
        }
        else {
            this.map[class_name] = new ResourceClass(class_name);
            this.map[class_name].objects[object_name] = new ResourceObject(object_name, class_name);
        }
        return this.map[class_name].objects[object_name];
    }

    public isResource(language): string | null {
        for (let resource in resourceLanguages) {
            for (let resource_language of resourceLanguages[resource]) {
                if (resource_language.toLowerCase() == language.toLowerCase()) return resource;
            }
        }
        return null;
    }

    private formatable(str:string, placeholders: string[]) {
        str = str.split("{").join("{{").split("}").join("}}");
        for (let placeholder of placeholders) {
            str = str.split(`{${placeholder}}`).join(placeholder);
        }
        return str;
    }

    public addEndpointResource(endpoint: any, isJson: boolean, isKeyValues: boolean, placeholders: string[], resources: string[]) {
        if (placeholders==undefined)  placeholders = new Array();
        if(isJson) {
            let body = typeof endpoint == 'string'? JSON.parse(endpoint):endpoint;
            if (typeof body == 'object') {
                if ( body instanceof Array) {
                    body = body.map((value) => {
                        return this.addEndpointResource(value, typeof value=='object', isKeyValues, placeholders, resources);
                    });
                }
                else if(isDict(body)) {
                    for (let k in body) {
                        body[k] = this.addEndpointResource(body[k], typeof body[k]=='object', isKeyValues, placeholders, resources);
                    }
                }
            }
            else {
                body = this.addEndpointResource(body, false, isKeyValues, placeholders, resources);
            }

            if (typeof endpoint == 'string') {
                return this.formatable(JSON.stringify(body).split(/[\r\n]+/).join(""), placeholders);
            }
            else {
                return body;
            }
        }

        if (typeof endpoint !== 'string') return endpoint;

        //if the input is in form of "key1=value2 key2=value2 ...", then analyse the values one by one
        if (isKeyValues) {
            let ret = "";
            for (let attr of endpoint.split(" ")) {
                let kv = attr.split("=");
                if (ret.length > 0) ret += " ";
                ret += `${kv[0]}=${this.addEndpointResource(kv[1], isJson, false, placeholders, resources)}`;
            }
            return ret;
        }

        let nodes = endpoint.split('/');
        if (nodes.length < 3 || nodes[0].length > 0 || nodes[1].toLowerCase() != SUBSCRIPTIONS) {
            return endpoint;
        }
        nodes[2] = `{${ResourcePool.KEY_SUBSCRIPTIONID}}`;
        if (placeholders.indexOf(nodes[2])<0) {
            placeholders.push(nodes[2]);
        }
        this.use_subscription = true;
        let i = 3;
        let resource_object: ResourceObject = null;
        while (i < (nodes.length - 1)) {
            const resource = this.isResource(nodes[i]);
            if (resource) {
                if (resource == SUBNET) {
                    // since the subnet can't be created with rand name, just use the dfault one.
                    nodes[i + 1] = 'default';
                }
                else {
                    resource_object = this.addTreeResource(resource, nodes[i + 1], resource_object);
                    nodes[i + 1] = resource_object.placeholder;
                    if (placeholders.indexOf(resource_object.placeholder)<0) {
                        placeholders.push(resource_object.placeholder);
                    }
                    if (resources.indexOf(resource) <0) {
                        resources.push(resource);
                    }
                }
            }
            i += 2;
        }
        return nodes.join('/');
    }

    public addParamResource(param_name: string, param_value: string, isJson: boolean, isKeyValues: boolean): string {
        if (typeof param_value !== 'string' || isJson || isKeyValues) return param_value;

        if (param_name.startsWith('--')) {
            param_name = param_name.substr(2);
        }
        let resource = this.isResource(param_name);
        if (!resource) {
            return param_value;
        }
        if (resource == SUBNET) {
            // since the subnet can't be created with rand name, just use the dfault one.
            return 'default';
        }
        let resource_object = this.addMapResource(resource, param_value);
        if (resource_object) {
            return resource_object.placeholder;
        }
        else {
            return param_value;
        }
    }

    public addResourcesInfo(resources: object) {
        for (let class_name in resources) {
            resourceClassKeys[class_name] = class_name; // TODO: brief key for internal resources
            resourceLanguages[class_name] = resources[class_name];
        }
    }

    public setResourceDepends(resource_class_name: string, depend_resources: string[], depend_parameters: string[]) {
        resourceClassDepends[resource_class_name] = depend_resources;
        preparerInfos[resource_class_name] = new PreparerInfo(null, resource_class_name, depend_parameters, depend_resources);
    }

    public isDependResource(child: string, parent: string) {
        let depends = resourceClassDepends[child];
        return depends && depends.indexOf(parent)>=0;
    }
}

