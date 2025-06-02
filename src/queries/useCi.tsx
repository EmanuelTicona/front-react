import { useQuery } from "@tanstack/react-query";
import { getCis } from "../api/ci";

export const useCiList = () => {
    return useQuery({
        queryKey: ['ci-list'],
        queryFn: getCis,
    });
};