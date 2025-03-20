import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanies, companyById, addStructure, editStructure, deleteStructure } from "../api/company";

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

// Hook para agregar una estructura
export const useAddStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, file }: { companyId: number; file: File }) =>
      addStructure(companyId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-repo'] });
    },
  });
};

// Hook para editar una estructura
export const useEditStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, file }: { companyId: number; file: File }) =>
      editStructure(companyId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-repo'] });
    },
  });
};

// Hook para eliminar una estructura
export const useDeleteStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: number) => deleteStructure(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-repo'] });
    },
  });
};