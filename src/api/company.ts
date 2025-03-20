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

// Función para agregar estructura
export const addStructure = async (companyId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file); // Asegúrate de que el backend espere un campo llamado "file"

    await axios.post(API_URL + `api/data/add_standard_structure/${companyId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Importante para enviar archivos
        },
    });
};

// Función para eliminar estructura
export const deleteStructure = async (companyId: number): Promise<void> => {
    await axios.delete(API_URL + `api/data/delete_standard_structure/${companyId}`);
};

// Función para editar estructura
export const editStructure = async (companyId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file); // Asegúrate de que el backend espere un campo llamado "file"

    await axios.put(API_URL + `api/data/edit_standard_structure/${companyId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Importante para enviar archivos
        },
    });
};