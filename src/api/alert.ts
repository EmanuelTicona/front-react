import axios from "axios";
import { API_URL } from "../services";
import { Alert } from "../interfaces/alert/alert.interface";

export const alert = async (): Promise<Alert[]> => {
    try {
        const response = await axios.get(API_URL + 'api/data/alerts');
        console.log('API Response:', response.data); // Add this to check what's being returned
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};