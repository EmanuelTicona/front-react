export interface Alert {
    id: number;
    ci: string;
    class: string;
    error: string;
    problem_id: string;
    status: string;
    state: string;
    deduplication_key: string;
    start_time: string;
    end_time: string;
    update_time: string;
    created_at: string;
    incident_id: number;
}