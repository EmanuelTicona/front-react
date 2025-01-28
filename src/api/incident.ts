import axios from "axios";
import { API_URL } from "../services";
import { Incident } from "../interfaces/incident/incident.interface";

export const incident = async (): Promise<Incident[]> => {
    try {
        const response = await axios.get(API_URL + 'api/data/incidents');
        console.log('API Response:', response.data); // Add this to check what's being returned
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};