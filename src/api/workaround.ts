import axios from "axios";
import { API_URL } from "../services";
import { WorkaroundList, WorkaroundFlow } from "../interfaces/workaround/workaround.interface";

// Función para obtener todos los workarounds
export const getWorkarounds = async (empresa?: string): Promise<WorkaroundList[]> => {
    const response = await axios.get(API_URL + 'api/workaround/list', {
        params: { empresa }, // Pasar el parámetro empresa si está definido
    });
    return response.data.data; // Asumiendo que el backend devuelve { success: true, data: [...] }
};

// Función para obtener los flows de un workaround por su ID
export const getWorkaroundFlowsById = async (workaroundId: number): Promise<WorkaroundFlow[]> => {
    const response = await axios.get(API_URL + `api/workaround/flow/${workaroundId}`);
    return response.data.data; // Asumiendo que el backend devuelve { success: true, data: [...] }
};

// Función para crear un nuevo workaround
export const createWorkaround = async (workaroundData: Omit<WorkaroundList, 'id' | 'create_time'>): Promise<WorkaroundList> => {
    const response = await axios.post(API_URL + 'api/workaround/list', workaroundData);
    return response.data.data; // Asumiendo que el backend devuelve { success: true, data: {...} }
};

export const addWorkaroundFlow = async (newFlow: Omit<WorkaroundFlow, 'id' | 'create_time'>): Promise<WorkaroundFlow> => {
    const response = await axios.post(API_URL + 'api/workaround/flow', newFlow);
    return response.data.data; // Asumiendo que el backend devuelve { success: true, data: {...} }
};

// Función para actualizar el orden de los pasos de flujo
export const updateFlowSteps = async (workaroundId: number, steps: { id: number; nro_paso: number }[]): Promise<any> => {
    const response = await axios.put(API_URL + `api/workaround/edit_flow/${workaroundId}`, { steps });
    return response.data; // Asumiendo que el backend devuelve { success: true, data: [...] }
};

export const getPipelines = async (): Promise<any> => {
    const response = await axios.get(API_URL + 'api/workaround/pipelines');
    return response.data.data; // Asumiendo que el backend devuelve { success: true, data: [...] }
};