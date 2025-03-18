export interface Implementation {
    id: number;
    integration_id: number;
    company_id: number;
    name: string;
    service_name: string;
    status: string;
    group_field: string;
    url: string;
    token: string;
    structure_data: string;
}

export interface CreateWebhookData {
    webhook_name: string;
    integration_id: number;
    name: string;
    company_id: number;
}