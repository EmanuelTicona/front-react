import axios from "axios";
import { API_URL } from "../services";
import { Incident } from "../interfaces/incident/incident.interface";

export const incident = async (): Promise<Incident[]> => {
    const response = await axios.get(API_URL + 'api/data/incidents');
    return response.data;
};

export const incidentById = async (id: number): Promise<Incident[]> => {
    const response = await axios.get(API_URL + 'api/data/incident/' + id);
    const incident = response.data?.data ? [response.data.data] : [];
    return incident;
};