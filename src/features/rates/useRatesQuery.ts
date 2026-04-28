import { useQuery } from "@tanstack/react-query";
import { fetchRates } from "./api";

export function useRatesQuery() {
    return useQuery({
        queryKey: ["rates"],
        queryFn: fetchRates,
    });
}