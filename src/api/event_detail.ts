import axios from "axios";
import { API_URL } from "../services";
import { EventDetail } from "../interfaces/event/event_detail.interface";

export const eventDetail = async (): Promise<EventDetail[]> => {
    const response = await axios.get(API_URL + 'api/data/event_detail');
    return response.data;
};

export const eventDetailByAlertId = async (id: number): Promise<EventDetail[]> => {
    const response = await axios.get(API_URL + 'api/data/alerts/' + id + '/event_details');
    return response.data;
};