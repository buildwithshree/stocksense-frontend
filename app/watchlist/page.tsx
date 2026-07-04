"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WatchlistItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { BookMarked, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WatchlistPage() {
  const qc = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: async () => { const { data } = await api.get("/api/watchlist"); return data; },
  });

  const remove = useMutation({
    mutationFn: (ticker: string) => api.delete(`/api/watchlist/${ticker}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-base font-semibold mb-6">Watchlist</h1>
        {isLoading ? <TableSkeleton /> : !data?.length ? (
          <EmptyState icon={BookMarked} title="Your watchlist is empty"
            description="Save a ticker from the dashboard to track it here." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {["Ticker", "Added", ""].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => router.push(`/dashboard?ticker=${item.ticker}`)}
                        className="ticker font-medium text-accent hover:underline">
                        {item.ticker}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(item.addedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove.mutate(item.ticker)}
                        disabled={remove.isPending}
                        className="text-muted hover:text-danger transition-colors">
                        <Trash2 size={14} />
                      </button>
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
