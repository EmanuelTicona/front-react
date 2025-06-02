import { CorrelationKey } from './../interfaces/key_correlation/key_correlation.interface';
import axios from "axios";
import { API_URL } from "../services";

export const getCorrelationKeys = async (): Promise<CorrelationKey[]> => {
    const response = await axios.get(API_URL + 'api/data/correlation_keys');
    return response.data;
};