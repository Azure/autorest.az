
import * as path from "path"
import { CommandExample } from "./CodeModelAz";
import { deepCopy, ReadFile } from "../../utils/helper"

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

const external_resources = [
    RESOUREGROUP,
    VIRTUALNETWORK,
    SUBNET,
]

let resource_class_depends = {
    [RESOUREGROUP]: [],
    [VIRTUALNETWORK]: [RESOUREGROUP,],
    [SUBNET]: [VIRTUALNETWORK, RESOUREGROUP],
}

let resource_languages = {
    [RESOUREGROUP]: ['resource-group', 'resourceGroups'],
    [VIRTUALNETWORK]: ['virtual-network', 'virtualNetworks'],
    [SUBNET]: ['subnet', 'subnets'],
}

let resource_class_keys = {
    [RESOUREGROUP]: 'rg',
    [VIRTUALNETWORK]: 'vn',
    [SUBNET]: 'sn',
}

export function topo_sort_resource() {
    let ret = [];
    let resources = Object.keys(resource_class_depends);
    //let reverse_depends = { };
    let depends = deepCopy(resource_class_depends);
    while (ret.length < Object.keys(resource_class_depends).length) {
        for (let a of resources) {
            if (a in depends && depends[a].length == 0) {
                ret.push(a);
                delete depends[a];
                for (let b in depends) {
                    for (let i = 0; i < depends[b].length; i++) {
                        if (depends[b][i] == a) {
                            depends[b].splice(i, 1);
                        }
                    }
                }
            }
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
const preparer_infos = {
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
        return get_resource_key(this.class_name, this.object_name);
    }

    public get placeholder(): string {
        return '{' + this.key + '}';
    }
}

let key_cache = {}  //class_name+objectname->key
let key_seq = {}    // class_name ->seq
export function get_resource_key(class_name: string, object_name: string): string {
    let long_key = (resource_class_keys[class_name] || class_name) + '_' + object_name;
    if (long_key in key_cache) {
        return key_cache[long_key];
    }
    if (class_name in key_seq) {
        let key = (resource_class_keys[class_name] || class_name) + '_' + key_seq[class_name];
        key_seq[class_name] += 1;
        key_cache[long_key] = key;
    }
    else {
        key_seq[class_name] = 2;
        key_cache[long_key] = resource_class_keys[class_name] || class_name;
    }
    return key_cache[long_key];
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

    private prepare_resource(class_name: string, object_name: string, depends: string[][], entitys: PreparerEntity[]) {
        for (let e of entitys) {
            if (e.info.class_name == class_name && e.object_name == object_name) {
                return;
            }
        }
        for (let i = depends.length - 1; i >= 0; i--) {
            this.prepare_resource(depends[i][0], depends[i][1], depends.slice(0, i), entitys);
        }
        let entity = new PreparerEntity(preparer_infos[class_name], object_name);
        for (let depend_resource of entity.info.depend_resources) {
            let found = false;
            for (let i = depends.length - 1; i >= 0; i--) {
                if (depends[i][0] == depend_resource) {
                    found = true;
                    entity.depend_parameter_values.push(depends[i][1]);
                    break;
                }
            }
            if (found) continue;

            // find any depend resource in the ready entitys list
            for (let e of entitys) {
                if (e.info.class_name == depend_resource) {
                    found = true;
                    entity.depend_parameter_values.push(e.object_name);
                    break;
                }
            }

            //if there is no entity for this depend has been exist, create a new of it.
            const default_name = 'default';
            this.prepare_resource(depend_resource, default_name, [], entitys);
            entity.depend_parameter_values.push(default_name);
        }
        entitys.push(entity);
    }

    public prepare_in_tree(resource: string, entitys: PreparerEntity[], root: Map<string, ResourceClass>, depends: string[][]) {
        if (resource in root) {
            for (let object_name in root[resource].objects) {
                this.prepare_resource(resource, object_name, depends, entitys);
            }
        }
        for (let r_name in root) {
            for (let o_name in root[r_name].objects) {
                depends.push([r_name, o_name]);
                this.prepare_in_tree(resource, entitys, root[r_name].objects[o_name].sub_resources, depends);
                depends.pop();
            }
        }
    }

    public prepare_in_map(resource, entitys: PreparerEntity[]) {
        if (resource in this.map) {
            for (let o_name in this.map[resource].objects) {
                this.prepare_resource(resource, o_name, [], entitys);
            }
        }
    }

    public create_preparer_entities(): PreparerEntity[] {
        let ret: PreparerEntity[] = [];
        for (let resource of topo_sort_resource()) {
            this.prepare_in_tree(resource, ret, this.root, []);
            this.prepare_in_map(resource, ret);
        }
        return ret;

    }
    private remove_map_resource(class_name: string, object_name: string) {
        if (class_name in this.map && object_name in this.map[class_name].objects) {
            this.map[class_name].objects.delete(object_name);
        }
    }

    public add_tree_resource(class_name: string, object_name: string, parent_object: ResourceObject): ResourceObject {
        let resources: Map<string, ResourceClass> = parent_object ? parent_object.sub_resources : this.root;

        if (!(class_name in resources)) {
            resources[class_name] = new ResourceClass(class_name);
        }

        if (!(object_name in resources[class_name].objects)) {
            resources[class_name].objects[object_name] = new ResourceObject(object_name, class_name);
        }

        this.remove_map_resource(class_name, object_name);
        return resources[class_name].objects[object_name];
    }

    public find_tree_resource(class_name: string, object_name: string, root: Map<string, ResourceClass>): ResourceObject {
        if (class_name in root && object_name in root[class_name].objects) {
            return root[class_name].objects[object_name];
        }
        for (let c in root) {
            for (let o in root[c].objects) {
                let ret = this.find_tree_resource(class_name, object_name, root[c].objects[o].sub_resources);
                if (ret) return ret;
            }
        }
        return null;
    }

    public add_map_resource(class_name: string, object_name: string): ResourceObject {
        let resource_object = this.find_tree_resource(class_name, object_name, this.root);
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

    private is_resource(language): string | null {
        for (let resource in resource_languages) {
            if (resource_languages[resource].indexOf(language) > -1) {
                return resource;
            }
        }
        return null;
    }

    public add_endpoint_resource(endpoint: any) {
        if (typeof endpoint !== 'string') return endpoint;

        let nodes = endpoint.split('/');
        if (nodes.length < 3 || nodes[0].length > 0 || nodes[1].toLowerCase() != SUBSCRIPTIONS) {
            return endpoint;
        }
        nodes[2] = `{${ResourcePool.KEY_SUBSCRIPTIONID}}`;
        this.use_subscription = true;
        let i = 3;
        let resource_object: ResourceObject = null;
        while (i < (nodes.length - 1)) {
            const resource = this.is_resource(nodes[i]);
            if (resource) {
                resource_object = this.add_tree_resource(resource, nodes[i + 1], resource_object);
                nodes[i + 1] = resource_object.placeholder;
            }
            i += 2;
        }
        return nodes.join('/');
    }

    public add_param_resource(param_name: string, param_value: string): string {
        if (param_name.startsWith('--')) {
            param_name = param_name.substr(2);
        }
        let resource = this.is_resource(param_name);
        if (!resource) {
            return param_value;
        }
        let resource_object = this.add_map_resource(param_name, param_value);
        if (resource_object) {
            return resource_object.placeholder;
        }
        else {
            return param_value;
        }
    }

    public add_resources_info(resources: object) {
        for (let class_name in resources) {
            resource_class_keys[class_name] = class_name; // TODO: brief key for internal resources
            resource_languages[class_name] = resources[class_name];
        }
    } 
}

export function generate_resource_files(filename: string): string[] {
    let src_folder = path.join(`${__dirname}`, '..', '..', '..', 'src', 'plugins', 'azgenerator', 'resources');
    return ReadFile(path.join(src_folder, filename)).split(/\r\n|\n/);
} 
