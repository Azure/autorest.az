/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { CodeModelAz } from '../../codemodel/CodeModelAz';
import { HeaderGenerator } from '../Header';
import { isNullOrUndefined } from '../../../utils/helper';

export function GenerateAzureCliClientFactory(model: CodeModelAz): string[] {
    const header: HeaderGenerator = new HeaderGenerator();
    const { extensionHandler, configHandler } = this.model.GetHandler();
    const output: string[] = header.getLines();
    model.SelectFirstCommandGroup(true);
    output.push('');
    output.push('');
    output.push('def cf_' + extensionHandler.Extension_NameUnderscored + '_cl(cli_ctx, *_):');
    output.push(
        '    from ' +
            configHandler.CliCoreLib +
            '.commands.client_factory import get_mgmt_service_client',
    );
    output.push(
        '    from ' + configHandler.GetPythonNamespace() + ' import ' + model.PythonMgmtClient,
    );

    if (!isNullOrUndefined(extensionHandler.Extension_ClientAuthenticationPolicy)) {
        output.push(
            '    from azure.core.pipeline.policies import ' +
                extensionHandler.Extension_ClientAuthenticationPolicy,
        );
    }

    // Start handle arguments
    output.push('    return get_mgmt_service_client(cli_ctx,');
    output.push('                                   ' + model.PythonMgmtClient);
    if (!isNullOrUndefined(extensionHandler.Extension_ClientSubscriptionBound)) {
        output.push(output.pop() + ',');
        output.push(
            '                                   subscription_bound=' +
                (extensionHandler.Extension_ClientSubscriptionBound ? 'True' : 'False'),
        );
    }
    if (!isNullOrUndefined(extensionHandler.Extension_ClientBaseUrlBound)) {
        output.push(output.pop() + ',');
        output.push(
            '                                   base_url_bound=' +
                (extensionHandler.Extension_ClientBaseUrlBound ? 'True' : 'False'),
        );
    }
    if (!isNullOrUndefined(extensionHandler.Extension_ClientAuthenticationPolicy)) {
        output.push(output.pop() + ',');
        output.push(
            '                                   authentication_policy=' +
                extensionHandler.Extension_ClientAuthenticationPolicy +
                '()',
        );
    }
    output.push(output.pop() + ')');
    // End

    if (model.SelectFirstCommandGroup(true)) {
        do {
            if (model.GetModuleOperationName() !== '') {
                output.push('');
                output.push('');

                output.push('def cf_' + model.GetModuleOperationName() + '(cli_ctx, *_):');
                output.push(
                    '    return cf_' +
                        extensionHandler.Extension_NameUnderscored +
                        '_cl(cli_ctx).' +
                        model.GetModuleOperationNamePython(),
                );
            }
        } while (model.SelectNextCommandGroup(true));
    }

    output.push('');

    return output;
}
