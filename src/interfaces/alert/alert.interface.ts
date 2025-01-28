export interface Alert {
    id: number;
    host: string;
    sys_class_name: string;
    created_at: string;
    incident_id: number;
    last_event_date: string;
    num_events: number;
    dedupe_key: string;
    resolved_at: string;
    state: string;
    status: string;
    summary: string;
}