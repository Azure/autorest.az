# Manual Customizations

## Overriding / Adding Commands in a Command Group

In order to override command group, you need to add **commands.py** file in **manual** folder.

Content of the file should look as follows:

    # --------------------------------------------------------------------------------------------
    # Copyright (c) Microsoft Corporation. All rights reserved.
    # Licensed under the MIT License. See License.txt in the project root for license information.
    # --------------------------------------------------------------------------------------------

    from azure.cli.core.commands import CliCommandType


    def load_command_table(self, _):

        from ..generated._client_factory import cf_subscription
        account_subscription = CliCommandType(
            operations_tmpl='azext_account.vendored_sdks.subscription.operations._subscription_operations#SubscriptionOperations.{}',
            client_factory=cf_subscription)

        with self.command_group('account subscription', account_subscription, client_factory=cf_subscription) as g:
            g.custom_command('mycommand', 'account_subscription_mycommand')

Following modifications can be done:
- creating entire new command group
- adding new commands to generated command group
- overwriting generated commands

Note: creating new commands will require creating custom implementation (**custom.py** file)

## Overriding / Manually Adding New Parameters

In order to override or add any parameters, you need to add **_params.py** file in **manual** folder.

File should look as follows:

    # --------------------------------------------------------------------------------------------
    # Copyright (c) Microsoft Corporation. All rights reserved.
    # Licensed under the MIT License. See License.txt in the project root for license information.
    # --------------------------------------------------------------------------------------------

    def load_arguments(self, _):

        with self.argument_context('account subscription create-subscription') as c:
            c.argument('billing_account_name', help='Custom parameter description')

Using this method following modifications can be done:
- adding new parameters to existing commands
- changing any properties of existing parameters

Note that in case of new parameters, custom function associated with the command will have to be updated accordingly.

## Overriding / Adding Custom Functions

In order to override or add any parameters, you need to add **custom.py** file in **manual** folder.

    # --------------------------------------------------------------------------------------------
    # Copyright (c) Microsoft Corporation. All rights reserved.
    # Licensed under the MIT License. See License.txt in the project root for license information.
    # --------------------------------------------------------------------------------------------

    def account_subscription_my_command(cmd, client,subscription_id,
                                        body_subscription_name=None):
        ... your implementation...

Place all the functions you want to override, or new custom functions in this file.

## Overriding Actions

It's possible to override actions or add any new actions in **actions.py** file in **manual** folder.

## Overriding Version

If you want to override version. you just need to put **version.py** in the manual folder. and have this line in it.  
```
VERSION = "your-actual-version"
```
