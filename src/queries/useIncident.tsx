import { useQuery } from "@tanstack/react-query";
import { incident } from "../api/incident";
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