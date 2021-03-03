import { CodeModel, codeModelSchema, Language } from '@azure-tools/codemodel';
import { Session, startSession, Host, Channel } from '@autorest/extension-base';
import { serialize } from '@azure-tools/codegen';
import { values } from '@azure-tools/linq';
import { Capitalize, changeCamelToDash, isNullOrUndefined } from './utils/helper';
import { CodeGenConstants, EXCLUDED_PARAMS, AzConfiguration } from './utils/models';

export class AzNamer {
    codeModel: CodeModel;

    constructor(protected session: Session<CodeModel>) {
        this.codeModel = session.model;
    }

    public methodMap(operationNameOri: string, httpProtocol: string) {
        let operationName = operationNameOri.toLowerCase();
        httpProtocol = httpProtocol.toLowerCase();

        let subOperationGroupName = '';
        let ons: Array<string> = [];
        if (operationNameOri.indexOf('#') > -1) {
            ons = operationNameOri.split('#');
            if (ons && ons.length === 2) {
                subOperationGroupName = changeCamelToDash(ons[1]);
                operationName = ons[0].toLowerCase();
            }
        }
        function commandNameMap(type: string): string {
            // for list scenarios like kusto, if there's list, listbyresourcegroup, listsku, listskubyresource
            // we should divide it into two groups
            // group list contains list and listbyresourcegroup
            // group listsku contains listsku and listskubyresource
            // a temporary way is to treat the part after 'by' as parameter distinguish part and the part before by as command.
            // the split is valid only the By is not first word and the letter before By is capital and the letter after By is lowercase
            // const regex = /^(?<$(type)>$(type)[a-zA-Z0-9]*)(?<by>By[A-Z].*)$/;
            const regexStr =
                '^(?<' + type + '>' + Capitalize(type) + '[a-zA-Z0-9]*)(?<by>By[A-Z].*)$';
            const regex = new RegExp(regexStr);
            const groups = operationNameOri.match(regex);
            let mtype = type;
            if (groups && groups.length > 2) {
                mtype = changeCamelToDash(groups[1]);
            } else {
                mtype = changeCamelToDash(operationNameOri);
            }
            return subOperationGroupName === '' ? mtype : subOperationGroupName + ' ' + mtype;
        }
        let commandName = '';
        if (operationName.startsWith('create') && httpProtocol === 'put') {
            commandName = commandNameMap('create');
            if (commandName === 'create-or-update') {
                commandName = 'create';
            }
        } else if (
            operationName === 'update' &&
            (httpProtocol === 'put' || httpProtocol === 'patch')
        ) {
            commandName = commandNameMap('update');
        } else if (operationName.startsWith('get') && httpProtocol === 'get') {
            commandName = commandNameMap('get').replace(/^get/i, 'show');
        } else if (operationName.startsWith('list') && httpProtocol === 'get') {
            commandName = commandNameMap('list');
        } else if (operationName.startsWith('delete') && httpProtocol === 'delete') {
            commandName = commandNameMap('delete');
        }
        if (subOperationGroupName !== '') {
            commandName = subOperationGroupName + ' ' + changeCamelToDash(ons[0]);
        }
        if (commandName !== '') {
            return commandName;
        }
        return changeCamelToDash(operationNameOri);
    }

    async process() {
        await this.processOperationGroup();
        this.getAzName(this.codeModel);
        this.processGlobalParam();
        this.processSchemas();
        return this.codeModel;
    }

    getAzName(obj) {
        if (obj.language['az']) {
            return;
        }
        obj.language['az'] = new Language();
        obj.language['az'].name = obj.language['cli']?.name
            ? obj.language['cli'].name
            : obj.language.python.name;
        obj.language['az'].name = changeCamelToDash(obj.language['az'].name);
        obj.language['az'].mapsto = obj.language['az'].name.replace(/-/g, '_');
        obj.language['az'].description = obj.language['cli']
            ? obj.language['cli'].description
            : obj.language.python.description;
        if (!isNullOrUndefined(obj.language['cli'].id_part)) {
            obj.language['az'].id_part = obj.language['cli'].id_part;
        }
    }

    processGlobalParam() {
        for (const para of values(this.codeModel.globalParameters)) {
            this.getAzName(para);
        }
    }

    processSchemas() {
        const schemas = this.codeModel.schemas;

        for (const obj of values(schemas.objects)) {
            this.getAzName(obj);
            for (const property of values(obj.properties)) {
                this.getAzName(property);
            }
        }

        for (const dict of values(schemas.dictionaries)) {
            this.getAzName(dict);
            this.getAzName(dict.elementType);
        }

        for (const enumn of values(schemas.choices)) {
            this.getAzName(enumn);
            for (const item of values(enumn.choices)) {
                this.getAzName(item);
            }
        }

        for (const enumn of values(schemas.sealedChoices)) {
            this.getAzName(enumn);
            for (const item of values(enumn.choices)) {
                this.getAzName(item);
            }
        }

        for (const arr of values(schemas.arrays)) {
            this.getAzName(arr);
            this.getAzName(arr.elementType);
        }

        for (const cons of values(schemas.constants)) {
            this.getAzName(cons);
        }

        for (const num of values(schemas.numbers)) {
            this.getAzName(num);
        }

        for (const str of values(schemas.strings)) {
            this.getAzName(str);
        }
    }

