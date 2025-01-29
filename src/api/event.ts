import axios from "axios";
import { API_URL } from "../services";
import { Event } from "../interfaces/event/event.interface";

export const event = async (): Promise<Event[]> => {
    const response = await axios.get(API_URL + 'api/data/events');
    return response.data;
};

export const eventByAlertId = async (id: number): Promise<Event[]> => {
    const response = await axios.get(API_URL + 'api/data/events/' + id);
    const events = response.data?.data ?? [];
    return events;
};