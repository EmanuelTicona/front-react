import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integration, integrationById, addIntegration, editIntegration, deleteIntegration, addStructure,
  deleteStructure,
  editStructure } from "../api/integration";
import { sortDataDesc } from "../utils/filtered";

export const useIntegrations = () => {
    const info = useQuery({
        queryKey: ['integrations-repo'],
        queryFn: integration,
        select: (data) => {
          return sortDataDesc(data)
        },
      });
    return info;
}

export const useIntegrationById = (id: number) => {
  return useQuery({
    queryKey: ['integration-by-id', id],
    queryFn: () => integrationById(id),
    enabled: id > 0,
  });
};

export const useAddIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
    },
  });
};

export const useEditIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedIntegration }: { id: number; updatedIntegration: Partial<Integration> }) =>
      editIntegration(id, updatedIntegration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
    },
  });
};

export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
    },
  });
};

// Hook para agregar una estructura
export const useAddStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ integrationId, file }: { integrationId: number; file: File }) =>
      addStructure(integrationId, file),
    onSuccess: () => {
      // Invalida la caché de las integraciones para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
    },
  });
};

// Hook para editar una estructura
export const useEditStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ integrationId, file }: { integrationId: number; file: File }) =>
      editStructure(integrationId, file),
    onSuccess: () => {
      // Invalida la caché de las integraciones para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
    },
  });
};

// Hook para eliminar una estructura
export const useDeleteStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (integrationId: number) => deleteStructure(integrationId),
    onSuccess: () => {
      // Invalida la caché de las integraciones para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
    },
  });
};