    addAttributes(param: any, isSchema: boolean, key: string) {
        let obj: any = param;
        if (isSchema) {
            obj = param.schema;
        }
        if (isNullOrUndefined(obj.language?.['cli'])) {
            return false;
        }
        if (!isNullOrUndefined(obj.language['cli'][key])) {
            if (isNullOrUndefined(param.language['az'][key])) {
                param.language['az'][key] = [];
            }
            if (typeof obj.language['cli'][key] === 'string') {
                if (EXCLUDED_PARAMS.indexOf(obj.language['cli'][key]) > -1) {
                    if (key === 'alias') {
                        obj.language['cli'][key] = 'gen_' + obj.language['cli'][key];
                    }
                }
                param.language['az'][key].push(changeCamelToDash(obj.language['cli'][key]));
            } else if (Array.isArray(obj.language['cli'][key])) {
                for (let item of obj.language['cli'][key]) {
                    if (key === 'alias' && EXCLUDED_PARAMS.indexOf(item) > -1) {
                        item = 'gen_' + item;
                    }
                    param.language['az'][key].push(changeCamelToDash(item));
                }
            }
        }
    }

    async processOperationGroup() {
        const azSettings = AzConfiguration.getValue(CodeGenConstants.az);
        let extensionName = azSettings[CodeGenConstants.extensions];
        // console.error(extensionName);
        if (extensionName === '' || extensionName === undefined) {
            this.session.message({
                Channel: Channel.Error,
                Text:
                    'probably missing readme.az.md possible settings are:\naz:\n  extensions: managed-network\n  namespace: azure.mgmt.managednetwork\n  package-name: azure-mgmt-managednetwork\npython-sdk-output-folder: "$(output-folder)/src/managed-network/azext_managed_network/vendored_sdks/managed-network"\n',
            });
        }

        if (!isNullOrUndefined(azSettings[CodeGenConstants.parentExtension])) {
            extensionName =
                azSettings[CodeGenConstants.parentExtension].trim() + ' ' + extensionName.trim();
        }
        this.codeModel.operationGroups.forEach((operationGroup) => {
            let operationGroupName = '';
            let groupName;
            if (!isNullOrUndefined(operationGroup.language['cli'])) {
                operationGroup.language['az'] = new Language();
                operationGroup.language['az'].name = operationGroup.language['cli'].name;
                operationGroup.language['az'].description =
                    operationGroup.language['cli'].description;
                groupName = changeCamelToDash(operationGroup.language['az'].name);
                if (extensionName.endsWith(groupName)) {
                    operationGroupName = extensionName;
                } else {
                    operationGroupName = extensionName + ' ' + groupName;
                }
                operationGroup.language['az'].command = operationGroupName;
            }

            const operations = operationGroup.operations;
            operations.forEach((operation) => {
                let genericTargetSchema = null;
                if (operation.language['cli'].cliKey === 'Get') {
                    genericTargetSchema = operation.responses[0]['schema'];
                    operationGroup.language['az'].genericTargetSchema = genericTargetSchema;
                }
                operation.requests.forEach((request) => {
                    let operationName = '';
                    if (!isNullOrUndefined(operation.language['cli'])) {
                        operation.language['az'] = new Language();
                        const commandName = this.methodMap(
                            operation.language['cli'].name,
                            request.protocol.http.method,
                        );
                        operation.language['az'].name = commandName;
                        if (commandName === 'show') {
                            operationGroup.language['az'].hasShowCommand = true;
                        }
                        operation.language['az'].description =
                            operation.language['cli'].description;
                        if (operation.language['az'].name.indexOf(groupName) > -1) {
                            const regex = `-{0, 1}` + groupName + `-{0, 1}`;
                            operation.language['az'].name = operation.language['az'].name.replace(
                                regex,
                                '',
                            );
                        }
                        operationName =
                            operationGroupName +
                            ' ' +
                            changeCamelToDash(operation.language['az'].name);
                        operation.language['az'].command = operationName;
                        if (commandName.indexOf(' ') > -1) {
                            operation.language['az'].subCommandGroup =
                                operationGroupName + ' ' + commandName.split(' ')[0];
                        }
                        if (
                            operation.language['az'].command.endsWith(' update') &&
                            !isNullOrUndefined(
                                operation.extensions?.['cli-split-operation-original-operation'],
                            )
                        ) {
                            operation.language['az'].isSplitUpdate = true;
                        }
                    } else {
                        this.session.message({
                            Channel: Channel.Warning,
                            Text:
                                'OperationGroup ' +
                                operationGroup.language.default.name +
                                ' operation ' +
                                operation.language.default.name +
                                " doesn't have cli",
                        });
                    }
                    operation.parameters.forEach((parameter) => {
                        if (!isNullOrUndefined(parameter.language['cli'])) {
                            this.getAzName(parameter);
                            for (const k of ['alias', 'positionalKeys']) {
                                this.addAttributes(parameter, false, k);
                                this.addAttributes(parameter, true, k);
                            }
                            if (!isNullOrUndefined(parameter.language['cli'].m4FlattenedFrom)) {
                                for (const param of parameter.language['cli'].m4FlattenedFrom) {
                                    this.getAzName(param);
                                }
                            }
                        }
                    });
                    if (request.parameters) {
                        request.parameters.forEach((parameter) => {
                            if (!isNullOrUndefined(parameter.language['cli'])) {
                                this.getAzName(parameter);
                                for (const k of ['alias', 'positionalKeys']) {
                                    this.addAttributes(parameter, false, k);
                                    this.addAttributes(parameter, true, k);
                                }
                                if (!isNullOrUndefined(parameter.language['cli'].m4FlattenedFrom)) {
                                    for (const param of parameter.language['cli'].m4FlattenedFrom) {
                                        this.getAzName(param);
                                    }
                                }
                            }
                        });
                    }
                });
            });
            operations.forEach((operation) => {
                // if generic update exists, set the setter_arg_name in the original operation
                if (
                    operation.language['az'].isSplitUpdate &&
                    !isNullOrUndefined(operationGroup.language['az'].genericTargetSchema)
                ) {
                    for (let n = 0; n < operation.requests.length; n++) {
                        const request = operation.requests[n];
                        if (request.parameters) {
                            for (let m = 0; m < request.parameters.length; m++) {
                                const parameter = request.parameters[m];
                                if (
                                    parameter.schema ===
                                    operationGroup.language['az'].genericTargetSchema
                                ) {
                                    // Since the update is splited from the CreateOrUpdate the nameBaseParam of that parameter can't be null
                                    // The condition of a generic update exists are
                                    // 1. the parameter's schema equals to genericTargetSchema
                                    // 2. the parameter is not flattened in Python code model
                                    let lastGenericSetter = null;
                                    let genericSetter = null;
                                    // purely using cli-flattened isn't enough to determine whether only CLI has flattened it.
                                    if (
                                        !isNullOrUndefined(parameter['nameBaseParam']) &&
                                        !isNullOrUndefined(
                                            parameter['nameBaseParam'].language?.python,
                                        ) &&
                                        parameter?.language?.['cli']?.['cli-flattened']
                                    ) {
                                        operation.extensions[
                                            'cli-split-operation-original-operation'
                                        ].genericSetterParam = parameter['nameBaseParam'];
                                        genericSetter = parameter['nameBaseParam'];
                                        operation.extensions[
                                            'cli-split-operation-original-operation'
                                        ].genericPath = [];
                                        // If found any parameter doesn't have nameBaseParam or has nameBaseParam but don't have language Python, then this parameter is flattened from CLI not in Python.
                                        let onlyCliFlattened = false;
                                        m++;
                                        while (m < request.parameters.length) {
                                            const param = request.parameters[m];
                                            m++;
                                            // the original parameter which schema equals to genericTargetSchema must at most flatten out one generic setter param
                                            if (
                                                !isNullOrUndefined(lastGenericSetter) &&
                                                !isNullOrUndefined(param['nameBaseParam']) &&
                                                param['nameBaseParam'].originalParameter ===
                                                    lastGenericSetter
                                            ) {
                                                onlyCliFlattened = false;
                                                break;
                                            }
                                            if (
                                                !isNullOrUndefined(param['nameBaseParam']) &&
                                                !isNullOrUndefined(
                                                    param['nameBaseParam']?.language?.python,
                                                ) &&
                                                param?.language?.['cli']?.['cli-flattened']
                                            ) {
                                                operation.extensions[
                                                    'cli-split-operation-original-operation'
                                                ].genericSetterParam = param['nameBaseParam'];
                                                lastGenericSetter = genericSetter;
                                                genericSetter = param['nameBaseParam'];
                                                operation.extensions[
                                                    'cli-split-operation-original-operation'
                                                ].genericPath.push(
                                                    param['nameBaseParam']?.language?.python.name,
                                                );
                                                continue;
                                            }

                                            if (
                                                isNullOrUndefined(param['nameBaseParam']) ||
                                                (!isNullOrUndefined(param['nameBaseParam']) &&
                                                    isNullOrUndefined(
                                                        param['nameBaseParam']?.language?.python,
                                                    ))
                                            ) {
                                                onlyCliFlattened = true;
                                            }
                                        }
                                        if (!onlyCliFlattened) {
                                            operation.extensions[
                                                'cli-split-operation-original-operation'
                                            ].genericSetterParam = null;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}

export async function processRequest(host: Host) {
    const debug = AzConfiguration.getValue(CodeGenConstants.debug);
    // host.Message({Channel:Channel.Warning, Text:"in aznamer processRequest"});

    // console.error(extensionName);
    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = await new AzNamer(session);
        const result = await plugin.process();
        host.WriteFile('aznamer-temp-output.yaml', serialize(result));
    } catch (error) {
        if (debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(error)} ${error.stack}`);
        }
        throw error;
    }
}
