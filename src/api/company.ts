import axios from "axios";
import { API_URL } from "../services";
import { Company } from "../interfaces/company/company.interface";

export const getCompanies = async (): Promise<Company[]> => {
    const response = await axios.get(API_URL + 'api/data/companies');
    return response.data;
};

export const companyById = async (id: number): Promise<Company[]> => {
    const response = await axios.get(API_URL + 'api/data/company/' + id);
    const company = response.data?.data ? [response.data.data] : [];
    return company;
};

export const createCompany = async (company: Partial<Company>): Promise<Company> => {
    const response = await axios.post(API_URL + 'api/data/companies', company);
    return response.data;
};

export const updateCompany = async (id: number, updatedCompany: Partial<Company>): Promise<Company> => {
    const response = await axios.put(API_URL + 'api/data/company/' + id, updatedCompany);
    return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
    await axios.delete(API_URL + `api/data/company/${id}`);
};