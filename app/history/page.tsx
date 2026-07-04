"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PagedResponse, PredictionHistoryItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime, formatCurrency, riskBg } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  const { data, isLoading } = useQuery<PagedResponse<PredictionHistoryItem>>({
    queryKey: ["history"],
    queryFn: async () => { const { data } = await api.get("/api/predictions/history?page=0&size=50"); return data; },
  });

  const items = data?.content ?? [];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-base font-semibold">Prediction History</h1>
          {data && <span className="text-xs text-muted">{data.totalElements} predictions total</span>}
        </div>

        {isLoading ? <TableSkeleton rows={8} /> : !items.length ? (
          <EmptyState icon={Clock} title="No predictions yet"
            description="Your prediction history will appear here after your first search." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {["Ticker", "Date", "Model", "Predicted", "Actual", "Error", "Risk"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td className="px-4 py-3 ticker font-medium">{item.ticker}</td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDateTime(item.generatedAt)}</td>
                    <td className="px-4 py-3 text-xs ticker text-muted">{item.modelName}</td>
                    <td className="px-4 py-3 data-value">{formatCurrency(item.predictedClose)}</td>
                    <td className="px-4 py-3 data-value text-muted">{item.actualClose ? formatCurrency(item.actualClose) : "—"}</td>
                    <td className="px-4 py-3 text-xs">{item.actualErrorPct != null ? `${item.actualErrorPct.toFixed(2)}%` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${riskBg(item.riskLabel)}`}>{item.riskLabel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
