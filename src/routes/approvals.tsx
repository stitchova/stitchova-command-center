import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ImageOff, MapPin, Phone, Search, ShieldX, UserCheck, Clock3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { pendingDesigners, type ApprovalStatus, type PendingDesigner, type PortfolioItem } from "@/lib/designer-data";
import { useAdminData } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Pending Approvals · Stitchova Admin" },
      { name: "description", content: "Review designer applications, portfolios and business details before approving them onto Stitchova." },
      { property: "og:title", content: "Pending Approvals · Stitchova Admin" },
      { property: "og:description", content: "Review designer applications, portfolios and business details before approving them onto Stitchova." },
    ],
  }),
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const { decisions, decideApplication } = useAdminData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(pendingDesigners[0]?.id ?? null);

  const stateOf = (id: string): ApprovalStatus => decisions[id]?.status ?? "pending";

  const rows = useMemo(
    () =>
      pendingDesigners.filter((d) => {
        const state = decisions[d.id]?.status ?? "pending";
        if (filter === "pending" && state !== "pending") return false;
        if (query.trim() && !`${d.name} ${d.phone} ${d.id}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
        return true;
      }),
    [decisions, filter, query],
  );

  const selected = rows.find((d) => d.id === selectedId) ?? rows[0] ?? null;
  const pendingCount = pendingDesigners.filter((d) => (decisions[d.id]?.status ?? "pending") === "pending").length;
  const decisionList = Object.values(decisions);
  const approvedCount = decisionList.filter((d) => d.status === "approved").length;
  const rejectedCount = decisionList.filter((d) => d.status === "rejected").length;

  const decide = (designer: PendingDesigner, status: ApprovalStatus, reason?: string) => {
    decideApplication(designer, status, reason);
    if (status === "approved") {
      toast.success("Designer approved. Notification sent.", {
        description: `${designer.name} is now Active — SMS + email sent to ${designer.phone}.`,
      });
    } else {
      toast.error("Designer rejected. Notification sent.", {
        description: reason?.trim()
          ? `Reason shared with ${designer.name}: “${reason.trim()}”`
          : `${designer.name} was notified by SMS + email without a reason.`,
      });
    }
  };

  return (
    <AdminShell
      title="Pending Approvals"
      subtitle="Manual review of designer applications before they go live"
      actions={
        <Link
          to="/users"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <UserCheck className="size-4" strokeWidth={2} />
          View all users
        </Link>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard glass icon={Clock3} label="Awaiting review" value={String(pendingCount)} delta={{ value: "+2", direction: "up", note: "this week" }} />
        <StatCard glass icon={Check} label="Approved this session" value={String(approvedCount)} />
        <StatCard glass icon={ShieldX} label="Rejected this session" value={String(rejectedCount)} />
        <StatCard glass icon={Sparkles} label="Avg. review time" value="1.4 days" delta={{ value: "-0.6 days", direction: "up", note: "vs July" }} />
      </section>

      {/* Filter bar */}
      <div className="solid-card mt-5 flex flex-wrap items-center gap-3 p-3">
        <div className="flex rounded-xl bg-muted p-1">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                filter === f ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "pending" ? "Pending" : "All submissions"}
            </button>
          ))}
        </div>
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone or ID"
            aria-label="Search applications"
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      {/* Dark working panel: queue + review panel */}
      <div className="work-panel mt-5 p-3 lg:p-4">
        <div className="flex items-center justify-between px-2 py-2">
          <h2 className="text-sm font-semibold">Application queue</h2>
          <span className="rounded-full bg-warning/20 px-2.5 py-0.5 text-xs font-medium text-warning">{pendingCount} pending</span>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <ul className="space-y-2">
            {rows.map((d) => {
              const state = stateOf(d.id);
              const active = selected?.id === d.id;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(d.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                      active ? "bg-primary text-primary-foreground" : "bg-panel-elevated/70 hover:bg-panel-elevated",
                    )}
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-full text-xs font-semibold", active ? "bg-primary-foreground/20" : "bg-accent/25 text-panel-foreground")}>
                      {d.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{d.name}</span>
                      <span className={cn("num block truncate text-xs", active ? "text-primary-foreground/75" : "text-panel-muted")}>
                        {d.phone} · submitted {d.submitted}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {d.portfolio.slice(0, 3).map((p) => (
                        <Thumb key={p.id} item={p} className="size-9" />
                      ))}
                      {d.portfolio.length === 0 && (
                        <span className={cn("grid size-9 place-items-center rounded-lg", active ? "bg-primary-foreground/15" : "bg-panel/60 text-panel-muted")}>
                          <ImageOff className="size-4" strokeWidth={1.75} />
                        </span>
                      )}
                      <StatusPill value={state} />
                    </span>
                  </button>
                </li>
              );
            })}
            {rows.length === 0 && (
              <li className="rounded-xl bg-panel-elevated/60 px-4 py-14 text-center text-sm text-panel-muted">
                Queue is clear — no applications waiting.
              </li>
            )}
          </ul>

          {selected ? (
            <ReviewPanel key={selected.id} designer={selected} state={stateOf(selected.id)} onDecide={decide} />
          ) : (
            <div className="work-glass grid min-h-72 place-items-center p-8 text-center text-sm text-panel-muted">
              Select an application to review it.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function ReviewPanel({
  designer,
  state,
  onDecide,
}: {
  designer: PendingDesigner;
  state: ApprovalStatus;
  onDecide: (d: PendingDesigner, status: ApprovalStatus, reason?: string) => void;
}) {
  const [reason, setReason] = useState("");
  const resolved = state !== "pending";

  return (
    <aside className="work-glass p-5">
      <div className="flex items-start gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-accent/25 text-lg font-semibold">
          {designer.initials}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{designer.name}</h3>
          <p className="num text-xs text-panel-muted">{designer.id} · {designer.businessName}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusPill value={state} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-panel/60 px-2.5 py-0.5 text-xs text-panel-muted">
              Submitted {designer.submitted}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Fact label="Years active" value={`${designer.yearsActive} yrs`} />
        <Fact label="Clothing type" value={designer.clothingType} />
        <Fact label="Phone" value={designer.phone} icon={Phone} />
        <Fact label="Location" value={designer.location} icon={MapPin} />
      </div>

      <p className="mt-4 rounded-xl bg-panel/50 p-3 text-sm text-panel-muted">{designer.about}</p>

      <h4 className="mt-5 text-xs font-semibold tracking-wide text-panel-muted uppercase">Portfolio</h4>
      {designer.portfolio.length === 0 ? (
        <p className="mt-2 flex items-center gap-2 rounded-xl bg-warning/15 px-3 py-2.5 text-sm text-warning">
          <ImageOff className="size-4" strokeWidth={1.75} /> No portfolio photos submitted.
        </p>
      ) : (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {designer.portfolio.map((p) => (
            <figure key={p.id}>
              <Thumb item={p} className="aspect-square w-full" />
              <figcaption className="mt-1 truncate text-[11px] text-panel-muted">{p.label}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="mt-5">
        <label htmlFor={`reason-${designer.id}`} className="text-xs font-semibold tracking-wide text-panel-muted uppercase">
          Rejection reason (optional)
        </label>
        <textarea
          id={`reason-${designer.id}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          disabled={resolved}
          placeholder="Shared with the designer and logged internally…"
          className="mt-2 w-full rounded-xl border border-border/40 bg-panel/60 p-3 text-sm text-panel-foreground outline-none placeholder:text-panel-muted focus:ring-2 focus:ring-ring/40 disabled:opacity-50"
        />
      </div>

      {resolved ? (
        <p className="mt-4 rounded-xl bg-panel/60 px-3 py-3 text-sm text-panel-muted">
          {state === "approved"
            ? "Approved — added to the Users list as an Active designer. SMS + email sent."
            : "Rejected — applicant notified by SMS + email. They were not added to Users."}
        </p>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onDecide(designer, "approved")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-medium text-success-foreground transition-opacity hover:opacity-90"
          >
            <Check className="size-4" strokeWidth={2} /> Approve
          </button>
          <button
            type="button"
            onClick={() => onDecide(designer, "rejected", reason)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-destructive/50 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15"
          >
            <ShieldX className="size-4" strokeWidth={2} /> Reject
          </button>
        </div>
      )}
    </aside>
  );
}

function Thumb({ item, className }: { item: PortfolioItem; className?: string }) {
  return (
    <span
      aria-label={item.label}
      className={cn("block rounded-lg ring-1 ring-white/10", className)}
      style={{
        background: `linear-gradient(135deg, oklch(0.62 0.13 ${item.hue}), oklch(0.42 0.08 ${item.hue}))`,
      }}
    />
  );
}

function Fact({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Phone }) {
  return (
    <div className="rounded-xl bg-panel/50 px-3 py-2.5">
      <p className="text-[11px] text-panel-muted">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm font-medium">
        {Icon && <Icon className="size-3.5 shrink-0 text-panel-muted" strokeWidth={1.75} />}
        {value}
      </p>
    </div>
  );
}
