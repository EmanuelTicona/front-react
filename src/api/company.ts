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