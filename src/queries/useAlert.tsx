import { useQuery } from "@tanstack/react-query";
import { alert, alertByIncidentId, alertById } from "../api/alert";
import { sortDataDesc } from "../utils/filtered";

export const useAlerts = () => {
    const info = useQuery({
        queryKey: ['alerts-repo'],
        queryFn: alert,
        select: (data) => {
          return sortDataDesc(data)
        },
      });
    return info;
}

export const useAlertByIncidentId = (id: number) => {
  return useQuery({
    queryKey: ['alert-by-incident-id', id],
    queryFn: () => alertByIncidentId(id),
    enabled: id > 0,
  });
};

export const useAlertById = (id: number) => {
  return useQuery({
    queryKey: ['alert-by-id', id],
    queryFn: () => alertById(id),
    enabled: id > 0,
  });
};