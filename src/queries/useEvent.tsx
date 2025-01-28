import { useQuery } from "@tanstack/react-query";
import { event } from "../api/event";
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