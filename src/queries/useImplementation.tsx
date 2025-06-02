import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImplementations, editImplementationGroupField, createWebhook, deleteWebhook,
    addStructure, editStructure, deleteStructure, getWebhookToken  } from "../api/implementation";
import { CreateWebhookData } from './../interfaces/implementation/implementation.interface';

// Hook para obtener todas las implementaciones
export const useImplementations = () => {
    return useQuery({
        queryKey: ['implementations'],
        queryFn: getImplementations,
    });
};

// Hook para editar el campo group_field de una implementación
export const useEditImplementationGroupField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, groupField }: { id: number; groupField: string }) =>
            editImplementationGroupField(id, groupField),
        onSuccess: () => {
            // Invalida la caché de las implementaciones para refrescar los datos
            queryClient.invalidateQueries({ queryKey: ['implementations'] });
        },
    });
};

export const useCreateWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWebhookData) => createWebhook(data),
        onSuccess: () => {
            // Invalida la caché de las implementaciones para refrescar los datos
            queryClient.invalidateQueries({ queryKey: ['implementations'] });
        },
    });
};

export const useDeleteWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (webhookName: string) => deleteWebhook(webhookName),
        onSuccess: () => {
            // Invalida la caché de las implementaciones para refrescar los datos
            queryClient.invalidateQueries({ queryKey: ['implementations'] });
        },
    });
};

// Hook para agregar una estructura
export const useAddStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ implementationId, file }: { implementationId: number; file: File }) =>
      addStructure(implementationId, file),
    onSuccess: () => {
      // Invalida la caché de las integraciones para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['implementations-repo'] });
    },
  });
};

// Hook para editar una estructura
export const useEditStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ implementationId, file }: { implementationId: number; file: File }) =>
      editStructure(implementationId, file),
    onSuccess: () => {
      // Invalida la caché de las integraciones para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['implementations-repo'] });
    },
  });
};

// Hook para eliminar una estructura
export const useDeleteStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (implementationId: number) => deleteStructure(implementationId),
    onSuccess: () => {
      // Invalida la caché de las integraciones para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['implementations-repo'] });
    },
  });
};

export const useGetWebhookToken = () => {
  return useMutation({
      mutationFn: (webhookName: string) => getWebhookToken(webhookName),
      onError: (error) => {
          console.error("Error fetching webhook token:", error);
      },
  });
};
