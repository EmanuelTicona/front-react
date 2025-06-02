import { useQuery } from "@tanstack/react-query";
import { eventAiops, eventAiopsByAlertId } from "../api/event_aiops";
import { sortDataDesc } from "../utils/filtered";

export const useEventAiops = () => {
    const info = useQuery({
        queryKey: ['event-aiops-repo'],
        queryFn: eventAiops,
        select: (data) => {
          return sortDataDesc(data)
        },
      });
    return info;
}

export const useEventAiopsByAlertId = (id: number) => {
  return useQuery({
    queryKey: ['event-aiops-by-id', id],
    queryFn: () => eventAiopsByAlertId(id),
    enabled: id > 0,
  });
};