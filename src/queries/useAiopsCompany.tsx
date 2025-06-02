import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAiopsCompanies, 
  createAiopsCompany, 
  updateAiopsCompany, 
  softDeleteAiopsCompany,
  UpdateAiopsCompanyParams,
  getGroupMappings, addGroupMapping, deleteGroupMapping
} from "../api/aiops_company";

export const useAiopsCompaniesList = () => {
  return useQuery({
    queryKey: ['aiops-companies-list'],
    queryFn: getAiopsCompanies,
  });
};

export const useAddAiopsCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAiopsCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiops-companies-list'] });
    },
  });
};

export const useUpdateAiopsCompany = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (params: UpdateAiopsCompanyParams) => updateAiopsCompany(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['aiops-companies-list'] });
      },
    });
  };
  

export const useSoftDeleteAiopsCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteAiopsCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiops-companies-list'] });
    },
  });
};

// Hook para obtener group_mapping
export const useGroupMappings = () => {
    return useQuery({
        queryKey: ['group-mappings'],
        queryFn: getGroupMappings,
    });
};

// Hook para agregar un group_mapping
export const useAddGroupMapping = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ aiops_companyId, data }: { aiops_companyId: number; data: { identifier: string; group_id: string } }) =>
            addGroupMapping(aiops_companyId, data),
        onSuccess: () => {
            // Invalida la caché de group_mapping para refrescar los datos
            queryClient.invalidateQueries({ queryKey: ['group-mappings'] });
        },
    });
};

export const useDeleteGroupMapping = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteGroupMapping(id),
        onSuccess: () => {
            // Invalida la caché de group_mappings para refrescar los datos
            queryClient.invalidateQueries({ queryKey: ['group-mappings'] });
        },
    });
};