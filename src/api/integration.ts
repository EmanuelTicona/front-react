import axios from "axios";
import { API_URL } from "../services";
import { Integration } from "../interfaces/integration/integration.interface";

export const integration = async (): Promise<Integration[]> => {
    const response = await axios.get(API_URL + 'api/data/integrations');
    return response.data;
};

export const integrationById = async (id: number): Promise<Integration[]> => {
    const response = await axios.get(API_URL + 'api/data/integration/' + id);
    const integration = response.data?.data ? [response.data.data] : [];
    return integration;
};

export const addIntegration = async (newIntegration: Omit<Integration, 'id'>): Promise<Integration> => {
    const response = await axios.post(API_URL + 'api/data/integrations', newIntegration);
    return response.data;
};

export const editIntegration = async (id: number, updatedIntegration: Partial<Integration>): Promise<Integration> => {
    const response = await axios.put(API_URL + 'api/data/integrations/' + id, updatedIntegration);
    return response.data;
};

export const deleteIntegration = async (id: number): Promise<void> => {
    await axios.delete(API_URL + 'api/data/integrations/' + id);
};

// Función para agregar estructura
export const addStructure = async (integrationId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file); // Asegúrate de que el backend espere un campo llamado "file"

    await axios.post(API_URL + `api/data/add_structure/${integrationId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Importante para enviar archivos
        },
    });
};

// Función para eliminar estructura
export const deleteStructure = async (integrationId: number): Promise<void> => {
    await axios.delete(API_URL + `api/data/delete_structure/${integrationId}`);
};

// Función para editar estructura
export const editStructure = async (integrationId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file); // Asegúrate de que el backend espere un campo llamado "file"

    await axios.put(API_URL + `api/data/edit_structure/${integrationId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Importante para enviar archivos
        },
    });
};