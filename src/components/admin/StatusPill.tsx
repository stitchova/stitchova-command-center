import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "primary";

const toneClass: Record<Tone, string> = {
  neutral: "bg-secondary text-secondary-foreground ring-border",
  primary: "bg-primary/12 text-primary ring-primary/25",
  success: "bg-success/12 text-success ring-success/25",
  warning: "bg-warning/18 text-warning-foreground ring-warning/35",
  danger: "bg-destructive/12 text-destructive ring-destructive/25",
  info: "bg-info/12 text-info ring-info/25",
};

const map: Record<string, { label: string; tone: Tone }> = {
  // account status
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  suspended: { label: "Suspended", tone: "danger" },
  // plans
  free: { label: "Free", tone: "neutral" },
  pro: { label: "Pro", tone: "primary" },
  atelier: { label: "Atelier", tone: "info" },
  // payments
  paid: { label: "Paid", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
  refunded: { label: "Refunded", tone: "neutral" },
  // order stages
  cutting: { label: "Cutting", tone: "warning" },
  sewing: { label: "Sewing", tone: "info" },
  fitting: { label: "Fitting", tone: "primary" },
  completed: { label: "Completed", tone: "success" },
  // severity
  high: { label: "High", tone: "danger" },
  medium: { label: "Medium", tone: "warning" },
  low: { label: "Low", tone: "neutral" },
  // roles
  designer: { label: "Designer", tone: "primary" },
  client: { label: "Client", tone: "info" },
  worker: { label: "Worker", tone: "neutral" },
};

export function StatusPill({ value, className }: { value: string; className?: string }) {
  const cfg = map[value] ?? { label: value, tone: "neutral" as Tone };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        toneClass[cfg.tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}
