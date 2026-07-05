"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PredictionOutcome } from "@/types";

/**
 * Fetches a prediction for `ticker` and automatically polls until it's
 * ready, using TanStack Query's built-in refetchInterval rather than a
 * hand-rolled setTimeout/useEffect loop. This matters for correctness,
 * not just tidiness: refetchInterval is cancelled automatically on
 * unmount, on query invalidation, and when the interval condition
 * (below) turns false — none of which you get for free with manual
 * timers, and all of which are exactly the kind of thing that turns
 * into a stale-closure or memory-leak bug six weeks from now.
 *
 * The backend responds with a discriminated union (see types/index.ts):
 *   - { status: "ready", data: PredictionResponse }   → done, stop polling
 *   - { status: "training", ..., retryAfterSeconds }  → poll again after
 *     that many seconds, using the SERVER's suggested delay rather than
 *     a hardcoded frontend constant, so backend and ML-API tuning
 *     (see check_again_in_seconds in the Python API) automatically
 *     propagates here with no frontend redeploy needed.
 */
export function usePrediction(ticker: string) {
  const query = useQuery<PredictionOutcome>({
    queryKey: ["prediction", ticker],
    queryFn: async (): Promise<PredictionOutcome> => {
      const res = await api.post("/api/predictions", { ticker });
      if (res.status === 202) {
        return {
          status: "training",
          ticker: res.data.ticker ?? ticker,
          message: res.data.message ?? "Preparing this stock for the first time…",
          retryAfterSeconds: res.data.retryAfterSeconds ?? 20,
        };
      }
      return { status: "ready", data: res.data };
    },
    enabled: !!ticker,
    retry: false,
    // Re-run automatically while training, stop once ready. TanStack Query
    // calls this on every settle, so it re-evaluates fresh data each time —
    // no stale closure over an old retryAfterSeconds value.
    refetchInterval: (q) => {
      const data = q.state.data;
      return data?.status === "training" ? data.retryAfterSeconds * 1000 : false;
    },
  });

  return {
    ...query,
    isTraining: query.data?.status === "training",
    prediction: query.data?.status === "ready" ? query.data.data : undefined,
    trainingMessage: query.data?.status === "training" ? query.data.message : undefined,
  };
}