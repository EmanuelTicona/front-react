import { useQuery } from "@tanstack/react-query";
import { getMonitoringTools } from "../api/monitoring_tool";


export const useMonitoringToolsList = () => {
    return useQuery({
        queryKey: ['monitoring-tools-list'],
        queryFn: getMonitoringTools,
    });
};