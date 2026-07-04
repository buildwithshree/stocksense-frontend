import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("skeleton", className)} />
);

export const PredictionSkeleton = () => (
  <div className="card p-0 overflow-hidden animate-pulse">
    <div className="px-5 py-4 border-b border-border">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-3 w-48" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="px-4 py-3">
          <Skeleton className="h-2.5 w-16 mb-2" />
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
    <div className="px-5 py-4"><Skeleton className="h-24 w-full" /></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2">
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);
