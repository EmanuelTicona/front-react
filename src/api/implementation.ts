import { Implementation, CreateWebhookData } from './../interfaces/implementation/implementation.interface';
import { GroupMapping } from './../interfaces/group/group.interface';
import axios from "axios";
import { API_URL } from "../services";

// Obtener todas las implementaciones
export const getImplementations = async (): Promise<Implementation[]> => {
    const response = await axios.get(API_URL + 'api/data/implementation');
    return response.data;
};

// Editar el campo group_field de una implementación
export const editImplementationGroupField = async (id: number, groupField: string): Promise<Implementation> => {
    const response = await axios.put(API_URL + `api/data/implementation/${id}/group_field`, { group_field: groupField });
    return response.data;
};

export const createWebhook = async (data: CreateWebhookData): Promise<any> => {
    const response = await axios.post(API_URL + 'api/webhook/create', data);
    return response.data;
};

export const deleteWebhook = async (webhookName: string): Promise<any> => {
    const response = await axios.post(API_URL + 'api/webhook/delete', { webhook_name: webhookName });
    return response.data;
};

export const getGroupMappings = async (): Promise<GroupMapping[]> => {
    const response = await axios.post(API_URL + 'api/data/group_mapping');
    return response.data;
};

// Agregar un group_mapping
export const addGroupMapping = async (implementationId: number, data: { identifier: string; group_id: string }): Promise<GroupMapping> => {
    const response = await axios.post(API_URL + `api/data/group_mapping/${implementationId}`, data);
    return response.data;
};

export const deleteGroupMapping = async (id: number): Promise<void> => {
    await axios.delete(API_URL + `api/data/group_mapping/${id}`);
};