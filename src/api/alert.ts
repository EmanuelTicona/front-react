import axios from "axios";
import { API_URL } from "../services";
import { Alert } from "../interfaces/alert/alert.interface";

export const alert = async (): Promise<Alert[]> => {
    const response = await axios.get(API_URL + 'api/data/alerts');
    return response.data;
};