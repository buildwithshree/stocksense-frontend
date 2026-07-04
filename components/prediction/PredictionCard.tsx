"use client";
import { PredictionResponse } from "@/types";
import { RiskGauge } from "./RiskGauge";
import { formatCurrency, formatPercent, formatDateTime, cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Zap, BookMarked } from "lucide-react";

interface Props {
  data: PredictionResponse;
  onSaveWatchlist?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export function PredictionCard({ data, onSaveWatchlist, isSaved, isSaving }: Props) {
  const bullish = data.directionProbability > 0.5;
  const movePos = data.expectedMovePercent >= 0;

  return (
    <div className="card p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="ticker text-lg font-semibold">{data.ticker}</span>
            <span className={cn("badge", bullish ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
              {bullish
                ? <><TrendingUp size={10} className="mr-1" />Bullish</>
                : <><TrendingDown size={10} className="mr-1" />Bearish</>
              }
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5 truncate max-w-[240px]">{data.companyName}</p>
        </div>
        {onSaveWatchlist && (
          <button onClick={onSaveWatchlist} disabled={isSaved || isSaving}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
              isSaved
                ? "border-border text-muted cursor-default"
                : "border-accent text-accent hover:bg-accent hover:text-white"
            )}>
            <BookMarked size={12} />
            {isSaved ? "Saved" : isSaving ? "Saving…" : "Save"}
          </button>
        )}
      </div>

      {/* Main data grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border border-b border-border">
        <DataCell label="Last Close" value={formatCurrency(data.lastClose, data.currency)} />
        <DataCell
          label="Predicted Close"
          value={formatCurrency(data.predictedClose, data.currency)}
          accent />
        <DataCell
          label="Expected Move"
          value={formatPercent(data.expectedMovePercent)}
          positive={movePos} />
        <DataCell
          label="Direction Prob."
          value={`${(data.directionProbability * 100).toFixed(1)}%`}
          positive={bullish} />
      </div>

      {/* Lower section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Confidence band */}
        <div className="px-5 py-4">
          <p className="label">95% Confidence Band</p>
          <p className="data-value text-sm">
            {formatCurrency(data.confidenceLower, data.currency)}
            <span className="text-muted mx-1">–</span>
            {formatCurrency(data.confidenceUpper, data.currency)}
          </p>
        </div>

        {/* Risk gauge — signature element */}
        <div className="px-5 py-4 flex flex-col items-center">
          <p className="label w-full text-center">Risk Score</p>
          <RiskGauge score={data.riskScore} label={data.riskLabel} size={100} />
        </div>

        {/* Top features */}
        <div className="px-5 py-4">
          <p className="label">Key Signals</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.topFeatures.slice(0, 5).map((f) => (
              <span key={f} className="badge bg-surface border border-border text-muted ticker text-2xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — model metadata */}
      <div className="px-5 py-2.5 bg-surface border-t border-border flex flex-wrap gap-x-4 gap-y-1">
        <Meta label="Model" value={`${data.modelName} ${data.modelVersion}`} />
        <Meta label="RMSE" value={data.rmse?.toFixed(2) ?? "—"} />
        <Meta label="Inference" value={`${data.inferenceTimeMs}ms`} />
        <Meta label="Generated" value={formatDateTime(data.generatedAt)} />
      </div>
    </div>
  );
}

const DataCell = ({ label, value, accent, positive }: {
  label: string; value: string; accent?: boolean; positive?: boolean;
}) => (
  <div className="px-4 py-3">
    <p className="label">{label}</p>
    <p className={cn(
      "data-value text-base font-semibold",
      accent ? "text-accent" : positive === true ? "text-success" : positive === false ? "text-danger" : "text-ink"
    )}>{value}</p>
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <span className="text-2xs text-muted">
    <span className="font-medium text-ink/60 uppercase tracking-wide">{label}: </span>
    <span className="ticker">{value}</span>
  </span>
);
