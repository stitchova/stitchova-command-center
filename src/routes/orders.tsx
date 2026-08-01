import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { platformOrders } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders · Stitchova Admin" },
      { name: "description", content: "Platform-wide order pipeline with stage filters and stuck-order flags." },
      { property: "og:title", content: "Orders · Stitchova Admin" },
      { property: "og:description", content: "Platform-wide order pipeline with stage filters and stuck-order flags." },
    ],
  }),
  component: OrdersPage,
});

const stages = ["all", "cutting", "sewing", "fitting", "completed"] as const;

function OrdersPage() {
  const [stage, setStage] = useState<(typeof stages)[number]>("all");
  const [stuckOnly, setStuckOnly] = useState(false);

  const rows = platformOrders.filter(
    (o) => (stage === "all" || o.stage === stage) && (!stuckOnly || o.stuckDays >= 3),
  );

  return (
    <AdminShell title="Orders" subtitle="Every order moving through the platform">
      <div className="solid-card flex flex-wrap items-center gap-3 p-3">
        <div className="flex rounded-xl bg-muted p-1">
          {stages.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                stage === s ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStuckOnly((v) => !v)}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
            stuckOnly
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <AlertTriangle className="size-4" strokeWidth={1.75} />
          Stuck orders only
        </button>
      </div>

      <div className="mt-5 solid-card overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted text-left">
            <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Designer</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Due date</th>
              <th className="px-5 py-3">Flag</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/70">
                <td className="num px-5 py-3 font-medium">{o.id}</td>
                <td className="px-5 py-3">{o.client}</td>
                <td className="px-5 py-3 text-muted-foreground">{o.designer}</td>
                <td className="px-5 py-3"><StatusPill value={o.stage} /></td>
                <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{o.due}</td>
                <td className="px-5 py-3">
                  {o.stuckDays >= 3 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                      <AlertTriangle className="size-3.5" strokeWidth={2} />
                      No update in {o.stuckDays}d
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center text-muted-foreground">No orders match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
