export interface Incident {
    id: number;
    external_id: string;
    ci: string;
    class: string;
    problem_id: string;
    alert_count: number;
    state: string;
    start_time: string;
    end_time: string;
    update_time: number;
    reopened_time: string;
    created_at: string;
}