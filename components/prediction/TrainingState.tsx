import { Loader2 } from "lucide-react";

interface Props {
  ticker: string;
  message: string;
}

/**
 * Shown while the ML API trains a model for a ticker it hasn't seen
 * before (or whose cache expired). usePrediction() re-fetches
 * automatically in the background — this component is purely
 * presentational, no polling logic lives here.
 */
export function TrainingState({ ticker, message }: Props) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Loader2 size={22} className="animate-spin text-accent" />
      <div>
        <p className="text-sm font-medium">
          Preparing <span className="ticker font-semibold">{ticker}</span>
        </p>
        <p className="text-xs text-muted mt-1 max-w-xs mx-auto">{message}</p>
      </div>
    </div>
  );
}