import { AlertCircle, X } from "lucide-react";

interface Props { message: string; onDismiss?: () => void; }

export function ErrorAlert({ message, onDismiss }: Props) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-md bg-danger/8 border border-danger/20 text-danger text-sm">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:opacity-70 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
