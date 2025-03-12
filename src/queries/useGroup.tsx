import { useQuery } from "@tanstack/react-query";
import { getGroups } from "../api/group";

export const useGroupsList = () => {
    return useQuery({
        queryKey: ['groups-list'],
        queryFn: getGroups,
    });
};