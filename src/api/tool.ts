import axios from "axios";
import { API_URL } from "../services";
import { Tool } from "../interfaces/tool/tool.interface";

export const getTools = async (): Promise<Tool[]> => {
    const response = await axios.get(API_URL + 'api/data/tools');
    return response.data;
};