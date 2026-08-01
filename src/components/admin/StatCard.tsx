import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down"; note?: string };
  glass?: boolean;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, delta, glass = false, className }: StatCardProps) {
  const Trend = delta?.direction === "down" ? TrendingDown : TrendingUp;
  return (
    <div className={cn(glass ? "glass-card" : "solid-card", "p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4.5" strokeWidth={1.75} />
        </span>
      </div>
      <p className="num mt-4 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              delta.direction === "up" ? "text-success" : "text-destructive",
            )}
          >
            <Trend className="size-3.5" strokeWidth={2} />
            {delta.value}
          </span>
          {delta.note && <span className="text-muted-foreground">{delta.note}</span>}
        </div>
      )}
    </div>
  );
}
