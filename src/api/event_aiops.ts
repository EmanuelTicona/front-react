import axios from "axios";
import { API_URL } from "../services";
import { EventAiops } from "../interfaces/event/event_aiops.interface";

export const eventAiops = async (): Promise<EventAiops[]> => {
    const response = await axios.get(API_URL + 'api/data/event_aiops');
    return response.data;
};

export const eventAiopsByAlertId = async (id: number): Promise<Event[]> => {
    const response = await axios.get(API_URL + 'api/data/event_aiops/' + id);
    const events = response.data?.data ?? [];
    return events;
};