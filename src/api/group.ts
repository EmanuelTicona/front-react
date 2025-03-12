import axios from "axios";
import { API_URL } from "../services";
import { Group } from "../interfaces/group/group.interface";

export const getGroups = async (): Promise<Group[]> => {
    const response = await axios.get(API_URL + 'api/data/groups');
    return response.data;
};