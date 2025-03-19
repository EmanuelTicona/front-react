import { useQuery } from "@tanstack/react-query";
import { getCompanies, companyById } from "../api/company";

export const useCompaniesList = () => {
    return useQuery({
        queryKey: ['companies-list'],
        queryFn: getCompanies,
    });
};

export const useCompanyById = (id: number) => {
  return useQuery({
    queryKey: ['company-by-id', id],
    queryFn: () => companyById(id),
    enabled: id > 0,
  });
};