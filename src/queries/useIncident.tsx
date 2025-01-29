import { useQuery } from "@tanstack/react-query";
import { incident, incidentById } from "../api/incident";
import { sortDataDesc } from "../utils/filtered";

export const useIncidents = () => {
    const info = useQuery({
        queryKey: ['icidents-repo'],
        queryFn: incident,
        select: (data) => {
          return sortDataDesc(data)
        },
      });
    return info;
}

export const useIncidentById = (id: number) => {
  return useQuery({
    queryKey: ['incident-by-id', id],
    queryFn: () => incidentById(id),
    enabled: id > 0,
  });
};