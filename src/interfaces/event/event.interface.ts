export interface Event {
    id: number;
    alert_id: number;
    alertgroup: string;
    created_at: string;
    category_error: string;
    check: string;
    host: string;
    hostgroups: string;
    implementation: string;
    ip_monitoring: string;
    service_desc: string;
    status: string;
    summary: string;
    sys_class_name: string;
    type: string;
    payload: string;
}