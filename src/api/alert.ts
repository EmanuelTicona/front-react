import axios from "axios";
import { API_URL } from "../services";
import { Alert } from "../interfaces/alert/alert.interface";

export const alert = async (): Promise<Alert[]> => {
    const response = await axios.get(API_URL + 'api/data/alerts');
    return response.data;
};

export const alertByIncidentId = async (id: number): Promise<Alert[]> => {
    const response = await axios.get(API_URL + 'api/data/alerts/' + id);
    const alerts = response.data?.data ?? [];
    return alerts;
};

export const alertById = async (id: number): Promise<Alert[]> => {
    const response = await axios.get(API_URL + 'api/data/alert/' + id);
    const alert = response.data?.data ? [response.data.data] : [];
    return alert;
};