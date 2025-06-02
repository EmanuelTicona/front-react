export interface EventDetail {
    id: number;
    event_id: number;
    problem_id: string;
    event_time: string;
    ci: string;
    class: string;
    status: string;
    state: string;
    deduplication_key: string;
    category_error: string;
    created_at: string;
}