import { CodeModel, codeModelSchema } from '@azure-tools/codemodel';
import { Session, startSession, Host } from '@azure-tools/autorest-extension-base';
import { serialize, deserialize } from '@azure-tools/codegen';
import { values, items, length, Dictionary } from '@azure-tools/linq';

class AzNamer {
  codeModel: CodeModel

  constructor(protected session: Session<CodeModel>) {
    this.codeModel = session.model;
  }

  async init() {
    // any configuration if necessary
    return this;
  }

  process() {
 
    let extensionName = this.session.getValue('az-name');

    for (const operationGroup of values(this.codeModel.operationGroups)) {
        operationGroup.language['az'] = operationGroup.language['cli'];
        let operationGroupName = extensionName + " " + operationGroup.language['az'].name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        operationGroup.language['az']['command'] = operationGroupName;

        for (const operation of values (operationGroup.operations)) {
            operation.language['az'] = operation.language['cli'];
            let operationName = operationGroupName + " " + operation.language['az'].name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            operation.language['az']['command'] = operationName;

            for (const parameter of values (operation.request.parameters)) {
                parameter.language['az'] = parameter.language['cli'];
                parameter.language['az'].name = parameter.language['az'].name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            }
        }
    }
    return this.codeModel;
  }
}

export async function processRequest(host: Host) {
    const debug = await host.GetValue('debug') || false;

    try {
        const session = await startSession<CodeModel>(host, {}, codeModelSchema);
        const plugin = await new AzNamer(session).init();
        const result = plugin.process();
        host.WriteFile('aznamer-temp-output', serialize(result))
    } catch (E) {
        if(debug) {
            console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
        }
        throw E;
    }

}