import axios from "axios";
import { API_URL } from "../services";
import { Event } from "../interfaces/event/event.interface";

export const event = async (): Promise<Event[]> => {
    try {
        const response = await axios.get(API_URL + 'api/data/events');
        console.log('API Response:', response.data); // Add this to check what's being returned
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};