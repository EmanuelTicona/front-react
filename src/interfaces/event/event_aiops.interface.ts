export interface EventAiops {
    id: number;
    problem_id: string;
    ci: string;
    class: string;
    status: string;
    state: string;
    deduplication_key: string;
    category_error: string;
    start_time: string;
    end_time: string;
    start_event_detail_id: number;
    end_event_detail_id: number;
    created_at: string;
    alert_id: number;
}