import { useQuery } from "@tanstack/react-query";
import { event, eventByAlertId } from "../api/event";
import { sortDataDesc } from "../utils/filtered";

export const useEvents = () => {
    const info = useQuery({
        queryKey: ['events-repo'],
        queryFn: event,
        select: (data) => {
          return sortDataDesc(data)
        },
      });
    return info;
}

export const useEventByAlertId = (id: number) => {
  return useQuery({
    queryKey: ['event-by-id', id],
    queryFn: () => eventByAlertId(id),
    enabled: id > 0,
  });
};