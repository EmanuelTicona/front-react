import { useQuery } from "@tanstack/react-query";
import { getTools } from "../api/tool";


export const useToolsList = () => {
    return useQuery({
        queryKey: ['tools-list'],
        queryFn: getTools,
    });
};