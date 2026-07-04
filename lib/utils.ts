import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatCurrency = (value: number, currency = "INR"): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const riskColor = (label: string): string => {
  switch (label) {
    case "Low":       return "text-success";
    case "Moderate":  return "text-accent";
    case "High":      return "text-warning";
    case "Very High": return "text-danger";
    default:          return "text-muted";
  }
};

export const riskBg = (label: string): string => {
  switch (label) {
    case "Low":       return "bg-success/10 text-success";
    case "Moderate":  return "bg-accent/10 text-accent";
    case "High":      return "bg-warning/10 text-warning";
    case "Very High": return "bg-danger/10 text-danger";
    default:          return "bg-border text-muted";
  }
};
