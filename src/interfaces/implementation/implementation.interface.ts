export interface Implementation {
    id: number;
    integration_id: number;
    aiops_company_id: number;
    name: string;
    service_name: string;
    status: string;
    group_field: string;
    url: string;
    token: string;
    structure_data: string;
    flag_correlation: number;
}

export interface CreateWebhookData {
    webhook_name: string;
    integration_id: number;
    name: string;
    aiops_company_id: number;
}