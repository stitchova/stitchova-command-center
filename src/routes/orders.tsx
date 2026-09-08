import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, Scissors, Search, User as UserIcon, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { platformOrders, users, type OrderStage } from "@/lib/admin-data";
import { designerProfiles } from "@/lib/designer-data";
import { useAdminData } from "@/lib/admin-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders · Stitchova Admin" },
      { name: "description", content: "Platform-wide order pipeline with stage filters, stuck-order flags and an order detail panel." },
      { property: "og:title", content: "Orders · Stitchova Admin" },
      { property: "og:description", content: "Platform-wide order pipeline with stage filters, stuck-order flags and an order detail panel." },
    ],
  }),
  component: OrdersPage,
});

const stages = ["all", "cutting", "sewing", "fitting", "completed"] as const;
const pipeline: OrderStage[] = ["cutting", "sewing", "fitting", "completed"];

type Order = (typeof platformOrders)[number];

function OrdersPage() {
  const [stage, setStage] = useState<(typeof stages)[number]>("all");
  const [stuckOnly, setStuckOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(platformOrders[0]?.id ?? null);

  const rows = useMemo(
    () =>
      platformOrders.filter(
        (o) =>
          (stage === "all" || o.stage === stage) &&
          (!stuckOnly || o.stuckDays >= 3) &&
          (query.trim() === "" ||
            `${o.id} ${o.client} ${o.designer}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [stage, stuckOnly, query],
  );

  const selected = rows.find((o) => o.id === selectedId) ?? null;

  const inProgress = platformOrders.filter((o) => o.stage !== "completed").length;
  const stuck = platformOrders.filter((o) => o.stuckDays >= 3).length;
  const completed = platformOrders.filter((o) => o.stage === "completed").length;

  return (
    <AdminShell title="Orders" subtitle="Every order moving through the platform">
      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Scissors} label="In progress" value={String(inProgress)} />
        <Stat icon={AlertTriangle} label="Stuck 3+ days" value={String(stuck)} tone="danger" />
        <Stat icon={CheckCircle2} label="Completed" value={String(completed)} />
        <Stat icon={CalendarDays} label="Total orders" value={String(platformOrders.length)} />
      </div>

      {/* Filter bar */}
      <div className="solid-card mt-5 flex flex-wrap items-center gap-3 p-3">
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

        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, client or designer"
            aria-label="Search orders"
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <button
          type="button"
          onClick={() => setStuckOnly((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
            stuckOnly
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <AlertTriangle className="size-4" strokeWidth={1.75} />
          Stuck orders only
        </button>
      </div>

      {/* Two-column working layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="solid-card overflow-hidden">
          <div className="max-h-[calc(100vh-24rem)] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-muted text-left">
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
                  <tr
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    className={cn(
                      "cursor-pointer border-t border-border transition-colors",
                      selectedId === o.id ? "bg-primary/8" : "hover:bg-muted/70",
                    )}
                  >
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
        </div>

        <OrderPanel order={selected} onClose={() => setSelectedId(null)} />
      </div>
    </AdminShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Scissors;
  label: string;
  value: string;
  tone?: "danger";
}) {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          tone === "danger" ? "bg-destructive/12 text-destructive" : "bg-accent/20 text-primary",
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
        <p className="num text-xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function OrderPanel({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) {
    return (
      <aside className="glass-panel grid min-h-72 place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-medium">No order selected</p>
          <p className="mt-1 text-sm text-muted-foreground">Pick a row to inspect the order timeline.</p>
        </div>
      </aside>
    );
  }

  const currentIndex = pipeline.indexOf(order.stage);
  const stuck = order.stuckDays >= 3;
  const designer = users.find((u) => u.name === order.designer);
  const hasProfile = Boolean(designer && designerProfiles[designer.id]);

  return (
    <aside className="glass-panel sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-auto p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/20 text-primary">
          <Scissors className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="num truncate text-base font-semibold">{order.id}</h2>
          <p className="truncate text-xs text-muted-foreground">Due {order.due}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusPill value={order.stage} />
            {stuck && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/12 px-2.5 py-0.5 text-[11px] font-medium text-destructive">
                <AlertTriangle className="size-3" strokeWidth={2} />
                Stuck {order.stuckDays}d
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <dl className="mt-5 space-y-2">
        <Row icon={UserIcon} label="Client" value={order.client} />
        <Row icon={UserIcon} label="Designer" value={order.designer} />
        <Row icon={CalendarDays} label="Due date" value={order.due} />
      </dl>

      <h3 className="mt-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Pipeline</h3>
      <ol className="mt-3 space-y-2">
        {pipeline.map((s, i) => {
          const done = i < currentIndex || order.stage === "completed";
          const active = i === currentIndex && order.stage !== "completed";
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
                active
                  ? stuck
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-primary/40 bg-primary/5"
                  : "border-border bg-card",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                  done ? "bg-primary text-primary-foreground" : active ? "bg-accent/30 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <CheckCircle2 className="size-3.5" strokeWidth={2} /> : i + 1}
              </span>
              <span className="flex-1 capitalize">{s}</span>
              {active && (
                <span className={cn("text-[11px] font-medium", stuck ? "text-destructive" : "text-primary")}>
                  {stuck ? `No update ${order.stuckDays}d` : "In progress"}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {hasProfile && designer && (
        <Link
          to="/designers/$id"
          params={{ id: designer.id }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open designer profile
        </Link>
      )}
    </aside>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="ml-auto truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
