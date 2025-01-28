export interface Incident {
    id: number;
    host: string;
    sys_class_name: string;
    created_at: string;
    state: string;
    hostgroups: string;
    updated_at: string;
    resolved_at: string;
    reopened_at: string;
    num_alerts: number;
    implementation: string;
    external_id: string;
    assigned_group: string;
    work_notes: string;
}