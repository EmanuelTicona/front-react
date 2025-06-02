import { CiCompany } from './../interfaces/ci/ci.interface';
import axios from "axios";
import { API_URL } from "../services";

export const getCis = async (): Promise<CiCompany[]> => {
    const response = await axios.get(API_URL + 'api/data/cis');
    return response.data;
};