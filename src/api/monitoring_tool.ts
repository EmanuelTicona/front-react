import axios from "axios";
import { API_URL } from "../services";
import { MonitoringTool } from "../interfaces/tool/monitoring_tool.interface";

export const getMonitoringTools = async (): Promise<MonitoringTool[]> => {
    const response = await axios.get(API_URL + 'api/data/monitoring_tools');
    return response.data;
};