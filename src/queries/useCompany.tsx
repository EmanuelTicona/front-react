import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api/company";

export const useCompaniesList = () => {
    return useQuery({
        queryKey: ['companies-list'],
        queryFn: getCompanies,
    });
};