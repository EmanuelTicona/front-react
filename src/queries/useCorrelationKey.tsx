import { useQuery } from "@tanstack/react-query";
import { getCorrelationKeys } from "../api/key_correlation";


export const useCorrelationKeysList = () => {
    return useQuery({
        queryKey: ['correlation-keys-list'],
        queryFn: getCorrelationKeys,
    });
};