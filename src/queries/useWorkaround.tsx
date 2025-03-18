import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkarounds, getWorkaroundFlowsById, createWorkaround, addWorkaroundFlow, getPipelines, updateFlowSteps } from "../api/workaround";
import { WorkaroundList, WorkaroundFlow } from "../interfaces/workaround/workaround.interface";

// Hook para obtener los workarounds
export const useWorkarounds = (empresa?: string) => {
    return useQuery({
        queryKey: ['workarounds', empresa], // Incluir empresa en la clave de la consulta
        queryFn: () => getWorkarounds(empresa),
    });
};

// Hook para obtener los flows de un workaround por su ID
export const useWorkaroundFlows = (workaroundId: number) => {
    return useQuery({
        queryKey: ['workaroundFlows', workaroundId], // Incluir workaroundId en la clave de la consulta
        queryFn: () => getWorkaroundFlowsById(workaroundId),
        enabled: !!workaroundId, // Solo ejecutar la consulta si workaroundId está definido
    });
};

// Hook para crear un nuevo workaround
export const useCreateWorkaround = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workaroundData: Omit<WorkaroundList, 'id' | 'create_time'>) => createWorkaround(workaroundData),
        onSuccess: () => {
            // Invalidar la consulta de workarounds para actualizar la lista
            queryClient.invalidateQueries({ queryKey: ['workarounds'] });
        },
    });
};

export const useAddWorkaroundFlow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addWorkaroundFlow,
        onSuccess: () => {
            // Invalidar la consulta de flows para actualizar la lista
            queryClient.invalidateQueries({ queryKey: ['workaroundFlows'] });
        },
    });
};

// Hook para actualizar el orden de los pasos de flujo
export const useUpdateFlowSteps = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ workaroundId, steps }: { workaroundId: number; steps: { id: number; nro_paso: number }[] }) =>
            updateFlowSteps(workaroundId, steps),
        onSuccess: (_, variables) => {
            // Invalidar la consulta de flows para actualizar la lista
            queryClient.invalidateQueries({ queryKey: ['workaroundFlows', variables.workaroundId] });
        },
    });
};

export const usePipelines = () => {
    return useQuery({
        queryKey: ['pipelines'],
        queryFn: getPipelines,
    });
};