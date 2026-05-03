import { useQuery } from "@tanstack/react-query";
import { fetchRates } from "../api";
import type { Rates } from "./types";
import {
  getRatesCacheTtlMilliseconds,
  getRatesCacheTtlMillisecondsForPublishedAt,
} from "../../../shared/lib/rates-cache";

export function useRatesQuery() {
  return useQuery<Rates, Error>({
    queryKey: ["rates"],
    queryFn: fetchRates,
    staleTime: (query) => {
      const data = query.state.data;

      if (!data) {
        return getRatesCacheTtlMilliseconds();
      }

      return getRatesCacheTtlMillisecondsForPublishedAt(data.publishedAt);
    },
  });
}
