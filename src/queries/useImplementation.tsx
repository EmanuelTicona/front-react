import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImplementations, editImplementationGroupField, createWebhook, deleteWebhook, getGroupMappings, addGroupMapping, deleteGroupMapping } from "../api/implementation";
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
        mutationFn: ({ implementationId, data }: { implementationId: number; data: { identifier: string; group_id: string } }) =>
            addGroupMapping(implementationId, data),
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