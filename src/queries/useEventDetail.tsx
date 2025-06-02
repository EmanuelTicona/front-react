import { useQuery } from "@tanstack/react-query";
import { eventDetail, eventDetailByAlertId } from "../api/event_detail";
import { sortDataDesc } from "../utils/filtered";

export const useEventDetail = () => {
    const info = useQuery({
        queryKey: ['event-detail-repo'],
        queryFn: eventDetail,
        select: (data) => {
          return sortDataDesc(data)
        },
      });
    return info;
}

export const useEventDetailByAlertId = (id: number) => {
  return useQuery({
    queryKey: ['event-detail-by-id', id],
    queryFn: () => eventDetailByAlertId(id),
    enabled: id > 0,
  });
};