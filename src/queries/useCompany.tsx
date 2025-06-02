import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanies, companyById, createCompany, updateCompany, deleteCompany } from "../api/company";


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

export const useAddCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-list'] });
    },
  });
};

export const useEditCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedCompany }: { id: number; updatedCompany: Partial<Company> }) =>
      updateCompany(id, updatedCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-list'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-list'] });
    },
  });
};