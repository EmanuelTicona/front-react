import axios from "axios";
import { API_URL } from "../services";
import { getAuthorizationHeaders } from "../utils/authorization";
import { User } from "../interfaces/user/user.interface";


export const user = async (): Promise<User> => {
    const headers = getAuthorizationHeaders();
    const response = await axios.get(API_URL + 'user/me/', { headers });
    return response.data;
};