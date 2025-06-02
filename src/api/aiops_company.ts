import axios from "axios";
import { API_URL } from "../services";
import { AiopsCompany } from "../interfaces/aiops_company/aiops_company.interface";
import { GroupMapping } from './../interfaces/group/group.interface';

export interface UpdateAiopsCompanyParams {
    id: number;
    company_id?: number;
    itsm_tool_id?: number | null;
    default_group_id?: number | null;
    default_ci_id?: number | null;
}

export const getAiopsCompanies = async (): Promise<AiopsCompany[]> => {
    const response = await axios.get(API_URL + 'api/data/aiops_companies');
    return response.data;
};

export const createAiopsCompany = async (company: Omit<AiopsCompany, 'id'>): Promise<AiopsCompany> => {
    const response = await axios.post(API_URL + 'api/data/aiops_company', company);
    return response.data;
};

export const updateAiopsCompany = async ({
    id,
    company_id,
    itsm_tool_id,
    default_group_id,
    default_ci_id
}: UpdateAiopsCompanyParams): Promise<{
    message: string;
    aiops_company_id: number;
    updated_fields: Partial<AiopsCompany>;
}> => {
    const response = await axios.put(API_URL + `api/data/aiops_company/${id}`, {
        company_id,
        itsm_tool_id,
        default_group_id,
        default_ci_id
    });
    return response.data;
};

export const softDeleteAiopsCompany = async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(API_URL + `api/data/aiops_company/${id}`);
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