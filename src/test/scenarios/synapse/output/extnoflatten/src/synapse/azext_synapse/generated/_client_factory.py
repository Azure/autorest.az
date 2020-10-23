# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------


def cf_synapse_cl(cli_ctx, *_):
    from azure.cli.core.commands.client_factory import get_mgmt_service_client
    from ..vendored_sdks.synapse import SynapseManagementClient
    return get_mgmt_service_client(cli_ctx,
                                   SynapseManagementClient)


def cf_big_data_pool(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).big_data_pools


def cf_operation(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).operations


def cf_ip_firewall_rule(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).ip_firewall_rules


def cf_sqlpool(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pools


def cf_sqlpool_metadata_sync_config(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_metadata_sync_configs


def cf_sqlpool_operation_result(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_operation_results


def cf_sqlpool_geo_backup_policy(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_geo_backup_policies


def cf_sqlpool_data_warehouse_user_activity(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_data_warehouse_user_activities


def cf_sqlpool_restore_point(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_restore_points


def cf_sqlpool_replication_link(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_replication_links


def cf_sqlpool_transparent_data_encryption(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_transparent_data_encryptions


def cf_sqlpool_blob_auditing_policy(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_blob_auditing_policies


def cf_sqlpool_operation(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_operations


def cf_sqlpool_usage(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_usages


def cf_sqlpool_sensitivity_label(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_sensitivity_labels


def cf_sqlpool_schema(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_schemas


def cf_sqlpool_table(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_tables


def cf_sqlpool_table_column(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_table_columns


def cf_sqlpool_connection_policy(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_connection_policies


def cf_sqlpool_vulnerability_assessment(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_vulnerability_assessments


def cf_sqlpool_vulnerability_assessment_scan(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_vulnerability_assessment_scans


def cf_sqlpool_security_alert_policy(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_security_alert_policies


def cf_sqlpool_vulnerability_assessment_rule_baseline(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).sql_pool_vulnerability_assessment_rule_baselines


def cf_workspace(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).workspaces


def cf_workspace_aadadmin(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).workspace_aad_admins


def cf_workspace_managed_identity_sqlcontrol_setting(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).workspace_managed_identity_sql_control_settings


def cf_integration_runtime(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtimes


def cf_integration_runtime_node_ip_address(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_node_ip_address


def cf_integration_runtime_object_metadata(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_object_metadata


def cf_integration_runtime_node(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_nodes


def cf_integration_runtime_credentials(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_credentials


def cf_integration_runtime_connection_info(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_connection_infos


def cf_integration_runtime_auth_key(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_auth_keys


def cf_integration_runtime_monitoring_data(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_monitoring_data


def cf_integration_runtime_status(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).integration_runtime_status


def cf_private_link_resource(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).private_link_resources


def cf_private_endpoint_connection(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).private_endpoint_connections


def cf_private_link_hub(cli_ctx, *_):
    return cf_synapse_cl(cli_ctx).private_link_hubs
