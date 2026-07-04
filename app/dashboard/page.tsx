"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "@/lib/api";
import { PredictionResponse, WatchlistItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { PredictionSkeleton } from "@/components/ui/Skeleton";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Search } from "lucide-react";

export default function DashboardPage() {
  const [ticker, setTicker] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState("");
  const qc = useQueryClient();

  const { data: prediction, isFetching, isError, error: qError } = useQuery<PredictionResponse>({
    queryKey: ["prediction", submitted],
    queryFn: async () => {
      const { data } = await api.post("/api/predictions", { ticker: submitted });
      return data;
    },
    enabled: !!submitted,
    retry: false,
  });

  const { data: watchlist } = useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: async () => { const { data } = await api.get("/api/watchlist"); return data; },
  });

  const saveWatchlist = useMutation({
    mutationFn: (t: string) => api.post(`/api/watchlist`, { ticker: t }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const t = ticker.trim().toUpperCase();
    if (!t) return;
    setError("");
    setSubmitted(t);
  };

  const isSaved = prediction ? watchlist?.some(w => w.ticker === prediction.ticker) : false;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-base font-semibold mb-1">Stock Intelligence</h1>
          <p className="text-xs text-muted">Search any ticker to get ML-powered prediction and risk analysis.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase())}
              className="input pl-8 ticker"
              placeholder="TCS.NS, RELIANCE.NS, AAPL, TSLA…"
              maxLength={20}
            />
          </div>
          <button type="submit" disabled={isFetching || !ticker.trim()} className="btn-primary px-5">
            {isFetching ? "Analysing…" : "Analyse"}
          </button>
        </form>

        {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError("")} /></div>}
        {isError && <div className="mb-4"><ErrorAlert message={getApiErrorMessage(qError)} /></div>}
        {isFetching && <PredictionSkeleton />}
        {prediction && !isFetching && (
          <PredictionCard
            data={prediction}
            onSaveWatchlist={() => saveWatchlist.mutate(prediction.ticker)}
            isSaved={!!isSaved}
            isSaving={saveWatchlist.isPending}
          />
        )}

        {!submitted && (
          <div className="mt-12 text-center text-xs text-muted">
            Supports NSE (TCS.NS), BSE (.BO), and US (AAPL) tickers
          </div>
        )}
      </main>
    </div>
  );
}
