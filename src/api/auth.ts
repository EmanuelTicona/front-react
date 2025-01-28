import axios from "axios";
import { API_URL } from "../services";
import { UserResponse } from "../interfaces/user/user.interface";
import { LoginRequest } from "../interfaces/auth/auth.interface";

export const login = async (credetials: LoginRequest): Promise<UserResponse>  => {
    const response = await axios.post(API_URL +'account/signin/admin/', credetials);
    return response.data;
};