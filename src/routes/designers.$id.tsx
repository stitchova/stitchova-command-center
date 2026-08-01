import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Receipt,
  RefreshCw,
  ShieldAlert,
  Users as UsersIcon,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { cedis, designerProfiles, type DesignerProfile } from "@/lib/designer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/designers/$id")({
  loader: ({ params }) => {
    const designer = designerProfiles[params.id];
    if (!designer) throw notFound();
    return { designer };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.designer.name ?? "Designer";
    return {
      meta: [
        { title: `${name} · Designer Profile · Stitchova Admin` },
        { name: "description", content: `Subscription, payouts, clients, orders and workers for ${name} on Stitchova.` },
        { property: "og:title", content: `${name} · Designer Profile · Stitchova Admin` },
        { property: "og:description", content: `Subscription, payouts, clients, orders and workers for ${name} on Stitchova.` },
      ],
    };
  },
  component: DesignerDetail,
});

function DesignerDetail() {
  const { designer } = Route.useLoaderData() as { designer: DesignerProfile };
  const [plan, setPlan] = useState(designer.plan);
  const [status, setStatus] = useState(designer.status);
  const [notes, setNotes] = useState(designer.notes);

  return (
    <AdminShell back title={designer.name} subtitle={`${designer.clothingType} · ${designer.location}`}>
      {/* Glass header card — the only glass surface on this page */}
      <section className="glass-panel p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-accent/25 text-2xl font-semibold text-primary">
            {designer.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">{designer.name}</h2>
              <StatusPill value={status} />
              <StatusPill value={plan} />
              <StatusPill value={designer.paystack} />
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-3">
              <Line icon={Phone} value={designer.phone} />
              <Line icon={Mail} value={designer.email} />
              <Line icon={MapPin} value={designer.location} />
              <Line icon={CalendarDays} value={`Signed up ${designer.signupDate}`} />
              <Line icon={RefreshCw} value={`Last active ${designer.lastActive}`} />
              <Line icon={UsersIcon} value={`${designer.yearsActive} years in business`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HeadMetric label="Lifetime revenue" value={cedis(designer.revenueLifetime)} />
            <HeadMetric label="This month" value={cedis(designer.revenueThisMonth)} />
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {/* Subscription */}
          <Card title="Subscription & plan" icon={Wallet}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Current plan" value={plan === "free" ? "Free" : plan === "pro" ? "Pro · ₵180/mo" : "Atelier · ₵420/mo"} />
              <Metric label="Plan start" value={designer.planStart} />
              <Metric label="Next billing" value={designer.nextBilling} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/60 p-3">
              <label htmlFor="plan-override" className="text-sm font-medium">Admin override</label>
              <select
                id="plan-override"
                value={plan}
                onChange={(e) => {
                  const next = e.target.value as DesignerProfile["plan"];
                  setPlan(next);
                  toast.success(`Plan updated to ${next}. Designer notified.`);
                }}
                className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="atelier">Atelier</option>
              </select>
              <button
                type="button"
                onClick={() => toast.success("Plan comped for 3 months. Designer notified.")}
                className="h-9 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Comp 3 months
              </button>
              <p className="text-xs text-muted-foreground">Manual upgrade, downgrade or comp — logged against your admin account.</p>
            </div>

            <Table
              head={["Reference", "Date", "Amount", "Status"]}
              empty="No subscription payments yet — designer is on the free plan."
              rows={designer.subscriptionPayments.map((p) => [
                <span key="i" className="num font-medium">{p.id}</span>,
                <span key="d" className="text-muted-foreground">{p.date}</span>,
                <span key="a" className="num font-medium">{cedis(p.amount)}</span>,
                <StatusPill key="s" value={p.status} />,
              ])}
            />
          </Card>

          {/* Revenue & payouts */}
          <Card title="Revenue & payouts" icon={Banknote}>
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Lifetime processed" value={cedis(designer.revenueLifetime)} />
              <Metric label="This month" value={cedis(designer.revenueThisMonth)} />
              <Metric label="Platform commission" value={cedis(designer.commissionEarned)} />
              <div className="rounded-xl border border-border bg-card px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">Paystack subaccount</p>
                <div className="mt-1.5"><StatusPill value={designer.paystack} /></div>
              </div>
            </div>
            {designer.paystack === "not_connected" && (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-warning/15 px-3 py-2.5 text-sm text-warning-foreground">
                <AlertTriangle className="size-4 text-warning" strokeWidth={2} />
                Payouts are on hold — this designer cannot receive split payments until their subaccount is connected.
              </p>
            )}
            <Table
              head={["Reference", "Date", "Client", "Amount", "Designer share", "Commission", "Status"]}
              empty="No client transactions yet."
              rows={designer.clientTransactions.map((t) => [
                <span key="i" className="num font-medium">{t.id}</span>,
                <span key="d" className="text-muted-foreground">{t.date}</span>,
                <span key="c">{t.client}</span>,
                <span key="a" className="num font-medium">{cedis(t.amount)}</span>,
                <span key="s" className="num text-muted-foreground">{cedis(t.designerShare)}</span>,
                <span key="m" className="num font-medium text-primary">{cedis(t.commission)}</span>,
                <StatusPill key="st" value={t.status} />,
              ])}
            />
          </Card>

          {/* Clients & orders */}
          <Card title="Clients & orders" icon={UsersIcon}>
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Clients</h4>
                <ul className="space-y-2">
                  {designer.clients.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/20 text-[11px] font-semibold text-primary">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.name}</p>
                        <p className="num text-[11px] text-muted-foreground">{c.orders} orders · last {c.lastOrder}</p>
                      </div>
                    </li>
                  ))}
                  {designer.clients.length === 0 && <li className="text-sm text-muted-foreground">No clients yet.</li>}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Orders</h4>
                <ul className="space-y-2">
                  {designer.orders.map((o) => {
                    const stuck = o.daysSinceUpdate >= 14;
                    return (
                      <li
                        key={o.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5",
                          stuck ? "border-destructive/40 bg-destructive/5" : "border-border",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                            {stuck && <AlertTriangle className="size-3.5 shrink-0 text-destructive" strokeWidth={2} />}
                            {o.garment}
                          </p>
                          <p className="num text-[11px] text-muted-foreground">
                            {o.id} · {o.client} · due {o.due}
                            {stuck && <span className="text-destructive"> · no update in {o.daysSinceUpdate} days</span>}
                          </p>
                        </div>
                        <StatusPill value={o.stage} />
                      </li>
                    );
                  })}
                  {designer.orders.length === 0 && <li className="text-sm text-muted-foreground">No orders yet.</li>}
                </ul>
              </div>
            </div>
          </Card>

          {/* Workers */}
          <Card title="Workers" icon={Receipt}>
            <Table
              head={["Worker", "Role", "Status"]}
              empty="No workers registered under this designer."
              rows={designer.workers.map((w) => [
                <span key="n" className="font-medium">{w.name}</span>,
                <span key="r" className="text-muted-foreground">{w.role}</span>,
                <StatusPill key="s" value={w.status} />,
              ])}
            />
          </Card>
        </div>

        {/* Admin actions */}
        <aside className="solid-card h-fit p-5 xl:sticky xl:top-28">
          <h3 className="text-sm font-semibold">Admin actions</h3>
          <p className="mt-1 text-xs text-muted-foreground">Staff-only controls. Actions are logged.</p>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => {
                const next = status === "suspended" ? "active" : "suspended";
                setStatus(next);
                toast[next === "suspended" ? "error" : "success"](
                  next === "suspended" ? "Account suspended. Notification sent." : "Account reinstated. Notification sent.",
                );
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <ShieldAlert className="size-4" strokeWidth={1.75} />
              {status === "suspended" ? "Reinstate account" : "Suspend account"}
            </button>
            <button
              type="button"
              onClick={() => toast.success("Approval email resent.", { description: `Sent to ${designer.email}.` })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Mail className="size-4" strokeWidth={1.75} />
              Resend approval email
            </button>
            <Link
              to="/users"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Back to users
            </Link>
          </div>

          <div className="mt-5">
            <label htmlFor="internal-notes" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Internal notes
            </label>
            <p className="mt-1 text-[11px] text-muted-foreground">Private to staff — never shown to the designer.</p>
            <textarea
              id="internal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Log support calls, payout issues, escalations…"
              className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="button"
              onClick={() => toast.success("Internal note saved.")}
              className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Save note
            </button>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

function Line({ icon: Icon, value }: { icon: typeof Phone; value: string }) {
  return (
    <span className="flex items-center gap-2 truncate">
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      <span className="truncate text-foreground">{value}</span>
    </span>
  );
}

function HeadMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="num mt-0.5 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: typeof Wallet; children: React.ReactNode }) {
  return (
    <section className="solid-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" strokeWidth={1.75} />
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted text-left">
          <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-t border-border hover:bg-muted/60">
              {cells.map((c, j) => (
                <td key={j} className="px-4 py-2.5 whitespace-nowrap">{c}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={head.length} className="px-4 py-8 text-center text-muted-foreground">{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
