import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
        <Icon size={18} className="text-muted" />
      </div>
      <p className="text-sm font-medium text-ink mb-1">{title}</p>
      <p className="text-xs text-muted max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
