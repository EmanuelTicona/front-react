import { useQuery } from "@tanstack/react-query";
import { alert } from "../api/alert";
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