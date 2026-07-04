"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AdminMetrics } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="card px-5 py-4">
    <p className="label mb-1">{label}</p>
    <p className="data-value text-xl font-semibold text-ink">{value}</p>
  </div>
);

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user?.role !== "ADMIN") router.replace("/dashboard");
  }, [user, authLoading, router]);

  const { data, isLoading } = useQuery<AdminMetrics>({
    queryKey: ["admin-metrics"],
    queryFn: async () => { const { data } = await api.get("/api/admin/metrics"); return data; },
    enabled: user?.role === "ADMIN",
    refetchInterval: 30_000,
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-base font-semibold mb-6">Admin — System Metrics</h1>

        {isLoading ? <TableSkeleton rows={4} /> : data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <Stat label="Total Users"       value={data.totalUsers} />
              <Stat label="Total Predictions" value={data.totalPredictions} />
              <Stat label="Last 24h"          value={data.predictionsLast24h} />
              <Stat label="Failed (24h)"      value={data.failedPredictionsLast24h} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Top Tickers</h2>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-surface">
                      <th className="px-4 py-2.5 text-left label">Ticker</th>
                      <th className="px-4 py-2.5 text-left label">Requests</th>
                    </tr></thead>
                    <tbody>
                      {data.topTickers.map(t => (
                        <tr key={t.ticker} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 ticker font-medium">{t.ticker}</td>
                          <td className="px-4 py-2.5 data-value text-muted">{t.requestCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Model Performance</h2>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-surface">
                      <th className="px-4 py-2.5 text-left label">Model</th>
                      <th className="px-4 py-2.5 text-left label">Avg RMSE</th>
                      <th className="px-4 py-2.5 text-left label">Runs</th>
                    </tr></thead>
                    <tbody>
                      {data.modelSummaries.map(m => (
                        <tr key={m.modelName} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 ticker">{m.modelName}</td>
                          <td className="px-4 py-2.5 data-value text-muted">{m.averageRmse?.toFixed(2) ?? "—"}</td>
                          <td className="px-4 py-2.5 data-value text-muted">{m.trainingRuns}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
